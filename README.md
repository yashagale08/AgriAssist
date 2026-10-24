# 🌱 AgriAssist — Smart Agriculture Assistant

AgriAssist is a smart agriculture assistance web application that combines machine learning, agricultural market price data, and an AI chatbot to help users explore data-driven farming decisions.

## 🚀 Features

- **Crop Recommendation:** Recommends crops based on agricultural input conditions.
- **Crop Price Prediction:** Estimates crop prices using machine learning and market price data.
- **AI Agriculture Chatbot:** Answers agriculture-related questions through an interactive chat interface.
- **Government Market Price Integration:** Retrieves agricultural market price data through the Government of India's Data.gov.in API.
- **MySQL Database:** Stores and manages application data.
- **Prediction History:** Displays previous predictions.
- **Multilingual Interface:** Supports English, Hindi, and Marathi.
- **Web Dashboard:** Provides a user-friendly interface built with HTML, CSS, and JavaScript.

## 🛠️ Technologies Used

- Python
- Flask and Flask-CORS
- HTML5, CSS3, and JavaScript
- Scikit-learn
- MySQL
- REST APIs
- Data.gov.in agricultural market price API
- Gemini API for chatbot functionality

## 📁 Project Structure

```text
AgriAssist/
├── backend/
│   ├── app.py
│   ├── ml_models.py
│   ├── market_prices_api.py
│   ├── requirements.txt
│   └── README.md
├── database/
│   ├── database.sql
│   └── README.md
├── datasets/
│   ├── Crop_recommendation.csv
│   ├── crop_production_data.csv
│   ├── soil_analysis_data.csv
│   ├── water_usage_data.csv
│   └── README.md
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── README.md
├── tests/
│   ├── test_data_gov_api_fixed.py
│   └── README.md
├── .gitignore
└── README.md
```

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yashagale08/AgriAssist.git
cd AgriAssist
```

### 2. Install Backend Dependencies

```bash
pip install -r backend/requirements.txt
```

### 3. Configure Environment Variables

Create a local `.env` file in the appropriate backend directory and configure the required API key and database settings according to your backend code.

**Security:** Never upload `.env` files, API keys, or database passwords to GitHub.

### 4. Configure the Database

Use the SQL script in `database/database.sql` to create and configure the MySQL database.

Ensure your MySQL server is running and the backend database settings match your configuration.

### 5. Start the Backend

Follow the backend instructions in `backend/README.md`. Run the Flask application from the directory expected by your project.

### 6. Start the Frontend

Open the `frontend` folder in Visual Studio Code and launch `index.html` using the Live Server extension.

Make sure the frontend API address matches the running backend address.

## 🌾 Government Agricultural Market Data

AgriAssist integrates with the Data.gov.in agricultural market price API to retrieve available commodity market records. The data can include commodity, market, state, district, arrival date, and minimum, maximum, and modal prices, depending on the returned records.

Data availability depends on the external API.

## 🎯 Project Purpose

This educational project explores how machine learning, web development, database management, and public agricultural data can be combined in an agriculture assistance application.

## 👨‍💻 Author

**Yash Agale**

GitHub: [@yashagale08](https://github.com/yashagale08)

---

If you find this project interesting, feel free to explore the repository and its individual components.
