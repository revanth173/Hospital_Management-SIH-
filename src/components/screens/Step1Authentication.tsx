import React, { useState } from 'react';
import { Language, PatientAuth } from '../../types/kiosk';
import { TRANSLATIONS } from '../../data/languages';
import { SAMPLE_PATIENTS, PatientPreset } from '../../data/mockPatients';
import {
  UserCheck,
  Fingerprint,
  QrCode,
  ScanFace,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

interface Step1AuthProps {
  language: Language;
  authData: PatientAuth;
  onAuthenticate: (auth: PatientAuth) => void;
  onBack: () => void;
  onQuickLoadPatient: (preset: PatientPreset) => void;
}

export const Step1Authentication: React.FC<Step1AuthProps> = ({
  language,
  authData,
  onAuthenticate,
  onBack,
  onQuickLoadPatient,
}) => {
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'abha' | 'biometric' | 'aadhaar_qr' | 'face'>('abha');
  const [abhaInput, setAbhaInput] = useState(authData.abhaId || '91-8274-1928-3310');
  const [patientNameInput, setPatientNameInput] = useState(authData.patientName || 'Ramesh Kumar');
  const [ageInput, setAgeInput] = useState(authData.age || 58);
  const [genderInput, setGenderInput] = useState<'Male' | 'Female' | 'Other'>(authData.gender || 'Male');
  const [phoneInput, setPhoneInput] = useState(authData.phone || '+91 98765 43210');
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(authData.isAuthenticated);
  const [otpCode, setOtpCode] = useState('782411');
  const [otpSent, setOtpSent] = useState(false);

  const handleSimulateBiometric = (method: 'biometric_thumb' | 'face_scan' | 'aadhaar_qr') => {
    setIsScanning(true);
    setScanComplete(false);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      const updated: PatientAuth = {
        abhaId: abhaInput || '91-8274-1928-3310',
        abhaAddress: `${patientNameInput.toLowerCase().replace(/\s+/g, '')}@abdm`,
        patientName: patientNameInput,
        age: Number(ageInput),
        gender: genderInput,
        phone: phoneInput,
        aadhaarLast4: '8841',
        authMethod: method,
        isAuthenticated: true,
      };
      onAuthenticate(updated);
    }, 1200);
  };

  const handleAbhaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: PatientAuth = {
      abhaId: abhaInput || '91-8274-1928-3310',
      abhaAddress: `${patientNameInput.toLowerCase().replace(/\s+/g, '')}@abdm`,
      patientName: patientNameInput,
      age: Number(ageInput),
      gender: genderInput,
      phone: phoneInput,
      aadhaarLast4: '8841',
      authMethod: 'abha_otp',
      isAuthenticated: true,
    };
    onAuthenticate(updated);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 relative">
      {/* Background Watermark Numerals */}
      <div className="absolute top-0 right-6 text-[140px] font-serif font-bold text-black/3 select-none pointer-events-none leading-none">
        01
      </div>

      {/* Header */}
      <div className="text-center mb-8 relative">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EAE8E2] border border-[#1A1A1A]/10 text-[#1A1A1A] text-[10px] font-sans uppercase tracking-[0.2em] mb-2">
          <UserCheck className="w-3.5 h-3.5 text-[#D4A373]" />
          <span>Stage 01 • Identity Verification</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#1A1A1A] tracking-tight">{t.authTitle}</h2>
        <p className="text-[#1A1A1A]/70 text-sm mt-1 max-w-lg mx-auto font-serif italic">{t.authSubtitle}</p>
      </div>

      {/* Preset Quick Select Bar */}
      <div className="mb-6 bg-[#EAE8E2]/60 border border-[#1A1A1A]/10 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/70">
          <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
          <span>Load Test Persona:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_PATIENTS.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                onQuickLoadPatient(p);
                setAbhaInput(p.auth.abhaId);
                setPatientNameInput(p.auth.patientName);
                setAgeInput(p.auth.age);
                setGenderInput(p.auth.gender);
                setPhoneInput(p.auth.phone);
                setScanComplete(true);
              }}
              className="px-3 py-1 text-[11px] rounded-full font-sans uppercase tracking-[0.1em] border border-[#1A1A1A]/15 bg-white hover:bg-[#1A1A1A] hover:text-[#F9F7F2] text-[#1A1A1A] transition-all cursor-pointer shadow-2xs"
            >
              {p.auth.patientName} ({p.tag})
            </button>
          ))}
        </div>
      </div>

      {/* Auth Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
        <button
          onClick={() => setActiveTab('abha')}
          className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
            activeTab === 'abha'
              ? 'bg-[#1A1A1A] text-[#F9F7F2] font-semibold border-[#1A1A1A] shadow-xs'
              : 'bg-white text-[#1A1A1A] border-[#1A1A1A]/10 hover:bg-[#EAE8E2]/50'
          }`}
        >
          <Phone className="w-5 h-5 text-[#D4A373]" />
          <span className="text-xs font-sans tracking-tight">ABHA Number / OTP</span>
        </button>

        <button
          onClick={() => setActiveTab('biometric')}
          className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
            activeTab === 'biometric'
              ? 'bg-[#1A1A1A] text-[#F9F7F2] font-semibold border-[#1A1A1A] shadow-xs'
              : 'bg-white text-[#1A1A1A] border-[#1A1A1A]/10 hover:bg-[#EAE8E2]/50'
          }`}
        >
          <Fingerprint className="w-5 h-5 text-[#D4A373]" />
          <span className="text-xs font-sans tracking-tight">Biometric Thumb</span>
        </button>

        <button
          onClick={() => setActiveTab('aadhaar_qr')}
          className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
            activeTab === 'aadhaar_qr'
              ? 'bg-[#1A1A1A] text-[#F9F7F2] font-semibold border-[#1A1A1A] shadow-xs'
              : 'bg-white text-[#1A1A1A] border-[#1A1A1A]/10 hover:bg-[#EAE8E2]/50'
          }`}
        >
          <QrCode className="w-5 h-5 text-[#D4A373]" />
          <span className="text-xs font-sans tracking-tight">Scan Aadhaar / QR</span>
        </button>

        <button
          onClick={() => setActiveTab('face')}
          className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
            activeTab === 'face'
              ? 'bg-[#1A1A1A] text-[#F9F7F2] font-semibold border-[#1A1A1A] shadow-xs'
              : 'bg-white text-[#1A1A1A] border-[#1A1A1A]/10 hover:bg-[#EAE8E2]/50'
          }`}
        >
          <ScanFace className="w-5 h-5 text-[#D4A373]" />
          <span className="text-xs font-sans tracking-tight">Facial Scan (FRT)</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-[#1A1A1A]/10 rounded-3xl p-6 sm:p-8 shadow-xs">
        {activeTab === 'abha' && (
          <form onSubmit={handleAbhaSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-sans font-bold uppercase tracking-[0.15em] text-[#1A1A1A]/80 mb-1.5">
                  14-Digit ABHA ID (Ayushman Bharat Health Account)
                </label>
                <input
                  type="text"
                  value={abhaInput}
                  onChange={(e) => setAbhaInput(e.target.value)}
                  placeholder="91-8274-1928-3310"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#1A1A1A]/20 bg-[#F9F7F2]/40 text-sm font-mono focus:ring-1 focus:ring-[#D4A373] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-sans font-bold uppercase tracking-[0.15em] text-[#1A1A1A]/80 mb-1.5">
                  Patient Full Name (per Aadhaar)
                </label>
                <input
                  type="text"
                  value={patientNameInput}
                  onChange={(e) => setPatientNameInput(e.target.value)}
                  placeholder="Ramesh Kumar"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#1A1A1A]/20 bg-[#F9F7F2]/40 text-sm focus:ring-1 focus:ring-[#D4A373] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-sans font-bold uppercase tracking-[0.15em] text-[#1A1A1A]/80 mb-1.5">
                  Age & Gender
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={ageInput}
                    onChange={(e) => setAgeInput(Number(e.target.value))}
                    className="w-24 px-3 py-2.5 rounded-xl border border-[#1A1A1A]/20 bg-[#F9F7F2]/40 text-sm focus:ring-1 focus:ring-[#D4A373] focus:outline-none"
                    placeholder="Age"
                    min="1"
                    max="120"
                    required
                  />
                  <select
                    value={genderInput}
                    onChange={(e) => setGenderInput(e.target.value as any)}
                    className="flex-1 px-3 py-2.5 rounded-xl border border-[#1A1A1A]/20 bg-[#F9F7F2]/40 text-sm focus:ring-1 focus:ring-[#D4A373] focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-sans font-bold uppercase tracking-[0.15em] text-[#1A1A1A]/80 mb-1.5">
                  Mobile Number (for ABDM Sync)
                </label>
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#1A1A1A]/20 bg-[#F9F7F2]/40 text-sm focus:ring-1 focus:ring-[#D4A373] focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* OTP Section */}
            <div className="pt-3 border-t border-[#1A1A1A]/10 flex flex-wrap items-center justify-between gap-3 bg-[#EAE8E2]/40 p-4 rounded-xl">
              <div className="text-xs text-[#1A1A1A]/80 font-sans">
                <span className="font-semibold text-[#1A1A1A]">ABDM Gateway OTP Verification:</span>{' '}
                {otpSent ? 'OTP Sent to Aadhaar-linked Mobile' : 'SMS Dispatch Simulated Ready'}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-28 px-3 py-1.5 rounded-full border border-[#1A1A1A]/20 text-center font-mono text-sm tracking-widest bg-white"
                  placeholder="OTP"
                />
                <button
                  type="button"
                  onClick={() => setOtpSent(true)}
                  className="px-3.5 py-1.5 rounded-full bg-[#1A1A1A] text-[#F9F7F2] text-[10px] font-sans uppercase tracking-[0.15em] hover:bg-black cursor-pointer"
                >
                  {otpSent ? 'Resend' : 'Send OTP'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#1A1A1A]/10">
              <button
                type="button"
                onClick={onBack}
                className="px-5 py-2.5 rounded-full border border-[#1A1A1A]/20 text-[#1A1A1A] text-xs font-sans uppercase tracking-[0.15em] hover:bg-[#EAE8E2]/50 cursor-pointer"
              >
                {t.back}
              </button>
              <button
                type="submit"
                className="px-7 py-3 rounded-full bg-[#1A1A1A] hover:bg-black text-[#F9F7F2] font-sans uppercase tracking-[0.15em] text-xs shadow-sm flex items-center gap-2 cursor-pointer transition-all"
              >
                <span>Verify & Proceed to Consent</span>
                <ArrowRight className="w-4 h-4 text-[#D4A373]" />
              </button>
            </div>
          </form>
        )}

        {activeTab === 'biometric' && (
          <div className="flex flex-col items-center text-center py-6">
            <div className="relative mb-6">
              <div
                className={`w-32 h-32 rounded-full flex items-center justify-center border-2 transition-all ${
                  isScanning
                    ? 'border-[#D4A373] bg-[#EAE8E2] text-[#1A1A1A] scale-105 animate-pulse'
                    : scanComplete
                    ? 'border-[#5E7153] bg-[#5E7153]/10 text-[#5E7153]'
                    : 'border-[#1A1A1A]/15 bg-[#F9F7F2] text-[#1A1A1A]/50'
                }`}
              >
                <Fingerprint className="w-16 h-16" />
              </div>
            </div>

            <h3 className="font-serif text-2xl text-[#1A1A1A]">
              {isScanning ? 'Scanning Biometric Thumbprint...' : scanComplete ? 'Biometric Verified • ABHA Linked' : t.biometricThumb}
            </h3>
            <p className="text-xs text-[#1A1A1A]/60 max-w-sm mt-1 font-serif italic">
              Place your thumb flat on the optical biometric sensor glass below the kiosk screen.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => handleSimulateBiometric('biometric_thumb')}
                disabled={isScanning}
                className="px-6 py-2.5 rounded-full bg-[#1A1A1A] hover:bg-black text-[#F9F7F2] text-xs font-sans uppercase tracking-[0.15em] shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Fingerprint className="w-4 h-4 text-[#D4A373]" />
                <span>{isScanning ? 'Processing Sensor...' : 'Simulate Thumb Scan'}</span>
              </button>

              {scanComplete && (
                <button
                  onClick={() => {
                    const updated: PatientAuth = {
                      abhaId: abhaInput || '91-8274-1928-3310',
                      abhaAddress: `${patientNameInput.toLowerCase().replace(/\s+/g, '')}@abdm`,
                      patientName: patientNameInput,
                      age: Number(ageInput),
                      gender: genderInput,
                      phone: phoneInput,
                      aadhaarLast4: '8841',
                      authMethod: 'biometric_thumb',
                      isAuthenticated: true,
                    };
                    onAuthenticate(updated);
                  }}
                  className="px-6 py-2.5 rounded-full bg-[#5E7153] hover:bg-[#4d5e44] text-white text-xs font-sans uppercase tracking-[0.15em] shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Continue Next</span>
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === 'aadhaar_qr' && (
          <div className="flex flex-col items-center text-center py-6">
            <div className="w-28 h-28 rounded-full border border-dashed border-[#D4A373] bg-[#EAE8E2]/50 flex items-center justify-center text-[#1A1A1A] mb-4">
              <QrCode className="w-12 h-12 animate-pulse" />
            </div>
            <h3 className="font-serif text-2xl text-[#1A1A1A]">{t.scanAadhaar}</h3>
            <p className="text-xs text-[#1A1A1A]/60 max-w-sm mt-1 font-serif italic">
              Hold the QR code on your PVC Aadhaar / ABHA Card 10 cm in front of the kiosk optical barcode scanner.
            </p>
            <button
              onClick={() => handleSimulateBiometric('aadhaar_qr')}
              className="mt-6 px-6 py-2.5 rounded-full bg-[#1A1A1A] hover:bg-black text-[#F9F7F2] text-xs font-sans uppercase tracking-[0.15em] shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-[#D4A373]" />
              <span>Simulate QR Scan</span>
            </button>
          </div>
        )}

        {activeTab === 'face' && (
          <div className="flex flex-col items-center text-center py-6">
            <div className="w-28 h-28 rounded-full border border-[#5E7153] bg-[#5E7153]/10 flex items-center justify-center text-[#5E7153] mb-4">
              <ScanFace className="w-12 h-12" />
            </div>
            <h3 className="font-serif text-2xl text-[#1A1A1A]">{t.faceScan}</h3>
            <p className="text-xs text-[#1A1A1A]/60 max-w-sm mt-1 font-serif italic">
              Look directly at the kiosk camera for ABDM Aadhaar Face Authentication (FRT).
            </p>
            <button
              onClick={() => handleSimulateBiometric('face_scan')}
              className="mt-6 px-6 py-2.5 rounded-full bg-[#1A1A1A] hover:bg-black text-[#F9F7F2] text-xs font-sans uppercase tracking-[0.15em] shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <ScanFace className="w-4 h-4 text-[#D4A373]" />
              <span>Simulate Face Scan</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
