import { defineQuery } from "next-sanity";

export const PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" && defined(title)]
  | order(coalesce(sortOrder, 9999) asc, _createdAt desc) {
    _id,
    "name": title,
    pricingMode,
    price,
    compareAtPrice,
    availability,
    promotionLevel,
    "priceValue": select(
      pricingMode == "contact" => "Liên hệ",
      defined(price) => price,
      "Liên hệ"
    ),
    "categoryValue": coalesce(category->title, "Linh kiện"),
    "imageSource": mainImage,
    "imageAlt": coalesce(mainImage.alt, title)
  }
`);

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_id == "siteSettings" && _type == "siteSettings"][0] {
    hotline,
    hotlineDisplay,
    zaloUrl,
    heroEyebrow,
    "heroTitle": heroHeadline,
    "heroAccent": heroSubheadline,
    heroDescription,
    "heroImageSource": heroImage,
    "heroImageAlt": coalesce(heroImage.alt, heroHeadline),
    socialProof,
    primaryCtaLabel,
    secondaryCtaLabel,
    popupHeadline,
    popupDescription,
    popupPrimaryLabel,
    popupSecondaryLabel,
    addresses[] {
      name,
      address,
      mapUrl,
      hours
    },
    footerDescription
  }
`);

const NEWS_PROJECTION = `
  _id,
  "slug": slug.current,
  title,
  "description": coalesce(excerpt, description),
  "category": coalesce(category->title, "Tin tức"),
  "publishedAt": coalesce(publishedAt, _createdAt),
  "updatedAt": coalesce(updatedAt, _updatedAt, publishedAt, _createdAt),
  authorName,
  readTime,
  "imageSource": coalesce(coverImage, mainImage, image),
  "imageAlt": coalesce(coverImage.alt, mainImage.alt, image.alt, title),
  "keywords": coalesce(keywords, []),
  "seoTitle": seo.title,
  "seoDescription": seo.description,
  "seoImageSource": seo.image,
  "seoImageAlt": coalesce(seo.image.alt, coverImage.alt, title),
  "seoNoIndex": coalesce(seo.noIndex, false),
  "body": coalesce(body, []),
  "sections": coalesce(sections[] {
    "id": coalesce(id, anchor),
    heading,
    "paragraphs": coalesce(paragraphs, []),
    "bullets": coalesce(bullets, [])
  }, [])
`;

export const NEWS_ARTICLES_QUERY = defineQuery(`
  *[_type in ["article", "post", "newsArticle"] && defined(slug.current)]
  | order(coalesce(publishedAt, _createdAt) desc) {
    ${NEWS_PROJECTION}
  }
`);

export const NEWS_ARTICLE_QUERY = defineQuery(`
  *[_type in ["article", "post", "newsArticle"] && slug.current == $slug][0] {
    ${NEWS_PROJECTION}
  }
`);
