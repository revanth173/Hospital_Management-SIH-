import React, { useState, useEffect } from 'react';
import { Language, AbdmSyncStatus, PatientAuth } from '../../types/kiosk';
import { TRANSLATIONS } from '../../data/languages';
import {
  Cloud,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Key,
  Link,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface Step11AbdmProps {
  language: Language;
  patientAuth: PatientAuth;
  syncStatus: AbdmSyncStatus;
  onProceed: () => void;
  onBack: () => void;
}

export const Step11AbdmSync: React.FC<Step11AbdmProps> = ({
  language,
  patientAuth,
  syncStatus,
  onProceed,
  onBack,
}) => {
  const t = TRANSLATIONS[language];
  const [syncStep, setSyncStep] = useState(1);

  useEffect(() => {
    const t1 = setTimeout(() => setSyncStep(2), 700);
    const t2 = setTimeout(() => setSyncStep(3), 1400);
    const t3 = setTimeout(() => setSyncStep(4), 2100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 relative">
      {/* Background Watermark Numerals */}
      <div className="absolute top-0 right-6 text-[140px] font-serif font-bold text-black/3 select-none pointer-events-none leading-none">
        11
      </div>

      {/* Header */}
      <div className="text-center mb-6 relative">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EAE8E2] text-[#1A1A1A] text-[10px] font-sans uppercase tracking-[0.2em] mb-2 border border-[#1A1A1A]/10">
          <Cloud className="w-3.5 h-3.5 text-[#D4A373]" />
          <span>Stage 11 • National Health Stack Gateway Integration</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#1A1A1A] tracking-tight">{t.abdmSyncTitle}</h2>
        <p className="text-[#1A1A1A]/70 text-xs sm:text-sm mt-1 max-w-lg mx-auto font-serif italic">
          Secure encrypted handshake with Ayushman Bharat Digital Mission (ABDM) Gateway.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-[#1A1A1A]/10 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Sync Progress Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div
            className={`p-3.5 rounded-2xl border transition-all ${
              syncStep >= 1 ? 'border-[#1A1A1A] bg-[#F9F7F2] text-[#1A1A1A]' : 'border-[#1A1A1A]/10 bg-[#F9F7F2] opacity-40'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-sans font-bold uppercase tracking-wider mb-1">
              <span>1. Discovery</span>
              {syncStep >= 1 && <CheckCircle2 className="w-4 h-4 text-[#5E7153]" />}
            </div>
            <div className="text-[10px] font-serif italic text-[#1A1A1A]/70">ABHA Match Found</div>
          </div>

          <div
            className={`p-3.5 rounded-2xl border transition-all ${
              syncStep >= 2 ? 'border-[#1A1A1A] bg-[#F9F7F2] text-[#1A1A1A]' : 'border-[#1A1A1A]/10 bg-[#F9F7F2] opacity-40'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-sans font-bold uppercase tracking-wider mb-1">
              <span>2. Care Context</span>
              {syncStep >= 2 && <CheckCircle2 className="w-4 h-4 text-[#5E7153]" />}
            </div>
            <div className="text-[10px] font-serif italic text-[#1A1A1A]/70">OPD Episode Linked</div>
          </div>

          <div
            className={`p-3.5 rounded-2xl border transition-all ${
              syncStep >= 3 ? 'border-[#1A1A1A] bg-[#F9F7F2] text-[#1A1A1A]' : 'border-[#1A1A1A]/10 bg-[#F9F7F2] opacity-40'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-sans font-bold uppercase tracking-wider mb-1">
              <span>3. FHIR Bridge</span>
              {syncStep >= 3 && <CheckCircle2 className="w-4 h-4 text-[#5E7153]" />}
            </div>
            <div className="text-[10px] font-serif italic text-[#1A1A1A]/70">Payload Encrypted</div>
          </div>

          <div
            className={`p-3.5 rounded-2xl border transition-all ${
              syncStep >= 4 ? 'border-[#5E7153] bg-[#5E7153]/10 text-[#1A1A1A] shadow-xs' : 'border-[#1A1A1A]/10 bg-[#F9F7F2] opacity-40'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-sans font-bold uppercase tracking-wider mb-1">
              <span>4. Gateway Sync</span>
              {syncStep >= 4 && <CheckCircle2 className="w-4 h-4 text-[#5E7153]" />}
            </div>
            <div className="text-[10px] font-serif italic text-[#5E7153] font-bold">ABDM Confirmed</div>
          </div>
        </div>

        {/* Live ABDM Transaction Details */}
        <div className="bg-[#1A1A1A] text-[#F9F7F2] rounded-2xl p-5 font-mono text-xs space-y-2.5 border border-[#1A1A1A]/20">
          <div className="flex items-center justify-between text-[#F9F7F2]/70 pb-2 border-b border-[#F9F7F2]/10 text-[11px]">
            <span className="flex items-center gap-1.5 text-[#D4A373] font-bold">
              <ShieldCheck className="w-4 h-4 text-[#5E7153]" /> ABDM Milestone 3 Certified Transaction
            </span>
            <span className="text-[10px] font-sans">Timestamp: {syncStatus.gatewayTimestamp}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] pt-1">
            <div>
              <span className="text-[#F9F7F2]/60">Health Facility (HIP):</span>{' '}
              <strong className="text-white">AIIMS New Delhi (IN0810000001)</strong>
            </div>
            <div>
              <span className="text-[#F9F7F2]/60">Linked ABHA ID:</span>{' '}
              <strong className="text-white">{patientAuth.abhaId}</strong>
            </div>
            <div>
              <span className="text-[#F9F7F2]/60">Care Context Ref:</span>{' '}
              <strong className="text-[#D4A373]">{syncStatus.careContextReference}</strong>
            </div>
            <div>
              <span className="text-[#F9F7F2]/60">ABDM Transaction ID:</span>{' '}
              <strong className="text-[#D4A373]">{syncStatus.transactionId}</strong>
            </div>
          </div>
        </div>

        {/* Patient Mobile PHR Notification Callout */}
        <div className="p-4 rounded-2xl bg-[#5E7153]/10 border border-[#5E7153]/30 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#5E7153] shrink-0 mt-0.5" />
          <div className="text-xs text-[#1A1A1A]">
            <div className="font-sans font-bold uppercase tracking-wider text-[11px] text-[#5E7153]">Record Available on Patient's ABHA Mobile App (PHR)</div>
            <p className="mt-0.5 font-serif italic text-[#1A1A1A]/80 leading-relaxed">
              The generated clinical note has been securely linked to your ABHA account ({patientAuth.abhaAddress}). You can view, download, or share this consultation anytime via Aarogya Setu or any ABDM PHR app.
            </p>
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
            className="px-7 py-3 rounded-full bg-[#1A1A1A] hover:bg-black text-[#F9F7F2] font-sans uppercase tracking-[0.15em] text-xs shadow-sm flex items-center gap-2 cursor-pointer transition-all"
          >
            <span>Proceed to Data Purging (DPDP Act)</span>
            <ArrowRight className="w-4 h-4 text-[#D4A373]" />
          </button>
        </div>
      </div>
    </div>
  );
};
