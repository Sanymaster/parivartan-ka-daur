import React from 'react';
import {
  BookOpen,
  Download,
  ArrowRight,
  Share2,
  Newspaper,
  Scale,
} from 'lucide-react';
import {
  ActiveRoute,
  Article,
  CATEGORIES,
  CategoryId,
  EPaperEdition,
} from '../types/newspaper';
import { formatIstDateTime, formatWhatsAppShareUrl } from '../utils/seoAndNewsLogic';
import { siteConfig } from '../config/siteConfig';

interface HomePortalViewProps {
  articles: Article[];
  allArticles: Article[];
  selectedCategory: CategoryId;
  searchQuery: string;
  onClearFilters: () => void;
  onNavigate: (route: ActiveRoute) => void;
  latestEPaper: EPaperEdition;
}

export const HomePortalView: React.FC<HomePortalViewProps> = ({
  articles,
  allArticles,
  selectedCategory,
  searchQuery,
  onClearFilters,
  onNavigate,
  latestEPaper,
}) => {
  const getCategoryLabel = (catId: string) => {
    const found = CATEGORIES.find((c) => c.id === catId);
    return found ? found.labelHi : catId;
  };

  // Identify Lead Hero Story, Secondary Top Stories, Chronological Feed, and Editorial/Special Column Sidebar
  const leadStory =
    articles.find((a) => a.isFeaturedLead) || articles[0] || null;
  const remainingArticles = leadStory
    ? articles.filter((a) => a.id !== leadStory.id)
    : [];

  const topGridStories = remainingArticles.slice(0, 4);
  const chronologicalStories = remainingArticles.slice(4);

  // Dedicated Editorial & Special Column articles from allArticles so the sidebar is always rich
  const editorialAndSpecial = allArticles.filter(
    (a) => a.category === 'editorial' || a.category === 'special-column'
  );

  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : siteConfig.domainUrl;

  if (articles.length === 0) {
    return (
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="max-w-md mx-auto border border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-900 p-8 rounded">
          <Newspaper className="w-10 h-10 text-stone-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">
            कोई समाचार नहीं मिला (No Matching Articles)
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400 mb-6">
            आपकी खोज “{searchQuery}” या चयनित श्रेणी में कोई खबर उपलब्ध नहीं है।
          </p>
          <button
            type="button"
            onClick={onClearFilters}
            className="px-4 py-2 bg-[#991B1B] text-white text-sm font-semibold rounded hover:bg-red-800 transition-colors cursor-pointer"
          >
            सभी समाचार देखें (Reset Filters)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Category / Search Filter Header Banner when filtered */}
      {(selectedCategory !== 'all' || searchQuery.trim() !== '') && (
        <div className="mb-6 pb-4 border-b border-stone-300 dark:border-stone-800 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#991B1B] dark:text-red-400 font-semibold">
              समाचार अनुभाग (Section Filter)
            </div>
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mt-0.5">
              {selectedCategory !== 'all'
                ? getCategoryLabel(selectedCategory)
                : `खोज परिणाम: “${searchQuery}”`}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClearFilters}
            className="text-xs font-semibold text-stone-700 dark:text-stone-300 underline hover:text-[#991B1B] cursor-pointer"
          >
            मुख्य पृष्ठ पर लौटें (Show All News)
          </button>
        </div>
      )}

      {/* MAIN 12-COLUMN BROADSHEET GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT / MAIN 8 COLUMNS: Lead Hero Story + Top Stories Grid + Latest Chronological Feed */}
        <div className="lg:col-span-8 space-y-8">
          {/* 1. LEAD HERO STORY */}
          {leadStory && (
            <article className="pb-8 border-b-2 border-stone-900 dark:border-stone-700">
              {/* Unboxed Kicker Metadata */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#991B1B] dark:text-red-400 mb-2">
                <span>{getCategoryLabel(leadStory.category)}</span>
                <span aria-hidden="true">·</span>
                <span className="text-stone-700 dark:text-stone-300">
                  {leadStory.cityDateline}
                </span>
                {leadStory.pageNumber && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-stone-500 dark:text-stone-400 font-normal">
                      प्रिंट पृष्ठ {leadStory.pageNumber}
                    </span>
                  </>
                )}
              </div>

              {/* Bold Broadsheet Lead Headline */}
              <h2
                onClick={() =>
                  onNavigate({ view: 'article', slug: leadStory.slug })
                }
                className="text-2xl sm:text-4xl font-bold text-stone-950 dark:text-stone-50 leading-tight hover:text-[#991B1B] dark:hover:text-amber-400 transition-colors cursor-pointer"
                style={{ textWrap: 'balance' }}
              >
                {leadStory.headline}
              </h2>

              {leadStory.subHeadline && (
                <p className="mt-2 text-base sm:text-lg font-medium text-stone-700 dark:text-stone-300 leading-snug">
                  {leadStory.subHeadline}
                </p>
              )}

              {/* Featured Lead Photo with Caption */}
              <div
                onClick={() =>
                  onNavigate({ view: 'article', slug: leadStory.slug })
                }
                className="mt-4 overflow-hidden border border-stone-300 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 cursor-pointer group"
              >
                <div className="aspect-video w-full overflow-hidden bg-stone-200 dark:bg-stone-800">
                  <img
                    src={leadStory.imageUrl}
                    alt={leadStory.headline}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300"
                  />
                </div>
                <div className="px-3 py-2 text-xs text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 italic">
                  {leadStory.imageCaption}
                </div>
              </div>

              {/* Summary & Key Bullet Highlights */}
              <p className="mt-4 text-base text-stone-800 dark:text-stone-200 leading-relaxed">
                {leadStory.summary}
              </p>

              {leadStory.highlights && leadStory.highlights.length > 0 && (
                <ul className="mt-3 space-y-1.5 bg-stone-100/80 dark:bg-stone-900/70 p-3.5 border border-stone-200 dark:border-stone-800 text-xs sm:text-sm text-stone-800 dark:text-stone-300">
                  {leadStory.highlights.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#991B1B] dark:text-amber-400 font-bold">
                        ▪
                      </span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Byline & Quick Actions */}
              <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500 dark:text-stone-400">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-stone-800 dark:text-stone-200">
                    {leadStory.authorName}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{formatIstDateTime(leadStory.publishedAt)}</span>
                  <span aria-hidden="true">·</span>
                  <span>{leadStory.readTimeMinutes} मिनट पठन</span>
                </div>

                <div className="flex items-center gap-4">
                  <a
                    href={formatWhatsAppShareUrl(leadStory, origin)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>WhatsApp शेयर</span>
                  </a>
                  <button
                    type="button"
                    onClick={() =>
                      onNavigate({ view: 'article', slug: leadStory.slug })
                    }
                    className="inline-flex items-center gap-1 font-bold text-[#991B1B] dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    <span>पूरी खबर पढ़ें</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          )}

          {/* 2. TOP STORIES 2-COLUMN BROADSHEET GRID */}
          {topGridStories.length > 0 && (
            <section aria-labelledby="top-stories-heading">
              <div className="flex items-center justify-between mb-4 pb-1.5 border-b border-stone-300 dark:border-stone-800">
                <h3
                  id="top-stories-heading"
                  className="text-lg font-bold text-stone-900 dark:text-stone-100 tracking-tight"
                >
                  प्रमुख समाचार (Top Stories)
                </h3>
                <span className="text-xs text-stone-500 dark:text-stone-400">
                  मुरादाबाद एवं राष्ट्रीय संस्करण
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {topGridStories.map((story) => (
                  <article
                    key={story.id}
                    className="flex flex-col justify-between pb-5 border-b border-stone-200 dark:border-stone-800"
                  >
                    <div>
                      <div
                        onClick={() =>
                          onNavigate({ view: 'article', slug: story.slug })
                        }
                        className="aspect-[16/10] w-full overflow-hidden bg-stone-200 dark:bg-stone-800 border border-stone-300 dark:border-stone-800 mb-3 cursor-pointer group"
                      >
                        <img
                          src={story.imageUrl}
                          alt={story.headline}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                        />
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#991B1B] dark:text-red-400 font-semibold mb-1">
                        <span>{getCategoryLabel(story.category)}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-stone-600 dark:text-stone-400">
                          {story.cityDateline}
                        </span>
                      </div>

                      <h4
                        onClick={() =>
                          onNavigate({ view: 'article', slug: story.slug })
                        }
                        className="text-lg font-bold text-stone-900 dark:text-stone-100 leading-snug hover:text-[#991B1B] dark:hover:text-amber-400 transition-colors cursor-pointer"
                      >
                        {story.headline}
                      </h4>

                      <p className="mt-2 text-sm text-stone-600 dark:text-stone-400 line-clamp-3 leading-relaxed">
                        {story.summary}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                      <span>
                        {story.authorName} ·{' '}
                        {formatIstDateTime(story.publishedAt, false)}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          onNavigate({ view: 'article', slug: story.slug })
                        }
                        className="font-semibold text-stone-900 dark:text-stone-200 hover:text-[#991B1B] cursor-pointer"
                      >
                        पढ़ें →
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* 3. CHRONOLOGICAL LATEST NEWS FEED */}
          {chronologicalStories.length > 0 && (
            <section aria-labelledby="latest-feed-heading" className="pt-2">
              <div className="flex items-center justify-between mb-4 pb-1.5 border-b border-stone-300 dark:border-stone-800">
                <h3
                  id="latest-feed-heading"
                  className="text-lg font-bold text-stone-900 dark:text-stone-100 tracking-tight"
                >
                  ताज़ा समाचार क्रमानुसार (Latest News Feed)
                </h3>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-mono tabular-nums">
                  कुल {articles.length} खबरें
                </span>
              </div>

              <div className="divide-y divide-stone-200 dark:divide-stone-800">
                {chronologicalStories.map((story) => (
                  <article
                    key={story.id}
                    className="py-5 first:pt-1 flex flex-col sm:flex-row gap-4 items-start"
                  >
                    <div
                      onClick={() =>
                        onNavigate({ view: 'article', slug: story.slug })
                      }
                      className="w-full sm:w-48 aspect-[16/10] shrink-0 overflow-hidden bg-stone-200 dark:bg-stone-800 border border-stone-300 dark:border-stone-800 cursor-pointer"
                    >
                      <img
                        src={story.imageUrl}
                        alt={story.headline}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-1">
                        <span className="font-semibold text-[#991B1B] dark:text-red-400">
                          {getCategoryLabel(story.category)}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-medium text-stone-700 dark:text-stone-300">
                          {story.cityDateline}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{formatIstDateTime(story.publishedAt)}</span>
                      </div>

                      <h4
                        onClick={() =>
                          onNavigate({ view: 'article', slug: story.slug })
                        }
                        className="text-lg font-bold text-stone-900 dark:text-stone-100 leading-snug hover:text-[#991B1B] dark:hover:text-amber-400 cursor-pointer"
                      >
                        {story.headline}
                      </h4>

                      <p className="mt-1.5 text-sm text-stone-600 dark:text-stone-400 line-clamp-2">
                        {story.summary}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* RIGHT 4 COLUMNS SIDEBAR: Editorial & Special Column + Today's Print E-Paper Card + Masthead Credentials */}
        <aside className="lg:col-span-4 space-y-8 lg:border-l lg:border-stone-300 dark:lg:border-stone-800 lg:pl-7">
          {/* A. DEDICATED EDITORIAL & SPECIAL COLUMN SECTION */}
          <section
            aria-labelledby="editorial-sidebar-heading"
            className="bg-[#F4EFE6] dark:bg-stone-900 border border-stone-300 dark:border-stone-800 p-5"
          >
            <div className="pb-2.5 mb-4 border-b-2 border-stone-900 dark:border-stone-700 flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#991B1B] dark:text-red-400 font-bold block">
                  वैचारिक मंथन एवं पड़ताल
                </span>
                <h3
                  id="editorial-sidebar-heading"
                  className="text-lg font-bold text-stone-950 dark:text-stone-100"
                >
                  संपादकीय एवं विशेष स्तंभ
                </h3>
              </div>
              <Scale className="w-5 h-5 text-stone-700 dark:text-stone-300 shrink-0" />
            </div>

            <div className="divide-y divide-stone-300/80 dark:divide-stone-800">
              {editorialAndSpecial.map((item) => (
                <article key={item.id} className="py-3.5 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-1.5 text-xs text-[#991B1B] dark:text-amber-400 font-semibold mb-1">
                    <span>
                      {item.category === 'editorial'
                        ? 'संपादकीय विचार'
                        : 'विशेष आरटीआई पड़ताल'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-stone-600 dark:text-stone-400">
                      {item.authorName}
                    </span>
                  </div>

                  <h4
                    onClick={() =>
                      onNavigate({ view: 'article', slug: item.slug })
                    }
                    className="text-base font-bold text-stone-900 dark:text-stone-100 leading-snug hover:text-[#991B1B] dark:hover:text-amber-400 cursor-pointer"
                  >
                    {item.headline}
                  </h4>

                  <p className="mt-1.5 text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-stone-300 dark:border-stone-800 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() =>
                  onNavigate({ view: 'home', category: 'editorial' })
                }
                className="font-semibold text-stone-900 dark:text-stone-200 hover:text-[#991B1B] cursor-pointer"
              >
                सभी संपादकीय लेख →
              </button>
              <button
                type="button"
                onClick={() =>
                  onNavigate({ view: 'home', category: 'special-column' })
                }
                className="font-semibold text-[#991B1B] dark:text-red-400 hover:underline cursor-pointer"
              >
                विशेष स्तंभ →
              </button>
            </div>
          </section>

          {/* B. TODAY'S PRINT E-PAPER FRONT-PAGE SHOWCASE */}
          <section
            aria-labelledby="epaper-widget-heading"
            className="border border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-900 p-5"
          >
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-stone-200 dark:border-stone-800">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#991B1B] dark:text-red-400 font-bold block">
                  डिजिटल प्रिंट संस्करण
                </span>
                <h3
                  id="epaper-widget-heading"
                  className="text-base font-bold text-stone-900 dark:text-stone-100"
                >
                  आज का ई-पेपर ({latestEPaper.displayDateHi})
                </h3>
              </div>
              <span className="text-xs font-mono text-stone-500">
                {latestEPaper.pages.length} पृष्ठ
              </span>
            </div>

            <div
              onClick={() =>
                onNavigate({ view: 'epaper', editionId: latestEPaper.id })
              }
              className="border border-stone-300 dark:border-stone-700 overflow-hidden bg-stone-100 dark:bg-stone-800 cursor-pointer group"
            >
              <img
                src={latestEPaper.coverImageUrl}
                alt={`${siteConfig.newspaperName} - ${latestEPaper.displayDateHi}`}
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain group-hover:scale-[1.01] transition-transform duration-200"
              />
            </div>

            <div className="mt-3 text-xs text-stone-600 dark:text-stone-400 flex items-center justify-between">
              <span>{latestEPaper.editionTitle}</span>
              <span className="font-mono">{latestEPaper.volumeIssue}</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  onNavigate({ view: 'epaper', editionId: latestEPaper.id })
                }
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#991B1B] hover:bg-red-800 text-white text-xs font-semibold rounded transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>ई-पेपर रीडर खोलें</span>
              </button>
              <a
                href={latestEPaper.pdfUrl}
                download="24_October_2026_Parivartan_Ka_Daur.pdf"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-semibold rounded transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF डाउनलोड</span>
              </a>
            </div>
          </section>

          {/* C. OFFICIAL RNI / PRGI REGISTRATION & OFFICE IMPRINT CARD */}
          <section
            aria-labelledby="imprint-box-heading"
            className="border border-stone-300 dark:border-stone-800 bg-[#FBF9F5] dark:bg-stone-900/60 p-4 text-xs space-y-2 text-stone-700 dark:text-stone-300"
          >
            <h3
              id="imprint-box-heading"
              className="font-bold text-stone-950 dark:text-stone-100 uppercase tracking-wider border-b border-stone-300 dark:border-stone-800 pb-1.5"
            >
              वैधानिक प्रकाशन विवरण (PRGI / RNI Imprint)
            </h3>
            <p>
              <strong>समाचार पत्र:</strong> {siteConfig.subtitle}{' '}
              ‘{siteConfig.newspaperName}’
            </p>
            <p>
              <strong>पंजीकरण संख्या (RNI):</strong>{' '}
              <span className="font-mono font-bold text-[#991B1B] dark:text-red-400">
                {siteConfig.prgiRegistrationNumber}
              </span>
            </p>
            <p>
              <strong>सम्पादक:</strong> {siteConfig.editorInChief}
            </p>
            <p>
              <strong>स्वामी, मुद्रक एवं प्रकाशक:</strong>{' '}
              {siteConfig.ownerPublisherPrinter}
            </p>
            <p>
              <strong>मुख्य कार्यालय:</strong> {siteConfig.headOfficeAddress}
            </p>
            <p>
              <strong>कानूनी सलाहकार:</strong>{' '}
              {siteConfig.legalAdvisors.join(', ')}
            </p>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 pt-1 border-t border-stone-200 dark:border-stone-800">
              {siteConfig.jurisdictionNotice}
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
};
