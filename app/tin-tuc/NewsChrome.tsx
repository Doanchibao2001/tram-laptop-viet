import Link from "next/link";
import { fallbackSiteSettings } from "@/sanity/fallback";
import type { SiteSettings } from "@/sanity/types";

type NewsChromeProps = {
  siteSettings?: SiteSettings;
};

export function NewsHeader({ siteSettings = fallbackSiteSettings }: NewsChromeProps) {
  const { hotline, hotlineDisplay } = siteSettings;
  return (
    <>
      <div className="topbar"><div className="container topbar-inner"><span>Trạm Laptop Việt · Tin tức và kinh nghiệm laptop</span><a href={`tel:${hotline}`}>Hotline: <b>{hotlineDisplay}</b></a></div></div>
      <header className="news-site-header">
        <div className="container news-header-inner">
          <Link className="logo tram-brand" href="/" aria-label="Trạm Laptop Việt trang chủ"><img className="tram-logo" src="/tram-laptop-viet/logo-round.jpg" alt="Logo Trạm Laptop Việt" /><span className="tram-wordmark"><b>TRẠM LAPTOP</b><strong>VIỆT</strong></span></Link>
          <nav aria-label="Điều hướng tin tức"><Link href="/">Trang chủ</Link><Link href="/#dich-vu">Dịch vụ</Link><Link href="/tin-tuc" aria-current="page">Tin tức</Link><Link href="/#cua-hang">Cửa hàng</Link></nav>
          <a className="news-header-call" href={`tel:${hotline}`}>☎ {hotlineDisplay}</a>
        </div>
      </header>
    </>
  );
}

export function NewsFooter({ siteSettings = fallbackSiteSettings }: NewsChromeProps) {
  const { footerDescription, hotline, hotlineDisplay } = siteSettings;
  return (
    <footer className="news-footer"><div className="container news-footer-inner"><div><b>TRẠM LAPTOP VIỆT</b><p>{footerDescription}</p></div><div><Link href="/">Trang chủ</Link><Link href="/tin-tuc">Tin tức</Link><Link href="/#lien-he">Liên hệ</Link></div><a href={`tel:${hotline}`}>Hotline: {hotlineDisplay}</a></div></footer>
  );
}
