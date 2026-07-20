import type { Metadata, Viewport } from "next";
import { getSiteFaviconUrl } from "@/sanity/lib/site-metadata";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tramlaptopviet.vn";
const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION;
const title = "Sửa laptop & MacBook uy tín tại TP.HCM | Trạm Laptop Việt";
const description = "Trạm Laptop Việt sửa chữa, nâng cấp và bảo hành laptop, MacBook tại TP.HCM: kiểm tra đúng lỗi, báo giá trước khi sửa và bảo hành minh bạch.";

export async function generateMetadata(): Promise<Metadata> {
  const favicon = await getSiteFaviconUrl();

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: "%s | Trạm Laptop Việt",
    },
    description,
    keywords: [
      "sửa laptop",
      "sửa MacBook",
      "sửa laptop TP.HCM",
      "nâng cấp laptop",
      "thay bàn phím laptop",
      "thay màn hình laptop",
      "thay pin laptop",
      "sửa main laptop",
    ],
    applicationName: "Trạm Laptop Việt",
    authors: [{ name: "Trạm Laptop Việt", url: siteUrl }],
    creator: "Trạm Laptop Việt",
    publisher: "Trạm Laptop Việt",
    category: "Dịch vụ sửa chữa và nâng cấp laptop",
    verification: googleSiteVerification ? { google: googleSiteVerification } : undefined,
    alternates: { canonical: "/" },
    icons: {
      icon: [{ url: favicon, sizes: "512x512" }],
      shortcut: [{ url: favicon }],
      apple: [{ url: favicon, sizes: "180x180" }],
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
    openGraph: {
      type: "website",
      locale: "vi_VN",
      url: "/",
      siteName: "Trạm Laptop Việt",
      title,
      description,
      images: [{
        url: "/tram-laptop-viet/brand-banner.jpg",
        width: 1280,
        height: 720,
        alt: "Trạm Laptop Việt - Sửa chữa, nâng cấp và bảo hành laptop",
      }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/tram-laptop-viet/brand-banner.jpg"],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#9E0A16",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
