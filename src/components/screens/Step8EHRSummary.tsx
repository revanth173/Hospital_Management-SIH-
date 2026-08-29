import React from 'react';
import { Language, EHRSummary, PatientAuth, MedicalSystem } from '../../types/kiosk';
import { TRANSLATIONS } from '../../data/languages';
import { ClinicalTelemetryCharts } from '../common/ClinicalTelemetryCharts';
import {
  ClipboardList,
  HeartPulse,
  Tag,
  Stethoscope,
  ShieldCheck,
  ArrowRight,
  Activity,
  FileCheck2,
} from 'lucide-react';

interface Step8EHRProps {
  language: Language;
  ehrSummary: EHRSummary;
  patientAuth: PatientAuth;
  medicalSystem: MedicalSystem;
  onProceed: () => void;
  onBack: () => void;
}

export const Step8EHRSummary: React.FC<Step8EHRProps> = ({
  language,
  ehrSummary,
  patientAuth,
  medicalSystem,
  onProceed,
  onBack,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 relative">
      {/* Background Watermark Numerals */}
      <div className="absolute top-0 right-6 text-[140px] font-serif font-bold text-black/3 select-none pointer-events-none leading-none">
        08
      </div>

      {/* Header */}
      <div className="text-center mb-6 relative">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EAE8E2] text-[#1A1A1A] text-[10px] font-sans uppercase tracking-[0.2em] mb-2 border border-[#1A1A1A]/10">
          <ClipboardList className="w-3.5 h-3.5 text-[#D4A373]" />
          <span>Stage 08 • Electronic Health Record Automated Synthesis</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#1A1A1A] tracking-tight">{t.ehrTitle}</h2>
        <p className="text-[#1A1A1A]/70 text-xs sm:text-sm mt-1 max-w-lg mx-auto font-serif italic">
          Clinical note codification with standard SNOMED CT & ICD-10 ontologies.
        </p>
      </div>

      {/* Main EHR Card */}
      <div className="bg-white border border-[#1A1A1A]/10 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Top Patient & Triage Header */}
        <div className="p-4 rounded-2xl bg-[#F9F7F2] border border-[#1A1A1A]/10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-sans uppercase tracking-[0.15em] text-[#1A1A1A]/60">Patient Details</div>
            <div className="text-lg font-serif font-bold text-[#1A1A1A]">
              {patientAuth.patientName} • {patientAuth.age}y / {patientAuth.gender}
            </div>
            <div className="text-xs text-[#1A1A1A]/70 font-sans">
              ABHA: {patientAuth.abhaId} ({patientAuth.abhaAddress})
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-sans font-bold border uppercase tracking-wider ${
                ehrSummary.triageCategory.includes('Emergency')
                  ? 'bg-[#843C2E]/10 text-[#843C2E] border-[#843C2E]/30 animate-pulse'
                  : ehrSummary.triageCategory.includes('Urgent')
                  ? 'bg-[#D4A373]/15 text-[#1A1A1A] border-[#D4A373]/40'
                  : 'bg-[#5E7153]/15 text-[#5E7153] border-[#5E7153]/30'
              }`}
            >
              Triage: {ehrSummary.triageCategory}
            </span>
            <span className="px-3.5 py-1.5 rounded-full text-[11px] font-sans font-bold bg-[#EAE8E2] text-[#1A1A1A] border border-[#1A1A1A]/10 uppercase tracking-wider">
              {medicalSystem}
            </span>
          </div>
        </div>

        {/* Chief Complaint & HPI */}
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-[#1A1A1A]/60 mb-1">
              Chief Complaint
            </label>
            <div className="p-3.5 rounded-2xl bg-[#EAE8E2]/60 border border-[#1A1A1A]/10 text-sm font-serif font-bold text-[#1A1A1A]">
              {ehrSummary.chiefComplaint}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-[#1A1A1A]/60 mb-1">
              History of Present Illness (HPI Narrative)
            </label>
            <div className="p-4 rounded-2xl bg-[#F9F7F2] border border-[#1A1A1A]/10 text-xs sm:text-sm text-[#1A1A1A]/90 font-serif leading-relaxed italic">
              {ehrSummary.hpiNarrative}
            </div>
          </div>
        </div>

        {/* Vital Signs Grid */}
        <div>
          <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-[#1A1A1A]/60 mb-2 flex items-center gap-1">
            <HeartPulse className="w-3.5 h-3.5 text-[#843C2E]" />
            <span>Vital Signs (Kiosk Telemetry)</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-[#F9F7F2] border border-[#1A1A1A]/10 text-center">
              <div className="text-[10px] text-[#1A1A1A]/60 font-sans uppercase tracking-wider">Blood Pressure</div>
              <div className="font-serif font-bold text-[#1A1A1A] text-base mt-0.5">{ehrSummary.vitalSigns.bloodPressure}</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#F9F7F2] border border-[#1A1A1A]/10 text-center">
              <div className="text-[10px] text-[#1A1A1A]/60 font-sans uppercase tracking-wider">Heart Rate</div>
              <div className="font-serif font-bold text-[#1A1A1A] text-base mt-0.5">{ehrSummary.vitalSigns.heartRate}</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#F9F7F2] border border-[#1A1A1A]/10 text-center">
              <div className="text-[10px] text-[#1A1A1A]/60 font-sans uppercase tracking-wider">SpO2 (Pulse Oximetry)</div>
              <div className="font-serif font-bold text-[#1A1A1A] text-base mt-0.5">{ehrSummary.vitalSigns.spo2}</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#F9F7F2] border border-[#1A1A1A]/10 text-center">
              <div className="text-[10px] text-[#1A1A1A]/60 font-sans uppercase tracking-wider">Respiratory Rate</div>
              <div className="font-serif font-bold text-[#1A1A1A] text-base mt-0.5">{ehrSummary.vitalSigns.respiratoryRate}</div>
            </div>
          </div>
        </div>

        {/* Graphical Telemetry Gauges & Visual Biomarkers */}
        <ClinicalTelemetryCharts
          bloodPressure={ehrSummary.vitalSigns.bloodPressure}
          heartRate={ehrSummary.vitalSigns.heartRate}
          spo2={ehrSummary.vitalSigns.spo2}
          respiratoryRate={ehrSummary.vitalSigns.respiratoryRate}
          painSeverityScore={8}
          bloodSugar={142}
        />

        {/* Clinical Codification (SNOMED & ICD-10) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#1A1A1A]/10">
          <div>
            <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-[#1A1A1A]/60 mb-2 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-[#1A1A1A]" />
              <span>SNOMED CT Codification</span>
            </label>
            <div className="space-y-1.5">
              {ehrSummary.snomedCodes.map((s) => (
                <div
                  key={s.code}
                  className="p-2.5 rounded-xl bg-[#F9F7F2] border border-[#1A1A1A]/10 text-xs flex items-center justify-between"
                >
                  <span className="font-sans font-semibold text-[#1A1A1A]">{s.display}</span>
                  <span className="font-sans text-[10px] font-bold text-[#1A1A1A] bg-white px-2 py-0.5 rounded-full border border-[#1A1A1A]/15">
                    SCT: {s.code}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-[#1A1A1A]/60 mb-2 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-[#5E7153]" />
              <span>ICD-10-CM Classification</span>
            </label>
            <div className="space-y-1.5">
              {ehrSummary.icd10Codes.map((icd) => (
                <div
                  key={icd.code}
                  className="p-2.5 rounded-xl bg-[#5E7153]/5 border border-[#5E7153]/20 text-xs flex items-center justify-between"
                >
                  <span className="font-sans font-semibold text-[#1A1A1A]">{icd.display}</span>
                  <span className="font-sans text-[10px] font-bold text-[#5E7153] bg-white px-2 py-0.5 rounded-full border border-[#5E7153]/30">
                    ICD: {icd.code}
                  </span>
                </div>
              ))}
            </div>
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
            <span>Audio Readback & Confirmation</span>
            <ArrowRight className="w-4 h-4 text-[#D4A373]" />
          </button>
        </div>
      </div>
    </div>
  );
};
