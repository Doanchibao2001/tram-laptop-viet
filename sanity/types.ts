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

export type SiteSettings = {
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
  popupHeadline: string;
  popupDescription: string;
  popupPrimaryLabel: string;
  popupSecondaryLabel: string;
  addresses: StoreLocation[];
  footerDescription: string;
};
