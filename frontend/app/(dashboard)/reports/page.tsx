"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getPrediction } from "@/lib/api";
import { Loader2, Download, FileText } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

const COMMODITIES = [
    "Brinjal", "Green Chilli", "Bhindi(Ladies Finger)", "Mustard", "Wheat",
    "Cauliflower", "Cabbage", "Soyabean", "Ginger(Green)", "Apple"
];

export default function ReportsPage() {
    const [commodity, setCommodity] = useState("");
    const [state, setState] = useState("");
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState<any>(null);

    const generateReport = async () => {
        if (!commodity) return;
        setLoading(true);
        try {
            const data = await getPrediction(commodity);
            // Simulate gathering more data for report
            setReportData({
                ...data,
                generatedAt: new Date().toLocaleString(),
                user: "Demo User",
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-4 print:hidden">
                <Card className="col-span-full">
                    <CardHeader>
                        <CardTitle>Generate Report</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div className="space-y-2">
                                <Label>Commodity</Label>
                                <Select value={commodity} onValueChange={setCommodity}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Commodity" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {COMMODITIES.map((c) => (
                                            <SelectItem key={c} value={c}>{c}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>State (Optional)</Label>
                                <Input placeholder="All States" value={state} onChange={(e) => setState(e.target.value)} />
                            </div>
                            <Button onClick={generateReport} disabled={loading || !commodity} className="w-full">
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Generate Analysis
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {reportData && (
                <div className="space-y-6 animate-in fade-in-50 print:block">
                    <div className="flex justify-end print:hidden">
                        <Button variant="outline" onClick={handlePrint}>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                        </Button>
                    </div>

                    <Card id="report-content" className="print:shadow-none print:border-none">
                        <CardHeader className="border-b pb-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-2xl font-bold text-primary">AgroVision Intelligent Report</h1>
                                    <p className="text-sm text-muted-foreground">Detailed market analysis and prediction.</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium">Generated for: {reportData.user}</p>
                                    <p className="text-xs text-muted-foreground">{reportData.generatedAt}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">

                            {/* Summary Section */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <p className="text-sm font-medium text-muted-foreground">Commodity</p>
                                    <p className="text-lg font-bold">{reportData.commodity}</p>
                                </div>
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <p className="text-sm font-medium text-muted-foreground">Trend</p>
                                    <p className={cn("text-lg font-bold",
                                        reportData.trend === "Rising" ? "text-green-600" : "text-red-600"
                                    )}>{reportData.trend}</p>
                                </div>
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <p className="text-sm font-medium text-muted-foreground">Recommendation</p>
                                    <p className="text-lg font-bold text-blue-600">{reportData.recommendation}</p>
                                </div>
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <p className="text-sm font-medium text-muted-foreground">Risk Level</p>
                                    <p className="text-lg font-bold">Medium</p> {/* Placeholder */}
                                </div>
                            </div>

                            {/* Chart Section */}
                            <div className="border rounded-lg p-4">
                                <h3 className="font-semibold mb-4 flex items-center">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Price Forecast (Next 7 Days)
                                </h3>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={reportData.forecast}>
                                            <CartesianGrid strokeDasharray="3 3 vertical={false}" />
                                            <XAxis dataKey="date" />
                                            <YAxis />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={2} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Detailed Analysis Text */}
                            <div className="prose max-w-none">
                                <h3>AI Insights</h3>
                                <p>
                                    Based on the analysis of historical prices and current market volume, {reportData.commodity} is showing a
                                    <strong> {reportData.trend} </strong> trend. Our models indicate a confidence level of
                                    <strong> {reportData.confidence}%</strong>.
                                </p>
                                <p>
                                    Farmers are advised to <strong>{reportData.recommendation}</strong> their stock for optimal returns.
                                    The predicted best selling window is within the next 3-5 days.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
