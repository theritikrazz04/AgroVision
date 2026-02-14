from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import os
import datetime

router = APIRouter()

class PredictionRequest(BaseModel):
    commodity: str
    forecast_days: int = 7

class PredictionResponse(BaseModel):
    commodity: str
    forecast: list
    trend: str
    recommendation: str
    confidence: float

MODEL_DIR = "models"

@router.post("/predict", response_model=PredictionResponse)
def predict_price(request: PredictionRequest):
    model_path = os.path.join(MODEL_DIR, f"{request.commodity.replace(' ', '_').replace('(', '').replace(')', '').lower()}.pkl")
    
    if not os.path.exists(model_path):
        raise HTTPException(status_code=404, detail=f"Model for {request.commodity} not found")
    
    try:
        model = joblib.load(model_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading model: {str(e)}")
    
    # Generate future dates
    today = datetime.date.today()
    future_dates = [today + datetime.timedelta(days=i) for i in range(1, request.forecast_days + 1)]
    
    X_pred = pd.DataFrame({
        'day': [d.day for d in future_dates],
        'month': [d.month for d in future_dates],
        'year': [d.year for d in future_dates]
    })
    
    try:
        predictions = model.predict(X_pred)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error making prediction: {str(e)}")
    
    # Simple logic for trend and recommendation (can be enhanced)
    avg_pred = predictions.mean()
    first_pred = predictions[0]
    last_pred = predictions[-1]
    
    if last_pred > first_pred * 1.05:
        trend = "Rising"
        recommendation = "HOLD"
    elif last_pred < first_pred * 0.95:
        trend = "Falling"
        recommendation = "SELL"
    else:
        trend = "Stable"
        recommendation = "WAIT"
        
    forecast_data = []
    for date, price in zip(future_dates, predictions):
        forecast_data.append({"date": date.strftime("%Y-%m-%d"), "price": round(price, 2)})
        
    return {
        "commodity": request.commodity,
        "forecast": forecast_data,
        "trend": trend,
        "recommendation": recommendation,
        "confidence": 85.0 # Placeholder confidence
    }
