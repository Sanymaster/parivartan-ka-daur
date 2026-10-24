import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateSlug,
  filterArticles,
  buildNewsMediaOrganizationSchema,
  buildNewsArticleSchema,
  generateStandardSitemapXml,
  generateGoogleNewsSitemapXml,
  formatWhatsAppShareUrl,
  validateArticleInput,
} from './seoAndNewsLogic';
import { siteConfig } from '../config/siteConfig';
import { Article } from '../types/newspaper';

const mockArticles: Article[] = [
  {
    id: 'art-1',
    headline: 'नागरिकों की समस्याओं का समयबद्ध समाधान होना चाहिए: योगी आदित्यनाथ',
    subHeadline: 'मिशन कर्मयोगी के तहत दो दिवसीय साधना श्रृंखला का शुभारंभ',
    slug: 'yogi-adityanath-mission-karmayogi-lucknow',
    category: 'state-up-uk',
    cityDateline: 'लखनऊ',
    authorName: 'पवन अग्रवाल',
    authorRole: 'मुख्य संपादक (Chief Editor)',
    summary: 'मुख्यमंत्री योगी आदित्यनाथ ने लोकभवन में मिशन कर्मयोगी के अंतर्गत साधना श्रृंखला का शुभारंभ किया।',
    content: ['उत्तर प्रदेश के मुख्यमंत्री योगी आदित्यनाथ ने कहा कि समस्याओं का समयबद्ध समाधान होना चाहिए।'],
    imageUrl: '/assets/news/yogi-karmayogi.jpg',
    imageCaption: 'लखनऊ में मिशन कर्मयोगी कार्यशाला का शुभारंभ करते मुख्यमंत्री।',
    publishedAt: '2026-10-24T06:30:00.000Z',
    updatedAt: '2026-10-24T07:15:00.000Z',
    isBreaking: true,
    isFeaturedLead: true,
    pageNumber: 1,
    readTimeMinutes: 4,
  },
  {
    id: 'art-2',
    headline: 'एमडीए ने पंजीकृत डाक से भेजी रद्दी: आरटीआई जवाब पर उठे सवाल',
    slug: 'mda-moradabad-registered-post-rti-investigation',
    category: 'local-moradabad',
    cityDateline: 'मुरादाबाद',
    authorName: 'विशेष संवाददाता',
    authorRole: 'वरिष्ठ संवाददाता',
    summary: 'मुरादाबाद विकास प्राधिकरण द्वारा आरटीआई के जवाब में भेजे गए दस्तावेजों की पड़ताल।',
    content: ['मुरादाबाद शहर में सूचना के अधिकार के तहत मांगे गए जवाब में संकलित नहीं है की पर्चियां भेजी गईं।'],
    imageUrl: '/assets/news/mda-moradabad-rti.jpg',
    imageCaption: 'मुरादाबाद विकास प्राधिकरण कार्यालय।',
    publishedAt: '2026-10-20T06:30:00.000Z',
    updatedAt: '2026-10-20T06:30:00.000Z',
    isBreaking: false,
    isFeaturedLead: false,
    pageNumber: 8,
    readTimeMinutes: 5,
  },
];

test('generateSlug creates clean URL-friendly slugs for Hindi and English text', () => {
  const slug = generateSlug('Moradabad News: परिवर्तन का दौर! 2026');
  assert.equal(slug, 'moradabad-news-परिवर्तन-का-दौर-2026');
});

test('filterArticles filters by category and keyword accurately', () => {
  const localOnly = filterArticles(mockArticles, 'local-moradabad', '');
  assert.equal(localOnly.length, 1);
  assert.equal(localOnly[0].id, 'art-2');

  const searchMatch = filterArticles(mockArticles, 'all', 'कर्मयोगी');
  assert.equal(searchMatch.length, 1);
  assert.equal(searchMatch[0].id, 'art-1');
});

test('buildNewsMediaOrganizationSchema includes PRGI registration UPHIN47157 and address', () => {
  const schema = buildNewsMediaOrganizationSchema(siteConfig);
  assert.equal(schema['@type'], 'NewsMediaOrganization');
  assert.equal(schema.identifier.value, 'UPHIN47157');
  assert.equal(schema.address.postalCode, '244001');
});

test('buildNewsArticleSchema produces Google News compliant NewsArticle JSON-LD', () => {
  const schema = buildNewsArticleSchema(mockArticles[0], siteConfig);
  assert.equal(schema['@type'], 'NewsArticle');
  assert.equal(schema.author.name, 'पवन अग्रवाल');
  assert.equal(schema.publisher.identifier, 'UPHIN47157');
  assert.ok(schema.datePublished.endsWith('Z'));
});

test('generateGoogleNewsSitemapXml includes only articles within 48 hours of reference timestamp', () => {
  const xml = generateGoogleNewsSitemapXml(
    mockArticles,
    siteConfig,
    '2026-10-24T12:00:00.000Z'
  );
  assert.ok(xml.includes('xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"'));
  assert.ok(xml.includes('yogi-adityanath-mission-karmayogi-lucknow'));
  assert.ok(!xml.includes('mda-moradabad-registered-post-rti-investigation'));
});

test('generateStandardSitemapXml includes all articles and static compliance pages', () => {
  const xml = generateStandardSitemapXml(mockArticles, siteConfig.domainUrl);
  assert.ok(xml.includes('yogi-adityanath-mission-karmayogi-lucknow'));
  assert.ok(xml.includes('mda-moradabad-registered-post-rti-investigation'));
  assert.ok(xml.includes('?trust=editorial-policy'));
});

test('formatWhatsAppShareUrl encodes headline, dateline, and canonical link', () => {
  const url = formatWhatsAppShareUrl(mockArticles[0], 'https://parivartankadaur.in');
  assert.ok(url.startsWith('https://wa.me/?text='));
  assert.ok(decodeURIComponent(url).includes('UPHIN47157'));
});

test('validateArticleInput catches missing required fields and passes valid article', () => {
  const invalid = validateArticleInput({ headline: 'छोटा' });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.length >= 3);

  const valid = validateArticleInput({
    headline: 'मुरादाबाद में दीपोत्सव और स्वच्छता अभियान की भव्य तैयारी',
    cityDateline: 'मुरादाबाद',
    authorName: 'पवन अग्रवाल',
    summary: 'मुरादाबाद नगर निगम और प्रशासन द्वारा त्योहारों के मद्देनजर विशेष अभियान चलाया गया।',
    contentRaw: 'मुरादाबाद में आगामी त्योहारों को शांतिपूर्ण और सुरक्षित माहौल में संपन्न कराने के लिए प्रशासन मुस्तैद है।',
  });
  assert.equal(valid.valid, true);
});
