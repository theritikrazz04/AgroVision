import axios from "axios";

// In production, use env variable
const API_URL = "http://localhost:8000/api";

export const api = axios.create({
    baseURL: API_URL,
});

export const getPrediction = async (commodity: string, forecast_days: number = 7) => {
    try {
        const response = await api.post("/predict", { commodity, forecast_days });
        return response.data;
    } catch (error) {
        console.error("Error fetching prediction:", error);
        throw error;
    }
};

export const getHistory = async (commodity: string) => {
    try {
        const response = await api.get(`/history/${commodity}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching history:", error);
        throw error;
    }
};

export const getInsights = async () => {
    try {
        const response = await api.get("/insights");
        return response.data;
    } catch (error) {
        console.error("Error fetching insights:", error);
        throw error;
    }
};
