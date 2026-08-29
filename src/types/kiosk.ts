export type Language = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr' | 'kn';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export type MedicalSystem = 'allopathic' | 'ayush';

export type InputMode = 'voice' | 'touch';

export interface PatientAuth {
  abhaId: string;
  abhaAddress: string;
  patientName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  aadhaarLast4: string;
  authMethod: 'abha_otp' | 'biometric_thumb' | 'face_scan' | 'aadhaar_qr' | 'demo_select';
  photoUrl?: string;
  isAuthenticated: boolean;
}

export interface DPDPDataConsent {
  consentId: string;
  timestamp: string;
  dpdpActVersion: 'DPDP Act 2023 - Sec 6(1)';
  purpose: 'OPD Clinical Triage & Tele-consultation EHR Generation';
  retentionPeriod: 'Session Only (Ephemeral Kiosk Execution)';
  voiceConsentRecorded: boolean;
  voiceConsentAudioDurationSec?: number;
  digitalSignatureAccepted: boolean;
  language: Language;
}

export interface SocratesAssessment {
  site: string; // e.g. 'Substernal Precordial Chest', 'Epigastric Abdomen'
  siteLocationCategory: 'head' | 'chest' | 'abdomen' | 'back' | 'limbs' | 'throat' | 'general';
  onset: 'Sudden (<15 mins)' | 'Rapid (1-2 hours)' | 'Gradual (days)' | 'Post-trauma' | 'During exertion';
  character: 'Crushing / Constricting' | 'Sharp / Stabbing' | 'Dull Aching' | 'Burning' | 'Throbbing' | 'Colicky';
  radiation: 'Left arm, shoulder & jaw' | 'Through to back' | 'Down right lower abdomen' | 'None';
  associations: string[]; // e.g. ['Diaphoresis (Profuse sweating)', 'Dyspnea (Shortness of breath)', 'Nausea/Vomiting', 'Dizziness', 'Palpitations']
  timeCourse: 'Continuous & worsening' | 'Episodic / Intermittent' | 'Fluctuating' | 'Worse at night';
  exacerbatingFactors: string[]; // e.g. ['Physical exertion', 'Deep inspiration', 'Food intake', 'Lying flat']
  relievingFactors: string[]; // e.g. ['Rest', 'Nitroglycerin / Antacid', 'Sitting forward']
  severityScore: number; // 1 - 10
  functionalImpact: 'Unable to walk or speak in full sentences' | 'Severely limited' | 'Moderate discomfort' | 'Mild discomfort';
}

export interface DashavidhaPariksha {
  prakriti: 'Vata' | 'Pitta' | 'Kapha' | 'Vata-Pitta' | 'Pitta-Kapha' | 'Vata-Kapha' | 'Tridoshaja';
  vikriti: 'Vata Vriddhi' | 'Pitta Prakopa' | 'Kapha Avarana' | 'Sannipataja';
  sara: 'Pravara (Superior Dhatu tissue quality)' | 'Madhyama (Medium)' | 'Avara (Sub-optimal)';
  samhanana: 'Susamhata (Compact & robust muscular build)' | 'Madhyama (Moderate)' | 'Heena (Frail / weak)';
  pramana: 'Sama (Well-proportioned body measurements)' | 'Heena Pramana (Under-nourished)' | 'Ati Pramana (Overweight)';
  satmya: 'Sarva Rasa Satmya (Balanced dietary tolerance)' | 'Eka Rasa Satmya (Unbalanced)' | 'Madhyama Satmya';
  satva: 'Pravara Satva (High mental fortitude & calm)' | 'Madhyama Satva (Moderate)' | 'Avara Satva (Low resilience / high anxiety)';
  aharaShakti: 'Teekshnagni (Very high metabolic fire)' | 'Mandagni (Sluggish digestion)' | 'Vishamagni (Irregular)' | 'Samagni (Balanced)';
  vyayamaShakti: 'Uttama (High exercise capacity)' | 'Madhyama (Moderate endurance)' | 'Alpa (Fatigues rapidly)';
  vaya: 'Balya (Childhood <16)' | 'Madhyama (Youth/Adulthood 16-60)' | 'Vardhakya (Elderly >60)';
  chiefAyushComplaint: string;
  associatedLakshanas: string[];
}

