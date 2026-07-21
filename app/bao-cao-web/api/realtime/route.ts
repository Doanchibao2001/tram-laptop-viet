import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ANALYTICS_COOKIE, validAnalyticsCookie } from "@/lib/analytics-auth";
import { sanityServerClient } from "@/sanity/lib/server-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ACTIVE_WINDOW_SECONDS = 120;

type RecentEvent = {
  sessionId?: string;
  path?: string;
  occurredAt?: string;
  referrerHost?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  deviceType?: string;
};

function sourceLabel(event: RecentEvent): string {
  if (event.utmSource) {
    return event.utmMedium ? `${event.utmSource} / ${event.utmMedium}` : event.utmSource;
  }
  return event.referrerHost || "Truy cập trực tiếp";
}

export async function GET() {
  const cookieStore = await cookies();
  if (!validAnalyticsCookie(cookieStore.get(ANALYTICS_COOKIE)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const since = new Date(Date.now() - ACTIVE_WINDOW_SECONDS * 1000).toISOString();
  const events = await sanityServerClient.fetch<RecentEvent[]>(
    `*[_type == "webEvent" && occurredAt >= $since] | order(occurredAt desc)[0...5000]{sessionId,path,occurredAt,referrerHost,utmSource,utmMedium,utmCampaign,deviceType}`,
    { since },
    { cache: "no-store" },
  );

  const sessions = new Map<string, RecentEvent>();
  for (const event of events) {
    if (event.sessionId && !sessions.has(event.sessionId)) sessions.set(event.sessionId, event);
  }

  const visitors = [...sessions.entries()].map(([sessionId, event]) => ({
    sessionId,
    path: event.path || "/",
    source: sourceLabel(event),
    campaign: event.utmCampaign,
    deviceType: event.deviceType || "unknown",
    lastSeen: event.occurredAt || since,
  }));

  return NextResponse.json({
    activeCount: visitors.length,
    generatedAt: new Date().toISOString(),
    windowSeconds: ACTIVE_WINDOW_SECONDS,
    visitors,
  }, { headers: { "cache-control": "private, no-store, max-age=0" } });
}
