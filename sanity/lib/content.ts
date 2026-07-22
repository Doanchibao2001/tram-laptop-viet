import "server-only";

import type { PortableTextBlock } from "next-sanity";
import type { NewsArticle, NewsSection } from "@/app/tin-tuc/news-data";
import { newsArticles as fallbackNewsArticles } from "@/app/tin-tuc/news-data";
import { fallbackProducts, fallbackSiteSettings } from "../fallback";
import type { Product, SiteSettings, StoreLocation } from "../types";
import { client } from "./client";
import { urlFor } from "./image";
import {
  NEWS_ARTICLE_QUERY,
  NEWS_ARTICLES_QUERY,
  PRODUCTS_QUERY,
  SITE_SETTINGS_QUERY,
} from "./queries";

// Published content is the source of truth. Avoid retaining build-time data in
// Vercel when a Sanity webhook or environment secret is not configured yet.
const fetchOptions = { cache: "no-store" } as const;

type ImageSource = Parameters<typeof urlFor>[0];

type SanityProductRecord = {
  _id?: string;
  name?: unknown;
  priceValue?: unknown;
  price?: unknown;
  compareAtPrice?: unknown;
  categoryValue?: unknown;
  imageSource?: ImageSource | null;
  imageAlt?: unknown;
  availability?: unknown;
  promotionLevel?: unknown;
};

type SanitySiteSettingsRecord = {
  siteName?: unknown;
  logoSource?: ImageSource | null;
  logoAlt?: unknown;
  hotline?: unknown;
  hotlineDisplay?: unknown;
  zaloUrl?: unknown;
  heroEyebrow?: unknown;
  heroTitle?: unknown;
  heroAccent?: unknown;
  heroDescription?: unknown;
  heroImageSource?: ImageSource | null;
  heroImageAlt?: unknown;
  socialProof?: unknown;
  primaryCtaLabel?: unknown;
  secondaryCtaLabel?: unknown;
  services?: unknown;
  processSteps?: unknown;
  homepageSeoHeading?: unknown;
  homepageSeoParagraphs?: unknown;
  faqs?: unknown;
  consultHeading?: unknown;
  consultDescription?: unknown;
  popupHeadline?: unknown;
  popupDescription?: unknown;
  popupPrimaryLabel?: unknown;
  popupSecondaryLabel?: unknown;
  addresses?: unknown;
  footerDescription?: unknown;
  seoTitle?: unknown;
  seoDescription?: unknown;
  seoImageSource?: ImageSource | null;
  seoImageAlt?: unknown;
  seoNoIndex?: unknown;
  seoKeywords?: unknown;
} | null;

type SanityStoreLocation = {
  name?: unknown;
  address?: unknown;
  mapUrl?: unknown;
  hours?: unknown;
};

type SanityNewsSection = {
  id?: unknown;
  heading?: unknown;
  paragraphs?: unknown;
  bullets?: unknown;
};

type SanityNewsRecord = {
  _id?: string;
  slug?: unknown;
  title?: unknown;
  description?: unknown;
  category?: unknown;
  publishedAt?: unknown;
  updatedAt?: unknown;
  authorName?: unknown;
  readTime?: unknown;
  imageSource?: ImageSource | null;
  imageAlt?: unknown;
  keywords?: unknown;
  seoTitle?: unknown;
  seoDescription?: unknown;
  seoImageSource?: ImageSource | null;
  seoImageAlt?: unknown;
  seoNoIndex?: unknown;
  body?: unknown;
  sections?: unknown;
};

function nonEmptyString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.map(nonEmptyString).filter((item): item is string => Boolean(item))
    : [];
}

function titledItems(value: unknown): { title: string; description: string }[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as { title?: unknown; description?: unknown };
    const title = nonEmptyString(record.title);
    const description = nonEmptyString(record.description);
    return title && description ? [{ title, description }] : [];
  });
}

function faqItems(value: unknown): { question: string; answer: string }[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as { question?: unknown; answer?: unknown };
    const question = nonEmptyString(record.question);
    const answer = nonEmptyString(record.answer);
    return question && answer ? [{ question, answer }] : [];
  });
}

