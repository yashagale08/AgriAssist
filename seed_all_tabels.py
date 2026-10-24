import random
from datetime import datetime, timedelta
from sqlalchemy import create_engine, text, inspect

def seed_remaining_tables():
    db_user = "root"
    db_password = "TX_dexter" # UPDATE THIS WITH YOUR PASSWORD
    db_name = "agriassist_db"
    
    engine = create_engine(f"mysql+pymysql://{db_user}:{db_password}@localhost/{db_name}")
    inspector = inspect(engine)
    
    with engine.connect() as connection:
        # 1. Fetch all crop IDs
        result = connection.execute(text("SELECT crop_id, crop_name FROM crops"))
        crops = result.fetchall()
        
        if not crops:
            print("Error: No crops found in the 'crops' table!")
            return

        print(f"Found {len(crops)} crops. Populating relational tables safely...")

        # 2. Seed Market Prices
        if 'market_prices' in inspector.get_table_names():
            print("Seeding market_prices...")
            for crop_id, name in crops:
                base_price = random.randint(20, 150)
                for day in range(30):
                    date = (datetime.now() - timedelta(days=(30 - day))).strftime('%Y-%m-%d')
                    price = round(base_price + random.uniform(-5.0, 5.0) + (day * 0.2), 2)
                    connection.execute(
                        text("INSERT INTO market_prices (crop_id, price, recorded_date) VALUES (:crop_id, :price, :recorded_date)"),
                        {"crop_id": crop_id, "price": price, "recorded_date": date}
                    )

        # 3. Seed Diseases (Safely checking columns without duplication)
        if 'diseases' in inspector.get_table_names():
            print("Seeding diseases table...")
            cols = [col['name'] for col in inspector.get_columns('diseases')]
            
            # Identify text/description column dynamically excluding keys
            desc_cols = [c for c in cols if c not in ['disease_id', 'crop_id', 'disease_name']]
            desc_col = desc_cols[0] if desc_cols else None

            common_diseases = [
                ("Leaf Blight", "Apply copper-based fungicide spray immediately."),
                ("Root Rot", "Ensure proper field drainage and reduce watering."),
                ("Powdery Mildew", "Use sulfur dust or organic neem oil solution."),
                ("Stem Borer", "Introduce bio-pesticides or target affected stems.")
            ]
            
            for crop_id, name in crops:
                disease_info = random.choice(common_diseases)
                if desc_col:
                    query = text(f"INSERT INTO diseases (crop_id, disease_name, {desc_col}) VALUES (:crop_id, :d_name, :val)")
                    connection.execute(query, {"crop_id": crop_id, "d_name": disease_info[0], "val": disease_info[1]})
                else:
                    query = text("INSERT INTO diseases (crop_id, disease_name) VALUES (:crop_id, :d_name)")
                    connection.execute(query, {"crop_id": crop_id, "d_name": disease_info[0]})

        # 4. Seed Weather Logs
        if 'weather_logs' in inspector.get_table_names():
            print("Seeding weather_logs...")
            for crop_id, name in crops:
                connection.execute(
                    text("INSERT INTO weather_logs (crop_id, optimal_temp, optimal_humidity) VALUES (:crop_id, :temp, :humidity)"),
                    {"crop_id": crop_id, "temp": round(random.uniform(20.0, 35.0), 1), "humidity": round(random.uniform(50.0, 85.0), 1)}
                )
                
        # 5. Seed Soil Nutrients
        if 'soil_nutrients' in inspector.get_table_names():
            print("Seeding soil_nutrients...")
            for crop_id, name in crops:
                connection.execute(
                    text("INSERT INTO soil_nutrients (crop_id, nitrogen, phosphorus, potassium, ph_level) VALUES (:crop_id, :n, :p, :k, :ph)"),
                    {
                        "crop_id": crop_id, 
                        "nitrogen": random.randint(20, 120), 
                        "phosphorus": random.randint(15, 90), 
                        "potassium": random.randint(20, 100), 
                        "ph_level": round(random.uniform(5.5, 7.5), 1)
                    }
                )

        connection.commit()
    print("All relational tables successfully populated!")

if __name__ == "__main__":
    seed_remaining_tables()