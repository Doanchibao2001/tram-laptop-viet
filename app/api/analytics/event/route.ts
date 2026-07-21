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
  "heartbeat",
]);

const BOT_PATTERN = /bot|crawler|spider|crawling|headless|lighthouse|pagespeed|google-inspectiontool|bingpreview/i;
const MAX_PAYLOAD_BYTES = 12_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_EVENTS = 120;

type RateBucket = { count: number; resetAt: number };
const rateBuckets = new Map<string, RateBucket>();

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
  if (origin) {
    try {
      return new URL(origin).host === request.nextUrl.host;
    } catch {
      return false;
    }
  }

  if (request.headers.get("sec-fetch-site") === "same-origin") return true;

  const referer = request.headers.get("referer");
  if (!referer) return false;
  try {
    return new URL(referer).host === request.nextUrl.host;
  } catch {
    return false;
  }
}

function rateLimitKey(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")?.trim()
    || "unknown";
}

function rateLimited(request: NextRequest): boolean {
  const now = Date.now();
  const key = rateLimitKey(request);
  const current = rateBuckets.get(key);
  if (!current || current.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > RATE_LIMIT_MAX_EVENTS;
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  if (rateLimited(request)) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_PAYLOAD_BYTES) return NextResponse.json({ error: "Payload too large" }, { status: 413 });

  const userAgent = request.headers.get("user-agent") ?? "";
  if (BOT_PATTERN.test(userAgent)) return NextResponse.json({ ok: true, ignored: "bot" });

  let payload: AnalyticsPayload;
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_PAYLOAD_BYTES) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }
    payload = JSON.parse(rawBody) as AnalyticsPayload;
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
  try {
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
  } catch (error) {
    console.error("Analytics event could not be stored in Sanity.", {
      eventName,
      path,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json({ error: "Analytics storage unavailable" }, { status: 503 });
  }

  return NextResponse.json({ ok: true, stored: true }, { status: 201 });
}
