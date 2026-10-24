
import os
import re
from collections import defaultdict
from datetime import datetime, timedelta
from math import isfinite

import requests
from dotenv import load_dotenv
from flask import jsonify, request

load_dotenv()

RESOURCE_URL = (
    "https://api.data.gov.in/resource/"
    "35985678-0d79-46b4-9ed6-6f13308a1d24"
)

REQUEST_HEADERS = {
    "User-Agent": "Mozilla/5.0",
    "Accept": "application/json",
}
REQUEST_TIMEOUT = (10, 30)


def parse_arrival_date(value):
    if not value:
        return None

    for date_format in ("%d/%m/%Y", "%d-%m-%Y", "%Y-%m-%d"):
        try:
            return datetime.strptime(str(value).strip(), date_format)
        except ValueError:
            continue

    return None


def normalize_commodity(value):
    return re.sub(r"[^a-z0-9]", "", str(value or "").casefold())


def commodity_matches(record_name, selected_name):
    selected = normalize_commodity(selected_name)
    record = normalize_commodity(record_name)

    if not selected:
        return False

    if record == selected:
        return True

    # Allow a selected crop such as "Grapes" to match
    # a dataset label such as "Grapes (Green)".
    base_name = str(record_name or "").split("(", 1)[0].strip()
    return normalize_commodity(base_name) == selected


def fetch_api_page(api_key, state, district, limit=100,
                   offset=0, commodity=None):
    params = {
        "api-key": api_key,
        "format": "json",
        "limit": limit,
        "offset": offset,
        "filters[State]": state,
        "filters[District]": district,
        "sort[Arrival_Date]": "desc",
    }

    if commodity:
        params["filters[Commodity]"] = commodity

    response = requests.get(
        RESOURCE_URL,
        params=params,
        headers=REQUEST_HEADERS,
        timeout=REQUEST_TIMEOUT,
    )

    if response.status_code == 403:
        raise PermissionError(
            "data.gov.in denied API access. Check your API key."
        )

    response.raise_for_status()
    data = response.json()

    if not isinstance(data, dict):
        raise ValueError("The government API returned an invalid response.")

    records = data.get("records", [])
    if not isinstance(records, list):
        records = []

    return data, records


