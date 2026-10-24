"""Diagnostic test for AgriAssist's data.gov.in API connection.

Place this file beside app.py and .env, then run:
    python test_data_gov_api.py
The script never prints your API key.
"""
import os
import time

import requests
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("DATA_GOV_API_KEY", "").strip()
if not api_key:
    print("ERROR: DATA_GOV_API_KEY was not found.")
    print("Check that .env is beside this script and has DATA_GOV_API_KEY=your_key")
    raise SystemExit(1)

url = "https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24"
params = {
    "api-key": api_key,
    "format": "json",
    "limit": 10,
    "offset": 0,
    "filters[State]": "Maharashtra",
    "filters[District]": "Nashik",
    "sort[Arrival_Date]": "desc",
}
headers = {
    "User-Agent": "Mozilla/5.0",
    "Accept": "application/json",
}

print("Testing data.gov.in from Python (API key will not be displayed)...")
started = time.monotonic()
try:
    response = requests.get(
        url,
        params=params,
        headers=headers,
        timeout=(10, 30),
    )
    elapsed = time.monotonic() - started
    print(f"HTTP status: {response.status_code}")
    print(f"Response time: {elapsed:.1f} seconds")
    print(f"Content type: {response.headers.get('content-type', 'unknown')}")

    try:
        payload = response.json()
    except ValueError:
        print("Response preview:", response.text[:500])
        raise SystemExit(0)

    print(f"API status: {payload.get('status', 'not provided')}")
    print(f"Record count returned: {payload.get('count', len(payload.get('records', [])))}")
    print("First 3 records:")
    for record in payload.get("records", [])[:3]:
        print({key: record.get(key) for key in (
            "Arrival_Date", "Commodity", "Market", "Modal_Price", "State", "District"
        )})
    if response.status_code >= 400:
        print("API message:", payload.get("message", payload.get("error", "No error message provided")))

except requests.Timeout as exc:
    elapsed = time.monotonic() - started
    print(f"PYTHON REQUEST TIMED OUT after {elapsed:.1f} seconds.")
    print("The API URL/key may work in Chrome but Python did not receive a timely response.")
    print("Exception type:", type(exc).__name__)
except requests.RequestException as exc:
    print("REQUEST ERROR:", type(exc).__name__)
    print("Details:", str(exc)[:500])
