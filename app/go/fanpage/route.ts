const FACEBOOK_PAGE_URL =
  "https://www.facebook.com/profile.php?id=61591726413298";

export function GET() {
  return new Response(null, {
    status: 302,
    headers: {
      Location: FACEBOOK_PAGE_URL,
      "Cache-Control": "no-store",
    },
  });
}
