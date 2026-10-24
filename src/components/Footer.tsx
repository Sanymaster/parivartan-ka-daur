import React from 'react';
import { Lock, BookOpen, MapPin, Phone, Mail } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { ActiveRoute, CATEGORIES } from '../types/newspaper';

interface FooterProps {
  onNavigate: (route: ActiveRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-stone-950 text-stone-300 border-t-4 border-[#991B1B] mt-16">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-stone-800">
          {/* Col 1: Publication Identity & Masthead Imprint (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-bold uppercase tracking-widest text-amber-400">
              {siteConfig.subtitle} · RNI: {siteConfig.prgiRegistrationNumber}
            </div>
            <h2 className="font-masthead text-3xl sm:text-4xl font-bold text-white">
              {siteConfig.newspaperName} ({siteConfig.newspaperNameEn})
            </h2>
            <p className="text-xs text-amber-300/90 italic">
              “{siteConfig.tagline}”
            </p>
            <div className="text-xs text-stone-400 space-y-1 pt-2">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>
                  <strong>मुख्य कार्यालय:</strong> {siteConfig.headOfficeAddress}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-400 shrink-0" />
                <span>
                  <strong>फोन:</strong> {siteConfig.contactPhone}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-400 shrink-0" />
                <span>
                  <strong>ईमेल:</strong> {siteConfig.contactEmail}
                </span>
              </p>
            </div>
          </div>

          {/* Col 2: Newspaper Sections (3 cols) */}
          <div className="lg:col-span-3 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-stone-800 pb-2">
              समाचार विभाग (News Sections)
            </h3>
            <ul className="space-y-1.5 text-xs">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() =>
                      onNavigate({ view: 'home', category: cat.id })
                    }
                    className="text-stone-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {cat.labelHi} ({cat.labelEn})
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'epaper' })}
                  className="inline-flex items-center gap-1.5 text-amber-400 font-semibold hover:underline cursor-pointer pt-1"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>दैनिक ई-पेपर पोर्टल (/epaper)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Mandatory Google News Trust & Compliance Pages (4 cols) */}
          <div className="lg:col-span-4 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-stone-800 pb-2">
              Google News Trust & Statutory Compliance
            </h3>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'trust', page: 'about' })}
                  className="text-stone-400 hover:text-white transition-colors cursor-pointer"
                >
                  1. हमारे बारे में एवं मास्टहेड (About Us & Masthead)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    onNavigate({ view: 'trust', page: 'editorial-policy' })
                  }
                  className="text-stone-400 hover:text-white transition-colors cursor-pointer"
                >
                  2. संपादकीय एवं तथ्य-जांच नीति (Editorial & Fact-Checking Policy)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    onNavigate({ view: 'trust', page: 'corrections-policy' })
                  }
                  className="text-stone-400 hover:text-white transition-colors cursor-pointer"
                >
                  3. सुधार एवं संशोधन नीति (Corrections Policy)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    onNavigate({ view: 'trust', page: 'privacy-terms' })
                  }
                  className="text-stone-400 hover:text-white transition-colors cursor-pointer"
                >
                  4. गोपनीयता नीति एवं उपयोग की शर्तें (Privacy Policy & Terms)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    onNavigate({ view: 'trust', page: 'contact-grievance' })
                  }
                  className="text-stone-400 hover:text-white transition-colors cursor-pointer"
                >
                  5. संपर्क करें एवं शिकायत निवारण (Contact & Grievance Redressal)
                </button>
              </li>
              <li className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'admin' })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-stone-900 border border-stone-700 text-stone-200 hover:bg-stone-800 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Login (संपादकीय सीएमएस डैशबोर्ड)</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Statutory Imprint Line */}
        <div className="pt-6 text-xs text-stone-400 space-y-2">
          <p className="leading-relaxed">
            <strong>वैधानिक घोषणा (PRGI/RNI Imprint):</strong> परिवर्तन का दौर के लिए
            स्वामी, मुद्रक एवं प्रकाशक <strong>{siteConfig.ownerPublisherPrinter}</strong>{' '}
            द्वारा {siteConfig.printingPressAddress} से छपवाकर कार्यालय{' '}
            <strong>{siteConfig.headOfficeAddress}</strong> से वितरित किया।{' '}
            <strong>सम्पादक: {siteConfig.editorInChief}</strong> | कानूनी सलाहकार:{' '}
            {siteConfig.legalAdvisors.join(', ')}।
          </p>
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-500 pt-2 border-t border-stone-900">
            <span>
              © {new Date().getFullYear()} {siteConfig.newspaperName} (
              {siteConfig.newspaperNameEn}) · PRGI/RNI: {siteConfig.prgiRegistrationNumber}।
              सर्वाधिकार सुरक्षित।
            </span>
            <span>{siteConfig.jurisdictionNotice}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
