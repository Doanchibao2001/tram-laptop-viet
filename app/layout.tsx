import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MrLaptop.vn — Sửa laptop lấy liền tại TP.HCM",
  description: "Hệ thống sửa chữa laptop chuyên nghiệp, kiểm tra miễn phí, sửa lấy liền và bảo hành minh bạch tại TP.HCM.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
