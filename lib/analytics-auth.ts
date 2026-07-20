import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";

export const ANALYTICS_COOKIE = "tlv_analytics_auth";

const FALLBACK_DASHBOARD_PASSWORD_HASH =
  "c83b400929c0c77f0d1fe42491eee916605e17339730b91db4a4b535079554fd";

function digest(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function configuredDashboardSecret(): string | undefined {
  const value = process.env.ANALYTICS_DASHBOARD_KEY?.trim();
  return value || FALLBACK_DASHBOARD_PASSWORD_HASH;
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
  const configuredSecret = process.env.ANALYTICS_DASHBOARD_KEY?.trim();
  if (configuredSecret) {
    return secureEqual(candidate, configuredSecret);
  }

  return secureEqual(digest(candidate), FALLBACK_DASHBOARD_PASSWORD_HASH);
}

export function validAnalyticsCookie(candidate?: string): boolean {
  const secret = configuredDashboardSecret();
  return Boolean(secret && candidate && secureEqual(candidate, analyticsCookieValue(secret)));
}
