import React, { useState } from 'react';
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
  const [activeTab, setActiveTab] = useState<'upload' | 'camera'>('upload');

  const samplePresets: UploadedDocument[] = [
    {
      id: `doc-${Date.now()}-1`,
      name: 'Cardiology 12-Lead ECG Report',
      type: 'ecg_trace',
      uploadTime: '2026-08-22',
      fileSize: '1.4 MB',
      rawTextExcerpt: 'Rate: 88 bpm. Anterolateral T-wave inversion in leads V4-V6. Advised correlation with cardiac enzymes.',
      extractedEntities: [
        { id: 'e-1', category: 'vital', name: 'Heart Rate', value: '88 bpm', confidence: 0.99, status: 'normal' },
        { id: 'e-2', category: 'diagnosis', name: 'Anterolateral T-Wave Inversion', value: 'Suspected Myocardial Ischemia', confidence: 0.95, status: 'critical' },
        { id: 'e-3', category: 'medication', name: 'Atorvastatin 40mg', value: '1 Tab at Bedtime', confidence: 0.97, status: 'normal' },
      ],
    },
    {
      id: `doc-${Date.now()}-2`,
      name: 'Serum Lipid & Biomarker Panel',
      type: 'lab_report',
      uploadTime: '2026-08-18',
      fileSize: '820 KB',
      rawTextExcerpt: 'Total Cholesterol: 248 mg/dL (High), LDL: 165 mg/dL (High), Cardiac Troponin-I: 0.08 ng/mL (Borderline Elevated).',
      extractedEntities: [
        { id: 'e-4', category: 'lab_value', name: 'Cardiac Troponin-I', value: '0.08 ng/mL', status: 'critical', confidence: 0.98 },
        { id: 'e-5', category: 'lab_value', name: 'LDL Cholesterol', value: '165 mg/dL', status: 'abnormal', confidence: 0.96 },
        { id: 'e-6', category: 'allergy', name: 'Penicillin Allergy', value: 'Anaphylactoid urticaria history', status: 'abnormal', confidence: 0.91 },
      ],
    },
  ];

  const handleAddPresetDoc = (preset: UploadedDocument) => {
    setIsOcrProcessing(true);
    setTimeout(() => {
      setIsOcrProcessing(false);
      const updated = [...docs, preset];
      setDocs(updated);
      onUpdateDocs(updated);
    }, 900);
  };

  const handleRemoveDoc = (id: string) => {
    const updated = docs.filter((d) => d.id !== id);
    setDocs(updated);
    onUpdateDocs(updated);
  };

  const allEntities = docs.flatMap((d) => d.extractedEntities);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 relative">
      {/* Background Watermark Numerals */}
      <div className="absolute top-0 right-6 text-[140px] font-serif font-bold text-black/3 select-none pointer-events-none leading-none">
        07
      </div>

      {/* Header */}
      <div className="text-center mb-6 relative">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EAE8E2] text-[#1A1A1A] text-[10px] font-sans uppercase tracking-[0.2em] mb-2 border border-[#1A1A1A]/10">
          <FileText className="w-3.5 h-3.5 text-[#D4A373]" />
          <span>Stage 07 • Multimodal Optical Character Recognition</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#1A1A1A] tracking-tight">{t.docUploadTitle}</h2>
        <p className="text-[#1A1A1A]/70 text-xs sm:text-sm mt-1 max-w-lg mx-auto font-serif italic">
          {t.docUploadSubtitle}
        </p>
      </div>

      {/* Upload Box & Scanner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Left 1 Col: Scanner / Upload Triggers */}
        <div className="bg-white border border-[#1A1A1A]/10 rounded-3xl p-5 shadow-xs space-y-4">
          <div className="text-[11px] font-sans font-bold uppercase tracking-[0.15em] text-[#1A1A1A]">
            Document Ingestion Bay
          </div>

          <div
            onClick={() => handleAddPresetDoc(samplePresets[0])}
            className="p-6 border border-dashed border-[#1A1A1A]/30 bg-[#F9F7F2]/60 hover:bg-[#EAE8E2]/60 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors group"
          >
            <Camera className="w-8 h-8 text-[#1A1A1A] mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-sans font-bold uppercase tracking-wider text-[#1A1A1A]">{t.scanCamera}</div>
            <div className="text-[10px] text-[#1A1A1A]/60 font-serif italic mt-1">
              Hold physical paper document in front of kiosk lens
            </div>
          </div>

          <div
            onClick={() => handleAddPresetDoc(samplePresets[1])}
            className="p-4 border border-[#1A1A1A]/10 bg-white hover:bg-[#F9F7F2] rounded-2xl flex items-center gap-3 cursor-pointer transition-colors"
          >
            <UploadCloud className="w-5 h-5 text-[#D4A373]" />
            <div>
              <div className="text-xs font-sans font-bold text-[#1A1A1A]">{t.uploadFile}</div>
              <div className="text-[10px] text-[#1A1A1A]/60 font-serif italic">ABDM PHR Records / PDF / JPG</div>
            </div>
          </div>

          {/* Quick Presets Buttons */}
          <div className="pt-2 border-t border-[#1A1A1A]/10">
            <div className="text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-[#1A1A1A]/60 mb-2">Simulate Sample Uploads:</div>
            <div className="space-y-1.5">
              {samplePresets.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleAddPresetDoc(p)}
                  className="w-full p-2 text-left text-xs rounded-xl bg-[#F9F7F2] hover:bg-[#EAE8E2] border border-[#1A1A1A]/10 text-[#1A1A1A] font-sans transition-colors cursor-pointer"
                >
                  + Add {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Real-time OCR & Extracted Clinical Entities */}
        <div className="md:col-span-2 space-y-4">
          {/* Active Uploaded Documents List */}
          <div className="bg-white border border-[#1A1A1A]/10 rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-sans font-bold uppercase tracking-[0.15em] text-[#1A1A1A] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#D4A373]" />
                <span>Extracted Clinical Entities ({allEntities.length})</span>
              </h3>
              {isOcrProcessing && (
                <span className="text-[11px] font-serif italic text-[#D4A373] animate-pulse">
                  Extracting medical entities via OCR...
                </span>
              )}
            </div>

            {allEntities.length === 0 ? (
              <div className="text-center py-8 text-[#1A1A1A]/40 font-serif italic text-xs">
                No documents uploaded yet. Click camera scan or sample buttons on the left to extract prior medical history.
              </div>
            ) : (
              <div className="space-y-3">
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

                {/* Uploaded files tabs with remove option */}
                <div className="pt-3 border-t border-[#1A1A1A]/10 flex flex-wrap gap-2">
                  {docs.map((d) => (
                    <div
                      key={d.id}
                      className="px-3 py-1 rounded-full bg-[#EAE8E2] border border-[#1A1A1A]/10 text-xs text-[#1A1A1A] flex items-center gap-2"
                    >
                      <span className="font-medium truncate max-w-[200px] text-[11px]">{d.name}</span>
                      <button
                        onClick={() => handleRemoveDoc(d.id)}
                        className="text-[#1A1A1A]/40 hover:text-[#843C2E] cursor-pointer"
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
