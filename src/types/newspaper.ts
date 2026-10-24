export type CategoryId =
  | 'all'
  | 'local-moradabad'
  | 'state-up-uk'
  | 'national'
  | 'editorial'
  | 'special-column';

export interface CategoryInfo {
  id: CategoryId;
  labelHi: string;
  labelEn: string;
  description: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'all',
    labelHi: 'मुख्य पृष्ठ',
    labelEn: 'Home',
    description: 'प्रमुख खबरें, ताज़ा समाचार और आज का सारांश',
  },
  {
    id: 'local-moradabad',
    labelHi: 'मुरादाबाद / महानगर',
    labelEn: 'Local City News',
    description: 'मुरादाबाद, मंडी चौक, रामपुर और मंडल की स्थानीय खबरें',
  },
  {
    id: 'state-up-uk',
    labelHi: 'उत्तर प्रदेश / उत्तराखंड',
    labelEn: 'State News',
    description: 'लखनऊ, देहरादून, शामली, कैराना, बागपत और राज्य समाचार',
  },
  {
    id: 'national',
    labelHi: 'राष्ट्रीय',
    labelEn: 'National',
    description: 'नई दिल्ली, केंद्र सरकार, रक्षा और राष्ट्रीय महत्व के समाचार',
  },
  {
    id: 'editorial',
    labelHi: 'संपादकीय एवं विचार',
    labelEn: 'Editorial & Opinion',
    description: 'गंभीर मंथन, विचार, दृष्टिकोण और प्रेरक कथाएं',
  },
  {
    id: 'special-column',
    labelHi: 'विशेष स्तंभ / पड़ताल',
    labelEn: 'Special Column',
    description: 'आरटीआई खुलासे, जनहित पड़ताल, स्वास्थ्य और विशेष रिपोर्ट',
  },
];

export interface Article {
  id: string;
  headline: string;
  subHeadline?: string;
  slug: string;
  category: Exclude<CategoryId, 'all'>;
  cityDateline: string;
  authorName: string;
  authorRole: string;
  summary: string;
  content: string[];
  highlights?: string[];
  imageUrl: string;
  imageCaption: string;
  publishedAt: string; // ISO 8601 string
  updatedAt: string;   // ISO 8601 string
  isBreaking: boolean;
  isFeaturedLead: boolean;
  pageNumber?: number;
  readTimeMinutes: number;
}

export interface EPaperPage {
  pageNumber: number;
  title: string;
  imageUrl: string;
}

export interface EPaperEdition {
  id: string;
  issueDate: string; // YYYY-MM-DD
  displayDateHi: string;
  editionTitle: string;
  cityEdition: string;
  volumeIssue: string;
  coverImageUrl: string;
  pdfUrl: string;
  pages: EPaperPage[];
}

export interface GrievanceSubmission {
  id: string;
  name: string;
  emailOrPhone: string;
  city: string;
  submissionType: 'news-tip' | 'correction-request' | 'grievance' | 'editorial-feedback';
  subject: string;
  message: string;
  articleRef?: string;
  createdAt: string;
  status: 'received' | 'under-review';
}

export type ActiveRoute =
  | { view: 'home'; category: CategoryId }
  | { view: 'article'; slug: string }
  | { view: 'epaper'; editionId?: string }
  | { view: 'admin' }
  | { view: 'trust'; page: 'about' | 'editorial-policy' | 'corrections-policy' | 'privacy-terms' | 'contact-grievance' };
