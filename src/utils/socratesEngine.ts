import { SocratesAssessment, EmergencyRedFlag, EHRSummary, ExtractedEntity } from '../types/kiosk';

export function evaluateSocratesEmergency(socrates: SocratesAssessment): EmergencyRedFlag {
  const triggers: string[] = [];
  const protocolActions: string[] = [];
  let riskScore = 0;

  // Cardiac ACS check
  const isChest = socrates.siteLocationCategory === 'chest' || socrates.site.toLowerCase().includes('chest') || socrates.site.toLowerCase().includes('retrosternal') || socrates.site.toLowerCase().includes('precordial');
  const isCrushing = socrates.character.toLowerCase().includes('crush') || socrates.character.toLowerCase().includes('constricting') || socrates.character.toLowerCase().includes('tight');
  const hasRadiationToArmJaw = socrates.radiation.toLowerCase().includes('arm') || socrates.radiation.toLowerCase().includes('jaw') || socrates.radiation.toLowerCase().includes('shoulder');
  const hasDiaphoresis = socrates.associations.some(a => a.toLowerCase().includes('diaphoresis') || a.toLowerCase().includes('sweat'));
  const hasDyspnea = socrates.associations.some(a => a.toLowerCase().includes('dyspnea') || a.toLowerCase().includes('breath'));

  if (isChest && (isCrushing || socrates.severityScore >= 8) && (hasRadiationToArmJaw || hasDiaphoresis)) {
    triggers.push('SUSPECTED ACUTE CORONARY SYNDROME (STEMI / NSTEMI)');
    triggers.push('Retrosternal crushing chest pain with radiation to left arm/jaw and autonomic diaphoresis');
    protocolActions.push('Immediate 12-Lead STAT ECG within 10 minutes');
    protocolActions.push('STAT Aspirin 325mg chewable + Clopidogrel 300mg loading dose per local ER protocol');
    protocolActions.push('High-flow Oxygen via nasal cannula if SpO2 < 90%');
    protocolActions.push('Emergency Bay 1 Telemetry Lock & Cardiac Cath Lab notification');
    riskScore = 95;
  }

  // Stroke / Neurological check
  const isHead = socrates.siteLocationCategory === 'head' || socrates.site.toLowerCase().includes('head');
  const isSuddenThunderclap = socrates.onset.includes('Sudden') && socrates.character.includes('Stabbing');
  const hasAlteredMental = socrates.associations.some(a => a.toLowerCase().includes('dizziness') || a.toLowerCase().includes('confusion') || a.toLowerCase().includes('numb'));

  if (isHead && isSuddenThunderclap && socrates.severityScore >= 9) {
    triggers.push('SUSPECTED SUBARACHNOID HEMORRHAGE / ACUTE CEREBROVASCULAR ACCIDENT');
    protocolActions.push('STAT Non-Contrast Brain CT Protocol');
    protocolActions.push('Stroke Team immediate activation');
    riskScore = 92;
  }

  // Severe Respiratory Failure check
  if (hasDyspnea && socrates.functionalImpact.includes('Unable to walk or speak')) {
    triggers.push('ACUTE RESPIRATORY DISTRESS & HYPOXIA RISK');
    protocolActions.push('Emergency Nebulization & Continuous SpO2 Monitoring');
    protocolActions.push('Intubation team standby');
    riskScore = Math.max(riskScore, 88);
  }

  // Acute Peritoneal Abdomen check
  const isAbdomen = socrates.siteLocationCategory === 'abdomen';
  if (isAbdomen && socrates.character.includes('Sharp') && socrates.severityScore >= 8 && socrates.onset.includes('Sudden')) {
    triggers.push('ACUTE SURGICAL ABDOMEN (PERFORATION / PERITONITIS)');
    protocolActions.push('Immediate Surgical Registrar bedside review');
    protocolActions.push('IV fluids bolus and cross-match blood');
    riskScore = Math.max(riskScore, 85);
  }

  const isRedFlag = riskScore >= 75 || triggers.length > 0;

  return {
    isRedFlag,
    primaryCondition: triggers[0] || (socrates.severityScore >= 7 ? 'High Acuity Clinical Discomfort' : 'Standard Acuity Medical Complaint'),
    triageColor: isRedFlag ? 'RED' : socrates.severityScore >= 6 ? 'YELLOW' : 'GREEN',
    riskScore: isRedFlag ? riskScore : socrates.severityScore * 8,
    triggers: triggers.length > 0 ? triggers : ['Standard baseline clinical triage criteria'],
    protocolActions: protocolActions.length > 0 ? protocolActions : ['Routine OPD triage evaluation', 'Vitals logging', 'Queue prioritization'],
    alertDispatchTime: isRedFlag ? new Date().toLocaleTimeString() : undefined,
    assignedErBay: isRedFlag ? 'EMERGENCY BAY-01 (RED ZONE)' : undefined,
  };
}

