import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.neural_network import MLPClassifier

class AgriML:
    def __init__(self, db_connection):
        
        self.conn = db_connection

    def predict_price(self, crop_id):
        # Fetch historical data for linear regression
        query = f"SELECT recorded_date, price FROM market_prices WHERE crop_id = {crop_id}"
        df = pd.read_sql(query, self.conn)
        
        if len(df) < 2: return "Insufficient data"

        df['recorded_date'] = pd.to_datetime(df['recorded_date'])
        df['day_num'] = (df['recorded_date'] - df['recorded_date'].min()).dt.days

        X = df[['day_num']]
        y = df['price']

        model = LinearRegression()
        model.fit(X, y)

        # Predict next week's price (7 days from latest entry)
        next_date = df['day_num'].max() + 7
        predicted = model.predict([[next_date]])[0]
        return round(float(predicted), 2)

    def recommend_crop(self, temp, rain, humidity):
        # Neural Network mapping weather variables to crop matches
        X_train = np.array([
            [25.0, 200.0, 80.0],  # Matches Rice
            [20.0, 75.0, 50.0],   # Matches Wheat
            [30.0, 150.0, 60.0]   # Matches Sugarcane
        ])
        y_train = np.array(['Rice', 'Wheat', 'Sugarcane'])

        clf = MLPClassifier(hidden_layer_sizes=(16, 8), max_iter=1000)
        clf.fit(X_train, y_train)

        prediction = clf.predict([[temp, rain, humidity]])
        return prediction[0]