import { useEffect } from 'react';
import { siteConfig } from '../config/siteConfig';
import { Article, ActiveRoute, CATEGORIES } from '../types/newspaper';
import {
  buildNewsArticleSchema,
  buildNewsMediaOrganizationSchema,
} from '../utils/seoAndNewsLogic';

interface SEOHeadProps {
  route: ActiveRoute;
  activeArticle?: Article | null;
}

export function SEOHead({ route, activeArticle }: SEOHeadProps) {
  useEffect(() => {
    const origin =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : siteConfig.domainUrl;

    let title = `${siteConfig.newspaperName} (${siteConfig.newspaperNameEn}) — ${siteConfig.subtitle} | RNI: ${siteConfig.prgiRegistrationNumber}`;
    let description = `${siteConfig.subtitle} '${siteConfig.newspaperName}' (RNI: ${siteConfig.prgiRegistrationNumber}) — ${siteConfig.headOfficeAddress}। मुरादाबाद, उत्तर प्रदेश, उत्तराखंड और देश-दुनिया की ताज़ा खबरें एवं दैनिक ई-पेपर।`;
    let canonicalUrl = `${origin}/`;
    let ogType = 'website';
    let ogImage = `${origin}/assets/epaper/page-1.jpg`;
    let structuredData: Record<string, unknown> = buildNewsMediaOrganizationSchema(siteConfig);

    if (route.view === 'article' && activeArticle) {
      title = `${activeArticle.headline} — ${siteConfig.newspaperName}`;
      description = activeArticle.summary;
      canonicalUrl = `${origin}/?article=${encodeURIComponent(activeArticle.slug)}`;
      ogType = 'article';
      ogImage = activeArticle.imageUrl.startsWith('http')
        ? activeArticle.imageUrl
        : `${origin}${activeArticle.imageUrl}`;
      structuredData = buildNewsArticleSchema(activeArticle, siteConfig);
    } else if (route.view === 'home' && route.category !== 'all') {
      const cat = CATEGORIES.find((c) => c.id === route.category);
      if (cat) {
        title = `${cat.labelHi} (${cat.labelEn}) — ${siteConfig.newspaperName}`;
        description = `${cat.description} | ${siteConfig.newspaperName} (RNI: ${siteConfig.prgiRegistrationNumber})`;
        canonicalUrl = `${origin}/?category=${encodeURIComponent(cat.id)}`;
      }
    } else if (route.view === 'epaper') {
      title = `दैनिक ई-पेपर आर्काइव (E-Paper Portal) — ${siteConfig.newspaperName}`;
      description = `${siteConfig.newspaperName} का दैनिक डिजिटल प्रिंट संस्करण (E-Paper PDF) पढ़ें और डाउनलोड करें। मुरादाबाद संस्करण, RNI: ${siteConfig.prgiRegistrationNumber}।`;
      canonicalUrl = `${origin}/?view=epaper`;
    } else if (route.view === 'admin') {
      title = `संपादकीय सीएमएस डैशबोर्ड (Admin CMS) — ${siteConfig.newspaperName}`;
      description = `${siteConfig.newspaperName} संपादकीय प्रकाशन, ई-पेपर प्रबंधन और गूगल न्यूज़ एसईओ साइटमैप टूल।`;
      canonicalUrl = `${origin}/?view=admin`;
    } else if (route.view === 'trust') {
      const trustTitles: Record<string, string> = {
        about: 'हमारे बारे में एवं मास्टहेड (About Us & Masthead)',
        'editorial-policy': 'संपादकीय एवं तथ्य-जांच नीति (Editorial & Fact-Checking Policy)',
        'corrections-policy': 'सुधार एवं संशोधन नीति (Corrections Policy)',
        'privacy-terms': 'गोपनीयता नीति एवं शर्तें (Privacy Policy & Terms of Use)',
        'contact-grievance': 'संपर्क करें एवं शिकायत निवारण (Contact Us & Grievance Redressal)',
      };
      title = `${trustTitles[route.page] || 'Trust & Compliance'} — ${siteConfig.newspaperName}`;
      canonicalUrl = `${origin}/?trust=${encodeURIComponent(route.page)}`;
    }

    document.title = title;

    const setMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
      let element = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMetaTag('name', 'description', description);
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:site_name', siteConfig.newspaperName);
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);

    let canonicalLink = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    let scriptTag = document.head.querySelector(
      'script#pkd-jsonld-schema'
    ) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'pkd-jsonld-schema';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData, null, 2);
  }, [route, activeArticle]);

  return null;
}
