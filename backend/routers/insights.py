from fastapi import APIRouter
from services.data_processing import REQUIRED_COMMODITIES

router = APIRouter()

@router.get("/insights")
def get_insights():
    # In a real app, this would analyze global trends from the data
    return {
        "market_summary": "Overall market shows stability in vegetables, slight rise in pulses.",
        "top_gainers": ["Brinjal", "Green Chilli"],
        "top_losers": ["Tomato"],
        "active_commodities": REQUIRED_COMMODITIES
    }
