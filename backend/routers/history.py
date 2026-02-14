from fastapi import APIRouter, HTTPException
import pandas as pd
import os
from services.data_processing import REQUIRED_COMMODITIES

router = APIRouter()

DATA_PATH = "data/cleaned_prices.csv"

# Helper to load data (should be optimized/cached in real app)
def get_commodity_history(commodity: str):
    # Adjust path if needed
    path = DATA_PATH
    if not os.path.exists(path):
        path = "data/cleaned_prices.csv"
        
    if not os.path.exists(path):
         # Try absolute path based on known location
        path = r"c:/Users/rk338/OneDrive/Desktop/AgroVision/data/cleaned_prices.csv"
    
    if not os.path.exists(path):
        return []

    # Read only necessary columns to save memory if file is huge, or filter after
    # optimizing: read full file is slow for every request. 
    # For now, simplistic implementation.
    try:
        df = pd.read_csv(path)
        df['Price Date'] = pd.to_datetime(df['Price Date'], errors='coerce')
        df = df.dropna(subset=['Price Date'])
        
        comm_df = df[df['Commodity'] == commodity].sort_values(by='Price Date')
        
        # Aggregate by date to handle multiple markets (mean price)
        daily_price = comm_df.groupby('Price Date')['price'].mean().reset_index()
        
        result = []
        for _, row in daily_price.tail(30).iterrows(): # Return last 30 days
            result.append({
                "date": row['Price Date'].strftime("%Y-%m-%d"),
                "price": round(row['price'], 2)
            })
        return result
    except Exception as e:
        print(f"Error reading history: {e}")
        return []

@router.get("/history/{commodity}")
def get_history(commodity: str):
    if commodity not in REQUIRED_COMMODITIES:
        raise HTTPException(status_code=400, detail="Commodity not supported")
    
    history = get_commodity_history(commodity)
    if not history:
        raise HTTPException(status_code=404, detail="No history found")
        
    return {"commodity": commodity, "history": history}
