import React from 'react';
import {
  CloudRain,
  Sun,
  Cloud,
  Droplets,
  Wind,
  ShieldAlert,
  Thermometer,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function WeatherWidget({ weatherData, loading }) {
  if (loading) {
    return (
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 animate-pulse">
        <div className="h-6 w-48 bg-slate-800 rounded-md mb-4"></div>
        <div className="h-24 bg-slate-800/60 rounded-xl mb-4"></div>
        <div className="grid grid-cols-5 gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-800/40 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  const current = weatherData?.current || {
    temp: 29.8,
    humidity: 84,
    condition: 'Scattered Showers',
    windSpeed: 4.2,
    fungalRiskScore: 'CRITICAL',
    agriculturalAdvisory: 'High fungal proliferation risk (humidity > 80%).'
  };

  const forecast = weatherData?.forecast || [];
  const isHighHumidity = current.humidity >= 80;

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-500"></div>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CloudRain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Farm Weather & Microclimate
              <span className="text-xs font-normal text-slate-400">
                ({weatherData?.location?.city || 'Local Farm GPS'})
              </span>
            </h3>
            <p className="text-xs text-slate-400">Real-time OpenWeatherMap 5-day predictive forecast</p>
          </div>
        </div>

        {/* High Humidity Indicator */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
            isHighHumidity
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Fungal Risk: {current.fungalRiskScore || 'ELEVATED'}</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {/* Temperature */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800/80 p-3.5 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Temperature</div>
            <div className="text-xl font-extrabold text-white">
              {current.temp}°<span className="text-sm font-normal text-slate-400">C</span>
            </div>
          </div>
        </div>

        {/* Humidity (Key Metric for Fungal Rust) */}
        <div
          className={`rounded-xl border p-3.5 flex items-center gap-3 transition-colors ${
            isHighHumidity
              ? 'bg-red-950/20 border-red-500/30 text-red-200'
              : 'bg-slate-900/80 border-slate-800/80'
          }`}
        >
          <div
            className={`p-2.5 rounded-lg ${
              isHighHumidity ? 'bg-red-500/20 text-red-400' : 'bg-sky-500/10 text-sky-400'
            }`}
          >
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 flex items-center gap-1">
              Humidity
              {isHighHumidity && <span className="text-[10px] text-red-400 font-bold">&gt;80%</span>}
            </div>
            <div className="text-xl font-extrabold text-white">
              {current.humidity}%
            </div>
          </div>
        </div>

        {/* Wind Speed */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800/80 p-3.5 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-400">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Wind Speed</div>
            <div className="text-xl font-extrabold text-white">
              {current.windSpeed} <span className="text-xs font-normal text-slate-400">m/s</span>
            </div>
          </div>
        </div>

        {/* General Condition */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800/80 p-3.5 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Condition</div>
            <div className="text-sm font-bold text-white truncate max-w-[110px]">
              {current.condition || 'Scattered Rain'}
            </div>
          </div>
        </div>
      </div>

      {/* Advisory Banner */}
      {current.agriculturalAdvisory && (
        <div className="mb-6 rounded-xl bg-emerald-950/20 border border-emerald-500/20 px-3.5 py-2.5 flex items-center gap-2.5 text-xs text-emerald-300">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          <span>{current.agriculturalAdvisory}</span>
        </div>
      )}

      {/* 5-Day Forecast Row */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-3">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          <span>5-Day Weather Outlook</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {forecast.map((f, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -3 }}
              className="rounded-xl bg-slate-900/60 border border-slate-800/60 p-3 text-center flex flex-col items-center justify-between"
            >
              <span className="text-xs font-bold text-slate-300">{f.day || `Day ${idx + 1}`}</span>
              <div className="my-2">
                {f.rainProb > 50 ? (
                  <CloudRain className="w-6 h-6 text-sky-400 mx-auto" />
                ) : f.temp > 31 ? (
                  <Sun className="w-6 h-6 text-amber-400 mx-auto" />
                ) : (
                  <Cloud className="w-6 h-6 text-slate-400 mx-auto" />
                )}
              </div>
              <div className="text-sm font-extrabold text-white">{Math.round(f.temp)}°C</div>
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 mt-1">
                <span className="text-sky-400 font-medium">{f.rainProb}% rain</span>
                <span>•</span>
                <span className={f.humidity > 80 ? 'text-red-400 font-medium' : 'text-slate-400'}>
                  {f.humidity}% RH
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
