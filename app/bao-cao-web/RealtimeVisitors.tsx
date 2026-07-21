"use client";

import { useCallback, useEffect, useState } from "react";

type ActiveVisitor = {
  sessionId: string;
  path: string;
  source: string;
  campaign?: string;
  deviceType: string;
  location: string;
  lastSeen: string;
};

type RealtimeResponse = {
  activeCount: number;
  generatedAt: string;
  windowSeconds: number;
  visitors: ActiveVisitor[];
};

function relativeTime(value: string): string {
  const seconds = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 1000));
  if (seconds < 10) return "Vừa xong";
  if (seconds < 60) return `${seconds} giây trước`;
  return `${Math.floor(seconds / 60)} phút trước`;
}

export default function RealtimeVisitors() {
  const [data, setData] = useState<RealtimeResponse>();
  const [error, setError] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/bao-cao-web/api/realtime", { cache: "no-store" });
      if (!response.ok) throw new Error("Realtime analytics unavailable");
      setData(await response.json() as RealtimeResponse);
      setError(false);
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    const initialTimer = window.setTimeout(() => void refresh(), 0);
    const timer = window.setInterval(() => void refresh(), 10_000);
    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(timer);
    };
  }, [refresh]);

  return (
    <section className="report-panel realtime-panel" style={{ marginTop: 16 }}>
      <div className="realtime-head">
        <div>
          <span className="live-dot" aria-hidden="true" />
          <b>ĐANG TRUY CẬP REALTIME</b>
          <h2>{data ? `${data.activeCount} phiên đang hoạt động` : "Đang tải dữ liệu…"}</h2>
        </div>
        <small>Tự cập nhật mỗi 10 giây · cửa sổ hoạt động 2 phút</small>
      </div>
      {error ? <p className="login-error">Không thể tải dữ liệu realtime. Hệ thống sẽ tự thử lại.</p> : null}
      {data?.visitors.length ? (
        <div style={{ overflowX: "auto" }}>
          <table className="daily-table realtime-table">
            <thead><tr><th>Trang đang xem</th><th>Khu vực gần đúng</th><th>Nguồn</th><th>Chiến dịch</th><th>Thiết bị</th><th>Hoạt động cuối</th></tr></thead>
            <tbody>{data.visitors.map((visitor) => (
              <tr key={visitor.sessionId}>
                <td>{visitor.path}</td>
                <td>{visitor.location}</td>
                <td>{visitor.source}</td>
                <td>{visitor.campaign ?? "—"}</td>
                <td>{visitor.deviceType}</td>
                <td>{relativeTime(visitor.lastSeen)}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : data ? <p className="empty-report">Hiện chưa có phiên nào hoạt động trong 2 phút gần nhất.</p> : null}
    </section>
  );
}
