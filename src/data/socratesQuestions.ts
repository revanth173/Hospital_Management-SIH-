import { Language, SocratesAssessment } from '../types/kiosk';

export interface SocratesQuestionStep {
  id: keyof SocratesAssessment | 'socrates_welcome';
  key: string;
  stepNumber: number;
  totalSteps: number;
  letter: 'S' | 'O' | 'C' | 'R' | 'A' | 'T' | 'E' | 'S';
  title: Record<Language, string>;
  voicePrompt: Record<Language, string>;
  medicalClinicalRationale: string;
  options?: Array<{
    id: string;
    label: Record<Language, string>;
    clinicalTag: string;
    keywords: string[];
  }>;
}

export const SOCRATES_QUESTIONS_FLOW: SocratesQuestionStep[] = [
  {
    id: 'siteLocationCategory',
    key: 'site',
    stepNumber: 1,
    totalSteps: 8,
    letter: 'S',
    medicalClinicalRationale: 'Anatomical Site Localization (ICD-10 / SNOMED CT Mapping)',
    title: {
      en: '1. Site: Exactly where do you feel the pain or discomfort?',
      te: '1. Site: మీకు సమస్య లేదా నొప్పి ఖచ్చితంగా ఎక్కడ ఉంది?',
      hi: '1. Site: आपको दर्द या तकलीफ़ शरीर में ठीक कहाँ हो रही है?',
      ta: '1. Site: வலி அல்லது அசௌகரியம் சரியாக எங்கே உள்ளது?',
      kn: '1. Site: ನಿಮಗೆ ನೋವು ಅಥವಾ ಸಮಸ್ಯೆ ನಿಖರವಾಗಿ ಎಲ್ಲಿದೆ?',
      mr: '1. Site: तुम्हाला नेमका कुठे त्रास किंवा वेदना होत आहे?',
      bn: '1. Site: আপনার ব্যথা বা সমস্যাটি ঠিক কোথায় হচ্ছে?',
    },
    voicePrompt: {
      en: 'Please tell me: where is your pain or discomfort located? For example: chest, head, stomach, back, throat, or limbs.',
      te: 'దయచేసి చెప్పండి: మీకు నొప్పి శరీరంలో ఎక్కడ వస్తోంది? ఉదాహరణకు: ఛాతీ లేదా గుండె వద్ద, తల, కడుపు, నడుము, గొంతు లేదా కాళ్ళు/చేతులు.',
      hi: 'कृपया बताएं: आपको दर्द कहाँ हो रहा है? जैसे: सीना या छाती, सिर, पेट, पीठ, गला या हाथ-पैर।',
      ta: 'தயவுசெய்து கூறுங்கள்: வலி எங்கே உள்ளது? நெஞ்சு, தலை, வயிறு, முதுகு அல்லது கை கால்கள்.',
      kn: 'ದಯವಿಟ್ಟು ತಿಳಿಸಿ: ನಿಮಗೆ ನೋವು ಎಲ್ಲಿದೆ? ಎದೆ, ತಲೆ, ಹೊಟ್ಟೆ, ಬೆನ್ನು ಅಥವಾ ಕೈ ಕಾಲುಗಳು.',
      mr: 'कृपया सांगा: तुम्हाला कुठे वेदना होत आहे? छाती, डोके, पोट, पाठ किंवा हातपाय.',
      bn: 'দয়া করে বলুন: আপনার ব্যথাটি কোথায় হচ্ছে? বুক, মাথা, পেট, পিঠ, গলা বা হাত-পা.',
    },
    options: [
      {
        id: 'chest',
        label: { en: 'Chest / Heart Region', te: 'ఛాతీ / గుండె ప్రాంతం', hi: 'सीना / छाती', ta: 'நெஞ்சு பகுதி', kn: 'ಎದೆ ಭಾಗ', mr: 'छाती', bn: 'বুক' },
        clinicalTag: 'Precordial / Retrosternal',
        keywords: ['chest', 'heart', 'గుండె', 'ఛాతీ', 'छाती', 'सीना', 'நெஞ்சு', 'ಎದೆ', 'छातीत', 'বুক'],
      },
      {
        id: 'head',
        label: { en: 'Head & Brain / Migraine', te: 'తల / మెదడు / మైగ్రేన్', hi: 'सिर / माइग्रेन', ta: 'தலை / ஒற்றைத் தலைவலி', kn: 'ತಲೆ ನೋವು', mr: 'डोकेदुखी', bn: 'মাথা' },
        clinicalTag: 'Cranial / Cephalea',
        keywords: ['head', 'migraine', 'headache', 'తల', 'తలనెప్పి', 'सिर', 'माथा', 'தலை', 'ತಲೆ', 'डोके', 'মাথা'],
      },
      {
        id: 'abdomen',
        label: { en: 'Abdomen / Stomach / Belly', te: 'కడుపు / పొట్ట', hi: 'पेट / आंत', ta: 'வயிறு பகுதி', kn: 'ಹೊಟ್ಟೆ', mr: 'पोट', bn: 'পেট' },
        clinicalTag: 'Epigastric / Visceral',
        keywords: ['stomach', 'abdomen', 'belly', 'కడుపు', 'పొట్ట', 'पेट', 'வயிறு', 'ಹೊಟ್ಟೆ', 'पोट', 'পেট'],
      },
      {
        id: 'back',
        label: { en: 'Back / Spine / Lumbar', te: 'వెన్ను / నడుము నొప్పి', hi: 'पीठ / कमर दर्द', ta: 'முதுகு / இடுப்பு', kn: 'ಬೆನ್ನು / ಸೊಂಟ', mr: 'पाठ / कंबर', bn: 'পিঠ / কোমর' },
        clinicalTag: 'Lumbar / Vertebral',
        keywords: ['back', 'spine', 'waist', 'నడుము', 'వెన్ను', 'पीठ', 'कमर', 'முதுகு', 'ಬೆನ್ನು', 'पाठ', 'পিঠ'],
      },
      {
        id: 'throat',
        label: { en: 'Throat / Neck / Cough', te: 'గొంతు / మెడ / దగ్గు', hi: 'गला / गर्दन / खांसी', ta: 'தொண்டை / கழுத்து', kn: 'ಗಂಟಲು / ಕುತ್ತಿಗೆ', mr: 'घसा / मान', bn: 'গলা / ঘাড়' },
        clinicalTag: 'Pharyngeal / Cervical',
        keywords: ['throat', 'neck', 'cough', 'గొంతు', 'దగ్గు', 'మెడ', 'गला', 'गर्दन', 'खांसी', 'தொண்டை', 'ಗಂಟಲು', 'घसा', 'গলা'],
      },
      {
        id: 'limbs',
        label: { en: 'Limbs, Knees & Joints', te: 'కాళ్ళు, చేతులు & కీళ్ళు', hi: 'हाथ-पैर, घुटने व जोड़', ta: 'கை கால் & மூட்டு வலி', kn: 'ಕೈ ಕಾಲು & ಕೀಲುಗಳು', mr: 'हातपाय व सांधे', bn: 'হাত-পা ও সন্ধি' },
        clinicalTag: 'Articular / Musculoskeletal',
        keywords: ['leg', 'hand', 'knee', 'joint', 'arm', 'కాలు', 'చేయి', 'మోకాలు', 'కీళ్ళు', 'हाथ', 'पैर', 'घुटने', 'கை', 'கால்', 'ಕಾಲು', 'हात', 'পা'],
      },
    ],
  },

  {
    id: 'onset',
    key: 'onset',
    stepNumber: 2,
    totalSteps: 8,
    letter: 'O',
    medicalClinicalRationale: 'Temporal Onset & Acuity Velocity',
    title: {
      en: '2. Onset: How quickly did the pain start and how long ago?',
      te: '2. Onset: ఈ నొప్పి ఎప్పుడు మరియు ఎంత వేగంగా మొదలైంది?',
      hi: '2. Onset: यह दर्द कब और कितनी तेज़ी से शुरू हुआ?',
      ta: '2. Onset: இந்த வலி எப்போது மற்றும் எவ்வளவு வேகமாக தொடங்கியது?',
      kn: '2. Onset: ಈ ನೋವು ಯಾವಾಗ ಮತ್ತು ಎಷ್ಟು ಬೇಗ ಶುರುವಾಯಿತು?',
      mr: '2. Onset: हा त्रास नेमका कधी आणि कसा सुरू झाला?',
      bn: '2. Onset: এই ব্যথাটি কখন এবং কতটা দ্রুত শুরু হয়েছিল?',
    },
    voicePrompt: {
      en: 'How did it start? Was it sudden within minutes, rapid over 1-2 hours, or gradual over days?',
      te: 'నొప్పి ఎలా మొదలైంది? హఠాత్తుగా కొన్ని నిమిషాల్లోనా, గంటల వ్యవధిలోనా, లేక కొన్ని రోజులుగా నెమ్మదిగా వస్తోందా?',
      hi: 'यह कैसे शुरू हुआ? अचानक कुछ ही मिनटों में, 1-2 घंटों में, या कई दिनों से धीरे-धीरे?',
      ta: 'இது எவ்வாறு தொடங்கியது? திடீரென நிமிடங்களில் அல்லது சில நாட்களாகவா?',
      kn: 'ಇದು ಹೇಗೆ ಪ್ರಾರಂಭವಾಯಿತು? ತಕ್ಷಣವೇ ಕೆಲವು ನಿಮಿಷಗಳಲ್ಲಿಯೆ ಅಥವಾ ದಿನಗಳಿಂದ ನಿಧಾನವಾಗಿಯೆ?',
      mr: 'सुरुवात कशी झाली? अचानक काही मिनिटांत, 1-2 तासांत की काही दिवसांपासून हळूहळू?',
      bn: 'শুরুটা কেমন ছিল? হঠাৎ কয়েক মিনিটের মধ্যে, নাকি কয়েক দিন ধরে ধীরে ধীরে?',
    },
    options: [
      {
        id: 'Sudden (<15 mins)',
        label: { en: 'Sudden (<15 mins)', te: 'హఠాత్తుగా (15 నిమిషాల లోపు)', hi: 'अचानक (<15 मिनट)', ta: 'திடீரென (<15 நிமிடங்கள்)', kn: 'ತಕ್ಷಣವೇ (<15 ನಿಮಿಷ)', mr: 'अचानक (<15 मिनिटे)', bn: 'হঠাৎ (<15 মিনিট)' },
        clinicalTag: 'Hyperacute',
        keywords: ['sudden', 'minutes', 'హఠాత్తుగా', 'వెంటనే', 'తక్షణమే', 'अचानक', 'एकदम', 'திடீர்', 'ತಕ್ಷಣ', 'ঝটকা'],
      },
      {
        id: 'Rapid (1-2 hours)',
        label: { en: 'Rapid (1-2 hours)', te: 'వేగంగా (1-2 గంటల్లో)', hi: 'तेज़ी से (1-2 घंटे)', ta: 'வேகமாக (1-2 மணிநேரம்)', kn: 'ವೇಗವಾಗಿ (1-2 ಗಂಟೆ)', mr: 'वेगाने (1-2 तास)', bn: 'দ্রুত (1-2 ঘন্টা)' },
        clinicalTag: 'Acute',
        keywords: ['rapid', 'hours', 'గంట', 'గంటల', 'घंटे', 'மணிநேரம்', 'तास', 'ঘণ্টা'],
      },
      {
        id: 'Gradual (days)',
        label: { en: 'Gradual (over several days/weeks)', te: 'క్రమంగా (కొన్ని రోజులుగా)', hi: 'धीरे-धीरे (कई दिनों से)', ta: 'படிப்படியாக (சில நாட்களாக)', kn: 'ನಿಧಾನವಾಗಿ (ಕೆಲವು ದಿನಗಳಿಂದ)', mr: 'हळूहळू (काही दिवसांपासून)', bn: 'ধীরে ধীরে (কয়েক দিন ধরে)' },
        clinicalTag: 'Subacute / Chronic',
        keywords: ['gradual', 'days', 'weeks', 'రోజులు', 'రోజులుగా', 'నెమ్మదిగా', 'धीरे', 'दिनों', 'நாட்கள்', 'ದಿನ', 'दिवस', 'দিন'],
      },
      {
        id: 'During exertion',
        label: { en: 'During Physical Work / Walking', te: 'పని చేస్తున్నప్పుడు / నడుస్తున్నప్పుడు', hi: 'चलते समय या मेहनत करते समय', ta: 'வேலை அல்லது நடக்கும் போது', kn: 'ಕೆಲಸ ಅಥವಾ ನಡೆಯುವಾಗ', mr: 'काम करताना किंवा चालताना', bn: 'কাজ করার বা হাঁটার সময়' },
        clinicalTag: 'Exertional Onset',
        keywords: ['exertion', 'walking', 'work', 'నడక', 'నడుస్తుంటే', 'పని', 'काम', 'चलने', 'வேலை', 'ನಡೆಯುವಾಗ', 'हাঁটা'],
      },
    ],
  },

  {
    id: 'character',
    key: 'character',
    stepNumber: 3,
    totalSteps: 8,
    letter: 'C',
    medicalClinicalRationale: 'Pain Quality Spectrum (Ischemic vs Neuropathic vs Inflammatory)',
    title: {
      en: '3. Character: What kind of pain is it feeling like?',
      te: '3. Character: నొప్పి ఎలాంటి రకంగా అనిపిస్తోంది?',
      hi: '3. Character: दर्द का अहसास कैसा है?',
      ta: '3. Character: வலி என்ன மாதிரியாக உணர்கிறது?',
      kn: '3. Character: ನೋವಿನ ಸ್ವರೂಪ ಹೇಗಿದೆ?',
      mr: '3. Character: वेदनांचा प्रकार कसा वाटतो?',
      bn: '3. Character: ব্যথার ধরনটি কেমন অনুভূত হচ্ছে?',
    },
    voicePrompt: {
      en: 'What does the pain feel like? Is it crushing or heavy pressure, sharp stabbing, burning, dull aching, or throbbing?',
      te: 'నొప్పి స్వభావం ఎలా ఉంది? బరువుగా అదిమిపట్టినట్లుగా ఉందా, సూదితో గుచ్చినట్లుగా ఉందా, మంటగా ఉందా, లేదా దిమ్ముగా లాగుతోందా?',
      hi: 'दर्द कैसा महसूस हो रहा है? भारी दबाव/दबाव जैसा, चुभने जैसा, जलन, भारीपन या धड़कता हुआ?',
      ta: 'வலி எப்படி இருக்கிறது? பாரமான அழுத்தம், குத்துவது போல, எரியும் உணர்வு, அல்லது மந்தமான வலியா?',
      kn: 'ನೋವು ಹೇಗನಿಸುತ್ತಿದೆ? ಭಾರವಾದ ಒತ್ತಡ, ಚುಚ್ಚುವಂತೆ, ಉರಿ ಅಥವಾ ಎಳೆಯುವ ನೋವಾ?',
      mr: 'वेदना कशी आहे? छातीवर जड भार, टोचल्यासारखी, जळजळ, की मंद वेदना?',
      bn: 'ব্যথাটা কেমন লাগছে? ভারী চাপ, সূঁচ ফোটার মতো, জ্বালাভাব, নাকি একটানা চিনচিনে ব্যথা?',
    },
    options: [
      {
        id: 'Crushing / Constricting',
        label: { en: 'Crushing / Heavy Tight Pressure', te: 'బరువుగా అదిమిపట్టినట్లు / పట్టేసినట్లు', hi: 'भारी दबाव / जकड़न जैसा', ta: 'பாரமான அழுத்தம் / இறுக்கம்', kn: 'ಭಾರವಾದ ಒತ್ತಡ / ಹಿಡಿದಂತೆ', mr: 'छातीवर जड भार / दाब', bn: 'ভারী চাপ / আঁটসাঁট' },
        clinicalTag: 'Ischemic Anginal Sensation',
        keywords: ['crushing', 'heavy', 'tight', 'pressure', 'బరువు', 'పట్టేసినట్లు', 'అదిమినట్లు', 'भारी', 'दबाव', 'பாரமான', 'ಭಾರ', 'जड', 'ভারী'],
      },
      {
        id: 'Sharp / Stabbing',
        label: { en: 'Sharp / Stabbing (Needle-like)', te: 'తీవ్రంగా / సూదులతో గుచ్చినట్లు', hi: 'तेज़ / सुई की तरह चुभन', ta: 'கூர்மையான / குத்துவது போல', kn: 'ಚುಚ್ಚುವಂತಹ ತೀವ್ರ ನೋವು', mr: 'तीक्ष्ण / सुई टोचल्यासारखी', bn: 'তীক্ষ্ণ / সূঁচ ফোটার মতো' },
        clinicalTag: 'Pleuritic / Peritoneal',
        keywords: ['sharp', 'stabbing', 'needle', 'గుచ్చినట్లు', 'సూది', 'తీవ్ర', 'चुभन', 'सुई', 'குத்துவது', 'ಚುಚ್ಚುವ', 'टोचणे', 'তীক্ষ্ণ'],
      },
      {
        id: 'Burning',
        label: { en: 'Burning / Hot Acidic sensation', te: 'మంటగా / గుండెల్లో మంట / ఎసిడిటీ', hi: 'जलन / एसिडिटी जैसा', ta: 'நெஞ்செரிச்சல் / எரியும் உணர்வு', kn: 'ಉರಿ / ಎಸಿಡಿಟಿ', mr: 'जळजळ / आग होणे', bn: 'জ্বালা / অম্বল' },
        clinicalTag: 'Pyrosis / Neuropathic Burning',
        keywords: ['burning', 'fire', 'acid', 'మంట', 'ఎసిడిటీ', 'కడుపులో మంట', 'जलन', 'आग', 'நெஞ்செரிச்சல்', 'ಉರಿ', 'जळजळ', 'জ্বালা'],
      },
      {
        id: 'Dull Aching',
        label: { en: 'Dull Aching / Heavy Strain', te: 'దిమ్ముగా / నరాల అలసట లాగుతోంది', hi: 'धीमा लगातार दर्द / भारीपन', ta: 'மந்தமான வலி', kn: 'ಮಂದವಾದ ನೋವು', mr: 'मंद सलग वेदना', bn: 'একটানা চিনচিনে ব্যথা' },
        clinicalTag: 'Somatic / Visceral Aching',
        keywords: ['dull', 'aching', 'దిమ్ము', 'లాగుతోంది', 'धीमा', 'दर्द', 'மந்தமான', 'ಮಂದ', 'मंद', 'চিনচিন'],
      },
      {
        id: 'Throbbing',
        label: { en: 'Throbbing / Pulsating (Lubb-Dubb)', te: 'లబ్-డబ్ అని కొట్టుకుంటున్నట్లు', hi: 'धड़कता हुआ दर्द', ta: 'துடிக்கும் வலி', kn: 'ಬಡಿದುಕೊಳ್ಳುವ ನೋವು', mr: 'धडधडणारी वेदना', bn: 'দপ-দপানি ব্যথা' },
        clinicalTag: 'Vascular Pulsatile',
        keywords: ['throbbing', 'pulsing', 'కొట్టుకుంటున్నట్లు', 'లబ్', 'धड़कन', 'துடிப்பு', 'ಬಡಿತ', 'धडधड', 'দপদপ'],
      },
    ],
  },

  {
    id: 'radiation',
    key: 'radiation',
    stepNumber: 4,
    totalSteps: 8,
    letter: 'R',
    medicalClinicalRationale: 'Anatomical Dermatomal Radiation Vector',
    title: {
      en: '4. Radiation: Is the pain spreading anywhere else in the body?',
      te: '4. Radiation: నొప్పి శరీరంలో ఇతర భాగాలకు పాకుతోందా?',
      hi: '4. Radiation: क्या दर्द शरीर के किसी और हिस्से में फैल रहा है?',
      ta: '4. Radiation: வலி உடலின் வேறு பகுதிக்கு பரவுகிறதா?',
      kn: '4. Radiation: ನೋವು ಬೇರೆಲ್ಲಿಗಾದರೂ ಹರಡುತ್ತಿದೆಯೇ?',
      mr: '4. Radiation: वेदना शरीराच्या इतर भागात पसरत आहेत का?',
      bn: '4. Radiation: ব্যথাটি শরীরের অন্য কোথাও ছড়িয়ে পড়ছে কি?',
    },
    voicePrompt: {
      en: 'Is the pain spreading or shooting anywhere? For example: to your left arm, shoulder, jaw, neck, back, or staying in one spot?',
      te: 'నొప్పి ఎక్కడికైనా పాకుతోందా? ఎడమ చేయి, భుజం, దవడ, గొంతు, వీపు వైపు వెళ్తోందా లేదా ఉన్నచోటే ఉందా?',
      hi: 'क्या दर्द कहीं और फैल रहा है? जैसे बाएं हाथ, कंधे, जबड़े, गले, पीठ में या सिर्फ एक जगह पर है?',
      ta: 'வலி வேறு இடத்திற்கு பரவுகிறதா? இடது கை, தோள்பட்டை, தாடை, முதுகு அல்லது ஒரே இடத்திலா?',
      kn: 'ನೋವು ಬೇರೆಡೆ ಹರಡುತ್ತಿದೆಯೇ? ಎಡಗೈ, ಭುಜ, ದವಡೆ, ಬೆನ್ನಿಗೆ ಅಥವಾ ಒಂದೇ ಸ್ಥಳದಲ್ಲಿದೆಯೇ?',
      mr: 'वेदना पसरत आहेत का? डावा हात, खांदा, जबडा, पाठ की एकाच ठिकाणी?',
      bn: 'ব্যথাটি কি ছড়াচ্ছে? বাঁ হাত, কাঁধ, চোয়াল, পিঠে নাকি এক জায়গাতেই সীমাবদ্ধ?',
    },
    options: [
      {
        id: 'Left arm, shoulder & jaw',
        label: { en: 'Spreading to Left Arm, Shoulder or Jaw', te: 'ఎడమ చేయి, భుజం లేదా దవడ వైపు పాకుతోంది', hi: 'बाएं हाथ, कंधे या जबड़े में फैल रहा है', ta: 'இடது கை, தோள் அல்லது தாடைக்கு பரவுகிறது', kn: 'ಎಡಗೈ, ಭುಜ ಅಥವಾ ದವಡೆಗೆ ಹರಡುತ್ತಿದೆ', mr: 'डावा हात, खांदा किंवा जबड्यात पसरत आहे', bn: 'বাঁ হাত, কাঁধ বা চোয়ালে ছড়িয়ে পড়ছে' },
        clinicalTag: 'Cardiac Dermatome T1-T4 (High Alert)',
        keywords: ['arm', 'left', 'shoulder', 'jaw', 'చేయి', 'ఎడమ', 'భుజం', 'దవడ', 'बाएं', 'हाथ', 'कंधा', 'जबड़ा', 'கை', 'தோள்', 'ಎಡಗೈ', 'हात', 'হাত', 'কাঁধ'],
      },
      {
        id: 'Through to back',
        label: { en: 'Piercing through to Back / Shoulder blades', te: 'వెనుక వీపు / భుజాల మధ్యకు వెళ్తోంది', hi: 'पीछे पीठ या कंधों के बीच जा रहा है', ta: 'முதுகுக்கு பின்னால் செல்கிறது', kn: 'ಬೆನ್ನಿನ ಹಿಂಭಾಗಕ್ಕೆ ಹೋಗುತ್ತಿದೆ', mr: 'पाठीत मागे आरपार जात आहे', bn: 'পিঠের দিকে ছড়িয়ে পড়ছে' },
        clinicalTag: 'Posterior Thoracic Radiation',
        keywords: ['back', 'spine', 'వీపు', 'వెన్ను', 'నడుము', 'पीठ', 'पीछे', 'முதுகு', 'ಬೆನ್ನು', 'पाठ', 'পিঠ'],
      },
      {
        id: 'Down right lower abdomen',
        label: { en: 'Moving down towards Groin / Lower Abdomen', te: 'క్రింది పొట్ట / గజ్జల వైపు దిగుతోంది', hi: 'निचले पेट या कमर के निचले हिस्से में', ta: 'அடிவயிறு நோக்கி இறங்குகிறது', kn: 'ಕೆಳ ಹೊಟ್ಟೆಯ ಕಡೆ ಇಳಿಯುತ್ತಿದೆ', mr: 'खालच्या पोटाकडे सरकत आहे', bn: 'তলপেটের দিকে নামছে' },
        clinicalTag: 'Appendiceal / Ureteric Colic',
        keywords: ['groin', 'lower abdomen', 'క్రింది పొట్ట', 'గజ్జలు', 'पेट', 'அடிவயிறு', 'ಹೊಟ್ಟೆ', 'পোট', 'তলপেট'],
      },
      {
        id: 'None',
        label: { en: 'No, staying strictly in one fixed spot', te: 'ఎక్కడికీ పాకట్లేదు, ఒకే చోట ఉంది', hi: 'नहीं, केवल एक ही जगह पर है', ta: 'இல்லை, ஒரே இடத்தில் மட்டும் உள்ளது', kn: 'ಇಲ್ಲ, ಒಂದೇ ಜಾಗದಲ್ಲಿದೆ', mr: 'नाही, एकाच ठिकाणी आहे', bn: 'না, একই জায়গায় রয়েছে' },
        clinicalTag: 'Localized / Non-Radiating',
        keywords: ['no', 'none', 'staying', 'fixed', 'ఎక్కడికీ లేదు', 'లేదు', 'ఒకే చోట', 'नहीं', 'वहीं', 'இல்லை', 'ಇಲ್ಲ', 'नाही', 'না'],
      },
    ],
  },

  {
    id: 'associations',
    key: 'associations',
    stepNumber: 5,
    totalSteps: 8,
    letter: 'A',
    medicalClinicalRationale: 'Associated Autonomic & Secondary Symptoms',
    title: {
      en: '5. Associated Symptoms: Are you having sweating, breathlessness or vomiting?',
      te: '5. Associated Symptoms: చెమటలు, ఆయాసం, వాంతులు లేదా తలతిరుగుడు లాంటివి ఏమైనా ఉన్నాయా?',
      hi: '5. Associated Symptoms: क्या आपको पसीना, सांस फूलना या उल्टी जैसी समस्या है?',
      ta: '5. Associated Symptoms: வியர்வை, மூச்சுத்திணறல், வாந்தி அல்லது மயக்கம் உள்ளதா?',
      kn: '5. Associated Symptoms: ಬೆವರು, ಉಸಿರಾಟದ ತೊಂದರೆ, ವಾಂತಿ ಅಥವಾ ತಲೆತಿರುಗುವಿಕೆ ಇದೆಯೇ?',
      mr: '5. Associated Symptoms: घाम, धाप लागणे, उलट्या किंवा चक्कर येत आहे का?',
      bn: '5. Associated Symptoms: খুব ঘাম, শ্বাসকষ্ট, বমি বা মাথা ঘোরার সমস্যা আছে কি?',
    },
    voicePrompt: {
      en: 'Do you have any accompanying symptoms? Such as profuse cold sweating, shortness of breath, nausea, vomiting, dizziness, or high fever?',
      te: 'నొప్పితో పాటు మరేవైనా లక్షణాలు ఉన్నాయా? విపరీతంగా చల్లని చెమటలు పట్టడం, ఊపిరి ఆడకపోవడం, వాంతులు రావడం, తల తిరగడం లేదా గుండె వేగంగా కొట్టుకోవడం ఉన్నాయా?',
      hi: 'क्या दर्द के साथ पसीना आना, सांस फूलना, उल्टी जैसा लगना, चक्कर आना या घबराहट हो रही है?',
      ta: 'வலியுடன் அதிக வியர்வை, மூச்சுத்திணறல், வாந்தி அல்லது மயக்கம் உள்ளதா?',
      kn: 'ನೋವಿನ ಜೊತೆ ಅತಿಯಾದ ಬೆವರು, ಉಸಿರಾಟದ ತೊಂದರೆ, ವಾಂತಿ ಅಥವಾ ತಲೆಸುತ್ತುವುದು ಇದೆಯೇ?',
      mr: 'वेदनांसोबत खूप घाम येणे, दम लागणे, उलट्या किंवा चक्कर येत आहे का?',
      bn: 'ব্যথার সাথে কি অতিরিক্ত ঘাম, শ্বাসকষ্ট, বমি বমি ভাব বা মাথা ঘোরা আছে?',
    },
    options: [
      {
        id: 'Diaphoresis (Profuse sweating)',
        label: { en: 'Profuse Cold Sweating (చెమటలు)', te: 'విపరీతంగా చల్లని చెమటలు పడుతున్నాయి', hi: 'ठंडा व बहुत पसीना आना', ta: 'அதிக வியர்வை', kn: 'ವಿಪರೀತ ಬೆವರು', mr: 'खूप थंड घाम येणे', bn: 'প্রচণ্ড ঘাম হচ্ছে' },
        clinicalTag: 'Autonomic Diaphoresis',
        keywords: ['sweat', 'sweating', 'చెమట', 'చెమటలు', 'पसीना', 'வியர்வை', 'ಬೆವರು', 'घाम', 'ঘাম'],
      },
      {
        id: 'Dyspnea (Shortness of breath)',
        label: { en: 'Breathlessness / Shortness of Breath (ఆయాసం)', te: 'ఆయాసం / ఊపిరి సరిగ్గా అందడం లేదు', hi: 'सांस फूलना / सांस लेने में तकलीफ़', ta: 'மூச்சுத்திணறல்', kn: 'ಉಸಿರಾಟದ ತೊಂದರೆ', mr: 'श्वास घेण्यास त्रास / दम', bn: 'শ্বাসকষ্ট হচ্ছে' },
        clinicalTag: 'Respiratory Compromise',
        keywords: ['breath', 'breathing', 'ఆయాసం', 'ఊపిరి', 'గాలి', 'सांस', 'दम', 'மூச்சு', 'ಉಸಿರು', 'শ্বাস'],
      },
      {
        id: 'Nausea/Vomiting',
        label: { en: 'Nausea or Vomiting (వాంతులు)', te: 'వాంతులు / కడుపులో వికారం', hi: 'उल्टी या जी मिचलाना', ta: 'வாந்தி / குமட்டல்', kn: 'ವಾಂತಿ / ವಾಕರಿಕೆ', mr: 'उलटी किंवा मळमळ', bn: 'বমি বা গা গোলানো' },
        clinicalTag: 'Gastrointestinal Sympathetic',
        keywords: ['vomit', 'nausea', 'వాంతి', 'వాంతులు', 'వికారం', 'उल्टी', 'मिचलाना', 'வாந்தி', 'ವಾಂತಿ', 'उलटी', 'বমি'],
      },
      {
        id: 'Dizziness / Presyncope',
        label: { en: 'Dizziness / Feeling Faint (తలతిరుగుడు)', te: 'తల తిరుగుతోంది / కళ్ళు బైర్లు కమ్ముతున్నాయి', hi: 'चक्कर आना / बेहोशी जैसा', ta: 'தலைச்சுற்றல் / மயக்கம்', kn: 'ತಲೆಸುತ್ತುವುದು / ತಲೆತಿರುಗುವಿಕೆ', mr: 'चक्कर येणे', bn: 'মাথা ঘোরা / অন্ধকার দেখা' },
        clinicalTag: 'Cerebral Hypoperfusion',
        keywords: ['dizzy', 'faint', 'తలతిరుగుడు', 'కళ్ళు తిరగడం', 'चक्कर', 'மயக்கம்', 'ತಲೆಸುತ್ತು', 'चक्कर', 'মাথা ঘোরা'],
      },
      {
        id: 'Palpitations',
        label: { en: 'Fast Heartbeat / Palpitations (దడ)', te: 'గుండె దడదడలాడటం / వేగంగా కొట్టుకోవడం', hi: 'घबराहट / दिल की तेज़ धड़कन', ta: 'நெஞ்சு படபடப்பு', kn: 'ಎದೆ ಬಡಿತ ವೇಗವಾಗುವುದು', mr: 'छातीत धडधड', bn: 'বুক ধড়ফড় করা' },
        clinicalTag: 'Tachyarrhythmia',
        keywords: ['palpitations', 'heartbeat', 'racing', 'దడ', 'గుండెదడ', 'धड़कन', 'घबराहट', 'படபடப்பு', 'ಬಡಿತ', 'धडधड', 'ধড়ফড়'],
      },
      {
        id: 'High fever (>101°F)',
        label: { en: 'Fever or Chills (జ్వరం)', te: 'తీవ్ర జ్వరం / చలి వణుకు', hi: 'तेज़ बुखार व कंपकंपी', ta: 'காய்ச்சல் / நடுக்கம்', kn: 'ಜ್ವರ ಮತ್ತು ಚಳಿ', mr: 'ताप व थंडी', bn: 'তীব্র জ্বর ও কাঁপুনি' },
        clinicalTag: 'Pyrexia / Sepsis Flag',
        keywords: ['fever', 'chills', 'temperature', 'జ్వరం', 'చలి', 'బుఖార్', 'बुखार', 'காய்ச்சல்', 'ಜ್ವರ', 'ताप', 'জ্বর'],
      },
    ],
  },

  {
    id: 'timeCourse',
    key: 'timeCourse',
    stepNumber: 6,
    totalSteps: 8,
    letter: 'T',
    medicalClinicalRationale: 'Temporal Pattern & Diurnal Fluctuations',
    title: {
      en: '6. Time Course: How does the pain behave over time?',
      te: '6. Time Course: సమయం గడిచేకొద్దీ నొప్పి ఎలా మారుతోంది?',
      hi: '6. Time Course: समय के साथ दर्द कैसा रहता है?',
      ta: '6. Time Course: நேரம் செல்ல செல்ல வலி எவ்வாறு மாறுகிறது?',
      kn: '6. Time Course: ಸಮಯ ಕಳೆದಂತೆ ನೋವು ಹೇಗಾಗುತ್ತಿದೆ?',
      mr: '6. Time Course: वेळ निघून गेल्यावर वेदना कशा बदलतात?',
      bn: '6. Time Course: সময়ের সাথে ব্যথা কেমন আচরণ করছে?',
    },
    voicePrompt: {
      en: 'Is the pain continuous and getting worse, coming and going in waves, fluctuating, or worse at night?',
      te: 'నొప్పి ఆగకుండా పెరుగుతోందా, వచ్చి పోతూ తరంగాలుగా వస్తోందా, మారుతూ ఉందా, లేదా రాత్రి పూట ఎక్కువవుతోందా?',
      hi: 'क्या दर्द लगातार बढ़ रहा है, रुक-रुक कर आ रहा है, या रात में ज्यादा होता है?',
      ta: 'வலி தொடர்ந்து அதிகரிக்கிறதா அல்லது விட்டு விட்டு வருகிறதா?',
      kn: 'ನೋವು ನಿರಂತರವಾಗಿ ಹೆಚ್ಚಾಗುತ್ತಿದೆಯೇ ಅಥವಾ ಬಂದು ಹೋಗುತ್ತಿದೆಯೇ?',
      mr: 'वेदना सतत वाढत आहेत की थांबून थांबून येत आहेत?',
      bn: 'ব্যথা কি একটানা বাড়ছে, নাকি থেমে থেমে তরঙ্গের মতো আসছে?',
    },
    options: [
      {
        id: 'Continuous & worsening',
        label: { en: 'Continuous & Steadily Worsening', te: 'ఆగకుండా నిరంతరం పెరుగుతోంది', hi: 'लगातार और बढ़ता जा रहा है', ta: 'தொடர்ந்து அதிகரித்து வருகிறது', kn: 'ನಿರಂತರವಾಗಿ ಹೆಚ್ಚಾಗುತ್ತಿದೆ', mr: 'सतत आणि वाढत जाणारी', bn: 'একটানা এবং ক্রমশ বাড়ছে' },
        clinicalTag: 'Progressive Crescendo',
        keywords: ['continuous', 'worse', 'worsening', 'ఆగకుండా', 'పెరుగుతోంది', 'నిరంతరం', 'लगातार', 'बढ़', 'தொடர்ந்து', 'ನಿರಂತರ', 'सतत', 'একটানা'],
      },
      {
        id: 'Episodic / Intermittent',
        label: { en: 'Episodic (Comes and goes in waves)', te: 'వచ్చి పోతూ తరంగాలుగా వస్తుంది', hi: 'रुक-रुक कर लहरों की तरह आना', ta: 'விட்டு விட்டு அலை போல் வருவது', kn: 'ಬಂದು ಹೋಗುವ ಅಲೆಯಂತಹ ನೋವು', mr: 'थांबून थांबून लाटांसारखी येणे', bn: 'থেমে থেমে তরঙ্গের মতো আসা' },
        clinicalTag: 'Colicky Spasmodic',
        keywords: ['episodic', 'intermittent', 'waves', 'వచ్చిపోతోంది', 'తరంగాలు', 'रुक', 'விட்டு', 'ಬಂದು', 'लाटा', 'থেমে'],
      },
      {
        id: 'Worse at night',
        label: { en: 'Worse during Sleep or Night hours', te: 'రాత్రి సమయంలో లేదా పడుకున్నప్పుడు ఎక్కువ', hi: 'रात में या सोते समय अधिक', ta: 'இரவில் அல்லது தூங்கும் போது அதிகம்', kn: 'ರಾತ್ರಿ ಅಥವಾ ಮಲಗಿದಾಗ ಹೆಚ್ಚು', mr: 'रात्री किंवा झोपताना जास्त', bn: 'রাতে বা ঘুমের সময় বেশি' },
        clinicalTag: 'Nocturnal Exacerbation',
        keywords: ['night', 'sleep', 'రాత్రి', 'పడుకున్నప్పుడు', 'रात', 'सोते', 'இரவு', 'ರಾತ್ರಿ', 'रात्र', 'রাত'],
      },
      {
        id: 'Fluctuating',
        label: { en: 'Fluctuating (Varies up and down)', te: 'హెచ్చుతగ్గులుగా మారుతూ ఉంది', hi: 'कभी कम तो कभी ज्यादा होना', ta: 'ஏறி இறங்கி மாறுவது', kn: 'ಹೆಚ್ಚು ಕಡಿಮೆಯಾಗುತ್ತಿರುವುದು', mr: 'कमी-जास्त होणे', bn: 'কখনও কম কখনও বেশি' },
        clinicalTag: 'Fluctuating Intensity',
        keywords: ['fluctuating', 'varies', 'మారుతోంది', 'తగ్గుతూ', 'कम ज्यादा', 'மாறுவது', 'ಬದಲಾವಣೆ', 'कमी जास्त', 'কম বেশি'],
      },
    ],
  },

  {
    id: 'exacerbatingFactors',
    key: 'exacerbating',
    stepNumber: 7,
    totalSteps: 8,
    letter: 'E',
    medicalClinicalRationale: 'Exacerbating & Relieving Provocative Modifiers',
    title: {
      en: '7. Exacerbating/Relieving: What makes the pain worse or better?',
      te: '7. Modifiers: ఏమి చేస్తే నొప్పి పెరుగుతోంది లేదా తగ్గుతోంది?',
      hi: '7. Modifiers: क्या करने से दर्द बढ़ता है या आराम मिलता है?',
      ta: '7. Modifiers: எதைச் செய்தால் வலி கூடுகிறது அல்லது குறைகிறது?',
      kn: '7. Modifiers: ಏನಾದರೂ ಮಾಡಿದರೆ ನೋವು ಹೆಚ್ಚುತ್ತಿದೆಯೇ ಅಥವಾ ಕಡಿಮೆಯಾಗುತ್ತಿದೆಯೇ?',
      mr: '7. Modifiers: कशामुळे त्रास वाढतो किंवा कमी होतो?',
      bn: '7. Modifiers: কি করলে ব্যথা বাড়ে বা উপশম হয়?',
    },
    voicePrompt: {
      en: 'What makes it worse or better? For example: does it increase with physical exertion, deep breathing, eating, or does rest and medicine help?',
      te: 'ఏమి చేసినప్పుడు నొప్పి ఎక్కువవుతోంది? నడవడం లేదా శ్రమ చేసినప్పుడా, శ్వాస పీల్చినప్పుడా, అన్నం తిన్నప్పుడా? విశ్రాంతి తీసుకుంటే తగ్గుతోందా?',
      hi: 'किससे दर्द बढ़ता या घटता है? मेहनत करने से, गहरी सांस लेने से, खाना खाने से या आराम करने से फायदा होता है?',
      ta: 'எதனால் வலி அதிகமாகிறது? நடக்கும் போது, மூச்சு விடும் போது, அல்லது ஓய்வு எடுத்தால் குறைகிறதா?',
      kn: 'ಯಾವಾಗ ನೋವು ಹೆಚ್ಚಾಗುತ್ತದೆ? ಕೆಲಸ ಮಾಡುವಾಗ, ಉಸಿರು ತೆಗೆದುಕೊಂಡಾಗ, ಅಥವಾ ವಿಶ್ರಾಂತಿ ಪಡೆದರೆ ಕಡಿಮೆಯಾಗುತ್ತದೆಯೇ?',
      mr: 'कशामुळे वाढते? चालताना, खोल श्वास घेताना, जेवणानंतर की विश्रांतीने आराम मिळतो?',
      bn: 'কিসে ব্যথা বাড়ে বা কমে? পরিশ্রম করলে, গভীর শ্বাস নিলে, খাওয়ার পর নাকি বিশ্রামে আরাম মেলে?',
    },
    options: [
      {
        id: 'Physical exertion',
        label: { en: 'Increases with Walking or Physical Exertion', te: 'నడవడం లేదా శారీరక శ్రమ చేసినప్పుడు పెరుగుతోంది', hi: 'चलने या मेहनत करने से बढ़ता है', ta: 'நடக்கும் போது அல்லது வேலை செய்யும்போது அதிகரிக்கிறது', kn: 'ನಡೆಯುವಾಗ ಅಥವಾ ಕೆಲಸ ಮಾಡುವಾಗ ಹೆಚ್ಚುತ್ತದೆ', mr: 'चालताना किंवा मेहनतीने वाढते', bn: 'হাঁটাহাঁটি বা পরিশ্রমে বাড়ে' },
        clinicalTag: 'Exertional Provocation',
        keywords: ['exertion', 'walking', 'work', 'నడక', 'శ్రమ', 'పని', 'चलने', 'मेहनत', 'வேலை', 'ಕೆಲಸ', 'काम', 'পরিশ্রম'],
      },
      {
        id: 'Deep inspiration',
        label: { en: 'Increases with Deep Breathing or Coughing', te: 'లోతుగా ఊపిరి పీల్చినప్పుడు లేదా దగ్గినప్పుడు', hi: 'गहरी सांस लेने या खांसने पर बढ़ता है', ta: 'ஆழ்ந்த மூச்சு அல்லது இருமலின் போது', kn: 'ಉಸಿರು ಎಳೆದಾಗ ಅಥವಾ ಕೆಮ್ಮಿದಾಗ', mr: 'श्वास घेताना किंवा खोकताना वाढते', bn: 'গভীর শ্বাস নিলে বা কাশলে বাড়ে' },
        clinicalTag: 'Pleuritic Provocation',
        keywords: ['inspiration', 'cough', 'breathing', 'శ్వాస', 'దగ్గు', 'పీల్చినప్పుడు', 'सांस', 'खांसी', 'இருமல்', 'ಕೆಮ್ಮು', 'खोकला', 'কাশি'],
      },
      {
        id: 'Rest',
        label: { en: 'Relieved by Complete Rest & Sitting Still', te: 'కదలకుండా విశ్రాంతి తీసుకుంటే తగ్గుతోంది', hi: 'पूरी तरह आराम करने व बैठने से घटता है', ta: 'ஓய்வு எடுக்கும் போது குறைகிறது', kn: 'ವಿಶ್ರಾಂತಿ ಪಡೆದರೆ ಕಡಿಮೆಯಾಗುತ್ತದೆ', mr: 'विश्रांतीने व बसल्याने आराम मिळतो', bn: 'সম্পূর্ণ বিশ্রামে থাকলে কমে' },
        clinicalTag: 'Rest Alleviation',
        keywords: ['rest', 'sitting', 'విశ్రాంతి', 'కూర్చుంటే', 'తగ్గుతోంది', 'आराम', 'बैठने', 'ஓய்வு', 'ವಿಶ್ರಾಂತಿ', 'विश्रांती', 'বিশ্রাম'],
      },
      {
        id: 'Food intake',
        label: { en: 'Triggered or Worsened after Meals/Food', te: 'ఆహారం లేదా అన్నం తిన్న తర్వాత ఎక్కువవుతుంది', hi: 'खाना खाने के बाद बढ़ता है', ta: 'சாப்பிட்ட பிறகு அதிகரிக்கிறது', kn: 'ಊಟದ ನಂತರ ಹೆಚ್ಚಾಗುತ್ತದೆ', mr: 'जेवणानंतर वाढते', bn: 'খাওয়ার পর বৃদ্ধি পায়' },
        clinicalTag: 'Postprandial Provocation',
        keywords: ['food', 'eating', 'meals', 'తిన్న', 'అన్నం', 'ఆహారం', 'खाना', 'भोजन', 'சாப்பாடு', 'ಊಟ', 'जेवण', 'খাবার'],
      },
    ],
  },

  {
    id: 'severityScore',
    key: 'severity',
    stepNumber: 8,
    totalSteps: 8,
    letter: 'S',
    medicalClinicalRationale: 'Quantitative Visual Analog Severity Scale (1 - 10)',
    title: {
      en: '8. Severity: On a scale of 1 to 10, how severe is the pain?',
      te: '8. Severity: 1 నుండి 10 స్కేలులో మీ నొప్పి తీవ్రత ఎంత?',
      hi: '8. Severity: 1 से 10 के पैमाने पर आपका दर्द कितना गंभीर है?',
      ta: '8. Severity: 1 முதல் 10 வரை உங்கள் வலியின் அளவு என்ன?',
      kn: '8. Severity: 1 ರಿಂದ 10 ರ ಅಳತೆಯಲ್ಲಿ ನಿಮ್ಮ ನೋವಿನ ತೀವ್ರತೆ ಎಷ್ಟು?',
      mr: '8. Severity: 1 ते 10 च्या स्केलवर वेदना किती तीव्र आहेत?',
      bn: '8. Severity: 1 থেকে 10 এর স্কেলে আপনার ব্যথার তীব্রতা কত?',
    },
    voicePrompt: {
      en: 'Please tell me the severity of your pain on a scale of 1 to 10. For example: 3 is mild, 6 is moderate, and 9 or 10 is unbearable severe pain.',
      te: 'దయచేసి 1 నుండి 10 వరకు మీ నొప్పి తీవ్రతను చెప్పండి. ఉదాహరణకు: 3 అంటే స్వల్పంగా, 6 అంటే మోస్తరుగా, 9 లేదా 10 అంటే భరించలేని తీవ్రమైన నొప్పి.',
      hi: 'कृपया 1 से 10 के पैमाने पर दर्द बताएं। 3 यानी हल्का, 6 यानी मध्यम, और 9 या 10 यानी असहनीय तेज़ दर्द।',
      ta: '1 முதல் 10 வரை கூறுங்கள். 3 என்பது குறைவு, 6 என்பது நடுத்தரம், 9 அல்லது 10 தாங்க முடியாத வலி.',
      kn: 'ದಯವಿಟ್ಟು 1 ರಿಂದ 10 ರಲ್ಲಿ ನೋವಿನ ತೀವ್ರತೆ ತಿಳಿಸಿ. 3 ಕಡಿಮೆ, 6 ಮಧ್ಯಮ, 9-10 ಅಸಹನೀಯ ತೀವ್ರ ನೋವು.',
      mr: 'कृपया 1 ते 10 च्या स्केलवर सांगा. 3 म्हणजे सौम्य, 6 मध्यम आणि 9 किंवा 10 म्हणजे तीव्र असह्य वेदना.',
      bn: '1 থেকে 10 এর স্কেলে বলুন। 3 মানে মৃদু, 6 মানে মাঝারি, আর 9 বা 10 মানে অসহ্য তীব্র ব্যথা।',
    },
    options: [
      {
        id: '2',
        label: { en: 'Mild Discomfort (Score 1-3)', te: 'స్వల్ప నొప్పి (స్కోర్ 1-3)', hi: 'हल्का दर्द (स्कोर 1-3)', ta: 'லேசான வலி (1-3)', kn: 'ಸ್ವಲ್ಪ ನೋವು (1-3)', mr: 'सौम्य त्रास (1-3)', bn: 'মৃদু ব্যথা (1-3)' },
        clinicalTag: 'Mild (1-3/10)',
        keywords: ['mild', 'one', 'two', 'three', '1', '2', '3', 'స్వల్పం', 'కొద్దిగా', 'ఒకటి', 'రెండు', 'మూడు', 'हल्का', 'एक', 'दो', 'तीन'],
      },
      {
        id: '5',
        label: { en: 'Moderate Pain (Score 4-6)', te: 'మోస్తరు నొప్పి (స్కోర్ 4-6)', hi: 'मध्यम दर्द (स्कोर 4-6)', ta: 'நடுத்தர வலி (4-6)', kn: 'ಮಧ್ಯಮ ನೋವು (4-6)', mr: 'मध्यम वेदना (4-6)', bn: 'মাঝারি ব্যথা (4-6)' },
        clinicalTag: 'Moderate (4-6/10)',
        keywords: ['moderate', 'four', 'five', 'six', '4', '5', '6', 'మోస్తరు', 'నాలుగు', 'ఐదు', 'ఆరు', 'मध्यम', 'चार', 'पाँच', 'छह'],
      },
      {
        id: '9',
        label: { en: 'Severe Unbearable Pain (Score 7-10) 🚨', te: 'భరించలేని తీవ్ర నొప్పి (స్కోర్ 7-10) 🚨', hi: 'असहनीय तेज़ दर्द (स्कोर 7-10) 🚨', ta: 'தாங்க முடியாத கடுமையான வலி (7-10) 🚨', kn: 'ತೀವ್ರ ಅಸಹನೀಯ ನೋವು (7-10) 🚨', mr: 'असह्य तीव्र वेदना (7-10) 🚨', bn: 'অসহ্য তীব্র ব্যথা (7-10) 🚨' },
        clinicalTag: 'High Acuity Severe (7-10/10)',
        keywords: ['severe', 'worst', 'unbearable', 'seven', 'eight', 'nine', 'ten', '7', '8', '9', '10', 'తీవ్రం', 'భరించలేని', 'ఏడు', 'ఎనిమిది', 'తొమ్మిది', 'పది', 'तेज़', 'असहनीय', 'सात', 'आठ', 'नौ', 'दस'],
      },
    ],
  },
];
