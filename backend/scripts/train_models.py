import pandas as pd
import os
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
import sys

# Add project root to path to allow imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from backend.services.data_processing import REQUIRED_COMMODITIES # Removed load_and_preprocess_data import as we might need to adjust it

# Redefine load to be self-contained or fix import
def load_data(filepath):
    print(f"Loading data from {filepath}...")
    df = pd.read_csv(filepath)
    df = df[df['Commodity'].isin(REQUIRED_COMMODITIES)].copy()
    df['Price Date'] = pd.to_datetime(df['Price Date'], errors='coerce')
    df = df.dropna(subset=['Price Date', 'price'])
    df['day'] = df['Price Date'].dt.day
    df['month'] = df['Price Date'].dt.month
    df['year'] = df['Price Date'].dt.year
    return df

MODEL_DIR = "backend/models"
DATA_PATH = "data/cleaned_prices.csv"

def train_models():
    # Enusre model dir exists
    if not os.path.exists(MODEL_DIR):
        print(f"Creating model directory: {MODEL_DIR}")
        os.makedirs(MODEL_DIR)

    # Check data path
    if not os.path.exists(DATA_PATH):
        print(f"Data not found at {DATA_PATH}. Checking absolute path...")
        # Try absolute path based on known location
        DATA_PATH_ABS = r"c:/Users/rk338/OneDrive/Desktop/AgroVision/data/cleaned_prices.csv"
        if os.path.exists(DATA_PATH_ABS):
            print(f"Found data at {DATA_PATH_ABS}")
            data_to_load = DATA_PATH_ABS
        else:
            print("Data file not found!")
            return
    else:
        data_to_load = DATA_PATH

    df = load_data(data_to_load)
    
    training_results = {}

    for commodity in REQUIRED_COMMODITIES:
        print(f"Training model for {commodity}...")
        comm_df = df[df['Commodity'] == commodity]
        
        if len(comm_df) < 50:
            print(f"Not enough data for {commodity}, skipping.")
            continue
            
        X = comm_df[['day', 'month', 'year']]
        y = comm_df['price']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)
        
        y_pred = model.predict(X_test)
        mae = mean_absolute_error(y_test, y_pred)
        
        # Clean commodity name for filename
        clean_name = commodity.replace(" ", "_").replace("(", "").replace(")", "").lower()
        model_path = os.path.join(MODEL_DIR, f"{clean_name}.pkl")
        joblib.dump(model, model_path)
        
        training_results[commodity] = mae
        print(f"Saved {commodity} model to {model_path}. MAE: {mae:.2f}")

    print("Training complete.")

if __name__ == "__main__":
    train_models()
