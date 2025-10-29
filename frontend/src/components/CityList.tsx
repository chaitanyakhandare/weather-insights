import { useEffect, useState } from "react";
import API from "../api";
import ReportHistory from "./ReportHistory";
import { Trash2, MapPin, Search } from "lucide-react";
import WeatherReport from "./WeatherReport";

interface City {
    id: number;
    name: string;
}

interface WeatherReportProps {
    data: {
        location: {
            name: string;
            region: string;
            country: string;
            localtime: string;
        };
        current: {
            temp_c: number;
            feelslike_c: number;
            humidity: number;
            wind_kph: number;
            wind_dir: string;
            pressure_mb: number;
            vis_km: number;
            uv: number;
            condition: {
                text: string;
                icon: string;
            };
            precip_mm: number;
            dewpoint_c: number;
            cloud: number;
            gust_kph: number;
        };
    };
}

interface WeatherSummary {
    temp_c: number;
    condition: string;
    humidity: number;
    wind_kph: number;
    pressure_mb: number;
    uv?: number;
}

interface AIReportData {
    selected_city: string;
    weather_data: Record<string, WeatherSummary>;
    ai_report: string;
}


export default function CityList() {
    const [cities, setCities] = useState<City[]>([]);
    const [weatherData, setWeatherData] = useState<WeatherReportProps | null>(null);
    const [aiReportData, setAIReportData] = useState<AIReportData | null>(null);

    const [selectedCity, setSelectedCity] = useState<City | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [, setWeatherLoading] = useState<boolean>(false);
    const [reportLoading, setReportLoading] = useState<boolean>(false);


    const fetchCities = async (): Promise<void> => {
        try {
            setIsLoading(true);
            const res = await API.get("/getcities/");
            setCities(res.data.cities);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchWeather = async () => {
        if (!selectedCity) {
            return;
        };

        setWeatherLoading(true);
        try {
            const res = await API.get(`/fetch/?city=${selectedCity.name}`);
            console.log("Weather response:", res.data);
            setWeatherData(res.data);
        } catch (err) {
            console.error("Error fetching weather:", err);
            setWeatherData(null);
        } finally {
            setWeatherLoading(false);
        }
    };

    const fetchWeatherReport = async () => {
        if (!selectedCity) return;

        setReportLoading(true);
        setWeatherLoading(true);

        try {
            const res = await API.get(`/fetchreport/?city=${selectedCity.name}`);
            console.log("Full report response:", res.data);
            setAIReportData(res.data);

            const cityWeather = res.data.weather_data[selectedCity.name];
            if (cityWeather) {
                setWeatherData({
                    data: {
                        location: {
                            name: selectedCity.name,
                            region: "",
                            country: "",
                            localtime: new Date().toLocaleString(),
                        },
                        current: {
                            temp_c: cityWeather.temp_c,
                            feelslike_c: cityWeather.temp_c,
                            humidity: cityWeather.humidity,
                            wind_kph: cityWeather.wind_kph,
                            wind_dir: "",
                            pressure_mb: cityWeather.pressure_mb,
                            vis_km: 0,
                            uv: cityWeather.uv,
                            condition: {
                                text: cityWeather.condition,
                                icon: "",
                            },
                            precip_mm: 0,
                            dewpoint_c: 0,
                            cloud: 0,
                            gust_kph: 0,
                        },
                    },
                });
            }
        } catch (err) {
            console.error("Error fetching AI weather report:", err);
            setAIReportData(null);
        } finally {
            setWeatherLoading(false);
            setReportLoading(false);
        }
    };


    useEffect(() => {
        fetchWeather();
    }, [selectedCity]);

    useEffect(() => {
        fetchCities();
    }, []);

    useEffect(() => {
        if (selectedCity) {
            fetchWeatherReport();
        }
    }, [selectedCity]);


    const handleDelete = async (id: number): Promise<void> => {
        if (!window.confirm("Delete this city?")) return;

        try {
            await API.delete(`/deletecity/${id}/`);
            fetchCities();
            setSelectedCity(null);
            setWeatherData(null);
        } catch (err) {
            console.error(err);
        }
    };

    const filteredCities = cities.filter(
        (city) =>
            city.name &&
            city.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">City Management</h1>
                    <p className="text-gray-600">Manage your cities and view their reports</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Cities Panel */}
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="bg-linear-to-r from-blue-600 to-purple-600 p-6 text-white">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <MapPin className="w-6 h-6" />
                                    <h2 className="text-xl font-semibold">Cities</h2>
                                </div>

                            </div>

                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70" />
                                <input
                                    type="text"
                                    placeholder="Search cities..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-white/20 border border-white/30 rounded-xl py-2 pl-10 pr-4 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 transition-all"
                                />
                            </div>
                        </div>

                        <div className="p-6">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                            ) : filteredCities.length === 0 ? (
                                <div className="text-center py-12">
                                    <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 text-lg">No cities found</p>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                                    {filteredCities.map((city) => (
                                        <div
                                            key={city.id}
                                            className={`group flex justify-between items-center p-4 rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-md ${selectedCity?.id === city.id
                                                ? "bg-linear-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-md"
                                                : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                                                }`}
                                        >
                                            <div
                                                onClick={() => setSelectedCity(city)}
                                                className="flex items-center space-x-3 flex-1"
                                            >
                                                <div className={`w-3 h-3 rounded-full ${selectedCity?.id === city.id ? "bg-blue-500" : "bg-gray-300"
                                                    }`} />
                                                <span>{city.name.charAt(0).toUpperCase() + city.name.slice(1)}</span>
                                            </div>

                                            <button
                                                onClick={() => handleDelete(city.id)}
                                                className="opacity-0 group-hover:opacity-100 bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 p-2 rounded-xl transition-all duration-200 hover:scale-105"
                                                title="Delete city"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 flex items-center justify-center">
                        {selectedCity ? (
                            weatherData ? (
                                <WeatherReport data={weatherData.data} />
                            ) : (
                                <div className="text-center p-12">
                                    <div className="w-24 h-24 bg-linear-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <MapPin className="w-12 h-12 text-blue-500" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Weather Data...</h3>
                                    <p className="text-gray-500">Please wait while we fetch the latest report.</p>
                                </div>
                            )
                        ) : (
                            <div className="text-center p-12">
                                <div className="w-24 h-24 bg-linear-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <MapPin className="w-12 h-12 text-blue-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a City</h3>
                                <p className="text-gray-500">Choose a city from the list to view its weather report</p>
                            </div>
                        )}
                    </div>

                </div>

                <div className="mt-10">
                    {selectedCity ? (
                        <div className="bg-white mt-5 rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                            {reportLoading ? (
                                <div className="flex flex-col items-center justify-center py-16">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                                    <p className="text-gray-600 text-lg font-medium">
                                        Generating AI Weather Report for {selectedCity.name.charAt(0).toUpperCase() + selectedCity.name.slice(1)}...
                                    </p>
                                    <p className="text-gray-400 text-sm mt-1">This may take a few seconds ⏳</p>
                                </div>
                            ) : (
                                <ReportHistory
                                    city={selectedCity}
                                    latestReport={aiReportData}
                                />
                            )}
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 flex items-center justify-center">
                            <div className="text-center p-12">
                                <div className="w-24 h-24 bg-linear-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <MapPin className="w-12 h-12 text-blue-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a City</h3>
                                <p className="text-gray-500">Choose a city to view its report history</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </div>
    );
}
