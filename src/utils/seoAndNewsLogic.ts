import { Article, CategoryId } from '../types/newspaper';
import { SiteConfig } from '../config/siteConfig';

/**
 * Generates a URL-safe slug for Hindi/English headlines.
 * Preserves alphanumeric and Devanagari words or maps common keywords cleanly.
 */
export function generateSlug(input: string): string {
  const cleaned = input
    .trim()
    .toLowerCase()
    .replace(/['"“”‘’!?,.:;|()[\]{}—–/\\]+/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (!cleaned) {
    return `news-${Date.now()}`;
  }
  return cleaned.slice(0, 90);
}

/**
 * Formats an ISO 8601 date string into Indian Standard Time (IST) display format.
 */
export function formatIstDateTime(isoString: string, includeTime = true): string {
  try {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return isoString;

    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      ...(includeTime
        ? {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }
        : {}),
    };

    const formatted = new Intl.DateTimeFormat('hi-IN', options).format(date);
    return includeTime ? `${formatted} IST` : formatted;
  } catch {
    return isoString;
  }
}

/**
 * Filters articles by category and keyword search query across headline, subHeadline, summary, cityDateline, and content.
 */
export function filterArticles(
  articles: Article[],
  category: CategoryId,
  searchQuery: string
): Article[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return articles
    .filter((article) => {
      const matchesCategory = category === 'all' || article.category === category;
      if (!matchesCategory) return false;

      if (!normalizedQuery) return true;

      const haystack = [
        article.headline,
        article.subHeadline || '',
        article.summary,
        article.cityDateline,
        article.authorName,
        article.slug,
        ...article.content,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

/**
 * Builds valid Schema.org NewsMediaOrganization JSON-LD object for the Homepage.
 */
export function buildNewsMediaOrganizationSchema(config: SiteConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: `${config.newspaperName} (${config.newspaperNameEn})`,
    alternateName: config.subtitle,
    slogan: config.tagline,
    url: config.domainUrl,
    foundingDate: config.establishedYear,
    identifier: {
      '@type': 'PropertyValue',
      name: 'PRGI / RNI Registration Number',
      value: config.prgiRegistrationNumber,
    },
    logo: {
      '@type': 'ImageObject',
      url: `${config.domainUrl}/assets/epaper/page-1.jpg`,
      width: 600,
      height: 60,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'जीलाल स्ट्रीट, मंडी चौक (Jilal Street, Mandi Chowk)',
      addressLocality: 'Moradabad',
      addressRegion: 'Uttar Pradesh',
      postalCode: config.headOfficePin,
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: config.contactPhone,
      email: config.contactEmail,
      contactType: 'editorial & customer support',
      areaServed: 'IN',
      availableLanguage: ['Hindi', 'English'],
    },
    publishingPrinciples: `${config.domainUrl}/?trust=editorial-policy`,
    correctionsPolicy: `${config.domainUrl}/?trust=corrections-policy`,
    ethicsPolicy: `${config.domainUrl}/?trust=editorial-policy`,
    masthead: `${config.domainUrl}/?trust=about`,
  };
}

/**
 * Builds valid Schema.org NewsArticle JSON-LD object for Single Article Reading Pages.
 */
export function buildNewsArticleSchema(article: Article, config: SiteConfig) {
  const canonicalUrl = `${config.domainUrl}/?article=${encodeURIComponent(article.slug)}`;
  const fullImageUrl = article.imageUrl.startsWith('http')
    ? article.imageUrl
    : `${config.domainUrl}${article.imageUrl}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    headline: article.headline.slice(0, 110),
    description: article.summary,
    image: [fullImageUrl],
    datePublished: new Date(article.publishedAt).toISOString(),
    dateModified: new Date(article.updatedAt || article.publishedAt).toISOString(),
    dateline: article.cityDateline,
    articleSection: article.category,
    inLanguage: 'hi-IN',
    author: {
      '@type': 'Person',
      name: article.authorName,
      jobTitle: article.authorRole,
    },
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: `${config.newspaperName} (${config.newspaperNameEn})`,
      identifier: config.prgiRegistrationNumber,
      logo: {
        '@type': 'ImageObject',
        url: `${config.domainUrl}/assets/epaper/page-1.jpg`,
      },
    },
  };
}

/**
 * Escapes XML special characters safely.
 */
export function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generates standard sitemap.xml containing all public portal pages, compliance pages, E-Paper archive, and all articles.
 */
export function generateStandardSitemapXml(articles: Article[], domainUrl: string): string {
  const baseUrl = domainUrl.replace(/\/$/, '');
  const nowIso = new Date().toISOString();

  const staticPaths = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'hourly' },
    { loc: `${baseUrl}/?view=epaper`, priority: '0.9', changefreq: 'daily' },
    { loc: `${baseUrl}/?trust=about`, priority: '0.7', changefreq: 'monthly' },
    { loc: `${baseUrl}/?trust=editorial-policy`, priority: '0.7', changefreq: 'monthly' },
    { loc: `${baseUrl}/?trust=corrections-policy`, priority: '0.7', changefreq: 'monthly' },
    { loc: `${baseUrl}/?trust=privacy-terms`, priority: '0.6', changefreq: 'monthly' },
    { loc: `${baseUrl}/?trust=contact-grievance`, priority: '0.7', changefreq: 'monthly' },
  ];

  const staticEntries = staticPaths
    .map(
      (item) => `  <url>
    <loc>${escapeXml(item.loc)}</loc>
    <lastmod>${nowIso}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
    )
    .join('\n');

  const articleEntries = articles
    .map((article) => {
      const articleUrl = `${baseUrl}/?article=${encodeURIComponent(article.slug)}`;
      const lastMod = new Date(article.updatedAt || article.publishedAt).toISOString();
      return `  <url>
    <loc>${escapeXml(articleUrl)}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${articleEntries}
</urlset>`;
}

/**
 * Generates Google News compliant news-sitemap.xml strictly for articles published in the last 48 hours.
 * If no articles fall within 48 hours of referenceNowIso, falls back to the most recent 48-hour window of the latest edition.
 */
export function generateGoogleNewsSitemapXml(
  articles: Article[],
  config: SiteConfig,
  referenceNowIso?: string
): string {
  const baseUrl = config.domainUrl.replace(/\/$/, '');
  const refTime = referenceNowIso ? new Date(referenceNowIso).getTime() : Date.now();
  const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;

  let recentArticles = articles.filter((article) => {
    const pubTime = new Date(article.publishedAt).getTime();
    const ageMs = refTime - pubTime;
    return ageMs >= -FORTY_EIGHT_HOURS_MS && ageMs <= FORTY_EIGHT_HOURS_MS;
  });

  // If all preloaded articles are anchored around the newspaper issue date, filter within 48h of the newest article
  if (recentArticles.length === 0 && articles.length > 0) {
    const newestTimestamp = Math.max(
      ...articles.map((a) => new Date(a.publishedAt).getTime())
    );
    recentArticles = articles.filter(
      (a) => newestTimestamp - new Date(a.publishedAt).getTime() <= FORTY_EIGHT_HOURS_MS
    );
  }

  const urlNodes = recentArticles
    .map((article) => {
      const loc = `${baseUrl}/?article=${encodeURIComponent(article.slug)}`;
      const pubDateIso = new Date(article.publishedAt).toISOString();
      return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(config.newspaperName)}</news:name>
        <news:language>${escapeXml(config.languageCode)}</news:language>
      </news:publication>
      <news:publication_date>${pubDateIso}</news:publication_date>
      <news:title>${escapeXml(article.headline)}</news:title>
    </news:news>
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urlNodes}
</urlset>`;
}

/**
 * Formats a one-click WhatsApp broadcast share link with headline, dateline, summary, and canonical URL.
 */
export function formatWhatsAppShareUrl(article: Article, baseUrl: string): string {
  const cleanBase = baseUrl.replace(/\/$/, '');
  const articleUrl = `${cleanBase}/?article=${encodeURIComponent(article.slug)}`;
  const text = `*${article.headline}*\n📍 ${article.cityDateline} | परिवर्तन का दौर (RNI: UPHIN47157)\n\n${article.summary}\n\nपूरी खबर पढ़ें: ${articleUrl}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/**
 * Validates Admin CMS Article Publisher form inputs.
 */
export function validateArticleInput(input: {
  headline?: string;
  cityDateline?: string;
  authorName?: string;
  summary?: string;
  contentRaw?: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!input.headline || input.headline.trim().length < 5) {
    errors.push('कृपया कम से कम 5 अक्षरों का मुख्य शीर्षक (Headline) दर्ज करें।');
  }
  if (!input.cityDateline || input.cityDateline.trim().length < 2) {
    errors.push('कृपया शहर / डेटलाइन (City Dateline) दर्ज करें (जैसे: मुरादाबाद, लखनऊ)।');
  }
  if (!input.authorName || input.authorName.trim().length < 2) {
    errors.push('कृपया लेखक / संवाददाता का नाम दर्ज करें।');
  }
  if (!input.summary || input.summary.trim().length < 15) {
    errors.push('कृपया एसईओ मेटा विवरण (Summary/Excerpt) कम से कम 15 अक्षरों में लिखें।');
  }
  if (!input.contentRaw || input.contentRaw.trim().length < 30) {
    errors.push('कृपया समाचार की पूर्ण सामग्री (Full Article Content) दर्ज करें।');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
