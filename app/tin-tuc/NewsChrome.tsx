const hotline = "0343323865";
const hotlineDisplay = "0343.323.865";

export function NewsHeader() {
  return (
    <>
      <div className="topbar"><div className="container topbar-inner"><span>Trạm Laptop Việt · Tin tức và kinh nghiệm laptop</span><a href={`tel:${hotline}`}>Hotline: <b>{hotlineDisplay}</b></a></div></div>
      <header className="news-site-header">
        <div className="container news-header-inner">
          <a className="logo tram-brand" href="/" aria-label="Trạm Laptop Việt trang chủ"><img className="tram-logo" src="/tram-laptop-viet/logo-round.jpg" alt="Logo Trạm Laptop Việt" /><span className="tram-wordmark"><b>TRẠM LAPTOP</b><strong>VIỆT</strong></span></a>
          <nav aria-label="Điều hướng tin tức"><a href="/">Trang chủ</a><a href="/#dich-vu">Dịch vụ</a><a href="/tin-tuc" aria-current="page">Tin tức</a><a href="/#cua-hang">Cửa hàng</a></nav>
          <a className="news-header-call" href={`tel:${hotline}`}>☎ {hotlineDisplay}</a>
        </div>
      </header>
    </>
  );
}

export function NewsFooter() {
  return (
    <footer className="news-footer"><div className="container news-footer-inner"><div><b>TRẠM LAPTOP VIỆT</b><p>Sửa chữa · Nâng cấp · Bảo hành laptop</p></div><div><a href="/">Trang chủ</a><a href="/tin-tuc">Tin tức</a><a href="/#lien-he">Liên hệ</a></div><a href={`tel:${hotline}`}>Hotline: {hotlineDisplay}</a></div></footer>
  );
}
