import { NextResponse } from "next/server";

export const runtime = "nodejs";

type LeadPayload = {
  name?: string;
  phone?: string;
  service?: string;
  source?: string;
  pageUrl?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
};

const phonePattern = /^[0-9+().\s-]{8,20}$/;

export async function POST(request: Request) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();
  const webhookSecret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET?.trim();

  if (!webhookUrl || !webhookSecret) {
    console.error("Lead webhook is not configured");
    return NextResponse.json({ ok: false, error: "Lead service is unavailable" }, { status: 503 });
  }

  let body: LeadPayload;
  try {
    body = (await request.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const phone = body.phone?.trim() ?? "";
  if (!phonePattern.test(phone)) {
    return NextResponse.json({ ok: false, error: "Invalid phone number" }, { status: 400 });
  }

  const lead = {
    name: body.name?.trim().slice(0, 100) ?? "",
    phone,
    service: body.service?.trim().slice(0, 150) ?? "",
    source: body.source?.trim().slice(0, 50) ?? "website",
    pageUrl: body.pageUrl?.trim().slice(0, 500) ?? "",
    referrer: body.referrer?.trim().slice(0, 500) ?? "",
    utmSource: body.utmSource?.trim().slice(0, 100) ?? "",
    utmMedium: body.utmMedium?.trim().slice(0, 100) ?? "",
    utmCampaign: body.utmCampaign?.trim().slice(0, 150) ?? "",
    utmContent: body.utmContent?.trim().slice(0, 150) ?? "",
    utmTerm: body.utmTerm?.trim().slice(0, 150) ?? "",
    submittedAt: new Date().toISOString(),
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ secret: webhookSecret, lead }),
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) {
      console.error("Lead webhook rejected the request", response.status);
      return NextResponse.json({ ok: false, error: "Lead could not be saved" }, { status: 502 });
    }

    const result = (await response.json().catch(() => null)) as { ok?: boolean } | null;
    if (!result?.ok) {
      console.error("Lead webhook returned an invalid response");
      return NextResponse.json({ ok: false, error: "Lead could not be saved" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Lead webhook request failed", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ ok: false, error: "Lead could not be saved" }, { status: 502 });
  }
}
