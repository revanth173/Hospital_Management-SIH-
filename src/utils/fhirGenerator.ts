import { FhirResourceBundle, PatientAuth, EHRSummary, DPDPDataConsent, SocratesAssessment, DashavidhaPariksha, MedicalSystem } from '../types/kiosk';

export function generateFhirR4Bundle(
  patient: PatientAuth,
  summary: EHRSummary,
  consent: DPDPDataConsent,
  system: MedicalSystem,
  socrates?: SocratesAssessment,
  dashavidha?: DashavidhaPariksha
): FhirResourceBundle {
  const timestamp = new Date().toISOString();
  const bundleId = `abdm-bundle-${Date.now().toString(36)}`;
  const patientId = `patient-${patient.aadhaarLast4 || '001'}`;
  const encounterId = `encounter-${Date.now().toString(36).slice(-6)}`;
  const compositionId = `comp-${Date.now().toString(36).slice(-6)}`;

  const bundle: FhirResourceBundle = {
    resourceType: 'Bundle',
    id: bundleId,
    type: 'transaction',
    timestamp,
    entry: [
      // 1. Composition Resource (Document Header)
      {
        fullUrl: `urn:uuid:${compositionId}`,
        resource: {
          resourceType: 'Composition',
          id: compositionId,
          status: 'final',
          type: {
            coding: [
              {
                system: 'http://snomed.info/sct',
                code: '371530004',
                display: 'Clinical consultation report',
              },
            ],
            text: 'OPD Clinical Intake Triage Record (ABDM Standard)',
          },
          subject: {
            reference: `Patient/${patientId}`,
            display: patient.patientName,
          },
          date: timestamp,
          author: [
            {
              display: 'Swasthya Kiosk AI Triage Subsystem (DPDP Certified)',
            },
          ],
          title: `OPD Clinical Intake - ${system.toUpperCase()}`,
        },
      },
      // 2. Patient Resource
      {
        fullUrl: `urn:uuid:${patientId}`,
        resource: {
          resourceType: 'Patient',
          id: patientId,
          identifier: [
            {
              system: 'https://healthid.abdm.gov.in',
              value: patient.abhaId,
              type: {
                coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v2-0203', code: 'MR', display: 'ABHA ID' }],
              },
            },
            {
              system: 'https://abdm.gov.in/abha-address',
              value: patient.abhaAddress,
            },
          ],
          name: [
            {
              use: 'official',
              text: patient.patientName,
            },
          ],
          gender: patient.gender.toLowerCase(),
          telecom: [
            {
              system: 'phone',
              value: patient.phone,
              use: 'mobile',
            },
          ],
        },
      },
      // 3. Encounter Resource
      {
        fullUrl: `urn:uuid:${encounterId}`,
        resource: {
          resourceType: 'Encounter',
          id: encounterId,
          status: 'in-progress',
          class: {
            system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
            code: 'AMB',
            display: 'ambulatory / outpatient',
          },
          subject: {
            reference: `Patient/${patientId}`,
          },
          priority: {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/v3-ActPriority',
                code: summary.triageCategory.includes('Emergency') ? 'EM' : summary.triageCategory.includes('Urgent') ? 'UR' : 'R',
                display: summary.triageCategory,
              },
            ],
          },
        },
      },
      // 4. Condition Resource (Diagnosis / Chief Complaint)
      {
        fullUrl: `urn:uuid:condition-01`,
        resource: {
          resourceType: 'Condition',
          id: 'condition-01',
          clinicalStatus: {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
                code: 'active',
              },
            ],
          },
          verificationStatus: {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status',
                code: 'provisional',
              },
            ],
          },
          code: {
            coding: summary.snomedCodes.map(s => ({
              system: 'http://snomed.info/sct',
              code: s.code,
              display: s.display,
            })),
            text: summary.chiefComplaint,
          },
          subject: {
            reference: `Patient/${patientId}`,
          },
          note: [
            {
              text: summary.hpiNarrative,
            },
          ],
        },
      },
      // 5. Consent Resource (DPDP Act 2023)
      {
        fullUrl: `urn:uuid:consent-01`,
        resource: {
          resourceType: 'Consent',
          id: 'consent-01',
          status: 'active',
          scope: {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/consentscope',
                code: 'patient-privacy',
                display: 'Privacy Consent',
              },
            ],
          },
          category: [
            {
              coding: [
                {
                  system: 'https://abdm.gov.in/dpdp-2023',
                  code: 'DPDP-SEC-6-1',
                  display: consent.dpdpActVersion,
                },
              ],
            },
          ],
          patient: {
            reference: `Patient/${patientId}`,
          },
          dateTime: consent.timestamp,
          policy: [
            {
              uri: 'https://meity.gov.in/dpdp-act-2023',
            },
          ],
        },
      },
    ],
  };

  // Add vital observations
  if (summary.vitalSigns.bloodPressure) {
    bundle.entry.push({
      fullUrl: `urn:uuid:obs-bp`,
      resource: {
        resourceType: 'Observation',
        id: 'obs-bp',
        status: 'final',
        category: [
          {
            coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'vital-signs' }],
          },
        ],
        code: {
          coding: [{ system: 'http://loinc.org', code: '85354-9', display: 'Blood pressure panel' }],
          text: 'Blood Pressure',
        },
        subject: { reference: `Patient/${patientId}` },
        valueString: summary.vitalSigns.bloodPressure,
      },
    });
  }

  if (summary.vitalSigns.heartRate) {
    bundle.entry.push({
      fullUrl: `urn:uuid:obs-hr`,
      resource: {
        resourceType: 'Observation',
        id: 'obs-hr',
        status: 'final',
        category: [
          {
            coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'vital-signs' }],
          },
        ],
        code: {
          coding: [{ system: 'http://loinc.org', code: '8867-4', display: 'Heart rate' }],
          text: 'Heart Rate',
        },
        subject: { reference: `Patient/${patientId}` },
        valueString: summary.vitalSigns.heartRate,
      },
    });
  }

  return bundle;
}
