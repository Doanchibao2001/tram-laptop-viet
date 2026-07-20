import type { Metadata } from "next";
import { cookies } from "next/headers";
import {
  ANALYTICS_COOKIE,
  configuredDashboardSecret,
  validAnalyticsCookie,
} from "@/lib/analytics-auth";
import { hasSanityWriteToken, sanityServerClient } from "@/sanity/lib/server-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Báo cáo hiệu quả website",
  robots: { index: false, follow: false },
};

type WebEvent = {
  eventName?: string;
  path?: string;
  sessionId?: string;
  occurredAt?: string;
  referrerHost?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  deviceType?: string;
  label?: string;
};

type RankedItem = { label: string; count: number };

const CONVERSION_EVENTS = new Set([
  "phone_click",
  "zalo_click",
  "form_submit",
  "product_inquiry",
]);

function countBy(events: WebEvent[], selector: (event: WebEvent) => string | undefined): RankedItem[] {
  const counts = new Map<string, number>();
  for (const event of events) {
    const value = selector(event)?.trim();
    if (!value) continue;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, 10);
}

function uniqueSessions(events: WebEvent[]): number {
  return new Set(events.map((event) => event.sessionId).filter(Boolean)).size;
}

function sinceDays(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value);
}

function formatPercent(value: number): string {
  return new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 }).format(value * 100) + "%";
}

function dateKey(value?: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString().slice(0, 10);
}

function recent(events: WebEvent[], days: number): WebEvent[] {
  const threshold = sinceDays(days).getTime();
  return events.filter((event) => {
    const time = event.occurredAt ? new Date(event.occurredAt).getTime() : 0;
    return Number.isFinite(time) && time >= threshold;
  });
}

function SummaryCard({ label, value, note }: { label: string; value: string; note: string }) {
  return <article className="metric-card"><span>{label}</span><strong>{value}</strong><small>{note}</small></article>;
}

function Ranking({ title, items }: { title: string; items: RankedItem[] }) {
  return (
    <section className="report-panel">
      <h2>{title}</h2>
      {items.length ? (
        <ol className="ranking-list">
          {items.map((item) => <li key={item.label}><span>{item.label}</span><b>{formatNumber(item.count)}</b></li>)}
        </ol>
      ) : <p className="empty-report">Chưa có dữ liệu.</p>}
    </section>
  );
}

const dashboardCss = `
  :root{color-scheme:light}.analytics-page{min-height:100vh;background:#f5f6f7;color:#272b2f;font-family:"Be Vietnam Pro",system-ui,sans-serif;padding:42px 20px}.analytics-shell{width:min(1180px,100%);margin:auto}.analytics-head{display:flex;justify-content:space-between;gap:24px;align-items:end;margin-bottom:26px}.analytics-head span{color:#a81020;font-size:12px;font-weight:800;letter-spacing:.12em}.analytics-head h1{font-size:clamp(30px,4vw,48px);line-height:1.1;margin:8px 0}.analytics-head p{color:#62686d;margin:0}.analytics-status{background:#fff;border:1px solid #e3e5e7;border-radius:14px;padding:14px 16px;font-size:12px}.metric-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:14px}.metric-card,.report-panel,.login-card{background:#fff;border:1px solid #e3e5e7;border-radius:16px;box-shadow:0 8px 24px rgba(39,43,47,.05)}.metric-card{padding:20px}.metric-card span,.metric-card small{display:block;color:#747a7f}.metric-card span{font-size:12px;font-weight:700}.metric-card strong{display:block;font-size:30px;margin:8px 0;color:#a81020}.metric-card small{font-size:11px}.report-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-top:16px}.report-panel{padding:22px}.report-panel h2{font-size:18px;margin:0 0 16px}.ranking-list{list-style:none;padding:0;margin:0}.ranking-list li{display:flex;justify-content:space-between;gap:18px;padding:11px 0;border-bottom:1px solid #eceef0;font-size:13px}.ranking-list li:last-child{border-bottom:0}.ranking-list span{overflow-wrap:anywhere}.ranking-list b{color:#a81020}.daily-table{width:100%;border-collapse:collapse;font-size:13px}.daily-table th,.daily-table td{text-align:right;padding:10px;border-bottom:1px solid #eceef0}.daily-table th:first-child,.daily-table td:first-child{text-align:left}.empty-report{color:#777}.login-wrap{min-height:78vh;display:grid;place-items:center}.login-card{width:min(430px,100%);padding:32px}.login-card h1{margin-top:0}.login-card p{color:#62686d;line-height:1.6}.login-card label{display:block;font-size:12px;font-weight:700;margin-bottom:8px}.login-card input{width:100%;height:48px;border:1px solid #d7dadd;border-radius:12px;padding:0 14px;font:inherit}.login-card button{width:100%;height:48px;border:0;border-radius:12px;background:#a81020;color:#fff;font-weight:800;margin-top:12px;cursor:pointer}.login-error{color:#a81020!important;font-weight:700}.setup-note{margin-top:18px;padding:14px;background:#fff7f7;border:1px solid #efd4d7;border-radius:12px;font-size:12px}@media(max-width:900px){.metric-grid{grid-template-columns:repeat(2,1fr)}.report-grid{grid-template-columns:1fr}.analytics-head{align-items:start;flex-direction:column}}@media(max-width:520px){.metric-grid{grid-template-columns:1fr}.analytics-page{padding:26px 14px}}
`;

