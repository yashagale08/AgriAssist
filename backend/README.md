# AgriAssist Backend

The AgriAssist backend powers the agriculture assistant using Flask, machine learning, MySQL, the Gemini API, and government agricultural market-price data.

## Features

- **Crop Recommendation:** Recommends crops based on the input features supported by the trained model.
- **Crop Price Prediction:** Predicts crop prices using the project's machine learning functionality and available market-price records.
- **AI Agriculture Chatbot:** Uses Google's Gemini API to answer agriculture-related questions.
- **Government Market Price Integration:** Retrieves agricultural market-price data from India's Data.gov.in platform.
- **Database Integration:** Uses MySQL to store and retrieve application data.
- **Prediction History:** Supports the application's prediction-history functionality.

## Project Files

- `app.py` — Main Flask application and API endpoints.
- `ml_models.py` — Machine learning models and prediction functionality.
- `market_prices_api.py` — Integration with the Data.gov.in market-price API.
- `seed_all_tabels.py` — Database seeding script.
- `requirements.txt` — Python dependencies.

## Technologies Used

- Python
- Flask
- Flask-CORS
- Pandas and NumPy
- Scikit-learn
- MySQL
- Google Gemini API
- Requests
- Python dotenv

## Requirements

Before running the backend, install or configure:

- Python
- MySQL Server
- A Gemini API key for chatbot functionality
- A Data.gov.in API key if required by your API configuration

## Installation

Open a terminal inside the `backend` folder.

### 1. Install dependencies

```bash
python -m pip install -r requirements.txt
```

### 2. Configure environment variables

Create a local file named `.env` inside the `backend` folder.

Add your own credentials using the variable names expected by the application. For example:

```text
GEMINI_API_KEY=your_gemini_api_key
```

If the Data.gov.in integration requires an API key, configure it using the environment variable name expected by `market_prices_api.py`.

Replace example values with your own credentials. Never upload your `.env` file or API keys to GitHub.

### 3. Configure the database

1. Make sure MySQL Server is running.
2. Use the SQL script in the project's `database` folder to create the required database and tables.
3. Configure the database connection using the settings expected by the application.
4. Keep database passwords private.

### 4. Start the backend

Run:

```bash
python app.py
```

When configured correctly, the local Flask server should start at:

```text
http://127.0.0.1:5000
```

Keep the terminal open while using the application.

## Government Agricultural Market Price API

AgriAssist integrates with [Data.gov.in](https://www.data.gov.in/), the Government of India's open-data platform, to retrieve agricultural market-price information.

The configured resource is:

`35985678-0d79-46b4-9ed6-6f13308a1d24`

The resource provides agricultural market records with fields that can include:

- Arrival date
- Commodity
- Variety and grade
- State and district
- Market
- Minimum price
- Maximum price
- Modal price

The API's available records depend on the resource, query parameters, and current data availability. The integration is intended to use market data from different locations rather than being limited to a single market.

Data.gov.in provides the source data; actual crop-price predictions depend on the project's implemented model and the historical records available to it.

For more information, visit [Data.gov.in](https://www.data.gov.in/).

## Running the API Test

The project includes a test script:

`tests/test_data_gov_api_fixed.py`

Run it from the project root when its dependencies and required configuration are available:

```bash
python tests/test_data_gov_api_fixed.py
```

## Security

- Never commit `.env` files, API keys, database passwords, or other secrets.
- Use your own credentials when setting up the project.
- Keep private configuration files out of the public repository.
- If a credential is accidentally published, revoke or rotate it.

## Notes

The frontend is maintained separately in the `frontend` folder. The database schema is in `database`, while datasets are maintained in `datasets`.

Refer to the main project `README.md` for the overall project description and setup instructions.
