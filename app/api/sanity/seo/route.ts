import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { buildSeoSlug, shortDocumentSuffix } from "@/lib/seo-slug";
import { hasSanityWriteToken, sanityServerClient } from "@/sanity/lib/server-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ARTICLE_TYPES = new Set(["article", "post", "newsArticle"]);

type SlugValue = { current?: unknown } | string | null | undefined;

type ArticleWebhookPayload = {
  _id?: unknown;
  _type?: unknown;
  title?: unknown;
  keywords?: unknown;
  slug?: SlugValue;
};

function text(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function keywordList(value: unknown): string[] {
  return Array.isArray(value)
    ? value.map(text).filter((item): item is string => Boolean(item)).slice(0, 20)
    : [];
}

function currentSlug(value: SlugValue): string | undefined {
  if (typeof value === "string") return text(value);
  return value && typeof value === "object" ? text(value.current) : undefined;
}

function authorized(request: NextRequest): boolean {
  const expected = process.env.SANITY_WEBHOOK_SECRET;
  if (!expected) return process.env.NODE_ENV !== "production";
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const header = request.headers.get("x-sanity-webhook-secret");
  return bearer === expected || header === expected;
}

async function uniqueSlug(baseSlug: string, documentId: string): Promise<string> {
  const collision = await sanityServerClient.fetch<string | null>(
    `*[_type in ["article", "post", "newsArticle"] && slug.current == $slug && _id != $id][0]._id`,
    { slug: baseSlug, id: documentId },
  );
  return collision ? `${baseSlug}-${shortDocumentSuffix(documentId)}` : baseSlug;
}

async function writeSlug(documentId: string, title: string, keywords: string[]) {
  const generated = buildSeoSlug(title, keywords);
  const slug = await uniqueSlug(generated, documentId);
  await sanityServerClient
    .patch(documentId)
    .setIfMissing({ slug: { _type: "slug", current: slug } })
    .commit({ autoGenerateArrayKeys: true });

  revalidatePath("/sitemap.xml");
  revalidatePath("/tin-tuc");
  revalidatePath(`/tin-tuc/${slug}`);
  return slug;
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasSanityWriteToken()) {
    return NextResponse.json({ error: "SANITY_WRITE_TOKEN is not configured" }, { status: 503 });
  }

  const payload = (await request.json()) as ArticleWebhookPayload;
  const id = text(payload._id);
  const type = text(payload._type);
  const title = text(payload.title);

  if (!id || !type || !ARTICLE_TYPES.has(type)) {
    return NextResponse.json({ ok: true, ignored: "not_an_article" });
  }
  if (id.startsWith("drafts.")) return NextResponse.json({ ok: true, ignored: "draft" });
  if (currentSlug(payload.slug)) return NextResponse.json({ ok: true, ignored: "slug_exists" });
  if (!title) return NextResponse.json({ error: "Article title is required" }, { status: 400 });

  const slug = await writeSlug(id, title, keywordList(payload.keywords));
  return NextResponse.json({ ok: true, slug });
}

/** Backfill every published article that was created without a slug. */
export async function PUT(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasSanityWriteToken()) {
    return NextResponse.json({ error: "SANITY_WRITE_TOKEN is not configured" }, { status: 503 });
  }

  const records = await sanityServerClient.fetch<Array<{
    _id: string;
    title: string;
    keywords?: string[];
  }>>(
    `*[_type in ["article", "post", "newsArticle"] && !(_id in path("drafts.**")) && defined(title) && !defined(slug.current)]{_id, title, "keywords": coalesce(keywords, [])}`,
  );

  const results: Array<{ id: string; slug: string }> = [];
  for (const record of records.slice(0, 200)) {
    const slug = await writeSlug(record._id, record.title, keywordList(record.keywords));
    results.push({ id: record._id, slug });
  }

  return NextResponse.json({ ok: true, updated: results.length, results });
}
