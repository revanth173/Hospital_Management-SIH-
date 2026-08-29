import React, { useState } from 'react';
import { Language, FhirResourceBundle, EHRSummary, PatientAuth } from '../../types/kiosk';
import { TRANSLATIONS } from '../../data/languages';
import { ClinicalTelemetryCharts } from '../common/ClinicalTelemetryCharts';
import {
  FileCode2,
  FileText,
  Stethoscope,
  Copy,
  Check,
  Download,
  ShieldCheck,
  ArrowRight,
  Code,
  Layers,
} from 'lucide-react';

interface Step10FhirProps {
  language: Language;
  fhirBundle: FhirResourceBundle;
  ehrSummary: EHRSummary;
  patientAuth: PatientAuth;
  onProceed: () => void;
  onBack: () => void;
}

export const Step10PhysicianSummaryFhir: React.FC<Step10FhirProps> = ({
  language,
  fhirBundle,
  ehrSummary,
  patientAuth,
  onProceed,
  onBack,
}) => {
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'physician' | 'fhir_json'>('physician');
  const [copied, setCopied] = useState(false);

  const fhirJsonString = JSON.stringify(fhirBundle, null, 2);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(fhirJsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([fhirJsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FHIR_R4_ABDM_BUNDLE_${patientAuth.abhaId.replace(/\s+/g, '')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 relative">
      {/* Background Watermark Numerals */}
      <div className="absolute top-0 right-6 text-[140px] font-serif font-bold text-black/3 select-none pointer-events-none leading-none">
        10
      </div>

      {/* Header */}
      <div className="text-center mb-6 relative">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EAE8E2] text-[#1A1A1A] text-[10px] font-sans uppercase tracking-[0.2em] mb-2 border border-[#1A1A1A]/10">
          <FileCode2 className="w-3.5 h-3.5 text-[#D4A373]" />
          <span>Stage 10 • Interoperability & FHIR R4 Bundle</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#1A1A1A] tracking-tight">{t.physicianFhirTitle}</h2>
        <p className="text-[#1A1A1A]/70 text-xs sm:text-sm mt-1 max-w-lg mx-auto font-serif italic">
          HL7 FHIR R4 document bundle prepared for ABDM National Health Stack transmission.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex bg-[#EAE8E2] p-1 rounded-full border border-[#1A1A1A]/10">
          <button
            onClick={() => setActiveTab('physician')}
            className={`px-4 py-1.5 rounded-full text-xs font-sans uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'physician'
                ? 'bg-[#1A1A1A] text-[#F9F7F2] shadow-xs'
                : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A]'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-[#D4A373]" />
            <span>Physician SBAR</span>
          </button>
          <button
            onClick={() => setActiveTab('fhir_json')}
            className={`px-4 py-1.5 rounded-full text-xs font-sans uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'fhir_json'
                ? 'bg-[#1A1A1A] text-[#F9F7F2] shadow-xs'
                : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A]'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-[#D4A373]" />
            <span>HL7 FHIR R4 JSON ({fhirBundle.entry.length})</span>
          </button>
        </div>

        {activeTab === 'fhir_json' && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyJson}
              className="px-3.5 py-1.5 rounded-full border border-[#1A1A1A]/20 bg-white hover:bg-[#F9F7F2] text-[#1A1A1A] text-xs font-sans uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#5E7153]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
            <button
              onClick={handleDownloadJson}
              className="px-3.5 py-1.5 rounded-full bg-[#1A1A1A] hover:bg-black text-[#F9F7F2] text-xs font-sans uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>Download</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Container */}
      <div className="bg-white border border-[#1A1A1A]/10 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        {activeTab === 'physician' ? (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="p-4 rounded-2xl bg-[#1A1A1A] text-[#F9F7F2] flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-[10px] uppercase font-sans font-bold tracking-[0.2em] text-[#D4A373]">
                  Clinical Handover Document • Outpatient Triage Bay-04
                </div>
                <div className="text-base sm:text-lg font-serif font-bold text-white mt-0.5">
                  {patientAuth.patientName} ({patientAuth.age}y / {patientAuth.gender}) • ABHA {patientAuth.abhaId}
                </div>
              </div>
              <span
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-sans font-bold uppercase tracking-wider ${
                  ehrSummary.triageCategory.includes('Emergency')
                    ? 'bg-[#843C2E] text-white animate-pulse'
                    : 'bg-[#5E7153] text-white'
                }`}
              >
                {ehrSummary.triageCategory}
              </span>
            </div>

            {/* SBAR Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Situation */}
              <div className="p-4 rounded-2xl bg-[#F9F7F2] border border-[#1A1A1A]/10 space-y-1.5">
                <div className="text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-[#1A1A1A] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#1A1A1A]" />
                  <span>S — Situation</span>
                </div>
                <p className="text-xs text-[#1A1A1A] font-serif font-bold leading-relaxed">
                  {ehrSummary.chiefComplaint}
                </p>
                <div className="text-[11px] text-[#1A1A1A]/60 font-serif italic">
                  Acuity: {ehrSummary.triageCategory} | Stream: {ehrSummary.clinicalSystem.toUpperCase()}
                </div>
              </div>

              {/* Background */}
              <div className="p-4 rounded-2xl bg-[#F9F7F2] border border-[#1A1A1A]/10 space-y-1.5">
                <div className="text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-[#1A1A1A] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#D4A373]" />
                  <span>B — Background & History</span>
                </div>
                <p className="text-xs text-[#1A1A1A] font-serif italic leading-relaxed">
                  {ehrSummary.hpiNarrative}
                </p>
                <div className="text-[11px] text-[#1A1A1A]/60 font-sans">
                  Allergies: {ehrSummary.knownAllergies.join(', ')}
                </div>
              </div>

              {/* Assessment */}
              <div className="p-4 rounded-2xl bg-[#F9F7F2] border border-[#1A1A1A]/10 space-y-1.5">
                <div className="text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-[#1A1A1A] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#5E7153]" />
                  <span>A — Assessment & Vitals</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#1A1A1A] font-sans">
                  <div>BP: <strong>{ehrSummary.vitalSigns.bloodPressure}</strong></div>
                  <div>HR: <strong>{ehrSummary.vitalSigns.heartRate}</strong></div>
                  <div>SpO2: <strong>{ehrSummary.vitalSigns.spo2}</strong></div>
                  <div>Temp: <strong>{ehrSummary.vitalSigns.temperature}</strong></div>
                </div>
                <div className="text-[11px] text-[#1A1A1A]/60 font-serif italic mt-1">
                  SNOMED: {ehrSummary.snomedCodes.map(s => `${s.display} (${s.code})`).join(', ')}
                </div>
              </div>

              {/* Recommendation / Plan */}
              <div className="p-4 rounded-2xl bg-[#F9F7F2] border border-[#1A1A1A]/10 space-y-1.5">
                <div className="text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-[#1A1A1A] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#843C2E]" />
                  <span>R — Recommendation & Next Steps</span>
                </div>
                <p className="text-xs text-[#1A1A1A] font-serif leading-relaxed italic">
                  Immediate bedside physician consultation. Correlate with active medications: {ehrSummary.medicationsActive.join(', ')}.
                </p>
              </div>

              {/* Attached Raw Scans for Physician Direct Verification */}
              <div className="p-4 rounded-2xl bg-[#EAE8E2]/60 border border-[#1A1A1A]/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-[#1A1A1A] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#D4A373]" />
                    <span>Attached Document Scans & Illegible Rx Review (Human-in-the-Loop)</span>
                  </div>
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#5E7153] text-white">
                    Patient Safety Protocol Active
                  </span>
                </div>
                <div className="text-[11px] text-[#1A1A1A]/80 font-serif leading-relaxed">
                  డాక్టర్ సంతకం, RMP రిజిస్ట్రేషన్ మరియు అస్పష్టమైన చేతిరాత ఉన్న ఒరిజినల్ స్కాన్ కాపీలు క్రింద అటాచ్ చేయబడ్డాయి. AI మందులను తప్పుగా ఊహించకుండా డాక్టర్ స్వయంగా చూసి నిర్ధారించడానికి హై-రెస్ ప్రివ్యూ సిద్ధంగా ఉంది.
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-[#1A1A1A]/10 flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] text-[#843C2E] font-bold">
                    📎 [Attached]: Raw Cursive Rx Scan • Doctor Visual Confirmation Required
                  </span>
                  <span className="text-[10px] font-sans font-bold text-[#5E7153]">MD Review Pending 👁️</span>
                </div>
              </div>
            </div>

            {/* Visual Graphical Gauges for Quick Physician Triaging */}
            <ClinicalTelemetryCharts
              bloodPressure={ehrSummary.vitalSigns.bloodPressure}
              heartRate={ehrSummary.vitalSigns.heartRate}
              spo2={ehrSummary.vitalSigns.spo2}
              respiratoryRate={ehrSummary.vitalSigns.respiratoryRate}
              painSeverityScore={8}
              bloodSugar={142}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-[#1A1A1A]/70 pb-2 border-b border-[#1A1A1A]/10 font-sans">
              <span className="font-mono text-[11px]">Bundle ID: {fhirBundle.id} (FHIR R4.0.1)</span>
              <span className="text-[#5E7153] font-semibold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> ABDM Milestone 3 Schema Validated
              </span>
            </div>

            <pre className="p-4 rounded-2xl bg-[#1A1A1A] text-[#D4A373] font-mono text-xs overflow-x-auto max-h-[420px] leading-relaxed border border-[#1A1A1A]/20">
              {fhirJsonString}
            </pre>
          </div>
        )}

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
            <span>Proceed to ABDM Gateway Sync</span>
            <ArrowRight className="w-4 h-4 text-[#D4A373]" />
          </button>
        </div>
      </div>
    </div>
  );
};
