import { NextRequest, NextResponse } from "next/server";

const REPORT_REALM = "Tram Laptop Viet Analytics";
const DEFAULT_REPORT_USER = "analytics";

function constantTimeEqual(actual: string, expected: string): boolean {
  const length = Math.max(actual.length, expected.length);
  let mismatch = actual.length ^ expected.length;
  for (let index = 0; index < length; index += 1) {
    mismatch |= (actual.charCodeAt(index) || 0) ^ (expected.charCodeAt(index) || 0);
  }
  return mismatch === 0;
}

function basicCredentials(header: string | null): { username: string; password: string } | undefined {
  if (!header?.startsWith("Basic ")) return undefined;
  try {
    const decoded = atob(header.slice(6));
    const separator = decoded.indexOf(":");
    if (separator < 0) return undefined;
    return {
      username: decoded.slice(0, separator),
      password: decoded.slice(separator + 1),
    };
  } catch {
    return undefined;
  }
}

function protectedHeaders(): Record<string, string> {
  return {
    "Cache-Control": "private, no-store, max-age=0",
    "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
    "X-Content-Type-Options": "nosniff",
  };
}

export function proxy(request: NextRequest) {
  const expectedPassword = process.env.ANALYTICS_DASHBOARD_KEY?.trim();
  const expectedUsername = process.env.ANALYTICS_DASHBOARD_USER?.trim() || DEFAULT_REPORT_USER;

  if (!expectedPassword) {
    return new NextResponse("Not found", {
      status: 404,
      headers: protectedHeaders(),
    });
  }

  const credentials = basicCredentials(request.headers.get("authorization"));
  const authenticated =
    credentials &&
    constantTimeEqual(credentials.username, expectedUsername) &&
    constantTimeEqual(credentials.password, expectedPassword);

  if (!authenticated) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: {
        ...protectedHeaders(),
        "WWW-Authenticate": `Basic realm="${REPORT_REALM}", charset="UTF-8"`,
      },
    });
  }

  const response = NextResponse.next();
  for (const [name, value] of Object.entries(protectedHeaders())) {
    response.headers.set(name, value);
  }
  return response;
}

export const config = {
  matcher: ["/bao-cao-web/:path*"],
};
