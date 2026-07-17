# SEO Plan — Next.js 15 Portfolio (e:/Portfolio)

## Context

Portfolio has partial SEO metadata already:
- Root `metadata` in `src/app/layout.tsx` (title, description, openGraph, twitter) — but **no `metadataBase`** (Next 15 warns, OG URLs resolve relative), **no `viewport`/`themeColor` export** (Next 15 warns), no `keywords`/`authors`, no `manifest` link, no JSON-LD.
- Per-page `metadata` on `blog/page.tsx`, `about/page.tsx`, `projects/page.tsx` — title + description only, duplicate `" — Meherab Hossain"` suffix on each.
- `generateMetadata` on `blog/[slug]/page.tsx` + `projects/[slug]/page.tsx` — blog already has OG `type: "article"` + `publishedTime`.
- `src/app/robots.ts` + `src/app/sitemap.ts` **already exist** but minimal: sitemap omits `/projects/[slug]` routes entirely; both hardcode `https://www.srbh.site` inline.
- No `manifest.ts`, no JSON-LD anywhere, no single site-URL constant (URL inline in 3 files).
- Only `public/favicon.svg` exists. No OG image, no robots.txt, no webmanifest (good — no conflicts with route handlers).
- Title strings in `layout.tsx` contain a corrupted em-dash glyph (`???` / mojibake) — fix while editing.
- Theme colors in `src/app/globals.css`: dark `--bg: #000000`, light `--bg: #ffffff`; site defaults to dark per `themeInitScript`.

**Goal:** Full SEO package — root metadata polish, dynamic routes (robots/sitemap/manifest), structured data (JSON-LD Person + BlogPosting + CreativeWork), single site URL constant.

**Outcome:** SEO score ~100, OG/Twitter URLs resolve absolutely, structured data eligible for rich results, all routes (`/`, `/about`, `/projects`, `/blog` + every `[slug]`) discoverable via sitemap, no build warnings.

**Skipped per user:** OG image asset (`twitter.card` downgraded to `summary`). `.env.local` gitignore fix (separate concern).

---

## Step 1 — Site URL + author email constant

**Edit** `src/data/profile.ts`

```ts
export const siteUrl = "https://www.srbh.site";

export const profile = {
  // ...existing fields...
  authorEmail: "hmeherab@outlook.com",  // currently only in socialLinks mailto
  // ...
};
```

Single source — `layout.tsx`, `robots.ts`, `sitemap.ts`, `manifest.ts`, both `generateMetadata` import from here. Eliminates current drift (URL inline in 3 places).

---

## Step 2 — Root layout: viewport, metadataBase, canonical, Person JSON-LD

**Edit** `src/app/layout.tsx`

Add `Viewport` import + separate `viewport` export (Next 15 requires `themeColor` here, not in `metadata`):

```ts
import type { Metadata, Viewport } from "next";
import { profile, socialLinks, siteUrl } from "@/data/profile";
import { JsonLd } from "@/components/json-ld";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)",  color: "#000000" },
  ],
  colorSlight: "light dark",
  width: "device-width",
  initialScale: 1,
};
```

Expand `metadata`:
- `metadataBase: new URL(siteUrl)` ← single most impactful field
- `title: { default: "Meherab Hossain — Full-Stack Developer & Designer", template: "%s — Meherab Hossain" }` so per-page titles drop the suffix
- `authors: [{ name: profile.name, url: siteUrl }]`, `creator: profile.name`, `publisher: profile.name`
- `keywords: [...]` (~15 terms): full-stack developer, design engineer, autonomous systems, synthetic data, control theory, Kubernetes, Go, ML, React, Wasm, Python, LangChain, FastAPI, Deno, PyTorch
- `alternates: { canonical: "/" }`
- `manifest: "/manifest.webmanifest"`
- OpenGraph: drop inline `url` (derived from metadataBase + canonical), add `locale: "en_US"`, keep `siteName`/`type: "website"`
- Twitter: `card: "summary"` (downgrade — no OG image)
- Fix corrupted em-dash in title/description strings

Add Person JSON-LD in `<body>` before `<Analytics />` (Step 8 supplies `JsonLd` component):

```ts
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: siteUrl,
  image: `${siteUrl}${profile.avatar}`,
  jobTitle: profile.title,
  description: profile.bio,
  email: profile.authorEmail,
  address: { "@type": "PostalAddress", addressCountry: "BD", addressLocality: profile.location },
  sameAs: socialLinks.filter(l => l.url.startsWith("http")).map(l => l.url),
};
```

---

## Step 3 — Per-page metadata enrichment

Same pattern in all three: add `alternates.canonical`, `keywords`, `openGraph: { type, url }`. Inherit `metadataBase` + title `template` from root → drop `" — Meherab Hossain"` suffix from titles (just `"Blog"`, `"About"`, `"Projects"`).

