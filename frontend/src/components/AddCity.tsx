import { useState } from "react";
import API from "../api";

interface AddCityProps {
    onAdded: () => void;
}

interface ApiResponse {
    message: string;
}

export default function AddCity({ onAdded }: AddCityProps) {
    const [city, setCity] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!city.trim()) return;

        try {
            setLoading(true);
            setMessage("");

            // ✅ Step 1: Validate city by calling your backend fetch_weather route
            const fetchRes = await API.get(`/fetch/?city=${encodeURIComponent(city)}`);

            if (!fetchRes.data?.location?.name) {
                throw new Error("Invalid city data");
            }

            const verifiedCity = fetchRes.data.location.name;

            // ✅ Step 2: Add verified city to DB
            const addRes = await API.post<ApiResponse>("/addcity/", { city: verifiedCity });
            setMessage("✅ " + addRes.data.message);
            setCity("");
            onAdded();
        } catch (err: any) {
            console.error(err);
            if (err.response?.status === 400 || err.response?.status === 404) {
                setMessage("❌ City not found. Please check the spelling.");
            } else {
                setMessage("❌ Error adding city. Please check the spelling and try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex items-center justify-center">
            <div className="w-full max-w-7xl bg-linear-to-br from-white to-gray-50 p-6 rounded-3xl shadow-lg border border-gray-100 mb-6 transition-all duration-300 hover:shadow-xl">
                <div className="flex items-center mb-4">
                    <div className="w-2 h-8 bg-linear-to-b from-blue-500 to-purple-600 rounded-full mr-3"></div>
                    <h2 className="text-2xl font-bold text-gray-800">Add New City</h2>
                </div>

                <form onSubmit={handleAdd} className="space-y-4">
                    <div className="relative">
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Enter city name..."
                            className="w-full border-2 border-gray-200 p-4 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-700 placeholder-gray-400"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        disabled={loading || !city.trim()}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center space-x-2">
                                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
                   5.291A7.962 7.962 0 014 12H0c0 
                   3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                <span>Validating...</span>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center space-x-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span>Add City</span>
                            </div>
                        )}
                    </button>
                </form>

                {message && (
                    <div
                        className={`mt-4 p-3 rounded-xl text-sm font-medium transition-all duration-200 ${message.includes("✅")
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                    >
                        {message}
                    </div>
                )}
            </div>
        </div>

    );
}
