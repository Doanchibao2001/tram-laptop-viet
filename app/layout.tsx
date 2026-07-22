import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { getSiteFaviconUrl } from "@/sanity/lib/site-metadata";
import { siteUrl } from "@/lib/site-url";
import AnalyticsTracker from "./AnalyticsTracker";
import { getSiteSettings } from "@/sanity/lib/content";
import "./globals.css";
import "./process-fix.css";
import "./typography-fix.css";
import "./modern-ui.css";
import "./header-brand-fix.css";
import "./palette-soft.css";

const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION;
export async function generateMetadata(): Promise<Metadata> {
  const [favicon, settings] = await Promise.all([getSiteFaviconUrl(), getSiteSettings()]);
  const title = settings.seoTitle;
  const description = settings.seoDescription;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: "%s | Trạm Laptop Việt",
    },
    description,
    keywords: settings.seoKeywords,
    applicationName: settings.siteName,
    authors: [{ name: settings.siteName, url: siteUrl }],
    creator: settings.siteName,
    publisher: settings.siteName,
    category: "Dịch vụ sửa chữa và nâng cấp laptop",
    verification: googleSiteVerification ? { google: googleSiteVerification } : undefined,
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#A81020",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
