import React, { useState } from 'react';
import {
  PatientAuth,
  EHRSummary,
  FhirResourceBundle,
  EmergencyRedFlag,
  UploadedDocument,
  QueueToken,
  MedicalSystem,
} from '../types/kiosk';
import {
  Stethoscope,
  Activity,
  HeartPulse,
  FileCode2,
  ShieldAlert,
  Pill,
  User,
  CheckCircle2,
  Clock,
  Printer,
  ChevronRight,
  Sparkles,
  Layers,
  Lock,
  LogOut,
  BadgeCheck,
} from 'lucide-react';
import { DoctorSession } from './DoctorAuthModal';

interface DoctorEmrPortalProps {
  patientAuth: PatientAuth;
  ehrSummary: EHRSummary;
  fhirBundle: FhirResourceBundle;
  redFlag: EmergencyRedFlag;
  uploadedDocs: UploadedDocument[];
  queueToken: QueueToken;
  medicalSystem: MedicalSystem;
  doctorSession?: DoctorSession | null;
  onBackToKiosk: () => void;
  onLockTerminal?: () => void;
}

export const DoctorEmrPortal: React.FC<DoctorEmrPortalProps> = ({
  patientAuth,
  ehrSummary,
  fhirBundle,
  redFlag,
  uploadedDocs,
  queueToken,
  medicalSystem,
  doctorSession,
  onBackToKiosk,
  onLockTerminal,
}) => {
  const [activeTab, setActiveTab] = useState<'chart' | 'fhir' | 'docs'>('chart');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [rxPrescription, setRxPrescription] = useState('');
  const [consultationCompleted, setConsultationCompleted] = useState(false);

  const activeDoctorName = doctorSession?.doctorName || queueToken.doctorName;
  const activeDepartment = doctorSession?.department || queueToken.department;
  const nmcNumber = doctorSession?.nmcRegNo || 'NMC-DL-2018-84920';

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Top Banner: Doctor's Workstation Info */}
      <div className="bg-[#0F172A] text-white rounded-3xl p-5 mb-6 border border-emerald-500/30 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-xs">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-lg text-white">
                {activeDoctorName}
              </span>
              <span className="text-[10px] uppercase font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {queueToken.roomNumber} • {activeDepartment}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                <BadgeCheck className="w-3 h-3 text-emerald-400" />
                {nmcNumber}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-sans mt-0.5">
              Live ABDM EMR Handover Terminal • Queue Token: <strong className="text-emerald-400 font-mono">{queueToken.tokenNumber}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onLockTerminal && (
            <button
              onClick={onLockTerminal}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
              title="Lock Physician Terminal"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Lock Terminal</span>
            </button>
          )}

          <button
            onClick={onBackToKiosk}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs font-sans uppercase tracking-[0.15em] transition-all shadow-md active:scale-98 cursor-pointer"
          >
            ← Return to Kiosk
          </button>
        </div>
      </div>

      {/* Red Flag Warning if applicable */}
      {redFlag.isRedFlag && (
        <div className="mb-6 p-4 rounded-2xl bg-[#9E2A2B] text-white border border-[#9E2A2B]/40 shadow-sm flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 shrink-0 text-white" />
            <div>
              <div className="text-[10px] uppercase font-sans font-bold tracking-[0.2em] text-white/80">
                CRITICAL TRIAGE ALERT DISPATCHED
              </div>
              <div className="text-sm font-serif font-bold">
                {redFlag.primaryCondition} (Acuity: {redFlag.riskScore}/100)
              </div>
            </div>
          </div>
          <span className="text-xs bg-black/30 px-3 py-1 rounded-full border border-white/20 font-sans uppercase tracking-wider">
            STAT PROTOCOL ACTIVE
          </span>
        </div>
      )}

      {/* Main EMR Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Patient Demographic & Triage Card */}
        <div className="space-y-4">
          <div className="bg-white border border-[#1A1A1A]/10 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]/10">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#D4A373]" />
                <span className="text-xs font-sans font-bold uppercase tracking-[0.15em] text-[#1A1A1A]">
                  Patient Profile
                </span>
              </div>
              <span className="text-[10px] font-sans font-bold px-2.5 py-0.5 rounded-full bg-[#5E7153]/15 text-[#5E7153]">
                ABDM Verified
              </span>
            </div>

            <div className="space-y-2 text-xs font-serif">
              <div>
                <div className="text-[10px] text-[#1A1A1A]/50 font-sans uppercase tracking-wider font-semibold">Full Name</div>
                <div className="font-bold text-[#1A1A1A] text-base">{patientAuth.patientName}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[10px] text-[#1A1A1A]/50 font-sans uppercase tracking-wider font-semibold">Age / Gender</div>
                  <div className="font-medium text-[#1A1A1A]">{patientAuth.age} Years • {patientAuth.gender}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#1A1A1A]/50 font-sans uppercase tracking-wider font-semibold">Contact Phone</div>
                  <div className="font-medium text-[#1A1A1A]">{patientAuth.phone}</div>
                </div>
              </div>
              <div>
                <div className="text-[10px] text-[#1A1A1A]/50 font-sans uppercase tracking-wider font-semibold">14-Digit ABHA ID</div>
                <div className="font-sans font-bold text-[#1A1A1A]">{patientAuth.abhaId}</div>
              </div>
              <div>
                <div className="text-[10px] text-[#1A1A1A]/50 font-sans uppercase tracking-wider font-semibold">ABHA Address</div>
                <div className="font-sans text-[#1A1A1A]/70 text-[11px]">{patientAuth.abhaAddress}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1A1A1A]/10">
              <div className="text-[10px] text-[#1A1A1A]/60 font-sans uppercase tracking-wider font-semibold mb-2">
                Vitals Telemetry (Kiosk Ingest)
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-2xl bg-[#F9F7F2] border border-[#1A1A1A]/10">
                  <div className="text-[9px] text-[#1A1A1A]/60 font-sans uppercase">BP</div>
                  <div className="font-serif font-bold text-[#1A1A1A]">{ehrSummary.vitalSigns.bloodPressure}</div>
                </div>
                <div className="p-2.5 rounded-2xl bg-[#F9F7F2] border border-[#1A1A1A]/10">
                  <div className="text-[9px] text-[#1A1A1A]/60 font-sans uppercase">Heart Rate</div>
                  <div className="font-serif font-bold text-[#1A1A1A]">{ehrSummary.vitalSigns.heartRate}</div>
                </div>
                <div className="p-2.5 rounded-2xl bg-[#F9F7F2] border border-[#1A1A1A]/10">
                  <div className="text-[9px] text-[#1A1A1A]/60 font-sans uppercase">SpO2</div>
                  <div className="font-serif font-bold text-[#1A1A1A]">{ehrSummary.vitalSigns.spo2}</div>
                </div>
                <div className="p-2.5 rounded-2xl bg-[#F9F7F2] border border-[#1A1A1A]/10">
                  <div className="text-[9px] text-[#1A1A1A]/60 font-sans uppercase">Temp</div>
                  <div className="font-serif font-bold text-[#1A1A1A]">{ehrSummary.vitalSigns.temperature}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Active OCR Meds & Allergy Strip */}
          <div className="bg-white border border-[#1A1A1A]/10 rounded-3xl p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-sans font-bold uppercase tracking-[0.15em] text-[#1A1A1A] flex items-center gap-1.5">
              <Pill className="w-4 h-4 text-[#D4A373]" />
              <span>Active OCR Medications ({ehrSummary.medicationsActive.length})</span>
            </h3>
            <div className="space-y-1.5">
              {ehrSummary.medicationsActive.map((med, idx) => (
                <div key={idx} className="p-2.5 rounded-2xl bg-[#F9F7F2] border border-[#1A1A1A]/10 text-xs font-serif text-[#1A1A1A]">
                  {med}
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#1A1A1A]/10">
              <div className="text-[10px] text-[#9E2A2B] font-sans font-bold uppercase tracking-wider mb-1">Known Allergies:</div>
              <div className="text-xs font-serif text-[#1A1A1A]">{ehrSummary.knownAllergies.join(', ')}</div>
            </div>
          </div>
        </div>

        {/* Center & Right 2 Cols: Clinical Consultation Area */}
        <div className="lg:col-span-2 space-y-4">
          {/* View Switcher in EMR */}
          <div className="flex bg-[#EAE8E2] p-1 rounded-full border border-[#1A1A1A]/10 max-w-xs">
            <button
              onClick={() => setActiveTab('chart')}
              className={`px-4 py-2 rounded-full text-xs font-sans uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'chart' ? 'bg-white text-[#1A1A1A] font-bold shadow-xs' : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A]'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-[#5E7153]" />
              <span>Triage Chart</span>
            </button>

            <button
              onClick={() => setActiveTab('fhir')}
              className={`px-4 py-2 rounded-full text-xs font-sans uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'fhir' ? 'bg-white text-[#1A1A1A] font-bold shadow-xs' : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A]'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>FHIR R4 Bundle</span>
            </button>
          </div>

          {activeTab === 'chart' ? (
            <div className="bg-white border border-[#1A1A1A]/10 rounded-3xl p-6 shadow-xs space-y-6">
              {/* Chief Complaint & HPI */}
              <div>
                <div className="text-[10px] uppercase font-sans font-bold tracking-wider text-[#1A1A1A]/60 mb-1">Chief Complaint</div>
                <div className="p-3.5 rounded-2xl bg-[#F9F7F2] border border-[#1A1A1A]/10 text-sm font-serif font-bold text-[#1A1A1A]">
                  {ehrSummary.chiefComplaint}
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase font-sans font-bold tracking-wider text-[#1A1A1A]/60 mb-1">
                  History of Present Illness (Auto-Transcribed from Voice/Touch Kiosk)
                </div>
                <div className="p-4 rounded-2xl bg-[#F9F7F2] border border-[#1A1A1A]/10 text-xs sm:text-sm text-[#1A1A1A] font-serif leading-relaxed">
                  {ehrSummary.hpiNarrative}
                </div>
              </div>

              {/* Codification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#EAE8E2]/60 border border-[#1A1A1A]/10">
                  <div className="text-[10px] uppercase font-sans font-bold tracking-wider text-[#1A1A1A]/70 mb-1">SNOMED CT</div>
                  <div className="space-y-1 text-xs text-[#1A1A1A] font-serif">
                    {ehrSummary.snomedCodes.map((s) => (
                      <div key={s.code} className="font-medium">
                        {s.display} <span className="font-sans text-[10px] text-[#1A1A1A]/60">({s.code})</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#5E7153]/10 border border-[#5E7153]/25">
                  <div className="text-[10px] uppercase font-sans font-bold tracking-wider text-[#5E7153] mb-1">ICD-10-CM</div>
                  <div className="space-y-1 text-xs text-[#1A1A1A] font-serif">
                    {ehrSummary.icd10Codes.map((icd) => (
                      <div key={icd.code} className="font-medium">
                        {icd.display} <span className="font-sans text-[10px] text-[#1A1A1A]/60">({icd.code})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Doctor Clinical Notes & Rx Input */}
              <div className="pt-4 border-t border-[#1A1A1A]/10 space-y-4">
                <h4 className="text-xs font-sans font-bold uppercase tracking-[0.15em] text-[#1A1A1A]">
                  Physician Assessment & e-Prescription
                </h4>

                <div>
                  <label className="block text-xs font-serif font-bold text-[#1A1A1A] mb-1">
                    Doctor's Clinical Impression & Treatment Plan
                  </label>
                  <textarea
                    rows={3}
                    value={doctorNotes}
                    onChange={(e) => setDoctorNotes(e.target.value)}
                    placeholder="e.g. Advise 12-Lead ECG correlation, Troponin-I serial follow-up, cardiology bed admission."
                    className="w-full p-3.5 rounded-2xl border border-[#1A1A1A]/20 text-xs font-serif text-slate-900 font-medium focus:ring-1 focus:ring-[#1A1A1A] focus:outline-none bg-[#F9F7F2]"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setConsultationCompleted(true)}
                    className="px-6 py-3 rounded-full bg-[#1A1A1A] hover:bg-black text-[#F9F7F2] text-xs font-sans uppercase tracking-[0.15em] shadow-sm flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#5E7153]" />
                    <span>{consultationCompleted ? 'Consultation Completed & Signed' : 'Sign & Complete Consultation'}</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2.5 rounded-full border border-[#1A1A1A]/20 hover:bg-[#EAE8E2]/50 text-[#1A1A1A] text-xs font-sans uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#1A1A1A]" /> Print EMR Summary
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#1A1A1A] text-[#D4A373] p-5 rounded-3xl border border-white/10 font-mono text-xs overflow-x-auto max-h-[500px]">
              <pre>{JSON.stringify(fhirBundle, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
