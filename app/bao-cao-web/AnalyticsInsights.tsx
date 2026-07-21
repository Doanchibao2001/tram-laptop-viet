"use client";

import { useMemo, useState } from "react";

export type DailyPoint = {
  key: string;
  views: number;
  sessions: number;
  leads: number;
};

export type VisitorSummary = {
  id: string;
  ipHash?: string;
  sessions: number;
  pageViews: number;
  firstSeen: string;
  lastSeen: string;
  location: string;
  source: string;
  returning: boolean;
};

function points(values: number[], width: number, height: number, max: number): string {
  return values.map((value, index) => {
    const x = values.length === 1 ? width / 2 : (index / (values.length - 1)) * width;
    const y = height - (value / Math.max(1, max)) * height;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

function TrendChart({ daily }: { daily: DailyPoint[] }) {
  const width = 760;
  const height = 210;
  const max = Math.max(1, ...daily.flatMap((day) => [day.views, day.sessions, day.leads]));
  const lines = [
    { label: "Lượt xem", color: "#a81020", values: daily.map((day) => day.views) },
    { label: "Phiên", color: "#252a2e", values: daily.map((day) => day.sessions) },
    { label: "Chuyển đổi", color: "#1f8a4c", values: daily.map((day) => day.leads) },
  ];

  return (
    <section className="report-panel trend-panel">
      <div className="trend-heading"><div><span>DIỄN BIẾN 14 NGÀY</span><h2>Xu hướng lên · xuống</h2></div><div className="chart-legend">{lines.map((line) => <span key={line.label}><i style={{ background: line.color }} />{line.label}</span>)}</div></div>
      <div className="chart-wrap">
        <svg viewBox={`-36 -12 ${width + 48} ${height + 54}`} role="img" aria-label="Biểu đồ xu hướng lượt xem, phiên và chuyển đổi">
          {[0, .25, .5, .75, 1].map((ratio) => <g key={ratio}><line x1="0" y1={height * ratio} x2={width} y2={height * ratio} stroke="#e6e8ea" /><text x="-8" y={height * ratio + 4} textAnchor="end" fontSize="10" fill="#72787d">{Math.round(max * (1 - ratio))}</text></g>)}
          {lines.map((line) => <polyline key={line.label} points={points(line.values, width, height, max)} fill="none" stroke={line.color} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />)}
          {daily.map((day, index) => index % 2 === 0 ? <text key={day.key} x={(index / Math.max(1, daily.length - 1)) * width} y={height + 25} textAnchor="middle" fontSize="10" fill="#72787d">{day.key.slice(5).split("-").reverse().join("/")}</text> : null)}
        </svg>
      </div>
    </section>
  );
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}

export default function AnalyticsInsights({ daily, visitors }: { daily: DailyPoint[]; visitors: VisitorSummary[] }) {
  const [query, setQuery] = useState("");
  const [source, setSource] = useState("all");
  const [returningOnly, setReturningOnly] = useState(false);
  const sources = useMemo(() => [...new Set(visitors.map((visitor) => visitor.source))].sort(), [visitors]);
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return visitors.filter((visitor) => {
      const matchesText = !term || [visitor.id, visitor.ipHash, visitor.location, visitor.source].filter(Boolean).some((value) => value?.toLowerCase().includes(term));
      return matchesText && (source === "all" || visitor.source === source) && (!returningOnly || visitor.returning);
    }).slice(0, 100);
  }, [query, returningOnly, source, visitors]);

  return <>
    <TrendChart daily={daily} />
    <section className="report-panel visitor-panel">
      <div className="visitor-head"><div><span>KHÁCH TRUY CẬP ẨN DANH</span><h2>IP và khách quay lại</h2><p>Lọc bằng mã IP ẩn danh, mã khách, khu vực hoặc nguồn. IP gốc không được lưu.</p></div><div className="visitor-totals"><b>{visitors.filter((visitor) => visitor.returning).length}</b><small>khách quay lại</small></div></div>
      <div className="visitor-filters">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm mã IP, mã khách, khu vực…" aria-label="Tìm khách truy cập" />
        <select value={source} onChange={(event) => setSource(event.target.value)} aria-label="Lọc nguồn truy cập"><option value="all">Tất cả nguồn</option>{sources.map((item) => <option key={item} value={item}>{item}</option>)}</select>
        <label><input type="checkbox" checked={returningOnly} onChange={(event) => setReturningOnly(event.target.checked)} /> Chỉ khách quay lại</label>
      </div>
      <div className="visitor-result">Hiển thị <b>{filtered.length}</b> / {visitors.length} khách</div>
      <div style={{ overflowX: "auto" }}><table className="daily-table visitor-table"><thead><tr><th>Mã khách</th><th>Mã IP hôm nay</th><th>Khu vực</th><th>Nguồn</th><th>Phiên</th><th>Lượt xem</th><th>Trạng thái</th><th>Lần cuối</th></tr></thead><tbody>{filtered.map((visitor) => <tr key={visitor.id}><td><code>{visitor.id.slice(0, 10)}</code></td><td><code>{visitor.ipHash?.slice(0, 10) ?? "—"}</code></td><td>{visitor.location}</td><td>{visitor.source}</td><td>{visitor.sessions}</td><td>{visitor.pageViews}</td><td><span className={visitor.returning ? "returning-badge" : "new-badge"}>{visitor.returning ? "Quay lại" : "Mới"}</span></td><td>{formatDate(visitor.lastSeen)}</td></tr>)}</tbody></table></div>
    </section>
  </>;
}
