import { DashavidhaPariksha, EmergencyRedFlag, EHRSummary, ExtractedEntity } from '../types/kiosk';

export function evaluateAyushEmergency(dashavidha: DashavidhaPariksha): EmergencyRedFlag {
  const triggers: string[] = [];
  const protocolActions: string[] = [];
  let riskScore = 0;

  const complaint = dashavidha.chiefAyushComplaint.toLowerCase();
  const lakshanas = dashavidha.associatedLakshanas.join(' ').toLowerCase();

  // Hridroga / Acute chest pain check
  if (complaint.includes('hridaya') || complaint.includes('hridroga') || lakshanas.includes('chest') || lakshanas.includes('breathless')) {
    triggers.push('SUSPECTED AYURVEDIC HRIDROGA WITH KRICHRA SHWASA (ACUTE CARDIO-RESPIRATORY EMERGENCY)');
    protocolActions.push('Immediate Allopathic ER cross-consultation & STAT 12-lead ECG');
    protocolActions.push('Sadyo-Avacharana Emergency stabilization protocol');
    riskScore = 90;
  }

  // Sannipataja Jwara with altered consciousness
  if ((complaint.includes('jwara') || complaint.includes('fever')) && dashavidha.satva.includes('Avara') && lakshanas.includes('delirium')) {
    triggers.push('SANNIPATAJA JWARA WITH MOHA (SEVERE TOXIC FEVER / ENCEPHALOPATHY RISK)');
    protocolActions.push('STAT Blood cultures, lumbar puncture protocol, IV fluid resuscitation');
    riskScore = 88;
  }

  // Severe Gulma with complete bowel obstruction
  if (complaint.includes('gulma') && lakshanas.includes('obstruction')) {
    triggers.push('MAHA-GULMA / SHOOLA (ACUTE INTESTINAL OBSTRUCTION / SURGICAL ABDOMEN)');
    protocolActions.push('Surgical ER handover and abdominal ultrasound');
    riskScore = 82;
  }

  const isRedFlag = riskScore >= 75 || triggers.length > 0;

  return {
    isRedFlag,
    primaryCondition: triggers[0] || (dashavidha.vikriti.includes('Prakopa') ? 'Moderate Dosha Prakopa (Sub-acute AYUSH Triage)' : 'Samanya Doshika Imbalance (Routine AYUSH OPD)'),
    triageColor: isRedFlag ? 'RED' : dashavidha.vikriti.includes('Prakopa') ? 'YELLOW' : 'GREEN',
    riskScore: isRedFlag ? riskScore : 35,
    triggers: triggers.length > 0 ? triggers : ['Routine Ayurvedic OPD baseline criteria met'],
    protocolActions: protocolActions.length > 0 ? protocolActions : ['Panchakarma consultation scheduled', 'Pathya-Apathya dietary chart prescription', 'Nadi & Rogi Pariksha'],
    alertDispatchTime: isRedFlag ? new Date().toLocaleTimeString() : undefined,
    assignedErBay: isRedFlag ? 'AYUSH EMERGENCY RESUSCITATION BAY' : undefined,
  };
}

export function generateAyushEHRSummary(
  patientName: string,
  age: number,
  gender: string,
  dashavidha: DashavidhaPariksha,
  redFlag: EmergencyRedFlag,
  docs: ExtractedEntity[] = []
): EHRSummary {
  const snomedCodes: { code: string; display: string }[] = [
    { code: '386053000', display: 'Ayurvedic medicine practice (qualifier value)' },
    { code: '109848002', display: 'Examination of musculoskeletal system (procedure)' },
  ];
  const icd10Codes: { code: string; display: string }[] = [
    { code: 'M19.90', display: 'Osteoarthritis, unspecified site / Sandhigata Vata' },
    { code: 'K30', display: 'Functional dyspepsia / Agnimandya' },
  ];

  const hpi = `${patientName} (${age}y/${gender}) undergoes Dashavidha Pariksha. Baseline Prakriti: ${dashavidha.prakriti}; Current Pathological Vikriti: ${dashavidha.vikriti}. Tissue Sara assessment: ${dashavidha.sara}. Body compactness (Samhanana): ${dashavidha.samhanana}. Digestive fire capacity (Ahara Shakti): ${dashavidha.aharaShakti}. Mental constitution (Satva): ${dashavidha.satva}. Physical endurance (Vyayama Shakti): ${dashavidha.vyayamaShakti}. Age stage: ${dashavidha.vaya}. Chief Rogi complaint: ${dashavidha.chiefAyushComplaint}. Associated Lakshanas: ${dashavidha.associatedLakshanas.join(', ') || 'none'}.`;

  const meds = docs.filter(d => d.category === 'medication').map(m => `${m.name} (${m.value})`);
  const allergies = docs.filter(d => d.category === 'allergy').map(a => `${a.name}: ${a.value}`);

  return {
    chiefComplaint: `AYUSH Dashavidha: ${dashavidha.chiefAyushComplaint} (${dashavidha.vikriti})`,
    hpiNarrative: hpi,
    clinicalSystem: 'ayush',
    snomedCodes,
    icd10Codes,
    triageCategory: redFlag.isRedFlag ? 'Emergency (Red)' : 'Routine OPD (Green)',
    vitalSigns: {
      bloodPressure: '128/82 mmHg (Normal)',
      heartRate: '72 bpm (Prakrit Nadi Gati - Sarpavad/Mandook Gati)',
      spo2: '99% on Room Air',
      temperature: '98.4 °F',
      respiratoryRate: '16 /min',
    },
    keyFindings: [
      `Deha Prakriti: ${dashavidha.prakriti}`,
      `Dosha Vikriti: ${dashavidha.vikriti}`,
      `Agni Bala (Ahara Shakti): ${dashavidha.aharaShakti}`,
      `Manasika Satva Bala: ${dashavidha.satva}`,
    ],
    medicationsActive: meds.length > 0 ? meds : ['Classical Ayurvedic formulations (Guggulu, Taila)'],
    knownAllergies: allergies.length > 0 ? allergies : ['No known adverse drug reactions (ADR)'],
  };
}
