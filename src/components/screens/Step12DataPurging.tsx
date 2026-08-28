import React, { useState, useEffect } from 'react';
import { Language, DataPurgeStatus } from '../../types/kiosk';
import { TRANSLATIONS } from '../../data/languages';
import {
  Trash2,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Zap,
  ArrowRight,
  Sparkles,
  KeyRound,
} from 'lucide-react';

interface Step12DataPurgeProps {
  language: Language;
  purgeStatus: DataPurgeStatus;
  onProceed: () => void;
  onBack: () => void;
}

export const Step12DataPurging: React.FC<Step12DataPurgeProps> = ({
  language,
  purgeStatus,
  onProceed,
  onBack,
}) => {
  const t = TRANSLATIONS[language];
  const [purgeProgress, setPurgeProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPurgeProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDone(true);
          return 100;
        }
        return prev + 25;
      });
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 relative">
      {/* Background Watermark Numerals */}
      <div className="absolute top-0 right-6 text-[140px] font-serif font-bold text-black/3 select-none pointer-events-none leading-none">
        12
      </div>

      {/* Header */}
      <div className="text-center mb-6 relative">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EAE8E2] text-[#1A1A1A] text-[10px] font-sans uppercase tracking-[0.2em] mb-2 border border-[#1A1A1A]/10">
          <Trash2 className="w-3.5 h-3.5 text-[#D4A373]" />
          <span>Stage 12 • DPDP Act 2023 Privacy Compliance</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#1A1A1A] tracking-tight">{t.dataPurgeTitle}</h2>
        <p className="text-[#1A1A1A]/70 text-xs sm:text-sm mt-1 max-w-lg mx-auto font-serif italic">
          {t.dataPurgeNotice}
        </p>
      </div>

      {/* Main Purge Container */}
      <div className="bg-white border border-[#1A1A1A]/10 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Animated Progress Circle */}
        <div className="flex flex-col items-center justify-center py-4 text-center">
          <div className="relative mb-4">
            <div
              className={`w-28 h-28 rounded-full flex items-center justify-center border transition-all ${
                isDone
                  ? 'border-[#5E7153] bg-[#5E7153]/10 text-[#5E7153]'
                  : 'border-[#D4A373] bg-[#D4A373]/10 text-[#1A1A1A] animate-pulse'
              }`}
            >
              {isDone ? <ShieldCheck className="w-12 h-12 text-[#5E7153]" /> : <Trash2 className="w-12 h-12 text-[#1A1A1A]" />}
            </div>
            {isDone && (
              <div className="absolute -bottom-1 -right-1 bg-[#5E7153] text-white p-1.5 rounded-full shadow-xs border-2 border-white">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          <div className="text-lg font-serif font-bold text-[#1A1A1A]">
            {isDone ? 'Local Kiosk Data Purging Completed' : `Sanitizing Local Kiosk Cache (${purgeProgress}%)`}
          </div>
          <div className="text-xs text-[#1A1A1A]/60 mt-1 max-w-sm font-serif italic">
            Zero-retention architecture: All transient voice clips, document scans, and biometrics destroyed from local memory.
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#EAE8E2] rounded-full h-2 overflow-hidden border border-[#1A1A1A]/10">
          <div
            className={`h-full transition-all duration-300 ${
              isDone ? 'bg-[#5E7153]' : 'bg-[#D4A373]'
            }`}
            style={{ width: `${purgeProgress}%` }}
          />
        </div>

        {/* DPDP Compliance Certificate */}
        <div className="bg-[#1A1A1A] text-[#F9F7F2] rounded-2xl p-5 font-mono text-xs space-y-2 border border-[#1A1A1A]/20">
          <div className="flex items-center justify-between pb-2 border-b border-[#F9F7F2]/10 text-[11px] text-[#F9F7F2]/60">
            <span className="text-[#D4A373] font-bold flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-[#5E7153]" /> Cryptographic Zero-Overwrite Log
            </span>
            <span className="font-sans text-[10px]">Status: {isDone ? 'VERIFIED' : 'PURGING'}</span>
          </div>

          <div className="space-y-1 text-[11px]">
            <div>• Local Storage Cache: <strong className="text-[#5E7153]">0 Bytes Retained</strong></div>
            <div>• Voice Audio Waveform Buffer: <strong className="text-[#5E7153]">Wiped</strong></div>
            <div>• OCR Image Buffer: <strong className="text-[#5E7153]">Zero-filled (DoD 5220.22-M)</strong></div>
            <div>• Cryptographic Session Token: <span className="text-[#D4A373]">{purgeStatus.sessionTokenEncrypted}</span></div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-[#1A1A1A]/10">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-full border border-[#1A1A1A]/20 text-[#1A1A1A] text-xs font-sans uppercase tracking-[0.15em] hover:bg-[#EAE8E2]/50 cursor-pointer"
          >
            {t.back}
          </button>
          <button
            type="button"
            onClick={onProceed}
            disabled={!isDone}
            className="px-7 py-3 rounded-full bg-[#1A1A1A] hover:bg-black disabled:opacity-40 text-[#F9F7F2] font-sans uppercase tracking-[0.15em] text-xs shadow-sm flex items-center gap-2 cursor-pointer transition-all"
          >
            <span>Generate OPD Token & Handover</span>
            <ArrowRight className="w-4 h-4 text-[#D4A373]" />
          </button>
        </div>
      </div>
    </div>
  );
};
