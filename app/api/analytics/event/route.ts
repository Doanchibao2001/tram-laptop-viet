import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { hasSanityWriteToken, sanityServerClient } from "@/sanity/lib/server-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_EVENTS = new Set([
  "page_view",
  "cta_click",
  "phone_click",
  "zalo_click",
  "product_inquiry",
  "form_submit",
  "navigation_click",
  "scroll_50",
  "scroll_90",
  "engaged_30s",
]);

const BOT_PATTERN = /bot|crawler|spider|crawling|headless|lighthouse|pagespeed|google-inspectiontool|bingpreview/i;

type AnalyticsPayload = {
  eventName?: unknown;
  path?: unknown;
  title?: unknown;
  label?: unknown;
  target?: unknown;
  sessionId?: unknown;
  referrerHost?: unknown;
  utmSource?: unknown;
  utmMedium?: unknown;
  utmCampaign?: unknown;
  viewportWidth?: unknown;
  language?: unknown;
};

function shortText(value: unknown, maxLength: number): string | undefined {
  return typeof value === "string" && value.trim()
    ? value.trim().replace(/[\u0000-\u001f\u007f]/g, "").slice(0, maxLength)
    : undefined;
}

function viewport(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, Math.min(10000, Math.round(value)))
    : undefined;
}

function deviceType(width?: number): "mobile" | "tablet" | "desktop" | "unknown" {
  if (!width) return "unknown";
  if (width <= 700) return "mobile";
  if (width <= 1100) return "tablet";
  return "desktop";
}

function sameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === request.nextUrl.host;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 12_000) return NextResponse.json({ error: "Payload too large" }, { status: 413 });

  const userAgent = request.headers.get("user-agent") ?? "";
  if (BOT_PATTERN.test(userAgent)) return NextResponse.json({ ok: true, ignored: "bot" });

  let payload: AnalyticsPayload;
  try {
    payload = (await request.json()) as AnalyticsPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventName = shortText(payload.eventName, 40);
  const path = shortText(payload.path, 300);
  const sessionId = shortText(payload.sessionId, 80);
  if (!eventName || !ALLOWED_EVENTS.has(eventName) || !path?.startsWith("/") || !sessionId) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  if (!hasSanityWriteToken()) {
    console.warn("Analytics event was not stored because SANITY_WRITE_TOKEN is missing.", {
      eventName,
      path,
    });
    return NextResponse.json({ ok: true, stored: false }, { status: 202 });
  }

  const viewportWidth = viewport(payload.viewportWidth);
  await sanityServerClient.create({
    _id: `webEvent.${new Date().toISOString().slice(0, 10)}.${randomUUID()}`,
    _type: "webEvent",
    occurredAt: new Date().toISOString(),
    eventName,
    path,
    title: shortText(payload.title, 180),
    label: shortText(payload.label, 180),
    target: shortText(payload.target, 300),
    sessionId,
    referrerHost: shortText(payload.referrerHost, 160),
    utmSource: shortText(payload.utmSource, 120),
    utmMedium: shortText(payload.utmMedium, 120),
    utmCampaign: shortText(payload.utmCampaign, 160),
    viewportWidth,
    deviceType: deviceType(viewportWidth),
    language: shortText(payload.language, 20),
  });

  return NextResponse.json({ ok: true, stored: true }, { status: 201 });
}
