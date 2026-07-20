import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";

export const ANALYTICS_COOKIE = "tlv_analytics_auth";

function digest(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function configuredDashboardSecret(): string | undefined {
  const value = process.env.ANALYTICS_DASHBOARD_KEY?.trim();
  return value || undefined;
}

export function analyticsCookieValue(secret: string): string {
  return digest(`tram-laptop-viet:${secret}`);
}

export function secureEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function validDashboardPassword(candidate: string): boolean {
  const secret = configuredDashboardSecret();
  return Boolean(secret && secureEqual(candidate, secret));
}

export function validAnalyticsCookie(candidate?: string): boolean {
  const secret = configuredDashboardSecret();
  return Boolean(secret && candidate && secureEqual(candidate, analyticsCookieValue(secret)));
}
