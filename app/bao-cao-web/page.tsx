import type { Metadata } from "next";
import { cookies } from "next/headers";
import {
  ANALYTICS_COOKIE,
  configuredDashboardSecret,
  validAnalyticsCookie,
} from "@/lib/analytics-auth";
import { hasSanityWriteToken, sanityServerClient } from "@/sanity/lib/server-client";
import RealtimeVisitors from "./RealtimeVisitors";
import AnalyticsInsights, { type HeartbeatBucket } from "./AnalyticsInsights";

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
  country?: string;
  region?: string;
  city?: string;
  ipHash?: string;
  visitorId?: string;
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

function eventSource(event: WebEvent): string {
  if (event.utmSource) return event.utmMedium ? `${event.utmSource} / ${event.utmMedium}` : event.utmSource;
  return event.referrerHost || "Truy cập trực tiếp";
}

function heartbeatBuckets(events: WebEvent[]): HeartbeatBucket[] {
  const buckets = new Map<string, HeartbeatBucket>();
  for (const event of events.filter((item) => item.eventName === "heartbeat" && item.occurredAt)) {
    const local = new Date(new Date(event.occurredAt as string).getTime() + 7 * 60 * 60 * 1000);
    const date = local.toISOString().slice(0, 10);
    const hour = local.getUTCHours();
    const weekday = local.getUTCDay();
    const location = [event.city, event.region, event.country].filter(Boolean).join(", ") || "Không xác định";
    const source = eventSource(event);
    const key = [date, hour, weekday, location, source].join("|");
    const current = buckets.get(key);
    if (current) current.count += 1;
    else buckets.set(key, { date, hour, weekday, location, source, count: 1 });
  }
  return [...buckets.values()];
}

