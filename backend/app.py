from flask import Flask, request, jsonify, render_template
from market_prices_api import register_market_price_routes
from flask_cors import CORS
import mysql.connector
from google import genai
from ml_models import AgriML
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://127.0.0.1:5501",
            "http://localhost:5501",
            "http://127.0.0.1:5500",
            "http://localhost:5500"
        ]
    }
})

register_market_price_routes(app)

# System Configurations - Paste your actual Gemini API Key here
client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

# Connect to your MySQL Database (Update password if needed)
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password=os.getenv("MYSQL_PASSWORD"),
    database="agriassist_db"
)
ml_engine = AgriML(db)
@app.route('/api/crops', methods=['GET'])
def get_crops():
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute(
            "SELECT crop_id, crop_name FROM crops ORDER BY crop_name"
        )
        crops = cursor.fetchall()
        return jsonify({"crops": crops})
    finally:
        cursor.close()
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json(silent=True) or {}
    user_query = data.get('query', '').strip()

    if not user_query:
        return jsonify({"error": "Please enter a question."}), 400

    try:
        response = client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=(
                "You are AgriAssist, a helpful agriculture chatbot. "
                "Answer the farmer's question in simple language: "
                + user_query
            )
        )

        if not response.text:
            return jsonify({
                "error": "The chatbot returned an empty response."
            }), 502

        return jsonify({"answer": response.text})

    except Exception:
        app.logger.exception("Gemini chatbot request failed")
        return jsonify({
            "error": (
                "The chatbot could not respond. "
                "Please check the Gemini API project and API key."
            )
        }), 502

@app.route('/api/predict', methods=['GET'])
def predict_price():
    crop_id = request.args.get('crop_id')
    price = ml_engine.predict_price(int(crop_id))
    return jsonify({"predicted_price": price})

@app.route('/api/recommend', methods=['POST'])
def recommend():
    data = request.json
    crop = ml_engine.recommend_crop(data['temp'], data['rain'], data['humidity'])
    return jsonify({"recommended_crop": crop})

if __name__ == '__main__':
    app.run(debug=True)
