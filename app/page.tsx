"use client";

import { useMemo, useState } from "react";

type Product = { name: string; price: string; category: string; image: string };

const products: Product[] = [
  { name: "Bàn phím laptop HP thay lấy liền", price: "290.000₫", category: "Bàn phím", image: "https://mrlaptop.vn/wp-content/uploads/2018/12/hinh-sua-laptop-uy-tin-hcm.jpg" },
  { name: "Pin laptop Dell chính hãng", price: "390.000₫", category: "Pin laptop", image: "https://mrlaptop.vn/wp-content/uploads/2018/12/hinh-sua-laptop-uy-tin-chat-luong.jpg" },
  { name: "Sạc laptop Dell bảo hành 12 tháng", price: "350.000₫", category: "Sạc laptop", image: "https://mrlaptop.vn/wp-content/uploads/2020/03/banner2.png" },
  { name: "Màn hình laptop 15.6 inch Full HD", price: "1.450.000₫", category: "Màn hình", image: "https://mrlaptop.vn/wp-content/uploads/2020/03/banner3.png" },
  { name: "Bàn phím Lenovo ThinkPad X1 Carbon", price: "810.000₫", category: "Bàn phím", image: "https://mrlaptop.vn/wp-content/uploads/2020/03/banner1.png" },
  { name: "SSD laptop 512GB tốc độ cao", price: "890.000₫", category: "Linh kiện", image: "https://mrlaptop.vn/wp-content/uploads/2018/12/hinh-sua-laptop-uy-tin-hcm.jpg" },
  { name: "Pin laptop Lenovo ThinkPad", price: "390.000₫", category: "Pin laptop", image: "https://mrlaptop.vn/wp-content/uploads/2018/12/hinh-sua-laptop-uy-tin-chat-luong.jpg" },
  { name: "Quạt tản nhiệt laptop chính hãng", price: "Liên hệ", category: "Phụ kiện", image: "https://mrlaptop.vn/wp-content/uploads/2020/03/banner2.png" },
];

const categories = ["Laptop cũ", "Bàn phím laptop", "Màn hình laptop", "Pin laptop", "Sạc laptop", "Ổ cứng & RAM", "Phụ kiện", "Sửa main laptop"];

