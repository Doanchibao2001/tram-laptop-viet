import "server-only";

import { defineQuery } from "next-sanity";
import { client } from "./client";
import { urlFor } from "./image";

const fallbackFavicon = "/tram-laptop-viet/logo-round.jpg";
const fetchOptions = { next: { revalidate: 60 } } as const;

const SITE_FAVICON_QUERY = defineQuery(`
  *[_id == "siteSettings" && _type == "siteSettings"][0] {
    "faviconSource": coalesce(favicon, logo)
  }
`);

type ImageSource = Parameters<typeof urlFor>[0];

type SanitySiteFaviconRecord = {
  faviconSource?: ImageSource | null;
} | null;

export async function getSiteFaviconUrl(): Promise<string> {
  try {
    const record = await client.fetch<SanitySiteFaviconRecord>(
      SITE_FAVICON_QUERY,
      {},
      fetchOptions,
    );

    if (!record?.faviconSource) return fallbackFavicon;

    return urlFor(record.faviconSource)
      .width(512)
      .height(512)
      .fit("crop")
      .auto("format")
      .url();
  } catch (error) {
    console.warn("Sanity favicon unavailable; using local fallback.", error);
    return fallbackFavicon;
  }
}