def register_market_price_routes(app):

    @app.route("/api/market-prices", methods=["GET"])
    def get_market_prices():
        api_key = os.getenv("DATA_GOV_API_KEY", "").strip()

        if not api_key:
            return jsonify({
                "error": "DATA_GOV_API_KEY is missing from your backend .env file."
            }), 500

        state = request.args.get("state", "Maharashtra").strip()
        district = request.args.get("district", "Nashik").strip()
        commodity = request.args.get("commodity", "").strip()

        try:
            limit = int(request.args.get("limit", "20"))
        except (TypeError, ValueError):
            limit = 20

        limit = max(1, min(limit, 100))

        if not state or not district:
            return jsonify({
                "error": "State and district are required."
            }), 400

        try:
            data, records = fetch_api_page(
                api_key=api_key,
                state=state,
                district=district,
                limit=limit,
                offset=0,
                commodity=commodity or None,
            )

            records.sort(
                key=lambda item: (
                    parse_arrival_date(item.get("Arrival_Date"))
                    or datetime.min
                ),
                reverse=True,
            )

            return jsonify({
                "source": "data.gov.in",
                "title": data.get(
                    "title",
                    "Variety-wise Daily Market Prices Data of Commodity",
                ),
                "state": state,
                "district": district,
                "commodity": commodity or None,
                "count": len(records),
                "records": records,
            })

        except PermissionError as exc:
            return jsonify({"error": str(exc)}), 502
        except requests.Timeout:
            return jsonify({
                "error": "The market-price API timed out. Please try again."
            }), 504
        except requests.RequestException:
            app.logger.exception("Market-price API request failed")
            return jsonify({
                "error": "Unable to retrieve prices from data.gov.in."
            }), 502
        except ValueError:
            app.logger.exception("Invalid market-price API response")
            return jsonify({
                "error": "The market-price API returned invalid JSON."
            }), 502

    @app.route("/api/predict-live", methods=["GET"])
    def predict_live_market_price():
        api_key = os.getenv("DATA_GOV_API_KEY", "").strip()

        if not api_key:
            return jsonify({
                "error": "DATA_GOV_API_KEY is missing from your backend .env file."
            }), 500

        state = request.args.get("state", "").strip()
        district = request.args.get("district", "").strip()
        commodity = request.args.get("commodity", "").strip()

        if not state or not district or not commodity:
            return jsonify({
                "error": "Commodity, state and district are required."
            }), 400

        # Keep distinct records only, avoiding duplicates when retrying
        # different capitalisations of the commodity name.
        matched_records = {}
        available_commodities = set()

        def collect_records(records):
            for record in records:
                record_name = str(record.get("Commodity", "")).strip()

                if record_name:
                    available_commodities.add(record_name)

                if not commodity_matches(record_name, commodity):
                    continue

                arrival_date = parse_arrival_date(
                    record.get("Arrival_Date")
                )
                if arrival_date is None:
                    continue

                try:
                    price = float(
                        str(record.get("Modal_Price", ""))
                        .replace(",", "")
                        .strip()
                    )
                except (TypeError, ValueError):
                    continue

                if not isfinite(price) or price < 0:
                    continue

                key = (
                    arrival_date,
                    price,
                    str(record.get("Market", "")).strip().casefold(),
                    str(record.get("Variety", "")).strip().casefold(),
                )
                matched_records[key] = (arrival_date, price)

        def distinct_dates():
            return {day for day, _ in matched_records.values()}

        try:
            # First try the selected name and common capitalisations.
            variants = list(dict.fromkeys([
                commodity,
                commodity.title(),
                commodity.upper(),
            ]))

            for variant in variants:
                for offset in range(0, 501, 100):
                    _, records = fetch_api_page(
                        api_key=api_key,
                        state=state,
                        district=district,
                        limit=100,
                        offset=offset,
                        commodity=variant,
                    )

                    collect_records(records)

                    if len(distinct_dates()) >= 5:
                        break

                    if len(records) < 100:
                        break

                if len(distinct_dates()) >= 5:
                    break

            # If the exact commodity filter found insufficient history,
            # scan recent district records and match the crop locally.
            if len(distinct_dates()) < 2:
                for offset in range(0, 2001, 100):
                    _, records = fetch_api_page(
                        api_key=api_key,
                        state=state,
                        district=district,
                        limit=100,
                        offset=offset,
                    )

                    collect_records(records)

                    if len(distinct_dates()) >= 3:
                        break

                    if len(records) < 100:
                        break

        except PermissionError as exc:
            return jsonify({"error": str(exc)}), 502
        except requests.Timeout:
            return jsonify({
                "error": "data.gov.in timed out while retrieving crop history."
            }), 504
        except requests.RequestException:
            app.logger.exception("Live prediction API request failed")
            return jsonify({
                "error": "Could not retrieve crop history from data.gov.in."
            }), 502
        except ValueError:
            app.logger.exception("Invalid live prediction API response")
            return jsonify({
                "error": "data.gov.in returned invalid JSON."
            }), 502

        if not matched_records:
            return jsonify({
                "error": (
                    f"No usable market records were found for '{commodity}' "
                    f"in {district}, {state}. Check the commodity name "
                    "against data.gov.in."
                ),
                "records_used": 0,
                "available_commodities": sorted(
                    available_commodities,
                    key=str.casefold,
                )[:30],
            }), 404

        # Average modal prices for the same commodity across markets
        # on each date, then calculate a simple linear time trend.
        prices_by_date = defaultdict(list)

        for arrival_date, price in matched_records.values():
            prices_by_date[arrival_date].append(price)

        daily_prices = sorted(
            (
                day,
                sum(prices) / len(prices),
            )
            for day, prices in prices_by_date.items()
        )

        if len(daily_prices) < 2:
            latest_date, latest_price = daily_prices[-1]

            return jsonify({
                "error": (
                    f"Only one distinct arrival date was found for "
                    f"'{commodity}' in {district}, {state}. "
                    "At least two dates are needed to calculate a trend."
                ),
                "latest_date": latest_date.strftime("%d/%m/%Y"),
                "latest_market_price": round(latest_price, 2),
                "records_used": len(matched_records),
                "dates_used": len(daily_prices),
            }), 422

        first_date = daily_prices[0][0]
        xs = [(day - first_date).days for day, _ in daily_prices]
        ys = [price for _, price in daily_prices]

        mean_x = sum(xs) / len(xs)
        mean_y = sum(ys) / len(ys)

        denominator = sum((x - mean_x) ** 2 for x in xs)

        if denominator == 0:
            return jsonify({
                "error": "Not enough distinct dates to calculate a trend."
            }), 422

        slope = sum(
            (x - mean_x) * (y - mean_y)
            for x, y in zip(xs, ys)
        ) / denominator

        latest_date, latest_average = daily_prices[-1]
        forecast_date = latest_date + timedelta(days=7)
        forecast_x = (forecast_date - first_date).days

        predicted_price = max(
            0.0,
            mean_y + slope * (forecast_x - mean_x),
        )

        return jsonify({
            "source": "data.gov.in",
            "commodity": commodity,
            "state": state,
            "district": district,
            "predicted_price": round(predicted_price, 2),
            "latest_market_price": round(latest_average, 2),
            "latest_date": latest_date.strftime("%d/%m/%Y"),
            "forecast_for": forecast_date.strftime("%d/%m/%Y"),
            "records_used": len(matched_records),
            "dates_used": len(daily_prices),
            "message": (
                f"Seven-day trend estimate for {commodity} in "
                f"{district}, {state}. Latest average modal price: "
                f"{latest_average:,.2f} on "
                f"{latest_date.strftime('%d/%m/%Y')}. "
                f"Forecast date: {forecast_date.strftime('%d/%m/%Y')}. "
                "This is an indicative linear-trend estimate, "
                "not a guaranteed future price."
            ),
        })