export default function Home() {
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const visible = useMemo(() => products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())), [query]);

  return (
    <main>
      <div className="topbar"><div className="container topbar-inner"><span>Hệ thống sửa chữa laptop uy tín tại TP.HCM</span><a href="tel:0931640640">Hotline: <b>0931.640.640</b></a></div></div>
      <header className="header">
        <div className="container header-main">
          <a className="logo" href="#top" aria-label="MrLaptop trang chủ"><span className="logo-mark">MR</span><span><b>LAPTOP</b><small>.VN</small></span></a>
          <div className="promise"><span className="promise-icon">⚡</span><span><b>Sửa laptop lấy liền</b><small>Nhanh chóng · Uy tín</small></span></div>
          <div className="promise"><span className="promise-icon">✓</span><span><b>Tư vấn báo giá miễn phí</b><small>Quan sát sửa trực tiếp</small></span></div>
          <button className="cart" onClick={() => setCart(0)} aria-label={`Giỏ hàng có ${cart} sản phẩm`}>🛒 <span>Giỏ hàng</span><b>{cart}</b></button>
        </div>
        <nav className="nav" id="top">
          <div className="container nav-inner">
            <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen}>☰ Danh mục sản phẩm</button>
            <div className={`nav-links ${menuOpen ? "open" : ""}`}>
              <a href="#dich-vu">Dịch vụ</a><a href="#san-pham">Sản phẩm</a><a href="#quy-trinh">Quy trình sửa chữa</a><a href="#cua-hang">Hệ thống cửa hàng</a><a href="#lien-he">Liên hệ</a>
            </div>
          </div>
        </nav>
      </header>

      <section className="hero">
        <div className="container hero-grid">
          <aside className="category-panel"><h3>Danh mục sản phẩm</h3>{categories.map((item) => <a href="#san-pham" key={item}><span>{item}</span><b>›</b></a>)}</aside>
          <div className="hero-card">
            <div className="hero-copy"><span className="eyebrow">MRLAPTOP.VN · TỪ 2012</span><h1>Sửa laptop<br/><em>lấy liền</em> tại TP.HCM</h1><p>Kiểm tra miễn phí, báo đúng giá, sửa trực tiếp trước mặt khách hàng và bảo hành minh bạch.</p><div className="hero-actions"><a className="btn primary" href="tel:0931640640">Gọi 0931.640.640</a><a className="btn secondary" href="#cua-hang">Tìm cửa hàng gần bạn</a></div></div>
            <div className="laptop-visual" aria-hidden="true"><div className="screen"><span>MR</span><small>Chẩn đoán nhanh<br/>Sửa chữa tận tâm</small></div><div className="base"/></div>
            <div className="hero-badge"><b>10+</b><span>chi nhánh<br/>TP.HCM</span></div>
          </div>
          <div className="side-promos"><article><span>MIỄN PHÍ</span><b>Kiểm tra & vệ sinh máy</b><small>Khi sử dụng dịch vụ sửa chữa</small></article><article className="dark"><span>BẢO HÀNH</span><b>Lên đến 12 tháng</b><small>Linh kiện rõ nguồn gốc</small></article></div>
        </div>
      </section>

      <section className="trust-strip"><div className="container trust-grid"><div><b>⚡ Sửa lấy liền</b><span>Quan sát trực tiếp</span></div><div><b>◆ Linh kiện chuẩn</b><span>Bảo hành rõ ràng</span></div><div><b>↻ Đổi trả miễn phí</b><span>Trong vòng 7 ngày</span></div><div><b>☎ Hỗ trợ miễn phí</b><span>0931.640.640</span></div></div></section>

      <section className="section services" id="dich-vu"><div className="container"><div className="section-heading"><span>DỊCH VỤ NỔI BẬT</span><h2>Laptop gặp vấn đề gì?</h2><p>Kỹ thuật viên kiểm tra và báo phương án trước khi sửa.</p></div><div className="service-grid">
        {[ ["01","Thay bàn phím","Thay lấy liền từ 15–30 phút, bảo hành đến 12 tháng."], ["02","Thay màn hình","Kiểm tra miễn phí, nhiều lựa chọn màn hình phù hợp."], ["03","Thay pin · sạc","Linh kiện tương thích, kiểm tra dung lượng và nguồn."], ["04","Sửa mainboard","Chẩn đoán chuyên sâu, báo đúng lỗi, không tráo linh kiện."] ].map(([n,t,d]) => <article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p><a href="#lien-he">Nhận tư vấn →</a></article>)}
      </div></div></section>

      <section className="section products" id="san-pham"><div className="container"><div className="product-head"><div className="section-heading left"><span>SẢN PHẨM BÁN CHẠY</span><h2>Linh kiện laptop</h2></div><label className="search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm bàn phím, pin, sạc..." aria-label="Tìm sản phẩm"/></label></div><div className="product-grid">{visible.map((p, i) => <article className="product-card" key={p.name}><div className="product-image"><img src={p.image} alt=""/><span>{i < 3 ? "BÁN CHẠY" : "CHÍNH HÃNG"}</span></div><small>{p.category}</small><h3>{p.name}</h3><div className="price-row"><b>{p.price}</b><button onClick={() => setCart(cart + 1)} aria-label={`Thêm ${p.name} vào giỏ`}>＋</button></div></article>)}</div>{visible.length === 0 && <p className="empty">Không tìm thấy sản phẩm phù hợp. Gọi 0931.640.640 để được tra mã linh kiện.</p>}</div></section>

      <section className="section process" id="quy-trinh"><div className="container process-grid"><div><div className="section-heading left light"><span>MINH BẠCH TỪNG BƯỚC</span><h2>Quy trình sửa chữa 4 bước</h2><p>Khách hàng nắm rõ tình trạng máy, chi phí và thời gian trước khi quyết định.</p></div><a href="#lien-he" className="btn white">Đặt lịch kiểm tra miễn phí</a></div><ol><li><b>01</b><span><strong>Tiếp nhận & kiểm tra</strong><small>Kỹ thuật viên lắng nghe, kiểm tra tổng thể.</small></span></li><li><b>02</b><span><strong>Báo lỗi & báo giá</strong><small>Tư vấn phương án, không phát sinh ngoài báo giá.</small></span></li><li><b>03</b><span><strong>Sửa chữa trực tiếp</strong><small>Khách hàng có thể ngồi quan sát tại chỗ.</small></span></li><li><b>04</b><span><strong>Kiểm tra & bảo hành</strong><small>Test kỹ, bàn giao và ghi rõ thời hạn bảo hành.</small></span></li></ol></div></section>

      <section className="section locations" id="cua-hang"><div className="container"><div className="section-heading"><span>PHỤC VỤ KHẮP THÀNH PHỐ</span><h2>Hệ thống cửa hàng</h2><p>Chọn điểm gần nhất để được kiểm tra máy miễn phí.</p></div><div className="location-grid">{[
        ["Quận 10","642 đường 3/2, Phường 14","0931.640.640"], ["Quận 3","514 Cách Mạng Tháng 8, P.11","0968.450.450"], ["Phú Nhuận","167A Đào Duy Anh, P.9","0931.590.590"], ["Bình Thạnh","203A Lê Quang Định, P.7","0934.032.032"], ["Gò Vấp","457 Lê Văn Thọ, P.9","0966.430.430"], ["Thủ Đức","678 Kha Vạn Cân, Linh Đông","0962.710.710"]
      ].map(([district,address,phone]) => <article key={district}><span>● ĐANG MỞ CỬA</span><h3>{district}</h3><p>{address}</p><small>Thứ 2–7 · 8:30–18:30</small><a href={`tel:${phone.replaceAll(".","")}`}>{phone} →</a></article>)}</div></div></section>

      <section className="consult" id="lien-he"><div className="container consult-grid"><div><span>TƯ VẤN MIỄN PHÍ</span><h2>Mô tả tình trạng máy,<br/>MrLaptop gọi lại ngay.</h2><p>Hoặc gọi hotline <a href="tel:0931640640">0931.640.640</a> để được hỗ trợ nhanh.</p></div><form onSubmit={(e) => { e.preventDefault(); setSent(true); }}><input required placeholder="Họ và tên" aria-label="Họ và tên"/><input required type="tel" placeholder="Số điện thoại" aria-label="Số điện thoại"/><select aria-label="Dịch vụ cần tư vấn"><option>Dịch vụ cần tư vấn</option><option>Sửa laptop</option><option>Thay bàn phím</option><option>Thay màn hình</option><option>Thay pin · sạc</option></select><button className="btn primary" type="submit">{sent ? "Đã tiếp nhận yêu cầu ✓" : "Yêu cầu gọi lại"}</button></form></div></section>

      <footer><div className="container footer-grid"><div><a className="logo footer-logo" href="#top"><span className="logo-mark">MR</span><span><b>LAPTOP</b><small>.VN</small></span></a><p>Hệ thống sửa chữa laptop chuyên nghiệp, nhanh chóng và minh bạch tại TP.HCM.</p></div><div><h4>Dịch vụ</h4><a href="#dich-vu">Sửa laptop lấy liền</a><a href="#san-pham">Linh kiện laptop</a><a href="#quy-trinh">Chính sách bảo hành</a></div><div><h4>Hỗ trợ</h4><a href="tel:0931640640">0931.640.640</a><a href="#cua-hang">Hệ thống cửa hàng</a><a href="#lien-he">Đăng ký tư vấn</a></div><div><h4>Giờ làm việc</h4><p>Thứ 2–7: 8:30–18:30<br/>Chủ nhật: 9:00–17:00</p></div></div><div className="copyright container">© 2012–2026 MrLaptop.vn · Thiết kế phục vụ trải nghiệm khách hàng.</div></footer>
      <a className="floating-call" href="tel:0931640640" aria-label="Gọi hotline">☎<span>Gọi ngay</span></a>
    </main>
  );
}
