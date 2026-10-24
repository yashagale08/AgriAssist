CREATE DATABASE IF NOT EXISTS agriassist_db;
USE agriassist_db;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    location VARCHAR(100),
    preferred_language VARCHAR(30) DEFAULT 'English',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE crops (
    crop_id INT AUTO_INCREMENT PRIMARY KEY,
    crop_name VARCHAR(100) NOT NULL,
    soil_type VARCHAR(100),
    season VARCHAR(50),
    water_requirement VARCHAR(100),
    cultivation_method TEXT
);

CREATE TABLE diseases (
    disease_id INT AUTO_INCREMENT PRIMARY KEY,
    crop_id INT,
    disease_name VARCHAR(150) NOT NULL,
    symptoms TEXT,
    causes TEXT,
    prevention_methods TEXT,
    treatment TEXT,
    FOREIGN KEY (crop_id) REFERENCES crops(crop_id)
);

CREATE TABLE fertilizers (
    fertilizer_id INT AUTO_INCREMENT PRIMARY KEY,
    crop_id INT,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(50),
    dosage VARCHAR(100),
    application_stage VARCHAR(100),
    FOREIGN KEY (crop_id) REFERENCES crops(crop_id)
);

CREATE TABLE weather_data (
    weather_id INT AUTO_INCREMENT PRIMARY KEY,
    location VARCHAR(100) NOT NULL,
    temperature DECIMAL(5,2),
    rainfall DECIMAL(6,2),
    humidity DECIMAL(5,2),
    wind_speed DECIMAL(5,2),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE market_prices (
    price_id INT AUTO_INCREMENT PRIMARY KEY,
    crop_id INT,
    market_location VARCHAR(100),
    price DECIMAL(10,2),
    recorded_date DATE,
    FOREIGN KEY (crop_id) REFERENCES crops(crop_id)
);

CREATE TABLE government_schemes (
    scheme_id INT AUTO_INCREMENT PRIMARY KEY,
    scheme_name VARCHAR(150) NOT NULL,
    description TEXT,
    eligibility TEXT,
    link VARCHAR(255)
);

CREATE TABLE chat_history (
    chat_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    query_text TEXT,
    intent VARCHAR(100),
    response_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);