import { NextRequest, NextResponse } from "next/server";
import {
  ANALYTICS_COOKIE,
  analyticsCookieValue,
  configuredDashboardSecret,
  validDashboardPassword,
} from "@/lib/analytics-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const password = String(form.get("password") ?? "");
  const secret = configuredDashboardSecret();

  if (!secret) {
    return NextResponse.redirect(new URL("/bao-cao-web?error=not-configured", request.url), 303);
  }
  if (!validDashboardPassword(password)) {
    return NextResponse.redirect(new URL("/bao-cao-web?error=invalid", request.url), 303);
  }

  const response = NextResponse.redirect(new URL("/bao-cao-web", request.url), 303);
  response.cookies.set({
    name: ANALYTICS_COOKIE,
    value: analyticsCookieValue(secret),
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/bao-cao-web",
    maxAge: 60 * 60 * 12,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ANALYTICS_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/bao-cao-web",
    maxAge: 0,
  });
  return response;
}
