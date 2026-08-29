import React from 'react';
import { Activity, Heart, Gauge, AlertCircle, Sparkles } from 'lucide-react';

interface ClinicalTelemetryChartsProps {
  bloodPressure?: string;
  heartRate?: string;
  spo2?: string;
  respiratoryRate?: string;
  painSeverityScore?: number; // 1 - 10
  bloodSugar?: number; // mg/dL e.g., 142
}

export const ClinicalTelemetryCharts: React.FC<ClinicalTelemetryChartsProps> = ({
  bloodPressure = '120/80 mmHg',
  heartRate = '78 bpm',
  spo2 = '98%',
  respiratoryRate = '16 /min',
  painSeverityScore = 7,
  bloodSugar = 142,
}) => {
  // Parse Systolic & Diastolic BP
  const bpMatch = bloodPressure.match(/(\d+)\s*\/\s*(\d+)/);
  const systolic = bpMatch ? parseInt(bpMatch[1], 10) : 130;
  const diastolic = bpMatch ? parseInt(bpMatch[2], 10) : 85;

  // Parse Heart Rate number
  const hrMatch = heartRate.match(/(\d+)/);
  const hrVal = hrMatch ? parseInt(hrMatch[1], 10) : 80;

  // BP Status & Color
  let bpCategory = 'Normal';
  let bpColor = '#5E7153'; // Sage Green
  if (systolic >= 140 || diastolic >= 90) {
    bpCategory = 'Stage-1 / Stage-2 Hypertension';
    bpColor = '#843C2E'; // Rust Red
  } else if (systolic >= 120 && systolic < 140) {
    bpCategory = 'Pre-Hypertension (Elevated)';
    bpColor = '#D4A373'; // Ochre Amber
  }

  // Systolic gauge percentage (Range 80 - 180)
  const systolicPercent = Math.min(Math.max(((systolic - 80) / (180 - 80)) * 100, 5), 100);

  // Heart rate gauge percentage (Range 40 - 140)
  const hrPercent = Math.min(Math.max(((hrVal - 40) / (140 - 40)) * 100, 5), 100);

  // Blood Sugar gauge percentage (Range 60 - 250)
  const bsPercent = Math.min(Math.max(((bloodSugar - 60) / (250 - 60)) * 100, 5), 100);

  return (
    <div className="bg-[#F9F7F2] border border-[#1A1A1A]/10 rounded-2xl p-4 sm:p-5 space-y-4">
      {/* Visual Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1A1A1A]/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#1A1A1A] text-white flex items-center justify-center">
            <Activity className="w-4 h-4 text-[#D4A373]" />
          </div>
          <div>
            <h4 className="text-xs font-sans font-bold uppercase tracking-[0.15em] text-[#1A1A1A]">
              Clinical Telemetry & Graphical Biomarkers
            </h4>
            <p className="text-[10px] text-[#1A1A1A]/60 font-serif italic">
              Real-time physiological visual gauges for instant physician triaging
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-white border border-[#1A1A1A]/10 text-[10px] font-mono font-bold text-[#1A1A1A]">
          AIIMS Telemetry Standard
        </span>
      </div>

      {/* 4 Interactive Visual Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Blood Pressure Range Bar Graph */}
        <div className="bg-white p-3.5 rounded-xl border border-[#1A1A1A]/10 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-sans font-bold text-[#1A1A1A]">
              <Gauge className="w-3.5 h-3.5 text-[#843C2E]" />
              <span>Blood Pressure Bar Gauge</span>
            </div>
            <span
              className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${bpColor}15`, color: bpColor }}
            >
              {bpCategory}
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-lg font-serif font-bold text-[#1A1A1A]">{bloodPressure}</div>
            <div className="text-[10px] text-[#1A1A1A]/60 font-mono">Target: &lt; 120/80</div>
          </div>

          {/* Graphical Color Spectrum Bar */}
          <div className="space-y-1">
            <div className="h-3 w-full bg-[#EAE8E2] rounded-full overflow-hidden relative flex">
              <div className="h-full w-[35%] bg-[#5E7153]/40" title="Optimal (< 120)" />
              <div className="h-full w-[25%] bg-[#D4A373]/50" title="Elevated (120-139)" />
              <div className="h-full w-[40%] bg-[#843C2E]/40" title="High (>= 140)" />

              {/* Pin Indicator */}
              <div
                className="absolute top-0 bottom-0 w-2.5 bg-[#1A1A1A] border-2 border-white rounded-full shadow-sm -ml-1 transition-all duration-500"
                style={{ left: `${systolicPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] font-mono text-[#1A1A1A]/50 px-0.5">
              <span>80 (Low)</span>
              <span>120 (Optimal)</span>
              <span>140 (Hypertension)</span>
              <span>180+</span>
            </div>
          </div>
        </div>

        {/* 2. Heart Rate Dynamic Pulse Bar */}
        <div className="bg-white p-3.5 rounded-xl border border-[#1A1A1A]/10 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-sans font-bold text-[#1A1A1A]">
              <Heart className="w-3.5 h-3.5 text-[#843C2E] animate-pulse" />
              <span>Heart Rate / Rhythm Gauge</span>
            </div>
            <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-[#5E7153]/15 text-[#5E7153]">
              {hrVal >= 60 && hrVal <= 100 ? 'Normal Sinus Rhythm' : hrVal > 100 ? 'Tachycardia' : 'Bradycardia'}
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-lg font-serif font-bold text-[#1A1A1A]">{heartRate}</div>
            <div className="text-[10px] text-[#1A1A1A]/60 font-mono">Resting: 60-100 bpm</div>
          </div>

          {/* Pulse Spectrum Bar */}
          <div className="space-y-1">
            <div className="h-3 w-full bg-[#EAE8E2] rounded-full overflow-hidden relative flex">
              <div className="h-full w-[25%] bg-[#D4A373]/40" title="Low (< 60)" />
              <div className="h-full w-[45%] bg-[#5E7153]/40" title="Normal (60-100)" />
              <div className="h-full w-[30%] bg-[#843C2E]/40" title="High (> 100)" />

              {/* Pin Indicator */}
              <div
                className="absolute top-0 bottom-0 w-2.5 bg-[#843C2E] border-2 border-white rounded-full shadow-sm -ml-1 transition-all duration-500"
                style={{ left: `${hrPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] font-mono text-[#1A1A1A]/50 px-0.5">
              <span>40</span>
              <span>60 (Norm)</span>
              <span>100 (Max)</span>
              <span>140+</span>
            </div>
          </div>
        </div>

        {/* 3. Fasting Glucose / Blood Sugar Comparative Level */}
        <div className="bg-white p-3.5 rounded-xl border border-[#1A1A1A]/10 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-sans font-bold text-[#1A1A1A]">
              <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>Blood Glucose Biomarker</span>
            </div>
            <span className={`text-[10px] font-sans font-bold px-2 py-0.5 rounded-full ${
              bloodSugar > 130 ? 'bg-[#D4A373]/20 text-[#843C2E]' : 'bg-[#5E7153]/15 text-[#5E7153]'
            }`}>
              {bloodSugar > 130 ? 'Elevated (Pre-Diabetic / DM)' : 'Normal Fasting'}
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-lg font-serif font-bold text-[#1A1A1A]">{bloodSugar} mg/dL</div>
            <div className="text-[10px] text-[#1A1A1A]/60 font-mono">Fasting Normal: 70-100</div>
          </div>

          {/* Blood Sugar Multi-zone Bar */}
          <div className="space-y-1">
            <div className="h-3 w-full bg-[#EAE8E2] rounded-full overflow-hidden relative flex">
              <div className="h-full w-[25%] bg-[#5E7153]/40" title="Normal Fasting (70-100)" />
              <div className="h-full w-[25%] bg-[#D4A373]/50" title="Pre-diabetes (100-125)" />
              <div className="h-full w-[50%] bg-[#843C2E]/40" title="Diabetic Range (> 126)" />

              {/* Pin Indicator */}
              <div
                className="absolute top-0 bottom-0 w-2.5 bg-[#D4A373] border-2 border-white rounded-full shadow-sm -ml-1 transition-all duration-500"
                style={{ left: `${bsPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] font-mono text-[#1A1A1A]/50 px-0.5">
              <span>70</span>
              <span>100 (Threshold)</span>
              <span>126 (Diabetic)</span>
              <span>250</span>
            </div>
          </div>
        </div>

        {/* 4. SOCRATES Pain & Severity Intensity Scale (1 to 10 Visual Meter) */}
        <div className="bg-white p-3.5 rounded-xl border border-[#1A1A1A]/10 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-sans font-bold text-[#1A1A1A]">
              <AlertCircle className="w-3.5 h-3.5 text-[#843C2E]" />
              <span>Pain & Acuity Scale (SOCRATES)</span>
            </div>
            <span className={`text-[10px] font-sans font-bold px-2 py-0.5 rounded-full ${
              painSeverityScore >= 7
                ? 'bg-[#843C2E] text-white animate-pulse'
                : painSeverityScore >= 4
                ? 'bg-[#D4A373]/20 text-[#1A1A1A]'
                : 'bg-[#5E7153]/15 text-[#5E7153]'
            }`}>
              {painSeverityScore >= 7 ? 'Severe / Acute' : painSeverityScore >= 4 ? 'Moderate' : 'Mild'}
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-lg font-serif font-bold text-[#1A1A1A]">
              {painSeverityScore} <span className="text-xs font-sans text-[#1A1A1A]/60 font-normal">/ 10 Acuity Score</span>
            </div>
            <div className="text-[10px] text-[#1A1A1A]/60 font-mono">
              SpO2: <b className="text-[#1A1A1A]">{spo2}</b> | Resp: <b className="text-[#1A1A1A]">{respiratoryRate}</b>
            </div>
          </div>

          {/* 10-Block Segmented Pain Meter */}
          <div className="grid grid-cols-10 gap-1 pt-1">
            {Array.from({ length: 10 }).map((_, idx) => {
              const num = idx + 1;
              const isActive = num <= painSeverityScore;
              let activeColor = '#5E7153';
              if (num > 3 && num <= 6) activeColor = '#D4A373';
              if (num > 6) activeColor = '#843C2E';

              return (
                <div
                  key={num}
                  className="h-3.5 rounded-xs transition-all flex items-center justify-center text-[8px] font-mono font-bold"
                  style={{
                    backgroundColor: isActive ? activeColor : '#EAE8E2',
                    color: isActive ? '#FFFFFF' : '#1A1A1A',
                    opacity: isActive ? 1 : 0.4,
                  }}
                  title={`Severity Level ${num}`}
                >
                  {num}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
