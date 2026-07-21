# SEO automation and first-party analytics

## 1. Environment variables on Vercel

Add these server-only variables to both Production and Preview:

```text
SANITY_WRITE_TOKEN=<Sanity token with create/update permission>
SANITY_WEBHOOK_SECRET=<a long random secret>
ANALYTICS_DASHBOARD_KEY=<password for /bao-cao-web>
```

Do not prefix these variables with `NEXT_PUBLIC_`.

There is no built-in dashboard password. If `ANALYTICS_DASHBOARD_KEY` is missing,
the dashboard remains locked and reports that configuration is incomplete.

## 2. Automatic article URL and sitemap flow

Create a Sanity webhook that fires when documents are created or updated.

- URL: `https://tramlaptopviet.vn/api/sanity/seo`
- Method: `POST`
- Filter: `_type in ["article", "post", "newsArticle"]`
- Projection:

```groq
{
  _id,
  _type,
  title,
  keywords,
  slug
}
```

Send either of these headers:

```text
Authorization: Bearer <SANITY_WEBHOOK_SECRET>
```

or

```text
x-sanity-webhook-secret: <SANITY_WEBHOOK_SECRET>
```

When an article is published without a slug, the endpoint:

1. Treats the first keyword as the primary keyword and the second as supporting context.
2. Combines them with the title.
3. Removes Vietnamese accents, duplicate words and common stop words.
4. Writes a stable `slug.current` back to Sanity.
5. Revalidates the article route, `/tin-tuc` and `/sitemap.xml`.

A manually entered Sanity slug always wins and is never overwritten.

### Backfill existing articles without a slug

Send an authenticated `PUT` request to the same endpoint. It patches up to 200 published articles in one run.

```bash
curl -X PUT https://tramlaptopviet.vn/api/sanity/seo \
  -H "Authorization: Bearer <SANITY_WEBHOOK_SECRET>"
```

## 3. First-party analytics

The browser sends only anonymous behavioural events to:

```text
POST /api/analytics/event
```

Tracked events:

- Page view
- Internal navigation
- Phone click
- Zalo click
- Product inquiry
- CTA click
- Form submit
- Scroll depth 50% and 90%
- Engagement after 30 seconds

No IP address, phone number, name or form content is stored. The session identifier lives in `sessionStorage` and resets when the browsing session ends. Browser Do Not Track is respected.

Events are stored in Sanity as `_type: "webEvent"` documents. The dashboard reads and aggregates the most recent 30 days.

## 4. Dashboard

Open:

```text
https://tramlaptopviet.vn/bao-cao-web
```

Sign in with `ANALYTICS_DASHBOARD_KEY`.

The dashboard reports:

- Page views and anonymous sessions
- Sessions with conversion actions
- Conversion rate
- Visitors engaged for at least 30 seconds
- Most viewed pages
- Phone/Zalo/form/product actions
- Referring domains and UTM sources
- Devices and popular CTA labels
- Daily results for the last 14 days

The dashboard and analytics API routes are excluded from `robots.txt` and the dashboard has `noindex` metadata.