- **`src/app/about/page.tsx`** — canonical `/about`, keywords `[about, profile.name, full-stack developer, profile.location, design engineer]`, OG `type: "website"`
- **`src/app/projects/page.tsx`** — canonical `/projects`, keywords = union of `allProjects[].tags` + `[projects, portfolio, selected work]`, OG `type: "website"`
- **`src/app/blog/page.tsx`** — canonical `/blog`, keywords = union of `blogPosts[].tags` + `[blog, writing, essays, engineering]`, OG `type: "website"`

Optional helper exports in data files: `export const allProjectTags = [...new Set(allProjects.flatMap(p => p.tags))]` — keeps unions DRY if reused for JSON-LD later.

---

## Step 4 — Slug pages metadata enrichment + JSON-LD

### 4a. `src/app/blog/[slug]/page.tsx`

Existing `generateMetadata` already sets `type: "article"` + `publishedTime`. Add:
- `authors: [{ name: profile.name, url: siteUrl }]`
- `tags: post.tags` (OG tags array)
- `alternates: { canonical: \`/blog/${post.slug}\` }`
- `keywords: post.tags`
- `openGraph.url: \`/blog/${post.slug}\``
- not-found branch: `robots: { index: false, follow: false }`

Add `<JsonLd data={articleSchema} />` after `<article>` (Step 9).

### 4b. `src/app/projects/[slug]/page.tsx`

Current uses only title + tagline. Add:
- `description: project.description` (richer than tagline for SERP)
- `openGraph: { type: "article", url, publishedTime: new Date(\`${project.year}-01-01\`).toISOString(), authors: [{name, url}] }`
- `alternates: { canonical: \`/projects/${project.slug}\` }`
- `keywords: project.tags`
- not-found branch: `robots: { index: false }`

Add `<JsonLd data={projectSchema} />` after metrics block (Step 10).

---

## Step 5 — Dynamic `robots.ts`

**Edit** `src/app/robots.ts`

Replace hardcoded URL with `siteUrl` import, add `host` + `disallow` for API/404:

```ts
import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/profile";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/_not-found"] },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
```

`/api/` keeps `src/app/api/github-contributions/route.ts` out of index. No static `public/robots.txt` (would conflict).

---

## Step 6 — Dynamic `sitemap.ts` — add project routes

**Edit** `src/app/sitemap.ts`

Real gap: project routes entirely missing. Replace `baseUrl` constant with `siteUrl` import, add project routes:

```ts
import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog";
import { allProjects } from "@/data/projects";
import { siteUrl } from "@/data/profile";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/about", "/projects", "/blog"].map((path) => ({
    url: `${siteUrl}${path || "/"}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
  const blogRoutes = blogPosts.map((p) => ({
    url: `${siteUrl}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  const projectRoutes = allProjects.map((p) => ({
    url: `${siteUrl}/projects/${p.slug}`,
    lastModified: new Date(`${p.year}-12-31`),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));
  return [...staticRoutes, ...blogRoutes, ...projectRoutes];
}
```

Expected count: `4 + blogPosts.length + allProjects.length`.

---

## Step 7 — `manifest.ts` (new)

**New file** `src/app/manifest.ts` (route handler — not static `public/manifest.webmanifest`)

```ts
import type { MetadataRoute } from "next";
import { siteUrl, profile } from "@/data/profile";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.name} — ${profile.title}`,
    short_name: profile.name,
    description: profile.bio,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
    categories: ["portfolio", "developer", "design"],
  };
}
```

Only `favicon.svg` in `public/`. No maskable PNG — skip (would need asset generation). Manifest coerces to single theme despite light/dark toggle.

---

## Step 8 — `JsonLd` component (new) + inject on root

**New file** `src/components/json-ld.tsx` (server component, no `"use client"`)

```tsx
export function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

**Edit** `src/app/layout.tsx` — render `<JsonLd data={personSchema} />` in `<body>` before `<Analytics />`. Schema at module scope (Step 2).

---

## Step 9 — BlogPosting JSON-LD on blog slug pages

**Edit** `src/app/blog/[slug]/page.tsx`

Inject `<JsonLd data={articleSchema} />` after `<article>`. Schema inline from `post` + `profile`:

```ts
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: post.title,
  description: post.description,
  datePublished: new Date(post.date).toISOString(),
  dateModified: new Date(post.date).toISOString(),
  author: { "@type": "Person", name: profile.name, url: siteUrl },
  publisher: { "@type": "Person", name: profile.name, url: siteUrl },
  mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}/blog/${post.slug}` },
  keywords: post.tags.join(", "),
  articleBody: post.body.map((s) => s.text).join("\n\n"),
};
```

`dateModified === datePublished` acceptable (no edit-tracking data exists).

---

## Step 10 — CreativeWork JSON-LD on project pages

**Edit** `src/app/projects/[slug]/page.tsx`

Inject `<JsonLd data={projectSchema} />` after metrics block:

```ts
const projectSchema = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: project.title,
  description: project.description,
  datePublished: new Date(`${project.year}-01-01`).toISOString(),
  author: { "@type": "Person", name: profile.name, url: siteUrl },
  keywords: project.tags.join(", "),
  url: project.url,
  codeRepository: project.github,
};
```

Use `CreativeWork` (not `SoftwareApplication` — latter needs `applicationCategory`/`operatingSystem`, over-specifies). Upgradeable later.

---

## Skipped (per user)

- **OG image asset** — `openGraph.images` / `twitter.images` omitted; `twitter.card` downgraded to `"summary"`.
- **`.env.local` gitignore fix** — out of scope.

---

## Verification

### A. Build clean
`pnpm build` from `e:/Portfolio`. Must complete with **no** `metadataBase` warning and **no** `viewport/themeColor` warning.

### B. Route handlers
`pnpm dev`, then:
- `curl http://localhost:3000/robots.txt` — `User-agent: *`, `Allow: /`, `Disallow: /api/`, `Sitemap: https://www.srbh.site/sitemap.xml`, `Host: https://www.srbh.site`.
- `curl http://localhost:3000/sitemap.xml` — entry count = `4 + blogPosts.length + allProjects.length`. Contains `/projects/{slug}` routes.
- `curl http://localhost:3000/manifest.webmanifest` — valid JSON, has `name`, `icons`, `theme_color`.