export interface EmergencyRedFlag {
  isRedFlag: boolean;
  primaryCondition: string;
  triageColor: 'RED' | 'YELLOW' | 'GREEN';
  riskScore: number; // 0-100
  triggers: string[];
  protocolActions: string[];
  alertDispatchTime?: string;
  assignedErBay?: string;
}

export interface ExtractedEntity {
  id: string;
  category: 'medication' | 'vital' | 'lab_value' | 'diagnosis' | 'allergy';
  name: string;
  value: string;
  unit?: string;
  status?: 'normal' | 'abnormal' | 'critical';
  confidence: number;
}

export interface UploadedDocument {
  id: string;
  name: string;
  type: 'prescription' | 'lab_report' | 'ecg_trace' | 'discharge_summary';
  uploadTime: string;
  fileSize: string;
  extractedEntities: ExtractedEntity[];
  rawTextExcerpt: string;
  doctorVerification?: {
    isVerifiedDoctor: boolean;
    doctorName?: string;
    nmcRegNo?: string;
    hospitalOrClinic?: string;
    signatureDetected: boolean;
    stampDetected: boolean;
    verificationStatus: 'VALID_RMP_PRESCRIPTION' | 'OFFICIAL_LAB_REPORT' | 'SELF_REPORTED_UNVERIFIED' | 'LOW_CONFIDENCE_MANUAL_REVIEW';
    ocrConfidence?: number; // 0.0 - 1.0 e.g. 0.62 for illegible
    attachRawScanToPhysicianReport?: boolean;
    physicianReviewReason?: string;
  };
}

export interface EHRSummary {
  chiefComplaint: string;
  hpiNarrative: string;
  clinicalSystem: MedicalSystem;
  snomedCodes: { code: string; display: string }[];
  icd10Codes: { code: string; display: string }[];
  triageCategory: 'Emergency (Red)' | 'Urgent (Yellow)' | 'Routine OPD (Green)';
  vitalSigns: {
    bloodPressure?: string;
    heartRate?: string;
    spo2?: string;
    temperature?: string;
    respiratoryRate?: string;
  };
  keyFindings: string[];
  medicationsActive: string[];
  knownAllergies: string[];
}

export interface FhirResourceBundle {
  resourceType: 'Bundle';
  id: string;
  type: 'transaction';
  timestamp: string;
  entry: Array<{
    fullUrl: string;
    resource: any;
  }>;
}

export interface AbdmSyncStatus {
  isSynced: boolean;
  hipId: string; // Health Information Provider e.g. "IN0810000001"
  hiuId: string; // Health Information User
  careContextReference: string; // e.g. "OPD-VISIT-2026-08-9841"
  transactionId: string;
  consentArtefactId: string;
  gatewayTimestamp: string;
}

export interface DataPurgeStatus {
  isPurged: boolean;
  purgedAt: string;
  method: 'DoD 5220.22-M Ephemeral RAM Overwrite & Local Storage Cache Zeroed';
  retainedRecords: 'Zero on Local Kiosk (DPDP Act Sec 8 Compliance)';
  sessionTokenEncrypted: string;
}

export interface QueueToken {
  tokenNumber: string; // e.g. "OPD-EMERGENCY-01" or "OPD-CARD-042"
  roomNumber: string;
  doctorName: string;
  department: string;
  estimatedWaitMinutes: number;
  queuePosition: number;
  qrCodeUrl: string;
  createdAt: string;
}

export type KioskStep =
  | 'start'
  | 'auth'
  | 'consent'
  | 'input_method'
  | 'medical_system'
  | 'socrates'
  | 'dashavidha'
  | 'red_flag_alert'
  | 'doc_upload'
  | 'ehr_summary'
  | 'audio_confirm'
  | 'physician_fhir'
  | 'abdm_sync'
  | 'data_purge'
  | 'handover';
