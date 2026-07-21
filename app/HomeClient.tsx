"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Product, SiteSettings } from "@/sanity/types";

const categories = ["Laptop cũ", "Bàn phím laptop", "Màn hình laptop", "Pin laptop", "Sạc laptop", "Ổ cứng & RAM", "Phụ kiện", "Sửa main laptop"];

function productBadge(product: Product): string {
  if (product.availability === "outOfStock") return "HẾT HÀNG";
  if (product.availability === "preorder") return "ĐẶT TRƯỚC";
  if (product.compareAtPrice) return "KHUYẾN MÃI";
  return product.promotionLevel === "featured" ? "PHỔ BIẾN" : "CÓ BẢO HÀNH";
}

function productAction(product: Product): string {
  if (product.availability === "outOfStock") return "Hết hàng";
  if (product.availability === "preorder") return "Đặt trước";
  return "Hỏi giá";
}

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ComputerStore"],
  "@id": "https://tramlaptopviet.vn/#business",
  name: "Trạm Laptop Việt",
  url: "https://tramlaptopviet.vn/",
  image: "https://tramlaptopviet.vn/tram-laptop-viet/storefront-main.png",
  logo: "https://tramlaptopviet.vn/tram-laptop-viet/logo-round.jpg",
  telephone: "+84343323865",
  priceRange: "₫₫",
  description: "Trạm Laptop Việt chuyên sửa chữa, nâng cấp và bảo hành laptop, MacBook tại TP.HCM.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "642 đường 3/2, Phường 14, Quận 10",
    addressLocality: "TP. Hồ Chí Minh",
    addressCountry: "VN",
  },
  areaServed: { "@type": "City", name: "TP. Hồ Chí Minh" },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "08:30", closes: "18:30" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "09:00", closes: "17:00" },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Dịch vụ sửa chữa laptop",
    itemListElement: ["Sửa laptop lấy liền", "Thay bàn phím laptop", "Thay màn hình laptop", "Thay pin và sạc laptop", "Sửa mainboard laptop"].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Kiểm tra laptop có mất phí không?", acceptedAnswer: { "@type": "Answer", text: "Trạm Laptop Việt kiểm tra và tư vấn phương án trước khi sửa. Chi phí chỉ được thực hiện sau khi khách hàng đồng ý." } },
    { "@type": "Question", name: "Sửa laptop mất bao lâu?", acceptedAnswer: { "@type": "Answer", text: "Các lỗi bàn phím, pin, sạc hoặc màn hình có sẵn linh kiện thường được xử lý lấy liền. Lỗi mainboard cần thời gian chẩn đoán cụ thể." } },
    { "@type": "Question", name: "Dịch vụ sửa laptop có bảo hành không?", acceptedAnswer: { "@type": "Answer", text: "Có. Thời gian bảo hành phụ thuộc dịch vụ và linh kiện, được ghi rõ trên phiếu bàn giao." } },
  ],
};

