/**
 * CENTRAL BRANDING & PUBLICATION CONFIGURATION
 * Edit these values to update the newspaper identity, PRGI/RNI registration,
 * masthead credentials, contact information, and SEO structured data across the entire portal.
 */

export interface SiteConfig {
  newspaperName: string;
  newspaperNameEn: string;
  subtitle: string;
  tagline: string;
  editorInChief: string;
  editorInChiefEn: string;
  ownerPublisherPrinter: string;
  legalAdvisors: string[];
  prgiRegistrationNumber: string;
  headOfficeAddress: string;
  headOfficeCity: string;
  headOfficeState: string;
  headOfficePin: string;
  printingPressAddress: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  domainUrl: string;
  editionName: string;
  volumeIssue: string;
  priceDisplay: string;
  establishedYear: string;
  jurisdictionNotice: string;
  languageCode: string;
}

export const siteConfig: SiteConfig = {
  // Newspaper Name (Hindi & English)
  newspaperName: "परिवर्तन का दौर",
  newspaperNameEn: "Parivartan Ka Daur",
  subtitle: "राष्ट्रीय हिंदी दैनिक समाचार पत्र",
  // Official Masthead Tagline
  tagline: "...कलम चलती है जनता की आवाज लिखता हूँ, भले ही मैं कड़वे अल्फाज लिखता हूँ",
  // Editor-in-Chief & Imprint Details (from Page 4 Masthead Imprint)
  editorInChief: "पवन अग्रवाल",
  editorInChiefEn: "Pawan Agarwal",
  ownerPublisherPrinter: "सरला अग्रवाल",
  legalAdvisors: ["राजीव गोयल एडवोकेट", "वैभव अग्रवाल एडवोकेट"],
  // PRGI / RNI Registration Number
  prgiRegistrationNumber: "UPHIN47157",
  // Head Office Address
  headOfficeAddress: "जीलाल स्ट्रीट, मंडी चौक, मुरादाबाद, उत्तर प्रदेश, पिन कोड - 244001",
  headOfficeCity: "मुरादाबाद (Moradabad)",
  headOfficeState: "उत्तर प्रदेश (Uttar Pradesh)",
  headOfficePin: "244001",
  // Printing Press Address
  printingPressAddress:
    "सपोर्ट फाउंडेशन प्रिंटिंग सर्विसेज, रॉयल प्रिंटर एंड ट्रेडर, दुकान संख्या 2, पहाड़ी गेट रोड, मोहल्ला सतून संग, रामपुर, उत्तर प्रदेश",
  // Official Contact Email & Phone
  contactEmail: "parivartankadoor@gmail.com",
  contactPhone: "+91-8958829272",
  whatsappNumber: "918958829272",
  // Official Domain URL
  domainUrl: "https://parivartankadaur.in",
  // Edition & Issue Metadata
  editionName: "मुरादाबाद संस्करण (Moradabad Edition)",
  volumeIssue: "वर्ष-1, अंक-131",
  priceDisplay: "मूल्य: 5 रु.",
  establishedYear: "2025",
  jurisdictionNotice:
    "विवाद की दशा में समस्त वाद न्यायिक क्षेत्र मुरादाबाद में दायर होंगे। समाचार से संबंधित समस्त उत्तरदायित्व सम्पादक का होगा।",
  languageCode: "hi",
};
