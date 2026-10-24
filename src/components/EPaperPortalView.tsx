import React, { useState } from 'react';
import {
  Calendar,
  ZoomIn,
  ZoomOut,
  Download,
  ChevronLeft,
  ChevronRight,
  FileText,
  BookOpen,
  RotateCcw,
} from 'lucide-react';
import { ActiveRoute, EPaperEdition } from '../types/newspaper';
import { siteConfig } from '../config/siteConfig';

interface EPaperPortalViewProps {
  editions: EPaperEdition[];
  initialEditionId?: string;
  onNavigate: (route: ActiveRoute) => void;
}

export const EPaperPortalView: React.FC<EPaperPortalViewProps> = ({
  editions,
  initialEditionId,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [activeEditionId, setActiveEditionId] = useState<string>(
    initialEditionId || editions[0]?.id || ''
  );
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [zoomPercent, setZoomPercent] = useState<number>(100);
  const [readerMode, setReaderMode] = useState<'pages' | 'pdf'>('pages');

  const filteredEditions = selectedDate
    ? editions.filter((ed) => ed.issueDate === selectedDate)
    : editions;

  const activeEdition =
    editions.find((ed) => ed.id === activeEditionId) ||
    filteredEditions[0] ||
    editions[0];

  const pages = activeEdition?.pages || [];
  const safePageIndex =
    currentPageIndex >= 0 && currentPageIndex < pages.length
      ? currentPageIndex
      : 0;
  const currentPage = pages[safePageIndex];

  const handleSelectEdition = (edition: EPaperEdition) => {
    setActiveEditionId(edition.id);
    setCurrentPageIndex(0);
    setZoomPercent(100);
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* TOP BAR: E-Paper Portal Header & Date-Picker Filter */}
      <div className="border-b-2 border-stone-900 dark:border-stone-700 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-[#991B1B] dark:text-red-400">
            डिजिटल प्रिंट संस्करण आर्काइव · RNI: {siteConfig.prgiRegistrationNumber}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-950 dark:text-stone-100 mt-0.5">
            {siteConfig.newspaperName} — दैनिक ई-पेपर पोर्टल (E-Paper Portal)
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
            तारीख़ के अनुसार दैनिक प्रिंट संस्करण चुनें, पृष्ठ ज़ूम करके पढ़ें या पूर्ण पीडीएफ डाउनलोड करें।
          </p>
        </div>

        {/* Date Picker Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 px-3 py-1.5 rounded">
            <Calendar className="w-4 h-4 text-[#991B1B] dark:text-red-400" />
            <label
              htmlFor="epaper-date-picker"
              className="text-xs font-semibold text-stone-700 dark:text-stone-300 whitespace-nowrap"
            >
              संस्करण तिथि (Filter by Date):
            </label>
            <input
              id="epaper-date-picker"
              type="date"
              value={selectedDate}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedDate(val);
                const match = editions.find((ed) => ed.issueDate === val);
                if (match) {
                  handleSelectEdition(match);
                }
              }}
              className="text-xs font-mono text-stone-900 dark:text-stone-100 bg-transparent focus:outline-none"
            />
          </div>

          {selectedDate && (
            <button
              type="button"
              onClick={() => setSelectedDate('')}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold border border-stone-300 dark:border-stone-700 rounded hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>सभी तिथियां दिखाएं</span>
            </button>
          )}
        </div>
      </div>

      {/* EDITION ARCHIVE STRIP (Front-Page Thumbnails, Issue Date, Edition Name) */}
      <section aria-labelledby="editions-grid-heading">
        <div className="flex items-center justify-between mb-3">
          <h2
            id="editions-grid-heading"
            className="text-base font-bold text-stone-900 dark:text-stone-100"
          >
            उपलब्ध प्रिंट संस्करण ({filteredEditions.length})
          </h2>
          <span className="text-xs text-stone-500">
            किसी भी संस्करण पर क्लिक करके इंटरैक्टिव रीडर में खोलें
          </span>
        </div>

        {filteredEditions.length === 0 ? (
          <div className="p-6 border border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-900 text-center text-sm text-stone-600 dark:text-stone-400">
            चयनित तिथि ({selectedDate}) के लिए कोई ई-पेपर संस्करण नहीं मिला।{' '}
            <button
              type="button"
              onClick={() => setSelectedDate('')}
              className="text-[#991B1B] font-semibold underline ml-1 cursor-pointer"
            >
              सभी संस्करण देखें
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredEditions.map((ed) => {
              const isSelected = activeEdition?.id === ed.id;
              return (
                <div
                  key={ed.id}
                  onClick={() => handleSelectEdition(ed)}
                  className={`border p-3 transition-colors cursor-pointer flex gap-3 items-start ${
                    isSelected
                      ? 'border-[#991B1B] bg-[#F4EFE6] dark:bg-stone-900'
                      : 'border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-900/60 hover:border-stone-400'
                  }`}
                >
                  <div className="w-20 aspect-[2/3] shrink-0 border border-stone-300 dark:border-stone-700 overflow-hidden bg-stone-100">
                    <img
                      src={ed.coverImageUrl}
                      alt={ed.editionTitle}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] tabular-nums text-[#991B1B] dark:text-red-400 font-bold">
                      {ed.issueDate} · {ed.volumeIssue}
                    </div>
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 leading-snug mt-0.5">
                      {ed.editionTitle}
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                      {ed.displayDateHi}
                    </p>
                    <p className="text-[11px] text-stone-500 mt-1 tabular-nums">
                      कुल पृष्ठ: {ed.pages.length}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* INTERACTIVE E-PAPER READER VIEW */}
      {activeEdition && (
        <section
          aria-labelledby="interactive-epaper-reader-heading"
          className="border-2 border-stone-900 dark:border-stone-700 bg-white dark:bg-stone-900"
        >
          {/* Reader Control Toolbar */}
          <div className="bg-stone-900 text-stone-100 px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-stone-800">
            <div>
              <h2
                id="interactive-epaper-reader-heading"
                className="text-sm sm:text-base font-bold text-white"
              >
                {activeEdition.editionTitle} — {activeEdition.displayDateHi}
              </h2>
              <div className="text-xs text-stone-400 tabular-nums">
                {activeEdition.volumeIssue} · पृष्ठ {safePageIndex + 1} /{' '}
                {pages.length} ({currentPage?.title})
              </div>
            </div>

            {/* Page Navigation, Zoom Controls & Download Full PDF Button */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Reader Mode Switch */}
              <div className="flex items-center border border-stone-700 rounded overflow-hidden text-xs">
                <button
                  type="button"
                  onClick={() => setReaderMode('pages')}
                  className={`px-2.5 py-1.5 font-semibold inline-flex items-center gap-1 cursor-pointer ${
                    readerMode === 'pages'
                      ? 'bg-amber-500 text-stone-950'
                      : 'text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>पृष्ठ दृश्य (Page View)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setReaderMode('pdf')}
                  className={`px-2.5 py-1.5 font-semibold inline-flex items-center gap-1 border-l border-stone-700 cursor-pointer ${
                    readerMode === 'pdf'
                      ? 'bg-amber-500 text-stone-950'
                      : 'text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>पूर्ण PDF व्यूअर</span>
                </button>
              </div>

              {readerMode === 'pages' && (
                <>
                  {/* Prev / Next Page */}
                  <div className="flex items-center border border-stone-700 rounded overflow-hidden">
                    <button
                      type="button"
                      disabled={safePageIndex === 0}
                      onClick={() =>
                        setCurrentPageIndex((p) => Math.max(0, p - 1))
                      }
                      aria-label="पिछला पृष्ठ (Previous Page)"
                      className="px-2.5 py-1.5 text-xs font-semibold hover:bg-stone-800 disabled:opacity-40 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>पिछला</span>
                    </button>
                    <span className="px-2.5 py-1.5 text-xs tabular-nums border-x border-stone-700 bg-stone-950">
                      पृष्ठ {safePageIndex + 1} / {pages.length}
                    </span>
                    <button
                      type="button"
                      disabled={safePageIndex >= pages.length - 1}
                      onClick={() =>
                        setCurrentPageIndex((p) =>
                          Math.min(pages.length - 1, p + 1)
                        )
                      }
                      aria-label="अगला पृष्ठ (Next Page)"
                      className="px-2.5 py-1.5 text-xs font-semibold hover:bg-stone-800 disabled:opacity-40 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>अगला</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Zoom Controls */}
                  <div className="flex items-center border border-stone-700 rounded overflow-hidden">
                    <button
                      type="button"
                      onClick={() =>
                        setZoomPercent((z) => Math.max(75, z - 25))
                      }
                      aria-label="ज़ूम आउट (Zoom Out)"
                      className="px-2 py-1.5 hover:bg-stone-800 cursor-pointer"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="px-2 py-1.5 text-xs font-mono border-x border-stone-700">
                      {zoomPercent}%
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setZoomPercent((z) => Math.min(175, z + 25))
                      }
                      aria-label="ज़ूम इन (Zoom In)"
                      className="px-2 py-1.5 hover:bg-stone-800 cursor-pointer"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}

              {/* Direct Download Full PDF Button */}
              <a
                href={activeEdition.pdfUrl}
                download={`Parivartan_Ka_Daur_${activeEdition.issueDate}.pdf`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#B91C1C] hover:bg-red-800 text-white text-xs font-bold rounded transition-colors whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Full PDF</span>
              </a>
            </div>
          </div>

          {/* Page Number Quick-Jump Bar */}
          {readerMode === 'pages' && (
            <div className="bg-stone-100 dark:bg-stone-950 px-4 py-2 border-b border-stone-300 dark:border-stone-800 flex items-center gap-1.5 overflow-x-auto">
              <span className="text-xs font-semibold text-stone-600 dark:text-stone-400 mr-2 shrink-0">
                पृष्ठ चुनें:
              </span>
              {pages.map((pg, idx) => (
                <button
                  key={pg.pageNumber}
                  type="button"
                  onClick={() => setCurrentPageIndex(idx)}
                  className={`px-3 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    safePageIndex === idx
                      ? 'bg-[#991B1B] text-white'
                      : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {pg.title}
                </button>
              ))}
            </div>
          )}

          {/* Main Broadsheet Canvas / PDF Embed */}
          <div className="bg-stone-200 dark:bg-stone-950 p-3 sm:p-6 overflow-auto max-h-[1150px] flex justify-center">
            {readerMode === 'pages' && currentPage ? (
              <div
                style={{ width: `${zoomPercent}%`, maxWidth: `${(zoomPercent / 100) * 980}px` }}
                className="bg-white shadow-md border border-stone-300 transition-all duration-150"
              >
                <img
                  src={currentPage.imageUrl}
                  alt={`${activeEdition.editionTitle} - ${currentPage.title}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto block"
                />
              </div>
            ) : (
              <div className="w-full h-[850px] bg-white border border-stone-300">
                <iframe
                  src={activeEdition.pdfUrl}
                  title={`${activeEdition.editionTitle} Full PDF`}
                  className="w-full h-full border-0"
                />
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