export function generateAllopathicEHRSummary(
  patientName: string,
  age: number,
  gender: string,
  socrates: SocratesAssessment,
  redFlag: EmergencyRedFlag,
  docs: ExtractedEntity[] = []
): EHRSummary {
  const snomedCodes: { code: string; display: string }[] = [];
  const icd10Codes: { code: string; display: string }[] = [];

  if (socrates.siteLocationCategory === 'chest') {
    snomedCodes.push({ code: '29857009', display: 'Chest pain (finding)' });
    icd10Codes.push({ code: 'R07.9', display: 'Chest pain, unspecified' });
    if (redFlag.isRedFlag) {
      snomedCodes.push({ code: '399211009', display: 'Acute myocardial infarction (disorder)' });
      icd10Codes.push({ code: 'I21.9', display: 'Acute myocardial infarction, unspecified' });
    }
  } else if (socrates.siteLocationCategory === 'limbs') {
    snomedCodes.push({ code: '57676002', display: 'Joint pain (finding)' });
    icd10Codes.push({ code: 'M25.50', display: 'Pain in unspecified joint' });
  } else if (socrates.siteLocationCategory === 'throat') {
    snomedCodes.push({ code: '267102003', display: 'Sore throat symptom (finding)' });
    icd10Codes.push({ code: 'J02.9', display: 'Acute pharyngitis, unspecified' });
  } else if (socrates.siteLocationCategory === 'head') {
    snomedCodes.push({ code: '25064002', display: 'Headache (finding)' });
    icd10Codes.push({ code: 'R51.9', display: 'Headache, unspecified' });
  } else {
    snomedCodes.push({ code: '22253000', display: 'Pain (finding)' });
    icd10Codes.push({ code: 'R52', display: 'Pain, unspecified' });
  }

  const hpi = `${patientName} (${age}y/${gender}) presents with ${socrates.character.toLowerCase()} discomfort located at ${socrates.site}. Onset was ${socrates.onset.toLowerCase()}, with ${socrates.timeCourse.toLowerCase()} progression. Radiation noted to ${socrates.radiation}. Associated symptoms include ${socrates.associations.join(', ') || 'none'}. Aggravated by ${socrates.exacerbatingFactors.join(', ') || 'unspecified triggers'} and relieved by ${socrates.relievingFactors.join(', ') || 'none'}. Visual Analog Scale (VAS) pain score is ${socrates.severityScore}/10 (${socrates.functionalImpact}).`;

  const meds = docs.filter(d => d.category === 'medication').map(m => `${m.name} (${m.value})`);
  const allergies = docs.filter(d => d.category === 'allergy').map(a => `${a.name}: ${a.value}`);

  return {
    chiefComplaint: `${socrates.character} pain at ${socrates.site} (Severity ${socrates.severityScore}/10)`,
    hpiNarrative: hpi,
    clinicalSystem: 'allopathic',
    snomedCodes,
    icd10Codes,
    triageCategory: redFlag.isRedFlag ? 'Emergency (Red)' : socrates.severityScore >= 6 ? 'Urgent (Yellow)' : 'Routine OPD (Green)',
    vitalSigns: {
      bloodPressure: redFlag.isRedFlag ? '154/96 mmHg (Elevated)' : '124/80 mmHg (Normal)',
      heartRate: redFlag.isRedFlag ? '104 bpm (Tachycardia)' : '76 bpm (Regular)',
      spo2: redFlag.isRedFlag ? '94% on Room Air' : '98% on Room Air',
      temperature: '98.6 °F',
      respiratoryRate: redFlag.isRedFlag ? '24 /min' : '16 /min',
    },
    keyFindings: [
      `Anatomical Site: ${socrates.site}`,
      `Pain Quality: ${socrates.character}`,
      `Radiation Pattern: ${socrates.radiation}`,
      `Triage Score: ${redFlag.riskScore}/100 [${redFlag.triageColor}]`,
    ],
    medicationsActive: meds.length > 0 ? meds : ['None logged / self-reported OTC only'],
    knownAllergies: allergies.length > 0 ? allergies : ['NKDA (No Known Drug Allergies)'],
  };
}
