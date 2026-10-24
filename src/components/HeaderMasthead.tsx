import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Moon,
  Sun,
  Search,
  X,
  MapPin,
  Clock,
  FileText,
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import {
  ActiveRoute,
  Article,
  CATEGORIES,
  CategoryId,
} from '../types/newspaper';

interface HeaderMastheadProps {
  route: ActiveRoute;
  onNavigate: (newRoute: ActiveRoute) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  fontSizeScale: 'sm' | 'base' | 'lg';
  onFontSizeChange: (scale: 'sm' | 'base' | 'lg') => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  breakingArticles: Article[];
}

export const HeaderMasthead: React.FC<HeaderMastheadProps> = ({
  route,
  onNavigate,
  searchQuery,
  onSearchChange,
  fontSizeScale,
  onFontSizeChange,
  darkMode,
  onToggleDarkMode,
  breakingArticles,
}) => {
  const [istTimeStr, setIstTimeStr] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const datePart = new Intl.DateTimeFormat('hi-IN', {
        timeZone: 'Asia/Kolkata',
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(now);
      const timePart = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(now);
      setIstTimeStr(`${datePart} · ${timePart.toUpperCase()} IST`);
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeCategory: CategoryId | 'epaper' | null =
    route.view === 'home'
      ? route.category
      : route.view === 'epaper'
      ? 'epaper'
      : null;

  return (
    <header className="border-b border-stone-300 dark:border-stone-800 bg-[#FBF9F5] dark:bg-stone-950 transition-colors">
      {/* 1. TOP UTILITY BAR */}
      <div className="bg-stone-900 text-stone-200 text-xs border-b border-stone-800">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3">
          {/* Left: Live IST Date/Time & Edition Info */}
          <div className="flex flex-wrap items-center gap-3 text-stone-300">
            <span className="inline-flex items-center gap-1.5 tabular-nums font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{istTimeStr || 'शनिवार, 24 अक्टूबर 2026 · IST'}</span>
            </span>
            <span aria-hidden="true" className="text-stone-600 hidden sm:inline">
              |
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-stone-300">
              <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span>{siteConfig.editionName}</span>
              <span aria-hidden="true">·</span>
              <span>रजि. नं. {siteConfig.prgiRegistrationNumber}</span>
            </span>
          </div>

          {/* Right: Accessibility Font Controls (A-, A, A+), Dark Mode Toggle & Red Read E-Paper CTA */}
          <div className="flex items-center gap-3 ml-auto">
            <div
              className="flex items-center border border-stone-700 rounded overflow-hidden"
              role="group"
              aria-label="फ़ॉन्ट आकार नियंत्रण (Font Size Controls)"
            >
              <button
                type="button"
                onClick={() => onFontSizeChange('sm')}
                aria-label="छोटा फ़ॉन्ट (Decrease font size A-)"
                className={`px-2 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                  fontSizeScale === 'sm'
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : 'text-stone-300 hover:bg-stone-800'
                }`}
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => onFontSizeChange('base')}
                aria-label="सामान्य फ़ॉन्ट (Default font size A)"
                className={`px-2 py-1 text-xs font-medium border-x border-stone-700 transition-colors whitespace-nowrap ${
                  fontSizeScale === 'base'
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : 'text-stone-300 hover:bg-stone-800'
                }`}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => onFontSizeChange('lg')}
                aria-label="बड़ा फ़ॉन्ट (Increase font size A+)"
                className={`px-2 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                  fontSizeScale === 'lg'
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : 'text-stone-300 hover:bg-stone-800'
                }`}
              >
                A+
              </button>
            </div>

            <button
              type="button"
              onClick={onToggleDarkMode}
              aria-label={darkMode ? 'लाइट मोड चालू करें (Switch to Light Mode)' : 'डार्क मोड चालू करें (Switch to Dark Mode)'}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-stone-700 text-stone-200 hover:bg-stone-800 transition-colors whitespace-nowrap"
            >
              {darkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden md:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-stone-300" />
                  <span className="hidden md:inline">Dark</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onNavigate({ view: 'epaper' })}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#B91C1C] hover:bg-[#991B1B] text-white font-semibold text-xs shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>ई-पेपर पढ़ें (Read E-Paper)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. CLASSIC BROADSHEET MASTHEAD */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 pt-4 pb-4">
        {/* Top Motto Banner inspired by the print edition */}
        <div className="text-center mb-2">
          <p className="inline-block bg-amber-300/90 dark:bg-amber-500/20 text-stone-900 dark:text-amber-300 px-4 py-0.5 text-xs sm:text-sm font-semibold tracking-wide border border-amber-400/60 dark:border-amber-500/30">
            “{siteConfig.tagline}”
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-4 pt-1">
          {/* Left Masthead Credentials Box */}
          <div className="hidden lg:flex lg:col-span-3 flex-col text-xs text-stone-600 dark:text-stone-400 border-r border-stone-300 dark:border-stone-800 pr-4 space-y-1">
            <div className="font-bold text-stone-900 dark:text-stone-200 uppercase tracking-wider">
              {siteConfig.subtitle}
            </div>
            <div>
              <span>संपादक: </span>
              <strong className="text-stone-900 dark:text-stone-200">{siteConfig.editorInChief}</strong>
            </div>
            <div>
              <span>PRGI / RNI रजि. नं.: </span>
              <strong className="tabular-nums text-[#991B1B] dark:text-red-400">
                {siteConfig.prgiRegistrationNumber}
              </strong>
            </div>
            <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
              कार्यालय: जीलाल स्ट्रीट, मंडी चौक, मुरादाबाद-244001
            </div>
          </div>

          {/* Center Publication Title */}
          <div className="lg:col-span-6 text-center">
            <button
              type="button"
              onClick={() => onNavigate({ view: 'home', category: 'all' })}
              className="group inline-block text-center focus:outline-none cursor-pointer"
            >
              <span className="block text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#991B1B] dark:text-red-400 mb-0.5">
                {siteConfig.subtitle} · मुरादाबाद
              </span>
              <h1 className="font-masthead text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#0C3B5E] dark:text-sky-300 leading-none py-1 group-hover:opacity-90 transition-opacity">
                {siteConfig.newspaperName}
              </h1>
            </button>

            {/* Sub-masthead Strip matching print issue */}
            <div className="mt-2 pt-1.5 border-t border-b border-stone-300 dark:border-stone-800 py-1 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-stone-700 dark:text-stone-300 font-medium">
              <span>मुरादाबाद, शनिवार, 24 अक्टूबर 2026</span>
              <span aria-hidden="true">·</span>
              <span>({siteConfig.volumeIssue})</span>
              <span aria-hidden="true">·</span>
              <span>{siteConfig.priceDisplay}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums font-bold text-[#991B1B] dark:text-red-400">
                रजि. नं. {siteConfig.prgiRegistrationNumber}
              </span>
            </div>
          </div>

          {/* Right Fast Keyword Search & Quick E-Paper PDF Download */}
          <div className="lg:col-span-3 flex flex-col gap-2 lg:pl-4 lg:border-l border-stone-300 dark:border-stone-800">
            <label htmlFor="masthead-search" className="sr-only">
              समाचार खोजें (Search News Articles)
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="masthead-search"
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (route.view !== 'home') {
                    onNavigate({ view: 'home', category: 'all' });
                  }
                }}
                placeholder="खबर, शहर या विषय खोजें..."
                className="w-full pl-9 pr-8 py-2 text-sm bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-[#991B1B]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="खोज साफ़ करें (Clear search)"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
              <span>संपादक: {siteConfig.editorInChief}</span>
              <a
                href="/assets/aistudio/24_october_2026_Parivartan_ka_door_032d6114.pdf"
                download="24_October_2026_Parivartan_Ka_Daur.pdf"
                className="inline-flex items-center gap-1 text-[#991B1B] dark:text-red-400 font-semibold hover:underline"
              >
                <FileText className="w-3 h-3" />
                <span>आज की PDF</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BREAKING NEWS TICKER */}
      {breakingArticles.length > 0 && (
        <div className="bg-[#991B1B] text-white border-y border-red-900 overflow-hidden">
          <div className="max-w-[1360px] mx-auto flex items-center">
            <div className="bg-stone-950 text-amber-400 px-3 sm:px-4 py-1.5 text-xs font-bold uppercase tracking-wider shrink-0 z-10 flex items-center gap-2 border-r border-red-800 whitespace-nowrap">
              <span>ब्रेकिंग न्यूज़</span>
              <span className="hidden sm:inline text-stone-400 font-normal">| BREAKING</span>
            </div>
            <div className="overflow-hidden flex-1 py-1.5 relative">
              <div className="animate-ticker flex items-center gap-8 px-4 text-xs sm:text-sm font-medium whitespace-nowrap">
                {[...breakingArticles, ...breakingArticles].map((art, idx) => (
                  <button
                    key={`${art.id}-${idx}`}
                    type="button"
                    onClick={() => onNavigate({ view: 'article', slug: art.slug })}
                    className="inline-flex items-center gap-2 hover:underline text-left cursor-pointer"
                  >
                    <span className="text-amber-300 font-bold">{art.cityDateline}:</span>
                    <span>{art.headline}</span>
                    <span aria-hidden="true" className="text-red-300 mx-2">
                      •
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. STICKY CATEGORY NAVIGATION BAR */}
      <nav
        aria-label="मुख्य समाचार श्रेणियां (Primary Category Navigation)"
        className="sticky top-0 z-30 bg-[#FBF9F5]/95 dark:bg-stone-950/95 backdrop-blur border-b-2 border-stone-900 dark:border-stone-700"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 flex items-center justify-between overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 sm:gap-1.5 py-1.5">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onNavigate({ view: 'home', category: cat.id })}
                  className={`px-2.5 py-1.5 text-xs sm:text-[13px] font-semibold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-stone-900 text-white dark:bg-amber-500 dark:text-stone-950'
                      : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200/70 dark:hover:bg-stone-800'
                  }`}
                >
                  <span>{cat.labelHi}</span>
                  <span className="hidden 2xl:inline text-[11px] opacity-75 ml-1 font-normal">
                    ({cat.labelEn})
                  </span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => onNavigate({ view: 'epaper' })}
              className={`px-2.5 py-1.5 text-xs sm:text-[13px] font-semibold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeCategory === 'epaper'
                  ? 'bg-[#991B1B] text-white'
                  : 'text-[#991B1B] dark:text-red-400 hover:bg-red-50 dark:hover:bg-stone-800'
              }`}
            >
              ई-पेपर आर्काइव (E-Paper)
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};