function InterestSignalReview({ events }: { events: WebEvent[] }) {
  const rows = [
    { label: "Gọi / Zalo / gửi form / hỏi giá", level: "Mạnh", note: "Ý định liên hệ trực tiếp", events: events.filter((event) => CONVERSION_EVENTS.has(event.eventName ?? "")) },
    { label: "Nhấp CTA tư vấn", level: "Trung bình", note: "Có ý định nhưng chưa chắc đã liên hệ", events: events.filter((event) => event.eventName === "cta_click") },
    { label: "Đọc tới 90%", level: "Trung bình", note: "Quan tâm sâu đến nội dung", events: events.filter((event) => event.eventName === "scroll_90") },
    { label: "Ở lại trên 30 giây", level: "Hỗ trợ", note: "Chỉ dùng kèm tín hiệu khác", events: events.filter((event) => event.eventName === "engaged_30s") },
    { label: "Cuộn 50%", level: "Yếu", note: "Không đủ để kết luận quan tâm", events: events.filter((event) => event.eventName === "scroll_50") },
  ];
  return <section className="report-panel signal-panel"><div className="signal-head"><div><span>CHUẨN HÀNH VI MARKETING</span><h2>Tín hiệu khách quan tâm</h2><p>Heartbeat không được tính là quan tâm; nó chỉ xác nhận tab vẫn đang hoạt động.</p></div></div><div style={{ overflowX: "auto" }}><table className="daily-table signal-table"><thead><tr><th>Hành vi</th><th>Mức tín hiệu</th><th>Phiên 7 ngày</th><th>Cách hiểu</th></tr></thead><tbody>{rows.map((row) => <tr key={row.label}><td>{row.label}</td><td><b>{row.level}</b></td><td>{uniqueSessions(row.events)}</td><td>{row.note}</td></tr>)}</tbody></table></div></section>;
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
  :root{color-scheme:light}.analytics-page{min-height:100vh;background:#f5f6f7;color:#272b2f;font-family:"Be Vietnam Pro",system-ui,sans-serif;padding:42px 20px}.analytics-shell{width:min(1180px,100%);margin:auto}.analytics-head{display:flex;justify-content:space-between;gap:24px;align-items:end;margin-bottom:26px}.analytics-head span,.trend-heading>div>span,.heartbeat-title>div>span:not(.live-dot),.signal-head span{color:#a81020;font-size:12px;font-weight:800;letter-spacing:.12em}.analytics-head h1{font-size:clamp(30px,4vw,48px);line-height:1.1;margin:8px 0}.analytics-head p{color:#62686d;margin:0}.analytics-status{background:#fff;border:1px solid #e3e5e7;border-radius:14px;padding:14px 16px;font-size:12px}.metric-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:14px}.metric-card,.report-panel,.login-card{background:#fff;border:1px solid #e3e5e7;border-radius:16px;box-shadow:0 8px 24px rgba(39,43,47,.05)}.metric-card{padding:20px}.metric-card span,.metric-card small{display:block;color:#747a7f}.metric-card span{font-size:12px;font-weight:700}.metric-card strong{display:block;font-size:30px;margin:8px 0;color:#a81020}.metric-card small{font-size:11px}.report-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-top:16px}.report-panel{padding:22px}.report-panel h2{font-size:18px;margin:0 0 16px}.ranking-list{list-style:none;padding:0;margin:0}.ranking-list li{display:flex;justify-content:space-between;gap:18px;padding:11px 0;border-bottom:1px solid #eceef0;font-size:13px}.ranking-list li:last-child{border-bottom:0}.ranking-list span{overflow-wrap:anywhere}.ranking-list b{color:#a81020}.daily-table{width:100%;border-collapse:collapse;font-size:13px}.daily-table th,.daily-table td{text-align:right;padding:10px;border-bottom:1px solid #eceef0}.daily-table th:first-child,.daily-table td:first-child{text-align:left}.realtime-head,.trend-heading,.heartbeat-title{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;margin-bottom:14px}.realtime-head b{font-size:12px;color:#16803c;letter-spacing:.08em}.realtime-head h2{font-size:24px;margin:8px 0 0}.realtime-head small{color:#747a7f}.live-dot{display:inline-block;width:9px;height:9px;border-radius:50%;background:#21a453;box-shadow:0 0 0 5px rgba(33,164,83,.12);margin-right:10px;animation:pulse 1.4s infinite}.realtime-table th,.realtime-table td{text-align:left}.trend-panel,.heartbeat-analysis,.signal-panel{margin-top:16px}.trend-heading h2,.heartbeat-title h2,.signal-head h2{font-size:24px;margin:7px 0}.chart-legend{display:flex;gap:16px;flex-wrap:wrap;font-size:12px}.chart-legend span{display:flex;align-items:center;gap:7px}.chart-legend i{width:20px;height:4px;border-radius:10px}.chart-wrap{width:100%;overflow-x:auto}.chart-wrap svg{display:block;width:100%;min-width:680px;height:auto}.heartbeat-title p,.signal-head p{margin:0;color:#747a7f;font-size:12px}.heartbeat-total{text-align:right}.heartbeat-total b{display:block;color:#a81020;font-size:30px}.heartbeat-total small{color:#747a7f}.heartbeat-filters{display:grid;grid-template-columns:160px 1fr 1fr auto;gap:10px;margin:18px 0}.heartbeat-filters select,.heartbeat-filters button{height:44px;border-radius:10px;padding:0 12px;font:inherit}.heartbeat-filters select{border:1px solid #d7dadd;background:#fff}.heartbeat-filters button{border:0;background:#a81020;color:#fff;font-weight:800;cursor:pointer}.heartbeat-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.mini-panel{border:1px solid #e6e8ea;border-radius:14px;padding:16px;min-width:0}.mini-panel h3{font-size:14px;margin:0 0 14px}.mini-panel .chart-wrap svg{min-width:520px}.bar-chart{display:grid;gap:7px;max-height:330px;overflow:auto}.bar-row{display:grid;grid-template-columns:92px 1fr 42px;align-items:center;gap:9px;font-size:11px}.bar-row>div{height:8px;background:#f0f1f2;border-radius:999px;overflow:hidden}.bar-row i{display:block;height:100%;border-radius:999px}.bar-row b{text-align:right}.signal-table th,.signal-table td{text-align:left}.signal-table b{color:#a81020}.empty-report{color:#777}.login-wrap{min-height:78vh;display:grid;place-items:center}.login-card{width:min(430px,100%);padding:32px}.login-card h1{margin-top:0}.login-card p{color:#62686d;line-height:1.6}.login-card label{display:block;font-size:12px;font-weight:700;margin-bottom:8px}.login-card input{width:100%;height:48px;border:1px solid #d7dadd;border-radius:12px;padding:0 14px;font:inherit}.login-card button{width:100%;height:48px;border:0;border-radius:12px;background:#a81020;color:#fff;font-weight:800;margin-top:12px;cursor:pointer}.login-error{color:#a81020!important;font-weight:700}.setup-note{margin-top:18px;padding:14px;background:#fff7f7;border:1px solid #efd4d7;border-radius:12px;font-size:12px}@keyframes pulse{0%,100%{box-shadow:0 0 0 4px rgba(33,164,83,.12)}50%{box-shadow:0 0 0 9px rgba(33,164,83,.03)}}@media(max-width:900px){.metric-grid{grid-template-columns:repeat(2,1fr)}.report-grid,.heartbeat-grid{grid-template-columns:1fr}.analytics-head,.realtime-head,.trend-heading,.heartbeat-title{align-items:start;flex-direction:column}.heartbeat-filters{grid-template-columns:1fr}}@media(max-width:520px){.metric-grid{grid-template-columns:1fr}.analytics-page{padding:26px 14px}}
`;
const dashboardLayoutCss = `${dashboardCss}.heartbeat-filters{grid-template-columns:140px 170px 1fr 1fr auto}@media(max-width:900px){.heartbeat-filters{grid-template-columns:1fr}}`;

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
      <main className="analytics-page"><style>{dashboardLayoutCss}</style><div className="analytics-shell login-wrap"><section className="login-card">
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
    `*[_type == "webEvent" && occurredAt >= $since] | order(occurredAt desc)[0...50000]{eventName,path,sessionId,visitorId,occurredAt,referrerHost,utmSource,utmMedium,utmCampaign,deviceType,label,country,region,city,ipHash}`,
    { since },
    { cache: "no-store" },
  );
  const last7 = recent(events, 7);
  const views7 = last7.filter((event) => event.eventName === "page_view");
  const conversions7 = last7.filter((event) => event.eventName && CONVERSION_EVENTS.has(event.eventName));
  const sessions7 = uniqueSessions(views7);
  const convertingSessions7 = uniqueSessions(conversions7);
  const conversionRate = sessions7 ? convertingSessions7 / sessions7 : 0;
  const interestEvents7 = last7.filter((event) => CONVERSION_EVENTS.has(event.eventName ?? "") || event.eventName === "cta_click" || event.eventName === "scroll_90" || event.eventName === "engaged_30s");
  const interestedSessions7 = uniqueSessions(interestEvents7);

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
    <main className="analytics-page"><style>{dashboardLayoutCss}</style><div className="analytics-shell">
      <header className="analytics-head"><div><span>FIRST-PARTY ANALYTICS</span><h1>Hiệu quả website</h1><p>Dữ liệu 30 ngày gần nhất; không lưu IP thô hoặc nội dung khách nhập vào biểu mẫu. Khu vực được suy ra gần đúng từ IP.</p></div><div className="analytics-status">Lưu sự kiện: <b>{hasSanityWriteToken() ? "Đang hoạt động" : "Chưa có SANITY_WRITE_TOKEN"}</b></div></header>
      <section className="metric-grid">
        <SummaryCard label="Lượt xem · 7 ngày" value={formatNumber(views7.length)} note="Sự kiện page_view" />
        <SummaryCard label="Phiên truy cập · 7 ngày" value={formatNumber(sessions7)} note="Đếm session ẩn danh" />
        <SummaryCard label="Phiên có chuyển đổi" value={formatNumber(convertingSessions7)} note="Gọi, Zalo, form hoặc hỏi giá" />
        <SummaryCard label="Tỷ lệ chuyển đổi" value={formatPercent(conversionRate)} note="Phiên chuyển đổi / tổng phiên" />
        <SummaryCard label="Phiên có quan tâm" value={formatNumber(interestedSessions7)} note="CTA, đọc sâu, ở lại hoặc chuyển đổi" />
      </section>
      <RealtimeVisitors />
      <AnalyticsInsights daily={daily} heartbeatBuckets={heartbeatBuckets(events)} />
      <InterestSignalReview events={last7} />
      <section className="report-grid">
        <Ranking title="Trang được xem nhiều" items={countBy(events.filter((event) => event.eventName === "page_view"), (event) => event.path)} />
        <Ranking title="Hành động chuyển đổi" items={countBy(events.filter((event) => event.eventName && CONVERSION_EVENTS.has(event.eventName)), (event) => event.eventName)} />
        <Ranking title="Nguồn giới thiệu" items={countBy(events, (event) => event.referrerHost ?? (event.eventName === "page_view" ? "Truy cập trực tiếp" : undefined))} />
        <Ranking title="Nguồn chiến dịch UTM" items={countBy(events, (event) => event.utmSource)} />
        <Ranking title="Thiết bị" items={countBy(events.filter((event) => event.eventName === "page_view"), (event) => event.deviceType)} />
        <Ranking title="CTA được quan tâm" items={countBy(events.filter((event) => CONVERSION_EVENTS.has(event.eventName ?? "") || event.eventName === "cta_click"), (event) => event.label)} />
      </section>
    </div></main>
  );
}
