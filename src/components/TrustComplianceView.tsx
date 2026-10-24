import React, { useState } from 'react';
import {
  ShieldCheck,
  FileCheck2,
  AlertTriangle,
  Lock,
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import { ActiveRoute, GrievanceSubmission } from '../types/newspaper';
import { siteConfig } from '../config/siteConfig';
import { newspaperDataService } from '../services/firebaseConfig';

interface TrustComplianceViewProps {
  page:
    | 'about'
    | 'editorial-policy'
    | 'corrections-policy'
    | 'privacy-terms'
    | 'contact-grievance';
  onNavigate: (route: ActiveRoute) => void;
}

export const TrustComplianceView: React.FC<TrustComplianceViewProps> = ({
  page,
  onNavigate,
}) => {
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [city, setCity] = useState('मुरादाबाद');
  const [submissionType, setSubmissionType] =
    useState<GrievanceSubmission['submissionType']>('news-tip');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [articleRef, setArticleRef] = useState('');
  const [submittedRecord, setSubmittedRecord] =
    useState<GrievanceSubmission | null>(null);
  const [formError, setFormError] = useState('');

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !emailOrPhone.trim() || !subject.trim() || !message.trim()) {
      setFormError('कृपया सभी अनिवार्य फ़ील्ड (नाम, संपर्क, विषय और संदेश) भरें।');
      return;
    }
    setFormError('');
    const saved = await newspaperDataService.submitGrievance({
      name: name.trim(),
      emailOrPhone: emailOrPhone.trim(),
      city: city.trim() || 'मुरादाबाद',
      submissionType,
      subject: subject.trim(),
      message: message.trim(),
      articleRef: articleRef.trim() || undefined,
    });
    setSubmittedRecord(saved);
    setName('');
    setEmailOrPhone('');
    setSubject('');
    setMessage('');
    setArticleRef('');
  };

  const navItems: {
    id: TrustComplianceViewProps['page'];
    labelHi: string;
    labelEn: string;
  }[] = [
    { id: 'about', labelHi: '1. हमारे बारे में एवं मास्टहेड', labelEn: 'About Us & Masthead' },
    {
      id: 'editorial-policy',
      labelHi: '2. संपादकीय एवं तथ्य-जांच नीति',
      labelEn: 'Editorial & Fact-Checking Policy',
    },
    {
      id: 'corrections-policy',
      labelHi: '3. सुधार एवं संशोधन नीति',
      labelEn: 'Corrections Policy',
    },
    {
      id: 'privacy-terms',
      labelHi: '4. गोपनीयता नीति एवं शर्तें',
      labelEn: 'Privacy Policy & Terms',
    },
    {
      id: 'contact-grievance',
      labelHi: '5. संपर्क एवं शिकायत निवारण',
      labelEn: 'Contact Us & Grievance Redressal',
    },
  ];

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-8">
      {/* Sub-navigation for the 5 Mandatory Google News Trust & Compliance Pages */}
      <div className="mb-8 pb-4 border-b-2 border-stone-900 dark:border-stone-700">
        <div className="text-xs font-bold uppercase tracking-widest text-[#991B1B] dark:text-red-400">
          Google News Trust, Transparency & PRGI Statutory Compliance
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-950 dark:text-stone-100 mt-1">
          वैधानिक पारदर्शिता एवं संपादकीय अनुपालन केंद्र
        </h1>

        <div className="flex flex-wrap items-center gap-2 mt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate({ view: 'trust', page: item.id })}
              className={`px-3.5 py-2 text-xs font-bold rounded transition-colors cursor-pointer ${
                page === item.id
                  ? 'bg-[#991B1B] text-white'
                  : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 hover:bg-stone-100'
              }`}
            >
              {item.labelHi} ({item.labelEn})
            </button>
          ))}
        </div>
      </div>

      {/* PAGE 1: ABOUT US & MASTHEAD */}
      {page === 'about' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 p-6 sm:p-8">
            <div className="flex items-center gap-2 text-[#991B1B] dark:text-red-400 text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              <span>About Us & Statutory Masthead</span>
            </div>
            <h2 className="text-2xl font-bold text-stone-950 dark:text-stone-100">
              हमारे बारे में एवं आधिकारिक मास्टहेड — {siteConfig.newspaperName}
            </h2>
            <p className="text-base text-stone-800 dark:text-stone-200 leading-relaxed">
              <strong>‘{siteConfig.newspaperName}’ ({siteConfig.newspaperNameEn})</strong>{' '}
              उत्तर प्रदेश के मुरादाबाद से प्रकाशित एक प्रतिष्ठित राष्ट्रीय हिंदी दैनिक समाचार
              पत्र है। हमारा ध्येय वाक्य{' '}
              <em>“{siteConfig.tagline}”</em> हमारी निर्भीक, निष्पक्ष और जन-सरोकारों
              के प्रति समर्पित पत्रकारिता का प्रतीक है।
            </p>
            <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
              हमारा समाचार पत्र मुरादाबाद महानगर, रामपुर, अमरोहा, संभल, बिजनौर, बरेली,
              शामली, कैराना, बागपत, लखनऊ, देहरादून और नई दिल्ली सहित संपूर्ण उत्तर प्रदेश
              एवं उत्तराखंड के जनहित से जुड़े मुद्दों, प्रशासनिक पारदर्शिता, आरटीआई खुलासों
              और राष्ट्र निर्माण की खबरों को प्रमुखता से प्रकाशित करता है।
            </p>

            <div className="border-t border-stone-200 dark:border-stone-800 pt-6">
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-4">
                वैधानिक मास्टहेड एवं पंजीकरण विवरण (PRGI / RNI Imprint Details)
              </h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-3.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
                  <dt className="text-xs text-stone-500">समाचार पत्र का नाम (Publication Name)</dt>
                  <dd className="font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                    {siteConfig.subtitle} ‘{siteConfig.newspaperName}’
                  </dd>
                </div>
                <div className="p-3.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
                  <dt className="text-xs text-stone-500">PRGI / RNI पंजीकरण संख्या</dt>
                  <dd className="font-mono font-bold text-[#991B1B] dark:text-red-400 mt-0.5">
                    {siteConfig.prgiRegistrationNumber}
                  </dd>
                </div>
                <div className="p-3.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
                  <dt className="text-xs text-stone-500">मुख्य संपादक (Editor-in-Chief)</dt>
                  <dd className="font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                    {siteConfig.editorInChief} ({siteConfig.editorInChiefEn})
                  </dd>
                </div>
                <div className="p-3.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
                  <dt className="text-xs text-stone-500">स्वामी, मुद्रक एवं प्रकाशक</dt>
                  <dd className="font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                    {siteConfig.ownerPublisherPrinter}
                  </dd>
                </div>
                <div className="p-3.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 sm:col-span-2">
                  <dt className="text-xs text-stone-500">मुख्य कार्यालय का पता (Head Office Address)</dt>
                  <dd className="font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                    {siteConfig.headOfficeAddress}
                  </dd>
                </div>
                <div className="p-3.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 sm:col-span-2">
                  <dt className="text-xs text-stone-500">मुद्रण स्थल (Printing Press)</dt>
                  <dd className="text-stone-800 dark:text-stone-200 mt-0.5">
                    {siteConfig.printingPressAddress}
                  </dd>
                </div>
                <div className="p-3.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
                  <dt className="text-xs text-stone-500">कानूनी सलाहकार (Legal Counsel)</dt>
                  <dd className="font-semibold text-stone-900 dark:text-stone-100 mt-0.5">
                    {siteConfig.legalAdvisors.join(', ')}
                  </dd>
                </div>
                <div className="p-3.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
                  <dt className="text-xs text-stone-500">आधिकारिक संपर्क (Phone & Email)</dt>
                  <dd className="font-mono text-stone-900 dark:text-stone-100 mt-0.5">
                    {siteConfig.contactPhone} | {siteConfig.contactEmail}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="border border-stone-300 dark:border-stone-800 bg-[#F4EFE6] dark:bg-stone-900 p-5 text-xs space-y-3">
              <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                वैधानिक घोषणा (Statutory Declaration)
              </h3>
              <p className="leading-relaxed text-stone-700 dark:text-stone-300">
                प्रेस एवं पत्रिका पंजीकरण अधिनियम (PRGI/RNI) के तहत पंजीकृत संख्या{' '}
                <strong>{siteConfig.prgiRegistrationNumber}</strong>। परिवर्तन का दौर के
                लिए स्वामी, मुद्रक एवं प्रकाशक <strong>{siteConfig.ownerPublisherPrinter}</strong>{' '}
                द्वारा {siteConfig.printingPressAddress} से छपवाकर कार्यालय{' '}
                <strong>{siteConfig.headOfficeAddress}</strong> से वितरित किया जाता है।
              </p>
              <p className="font-semibold text-stone-900 dark:text-stone-100">
                {siteConfig.jurisdictionNotice}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 2: EDITORIAL & FACT-CHECKING POLICY */}
      {page === 'editorial-policy' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 p-6 sm:p-8 max-w-4xl space-y-5">
          <div className="flex items-center gap-2 text-[#991B1B] dark:text-red-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Editorial & Fact-Checking Policy</span>
          </div>
          <h2 className="text-2xl font-bold text-stone-950 dark:text-stone-100">
            संपादकीय एवं तथ्य-जांच नीति (Editorial Integrity & Verification Guidelines)
          </h2>
          <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed">
            ‘{siteConfig.newspaperName}’ (RNI: {siteConfig.prgiRegistrationNumber}) में
            हम भारतीय प्रेस परिषद (Press Council of India) के पत्रकारिता आचरण के मानकों
            और Google News के पारदर्शिता सिद्धांतों का कड़ाई से पालन करते हैं।
          </p>
          <div className="space-y-4 text-sm text-stone-700 dark:text-stone-300">
            <div>
              <h3 className="font-bold text-stone-950 dark:text-stone-100 text-base">
                1. बहु-स्तरीय तथ्य सत्यापन (Multi-Source & RTI Document Verification)
              </h3>
              <p className="mt-1 leading-relaxed">
                किसी भी खोजी रिपोर्ट या प्रशासनिक समाचार के प्रकाशन से पूर्व हमारे संवाददाता
                आधिकारिक दस्तावेजों, सूचना का अधिकार (RTI) से प्राप्त सत्यापित प्रतियों,
                प्रत्यक्षदर्शियों और संबंधित विभाग के आधिकारिक पक्ष की जांच करते हैं।
              </p>
            </div>
            <div>
              <h3 className="font-bold text-stone-950 dark:text-stone-100 text-base">
                2. निष्पक्षता और संबंधित पक्ष का उत्तर (Right of Reply)
              </h3>
              <p className="mt-1 leading-relaxed">
                जिन व्यक्तियों या संस्थाओं से संबंधित आलोचनात्मक या जांचपरक खबरें प्रकाशित
                की जाती हैं, उनसे प्रकाशन पूर्व संपर्क कर उनका पक्ष जानने का पूर्ण प्रयास किया
                जाता है और प्राप्त स्पष्टीकरण को यथोचित प्रमुखता दी जाती है।
              </p>
            </div>
            <div>
              <h3 className="font-bold text-stone-950 dark:text-stone-100 text-base">
                3. समाचार और विज्ञापन में स्पष्ट अंतर (Separation of News & Sponsored Content)
              </h3>
              <p className="mt-1 leading-relaxed">
                समाचार और संपादकीय लेख किसी भी व्यावसायिक हित से पूर्णतः स्वतंत्र होते हैं।
                विज्ञापनों की सत्यता की जांच उपभोक्ता स्वयं कर लें; समाचार सामग्री और
                विज्ञापन के बीच स्पष्ट अंतर रखा जाता है।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 3: CORRECTIONS POLICY */}
      {page === 'corrections-policy' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 p-6 sm:p-8 max-w-4xl space-y-5">
          <div className="flex items-center gap-2 text-[#991B1B] dark:text-red-400 text-xs font-bold uppercase tracking-wider">
            <FileCheck2 className="w-4 h-4" />
            <span>Corrections & Updates Policy</span>
          </div>
          <h2 className="text-2xl font-bold text-stone-950 dark:text-stone-100">
            सुधार एवं संशोधन नीति (Corrections Policy)
          </h2>
          <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed">
            ‘{siteConfig.newspaperName}’ सटीक और प्रामाणिक समाचार देने के लिए प्रतिबद्ध
            है। यदि किसी प्रकाशित समाचार में कोई तथ्यात्मक त्रुटि, नाम, तिथि या आंकड़े की
            अशुद्धि संज्ञान में आती है, तो हम उसे पारदर्शिता के साथ तुरंत सुधारते हैं।
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-stone-700 dark:text-stone-300">
            <li>
              <strong>पाठक त्रुटि की सूचना कैसे दें:</strong> पाठक किसी भी समाचार के
              शीर्षक, यूआरएल और प्रामाणिक दस्तावेज के साथ हमें{' '}
              <code className="font-mono">{siteConfig.contactEmail}</code> या फोन{' '}
              <code className="font-mono">{siteConfig.contactPhone}</code> पर अथवा हमारे
              ऑनलाइन शिकायत निवारण फॉर्म के माध्यम से सूचित कर सकते हैं।
            </li>
            <li>
              <strong>संपादकीय समीक्षा समय-सीमा:</strong> प्राप्त सुधार अनुरोध की जांच
              संपादक ({siteConfig.editorInChief}) की देखरेख में 24 घंटे के भीतर की जाती है।
            </li>
            <li>
              <strong>पारदर्शी संशोधन नोट:</strong> डिजिटल लेख में सुधार किए जाने पर
              ‘अंतिम अपडेट (Last Updated IST)’ का समय अद्यतन किया जाता है और आवश्यकतानुसार
              लेख के अंत में स्पष्ट ‘संपादकीय संशोधन नोट’ जोड़ा जाता है।
            </li>
          </ul>
          <div className="pt-3">
            <button
              type="button"
              onClick={() =>
                onNavigate({ view: 'trust', page: 'contact-grievance' })
              }
              className="px-4 py-2 bg-[#991B1B] text-white text-xs font-bold rounded cursor-pointer"
            >
              त्रुटि या सुधार फॉर्म भरें (Report a Correction) →
            </button>
          </div>
        </div>
      )}

      {/* PAGE 4: PRIVACY POLICY & TERMS OF USE */}
      {page === 'privacy-terms' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 p-6 sm:p-8 max-w-4xl space-y-5">
          <div className="flex items-center gap-2 text-[#991B1B] dark:text-red-400 text-xs font-bold uppercase tracking-wider">
            <Lock className="w-4 h-4" />
            <span>Privacy Policy & Terms of Use</span>
          </div>
          <h2 className="text-2xl font-bold text-stone-950 dark:text-stone-100">
            गोपनीयता नीति एवं उपयोग की शर्तें (Privacy Policy & Legal Terms)
          </h2>
          <div className="space-y-4 text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
            <p>
              <strong>1. पाठक डेटा गोपनीयता:</strong> जब आप हमारे पोर्टल पर समाचार पढ़ते
              हैं या ई-पेपर डाउनलोड करते हैं, तो हम आपकी किसी भी निजी जानकारी को तृतीय पक्ष
              को नहीं बेचते। न्यूज़-टिप या शिकायत फॉर्म में दर्ज जानकारी केवल संपादकीय
              संपर्क हेतु सुरक्षित रखी जाती है।
            </p>
            <p>
              <strong>2. कॉपीराइट एवं बौद्धिक संपदा:</strong> इस पोर्टल एवं ई-पेपर में
              प्रकाशित समस्त समाचार, संपादकीय लेख और फोटोग्राफ ‘{siteConfig.newspaperName}’
              (RNI: {siteConfig.prgiRegistrationNumber}) की संपत्ति हैं।
            </p>
            <p>
              <strong>3. न्यायिक क्षेत्राधिकार (Legal Jurisdiction):</strong>{' '}
              {siteConfig.jurisdictionNotice} पत्र में प्रकाशित विज्ञापन की सत्यता की
              जांच उपभोक्ता स्वयं कर लें।
            </p>
          </div>
        </div>
      )}

      {/* PAGE 5: CONTACT US & GRIEVANCE REDRESSAL + READER NEWS-TIP FORM */}
      {page === 'contact-grievance' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 p-6">
            <h2 className="text-xl font-bold text-stone-950 dark:text-stone-100">
              आधिकारिक संपर्क एवं शिकायत निवारण (Contact & Grievance Redressal)
            </h2>
            <div className="space-y-4 text-sm text-stone-700 dark:text-stone-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#991B1B] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-900 dark:text-stone-100">
                    मुख्य कार्यालय (Head Office):
                  </strong>
                  <span>{siteConfig.headOfficeAddress}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#991B1B] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-900 dark:text-stone-100">
                    संपादकीय एवं कार्यालय फोन:
                  </strong>
                  <span className="font-mono">{siteConfig.contactPhone}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#991B1B] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-900 dark:text-stone-100">
                    आधिकारिक ईमेल (Official Email):
                  </strong>
                  <span className="font-mono">{siteConfig.contactEmail}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#F4EFE6] dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-xs space-y-1.5">
              <div className="font-bold text-stone-900 dark:text-stone-100">
                शिकायत निवारण अधिकारी (Grievance Officer):
              </div>
              <div>नाम: {siteConfig.editorInChief} (मुख्य संपादक)</div>
              <div>PRGI / RNI रजि. नं.: {siteConfig.prgiRegistrationNumber}</div>
              <div>पता: {siteConfig.headOfficeAddress}</div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 p-6">
            <h2 className="text-xl font-bold text-stone-950 dark:text-stone-100 mb-1">
              पाठक प्रतिक्रिया, न्यूज़-टिप एवं सुधार अनुरोध फॉर्म
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-400 mb-5">
              अपने क्षेत्र की समस्या, आरटीआई दस्तावेज, खबर या किसी प्रकाशित समाचार में
              सुधार के लिए सीधे संपादकीय डेस्क को लिखें।
            </p>

            {submittedRecord && (
              <div className="mb-5 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>आपका संदेश संपादकीय डेस्क को प्राप्त हो गया है!</span>
                </div>
                <div>
                  ट्रैकिंग संदर्भ संख्या (Reference ID):{' '}
                  <strong className="font-mono">{submittedRecord.id}</strong>
                </div>
                <div>विषय: {submittedRecord.subject}</div>
              </div>
            )}

            {formError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-300 text-xs text-red-800 dark:text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label
                    htmlFor="grv-name"
                    className="block font-bold text-stone-800 dark:text-stone-200 mb-1"
                  >
                    आपका नाम (Your Name) *
                  </label>
                  <input
                    id="grv-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="पूरा नाम"
                    className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 rounded bg-white dark:bg-stone-950"
                  />
                </div>

                <div>
                  <label
                    htmlFor="grv-contact"
                    className="block font-bold text-stone-800 dark:text-stone-200 mb-1"
                  >
                    मोबाइल नंबर या ईमेल *
                  </label>
                  <input
                    id="grv-contact"
                    type="text"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="+91 98XXXXXXXX"
                    className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 rounded bg-white dark:bg-stone-950"
                  />
                </div>

                <div>
                  <label
                    htmlFor="grv-city"
                    className="block font-bold text-stone-800 dark:text-stone-200 mb-1"
                  >
                    शहर (City)
                  </label>
                  <input
                    id="grv-city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 rounded bg-white dark:bg-stone-950"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="grv-type"
                    className="block font-bold text-stone-800 dark:text-stone-200 mb-1"
                  >
                    संदेश का प्रकार (Submission Type)
                  </label>
                  <select
                    id="grv-type"
                    value={submissionType}
                    onChange={(e) =>
                      setSubmissionType(
                        e.target.value as GrievanceSubmission['submissionType']
                      )
                    }
                    className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 rounded bg-white dark:bg-stone-950"
                  >
                    <option value="news-tip">समाचार सूचना / न्यूज़ टिप (News Tip)</option>
                    <option value="correction-request">
                      समाचार सुधार अनुरोध (Correction Request)
                    </option>
                    <option value="grievance">
                      शिकायत निवारण (Formal Grievance)
                    </option>
                    <option value="editorial-feedback">
                      संपादक के नाम पत्र (Letter to Editor)
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="grv-ref"
                    className="block font-bold text-stone-800 dark:text-stone-200 mb-1"
                  >
                    संबंधित खबर का शीर्षक / पृष्ठ (वैकल्पिक)
                  </label>
                  <input
                    id="grv-ref"
                    type="text"
                    value={articleRef}
                    onChange={(e) => setArticleRef(e.target.value)}
                    placeholder="पृष्ठ संख्या या लेख का संदर्भ"
                    className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 rounded bg-white dark:bg-stone-950"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="grv-subject"
                  className="block font-bold text-stone-800 dark:text-stone-200 mb-1"
                >
                  विषय (Subject) *
                </label>
                <input
                  id="grv-subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="संक्षिप्त विषय लिखें..."
                  className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 rounded bg-white dark:bg-stone-950"
                />
              </div>

              <div>
                <label
                  htmlFor="grv-message"
                  className="block font-bold text-stone-800 dark:text-stone-200 mb-1"
                >
                  विस्तृत विवरण (Detailed Message) *
                </label>
                <textarea
                  id="grv-message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="पूरी जानकारी यहाँ दर्ज करें..."
                  className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 rounded bg-white dark:bg-stone-950"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#991B1B] hover:bg-red-800 text-white text-xs sm:text-sm font-bold rounded transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>संपादकीय डेस्क को भेजें (Submit)</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