export default async function AnalyticsDashboard({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const cookieStore = await cookies();
  const authenticated = validAnalyticsCookie(cookieStore.get(ANALYTICS_COOKIE)?.value);
  const { error } = await searchParams;

  if (!authenticated) {
    return (
      <main className="analytics-page"><style>{dashboardCss}</style><div className="analytics-shell login-wrap"><section className="login-card">
        <span>TRẠM LAPTOP VIỆT</span>
        <h1>Báo cáo hiệu quả website</h1>
        <p>Đăng nhập để xem lượt truy cập, nguồn khách và hành động chuyển đổi được ghi trực tiếp từ website.</p>
        {error === "invalid" && <p className="login-error">Mật khẩu không đúng.</p>}
        {error === "not-configured" && <p className="login-error">Chưa cấu hình ANALYTICS_DASHBOARD_KEY trên Vercel.</p>}
        <form action="/api/analytics/login" method="post">
          <label htmlFor="dashboard-password">Mật khẩu báo cáo</label>
          <input id="dashboard-password" name="password" type="password" required autoComplete="current-password" />
          <button type="submit">Mở báo cáo</button>
        </form>
        {!configuredDashboardSecret() && <p className="setup-note">Cần thêm biến môi trường <b>ANALYTICS_DASHBOARD_KEY</b> trước khi sử dụng.</p>}
      </section></div></main>
    );
  }

  const since = sinceDays(30).toISOString();
  const events = await sanityServerClient.fetch<WebEvent[]>(
    `*[_type == "webEvent" && occurredAt >= $since] | order(occurredAt desc)[0...10000]{eventName,path,sessionId,occurredAt,referrerHost,utmSource,utmMedium,utmCampaign,deviceType,label}`,
    { since },
    { cache: "no-store" },
  );
  const last7 = recent(events, 7);
  const views7 = last7.filter((event) => event.eventName === "page_view");
  const conversions7 = last7.filter((event) => event.eventName && CONVERSION_EVENTS.has(event.eventName));
  const sessions7 = uniqueSessions(views7);
  const convertingSessions7 = uniqueSessions(conversions7);
  const conversionRate = sessions7 ? convertingSessions7 / sessions7 : 0;
  const engaged7 = last7.filter((event) => event.eventName === "engaged_30s").length;

  const daily = Array.from({ length: 14 }, (_, index) => {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - (13 - index));
    const key = date.toISOString().slice(0, 10);
    const dayEvents = events.filter((event) => dateKey(event.occurredAt) === key);
    return {
      key,
      views: dayEvents.filter((event) => event.eventName === "page_view").length,
      sessions: uniqueSessions(dayEvents.filter((event) => event.eventName === "page_view")),
      leads: dayEvents.filter((event) => event.eventName && CONVERSION_EVENTS.has(event.eventName)).length,
    };
  });

  return (
    <main className="analytics-page"><style>{dashboardCss}</style><div className="analytics-shell">
      <header className="analytics-head"><div><span>FIRST-PARTY ANALYTICS</span><h1>Hiệu quả website</h1><p>Dữ liệu 30 ngày gần nhất, không lưu IP hoặc nội dung khách nhập vào biểu mẫu.</p></div><div className="analytics-status">Lưu sự kiện: <b>{hasSanityWriteToken() ? "Đang hoạt động" : "Chưa có SANITY_WRITE_TOKEN"}</b></div></header>
      <section className="metric-grid">
        <SummaryCard label="Lượt xem · 7 ngày" value={formatNumber(views7.length)} note="Sự kiện page_view" />
        <SummaryCard label="Phiên truy cập · 7 ngày" value={formatNumber(sessions7)} note="Đếm session ẩn danh" />
        <SummaryCard label="Phiên có chuyển đổi" value={formatNumber(convertingSessions7)} note="Gọi, Zalo, form hoặc hỏi giá" />
        <SummaryCard label="Tỷ lệ chuyển đổi" value={formatPercent(conversionRate)} note="Phiên chuyển đổi / tổng phiên" />
        <SummaryCard label="Ở lại trên 30 giây" value={formatNumber(engaged7)} note="Tín hiệu quan tâm nội dung" />
      </section>
      <section className="report-grid">
        <Ranking title="Trang được xem nhiều" items={countBy(events.filter((event) => event.eventName === "page_view"), (event) => event.path)} />
        <Ranking title="Hành động chuyển đổi" items={countBy(events.filter((event) => event.eventName && CONVERSION_EVENTS.has(event.eventName)), (event) => event.eventName)} />
        <Ranking title="Nguồn giới thiệu" items={countBy(events, (event) => event.referrerHost ?? (event.eventName === "page_view" ? "Truy cập trực tiếp" : undefined))} />
        <Ranking title="Nguồn chiến dịch UTM" items={countBy(events, (event) => event.utmSource)} />
        <Ranking title="Thiết bị" items={countBy(events.filter((event) => event.eventName === "page_view"), (event) => event.deviceType)} />
        <Ranking title="CTA được quan tâm" items={countBy(events.filter((event) => CONVERSION_EVENTS.has(event.eventName ?? "") || event.eventName === "cta_click"), (event) => event.label)} />
      </section>
      <section className="report-panel" style={{ marginTop: 16 }}><h2>Diễn biến 14 ngày</h2><div style={{ overflowX: "auto" }}><table className="daily-table"><thead><tr><th>Ngày</th><th>Lượt xem</th><th>Phiên</th><th>Chuyển đổi</th></tr></thead><tbody>{daily.map((row) => <tr key={row.key}><td>{row.key.split("-").reverse().join("/")}</td><td>{formatNumber(row.views)}</td><td>{formatNumber(row.sessions)}</td><td>{formatNumber(row.leads)}</td></tr>)}</tbody></table></div></section>
    </div></main>
  );
}
