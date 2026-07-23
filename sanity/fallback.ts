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
  siteName: "Trạm Laptop Việt",
  logo: "/tram-laptop-viet/logo-round.jpg",
  logoAlt: "Logo Trạm Laptop Việt",
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
  services: [
    { title: "Thay bàn phím", description: "Kiểm tra đúng mã, báo thời gian và bảo hành trước khi thay." },
    { title: "Thay màn hình", description: "Kiểm tra miễn phí, tư vấn lựa chọn màn hình phù hợp." },
    { title: "Thay pin · sạc", description: "Kiểm tra dung lượng pin, nguồn sạc và độ tương thích." },
    { title: "Sửa mainboard", description: "Chẩn đoán chuyên sâu, báo đúng lỗi trước khi sửa chữa." },
  ],
  processSteps: [
    { title: "Tiếp nhận & kiểm tra", description: "Kỹ thuật viên lắng nghe và kiểm tra tổng thể." },
    { title: "Báo lỗi & báo giá", description: "Tư vấn phương án, không phát sinh ngoài báo giá." },
    { title: "Sửa chữa", description: "Chỉ tiến hành sau khi khách hàng đồng ý phương án." },
    { title: "Kiểm tra & bảo hành", description: "Test kỹ, bàn giao và ghi rõ thời hạn bảo hành." },
  ],
  homepageSeoHeading: "Sửa laptop, MacBook tại Gò Vấp",
  homepageSeoParagraphs: [
    "Trạm Laptop Việt tiếp nhận kiểm tra, vệ sinh, sửa chữa và nâng cấp laptop tại 656 Phạm Văn Chiêu, An Hội Đông, Gò Vấp. Kỹ thuật viên chẩn đoán đúng lỗi, báo giá trước khi làm và chỉ sửa khi khách hàng đồng ý.",
    "Các dịch vụ phổ biến gồm thay bàn phím laptop, thay màn hình, pin, sạc, ổ cứng SSD, RAM và sửa mainboard. Linh kiện có nguồn gốc rõ ràng, thời hạn bảo hành được ghi cụ thể khi bàn giao máy.",
  ],
  faqs: [
    { question: "Kiểm tra laptop có mất phí không?", answer: "Trạm Laptop Việt kiểm tra và tư vấn phương án trước khi sửa. Chi phí chỉ được thực hiện sau khi khách hàng đồng ý." },
    { question: "Sửa laptop mất bao lâu?", answer: "Thời gian phụ thuộc tình trạng máy và linh kiện. Kỹ thuật viên sẽ báo thời gian dự kiến sau khi kiểm tra." },
    { question: "Dịch vụ có bảo hành không?", answer: "Có. Thời gian bảo hành phụ thuộc dịch vụ và linh kiện, được ghi rõ khi bàn giao." },
  ],
  consultHeading: "Mô tả tình trạng máy, Trạm Laptop Việt gọi lại ngay.",
  consultDescription: "Để lại thông tin để kỹ thuật viên liên hệ và tư vấn tình trạng máy.",
  popupHeadline: "Chưa biết máy hỏng gì?",
  popupDescription:
    "Gửi ảnh, video hoặc mô tả dấu hiệu để kỹ thuật viên xem sơ bộ. Bạn biết lỗi và chi phí dự kiến trước khi quyết định.",
  popupPrimaryLabel: "Gửi ảnh lỗi để kiểm tra nhanh",
  popupSecondaryLabel: "Máy cần gấp? Gọi ngay",
  addresses: [
    { name: "Gò Vấp", address: "656 Phạm Văn Chiêu, An Hội Đông, Gò Vấp", hours: "Thứ 2–7 · 8:30–18:30" },
  ],
  footerDescription:
    "Trạm sửa chữa, nâng cấp và bảo hành laptop tại 656 Phạm Văn Chiêu, An Hội Đông, Gò Vấp.",
  seoTitle: "Sửa laptop, MacBook tại Gò Vấp | Trạm Laptop Việt",
  seoDescription: "Trạm Laptop Việt sửa laptop, MacBook tại 656 Phạm Văn Chiêu, An Hội Đông, Gò Vấp. Kiểm tra đúng lỗi, báo giá trước, chỉ sửa khi khách đồng ý.",
  seoImage: "/tram-laptop-viet/brand-banner.jpg",
  seoImageAlt: "Trạm Laptop Việt - Sửa chữa, nâng cấp và bảo hành laptop",
  seoNoIndex: false,
  seoKeywords: ["sửa laptop Gò Vấp", "sửa MacBook Gò Vấp", "sửa laptop Phạm Văn Chiêu", "nâng cấp laptop", "sửa main laptop"],
};
