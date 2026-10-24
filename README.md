# 🌱 AgriAssist — Smart Agriculture Assistant

AgriAssist is a smart agriculture assistance project designed to help farmers make informed farming decisions using machine learning, market price data, and an interactive chatbot.

## 🚀 Features

- **Crop Recommendation:** Recommends suitable crops based on agricultural input data.
- **Crop Price Prediction:** Estimates crop prices using machine learning and historical market prices.
- **AI Chatbot:** Provides an interactive interface for agriculture-related questions.
- **Market Price Data:** Integrates agricultural market data from the Government of India's data.gov.in API.
- **Database Integration:** Uses MySQL to store and manage project data.
- **Web Interface:** Provides a frontend built with HTML, CSS, and JavaScript.

## 🛠️ Technologies Used

- Python
- Flask
- HTML, CSS, JavaScript
- Machine Learning with scikit-learn
- MySQL
- REST APIs
- Government of India data.gov.in API

## 📁 Project Files

- `app.py` — Flask backend and API routes
- `ml_models.py` — Machine learning functionality
- `market_prices_api.py` — Market price API integration
- `database.sql` — Database schema
- `index.html` — Web interface
- `style.css` — Frontend styling
- `script.js` — Frontend functionality
- `Crop_recommendation.csv` — Crop recommendation dataset
- `crop_production_data.csv` — Crop production dataset
- `soil_analysis_data.csv` — Soil analysis dataset
- `water_usage_data.csv` — Water usage dataset

## ⚙️ Setup

1. Install Python 3.
2. Install the required Python packages using `requirements.txt` once it has been created.
3. Configure the MySQL database using `database.sql`.
4. Add the required API credentials to a local `.env` file.
5. Start the Flask backend using:

   ```bash
   python app.py
   ```

6. Open `index.html` in a local development server to access the frontend.

## 🔐 Security

Never commit API keys, passwords, database credentials, or your `.env` file to GitHub.

## 👨‍💻 Project Purpose

AgriAssist is an educational project exploring how machine learning, web development, and agricultural data can be combined to support smarter farming decisions.
