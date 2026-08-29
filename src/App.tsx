/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Language,
  KioskStep,
  MedicalSystem,
  InputMode,
  PatientAuth,
  DPDPDataConsent,
  SocratesAssessment,
  DashavidhaPariksha,
  EmergencyRedFlag,
  UploadedDocument,
  EHRSummary,
  FhirResourceBundle,
  AbdmSyncStatus,
  DataPurgeStatus,
  QueueToken,
} from './types/kiosk';
import { SAMPLE_PATIENTS, PatientPreset } from './data/mockPatients';
import { evaluateSocratesEmergency, generateAllopathicEHRSummary } from './utils/socratesEngine';
import { evaluateAyushEmergency, generateAyushEHRSummary } from './utils/ayushEngine';
import { generateFhirR4Bundle } from './utils/fhirGenerator';
import { Header } from './components/Header';
import { FlowchartVisualizer } from './components/FlowchartVisualizer';
import { DoctorEmrPortal } from './components/DoctorEmrPortal';
import { DoctorAuthModal, DoctorSession } from './components/DoctorAuthModal';
import { NeuralBiometricBackground } from './components/common/NeuralBiometricBackground';

// Screens
import { Step0Start } from './components/screens/Step0Start';
import { Step1Authentication } from './components/screens/Step1Authentication';
import { Step2AudioConsent } from './components/screens/Step2AudioConsent';
import { Step3InputMethod } from './components/screens/Step3InputMethod';
import { Step4MedicalSystem } from './components/screens/Step4MedicalSystem';
import { Step5AllopathicSocrates } from './components/screens/Step5AllopathicSocrates';
import { Step5AyushDashavidha } from './components/screens/Step5AyushDashavidha';
import { Step6EmergencyRedFlag } from './components/screens/Step6EmergencyRedFlag';
import { Step7DocumentUploadOcr } from './components/screens/Step7DocumentUploadOcr';
import { Step8EHRSummary } from './components/screens/Step8EHRSummary';
import { Step9AudioConfirmation } from './components/screens/Step9AudioConfirmation';
import { Step10PhysicianSummaryFhir } from './components/screens/Step10PhysicianSummaryFhir';
import { Step11AbdmSync } from './components/screens/Step11AbdmSync';
import { Step12DataPurging } from './components/screens/Step12DataPurging';
import { Step13PhysicianHandover } from './components/screens/Step13PhysicianHandover';

