import React, { useState, useEffect } from 'react';
import { Language, EmergencyRedFlag, PatientAuth } from '../../types/kiosk';
import { TRANSLATIONS } from '../../data/languages';
import {
  AlertTriangle,
  Siren,
  HeartPulse,
  PhoneCall,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Clock,
  Radio,
} from 'lucide-react';

interface Step6EmergencyProps {
  language: Language;
  redFlag: EmergencyRedFlag;
  patientAuth: PatientAuth;
  onProceedToDocUpload: () => void;
  onStaffAcknowledged: () => void;
}

export const Step6EmergencyRedFlag: React.FC<Step6EmergencyProps> = ({
  language,
  redFlag,
  patientAuth,
  onProceedToDocUpload,
  onStaffAcknowledged,
}) => {
  const t = TRANSLATIONS[language];
  const [countdown, setCountdown] = useState(60);
  const [nurseDispatched, setNurseDispatched] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 relative">
      {/* Background Watermark Numerals */}
      <div className="absolute top-0 right-6 text-[140px] font-serif font-bold text-black/3 select-none pointer-events-none leading-none">
        06
      </div>

      {/* Triage Alert Banner */}
      <div className="bg-[#843C2E] text-[#F9F7F2] rounded-3xl p-6 sm:p-8 shadow-md border border-[#843C2E]/50 mb-6 relative">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#F9F7F2] text-[#843C2E] flex items-center justify-center shrink-0 shadow-xs">
              <Siren className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-sans font-bold tracking-[0.2em] text-[#F9F7F2]/80">
                Triage Level 1 • Code Red Protocol Activated
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-light text-[#F9F7F2] tracking-tight mt-0.5">
                {t.emergencyAlertTitle}
              </h2>
              <p className="text-[#F9F7F2]/80 text-xs sm:text-sm mt-1 max-w-xl font-serif italic">
                {t.emergencyAlertDesc}
              </p>
            </div>
          </div>

          <div className="bg-black/20 px-4 py-2.5 rounded-2xl border border-white/20 text-center shrink-0">
            <div className="text-[10px] uppercase font-sans font-bold tracking-[0.15em] text-[#F9F7F2]/70">Staff ETA</div>
            <div className="text-2xl font-serif font-bold text-[#F9F7F2]">00:{countdown < 10 ? `0${countdown}` : countdown}</div>
          </div>
        </div>
      </div>

      {/* Main Protocol Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Clinical Triggers & Automated STAT Protocols */}
        <div className="md:col-span-2 space-y-4">
          {/* Patient Card */}
          <div className="bg-white border border-[#1A1A1A]/10 rounded-2xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[10px] font-sans uppercase tracking-[0.15em] text-[#1A1A1A]/60">Patient Identifier</div>
              <div className="font-serif font-bold text-[#1A1A1A] text-lg">
                {patientAuth.patientName} ({patientAuth.age}y / {patientAuth.gender})
              </div>
              <div className="text-xs text-[#1A1A1A]/70 font-sans tracking-wide">ABHA: {patientAuth.abhaId}</div>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 rounded-full bg-[#843C2E]/10 text-[#843C2E] text-[11px] font-sans font-bold border border-[#843C2E]/30 uppercase tracking-wider">
                Acuity: {redFlag.riskScore}/100
              </span>
              <div className="text-[11px] font-serif italic text-[#1A1A1A]/60 mt-1">Location: {redFlag.assignedErBay || 'BAY-01'}</div>
            </div>
          </div>

          {/* Trigger Criteria */}
          <div className="bg-[#843C2E]/5 border border-[#843C2E]/20 rounded-2xl p-5">
            <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-[#843C2E] mb-3 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#843C2E]" />
              <span>Red-Flag Trigger Criteria</span>
            </h3>
            <ul className="space-y-2 text-xs text-[#1A1A1A] font-serif italic">
              {redFlag.triggers.map((trig, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#843C2E] mt-1.5 shrink-0" />
                  <span>{trig}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Automated Emergency Actions */}
          <div className="bg-white border border-[#1A1A1A]/10 rounded-2xl p-5 shadow-xs">
            <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-[#1A1A1A] mb-3 flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-[#843C2E]" />
              <span>Automated STAT Protocols Dispatched</span>
            </h3>
            <div className="space-y-2">
              {redFlag.protocolActions.map((act, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#F9F7F2] border border-[#1A1A1A]/10 flex items-center gap-2.5 text-xs text-[#1A1A1A] font-sans"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#5E7153] shrink-0" />
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Live Hospital Telemetry Broadcast */}
        <div className="space-y-4">
          <div className="bg-[#1A1A1A] text-[#F9F7F2] rounded-2xl p-5 border border-[#1A1A1A] shadow-md">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#D4A373] animate-pulse" />
                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#F9F7F2]/80">
                  Hospital Broadcast
                </span>
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#843C2E] text-white font-sans uppercase tracking-wider font-bold">
                ACTIVE
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[10px] font-sans uppercase tracking-wider text-[#F9F7F2]/60">ER Nurse Station Alert</div>
                <div className="font-sans font-semibold text-[#5E7153] flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Staff Dispatched to Bay-04
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[10px] font-sans uppercase tracking-wider text-[#F9F7F2]/60">Crash Cart & 12-Lead ECG</div>
                <div className="font-sans font-semibold text-[#D4A373] flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5" /> En-route to Kiosk Area
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[10px] font-sans uppercase tracking-wider text-[#F9F7F2]/60">Attending ER Physician</div>
                <div className="font-serif italic text-white text-sm">Dr. Vikram Rathore, MD (ER)</div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 text-center">
              <button
                onClick={onStaffAcknowledged}
                className="w-full py-2.5 px-4 rounded-full bg-[#5E7153] hover:bg-[#4d5e44] text-white font-sans uppercase tracking-[0.15em] font-semibold text-xs shadow-xs transition-all cursor-pointer"
              >
                Staff Bedside Arrival Acknowledged
              </button>
            </div>
          </div>

          {/* Test Branch Navigation */}
          <div className="bg-[#EAE8E2]/50 border border-[#1A1A1A]/10 rounded-2xl p-4 text-center">
            <div className="text-xs font-serif font-bold text-[#1A1A1A] mb-1">Interactive Pipeline Demo</div>
            <p className="text-[11px] font-serif italic text-[#1A1A1A]/70 mb-3">
              You can proceed to Document Upload & EHR summary to test the rest of the flowchart.
            </p>
            <button
              onClick={onProceedToDocUpload}
              className="w-full py-2.5 px-4 rounded-full bg-[#1A1A1A] hover:bg-black text-[#F9F7F2] font-sans uppercase tracking-[0.15em] text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Continue to Document Upload</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D4A373]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
