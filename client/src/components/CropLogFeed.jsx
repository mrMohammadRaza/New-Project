import React, { useState } from 'react';
import { History, Calendar, ShieldCheck, ChevronDown, ChevronUp, AlertCircle, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CropLogFeed({ logs = [] }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              CropLog Diagnostic Feed
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {logs.length} Scans
              </span>
            </h3>
            <p className="text-xs text-slate-400">Historical records stored in MongoDB CropLog schema</p>
          </div>
        </div>
      </div>

      {/* Feed list */}
      {logs.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
          <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-400">No crop diagnoses logged yet.</p>
          <p className="text-xs text-slate-500 mt-1">Upload an infected leaf in the scanner above to record the first log.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
          {logs.map((log) => {
            const isExpanded = expandedId === (log._id || log.id);
            const dateFormatted = new Date(log.date || log.createdAt || Date.now()).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            // Adjust image path if uploaded locally
            const imageSrc = log.imageUrl?.startsWith('/')
              ? `http://localhost:5000${log.imageUrl}`
              : log.imageUrl;

            return (
              <motion.div
                key={log._id || log.id}
                layout
                className="rounded-xl bg-slate-900/80 border border-slate-800/90 hover:border-slate-700/80 transition-all overflow-hidden"
              >
                <div className="p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Thumbnail */}
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 flex-shrink-0">
                      <img
                        src={imageSrc}
                        alt={log.diseaseName}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=200&q=80';
                        }}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Metadata */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{log.diseaseName}</h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            log.severity === 'HIGH' || log.severity === 'CRITICAL'
                              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {log.severity || 'HIGH'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {dateFormatted}
                        </span>
                        <span>•</span>
                        <span className="text-emerald-400 font-medium">
                          Confidence: {Math.round((log.confidence || 0.94) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expand button */}
                  <button
                    onClick={() => toggleExpand(log._id || log.id)}
                    className="self-end sm:self-center px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-xs font-medium text-slate-300 flex items-center gap-1.5 transition-colors"
                  >
                    <span>{isExpanded ? 'Hide Protocol' : 'Treatment Plan'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Collapsible Treatment Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-800/80 bg-slate-950/60 p-4 text-xs"
                    >
                      <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1.5">
                        <ShieldCheck className="w-4 h-4" />
                        Prescribed Agricultural Treatment:
                      </div>
                      <p className="text-slate-300 whitespace-pre-line leading-relaxed pl-5 border-l-2 border-emerald-500/40">
                        {log.treatmentPlan}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
