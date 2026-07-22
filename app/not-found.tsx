import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Không tìm thấy trang | Trạm Laptop Việt" },
  description: "Trang bạn đang tìm không tồn tại hoặc đã được chuyển sang địa chỉ khác.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function NotFound() {
  return (
    <main style={{ minHeight: "70vh", display: "grid", placeItems: "center", padding: "32px" }}>
      <section style={{ maxWidth: "620px", textAlign: "center" }}>
        <p style={{ color: "#a81020", fontWeight: 800 }}>404</p>
        <h1>Không tìm thấy trang</h1>
        <p>Đường dẫn có thể đã thay đổi hoặc nội dung không còn tồn tại.</p>
        <Link href="/" style={{ display: "inline-block", marginTop: "18px", color: "#a81020", fontWeight: 800 }}>
          Về trang chủ
        </Link>
      </section>
    </main>
  );
}