### C. Head tags
`view-source:` each route, grep:
- `/` — `<link rel="canonical" href="https://www.srbh.site/">`, `<link rel="manifest" href="/manifest.webmanifest">`, `<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000000">`, JSON-LD `"@type":"Person"`, `<meta name="color-scheme" content="light dark">`.
- `/blog/[slug]` — canonical ends with slug, `article:published_time`, `article:author`, JSON-LD `"@type":"BlogPosting"`.
- `/projects/[slug]` — canonical ends with slug, JSON-LD `"@type":"CreativeWork"`.
- All pages — `<meta name="viewport" content="width=device-width, initial-scale=1">`.
- Confirm `???` em-dash gone from `/` title.

### D. Lighthouse
Run against `http://localhost:3000/`, a `/blog/[slug]`, a `/projects/[slug]`. Target SEO score 100, 0 "missing meta description", valid robots.txt, no encoding warnings.

### E. Rich Results Test
Paste rendered JSON-LD into https://search.google.com/test/rich-results:
- `/` Person — detected, no errors.
- `/blog/[slug]` BlogPosting — Article detected, author resolved.
- `/projects/[slug]` CreativeWork — passes (may show "no rich result detected" — not an error).

### F. Lint / types
`pnpm lint` + `tsc --noEmit` (build runs TS checks). New `JsonLd` component + `manifest.ts` typed via `MetadataRoute.Manifest`. React 19 types present.

### G. No file conflicts
Confirm `public/` has neither `manifest.webmanifest` nor `robots.txt` (only `favicon.svg` present). Static duplicates would conflict with route handlers.

---

## Sequencing

1. `profile.ts` (siteUrl + authorEmail) →
2. `json-ld.tsx` (new component) →
3. `layout.tsx` (viewport, metadataBase, template, keywords, authors, canonical, manifest link, Person JSON-LD, twitter downgrade) →
4. three list pages (canonical, keywords, OG) →
5. two `[slug]` pages (metadata enrichment + JSON-LD) →
6/7/8. robots / sitemap / manifest (order-independent after Step 1).

Steps depend on Step 2 (`template` + `metadataBase`) for full benefit, but each is independently useful.

---

## Critical files

| File | Action |
|------|--------|
| `src/data/profile.ts` | edit — add `siteUrl`, `authorEmail` |
| `src/components/json-ld.tsx` | **new** |
| `src/app/layout.tsx` | edit — viewport, metadataBase, keywords, manifest, Person JSON-LD |
| `src/app/about/page.tsx` | edit — canonical, keywords, OG |
| `src/app/blog/page.tsx` | edit — canonical, keywords, OG |
| `src/app/projects/page.tsx` | edit — canonical, keywords, OG |
| `src/app/blog/[slug]/page.tsx` | edit — metadata enrichment + BlogPosting JSON-LD |
| `src/app/projects/[slug]/page.tsx` | edit — metadata + CreativeWork JSON-LD |
| `src/app/robots.ts` | edit — siteUrl, disallow `/api/`, host |
| `src/app/sitemap.ts` | edit — add project routes, use `siteUrl` |
| `src/app/manifest.ts` | **new** |

Optional data helpers: `allProjectTags` / `allBlogTags` derived exports in `src/data/{projects,blog}.ts`.
