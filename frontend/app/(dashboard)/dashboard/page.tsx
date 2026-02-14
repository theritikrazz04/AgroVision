"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getPrediction, getHistory } from "@/lib/api";
import { ArrowUpRight, ArrowDownRight, TrendingUp, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const COMMODITIES = [
    "Brinjal", "Green Chilli", "Bhindi(Ladies Finger)", "Mustard", "Wheat",
    "Cauliflower", "Cabbage", "Soyabean", "Ginger(Green)", "Apple"
];

export default function DashboardPage() {
    const [selectedCommodity, setSelectedCommodity] = useState(COMMODITIES[0]);
    const [prediction, setPrediction] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const [predData, histData] = await Promise.all([
                    getPrediction(selectedCommodity),
                    getHistory(selectedCommodity)
                ]);
                setPrediction(predData);
                setHistory(histData.history);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [selectedCommodity]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
    };

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center space-x-2">
                    <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Commodity" />
                        </SelectTrigger>
                        <SelectContent>
                            {COMMODITIES.map((c) => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Current Trend</CardTitle>
                        {prediction?.trend === "Rising" ? (
                            <ArrowUpRight className="h-4 w-4 text-green-500" />
                        ) : prediction?.trend === "Falling" ? (
                            <ArrowDownRight className="h-4 w-4 text-red-500" />
                        ) : (
                            <TrendingUp className="h-4 w-4 text-yellow-500" />
                        )}
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{prediction?.trend || "Loading..."}</div>
                        <p className="text-xs text-muted-foreground">Based on 7-day forecast</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Recommendation</CardTitle>
                        <AlertTriangle className={cn("h-4 w-4",
                            prediction?.recommendation === "SELL" ? "text-red-500" :
                                prediction?.recommendation === "HOLD" ? "text-green-500" : "text-yellow-500"
                        )} />
                    </CardHeader>
                    <CardContent>
                        <div className={cn("text-2xl font-bold",
                            prediction?.recommendation === "SELL" ? "text-red-500" :
                                prediction?.recommendation === "HOLD" ? "text-green-500" : "text-yellow-500"
                        )}>
                            {prediction?.recommendation || "Loading..."}
                        </div>
                        <p className="text-xs text-muted-foreground">AI Advisory</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Predicted Price (Sug. Max)</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {prediction && prediction.forecast.length > 0 ?
                                formatCurrency(Math.max(...prediction.forecast.map((f: any) => f.price))) : "Loading..."}
                        </div>
                        <p className="text-xs text-muted-foreground">In next 7 days</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Confidence Score</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {prediction ? `${prediction.confidence}%` : "Loading..."}
                        </div>
                        <p className="text-xs text-muted-foreground">Model Accuracy</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Price History (Last 30 Days)</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={history}>
                                    <defs>
                                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(value) => new Date(value).getDate().toString()} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="price" stroke="#8884d8" fillOpacity={1} fill="url(#colorPrice)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>7-Day Forecast</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={prediction?.forecast || []}>
                                    <defs>
                                        <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(value) => new Date(value).getDate().toString()} />
                                    <YAxis tick={{ fontSize: 12 }} domain={['auto', 'auto']} />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="price" stroke="#82ca9d" fillOpacity={1} fill="url(#colorForecast)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
