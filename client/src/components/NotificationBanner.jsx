import React from 'react';
import { AlertTriangle, Clock, Droplets, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationBanner({ notification, onDismiss }) {
  if (!notification) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        className="rounded-2xl bg-gradient-to-r from-red-950/40 via-amber-950/30 to-red-950/40 border border-red-500/30 p-4 shadow-xl backdrop-blur-md relative overflow-hidden mb-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 mt-0.5 alert-pulse">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-sm font-bold text-red-200">
                  {notification.title || '6:00 AM Automated Humidity Warning'}
                </h4>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-red-500/20 text-red-300 border border-red-500/30">
                  <Droplets className="w-3 h-3" />
                  Humidity: {notification.humidity || 84}% (Threshold: &gt;80%)
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Scheduled Daily at 06:00 AM
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed max-w-4xl">
                {notification.message}
              </p>
            </div>
          </div>

          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
