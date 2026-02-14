from fastapi import APIRouter, HTTPException
import pandas as pd
import os
from services.data_processing import REQUIRED_COMMODITIES

router = APIRouter()

# Get project root directory dynamically
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

# Correct path to CSV (works on local + Render)
DATA_PATH = os.path.join(BASE_DIR, "data", "cleaned_prices.csv")


# Helper function to load commodity history
def get_commodity_history(commodity: str):

    if not os.path.exists(DATA_PATH):
        print("Data file not found at:", DATA_PATH)
        return []

    try:
        df = pd.read_csv(DATA_PATH)

        # Ensure proper datetime format
        df["Price Date"] = pd.to_datetime(df["Price Date"], errors="coerce")
        df = df.dropna(subset=["Price Date"])

        # Filter commodity
        comm_df = df[df["Commodity"] == commodity]

        if comm_df.empty:
            return []

        # Sort by date
        comm_df = comm_df.sort_values(by="Price Date")

        # Aggregate by date (mean price if multiple markets)
        daily_price = (
            comm_df.groupby("Price Date")["price"]
            .mean()
            .reset_index()
        )

        # Get last 30 days
        daily_price = daily_price.tail(30)

        result = []
        for _, row in daily_price.iterrows():
            result.append({
                "date": row["Price Date"].strftime("%Y-%m-%d"),
                "price": round(float(row["price"]), 2)
            })

        return result

    except Exception as e:
        print("Error reading history:", e)
        return []


@router.get("/history/{commodity}")
def get_history(commodity: str):

    if commodity not in REQUIRED_COMMODITIES:
        raise HTTPException(status_code=400, detail="Commodity not supported")

    history = get_commodity_history(commodity)

    if not history:
        raise HTTPException(status_code=404, detail="No history found")

    return {
        "commodity": commodity,
        "history": history
    }
