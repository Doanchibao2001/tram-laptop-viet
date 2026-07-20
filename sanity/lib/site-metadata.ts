import "server-only";

const siteFavicon = "/favicon.svg";

export async function getSiteFaviconUrl(): Promise<string> {
  return siteFavicon;
}
