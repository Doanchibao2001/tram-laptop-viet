const VIETNAMESE_STOP_WORDS = new Set([
  "va",
  "voi",
  "cua",
  "cho",
  "tai",
  "la",
  "mot",
  "nhung",
  "khi",
  "de",
  "tu",
  "trong",
  "tren",
  "duoi",
  "ve",
]);

export function slugifyVietnamese(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function appendUniqueTokens(target: string[], source: string): void {
  for (const token of slugifyVietnamese(source).split("-")) {
    if (!token || VIETNAMESE_STOP_WORDS.has(token) || target.includes(token)) continue;
    target.push(token);
  }
}

/**
 * Build a concise, Vietnamese-safe SEO slug.
 * The first keyword is treated as the primary keyword, the second as support,
 * then the title fills the remaining context. Duplicate words are removed.
 */
export function buildSeoSlug(title: string, keywords: string[] = []): string {
  const tokens: string[] = [];
  for (const keyword of keywords.slice(0, 2)) appendUniqueTokens(tokens, keyword);
  appendUniqueTokens(tokens, title);

  if (!tokens.length) return "bai-viet";

  let slug = "";
  for (const token of tokens.slice(0, 14)) {
    const next = slug ? `${slug}-${token}` : token;
    if (next.length > 78) break;
    slug = next;
  }

  return slug || tokens[0].slice(0, 78);
}

export function shortDocumentSuffix(documentId: string): string {
  return slugifyVietnamese(documentId.replace(/^drafts\./, "")).slice(-6) || "tlv";
}
