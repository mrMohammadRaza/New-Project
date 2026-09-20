import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import WeatherWidget from './components/WeatherWidget';
import DiseaseScanner from './components/DiseaseScanner';
import CropLogFeed from './components/CropLogFeed';
import NotificationBanner from './components/NotificationBanner';
import {
  getWeatherForecast,
  getCropHistory,
  getNotifications,
  triggerCronManually
} from './services/api';
import {
  Activity,
  Server,
  Cpu,
  Database,
  CloudSun,
  ShieldCheck,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

export default function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [cropLogs, setCropLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeAlert, setActiveAlert] = useState(null);
  const [cronTriggering, setCronTriggering] = useState(false);

  // Load initial farm telemetry and records
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setWeatherLoading(true);
    try {
      const [weatherRes, logsRes, notifsRes] = await Promise.all([
        getWeatherForecast(28.6139, 77.2090),
        getCropHistory(),
        getNotifications()
      ]);

      setWeatherData(weatherRes);
      if (logsRes?.data) setCropLogs(logsRes.data);
      if (notifsRes?.data) {
        setNotifications(notifsRes.data);
        if (notifsRes.data.length > 0) {
          setActiveAlert(notifsRes.data[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching dashboard records:', err);
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleScanComplete = (newLog) => {
    setCropLogs((prev) => [newLog, ...prev]);
  };

  const handleTriggerCron = async () => {
    setCronTriggering(true);
    try {
      await triggerCronManually();
      // Generate immediate visual feedback alert simulating the 6:00 AM job
      const newAlert = {
        _id: `cron_${Date.now()}`,
        type: 'HUMIDITY_ALERT',
        title: '06:00 AM Scheduled Cron Fired: High Humidity Alert',
        message:
          'Farm relative humidity reached 84%. Moisture threshold exceeded (>80%). Severe risk of Puccinia triticina (Leaf Rust) spore germination. Preventive fungicide spray advised.',
        humidity: 84,
        date: new Date()
      };
      setActiveAlert(newAlert);
      setNotifications((prev) => [newAlert, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setCronTriggering(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onTriggerCron={handleTriggerCron}
        unreadCount={notifications.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* System Architecture Ribbon */}
        <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-white">AgriFlow Monorepo Architecture:</span>
            <span className="text-slate-400">SIH20676 Solution Active</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <Server className="w-3.5 h-3.5 text-slate-400" />
              Express:5000
            </span>
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-teal-400" />
              FastAPI:8000
            </span>
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-green-400" />
              MongoDB + Mongoose
            </span>
            <span className="flex items-center gap-1.5">
              <CloudSun className="w-3.5 h-3.5 text-sky-400" />
              OpenWeather API
            </span>
          </div>
        </div>

        {/* 6:00 AM Cron Alert Banner */}
        <NotificationBanner
          notification={activeAlert}
          onDismiss={() => setActiveAlert(null)}
        />

        {/* Top Section: Weather & Forecast Widget */}
        <WeatherWidget
          weatherData={weatherData}
          loading={weatherLoading}
        />

        {/* Middle Section: AI Disease Scanner & CropLog Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Disease Detection Scanner (7 cols) */}
          <div className="lg:col-span-7">
            <DiseaseScanner onScanComplete={handleScanComplete} />
          </div>

          {/* Historical CropLog Feed (5 cols) */}
          <div className="lg:col-span-5">
            <CropLogFeed logs={cropLogs} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            AgriFlow © 2026 • AI-Powered Crop Disease & Smart Farm Advisory (SIH20676)
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>FastAPI ML Microservice</span>
            <span>•</span>
            <span>node-cron 6:00 AM Monitor</span>
            <span>•</span>
            <span>Tailwind + Framer Motion</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
