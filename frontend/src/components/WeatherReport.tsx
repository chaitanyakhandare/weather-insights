import { MapPin, Wind, Droplets, Sun, Eye, Gauge, CloudRain, Cloud, Zap } from "lucide-react";

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

export default function WeatherReport({ data }: WeatherReportProps) {
    const { location, current } = data;
    if (!location || !current) {
        return (
            <div className="text-center text-red-400 font-medium py-10">
                No weather data available. Please select a city.
            </div>
        );
    }

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,0,0,0.08)]">
      <div className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 p-6 text-white flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-wide">{location.name}</h2>
            <p className="text-white/80 text-sm">
              {location.region}, {location.country}
            </p>
            <p className="text-white/70 text-xs mt-1">{location.localtime}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <img
            src={current.condition.icon}
            alt={current.condition.text}
            className="w-14 h-14"
          />
          <div className="text-right">
            <h3 className="font-semibold text-lg">{current.condition.text}</h3>
            <p className="text-sm opacity-80">Feels like {current.feelslike_c}°C</p>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        <WeatherCard
          title="Temperature"
          value={`${current.temp_c}°C`}
          subtitle={`Feels like ${current.feelslike_c}°C`}
          icon={<Sun className="text-orange-500 w-5 h-5" />}
          gradient="from-orange-50 to-red-50"
        />
        <WeatherCard
          title="Humidity"
          value={`${current.humidity}%`}
          subtitle={current.humidity < 50 ? "Dry" : "Humid"}
          icon={<Droplets className="text-blue-500 w-5 h-5" />}
          gradient="from-blue-50 to-cyan-50"
        />
        <WeatherCard
          title="Wind"
          value={`${current.wind_kph} km/h`}
          subtitle={current.wind_dir}
          icon={<Wind className="text-emerald-500 w-5 h-5" />}
          gradient="from-green-50 to-emerald-50"
        />
        <WeatherCard
          title="Pressure"
          value={`${current.pressure_mb} hPa`}
          subtitle="Stable"
          icon={<Gauge className="text-purple-500 w-5 h-5" />}
          gradient="from-purple-50 to-indigo-50"
        />
        <WeatherCard
          title="Visibility"
          value={`${current.vis_km} km`}
          subtitle="Clear skies"
          icon={<Eye className="text-yellow-500 w-5 h-5" />}
          gradient="from-yellow-50 to-amber-50"
        />
        <WeatherCard
          title="UV Index"
          value={current.uv.toFixed(1)}
          subtitle={
            current.uv < 3
              ? "Low"
              : current.uv < 6
              ? "Moderate"
              : current.uv < 8
              ? "High"
              : "Very High"
          }
          icon={<Sun className="text-pink-500 w-5 h-5" />}
          gradient="from-pink-50 to-rose-50"
        />
        <WeatherCard
          title="Precipitation"
          value={`${current.precip_mm} mm`}
          subtitle="Rain volume"
          icon={<CloudRain className="text-blue-400 w-5 h-5" />}
          gradient="from-sky-50 to-blue-50"
        />
        <WeatherCard
          title="Dew Point"
          value={`${current.dewpoint_c}°C`}
          subtitle="Moisture level"
          icon={<Cloud className="text-gray-500 w-5 h-5" />}
          gradient="from-gray-50 to-slate-50"
        />
        <WeatherCard
          title="Cloud Cover"
          value={`${current.cloud}%`}
          subtitle="Sky coverage"
          icon={<Cloud className="text-slate-400 w-5 h-5" />}
          gradient="from-slate-50 to-zinc-50"
        />
        <WeatherCard
          title="Wind Gusts"
          value={`${current.gust_kph} km/h`}
          subtitle="Peak wind"
          icon={<Zap className="text-yellow-600 w-5 h-5" />}
          gradient="from-amber-50 to-orange-50"
        />
      </div>

      <div className="bg-linear-to-r from-slate-50 to-gray-100 text-gray-700 text-center py-4 border-t border-gray-200">
        <p className="text-sm">
          Live weather data provided by{" "}
          <span className="font-semibold text-blue-600">WeatherAPI</span>
        </p>
      </div>
    </div>
  );
}

interface WeatherCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  gradient?: string;
}

function WeatherCard({ title, value, subtitle, icon, gradient }: WeatherCardProps) {
  return (
    <div
      className={`p-5 rounded-2xl border border-gray-100 bg-linear-to-br ${gradient} shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">{title}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {subtitle && (
        <div className="text-sm text-gray-500 mt-1">{subtitle}</div>
      )}
    </div>
  );
}
