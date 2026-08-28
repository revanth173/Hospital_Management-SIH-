import React, { useEffect } from 'react';
import { Language, QueueToken, PatientAuth, EHRSummary, MedicalSystem } from '../../types/kiosk';
import { TRANSLATIONS } from '../../data/languages';
import confetti from 'canvas-confetti';
import {
  UserRoundCheck,
  QrCode,
  Printer,
  Stethoscope,
  Building,
  Clock,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface Step13HandoverProps {
  language: Language;
  token: QueueToken;
  patientAuth: PatientAuth;
  ehrSummary: EHRSummary;
  medicalSystem: MedicalSystem;
  onOpenDoctorPortal: () => void;
  onResetKiosk: () => void;
}

export const Step13PhysicianHandover: React.FC<Step13HandoverProps> = ({
  language,
  token,
  patientAuth,
  ehrSummary,
  medicalSystem,
  onOpenDoctorPortal,
  onResetKiosk,
}) => {
  const t = TRANSLATIONS[language];

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 65,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // safe fallback
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 relative">
      {/* Background Watermark Numerals */}
      <div className="absolute top-0 right-6 text-[140px] font-serif font-bold text-black/3 select-none pointer-events-none leading-none">
        13
      </div>

      {/* Header */}
      <div className="text-center mb-6 relative">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EAE8E2] text-[#1A1A1A] text-[10px] font-sans uppercase tracking-[0.2em] mb-2 border border-[#1A1A1A]/10">
          <UserRoundCheck className="w-3.5 h-3.5 text-[#5E7153]" />
          <span>Stage 13 • Triage Completion & Clinical Handover</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#1A1A1A] tracking-tight">{t.handoverTitle}</h2>
        <p className="text-[#1A1A1A]/70 text-xs sm:text-sm mt-1 max-w-lg mx-auto font-serif italic">
          {t.proceedToDoctor}
        </p>
      </div>

      {/* Printable OPD Token Slip Card */}
      <div className="bg-white border border-[#1A1A1A]/15 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden space-y-6">
        {/* Top Perforation / Badge */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-dashed border-[#1A1A1A]/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#5E7153] text-[#F9F7F2] flex items-center justify-center font-serif font-bold text-xl shadow-xs">
              ✓
            </div>
            <div>
              <div className="text-[10px] uppercase font-sans font-bold tracking-[0.15em] text-[#5E7153]">
                AIIMS NEW DELHI • OPD QUEUE TOKEN
              </div>
              <div className="text-2xl font-serif font-bold text-[#1A1A1A]">{token.tokenNumber}</div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-[#1A1A1A]/60 font-sans uppercase tracking-wider">Issue Time</div>
            <div className="text-xs font-serif font-bold text-[#1A1A1A]">{token.createdAt}</div>
            <span className="inline-block mt-1 text-[10px] font-sans font-bold px-2.5 py-0.5 rounded-full bg-[#EAE8E2] text-[#1A1A1A] uppercase tracking-wider border border-[#1A1A1A]/10">
              {medicalSystem} OPD
            </span>
          </div>
        </div>

        {/* Room & Doctor Allocation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#5E7153]/10 border border-[#5E7153]/25 space-y-1">
            <div className="text-[10px] uppercase font-sans font-bold tracking-wider text-[#5E7153] flex items-center gap-1">
              <Building className="w-3.5 h-3.5" /> Consultation Location
            </div>
            <div className="text-xl font-serif font-bold text-[#1A1A1A]">{token.roomNumber}</div>
            <div className="text-xs text-[#1A1A1A]/80 font-serif italic">{token.department}</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F9F7F2] border border-[#1A1A1A]/10 space-y-1">
            <div className="text-[10px] uppercase font-sans font-bold tracking-wider text-[#1A1A1A]/70 flex items-center gap-1">
              <Stethoscope className="w-3.5 h-3.5 text-[#D4A373]" /> Assigned Physician
            </div>
            <div className="text-base font-serif font-bold text-[#1A1A1A]">{token.doctorName}</div>
            <div className="text-xs text-[#1A1A1A]/70 font-sans flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#D4A373]" /> Est. Wait: ~{token.estimatedWaitMinutes} mins (Queue #{token.queuePosition})
            </div>
          </div>
        </div>

        {/* Patient Summary & QR Code Handover */}
        <div className="p-4 rounded-2xl bg-[#F9F7F2] border border-[#1A1A1A]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-xs text-[#1A1A1A] font-serif">
            <div>
              <span className="font-sans text-[10px] uppercase tracking-wider text-[#1A1A1A]/60">Patient:</span>{' '}
              <strong className="text-[#1A1A1A]">{patientAuth.patientName}</strong> ({patientAuth.age}y/{patientAuth.gender})
            </div>
            <div>
              <span className="font-sans text-[10px] uppercase tracking-wider text-[#1A1A1A]/60">ABHA Number:</span>{' '}
              <span className="font-sans text-[#1A1A1A]">{patientAuth.abhaId}</span>
            </div>
            <div>
              <span className="font-sans text-[10px] uppercase tracking-wider text-[#1A1A1A]/60">Triage Priority:</span>{' '}
              <span className="font-sans font-bold text-[#5E7153] uppercase tracking-wider">{ehrSummary.triageCategory}</span>
            </div>
          </div>

          {/* QR Code */}
          <div className="p-3 bg-white border border-[#1A1A1A]/15 rounded-2xl text-center shrink-0 shadow-xs">
            <QrCode className="w-16 h-16 text-[#1A1A1A] mx-auto" />
            <div className="text-[9px] font-sans uppercase tracking-wider text-[#1A1A1A]/60 mt-1">Scan at Desk</div>
          </div>
        </div>

        {/* Quick Action Buttons on Slip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={handlePrint}
            className="py-3 px-4 rounded-full border border-[#1A1A1A]/20 hover:bg-[#EAE8E2]/50 text-[#1A1A1A] text-xs font-sans uppercase tracking-[0.15em] flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4 text-[#1A1A1A]" />
            <span>Print Thermal Slip</span>
          </button>

          <button
            onClick={onOpenDoctorPortal}
            className="py-3 px-4 rounded-full bg-[#1A1A1A] hover:bg-black text-[#F9F7F2] text-xs font-sans uppercase tracking-[0.15em] flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
          >
            <Stethoscope className="w-4 h-4 text-[#D4A373]" />
            <span>Open Doctor Terminal</span>
            <ArrowRight className="w-4 h-4 text-[#D4A373]" />
          </button>
        </div>

        {/* Bottom Reset Kiosk for Next Patient */}
        <div className="pt-4 border-t border-[#1A1A1A]/10 flex items-center justify-between">
          <button
            onClick={onResetKiosk}
            className="text-xs font-sans uppercase tracking-wider text-[#1A1A1A] hover:underline flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#D4A373]" /> Start New Patient Session
          </button>
          <div className="text-[10px] font-serif italic text-[#1A1A1A]/60 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#5E7153]" /> DPDP Certified Handover
          </div>
        </div>
      </div>
    </div>
  );
};
