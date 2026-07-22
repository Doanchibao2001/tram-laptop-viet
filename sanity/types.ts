export type Product = {
  id: string;
  name: string;
  price: string;
  compareAtPrice?: string;
  category: string;
  image: string;
  imageAlt: string;
  availability: "inStock" | "preorder" | "outOfStock";
  promotionLevel: "standard" | "featured";
};

export type StoreLocation = {
  name: string;
  address: string;
  mapUrl?: string;
  hours: string;
};

export type ServiceCard = { title: string; description: string };
export type ProcessStep = { title: string; description: string };
export type FaqItem = { question: string; answer: string };

export type SiteSettings = {
  siteName: string;
  logo: string;
  logoAlt: string;
  hotline: string;
  hotlineDisplay: string;
  hotlineE164: string;
  zaloUrl: string;
  heroEyebrow: string;
  heroTitle: string;
  heroAccent: string;
  heroDescription: string;
  heroImage: string;
  heroImageAlt: string;
  socialProof: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  services: ServiceCard[];
  processSteps: ProcessStep[];
  homepageSeoHeading: string;
  homepageSeoParagraphs: string[];
  faqs: FaqItem[];
  consultHeading: string;
  consultDescription: string;
  popupHeadline: string;
  popupDescription: string;
  popupPrimaryLabel: string;
  popupSecondaryLabel: string;
  addresses: StoreLocation[];
  footerDescription: string;
  seoTitle: string;
  seoDescription: string;
  seoImage: string;
  seoImageAlt: string;
  seoNoIndex: boolean;
  seoKeywords: string[];
};
