import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Brain, MapPin } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface City {
    id: number;
    name: string;
}

interface AIReportData {
    selected_city: string;
    weather_data: Record<
        string,
        {
            temp_c: number;
            condition: string;
            humidity: number;
            wind_kph: number;
            pressure_mb: number;
        }
    >;
    ai_report: string;
}

interface ReportHistoryProps {
    city: City;
    latestReport: AIReportData | null;
}

export default function ReportHistory({ latestReport }: ReportHistoryProps) {
    if (!latestReport) {
        return (
            <div className="p-8 text-center text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-lg font-medium">No report generated yet</p>
                <p className="text-sm text-gray-400 mt-1">
                    Click on a city to generate a new weather analysis.
                </p>
            </div>
        );
    }

    const { weather_data, ai_report, selected_city } = latestReport;
    const cityNames = Object.keys(weather_data);

    // Prepare chart data
    const tempData = cityNames.map((c) => weather_data[c].temp_c);
    const humidityData = cityNames.map((c) => weather_data[c].humidity);
    const windData = cityNames.map((c) => weather_data[c].wind_kph);
    const pressureData = cityNames.map((c) => weather_data[c].pressure_mb);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: false },
        },
    };

    const createChartData = (label: string, data: number[], color: string) => ({
        labels: cityNames,
        datasets: [
            {
                label,
                data,
                backgroundColor: cityNames.map(
                    (name) =>
                        name.toLowerCase() === selected_city.toLowerCase()
                            ? color
                            : color + "55" // lighter opacity for others
                ),
                borderRadius: 8,
            },
        ],
    });

    return (
        <div className="p-10 bg-linear-to-br from-white to-gray-50 rounded-3xl shadow-xl border border-gray-100 space-y-10">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-8 bg-linear-to-b from-blue-500 to-purple-600 rounded-full"></div>
                <h2 className="text-2xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    AI-Generated Weather Insights for {selected_city.charAt(0).toUpperCase() + selected_city.slice(1)}, Compared with All Other Cities
                </h2>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">🌡 Temperature (°C)</h3>
                    <Bar data={createChartData("Temperature", tempData, "#3b82f6")} options={chartOptions} />
                </div>

                <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">💧 Humidity (%)</h3>
                    <Bar data={createChartData("Humidity", humidityData, "#60a5fa")} options={chartOptions} />
                </div>

                <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">🌬 Wind Speed (kph)</h3>
                    <Bar data={createChartData("Wind Speed", windData, "#34d399")} options={chartOptions} />
                </div>

                <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">🌡 Pressure (hPa)</h3>
                    <Bar data={createChartData("Pressure", pressureData, "#a78bfa")} options={chartOptions} />
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent"></div>

            {/* AI Report */}
            <div className="bg-linear-to-r from-purple-50 to-blue-50 p-6 rounded-2xl border border-purple-100 shadow-inner max-h-[800px] overflow-y-auto">
                <div className="flex items-start gap-3">
                    <Brain className="w-6 h-6 text-purple-600 mt-1 shrink-0" />
                    <div className="text-gray-800 whitespace-pre-line leading-relaxed text-[15px]">
                        <div 
                            className="prose prose-sm max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-strong:text-gray-800 prose-ul:text-gray-700 prose-ol:text-gray-700"
                            dangerouslySetInnerHTML={{ 
                                __html: ai_report.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') 
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
