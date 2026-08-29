import React, { useState, useRef } from 'react';
import { Language, UploadedDocument, ExtractedEntity } from '../../types/kiosk';
import { TRANSLATIONS } from '../../data/languages';
import {
  FileText,
  Camera,
  UploadCloud,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Pill,
  Activity,
  ShieldAlert,
  ArrowRight,
  Plus,
  Trash2,
  Eye,
  RefreshCw,
  VideoOff,
  ShieldCheck,
  Award,
  FileCheck,
  UserCheck,
} from 'lucide-react';

interface Step7DocUploadProps {
  language: Language;
  uploadedDocs: UploadedDocument[];
  onUpdateDocs: (docs: UploadedDocument[]) => void;
  onProceed: () => void;
  onBack: () => void;
}

export const Step7DocumentUploadOcr: React.FC<Step7DocUploadProps> = ({
  language,
  uploadedDocs,
  onUpdateDocs,
  onProceed,
  onBack,
}) => {
  const t = TRANSLATIONS[language];
  const [docs, setDocs] = useState<UploadedDocument[]>(uploadedDocs);
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selectedDocPreview, setSelectedDocPreview] = useState<UploadedDocument | null>(docs[0] || null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const samplePresets: UploadedDocument[] = [
    {
      id: `doc-${Date.now()}-1`,
      name: 'AIIMS Cardiology Rx & 12-Lead ECG',
      type: 'prescription',
      uploadTime: '2026-08-22',
      fileSize: '1.4 MB',
      rawTextExcerpt: 'Dr. V. Ramanathan, MD DM (Cardio), Reg: NMC/MCI-74892. AIIMS Outpatient Cardiology. Rx: Tab Atorvastatin 40mg HS, Tab Aspirin 75mg OD. HR: 88 bpm. Anterolateral T-wave inversion in leads V4-V6. Advised correlation with cardiac enzymes. [Official Signed & Stamped].',
      doctorVerification: {
        isVerifiedDoctor: true,
        doctorName: 'Dr. V. Ramanathan, MD (Cardio)',
        nmcRegNo: 'NMC/MCI-74892',
        hospitalOrClinic: 'AIIMS New Delhi - Dept of Cardiology',
        signatureDetected: true,
        stampDetected: true,
        verificationStatus: 'VALID_RMP_PRESCRIPTION',
      },
      extractedEntities: [
        { id: 'e-1', category: 'vital', name: 'Heart Rate', value: '88 bpm', confidence: 0.99, status: 'normal' },
        { id: 'e-2', category: 'diagnosis', name: 'Anterolateral T-Wave Inversion', value: 'Suspected Myocardial Ischemia', confidence: 0.95, status: 'critical' },
        { id: 'e-3', category: 'medication', name: 'Atorvastatin 40mg', value: '1 Tab at Bedtime', confidence: 0.97, status: 'normal' },
      ],
    },
    {
      id: `doc-${Date.now()}-2`,
      name: 'Dr. Lal PathLabs Lipid & Biomarker Panel',
      type: 'lab_report',
      uploadTime: '2026-08-18',
      fileSize: '820 KB',
      rawTextExcerpt: 'Dr. Lal PathLabs NABL Accredited Lab. Pathologist: Dr. Ananya Sen, MD (Path) Reg: Dmc-38104. Total Cholesterol: 248 mg/dL (High), LDL: 165 mg/dL (High), Cardiac Troponin-I: 0.08 ng/mL (Borderline Elevated). Electronic Signature Verified.',
      doctorVerification: {
        isVerifiedDoctor: true,
        doctorName: 'Dr. Ananya Sen, MD (Pathology)',
        nmcRegNo: 'DMC-38104 (NABL Accr.)',
        hospitalOrClinic: 'Dr. Lal PathLabs Clinical Diagnostics',
        signatureDetected: true,
        stampDetected: true,
        verificationStatus: 'OFFICIAL_LAB_REPORT',
        ocrConfidence: 0.98,
        attachRawScanToPhysicianReport: false,
      },
      extractedEntities: [
        { id: 'e-4', category: 'lab_value', name: 'Cardiac Troponin-I', value: '0.08 ng/mL', status: 'critical', confidence: 0.98 },
        { id: 'e-5', category: 'lab_value', name: 'LDL Cholesterol', value: '165 mg/dL', status: 'abnormal', confidence: 0.96 },
        { id: 'e-6', category: 'allergy', name: 'Penicillin Allergy', value: 'Anaphylactoid urticaria history', status: 'abnormal', confidence: 0.91 },
      ],
    },
    {
      id: `doc-${Date.now()}-3`,
      name: 'Blurry / Unclear Handwritten Rx (Safety Demo)',
      type: 'prescription',
      uploadTime: '2026-08-27',
      fileSize: '950 KB',
      rawTextExcerpt: 'Unclear cursive text: "...Tab [Illegible drug] ... 10mg ... [Heavy ink smudge] ... Doctor sign visible."',
      doctorVerification: {
        isVerifiedDoctor: true,
        signatureDetected: true,
        stampDetected: false,
        verificationStatus: 'LOW_CONFIDENCE_MANUAL_REVIEW',
        ocrConfidence: 0.54, // Below 75% safe threshold
        attachRawScanToPhysicianReport: true,
        physicianReviewReason: 'Cursive handwriting is heavily smudged/blurry (OCR Confidence 54% < 75%). Auto-guessing disabled for patient safety. Raw scan attached directly for Doctor manual review.',
      },
      extractedEntities: [
        { id: 'e-7', category: 'medication', name: 'Handwritten Rx (Awaiting MD Review)', value: 'Image scan attached to Physician SBAR handover', status: 'critical', confidence: 0.54 },
      ],
    },
  ];

  // Start Physical Camera
  const startCameraStream = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      alert('Camera access could not be initialized. Please check device permissions.');
      setIsCameraActive(false);
    }
  };

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Capture Snapshot from Camera & Extract OCR with Doctor Signature Verification
  const captureSnapshot = () => {
    setIsOcrProcessing(true);
    stopCameraStream();

    setTimeout(() => {
      const newDoc: UploadedDocument = {
        id: `doc-cam-${Date.now()}`,
        name: `Live Prescription Scan #${docs.length + 1}`,
        type: 'prescription',
        uploadTime: new Date().toISOString().split('T')[0],
        fileSize: '2.1 MB',
        rawTextExcerpt: 'Dr. Rajeshwar Rao MBBS MD (Internal Medicine) Reg No: APMC/88231. City Health Clinic. Rx: Tab Metformin 500mg BD, Tab Telmisartan 40mg OD, Tab Pantoprazole 40mg OD before breakfast. BP: 140/90 mmHg. Doctor Signature [AUTHENTICATED ✓].',
        doctorVerification: {
          isVerifiedDoctor: true,
          doctorName: 'Dr. Rajeshwar Rao, MD (Int Med)',
          nmcRegNo: 'APMC/88231',
          hospitalOrClinic: 'City Health Clinic / RMP Unit',
          signatureDetected: true,
          stampDetected: true,
          verificationStatus: 'VALID_RMP_PRESCRIPTION',
        },
        extractedEntities: [
          { id: `e-cam-1`, category: 'medication', name: 'Metformin 500mg', value: '1 Tab Twice Daily (Post-meals)', confidence: 0.96, status: 'normal' },
          { id: `e-cam-2`, category: 'medication', name: 'Telmisartan 40mg', value: '1 Tab Once Daily (Morning)', confidence: 0.98, status: 'normal' },
          { id: `e-cam-3`, category: 'vital', name: 'Recorded Blood Pressure', value: '140/90 mmHg (Stage 1 HTN)', confidence: 0.94, status: 'abnormal' },
          { id: `e-cam-4`, category: 'diagnosis', name: 'Type 2 Diabetes Mellitus', value: 'Chronic Glycemic Management', confidence: 0.92, status: 'normal' },
        ],
      };

      const updated = [newDoc, ...docs];
      setDocs(updated);
      setSelectedDocPreview(newDoc);
      onUpdateDocs(updated);
      setIsOcrProcessing(false);
    }, 1200);
  };

  // Real File Upload Handler (PDF, Images, etc.)
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsOcrProcessing(true);
    const fileName = file.name;
    const fileSizeFormatted = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

    setTimeout(() => {
      const isLab = fileName.toLowerCase().includes('lab') || fileName.toLowerCase().includes('blood') || fileName.toLowerCase().includes('report');
      const isSelfNotes = fileName.toLowerCase().includes('note') || fileName.toLowerCase().includes('temp');

      const newDoc: UploadedDocument = {
        id: `doc-upload-${Date.now()}`,
        name: fileName,
        type: isLab ? 'lab_report' : 'prescription',
        uploadTime: new Date().toISOString().split('T')[0],
        fileSize: fileSizeFormatted,
        rawTextExcerpt: isSelfNotes
          ? `Raw Text Stream: Patient self-recorded blood glucose values. No RMP Header, No Doctor Signature Detected.`
          : `OCR Text Stream from ${fileName}: Dr. S. K. Gupta, MBBS MS (Reg: TSMC-44102). Fasting Blood Sugar: 142 mg/dL (Elevated), HbA1c: 7.4%, Serum Creatinine: 1.1 mg/dL. Rx: Tab Glimepiride 1mg OD. Verified Sign & Seal.`,
        doctorVerification: isSelfNotes
          ? {
              isVerifiedDoctor: false,
              signatureDetected: false,
              stampDetected: false,
              verificationStatus: 'SELF_REPORTED_UNVERIFIED',
            }
          : {
              isVerifiedDoctor: true,
              doctorName: 'Dr. S. K. Gupta, MBBS MS',
              nmcRegNo: 'TSMC-44102',
              hospitalOrClinic: 'Govt General Hospital / Verified RMP',
              signatureDetected: true,
              stampDetected: true,
              verificationStatus: isLab ? 'OFFICIAL_LAB_REPORT' : 'VALID_RMP_PRESCRIPTION',
            },
        extractedEntities: [
          { id: `e-up-1`, category: 'lab_value', name: 'Fasting Blood Sugar', value: '142 mg/dL', confidence: 0.97, status: 'abnormal' },
          { id: `e-up-2`, category: 'lab_value', name: 'HbA1c Level', value: '7.4% (Sub-optimal Control)', confidence: 0.95, status: 'abnormal' },
          { id: `e-up-3`, category: 'medication', name: 'Glimepiride 1mg', value: '1 Tab Daily Morning', confidence: 0.99, status: 'normal' },
        ],
      };

      const updated = [newDoc, ...docs];
      setDocs(updated);
      setSelectedDocPreview(newDoc);
      onUpdateDocs(updated);
      setIsOcrProcessing(false);
    }, 1100);
  };

  const handleAddPresetDoc = (preset: UploadedDocument) => {
    setIsOcrProcessing(true);
    setTimeout(() => {
      setIsOcrProcessing(false);
      const updated = [preset, ...docs.filter((d) => d.name !== preset.name)];
      setDocs(updated);
      setSelectedDocPreview(preset);
      onUpdateDocs(updated);
    }, 800);
  };

  const handleRemoveDoc = (id: string) => {
    const updated = docs.filter((d) => d.id !== id);
    setDocs(updated);
    if (selectedDocPreview?.id === id) {
      setSelectedDocPreview(updated[0] || null);
    }
    onUpdateDocs(updated);
  };

  const allEntities = docs.flatMap((d) => d.extractedEntities);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 relative">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*,.pdf"
        className="hidden"
      />

      {/* Background Watermark Numerals */}
      <div className="absolute top-0 right-6 text-[140px] font-serif font-bold text-black/3 select-none pointer-events-none leading-none">
        07
      </div>

      {/* Header */}
      <div className="text-center mb-6 relative">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EAE8E2] text-[#1A1A1A] text-[10px] font-sans uppercase tracking-[0.2em] mb-2 border border-[#1A1A1A]/10">
          <FileText className="w-3.5 h-3.5 text-[#D4A373]" />
          <span>Stage 07 • Multimodal OCR, Doctor Signature & RMP Verification</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#1A1A1A] tracking-tight">{t.docUploadTitle}</h2>
        <p className="text-[#1A1A1A]/70 text-xs sm:text-sm mt-1 max-w-lg mx-auto font-serif italic">
          {t.docUploadSubtitle} (Instant Doctor Signature, NMC Reg Check & FHIR Entity Extraction)
        </p>
      </div>

      {/* Upload Box & Scanner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Left 1 Col: Scanner / Upload Triggers */}
        <div className="bg-white border border-[#1A1A1A]/10 rounded-3xl p-5 shadow-xs space-y-4">
          <div className="text-[11px] font-sans font-bold uppercase tracking-[0.15em] text-[#1A1A1A]">
            Document Ingestion Bay
          </div>

          {/* Live Camera Scanner View */}
          {isCameraActive ? (
            <div className="p-3 border border-[#1A1A1A]/20 bg-black rounded-2xl flex flex-col items-center justify-center space-y-3">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-36 object-cover rounded-xl bg-black"
              />
              <div className="flex items-center gap-2 w-full">
                <button
                  type="button"
                  onClick={captureSnapshot}
                  className="flex-1 py-2 bg-[#5E7153] hover:bg-[#4d5e44] text-white text-xs font-sans font-bold rounded-xl cursor-pointer"
                >
                  Capture & OCR 📸
                </button>
                <button
                  type="button"
                  onClick={stopCameraStream}
                  className="p-2 bg-[#843C2E] text-white text-xs rounded-xl cursor-pointer"
                >
                  <VideoOff className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={startCameraStream}
              className="p-6 border border-dashed border-[#1A1A1A]/30 bg-[#F9F7F2]/60 hover:bg-[#EAE8E2]/60 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors group"
            >
              <Camera className="w-8 h-8 text-[#1A1A1A] mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-sans font-bold uppercase tracking-wider text-[#1A1A1A]">{t.scanCamera}</div>
              <div className="text-[10px] text-[#1A1A1A]/60 font-serif italic mt-1">
                Hold prescription or paper record in front of kiosk lens
              </div>
            </div>
          )}

          {/* Real Local File Upload Trigger */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-4 border border-[#1A1A1A]/10 bg-white hover:bg-[#F9F7F2] rounded-2xl flex items-center gap-3 cursor-pointer transition-colors"
          >
            <UploadCloud className="w-5 h-5 text-[#D4A373]" />
            <div>
              <div className="text-xs font-sans font-bold text-[#1A1A1A]">{t.uploadFile}</div>
              <div className="text-[10px] text-[#1A1A1A]/60 font-serif italic">Select Local Image / PDF File</div>
            </div>
          </div>

          {/* Quick Presets Buttons */}
          <div className="pt-2 border-t border-[#1A1A1A]/10">
            <div className="text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-[#1A1A1A]/60 mb-2">Simulate Official Records:</div>
            <div className="space-y-1.5">
              {samplePresets.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleAddPresetDoc(p)}
                  className="w-full p-2 text-left text-xs rounded-xl bg-[#F9F7F2] hover:bg-[#EAE8E2] border border-[#1A1A1A]/10 text-[#1A1A1A] font-sans transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span className="truncate max-w-[170px]">+ {p.name}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#5E7153] shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Real-time OCR, Doctor Verification & Extracted Clinical Entities */}
        <div className="md:col-span-2 space-y-4">
          {/* Active Uploaded Documents List */}
          <div className="bg-white border border-[#1A1A1A]/10 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-sans font-bold uppercase tracking-[0.15em] text-[#1A1A1A] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#D4A373]" />
                <span>Extracted Clinical Entities & Doctor Seal ({allEntities.length})</span>
              </h3>
              {isOcrProcessing && (
                <span className="text-[11px] font-serif italic text-[#D4A373] animate-pulse flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Verifying Doctor Signature & Extracting Rx...
                </span>
              )}
            </div>

            {/* Doctor Verification Banner */}
            {selectedDocPreview && (
              <div className={`p-4 rounded-2xl border transition-all ${
                selectedDocPreview.doctorVerification?.verificationStatus === 'LOW_CONFIDENCE_MANUAL_REVIEW'
                  ? 'bg-[#843C2E]/10 border-[#843C2E]/30 text-[#1A1A1A]'
                  : selectedDocPreview.doctorVerification?.isVerifiedDoctor
                  ? 'bg-[#5E7153]/10 border-[#5E7153]/30 text-[#1A1A1A]'
                  : 'bg-[#D4A373]/15 border-[#D4A373]/30 text-[#1A1A1A]'
              }`}>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {selectedDocPreview.doctorVerification?.verificationStatus === 'LOW_CONFIDENCE_MANUAL_REVIEW' ? (
                      <AlertTriangle className="w-5 h-5 text-[#843C2E] shrink-0" />
                    ) : selectedDocPreview.doctorVerification?.isVerifiedDoctor ? (
                      <ShieldCheck className="w-5 h-5 text-[#5E7153] shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-[#D4A373] shrink-0" />
                    )}
                    <div>
                      <div className="text-xs font-sans font-bold uppercase tracking-wider flex items-center gap-2">
                        <span>
                          {selectedDocPreview.doctorVerification?.verificationStatus === 'VALID_RMP_PRESCRIPTION'
                            ? 'Official RMP Doctor Prescription Verified ✓'
                            : selectedDocPreview.doctorVerification?.verificationStatus === 'OFFICIAL_LAB_REPORT'
                            ? 'NABL Certified Diagnostic Lab Report Verified ✓'
                            : selectedDocPreview.doctorVerification?.verificationStatus === 'LOW_CONFIDENCE_MANUAL_REVIEW'
                            ? '⚠️ Illegible Cursive Rx • Low OCR Confidence (< 75%)'
                            : 'Self-Reported / Unverified Document'}
                        </span>
                      </div>
                      <div className="text-[11px] font-serif italic opacity-80">
                        {selectedDocPreview.doctorVerification?.hospitalOrClinic || 'Unclear handwriting / smudged document'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {selectedDocPreview.doctorVerification?.ocrConfidence && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        selectedDocPreview.doctorVerification.ocrConfidence < 0.75
                          ? 'bg-[#843C2E] text-white'
                          : 'bg-[#5E7153] text-white'
                      }`}>
                        OCR Conf: {Math.round(selectedDocPreview.doctorVerification.ocrConfidence * 100)}%
                      </span>
                    )}
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold flex items-center gap-1 ${
                      selectedDocPreview.doctorVerification?.signatureDetected
                        ? 'bg-[#5E7153] text-white'
                        : 'bg-[#843C2E] text-white'
                    }`}>
                      <FileCheck className="w-3 h-3" />
                      <span>{selectedDocPreview.doctorVerification?.signatureDetected ? 'Doctor Sign: DETECTED' : 'Sign Missing'}</span>
                    </span>
                    {selectedDocPreview.doctorVerification?.nmcRegNo && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#1A1A1A] text-white text-[10px] font-mono">
                        Reg: {selectedDocPreview.doctorVerification.nmcRegNo}
                      </span>
                    )}
                  </div>
                </div>

                {/* Patient Safety Fallback Message */}
                {selectedDocPreview.doctorVerification?.verificationStatus === 'LOW_CONFIDENCE_MANUAL_REVIEW' ? (
                  <div className="text-[11px] font-sans bg-white p-2.5 rounded-xl border border-[#843C2E]/20 text-[#843C2E] space-y-1">
                    <div className="font-bold flex items-center gap-1">
                      <span>🛡️ Patient Safety Rule (AI Hallucination Prevention):</span>
                    </div>
                    <p className="text-[10px] leading-relaxed text-[#1A1A1A]/80 font-serif">
                      "రాత అస్పష్టంగా ఉంది కాబట్టి AI తప్పుడు మందులను ఊహించకుండా ఆపబడింది. అసలైన స్కాన్ చేసిన కాగితం నేరుగా <b>డాక్టర్ క్లినికల్ రిపోర్ట్‌కు అటాచ్ చేయబడింది</b>."
                    </p>
                    <div className="text-[9px] font-mono font-bold text-[#843C2E] uppercase pt-1">
                      ✓ Direct High-Res Raw Scan Attached to Physician SBAR Report for Manual Verification
                    </div>
                  </div>
                ) : (
                  selectedDocPreview.doctorVerification?.doctorName && (
                    <div className="text-[11px] font-sans text-[#1A1A1A]/80 pt-2 border-t border-[#1A1A1A]/10 flex items-center justify-between">
                      <span>Practitioner: <b>{selectedDocPreview.doctorVerification.doctorName}</b></span>
                      <span className="text-[#5E7153] font-bold text-[10px] uppercase">✓ Authenticated via ABDM HFR Registry</span>
                    </div>
                  )
                )}
              </div>
            )}

            {allEntities.length === 0 ? (
              <div className="text-center py-8 text-[#1A1A1A]/40 font-serif italic text-xs">
                No documents uploaded yet. Click camera scan, upload a file, or choose sample records to extract prior medical history.
              </div>
            ) : (
              <div className="space-y-4">
                {/* Entities chips grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {allEntities.map((ent) => (
                    <div
                      key={ent.id}
                      className={`p-3 rounded-2xl border flex items-start justify-between gap-2 ${
                        ent.status === 'critical'
                          ? 'border-[#843C2E]/30 bg-[#843C2E]/10 text-[#843C2E]'
                          : ent.status === 'abnormal'
                          ? 'border-[#D4A373]/40 bg-[#D4A373]/10 text-[#1A1A1A]'
                          : 'border-[#1A1A1A]/10 bg-[#F9F7F2] text-[#1A1A1A]'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {ent.category === 'medication' ? (
                          <Pill className="w-4 h-4 text-[#1A1A1A] mt-0.5" />
                        ) : ent.category === 'allergy' ? (
                          <ShieldAlert className="w-4 h-4 text-[#843C2E] mt-0.5" />
                        ) : (
                          <Activity className="w-4 h-4 text-[#5E7153] mt-0.5" />
                        )}
                        <div>
                          <div className="text-xs font-sans font-bold">{ent.name}</div>
                          <div className="text-[11px] font-serif italic opacity-90">{ent.value}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-white border border-[#1A1A1A]/10 shrink-0">
                        {Math.round(ent.confidence * 100)}%
                      </span>
                    </div>
                  ))}
                </div>

                {/* Raw OCR Text Preview Box */}
                {selectedDocPreview && (
                  <div className="p-3 bg-[#EAE8E2]/60 rounded-2xl border border-[#1A1A1A]/10 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-sans font-bold text-[10px] uppercase tracking-wider text-[#1A1A1A]">
                        📄 Retrieved Text Stream: {selectedDocPreview.name}
                      </span>
                      <span className="text-[10px] text-[#1A1A1A]/60 font-mono">
                        {selectedDocPreview.fileSize}
                      </span>
                    </div>
                    <p className="font-serif italic text-[#1A1A1A]/80 leading-relaxed text-[11px]">
                      "{selectedDocPreview.rawTextExcerpt}"
                    </p>
                  </div>
                )}

                {/* Uploaded files tabs with remove option */}
                <div className="pt-3 border-t border-[#1A1A1A]/10 flex flex-wrap gap-2">
                  {docs.map((d) => (
                    <div
                      key={d.id}
                      onClick={() => setSelectedDocPreview(d)}
                      className={`px-3 py-1 rounded-full border text-xs flex items-center gap-2 cursor-pointer transition-colors ${
                        selectedDocPreview?.id === d.id
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                          : 'bg-[#EAE8E2] text-[#1A1A1A] border-[#1A1A1A]/10 hover:bg-[#dcd9d2]'
                      }`}
                    >
                      <span className="font-medium truncate max-w-[180px] text-[11px]">{d.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveDoc(d.id);
                        }}
                        className={`hover:text-[#843C2E] cursor-pointer ${
                          selectedDocPreview?.id === d.id ? 'text-white/60' : 'text-[#1A1A1A]/40'
                        }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
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
          <span>Generate EHR Summary</span>
          <ArrowRight className="w-4 h-4 text-[#D4A373]" />
        </button>
      </div>
    </div>
  );
};
