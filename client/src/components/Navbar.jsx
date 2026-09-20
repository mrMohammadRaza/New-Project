import React from 'react';
import { Sprout, MapPin, Bell, RefreshCw, Zap } from 'lucide-react';

export default function Navbar({ onTriggerCron, unreadCount = 1 }) {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/20">
            <Sprout className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                Agri<span className="text-emerald-400">Flow</span>
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                SIH20676
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">AI Precision Agriculture & Advisory</p>
          </div>
        </div>

        {/* Center / Farm GPS Coordinates */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Farm GPS:</span>
          <span className="font-mono text-emerald-400 font-medium">28.6139° N, 77.2090° E</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">North Agri Zone</span>
        </div>

        {/* Actions & Cron Trigger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Manual Cron Trigger */}
          <button
            onClick={onTriggerCron}
            title="Simulate 6:00 AM Cron Job Humidity Check"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold transition-all active:scale-95"
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Run 6 AM Cron</span>
          </button>

          {/* Notification Bell */}
          <div className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer">
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white alert-pulse">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