function normalizeVietnamPhone(value: unknown):
  | { local: string; e164: string }
  | undefined {
  const digits = nonEmptyString(value)?.replace(/\D/g, "");
  if (!digits) return undefined;

  const local =
    /^84\d{9}$/.test(digits)
      ? `0${digits.slice(2)}`
      : /^0\d{9}$/.test(digits)
        ? digits
        : /^\d{9}$/.test(digits)
          ? `0${digits}`
          : undefined;

  return local
    ? { local, e164: `+84${local.slice(1)}` }
    : undefined;
}

function formatPhone(phone: string): string {
  const match = phone.match(/^(\d{4})(\d{3})(\d{3})$/);
  return match ? `${match[1]}.${match[2]}.${match[3]}` : phone;
}

function formatPrice(value: unknown): string {
  const text = nonEmptyString(value);
  if (text) return text;
  if (typeof value === "number" && Number.isFinite(value)) {
    return `${new Intl.NumberFormat("vi-VN").format(value)}₫`;
  }
  return "Liên hệ";
}

function safeHttpUrl(value: unknown): string | undefined {
  const text = nonEmptyString(value);
  if (!text) return undefined;
  try {
    const url = new URL(text);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

function imageUrl(
  source: ImageSource | null | undefined,
  width: number,
  height?: number,
): string | undefined {
  if (!source) return undefined;
  try {
    const image = urlFor(source).width(width).auto("format");
    return height
      ? image.height(height).fit("crop").url()
      : image.fit("max").url();
  } catch {
    return undefined;
  }
}

function mapStoreLocation(value: SanityStoreLocation): StoreLocation | null {
  const name = nonEmptyString(value.name);
  const address = nonEmptyString(value.address);
  const hours = nonEmptyString(value.hours);
  if (!name || !address || !hours) return null;
  const mapUrl = safeHttpUrl(value.mapUrl);
  return {
    name,
    address,
    hours,
    ...(mapUrl ? { mapUrl } : {}),
  };
}

function datePart(value: unknown): string {
  const text = nonEmptyString(value);
  return text && /^\d{4}-\d{2}-\d{2}/.test(text)
    ? text.slice(0, 10)
    : new Date().toISOString().slice(0, 10);
}

function dateLabel(value: string): string {
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function blockText(block: PortableTextBlock): string {
  if (!Array.isArray(block.children)) return "";
  return block.children
    .map((child) =>
      typeof child === "object" &&
      child !== null &&
      "text" in child &&
      typeof child.text === "string"
        ? child.text
        : "",
    )
    .join("");
}

function estimateReadTime(body: PortableTextBlock[]): string {
  const words = body
    .map(blockText)
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 220))} phút đọc`;
}

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function mapSection(value: SanityNewsSection, index: number): NewsSection | null {
  const heading = nonEmptyString(value.heading);
  if (!heading) return null;
  const paragraphs = Array.isArray(value.paragraphs)
    ? value.paragraphs.map(nonEmptyString).filter((item): item is string => Boolean(item))
    : [];
  const bullets = Array.isArray(value.bullets)
    ? value.bullets.map(nonEmptyString).filter((item): item is string => Boolean(item))
    : [];

  return {
    id: nonEmptyString(value.id) ?? slugify(heading) ?? `section-${index + 1}`,
    heading,
    paragraphs,
    ...(bullets.length ? { bullets } : {}),
  };
}

function mapNewsArticle(record: SanityNewsRecord): NewsArticle | null {
  const slug = nonEmptyString(record.slug);
  const title = nonEmptyString(record.title);
  if (!slug || !title) return null;
  const publishedAt = datePart(record.publishedAt);
  const sections = Array.isArray(record.sections)
    ? record.sections
        .map((section, index) => mapSection(section as SanityNewsSection, index))
        .filter((section): section is NewsSection => Boolean(section))
    : [];
  const body = Array.isArray(record.body)
    ? (record.body as PortableTextBlock[])
    : [];

  return {
    slug,
    title,
    description: nonEmptyString(record.description) ?? title,
    category: nonEmptyString(record.category) ?? "Tin tức",
    publishedAt,
    publishedLabel: dateLabel(publishedAt),
    updatedAt: datePart(record.updatedAt),
    authorName: nonEmptyString(record.authorName) ?? "Trạm Laptop Việt",
    readTime:
      nonEmptyString(record.readTime) ??
      (body.length ? estimateReadTime(body) : "5 phút đọc"),
    image: imageUrl(record.imageSource, 1600) ?? "/tram-laptop-viet/brand-banner.jpg",
    imageAlt: nonEmptyString(record.imageAlt) ?? title,
    keywords: Array.isArray(record.keywords)
      ? record.keywords.map(nonEmptyString).filter((item): item is string => Boolean(item))
      : [],
    seoTitle: nonEmptyString(record.seoTitle),
    seoDescription: nonEmptyString(record.seoDescription),
    seoImage: imageUrl(record.seoImageSource, 1200, 630),
    seoImageAlt:
      nonEmptyString(record.seoImageAlt) ??
      nonEmptyString(record.imageAlt) ??
      title,
    seoNoIndex: record.seoNoIndex === true,
    sections,
    ...(body.length ? { body } : {}),
  };
}

export async function getProducts(): Promise<Product[]> {
  try {
    const records = await client.fetch<SanityProductRecord[]>(
      PRODUCTS_QUERY,
      {},
      fetchOptions,
    );
    const products = records
      .map((record) => {
        const name = nonEmptyString(record.name);
        if (!name) return null;
        const availability =
          record.availability === "preorder" ||
          record.availability === "outOfStock"
            ? record.availability
            : "inStock";
        const promotionLevel =
          record.promotionLevel === "featured" ? "featured" : "standard";
        const compareAtPrice =
          typeof record.compareAtPrice === "number" &&
          Number.isFinite(record.compareAtPrice) &&
          typeof record.price === "number" &&
          record.compareAtPrice > record.price
            ? formatPrice(record.compareAtPrice)
            : undefined;
        return {
          id: nonEmptyString(record._id) ?? `sanity-${slugify(name)}`,
          name,
          price: formatPrice(record.priceValue),
          ...(compareAtPrice ? { compareAtPrice } : {}),
          category: nonEmptyString(record.categoryValue) ?? "Linh kiện",
          image:
            imageUrl(record.imageSource, 720) ??
            "/tram-laptop-viet/service-banner.jpg",
          imageAlt: nonEmptyString(record.imageAlt) ?? name,
          availability,
          promotionLevel,
        } satisfies Product;
      })
      .filter((product): product is Product => Boolean(product));
    return products;
  } catch (error) {
    console.warn("Sanity products unavailable; using local fallback.", error);
    return fallbackProducts;
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const record = await client.fetch<SanitySiteSettingsRecord>(
      SITE_SETTINGS_QUERY,
      {},
      fetchOptions,
    );
    if (!record) return fallbackSiteSettings;
    const phone =
      normalizeVietnamPhone(record.hotline) ?? {
        local: fallbackSiteSettings.hotline,
        e164: fallbackSiteSettings.hotlineE164,
      };
    const addresses = Array.isArray(record.addresses)
      ? record.addresses
          .map((address) => mapStoreLocation(address as SanityStoreLocation))
          .filter((address): address is StoreLocation => Boolean(address))
      : [];
    const services = titledItems(record.services);
    const processSteps = titledItems(record.processSteps);
    const homepageSeoParagraphs = stringArray(record.homepageSeoParagraphs);
    const faqs = faqItems(record.faqs);
    const seoKeywords = stringArray(record.seoKeywords);
    return {
      siteName: nonEmptyString(record.siteName) ?? fallbackSiteSettings.siteName,
      logo: imageUrl(record.logoSource, 360) ?? fallbackSiteSettings.logo,
      logoAlt: nonEmptyString(record.logoAlt) ?? fallbackSiteSettings.logoAlt,
      hotline: phone.local,
      hotlineDisplay: formatPhone(phone.local),
      hotlineE164: phone.e164,
      zaloUrl:
        safeHttpUrl(record.zaloUrl) ?? `https://zalo.me/${phone.local}`,
      heroEyebrow:
        nonEmptyString(record.heroEyebrow) ?? fallbackSiteSettings.heroEyebrow,
      heroTitle:
        nonEmptyString(record.heroTitle) ?? fallbackSiteSettings.heroTitle,
      heroAccent:
        nonEmptyString(record.heroAccent) ?? fallbackSiteSettings.heroAccent,
      heroDescription:
        nonEmptyString(record.heroDescription) ??
        fallbackSiteSettings.heroDescription,
      heroImage:
        imageUrl(record.heroImageSource, 1600) ??
        fallbackSiteSettings.heroImage,
      heroImageAlt:
        nonEmptyString(record.heroImageAlt) ??
        fallbackSiteSettings.heroImageAlt,
      socialProof:
        nonEmptyString(record.socialProof) ?? fallbackSiteSettings.socialProof,
      primaryCtaLabel:
        nonEmptyString(record.primaryCtaLabel) ??
        fallbackSiteSettings.primaryCtaLabel,
      secondaryCtaLabel:
        nonEmptyString(record.secondaryCtaLabel) ??
        fallbackSiteSettings.secondaryCtaLabel,
      services: services.length ? services : fallbackSiteSettings.services,
      processSteps: processSteps.length ? processSteps : fallbackSiteSettings.processSteps,
      homepageSeoHeading: nonEmptyString(record.homepageSeoHeading) ?? fallbackSiteSettings.homepageSeoHeading,
      homepageSeoParagraphs: homepageSeoParagraphs.length ? homepageSeoParagraphs : fallbackSiteSettings.homepageSeoParagraphs,
      faqs: faqs.length ? faqs : fallbackSiteSettings.faqs,
      consultHeading: nonEmptyString(record.consultHeading) ?? fallbackSiteSettings.consultHeading,
      consultDescription: nonEmptyString(record.consultDescription) ?? fallbackSiteSettings.consultDescription,
      popupHeadline:
        nonEmptyString(record.popupHeadline) ??
        fallbackSiteSettings.popupHeadline,
      popupDescription:
        nonEmptyString(record.popupDescription) ??
        fallbackSiteSettings.popupDescription,
      popupPrimaryLabel:
        nonEmptyString(record.popupPrimaryLabel) ??
        fallbackSiteSettings.popupPrimaryLabel,
      popupSecondaryLabel:
        nonEmptyString(record.popupSecondaryLabel) ??
        fallbackSiteSettings.popupSecondaryLabel,
      addresses: addresses.length ? addresses : fallbackSiteSettings.addresses,
      footerDescription:
        nonEmptyString(record.footerDescription) ??
        fallbackSiteSettings.footerDescription,
      seoTitle: nonEmptyString(record.seoTitle) ?? fallbackSiteSettings.seoTitle,
      seoDescription: nonEmptyString(record.seoDescription) ?? fallbackSiteSettings.seoDescription,
      seoImage: imageUrl(record.seoImageSource, 1200, 630) ?? fallbackSiteSettings.seoImage,
      seoImageAlt: nonEmptyString(record.seoImageAlt) ?? fallbackSiteSettings.seoImageAlt,
      seoNoIndex: record.seoNoIndex === true,
      seoKeywords: seoKeywords.length ? seoKeywords : fallbackSiteSettings.seoKeywords,
    };
  } catch (error) {
    console.warn("Sanity site settings unavailable; using local fallback.", error);
    return fallbackSiteSettings;
  }
}

export async function getNewsArticles(): Promise<NewsArticle[]> {
  try {
    const records = await client.fetch<SanityNewsRecord[]>(
      NEWS_ARTICLES_QUERY,
      {},
      fetchOptions,
    );
    const articles = records
      .map(mapNewsArticle)
      .filter((article): article is NewsArticle => Boolean(article));
    return articles;
  } catch (error) {
    console.warn("Sanity news unavailable; using local fallback.", error);
    return fallbackNewsArticles;
  }
}

export async function getNewsArticleBySlug(
  slug: string,
): Promise<NewsArticle | undefined> {
  try {
    const record = await client.fetch<SanityNewsRecord | null>(
      NEWS_ARTICLE_QUERY,
      { slug },
      fetchOptions,
    );
    return record ? mapNewsArticle(record) ?? undefined : undefined;
  } catch (error) {
    console.warn(`Sanity article "${slug}" unavailable; using local fallback.`, error);
    return fallbackNewsArticles.find((item) => item.slug === slug);
  }
}
