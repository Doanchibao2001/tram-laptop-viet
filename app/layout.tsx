import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { siteUrl } from "@/lib/site-url";
import { fallbackSiteSettings } from "@/sanity/fallback";
import AnalyticsTracker from "./AnalyticsTracker";
import "./globals.css";
import "./process-fix.css";
import "./typography-fix.css";
import "./modern-ui.css";
import "./header-brand-fix.css";
import "./palette-soft.css";
import "./content-responsive.css";

const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION;
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: fallbackSiteSettings.seoTitle,
    template: "%s | Trạm Laptop Việt",
  },
  description: fallbackSiteSettings.seoDescription,
  keywords: fallbackSiteSettings.seoKeywords,
  applicationName: fallbackSiteSettings.siteName,
  authors: [{ name: fallbackSiteSettings.siteName, url: siteUrl }],
  creator: fallbackSiteSettings.siteName,
  publisher: fallbackSiteSettings.siteName,
  category: "Dịch vụ sửa chữa và nâng cấp laptop",
  verification: googleSiteVerification ? { google: googleSiteVerification } : undefined,
  icons: {
    icon: [{ url: fallbackSiteSettings.logo, sizes: "any" }],
    shortcut: [{ url: fallbackSiteSettings.logo }],
    apple: [{ url: fallbackSiteSettings.logo, sizes: "180x180" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

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
