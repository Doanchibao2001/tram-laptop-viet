import type { Product, SiteSettings } from "./types";

export const fallbackProducts: Product[] = [
  { id: "fallback-keyboard-hp", name: "Bàn phím laptop HP thay lấy liền", price: "290.000₫", category: "Bàn phím", image: "/tram-laptop-viet/storefront-main.png", imageAlt: "Bàn phím laptop HP thay lấy liền", availability: "inStock", promotionLevel: "featured" },
  { id: "fallback-battery-dell", name: "Pin laptop Dell chính hãng", price: "390.000₫", category: "Pin laptop", image: "/tram-laptop-viet/service-banner.jpg", imageAlt: "Pin laptop Dell chính hãng", availability: "inStock", promotionLevel: "featured" },
  { id: "fallback-charger-dell", name: "Sạc laptop Dell bảo hành 12 tháng", price: "350.000₫", category: "Sạc laptop", image: "/tram-laptop-viet/brand-banner.jpg", imageAlt: "Sạc laptop Dell bảo hành 12 tháng", availability: "inStock", promotionLevel: "featured" },
  { id: "fallback-screen-fhd", name: "Màn hình laptop 15.6 inch Full HD", price: "1.450.000₫", category: "Màn hình", image: "/tram-laptop-viet/storefront-main.png", imageAlt: "Màn hình laptop 15.6 inch Full HD", availability: "inStock", promotionLevel: "standard" },
  { id: "fallback-keyboard-thinkpad", name: "Bàn phím Lenovo ThinkPad X1 Carbon", price: "810.000₫", category: "Bàn phím", image: "/tram-laptop-viet/service-banner.jpg", imageAlt: "Bàn phím Lenovo ThinkPad X1 Carbon", availability: "inStock", promotionLevel: "standard" },
  { id: "fallback-ssd-512", name: "SSD laptop 512GB tốc độ cao", price: "890.000₫", category: "Linh kiện", image: "/tram-laptop-viet/brand-banner.jpg", imageAlt: "SSD laptop 512GB tốc độ cao", availability: "inStock", promotionLevel: "standard" },
  { id: "fallback-battery-thinkpad", name: "Pin laptop Lenovo ThinkPad", price: "390.000₫", category: "Pin laptop", image: "/tram-laptop-viet/storefront-main.png", imageAlt: "Pin laptop Lenovo ThinkPad", availability: "inStock", promotionLevel: "standard" },
  { id: "fallback-cooling-fan", name: "Quạt tản nhiệt laptop chính hãng", price: "Liên hệ", category: "Phụ kiện", image: "/tram-laptop-viet/service-banner.jpg", imageAlt: "Quạt tản nhiệt laptop chính hãng", availability: "inStock", promotionLevel: "standard" },
];

export const fallbackSiteSettings: SiteSettings = {
  hotline: "0343323865",
  hotlineDisplay: "0343.323.865",
  hotlineE164: "+84343323865",
  zaloUrl: "https://zalo.me/0343323865",
  heroEyebrow: "TRẠM LAPTOP VIỆT",
  heroTitle: "Sửa Laptop & MacBook",
  heroAccent: "Đúng lỗi · Đúng giá",
  heroDescription:
    "Máy không lên nguồn, chạy chậm, nóng hoặc vào nước? Kiểm tra miễn phí, báo rõ chi phí và chỉ sửa khi bạn đồng ý.",
  heroImage: "/tram-laptop-viet/storefront-main.png",
  heroImageAlt: "Cửa hàng Trạm Laptop Việt tại 656 Phạm Văn Chiêu, Gò Vấp",
  socialProof: "+3.000 khách hàng tại TP.HCM đã tin tưởng giao máy",
  primaryCtaLabel: "Kiểm tra lỗi miễn phí",
  secondaryCtaLabel: "Gửi ảnh lỗi qua Zalo",
  popupHeadline: "Chưa biết máy hỏng gì?",
  popupDescription:
    "Gửi ảnh, video hoặc mô tả dấu hiệu để kỹ thuật viên xem sơ bộ. Bạn biết lỗi và chi phí dự kiến trước khi quyết định.",
  popupPrimaryLabel: "Gửi ảnh lỗi để kiểm tra nhanh",
  popupSecondaryLabel: "Máy cần gấp? Gọi ngay",
  addresses: [
    { name: "Quận 10", address: "642 đường 3/2, Phường 14", hours: "Thứ 2–7 · 8:30–18:30" },
    { name: "Quận 3", address: "514 Cách Mạng Tháng 8, P.11", hours: "Thứ 2–7 · 8:30–18:30" },
    { name: "Phú Nhuận", address: "167A Đào Duy Anh, P.9", hours: "Thứ 2–7 · 8:30–18:30" },
    { name: "Bình Thạnh", address: "203A Lê Quang Định, P.7", hours: "Thứ 2–7 · 8:30–18:30" },
    { name: "Gò Vấp", address: "457 Lê Văn Thọ, P.9", hours: "Thứ 2–7 · 8:30–18:30" },
    { name: "Thủ Đức", address: "678 Kha Vạn Cân, Linh Đông", hours: "Thứ 2–7 · 8:30–18:30" },
  ],
  footerDescription:
    "Trạm sửa chữa, nâng cấp và bảo hành laptop chuyên nghiệp tại TP.HCM.",
};
