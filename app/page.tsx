import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import LeadSubmitSuccessOverlay from "./LeadSubmitSuccessOverlay";
import MobileMotionV3 from "./MobileMotionV3";
import { getProducts, getSiteSettings } from "@/sanity/lib/content";
import { getSiteFaviconUrl } from "@/sanity/lib/site-metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const [favicon, settings] = await Promise.all([getSiteFaviconUrl(), getSiteSettings()]);
  const title = settings.seoTitle;
  const description = settings.seoDescription;

  return {
    title: { absolute: title },
    description,
    keywords: settings.seoKeywords,
    applicationName: settings.siteName,
    alternates: { canonical: "/" },
    icons: {
      icon: [{ url: favicon, sizes: "any" }],
      shortcut: [{ url: favicon }],
      apple: [{ url: settings.logo, sizes: "180x180" }],
    },
    robots: {
      index: !settings.seoNoIndex,
      follow: true,
      googleBot: {
        index: !settings.seoNoIndex,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "vi_VN",
      url: "/",
      siteName: settings.siteName,
      title,
      description,
      images: [{
        url: settings.seoImage,
        width: 1200,
        height: 630,
        alt: settings.seoImageAlt,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [settings.seoImage],
    },
  };
}

export default async function Home() {
  const [products, siteSettings] = await Promise.all([
    getProducts(),
    getSiteSettings(),
  ]);

  return (
    <>
      <LeadSubmitSuccessOverlay />
      <MobileMotionV3 />
      <HomeClient products={products} siteSettings={siteSettings} />
    </>
  );
}
