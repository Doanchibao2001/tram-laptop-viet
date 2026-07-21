"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

type EventName =
  | "page_view"
  | "cta_click"
  | "phone_click"
  | "zalo_click"
  | "product_inquiry"
  | "form_submit"
  | "navigation_click"
  | "scroll_50"
  | "scroll_90"
  | "engaged_30s"
  | "heartbeat";

type EventDetails = {
  label?: string;
  target?: string;
};

const SESSION_KEY = "tlv_analytics_session";
const VISITOR_KEY = "tlv_analytics_visitor";
const CAMPAIGN_KEY = "tlv_analytics_campaign";
const SKIPPED_PATHS = ["/bao-cao-web", "/api/", "/studio", "/__debug"];

function sessionId(): string {
  const existing = window.sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  window.sessionStorage.setItem(SESSION_KEY, id);
  return id;
}

function visitorId(): string {
  const existing = window.localStorage.getItem(VISITOR_KEY);
  if (existing) return existing;
  const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  window.localStorage.setItem(VISITOR_KEY, id);
  return id;
}

function referrerHost(): string | undefined {
  if (!document.referrer) return undefined;
  try {
    const host = new URL(document.referrer).host;
    return host === window.location.host ? undefined : host;
  } catch {
    return undefined;
  }
}

function campaign(searchParams: URLSearchParams) {
  const current = {
    utmSource: searchParams.get("utm_source") ?? undefined,
    utmMedium: searchParams.get("utm_medium") ?? undefined,
    utmCampaign: searchParams.get("utm_campaign") ?? undefined,
  };
  if (current.utmSource || current.utmMedium || current.utmCampaign) {
    window.sessionStorage.setItem(CAMPAIGN_KEY, JSON.stringify(current));
    return current;
  }
  try {
    return JSON.parse(window.sessionStorage.getItem(CAMPAIGN_KEY) ?? "{}") as typeof current;
  } catch {
    return {};
  }
}

function sendEvent(eventName: EventName, details: EventDetails = {}) {
  if (navigator.doNotTrack === "1") return;
  if (SKIPPED_PATHS.some((prefix) => window.location.pathname.startsWith(prefix))) return;

  const searchParams = new URLSearchParams(window.location.search);
  const payload = JSON.stringify({
    eventName,
    path: window.location.pathname,
    title: document.title,
    label: details.label,
    target: details.target,
    sessionId: sessionId(),
    visitorId: visitorId(),
    referrerHost: referrerHost(),
    ...campaign(searchParams),
    viewportWidth: window.innerWidth,
    language: navigator.language,
  });

  if (navigator.sendBeacon) {
    const accepted = navigator.sendBeacon(
      "/api/analytics/event",
      new Blob([payload], { type: "application/json" }),
    );
    if (accepted) return;
  }

  void fetch("/api/analytics/event", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: payload,
    keepalive: true,
    credentials: "same-origin",
  }).catch(() => undefined);
}

function readableLabel(element: Element): string | undefined {
  const explicit = element.getAttribute("data-analytics-label");
  if (explicit) return explicit.trim().slice(0, 180);
  const aria = element.getAttribute("aria-label");
  if (aria) return aria.trim().slice(0, 180);
  return element.textContent?.replace(/\s+/g, " ").trim().slice(0, 180) || undefined;
}

function classifyClick(element: HTMLElement): EventName | undefined {
  const explicit = element.dataset.analyticsEvent as EventName | undefined;
  if (explicit) return explicit;

  const anchor = element.closest("a") as HTMLAnchorElement | null;
  const href = anchor?.href ?? "";
  const label = readableLabel(element)?.toLowerCase() ?? "";

  if (href.startsWith("tel:")) return "phone_click";
  if (/zalo\.me|zalo/i.test(href) || element.closest(".floating-zalo,.mobile-zalo-cta,.popup-zalo-action")) {
    return "zalo_click";
  }
  if (/hỏi giá|đặt trước|tra đúng mã|sản phẩm/i.test(label)) return "product_inquiry";
  if (/kiểm tra|đặt lịch|gọi lại|tư vấn|gọi ngay/i.test(label)) return "cta_click";
  if (anchor && anchor.origin === window.location.origin) return "navigation_click";
  return undefined;
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  useEffect(() => {
    sendEvent("page_view");
  }, [pathname, search]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const element = (event.target as Element | null)?.closest<HTMLElement>(
        "a,button,[data-analytics-event]",
      );
      if (!element) return;
      const eventName = classifyClick(element);
      if (!eventName) return;
      const anchor = element.closest("a") as HTMLAnchorElement | null;
      sendEvent(eventName, {
        label: readableLabel(element),
        target: anchor?.href || element.dataset.analyticsTarget,
      });
    };

    const onSubmit = (event: SubmitEvent) => {
      const form = event.target as HTMLFormElement | null;
      if (!form) return;
      sendEvent("form_submit", {
        label: form.getAttribute("aria-label") ?? form.id ?? form.className,
        target: form.action || window.location.pathname,
      });
    };

    const depths = new Set<number>();
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const percentage = Math.round((window.scrollY / scrollable) * 100);
      if (percentage >= 50 && !depths.has(50)) {
        depths.add(50);
        sendEvent("scroll_50");
      }
      if (percentage >= 90 && !depths.has(90)) {
        depths.add(90);
        sendEvent("scroll_90");
      }
    };

    const engagedTimer = window.setTimeout(() => sendEvent("engaged_30s"), 30_000);
    const heartbeat = () => {
      if (document.visibilityState === "visible") sendEvent("heartbeat");
    };
    const heartbeatTimer = window.setInterval(heartbeat, 30_000);
    document.addEventListener("visibilitychange", heartbeat);
    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.clearTimeout(engagedTimer);
      window.clearInterval(heartbeatTimer);
      document.removeEventListener("visibilitychange", heartbeat);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  return null;
}
