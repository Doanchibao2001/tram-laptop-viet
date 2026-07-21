"use client";

import { useMemo, useState } from "react";

export type DailyPoint = { key: string; views: number; sessions: number; leads: number };
export type HeartbeatBucket = {
  date: string;
  hour: number;
  weekday: number;
  location: string;
  source: string;
  count: number;
};

const WEEKDAYS = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

function points(values: number[], width: number, height: number, max: number): string {
  return values.map((value, index) => {
    const x = values.length === 1 ? width / 2 : (index / (values.length - 1)) * width;
    const y = height - (value / Math.max(1, max)) * height;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

function LineChart({ labels, series }: { labels: string[]; series: Array<{ label: string; color: string; values: number[] }> }) {
  const width = 760;
  const height = 210;
  const max = Math.max(1, ...series.flatMap((item) => item.values));
  return <div className="chart-wrap"><svg viewBox={`-36 -12 ${width + 48} ${height + 54}`} role="img" aria-label="Biểu đồ xu hướng">
    {[0, .25, .5, .75, 1].map((ratio) => <g key={ratio}><line x1="0" y1={height * ratio} x2={width} y2={height * ratio} stroke="#e6e8ea" /><text x="-8" y={height * ratio + 4} textAnchor="end" fontSize="10" fill="#72787d">{Math.round(max * (1 - ratio))}</text></g>)}
    {series.map((item) => <polyline key={item.label} points={points(item.values, width, height, max)} fill="none" stroke={item.color} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />)}
    {labels.map((label, index) => index % Math.max(1, Math.ceil(labels.length / 8)) === 0 ? <text key={`${label}-${index}`} x={(index / Math.max(1, labels.length - 1)) * width} y={height + 25} textAnchor="middle" fontSize="10" fill="#72787d">{label}</text> : null)}
  </svg></div>;
}

function BarChart({ items, color = "#a81020" }: { items: Array<{ label: string; value: number }>; color?: string }) {
  const max = Math.max(1, ...items.map((item) => item.value));
  return <div className="bar-chart">{items.map((item) => <div className="bar-row" key={item.label}><span>{item.label}</span><div><i style={{ width: `${Math.max(2, item.value / max * 100)}%`, background: color }} /></div><b>{item.value}</b></div>)}</div>;
}

function csvCell(value: string | number): string {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function downloadCsv(buckets: HeartbeatBucket[]) {
  const rows = [
    ["Ngày", "Giờ", "Thứ", "Khu vực", "Nguồn", "Số heartbeat"],
    ...buckets.map((item) => [item.date, item.hour, WEEKDAYS[item.weekday] ?? "Không xác định", item.location, item.source, item.count]),
  ];
  const csv = "\uFEFF" + rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `tlv-heartbeat-${new Date().toISOString().slice(0, 10)}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function AnalyticsInsights({ daily, heartbeatBuckets }: { daily: DailyPoint[]; heartbeatBuckets: HeartbeatBucket[] }) {
  const [days, setDays] = useState(14);
  const [breakdown, setBreakdown] = useState<"day" | "hour" | "weekday">("day");
  const [location, setLocation] = useState("all");
  const [source, setSource] = useState("all");
  const locations = useMemo(() => [...new Set(heartbeatBuckets.map((item) => item.location))].sort(), [heartbeatBuckets]);
  const sources = useMemo(() => [...new Set(heartbeatBuckets.map((item) => item.source))].sort(), [heartbeatBuckets]);
  const filtered = useMemo(() => {
    const latestDate = heartbeatBuckets.reduce((latest, item) => item.date > latest ? item.date : latest, "1970-01-01");
    const threshold = new Date(new Date(`${latestDate}T00:00:00Z`).getTime() - (days - 1) * 86400000).toISOString().slice(0, 10);
    return heartbeatBuckets.filter((item) => item.date >= threshold && (location === "all" || item.location === location) && (source === "all" || item.source === source));
  }, [days, heartbeatBuckets, location, source]);
  const heartbeatTotal = filtered.reduce((sum, item) => sum + item.count, 0);
  const aggregate = (selector: (item: HeartbeatBucket) => string) => {
    const result = new Map<string, number>();
    for (const item of filtered) result.set(selector(item), (result.get(selector(item)) ?? 0) + item.count);
    return result;
  };
  const byDate = aggregate((item) => item.date);
  const dateLabels = [...byDate.keys()].sort();
  const byHour = aggregate((item) => String(item.hour));
  const byWeekday = aggregate((item) => String(item.weekday));
  const byLocation = [...aggregate((item) => item.location).entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, 12);

  return <>
    <section className="report-panel trend-panel">
      <div className="trend-heading"><div><span>DIỄN BIẾN 14 NGÀY</span><h2>Xu hướng website</h2></div><div className="chart-legend"><span><i style={{ background: "#a81020" }} />Lượt xem</span><span><i style={{ background: "#252a2e" }} />Phiên</span><span><i style={{ background: "#1f8a4c" }} />Chuyển đổi</span></div></div>
      <LineChart labels={daily.map((item) => item.key.slice(5).split("-").reverse().join("/"))} series={[{ label: "Lượt xem", color: "#a81020", values: daily.map((item) => item.views) }, { label: "Phiên", color: "#252a2e", values: daily.map((item) => item.sessions) }, { label: "Chuyển đổi", color: "#1f8a4c", values: daily.map((item) => item.leads) }]} />
    </section>
    <section className="report-panel heartbeat-analysis">
      <div className="heartbeat-title"><div><span className="live-dot" /><span>PHÂN TÍCH HEARTBEAT</span><h2>Thời điểm khách đang hoạt động</h2><p>Mỗi heartbeat tương ứng một tab còn hiển thị trong chu kỳ 30 giây; không phải tín hiệu mua hàng.</p></div><div className="heartbeat-total"><b>{heartbeatTotal.toLocaleString("vi-VN")}</b><small>heartbeat đã lọc</small></div></div>
      <div className="heartbeat-filters"><select value={days} onChange={(event) => setDays(Number(event.target.value))}><option value={7}>7 ngày</option><option value={14}>14 ngày</option><option value={30}>30 ngày</option></select><select value={breakdown} onChange={(event) => setBreakdown(event.target.value as "day" | "hour" | "weekday")}><option value="day">Nhóm theo ngày</option><option value="hour">Nhóm theo giờ</option><option value="weekday">Nhóm theo thứ</option></select><select value={location} onChange={(event) => setLocation(event.target.value)}><option value="all">Tất cả khu vực</option>{locations.map((item) => <option key={item} value={item}>{item}</option>)}</select><select value={source} onChange={(event) => setSource(event.target.value)}><option value="all">Tất cả nguồn</option>{sources.map((item) => <option key={item} value={item}>{item}</option>)}</select><button type="button" onClick={() => downloadCsv(filtered)}>Xuất Excel/CSV</button></div>
      <div className="heartbeat-grid">
        <div className="mini-panel">
          {breakdown === "day" && <><h3>Theo ngày</h3><LineChart labels={dateLabels.map((item) => item.slice(5).split("-").reverse().join("/"))} series={[{ label: "Heartbeat", color: "#a81020", values: dateLabels.map((item) => byDate.get(item) ?? 0) }]} /></>}
          {breakdown === "hour" && <><h3>Theo giờ trong ngày</h3><BarChart items={Array.from({ length: 24 }, (_, hour) => ({ label: `${String(hour).padStart(2, "0")}:00`, value: byHour.get(String(hour)) ?? 0 }))} /></>}
          {breakdown === "weekday" && <><h3>Theo thứ trong tuần</h3><BarChart color="#252a2e" items={WEEKDAYS.map((label, index) => ({ label, value: byWeekday.get(String(index)) ?? 0 }))} /></>}
        </div>
        <div className="mini-panel"><h3>Phân bổ địa lý</h3><BarChart color="#1f8a4c" items={byLocation} /></div>
      </div>
    </section>
  </>;
}
