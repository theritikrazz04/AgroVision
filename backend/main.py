from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import predict, history, insights

app = FastAPI(title="AgroVision API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict.router, prefix="/api", tags=["prediction"])
app.include_router(history.router, prefix="/api", tags=["history"])
app.include_router(insights.router, prefix="/api", tags=["insights"])

@app.get("/")
def read_root():
    return {"message": "Welcome to AgroVision API"}
