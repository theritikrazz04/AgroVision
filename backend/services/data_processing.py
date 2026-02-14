import pandas as pd
import os

REQUIRED_COMMODITIES = [
    "Brinjal", "Green Chilli", "Bhindi(Ladies Finger)", "Mustard", "Wheat",
    "Cauliflower", "Cabbage", "Soyabean", "Ginger(Green)", "Apple"
]

def load_and_preprocess_data(filepath: str):
    print(f"Loading data from {filepath}...")
    df = pd.read_csv(filepath)
    
    # Filter for required commodities
    df = df[df['Commodity'].isin(REQUIRED_COMMODITIES)].copy()
    
    # Convert Date
    df['Price Date'] = pd.to_datetime(df['Price Date'], errors='coerce')
    df = df.dropna(subset=['Price Date', 'price'])
    
    # Feature Engineering
    df['day'] = df['Price Date'].dt.day
    df['month'] = df['Price Date'].dt.month
    df['year'] = df['Price Date'].dt.year
    
    # Sort
    df = df.sort_values(by='Price Date')
    
    print(f"Data loaded: {len(df)} rows for {len(REQUIRED_COMMODITIES)} commodities.")
    return df
