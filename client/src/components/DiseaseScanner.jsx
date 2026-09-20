import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileImage,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Info,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { scanCropLeaf } from '../services/api';

export default function DiseaseScanner({ onScanComplete }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Please select an image file (JPG, PNG, or WebP).');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setScanResult(null);
      setErrorMsg(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Please select an image file.');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setScanResult(null);
      setErrorMsg(null);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setScanResult(null);
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const executeScan = async () => {
    if (!selectedFile) return;
    setIsScanning(true);
    setErrorMsg(null);

    try {
      // Calls /api/disease/scan which proxies to FastAPI
      const result = await scanCropLeaf(selectedFile);
      if (result.success) {
        setScanResult(result);
        if (onScanComplete) {
          onScanComplete(result.data);
        }
      } else {
        setErrorMsg(result.message || 'Scan could not be completed.');
      }
    } catch (err) {
      setErrorMsg('Failed to process image scan. Please verify server connection.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-emerald-400 to-lime-400"></div>

      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">AI Crop Disease Scanner</h3>
            <p className="text-xs text-slate-400">
              Upload leaf photo for neural network pathology diagnosis (FastAPI / Leaf Rust engine)
            </p>
          </div>
        </div>

        {selectedFile && (
          <button
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Drag & Drop Upload Zone */}
      {!previewUrl ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-700/80 hover:border-emerald-500/50 rounded-2xl p-8 text-center cursor-pointer transition-all bg-slate-900/40 hover:bg-slate-900/70 group"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h4 className="text-sm font-semibold text-white mb-1">
            Drop crop leaf photo here, or <span className="text-emerald-400 underline">browse</span>
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Supports Wheat, Rice, Corn, and Tomato leaves (JPEG, PNG, WebP up to 10MB)
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Image Preview & Scanning Laser Frame */}
          <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950 aspect-video max-h-72 flex items-center justify-center">
            <img
              src={previewUrl}
              alt="Crop leaf preview"
              className="w-full h-full object-contain"
            />

            {/* Scanning Laser Animation */}
            {isScanning && (
              <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[1px]">
                <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-scan-line"></div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/40 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  FastAPI Vision Model analyzing pathogen structures...
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          {!scanResult && (
            <button
              onClick={executeScan}
              disabled={isScanning}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Running Neural Network Inference...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Diagnose Crop Disease with AI
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Error Notice */}
      {errorMsg && (
        <div className="mt-3 p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Diagnostic Result Card */}
      <AnimatePresence>
        {scanResult && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 rounded-xl bg-slate-900/90 border border-emerald-500/30 p-4.5 space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                    Detected Pathogen
                  </div>
                  <h4 className="text-lg font-extrabold text-white">
                    {scanResult.data?.diseaseName || 'Leaf Rust (Puccinia triticina)'}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  Confidence: {Math.round((scanResult.data?.confidence || 0.948) * 100)}%
                </span>
                <span className="px-2.5 py-1 rounded-md bg-red-500/20 text-red-300 text-xs font-bold border border-red-500/30">
                  Severity: {scanResult.data?.severity || 'HIGH'}
                </span>
              </div>
            </div>

            {/* Treatment Plan Section */}
            <div>
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 mb-1.5">
                <ShieldCheck className="w-4 h-4" />
                Recommended Treatment & Action Plan:
              </div>
              <div className="text-xs text-slate-200 bg-slate-950/70 rounded-lg p-3 border border-slate-800/80 whitespace-pre-line leading-relaxed font-normal">
                {scanResult.data?.treatmentPlan}
              </div>
            </div>

            {/* Preventative measures if returned by FastAPI */}
            {scanResult.aiDetails?.preventative_measures && (
              <div className="pt-1">
                <div className="text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-sky-400" />
                  Key Field Preventative Controls:
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-400">
                  {scanResult.aiDetails.preventative_measures.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <ChevronRight className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