export default function App() {
  // Global App States
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeView, setActiveView] = useState<'kiosk' | 'flowchart' | 'doctor_portal'>('kiosk');
  const [currentStep, setCurrentStep] = useState<KioskStep>('start');

  // Physician / Doctor Session Auth Gate (Restricted Access)
  const [doctorSession, setDoctorSession] = useState<DoctorSession | null>(null);
  const [isDoctorAuthModalOpen, setIsDoctorAuthModalOpen] = useState(false);

  // Active Patient States (Default loaded with Ramesh Kumar persona)
  const defaultPreset = SAMPLE_PATIENTS[0];
  const [patientAuth, setPatientAuth] = useState<PatientAuth>(defaultPreset.auth);
  const [medicalSystem, setMedicalSystem] = useState<MedicalSystem>(defaultPreset.preferredSystem);
  const [inputMode, setInputMode] = useState<InputMode>('touch');
  const [socratesData, setSocratesData] = useState<SocratesAssessment>(defaultPreset.socrates);
  const [dashavidhaData, setDashavidhaData] = useState<DashavidhaPariksha>(defaultPreset.dashavidha);
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocument[]>(defaultPreset.initialDocs);

  // DPDP Consent State
  const [dpdpConsent, setDpdpConsent] = useState<DPDPDataConsent>({
    consentId: 'DPDP-CON-INIT',
    timestamp: new Date().toISOString(),
    dpdpActVersion: 'DPDP Act 2023 - Sec 6(1)',
    purpose: 'OPD Clinical Triage & Tele-consultation EHR Generation',
    retentionPeriod: 'Session Only (Ephemeral Kiosk Execution)',
    voiceConsentRecorded: true,
    digitalSignatureAccepted: true,
    language: 'en',
  });

  // Evaluate Emergency Red-Flag dynamically
  const redFlagStatus: EmergencyRedFlag = useMemo(() => {
    if (medicalSystem === 'allopathic') {
      return evaluateSocratesEmergency(socratesData);
    } else {
      return evaluateAyushEmergency(dashavidhaData);
    }
  }, [medicalSystem, socratesData, dashavidhaData]);

  // Generate EHR Summary dynamically
  const ehrSummary: EHRSummary = useMemo(() => {
    const allEntities = uploadedDocs.flatMap((d) => d.extractedEntities);
    if (medicalSystem === 'allopathic') {
      return generateAllopathicEHRSummary(
        patientAuth.patientName,
        patientAuth.age,
        patientAuth.gender,
        socratesData,
        redFlagStatus,
        allEntities
      );
    } else {
      return generateAyushEHRSummary(
        patientAuth.patientName,
        patientAuth.age,
        patientAuth.gender,
        dashavidhaData,
        redFlagStatus,
        allEntities
      );
    }
  }, [patientAuth, medicalSystem, socratesData, dashavidhaData, redFlagStatus, uploadedDocs]);

  // Generate FHIR R4 Bundle
  const fhirBundle: FhirResourceBundle = useMemo(() => {
    return generateFhirR4Bundle(
      patientAuth,
      ehrSummary,
      dpdpConsent,
      medicalSystem,
      socratesData,
      dashavidhaData
    );
  }, [patientAuth, ehrSummary, dpdpConsent, medicalSystem, socratesData, dashavidhaData]);

  // ABDM Sync Status
  const abdmSyncStatus: AbdmSyncStatus = useMemo(() => {
    return {
      isSynced: true,
      hipId: 'IN0810000001 (AIIMS New Delhi)',
      hiuId: 'HIU-DEL-AIIMS-01',
      careContextReference: `OPD-VISIT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      transactionId: `ABDM-TXN-${Date.now().toString(36).toUpperCase()}`,
      consentArtefactId: dpdpConsent.consentId,
      gatewayTimestamp: new Date().toLocaleTimeString(),
    };
  }, [dpdpConsent]);

  // Data Purge Status
  const purgeStatus: DataPurgeStatus = useMemo(() => {
    return {
      isPurged: true,
      purgedAt: new Date().toLocaleTimeString(),
      method: 'DoD 5220.22-M Ephemeral RAM Overwrite & Local Storage Cache Zeroed',
      retainedRecords: 'Zero on Local Kiosk (DPDP Act Sec 8 Compliance)',
      sessionTokenEncrypted: `ENC_JWT_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    };
  }, [currentStep]);

  // Queue Token
  const queueToken: QueueToken = useMemo(() => {
    const isEmergency = redFlagStatus.isRedFlag;
    const isAyush = medicalSystem === 'ayush';
    return {
      tokenNumber: isEmergency ? 'EMERGENCY-01' : isAyush ? 'AYUSH-OPD-019' : 'OPD-CARD-042',
      roomNumber: isEmergency ? 'Emergency Bay 01 (Red Zone)' : isAyush ? 'Room 208 - Panchakarma Clinic' : 'Room 104 - Cardiology OPD',
      doctorName: isEmergency ? 'Dr. Vikram Rathore, MD (Emergency Medicine)' : isAyush ? 'Vaidya Anand Shastri, BAMS, MD (Ayurveda)' : 'Dr. Priya Sharma, MD, DM (Cardiology)',
      department: isEmergency ? 'Emergency Resuscitation Unit' : isAyush ? 'Ayurvedic Medicine & Panchakarma' : 'Department of Cardiology',
      estimatedWaitMinutes: isEmergency ? 0 : isAyush ? 10 : 15,
      queuePosition: isEmergency ? 1 : 4,
      qrCodeUrl: 'https://abdm.gov.in/qr',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }, [redFlagStatus, medicalSystem]);

  // Quick Preset Loader
  const handleQuickLoadPatient = (preset: PatientPreset) => {
    setPatientAuth(preset.auth);
    setMedicalSystem(preset.preferredSystem);
    setSocratesData(preset.socrates);
    setDashavidhaData(preset.dashavidha);
    setUploadedDocs(preset.initialDocs);
    setCurrentStep('auth');
    setActiveView('kiosk');
  };

  // Emergency SOS Manual Trigger
  const handleEmergencySos = () => {
    // Escalate current patient to emergency
    setSocratesData((prev) => ({
      ...prev,
      site: 'Substernal Precordial Chest',
      siteLocationCategory: 'chest',
      character: 'Crushing / Constricting',
      radiation: 'Left arm, shoulder & jaw',
      associations: ['Diaphoresis (Profuse sweating)', 'Dyspnea (Shortness of breath)'],
      severityScore: 10,
    }));
    setCurrentStep('red_flag_alert');
    setActiveView('kiosk');
  };

  // Navigation with Doctor Auth Guard
  const handleViewChange = (view: 'kiosk' | 'flowchart' | 'doctor_portal') => {
    if (view === 'doctor_portal' && !doctorSession) {
      setIsDoctorAuthModalOpen(true);
      return;
    }
    setActiveView(view);
  };

  const handleDoctorAuthSuccess = (session: DoctorSession) => {
    setDoctorSession(session);
    setIsDoctorAuthModalOpen(false);
    setActiveView('doctor_portal');
  };

  const handleLockDoctorTerminal = () => {
    setDoctorSession(null);
    setActiveView('kiosk');
  };

  // Reset Kiosk
  const handleResetKiosk = () => {
    setPatientAuth({
      abhaId: '91-8274-1928-3310',
      abhaAddress: 'new.patient@abdm',
      patientName: 'New Patient',
      age: 45,
      gender: 'Male',
      phone: '+91 98000 00000',
      aadhaarLast4: '0000',
      authMethod: 'biometric_thumb',
      isAuthenticated: false,
    });
    setCurrentStep('start');
    setActiveView('kiosk');
  };

  return (
    <div className="relative min-h-screen bg-transparent text-slate-100 flex flex-col antialiased selection:bg-emerald-500 selection:text-black overflow-x-hidden">
      {/* 3D Interactive Cyber Neural Network Background */}
      <NeuralBiometricBackground />

      {/* Universal Top Header */}
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        activeView={activeView}
        onViewChange={handleViewChange}
        onEmergencyTrigger={handleEmergencySos}
        patientAuth={patientAuth}
        redFlag={redFlagStatus}
        doctorSession={doctorSession}
      />

      {/* Physician Restricted Access Authentication Modal */}
      <DoctorAuthModal
        isOpen={isDoctorAuthModalOpen}
        onClose={() => setIsDoctorAuthModalOpen(false)}
        onSuccess={handleDoctorAuthSuccess}
      />

      {/* Main App Canvas */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-6 flex flex-col justify-center">
        {/* VIEW 1: Interactive Flowchart Architecture Map */}
        {activeView === 'flowchart' && (
          <div className="space-y-4">
            <FlowchartVisualizer
              currentStep={currentStep}
              medicalSystem={medicalSystem}
              isRedFlag={redFlagStatus.isRedFlag}
              onSelectStep={(step) => {
                setCurrentStep(step);
                setActiveView('kiosk');
              }}
            />
          </div>
        )}

        {/* VIEW 2: Doctor's Live EMR Consultation Portal */}
        {activeView === 'doctor_portal' && (
          <DoctorEmrPortal
            patientAuth={patientAuth}
            ehrSummary={ehrSummary}
            fhirBundle={fhirBundle}
            redFlag={redFlagStatus}
            uploadedDocs={uploadedDocs}
            queueToken={queueToken}
            medicalSystem={medicalSystem}
            doctorSession={doctorSession}
            onBackToKiosk={() => setActiveView('kiosk')}
            onLockTerminal={handleLockDoctorTerminal}
          />
        )}

        {/* VIEW 3: Patient Kiosk Terminal Experience */}
        {activeView === 'kiosk' && (
          <div className="w-full">
            {/* Step 0: Start Screen */}
            {currentStep === 'start' && (
              <Step0Start
                language={currentLanguage}
                onStart={() => setCurrentStep('auth')}
                onQuickLoadPatient={handleQuickLoadPatient}
              />
            )}

            {/* Step 1: Authentication */}
            {currentStep === 'auth' && (
              <Step1Authentication
                language={currentLanguage}
                authData={patientAuth}
                onAuthenticate={(auth) => {
                  setPatientAuth(auth);
                  setCurrentStep('consent');
                }}
                onBack={() => setCurrentStep('start')}
                onQuickLoadPatient={handleQuickLoadPatient}
              />
            )}

            {/* Step 2: Audio Consent (DPDP Act 2023) */}
            {currentStep === 'consent' && (
              <Step2AudioConsent
                language={currentLanguage}
                patientAuth={patientAuth}
                soundEnabled={soundEnabled}
                onConsentGiven={(consent) => {
                  setDpdpConsent(consent);
                  setCurrentStep('input_method');
                }}
                onBack={() => setCurrentStep('auth')}
              />
            )}

            {/* Step 3: Input Method (Voice vs Touch) */}
            {currentStep === 'input_method' && (
              <Step3InputMethod
                language={currentLanguage}
                selectedMode={inputMode}
                onSelectMode={(mode) => {
                  setInputMode(mode);
                  setCurrentStep('medical_system');
                }}
                onBack={() => setCurrentStep('consent')}
              />
            )}

            {/* Step 4: Medical System Decision (Allopathic vs AYUSH) */}
            {currentStep === 'medical_system' && (
              <Step4MedicalSystem
                language={currentLanguage}
                selectedSystem={medicalSystem}
                onSelectSystem={(sys) => {
                  setMedicalSystem(sys);
                  if (sys === 'allopathic') {
                    setCurrentStep('socrates');
                  } else {
                    setCurrentStep('dashavidha');
                  }
                }}
                onBack={() => setCurrentStep('input_method')}
              />
            )}

            {/* Step 5A: Allopathic SOCRATES Protocol */}
            {currentStep === 'socrates' && (
              <Step5AllopathicSocrates
                language={currentLanguage}
                inputMode={inputMode}
                initialData={socratesData}
                onSubmitSocrates={(updated) => {
                  setSocratesData(updated);
                  const evalResult = evaluateSocratesEmergency(updated);
                  if (evalResult.isRedFlag) {
                    setCurrentStep('red_flag_alert');
                  } else {
                    setCurrentStep('doc_upload');
                  }
                }}
                onBack={() => setCurrentStep('medical_system')}
              />
            )}

            {/* Step 5B: AYUSH Dashavidha Pariksha */}
            {currentStep === 'dashavidha' && (
              <Step5AyushDashavidha
                language={currentLanguage}
                inputMode={inputMode}
                initialData={dashavidhaData}
                onSubmitAyush={(updated) => {
                  setDashavidhaData(updated);
                  const evalResult = evaluateAyushEmergency(updated);
                  if (evalResult.isRedFlag) {
                    setCurrentStep('red_flag_alert');
                  } else {
                    setCurrentStep('doc_upload');
                  }
                }}
                onBack={() => setCurrentStep('medical_system')}
              />
            )}

            {/* Step 6: Emergency Red Flag Initiated */}
            {currentStep === 'red_flag_alert' && (
              <Step6EmergencyRedFlag
                language={currentLanguage}
                redFlag={redFlagStatus}
                patientAuth={patientAuth}
                onProceedToDocUpload={() => setCurrentStep('doc_upload')}
                onStaffAcknowledged={() => setActiveView('doctor_portal')}
              />
            )}

            {/* Step 7: Document Upload & OCR */}
            {currentStep === 'doc_upload' && (
              <Step7DocumentUploadOcr
                language={currentLanguage}
                uploadedDocs={uploadedDocs}
                onUpdateDocs={setUploadedDocs}
                onProceed={() => setCurrentStep('ehr_summary')}
                onBack={() => {
                  if (medicalSystem === 'allopathic') {
                    setCurrentStep('socrates');
                  } else {
                    setCurrentStep('dashavidha');
                  }
                }}
              />
            )}

            {/* Step 8: EHR Summary Generation */}
            {currentStep === 'ehr_summary' && (
              <Step8EHRSummary
                language={currentLanguage}
                ehrSummary={ehrSummary}
                patientAuth={patientAuth}
                medicalSystem={medicalSystem}
                onProceed={() => setCurrentStep('audio_confirm')}
                onBack={() => setCurrentStep('doc_upload')}
              />
            )}

            {/* Step 9: Audio Confirmation */}
            {currentStep === 'audio_confirm' && (
              <Step9AudioConfirmation
                language={currentLanguage}
                ehrSummary={ehrSummary}
                patientAuth={patientAuth}
                soundEnabled={soundEnabled}
                onConfirmed={() => setCurrentStep('physician_fhir')}
                onEditRequested={() => {
                  if (medicalSystem === 'allopathic') {
                    setCurrentStep('socrates');
                  } else {
                    setCurrentStep('dashavidha');
                  }
                }}
                onBack={() => setCurrentStep('ehr_summary')}
              />
            )}

            {/* Step 10: Physician Summary & FHIR Encoding */}
            {currentStep === 'physician_fhir' && (
              <Step10PhysicianSummaryFhir
                language={currentLanguage}
                fhirBundle={fhirBundle}
                ehrSummary={ehrSummary}
                patientAuth={patientAuth}
                onProceed={() => setCurrentStep('abdm_sync')}
                onBack={() => setCurrentStep('audio_confirm')}
              />
            )}

            {/* Step 11: ABDM Sync */}
            {currentStep === 'abdm_sync' && (
              <Step11AbdmSync
                language={currentLanguage}
                patientAuth={patientAuth}
                syncStatus={abdmSyncStatus}
                onProceed={() => setCurrentStep('data_purge')}
                onBack={() => setCurrentStep('physician_fhir')}
              />
            )}

            {/* Step 12: Data Purging */}
            {currentStep === 'data_purge' && (
              <Step12DataPurging
                language={currentLanguage}
                purgeStatus={purgeStatus}
                onProceed={() => setCurrentStep('handover')}
                onBack={() => setCurrentStep('abdm_sync')}
              />
            )}

            {/* Step 13: End: Physician Handover & Consultation */}
            {currentStep === 'handover' && (
              <Step13PhysicianHandover
                language={currentLanguage}
                token={queueToken}
                patientAuth={patientAuth}
                ehrSummary={ehrSummary}
                medicalSystem={medicalSystem}
                onOpenDoctorPortal={() => handleViewChange('doctor_portal')}
                onResetKiosk={handleResetKiosk}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
