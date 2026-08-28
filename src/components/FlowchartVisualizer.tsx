import React from 'react';
import { KioskStep, MedicalSystem } from '../types/kiosk';
import {
  UserCheck,
  FileCheck2,
  Mic,
  Stethoscope,
  Activity,
  AlertTriangle,
  FileText,
  ClipboardList,
  Volume2,
  FileCode2,
  RefreshCw,
  Trash2,
  UserRoundCheck,
  CheckCircle2,
  ArrowDown,
  ArrowRight,
} from 'lucide-react';

interface FlowchartVisualizerProps {
  currentStep: KioskStep;
  medicalSystem: MedicalSystem;
  isRedFlag: boolean;
  onSelectStep: (step: KioskStep) => void;
}

interface FlowNode {
  id: KioskStep;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  branch?: 'allopathic' | 'ayush' | 'emergency_yes' | 'emergency_no';
}

export const FlowchartVisualizer: React.FC<FlowchartVisualizerProps> = ({
  currentStep,
  medicalSystem,
  isRedFlag,
  onSelectStep,
}) => {
  const isCompleted = (step: KioskStep) => {
    const stepOrder: KioskStep[] = [
      'start',
      'auth',
      'consent',
      'input_method',
      'medical_system',
      'socrates',
      'dashavidha',
      'red_flag_alert',
      'doc_upload',
      'ehr_summary',
      'audio_confirm',
      'physician_fhir',
      'abdm_sync',
      'data_purge',
      'handover',
    ];
    return stepOrder.indexOf(step) < stepOrder.indexOf(currentStep);
  };

  const isCurrent = (step: KioskStep) => currentStep === step;

  const getNodeClass = (step: KioskStep, isEmergencyBranch = false) => {
    if (isEmergencyBranch && isRedFlag) {
      return 'border-[#9E2A2B] bg-[#9E2A2B]/20 text-[#F9F7F2] shadow-sm ring-1 ring-[#9E2A2B]';
    }
    if (isCurrent(step)) {
      return 'border-[#D4A373] bg-[#D4A373]/15 text-[#F9F7F2] shadow-sm ring-1 ring-[#D4A373] font-medium';
    }
    if (isCompleted(step)) {
      return 'border-[#5E7153]/40 bg-[#5E7153]/15 text-[#F9F7F2] hover:bg-[#5E7153]/25';
    }
    return 'border-white/10 bg-white/5 text-[#F9F7F2]/80 hover:border-white/20 hover:bg-white/10';
  };

  return (
    <div className="bg-[#1A1A1A] text-[#F9F7F2] rounded-3xl p-5 md:p-7 shadow-xl border border-white/10 backdrop-blur-md">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#5E7153] animate-ping" />
            <h3 className="text-xs font-sans font-bold tracking-[0.2em] text-[#F9F7F2] uppercase">
              Interactive Workflow Architecture
            </h3>
          </div>
          <p className="text-xs text-[#F9F7F2]/60 mt-0.5 font-serif italic">
            Click any step to inspect or navigate the clinical intake state engine
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-sans">
          <span className="flex items-center gap-1.5 text-[#D4A373]">
            <span className="w-2 h-2 rounded-full bg-[#D4A373]" /> Active
          </span>
          <span className="flex items-center gap-1.5 text-[#5E7153]">
            <span className="w-2 h-2 rounded-full bg-[#5E7153]" /> Completed
          </span>
          <span className="flex items-center gap-1.5 text-[#9E2A2B]">
            <span className="w-2 h-2 rounded-full bg-[#9E2A2B]" /> Red Flag Alert
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2.5 max-w-2xl mx-auto py-2">
        {/* Start: Patient Arrives at Kiosk */}
        <button
          onClick={() => onSelectStep('start')}
          className={`w-full max-w-md p-3 rounded-full border text-center transition-all flex items-center justify-center gap-2 cursor-pointer ${
            isCurrent('start') ? 'bg-[#D4A373] text-[#1A1A1A] font-bold shadow-sm' : 'bg-white/5 text-[#F9F7F2] border-white/10 hover:bg-white/10'
          }`}
        >
          <span className="font-sans text-xs uppercase tracking-[0.15em]">Start: Patient Arrives at Kiosk</span>
        </button>

        <ArrowDown className="w-3.5 h-3.5 text-white/30" />

        {/* Authentication */}
        <button
          onClick={() => onSelectStep('auth')}
          className={`w-full max-w-md p-2.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
            getNodeClass('auth')
          }`}
        >
          <div className="flex items-center gap-2.5">
            <UserCheck className="w-4 h-4 text-[#D4A373] shrink-0" />
            <div>
              <div className="text-xs font-sans font-bold">Authentication</div>
              <div className="text-[10px] font-serif italic opacity-75">(ABHA ID or Biometric)</div>
            </div>
          </div>
          {isCompleted('auth') && <CheckCircle2 className="w-4 h-4 text-[#5E7153]" />}
        </button>

        <ArrowDown className="w-3.5 h-3.5 text-white/30" />

        {/* Audio Consent */}
        <button
          onClick={() => onSelectStep('consent')}
          className={`w-full max-w-md p-2.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
            getNodeClass('consent')
          }`}
        >
          <div className="flex items-center gap-2.5">
            <FileCheck2 className="w-4 h-4 text-[#D4A373] shrink-0" />
            <div>
              <div className="text-xs font-sans font-bold">Audio Consent</div>
              <div className="text-[10px] font-serif italic opacity-75">(DPDP Act 2023)</div>
            </div>
          </div>
          {isCompleted('consent') && <CheckCircle2 className="w-4 h-4 text-[#5E7153]" />}
        </button>

        <ArrowDown className="w-3.5 h-3.5 text-white/30" />

        {/* Input Method */}
        <button
          onClick={() => onSelectStep('input_method')}
          className={`w-full max-w-md p-2.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
            getNodeClass('input_method')
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Mic className="w-4 h-4 text-[#D4A373] shrink-0" />
            <div>
              <div className="text-xs font-sans font-bold">Input Method</div>
              <div className="text-[10px] font-serif italic opacity-75">(Voice ASR in Indian Languages or Touch UI)</div>
            </div>
          </div>
          {isCompleted('input_method') && <CheckCircle2 className="w-4 h-4 text-[#5E7153]" />}
        </button>

        <ArrowDown className="w-3.5 h-3.5 text-white/30" />

        {/* Medical System Decision Diamond */}
        <button
          onClick={() => onSelectStep('medical_system')}
          className={`w-full max-w-xs p-2.5 rounded-2xl border text-center transition-all bg-[#D4A373]/10 border-[#D4A373]/30 text-[#D4A373] cursor-pointer ${
            isCurrent('medical_system') ? 'ring-1 ring-[#D4A373] font-bold bg-[#D4A373]/20' : 'hover:bg-[#D4A373]/15'
          }`}
        >
          <div className="text-xs font-sans font-bold uppercase tracking-wider">Medical System?</div>
          <div className="text-[10px] font-serif italic opacity-80 mt-0.5">Allopathic vs AYUSH Choice</div>
        </button>

        {/* Branching: Allopathic vs AYUSH */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-lg mt-1">
          {/* Branch 1: SOCRATES (Allopathic) */}
          <div className="flex flex-col items-center gap-1">
            <div className="text-[10px] font-sans uppercase tracking-wider text-[#D4A373] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A373]" /> Allopathic
            </div>
            <button
              onClick={() => onSelectStep('socrates')}
              className={`w-full p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                getNodeClass('socrates')
              } ${medicalSystem === 'allopathic' ? 'ring-1 ring-[#D4A373]' : 'opacity-60'}`}
            >
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-[#D4A373] shrink-0" />
                <div className="text-xs font-sans font-bold">SOCRATES</div>
              </div>
              <div className="text-[10px] font-serif italic opacity-75 mt-0.5">8-Point Clinical Assessment</div>
            </button>
          </div>

          {/* Branch 2: Dashavidha (AYUSH) */}
          <div className="flex flex-col items-center gap-1">
            <div className="text-[10px] font-sans uppercase tracking-wider text-[#5E7153] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5E7153]" /> AYUSH
            </div>
            <button
              onClick={() => onSelectStep('dashavidha')}
              className={`w-full p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                getNodeClass('dashavidha')
              } ${medicalSystem === 'ayush' ? 'ring-1 ring-[#5E7153]' : 'opacity-60'}`}
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#5E7153] shrink-0" />
                <div className="text-xs font-sans font-bold">Dashavidha</div>
              </div>
              <div className="text-[10px] font-serif italic opacity-75 mt-0.5">10-Fold Ayurvedic Assessment</div>
            </button>
          </div>
        </div>

        <ArrowDown className="w-3.5 h-3.5 text-white/30" />

        {/* Emergency Red-Flag Decision Diamond */}
        <div className="w-full max-w-md relative flex flex-col items-center">
          <div className="w-full max-w-xs p-2.5 rounded-2xl border text-center bg-[#9E2A2B]/20 border-[#9E2A2B]/40 text-[#F9F7F2]">
            <div className="text-xs font-sans font-bold uppercase tracking-wider">Emergency Red-Flag Detected?</div>
          </div>

          {/* Red Flag YES branch */}
          <div className="w-full grid grid-cols-2 gap-3 mt-2">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-[#9E2A2B] font-sans font-bold mb-1 flex items-center gap-1">
                <ArrowDown className="w-3 h-3" /> Yes (Critical)
              </span>
              <button
                onClick={() => onSelectStep('red_flag_alert')}
                className={`w-full p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isRedFlag
                    ? 'border-[#9E2A2B] bg-[#9E2A2B] text-white font-bold shadow-md animate-pulse'
                    : 'border-[#9E2A2B]/40 bg-[#9E2A2B]/10 text-[#F9F7F2] hover:bg-[#9E2A2B]/20'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-[#F9F7F2] shrink-0" />
                  <div className="text-[11px] leading-tight font-sans font-bold">Immediate Emergency Protocol & Alert</div>
                </div>
              </button>
            </div>

            {/* Red Flag NO branch */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-[#5E7153] font-sans font-bold mb-1 flex items-center gap-1">
                <ArrowDown className="w-3 h-3" /> No (Proceed)
              </span>
              <button
                onClick={() => onSelectStep('doc_upload')}
                className={`w-full p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  getNodeClass('doc_upload')
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#D4A373] shrink-0" />
                  <div>
                    <div className="text-[11px] font-sans font-bold">Document Upload</div>
                    <div className="text-[9px] font-serif italic opacity-75">(OCR Extraction)</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <ArrowDown className="w-3.5 h-3.5 text-white/30" />

        {/* EHR Summary Generation */}
        <button
          onClick={() => onSelectStep('ehr_summary')}
          className={`w-full max-w-md p-2.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
            getNodeClass('ehr_summary')
          }`}
        >
          <div className="flex items-center gap-2.5">
            <ClipboardList className="w-4 h-4 text-[#D4A373] shrink-0" />
            <div className="text-xs font-sans font-bold">EHR Summary Generation</div>
          </div>
          {isCompleted('ehr_summary') && <CheckCircle2 className="w-4 h-4 text-[#5E7153]" />}
        </button>

        <ArrowDown className="w-3.5 h-3.5 text-white/30" />

        {/* Audio Confirmation */}
        <button
          onClick={() => onSelectStep('audio_confirm')}
          className={`w-full max-w-md p-2.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
            getNodeClass('audio_confirm')
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Volume2 className="w-4 h-4 text-[#D4A373] shrink-0" />
            <div>
              <div className="text-xs font-sans font-bold">Audio Confirmation</div>
              <div className="text-[10px] font-serif italic opacity-75">(Review & Confirm Details)</div>
            </div>
          </div>
          {isCompleted('audio_confirm') && <CheckCircle2 className="w-4 h-4 text-[#5E7153]" />}
        </button>

        <ArrowDown className="w-3.5 h-3.5 text-white/30" />

        {/* Physician Summary & FHIR Encoding */}
        <button
          onClick={() => onSelectStep('physician_fhir')}
          className={`w-full max-w-md p-2.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
            getNodeClass('physician_fhir')
          }`}
        >
          <div className="flex items-center gap-2.5">
            <FileCode2 className="w-4 h-4 text-[#D4A373] shrink-0" />
            <div>
              <div className="text-xs font-sans font-bold">Physician Summary & FHIR Encoding</div>
              <div className="text-[10px] font-serif italic opacity-75">(HL7 FHIR R4 Bundle)</div>
            </div>
          </div>
          {isCompleted('physician_fhir') && <CheckCircle2 className="w-4 h-4 text-[#5E7153]" />}
        </button>

        <ArrowDown className="w-3.5 h-3.5 text-white/30" />

        {/* ABDM Sync */}
        <button
          onClick={() => onSelectStep('abdm_sync')}
          className={`w-full max-w-md p-2.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
            getNodeClass('abdm_sync')
          }`}
        >
          <div className="flex items-center gap-2.5">
            <RefreshCw className="w-4 h-4 text-[#D4A373] shrink-0" />
            <div>
              <div className="text-xs font-sans font-bold">ABDM Sync</div>
              <div className="text-[10px] font-serif italic opacity-75">(Link to Health ID)</div>
            </div>
          </div>
          {isCompleted('abdm_sync') && <CheckCircle2 className="w-4 h-4 text-[#5E7153]" />}
        </button>

        <ArrowDown className="w-3.5 h-3.5 text-white/30" />

        {/* Data Purging */}
        <button
          onClick={() => onSelectStep('data_purge')}
          className={`w-full max-w-md p-2.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
            getNodeClass('data_purge')
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Trash2 className="w-4 h-4 text-[#D4A373] shrink-0" />
            <div>
              <div className="text-xs font-sans font-bold">Data Purging</div>
              <div className="text-[10px] font-serif italic opacity-75">(Local Data Removal • DPDP Act)</div>
            </div>
          </div>
          {isCompleted('data_purge') && <CheckCircle2 className="w-4 h-4 text-[#5E7153]" />}
        </button>

        <ArrowDown className="w-3.5 h-3.5 text-white/30" />

        {/* End: Physician Handover & Consultation */}
        <button
          onClick={() => onSelectStep('handover')}
          className={`w-full max-w-md p-3 rounded-full border text-center transition-all flex items-center justify-center gap-2 cursor-pointer ${
            isCurrent('handover') ? 'bg-[#5E7153] text-[#F9F7F2] font-bold shadow-sm' : 'bg-white/5 text-[#F9F7F2] border-white/10 hover:bg-white/10'
          }`}
        >
          <UserRoundCheck className="w-4 h-4 text-[#D4A373]" />
          <span className="font-sans text-xs uppercase tracking-[0.15em]">End: Physician Handover & Consultation</span>
        </button>
      </div>
    </div>
  );
};
