import React, { useState } from 'react';
import {
  ArrowLeft,
  Share2,
  Check,
  Copy,
  Printer,
  Clock,
  MapPin,
  UserCheck,
  Code,
  BookOpen,
} from 'lucide-react';
import { ActiveRoute, Article, CATEGORIES } from '../types/newspaper';
import {
  buildNewsArticleSchema,
  formatIstDateTime,
  formatWhatsAppShareUrl,
} from '../utils/seoAndNewsLogic';
import { siteConfig } from '../config/siteConfig';

interface SingleArticleViewProps {
  article: Article;
  relatedArticles: Article[];
  onNavigate: (route: ActiveRoute) => void;
}

export const SingleArticleView: React.FC<SingleArticleViewProps> = ({
  article,
  relatedArticles,
  onNavigate,
}) => {
  const [copied, setCopied] = useState(false);
  const [showSchemaPreview, setShowSchemaPreview] = useState(false);

  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : siteConfig.domainUrl;
  const canonicalUrl = `${origin}/?article=${encodeURIComponent(article.slug)}`;

  const categoryInfo = CATEGORIES.find((c) => c.id === article.category);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(canonicalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const whatsappUrl = formatWhatsAppShareUrl(article, origin);
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    canonicalUrl
  )}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `${article.headline} — ${siteConfig.newspaperName}`
  )}&url=${encodeURIComponent(canonicalUrl)}`;

  const articleJsonLd = buildNewsArticleSchema(article, siteConfig);

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Breadcrumb & Back Navigation */}
      <div className="mb-6 pb-3 border-b border-stone-300 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600 dark:text-stone-400">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate({ view: 'home', category: 'all' })}
            className="inline-flex items-center gap-1 font-semibold text-stone-900 dark:text-stone-200 hover:text-[#991B1B] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>मुख्य पृष्ठ</span>
          </button>
          <span aria-hidden="true">/</span>
          <button
            type="button"
            onClick={() =>
              onNavigate({ view: 'home', category: article.category })
            }
            className="font-semibold text-[#991B1B] dark:text-red-400 hover:underline cursor-pointer"
          >
            {categoryInfo ? categoryInfo.labelHi : article.category}
          </button>
          <span aria-hidden="true">/</span>
          <span className="truncate max-w-[260px] text-stone-500">
            {article.cityDateline}
          </span>
        </div>

        <div className="tabular-nums text-[11px] text-stone-500">
          PRGI/RNI: {siteConfig.prgiRegistrationNumber}
          {article.pageNumber ? ` · प्रिंट पृष्ठ संख्या: ${article.pageNumber}` : ''}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* MAIN DISTRACTION-FREE READING COLUMN (8 cols) */}
        <article className="lg:col-span-8">
          {/* Unboxed Category & Dateline Kicker */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#991B1B] dark:text-red-400 mb-2">
            <span>{categoryInfo?.labelHi || article.category}</span>
            <span aria-hidden="true">·</span>
            <span className="text-stone-700 dark:text-stone-300">
              {article.cityDateline} डेटलाइन
            </span>
            {article.isBreaking && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-amber-700 dark:text-amber-400">
                  विशेष बुलेटिन
                </span>
              </>
            )}
          </div>

          {/* Main Broadsheet Headline */}
          <h1
            className="text-2xl sm:text-4xl lg:text-[40px] font-bold text-stone-950 dark:text-stone-50 leading-tight"
            style={{ textWrap: 'balance' }}
          >
            {article.headline}
          </h1>

          {/* Sub-headline / Deck */}
          {article.subHeadline && (
            <p className="mt-3 text-base sm:text-xl text-stone-700 dark:text-stone-300 font-medium leading-snug">
              {article.subHeadline}
            </p>
          )}

          {/* GOOGLE NEWS COMPLIANT AUTHOR BYLINE */}
          <div className="mt-5 py-4 border-y border-stone-300 dark:border-stone-800 bg-stone-100/70 dark:bg-stone-900/50 px-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <UserCheck className="w-4 h-4 text-[#991B1B] dark:text-red-400 shrink-0" />
                  <span className="font-bold text-stone-900 dark:text-stone-100">
                    {article.authorName}
                  </span>
                  <span aria-hidden="true" className="text-stone-400">
                    ·
                  </span>
                  <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
                    {article.authorRole}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-600 dark:text-stone-400 tabular-nums">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-500" />
                    <span>स्थान: {article.cityDateline}</span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-stone-500" />
                    <span>
                      प्रकाशित (Published): {formatIstDateTime(article.publishedAt)}
                    </span>
                  </span>
                  <span>
                    अंतिम अपडेट (Updated): {formatIstDateTime(article.updatedAt)}
                  </span>
                </div>
              </div>

              <div className="text-xs text-stone-500 dark:text-stone-400 sm:text-right">
                <div>पठन समय: {article.readTimeMinutes} मिनट</div>
                <div className="tabular-nums text-[11px]">
                  {siteConfig.newspaperName} ({siteConfig.prgiRegistrationNumber})
                </div>
              </div>
            </div>
          </div>

          {/* ONE-CLICK SOCIAL SHARE BAR */}
          <div className="my-5 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-200 dark:border-stone-800">
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp पर खबर शेयर करें"
                className="inline-flex items-center gap-2 px-4 py-2 rounded bg-[#15803D] hover:bg-[#166534] text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
              >
                <Share2 className="w-4 h-4" />
                <span>WhatsApp पर शेयर करें</span>
              </a>

              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold text-stone-800 dark:text-stone-200 transition-colors"
              >
                <span>Facebook</span>
              </a>

              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold text-stone-800 dark:text-stone-200 transition-colors"
              >
                <span>X (Twitter)</span>
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold text-stone-800 dark:text-stone-200 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 dark:text-emerald-400">
                      लिंक कॉपी हो गया!
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-medium text-stone-600 dark:text-stone-300 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>प्रिंट करें</span>
            </button>
          </div>

          {/* FEATURED IMAGE WITH CAPTION */}
          <figure className="my-6 border border-stone-300 dark:border-stone-800 bg-stone-100 dark:bg-stone-900">
            <div className="max-h-[480px] overflow-hidden flex items-center justify-center bg-stone-200 dark:bg-stone-800">
              <img
                src={article.imageUrl}
                alt={article.headline}
                referrerPolicy="no-referrer"
                className="w-full h-auto max-h-[480px] object-contain"
              />
            </div>
            <figcaption className="px-4 py-2.5 text-xs text-stone-600 dark:text-stone-400 italic border-t border-stone-200 dark:border-stone-800">
              चित्र: {article.imageCaption} ({siteConfig.newspaperName} फोटो)
            </figcaption>
          </figure>

          {/* KEY HIGHLIGHTS CALLOUT */}
          {article.highlights && article.highlights.length > 0 && (
            <div className="my-6 p-5 bg-[#F4EFE6] dark:bg-stone-900 border border-stone-300 dark:border-stone-800">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#991B1B] dark:text-amber-400 mb-2.5">
                प्रमुख बिंदु (Key Story Highlights)
              </h2>
              <ul className="space-y-2 text-sm sm:text-base font-medium text-stone-900 dark:text-stone-100">
                {article.highlights.map((item, index) => (
                  <li key={index} className="flex items-start gap-2.5">
                    <span className="text-[#991B1B] dark:text-amber-400 font-bold">
                      •
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* FULL FORMATTED ARTICLE BODY */}
          <div className="space-y-5 text-stone-900 dark:text-stone-100 leading-relaxed text-base sm:text-lg max-w-[72ch]">
            {article.content.map((paragraph, idx) => (
              <p
                key={idx}
                className={
                  idx === 0
                    ? 'first-letter:text-4xl first-letter:font-bold first-letter:text-[#991B1B] dark:first-letter:text-amber-400 first-letter:mr-2 first-letter:float-left first-letter:leading-none'
                    : ''
                }
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* EDITORIAL TRUST & CORRECTION NOTICE FOOTER */}
          <div className="mt-10 p-4 border border-stone-300 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/50 text-xs text-stone-600 dark:text-stone-400 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <strong className="text-stone-900 dark:text-stone-200">
                संपादकीय मानक एवं तथ्य-जांच (Google News Trust Compliance):
              </strong>
              <button
                type="button"
                onClick={() => setShowSchemaPreview((prev) => !prev)}
                className="inline-flex items-center gap-1 text-[#991B1B] dark:text-amber-400 font-semibold hover:underline cursor-pointer"
              >
                <Code className="w-3.5 h-3.5" />
                <span>
                  {showSchemaPreview
                    ? 'NewsArticle JSON-LD छुपाएं'
                    : 'NewsArticle JSON-LD स्कीमा देखें'}
                </span>
              </button>
            </div>
            <p>
              यह समाचार ‘{siteConfig.newspaperName}’ (PRGI/RNI:{' '}
              {siteConfig.prgiRegistrationNumber}) के संपादकीय और तथ्य-जांच मानकों के
              अंतर्गत प्रकाशित किया गया है। यदि आपको इस समाचार में कोई तथ्यात्मक त्रुटि
              दिखती है, तो कृपया हमारी{' '}
              <button
                type="button"
                onClick={() =>
                  onNavigate({ view: 'trust', page: 'corrections-policy' })
                }
                className="underline font-semibold text-stone-900 dark:text-stone-200 cursor-pointer"
              >
                सुधार नीति (Corrections Policy)
              </button>{' '}
              के तहत हमें सूचित करें।
            </p>

            {showSchemaPreview && (
              <pre className="mt-3 p-3 bg-stone-950 text-emerald-400 rounded text-[11px] font-mono overflow-x-auto">
                {JSON.stringify(articleJsonLd, null, 2)}
              </pre>
            )}
          </div>
        </article>

        {/* RIGHT SIDEBAR (4 cols): Related Stories & E-Paper CTA */}
        <aside className="lg:col-span-4 space-y-6 lg:border-l lg:border-stone-300 dark:lg:border-stone-800 lg:pl-7">
          <div className="border border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-900 p-5">
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 pb-2 mb-4 border-b border-stone-200 dark:border-stone-800">
              संबंधित एवं प्रमुख खबरें (Related Stories)
            </h2>
            <div className="divide-y divide-stone-200 dark:divide-stone-800">
              {relatedArticles.slice(0, 5).map((rel) => (
                <div key={rel.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="text-xs text-[#991B1B] dark:text-red-400 font-semibold mb-0.5">
                    {rel.cityDateline} ·{' '}
                    {formatIstDateTime(rel.publishedAt, false)}
                  </div>
                  <h3
                    onClick={() =>
                      onNavigate({ view: 'article', slug: rel.slug })
                    }
                    className="text-sm font-bold text-stone-900 dark:text-stone-100 hover:text-[#991B1B] dark:hover:text-amber-400 leading-snug cursor-pointer"
                  >
                    {rel.headline}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-stone-300 dark:border-stone-800 bg-[#F4EFE6] dark:bg-stone-900 p-5">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-1">
              आज का संपूर्ण अखबार पढ़ें
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 mb-4">
              24 अक्टूबर 2026 के मुरादाबाद संस्करण के सभी 8 पृष्ठ हाई-रेज़ोल्यूशन ई-पेपर
              रीडर में उपलब्ध हैं।
            </p>
            <button
              type="button"
              onClick={() => onNavigate({ view: 'epaper' })}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#991B1B] hover:bg-red-800 text-white text-xs font-bold rounded transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>ई-पेपर पोर्टल खोलें (/epaper)</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