export default function HomeClient({
  products,
  siteSettings,
}: {
  products: Product[];
  siteSettings: SiteSettings;
}) {
  const {
    hotline,
    hotlineDisplay,
    hotlineE164,
    zaloUrl,
    heroEyebrow,
    heroTitle,
    heroAccent,
    heroDescription,
    heroImage,
    heroImageAlt,
    socialProof,
    primaryCtaLabel,
    secondaryCtaLabel,
    popupHeadline,
    popupDescription,
    popupPrimaryLabel,
    popupSecondaryLabel,
    addresses,
    footerDescription,
  } = siteSettings;
  const socialProofMatch = socialProof.match(/^(\+?[\d.,]+)\s+(.+)$/);
  const socialProofCount = socialProofMatch?.[1] ?? "+3.000";
  const socialProofText = socialProofMatch?.[2] ?? socialProof;
  const [socialProofLineOne, socialProofLineTwo] = socialProofText.split(
    /\s+(?=đã\b)/i,
    2,
  );
  const currentLocalBusinessSchema = {
    ...localBusinessSchema,
    telephone: hotlineE164,
    address: {
      ...localBusinessSchema.address,
      streetAddress: addresses[0]?.address ?? localBusinessSchema.address.streetAddress,
    },
  };
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [zaloExpanded, setZaloExpanded] = useState(false);
  const visible = useMemo(
    () => products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())),
    [products, query],
  );

  useEffect(() => {
    const popupSeenKey = "tram-laptop-viet-conversion-popup-v3";
    let autoPopupTriggered = window.sessionStorage.getItem(popupSeenKey) === "1";
    let dwellEligible = false;
    let scrollProgress = 0;
    let collapseTimer = 0;
    let zaloInterval = 0;

    const triggerAutoPopup = () => {
      if (autoPopupTriggered) return;
      autoPopupTriggered = true;
      window.sessionStorage.setItem(popupSeenKey, "1");
      setPopupOpen(true);
    };

    const tryContextualPopup = () => {
      if (dwellEligible && scrollProgress >= 0.45) triggerAutoPopup();
    };
    const dwellTimer = window.setTimeout(() => {
      dwellEligible = true;
      tryContextualPopup();
    }, 15000);
    const fallbackTimer = window.setTimeout(() => {
      if (scrollProgress >= 0.2) triggerAutoPopup();
    }, 45000);
    const handleScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      scrollProgress = window.scrollY / scrollable;
      tryContextualPopup();
    };

    const expandZalo = () => {
      if (!window.matchMedia("(max-width: 700px)").matches) return;
      setZaloExpanded(true);
      window.clearTimeout(collapseTimer);
      collapseTimer = window.setTimeout(() => setZaloExpanded(false), 3000);
    };
    const firstZaloExpansion = window.setTimeout(() => {
      expandZalo();
      zaloInterval = window.setInterval(expandZalo, 14000);
    }, 6500);

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPopupOpen(false);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.clearTimeout(dwellTimer);
      window.clearTimeout(fallbackTimer);
      window.clearTimeout(firstZaloExpansion);
      window.clearTimeout(collapseTimer);
      window.clearInterval(zaloInterval);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const closePopup = () => {
    setPopupOpen(false);
    window.sessionStorage.setItem("tram-laptop-viet-conversion-popup-v3", "1");
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(currentLocalBusinessSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} />
      <div className="topbar"><div className="container topbar-inner"><span>Trạm Laptop Việt · Sửa chữa · Nâng cấp · Bảo hành</span><a href={`tel:${hotline}`}>Hotline: <b>{hotlineDisplay}</b></a></div></div>
      <header className="header">
        <div className="container header-main">
          <a className="logo tram-brand" href="#top" aria-label="Trạm Laptop Việt trang chủ"><img className="tram-logo" src="/tram-laptop-viet/logo-round.jpg" alt="Logo Trạm Laptop Việt" /><span className="tram-wordmark"><b>TRẠM LAPTOP</b><strong>VIỆT</strong></span></a>
          <div className="desktop-benefits" aria-label="Cam kết dịch vụ">
            <span><b>⚙</b>Sửa chữa chuyên nghiệp</span>
            <span><b>◆</b>Linh kiện chính hãng</span>
            <span><b>↻</b>Bảo hành 1 đổi 1</span>
          </div>
          <a className="mobile-header-call" href={`tel:${hotline}`} aria-label={`Gọi Trạm Laptop Việt ${hotlineDisplay}`}><i className="ui-icon icon-phone" aria-hidden="true"/><span>Gọi ngay</span></a>
          <button className="header-consult" onClick={() => setPopupOpen(true)}><i className="ui-icon icon-calendar" aria-hidden="true"/><span>Kiểm tra miễn phí</span></button>
        </div>
        <nav className="nav" id="top">
          <div className="container nav-inner">
            <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen}><i className="ui-icon icon-menu" aria-hidden="true"/><span>Danh mục sản phẩm</span></button>
            <div className={`nav-links ${menuOpen ? "open" : ""}`}>
              <a href="#dich-vu">Dịch vụ</a><a href="#san-pham">Sản phẩm</a><a href="#quy-trinh">Quy trình sửa chữa</a><a href="#cua-hang">Hệ thống cửa hàng</a><a href="#lien-he">Liên hệ</a><Link href="/tin-tuc">Tin tức</Link>
            </div>
          </div>
        </nav>
      </header>

      <div className="instant-cta"><div className="container instant-cta-inner"><strong>Sợ phát sinh chi phí?</strong><span>Chỉ sửa sau khi báo đúng lỗi, rõ giá và bạn đồng ý.</span><div><a href={`tel:${hotline}`}>Gọi {hotlineDisplay}</a><button onClick={() => setPopupOpen(true)}>Kiểm tra lỗi miễn phí</button></div></div></div>

      <section className="hero">
        <div className="container hero-grid">
          <aside className="category-panel" aria-label="Danh mục sản phẩm"><div className="category-title">Danh mục sản phẩm</div>{categories.map((item) => <a href="#san-pham" key={item}><span>{item}</span><b>›</b></a>)}</aside>
          <div className="hero-card">
            <div className="hero-copy"><span className="eyebrow">{heroEyebrow}</span><h1><span>{heroTitle}</span><em>{heroAccent}</em></h1><p>{heroDescription}</p><div className="hero-actions"><button className="btn primary hero-call" onClick={() => setPopupOpen(true)}><i className="ui-icon icon-calendar" aria-hidden="true"/><b>{primaryCtaLabel}</b></button><a className="btn secondary" href={zaloUrl} target="_blank" rel="noreferrer"><i className="ui-icon icon-zalo" aria-hidden="true"/>{secondaryCtaLabel}</a></div><div className="hero-risk-reversal"><span>✓ Không tự ý sửa</span><span>✓ Báo giá trước khi làm</span></div><div className="hero-social-proof" aria-label={socialProof}><strong>{socialProofCount}</strong><span>{socialProofLineOne}{socialProofLineTwo && <><br/>{socialProofLineTwo}</>}</span></div><a className="nearby-link" href={`tel:${hotline}`}>Máy cần gấp? Gọi kỹ thuật viên {hotlineDisplay} →</a></div>
            <img className="hero-photo" src={heroImage} alt={heroImageAlt} />
            <div className="hero-badge"><b>100%</b><span>báo giá<br/>trước khi sửa</span></div>
          </div>
          <div className="side-promos"><article><span>KHÔNG PHÁT SINH</span><b>Chỉ sửa khi khách đồng ý</b><small>Giải thích rõ lỗi và phương án trước khi làm</small></article><article className="dark"><span>BẢO HÀNH RÕ RÀNG</span><b>Ghi cụ thể trên phiếu</b><small>Dễ kiểm tra, dễ đối chiếu sau sửa chữa</small></article></div>
        </div>
      </section>

      <section className="brand-showcase" aria-label="Giới thiệu Trạm Laptop Việt"><div className="container"><img src="/tram-laptop-viet/brand-banner.jpg" alt="Trạm Laptop Việt - Sửa chữa, nâng cấp, bảo hành laptop" /></div></section>

      <section className="trust-strip"><div className="container trust-grid"><div><b>✓ Không tự ý sửa</b><span>Chỉ làm khi khách đồng ý</span></div><div><b>✓ Báo đúng lỗi</b><span>Giải thích rõ phương án</span></div><div><b>✓ Linh kiện rõ ràng</b><span>Bảo hành ghi cụ thể</span></div><div><b>☎ Máy cần xử lý gấp?</b><span>{hotlineDisplay}</span></div></div></section>

      <section className="section services" id="dich-vu"><div className="container"><div className="section-heading"><span>DỊCH VỤ NỔI BẬT</span><h2>Laptop gặp vấn đề gì?</h2><p>Kỹ thuật viên kiểm tra và báo phương án trước khi sửa.</p></div><div className="service-grid">
        {[ ["01","Thay bàn phím","Thay lấy liền từ 15–30 phút, bảo hành đến 12 tháng."], ["02","Thay màn hình","Kiểm tra miễn phí, nhiều lựa chọn màn hình phù hợp."], ["03","Thay pin · sạc","Linh kiện tương thích, kiểm tra dung lượng và nguồn."], ["04","Sửa mainboard","Chẩn đoán chuyên sâu, báo đúng lỗi, không tráo linh kiện."] ].map(([n,t,d]) => <article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p><button className="service-check" onClick={() => setPopupOpen(true)}>Kiểm tra lỗi này →</button></article>)}
      </div></div></section>

      <section className="section products" id="san-pham"><div className="container"><div className="product-head"><div className="section-heading left"><span>LINH KIỆN PHỔ BIẾN</span><h2>Kiểm tra đúng mã trước khi thay</h2></div><label className="search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm bàn phím, pin, sạc..." aria-label="Tìm sản phẩm"/></label></div><div className="product-grid">{visible.map((p) => <article className="product-card" key={p.id}><div className="product-image"><img src={p.image} alt={p.imageAlt}/><span>{productBadge(p)}</span></div><small>{p.category}</small><h3>{p.name}</h3><div className="price-row"><b>{p.price}</b><button disabled={p.availability === "outOfStock"} onClick={() => setPopupOpen(true)} aria-label={`${productAction(p)} ${p.name}`}>{productAction(p)}</button></div></article>)}</div>{visible.length === 0 && <p className="empty">Không tìm thấy sản phẩm phù hợp. Gọi {hotlineDisplay} để được tra đúng mã linh kiện.</p>}</div></section>

      <section className="section process" id="quy-trinh"><div className="container process-grid"><div><div className="section-heading left light"><span>MINH BẠCH TỪNG BƯỚC</span><h2>Quy trình sửa chữa 4 bước</h2><p>Khách hàng nắm rõ tình trạng máy, chi phí và thời gian trước khi quyết định.</p></div><a href="#lien-he" className="btn white">Đặt lịch kiểm tra miễn phí</a></div><ol><li><b>01</b><span><strong>Tiếp nhận & kiểm tra</strong><small>Kỹ thuật viên lắng nghe, kiểm tra tổng thể.</small></span></li><li><b>02</b><span><strong>Báo lỗi & báo giá</strong><small>Tư vấn phương án, không phát sinh ngoài báo giá.</small></span></li><li><b>03</b><span><strong>Sửa chữa trực tiếp</strong><small>Khách hàng có thể ngồi quan sát tại chỗ.</small></span></li><li><b>04</b><span><strong>Kiểm tra & bảo hành</strong><small>Test kỹ, bàn giao và ghi rõ thời hạn bảo hành.</small></span></li></ol></div></section>

      <section className="section locations" id="cua-hang"><div className="container"><div className="section-heading"><span>PHỤC VỤ KHẮP THÀNH PHỐ</span><h2>Hệ thống cửa hàng</h2><p>Chọn điểm gần nhất để được kiểm tra máy miễn phí.</p></div><div className="location-grid">{addresses.map((location) => <article key={`${location.name}-${location.address}`}><span>● ĐANG MỞ CỬA</span><h3>{location.name}</h3><p>{location.address}</p><small>{location.hours}</small><a href={`tel:${hotline}`}>{hotlineDisplay} →</a></article>)}</div></div></section>

      <section className="section seo-section" aria-labelledby="seo-title"><div className="container seo-grid"><article><span className="seo-kicker">TRẠM LAPTOP VIỆT · KIỂM TRA ĐÚNG LỖI</span><h2 id="seo-title">Sửa laptop, MacBook tại TP.HCM</h2><p>Trạm Laptop Việt tiếp nhận kiểm tra, vệ sinh, sửa chữa và nâng cấp laptop tại TP.HCM. Kỹ thuật viên chẩn đoán đúng lỗi, báo giá trước khi làm và để khách hàng nắm rõ phương án sửa chữa.</p><p>Các dịch vụ phổ biến gồm thay bàn phím laptop, thay màn hình, pin, sạc, ổ cứng SSD, RAM và sửa mainboard. Linh kiện có nguồn gốc rõ ràng, thời hạn bảo hành được ghi cụ thể khi bàn giao máy.</p><a className="text-link" href="#cua-hang">Xem cửa hàng gần bạn →</a></article><div className="faq-block"><h2>Câu hỏi thường gặp</h2><details><summary>Kiểm tra laptop có mất phí không?</summary><p>Trạm Laptop Việt kiểm tra và tư vấn phương án trước khi sửa. Chi phí chỉ được thực hiện sau khi khách hàng đồng ý.</p></details><details><summary>Sửa laptop mất bao lâu?</summary><p>Các lỗi bàn phím, pin, sạc hoặc màn hình có sẵn linh kiện thường được xử lý lấy liền. Lỗi mainboard cần thời gian chẩn đoán cụ thể.</p></details><details><summary>Dịch vụ có bảo hành không?</summary><p>Có. Thời gian bảo hành phụ thuộc dịch vụ và linh kiện, được ghi rõ trên phiếu bàn giao.</p></details></div></div></section>

      <section className="consult" id="lien-he"><div className="container consult-grid"><div><span>TƯ VẤN MIỄN PHÍ</span><h2>Mô tả tình trạng máy,<br/>Trạm Laptop Việt gọi lại ngay.</h2><p>Hoặc gọi hotline <a href={`tel:${hotline}`}>{hotlineDisplay}</a> để được hỗ trợ nhanh.</p></div><form onSubmit={(e) => { e.preventDefault(); setSent(true); }}><input required placeholder="Họ và tên" aria-label="Họ và tên"/><input required type="tel" placeholder="Số điện thoại" aria-label="Số điện thoại"/><select aria-label="Dịch vụ cần tư vấn"><option>Dịch vụ cần tư vấn</option><option>Sửa laptop</option><option>Thay bàn phím</option><option>Thay màn hình</option><option>Thay pin · sạc</option></select><button className="btn primary" type="submit">{sent ? "Đã tiếp nhận yêu cầu ✓" : "Yêu cầu gọi lại"}</button></form></div></section>

      <footer><div className="container footer-grid"><div><a className="logo footer-logo tram-brand" href="#top"><img className="tram-logo" src="/tram-laptop-viet/logo-round.jpg" alt="Logo Trạm Laptop Việt" /><span className="tram-wordmark"><b>TRẠM LAPTOP</b><strong>VIỆT</strong></span></a><p>{footerDescription}</p></div><div><h2 className="footer-heading">Dịch vụ</h2><a href="#dich-vu">Sửa laptop lấy liền</a><a href="#san-pham">Linh kiện laptop</a><a href="#quy-trinh">Chính sách bảo hành</a></div><div><h2 className="footer-heading">Hỗ trợ</h2><a href={`tel:${hotline}`}>{hotlineDisplay}</a><a href="#cua-hang">Hệ thống cửa hàng</a><a href="#lien-he">Đăng ký tư vấn</a></div><div><h2 className="footer-heading">Giờ làm việc</h2><p>Thứ 2–7: 8:30–18:30<br/>Chủ nhật: 9:00–17:00</p></div></div><div className="copyright container">© 2026 Trạm Laptop Việt · Sửa chữa · Nâng cấp · Bảo hành.</div></footer>
      {popupOpen && <div className="popup-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closePopup(); }}><section className="consult-popup" role="dialog" aria-modal="true" aria-labelledby="popup-title"><button className="popup-close" onClick={closePopup} aria-label="Đóng cửa sổ tư vấn">×</button><div className="popup-accent">CHƯA ĐỒNG Ý GIÁ · CHƯA TIẾN HÀNH SỬA</div><h2 id="popup-title">{popupHeadline}</h2><p>{popupDescription}</p><div className="popup-quick-actions"><a className="popup-zalo-action" href={zaloUrl} target="_blank" rel="noreferrer"><i className="ui-icon icon-zalo" aria-hidden="true"/><span><b>{popupPrimaryLabel}</b><small>Kỹ thuật viên đang online</small></span></a><a className="popup-phone-action" href={`tel:${hotline}`}><i className="ui-icon icon-phone" aria-hidden="true"/><span><b>{popupSecondaryLabel}</b><small>{hotlineDisplay}</small></span></a></div><ul><li>✓ Giải thích rõ lỗi và phương án</li><li>✓ Báo giá trước khi tiến hành</li><li>✓ Không tự ý thay linh kiện</li></ul><p className="popup-reassurance">Chỉ sửa khi bạn đã đồng ý giá.</p><div className="popup-divider"><span>Hoặc nhờ kỹ thuật viên gọi lại</span></div><form onSubmit={(event) => { event.preventDefault(); setSent(true); window.sessionStorage.setItem("tram-laptop-viet-conversion-popup-v3", "1"); }}><label><span>Số điện thoại của bạn</span><input type="tel" inputMode="tel" required placeholder="Nhập số để kỹ thuật viên gọi lại"/></label><label><span>Máy đang gặp tình trạng nào?</span><select defaultValue=""><option value="" disabled>Chọn dấu hiệu gần đúng nhất</option><option>Máy không lên nguồn</option><option>Bàn phím hoặc màn hình</option><option>Pin hoặc sạc</option><option>Máy chậm, nóng</option><option>Lỗi khác</option></select></label><button type="submit">{sent ? "Đã nhận yêu cầu — kỹ thuật viên sẽ gọi lại ✓" : "Nhờ kỹ thuật viên gọi lại miễn phí"}</button></form><small>Không thu phí tư vấn và không tự ý tiến hành sửa chữa.</small></section></div>}
      <a className="floating-zalo" href={zaloUrl} target="_blank" rel="noreferrer" aria-label={`Chat Zalo ${hotline}`}><i className="ui-icon icon-zalo" aria-hidden="true"/><span>Chat Zalo</span></a>
      <a className="floating-call" href={`tel:${hotline}`} aria-label={`Gọi ${hotline}`}><i className="ui-icon icon-phone" aria-hidden="true"/><span>Gọi ngay</span></a>
      <nav className="mobile-cta" aria-label="Liên hệ nhanh"><a href={`tel:${hotline}`}><i className="ui-icon icon-phone" aria-hidden="true"/><span>Máy cần gấp</span></a><a className={`mobile-zalo-cta ${zaloExpanded ? "expanded" : ""}`} href={zaloUrl} target="_blank" rel="noreferrer" aria-label="Gửi ảnh lỗi qua Zalo"><span className="zalo-online"><i/>Kỹ thuật viên online</span><i className="ui-icon icon-zalo" aria-hidden="true"/><span className="zalo-expand-label"><b>Gửi ảnh lỗi</b><small>kiểm tra nhanh</small></span></a><button onClick={() => setPopupOpen(true)}><i className="ui-icon icon-calendar" aria-hidden="true"/><span>Kiểm tra miễn phí</span></button></nav>
    </main>
  );
}
