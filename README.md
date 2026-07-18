# Portfolio — Meherab Hossain

Personal portfolio and blog for [Meherab Hossain](https://x.com/meh_opi), a full-stack developer and designer based in Dhaka, Bangladesh. Built with Next.js and designed around a quiet, content-first aesthetic: a live GitHub contribution graph, an MDX-powered blog, a project showcase, and a scrolling "grind log" timeline.

## Tech stack

- **[Next.js 15](https://nextjs.org)** (App Router) with **React 19**
- **TypeScript** in strict mode
- **[Tailwind CSS v4](https://tailwindcss.com)** for styling, with CSS custom properties driving light/dark theming
- **[Motion](https://motion.dev)** (Framer Motion) for animation
- **[MDX](https://mdxjs.com)** for blog content (`@next/mdx` + `@mdx-js/mdx`)
- **[Vercel Analytics](https://vercel.com/analytics)** & **Speed Insights**
- Self-hosted fonts via **Fontsource** (Inter, Instrument Serif, Geist Mono)
- **pnpm** for package management

## Features

- **Live GitHub contribution graph** — pulls the real contribution calendar via the GitHub GraphQL API, rendered as a custom heatmap ([src/components/github-contributions.tsx](src/components/github-contributions.tsx)).
- **MDX blog** — Markdown/MDX files in `content/blog/` are parsed at build time with a lightweight custom frontmatter parser and reading-time estimate ([src/lib/blog-loader.ts](src/lib/blog-loader.ts)).
- **Project showcase** — data-driven cards and detail pages ([src/data/projects.ts](src/data/projects.ts)).
- **Grind log timeline** — a daily activity log with a calendar heatmap and horizontal day strip ([src/data/grind-data.ts](src/data/grind-data.ts)).
- **Scroll progress pill** — a floating, section-aware progress indicator with a glass background ([src/components/scroll-progress.tsx](src/components/scroll-progress.tsx)).
- **Light / dark theme** — no-flash theme init via an inline script, toggled and persisted to `localStorage`.
- **Accessibility & polish** — reduced-motion support throughout, skip-to-content link, keyboard-friendly navigation.
- **SEO** — dynamic `sitemap.ts` and `robots.ts`, Open Graph and Twitter card metadata.

## Getting started

### Prerequisites

- Node.js 18.18+ (or 20+)
- [pnpm](https://pnpm.io)

### Install

```bash
pnpm install
```

### Environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

| Variable       | Required | Description                                                                 |
| -------------- | -------- | --------------------------------------------------------------------------- |
| `GITHUB_TOKEN` | Yes\*    | GitHub personal access token used to fetch the contribution graph via GraphQL. |
| `GITHUB_LOGIN` | No       | GitHub username to fetch contributions for. Defaults to `opisbin`.          |

\*Without `GITHUB_TOKEN` the site still runs; the contribution graph simply shows a prompt to add the token instead of the heatmap.

To create a token, generate a GitHub personal access token with read access to your public profile/contribution data and add it to `.env.local`.

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build & run production

```bash
pnpm build
pnpm start
```

### Lint

```bash
pnpm lint
```

## Project structure

```
src/
├── app/                    # Next.js App Router
│   ├── about/              # About page
│   ├── api/
│   │   └── github-contributions/   # GraphQL proxy for the contribution graph
│   ├── blog/               # Blog index + [slug] post pages
│   ├── projects/           # Projects index + [slug] detail pages
│   ├── layout.tsx          # Root layout, theme init, global chrome
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Theme tokens + global styles
│   ├── robots.ts           # robots.txt
│   └── sitemap.ts          # sitemap.xml
├── components/             # UI components (hero, navbar, cards, etc.)
├── data/                   # Static content: profile, projects, grind log, blog index
└── lib/
    └── blog-loader.ts      # MDX/Markdown loader + frontmatter parser
content/
└── blog/                   # Blog posts as .mdx files
public/                     # Static assets
```

## Adding content

### A new blog post

Create a `.mdx` file in `content/blog/`. The filename (without extension) becomes the URL slug. Start with frontmatter:

```mdx
---
title: Your Post Title
date: 2026-07-18
description: A one-line summary for previews and SEO.
tags: [nextjs, typescript]
image: /optional-cover.png
---

Your Markdown/MDX content here.
```

Posts are read from disk and sorted newest-first automatically.

### A new project

Add an entry to [src/data/projects.ts](src/data/projects.ts).

### A grind log entry

Add a `GrindEntry` to the `grindData` array in [src/data/grind-data.ts](src/data/grind-data.ts) (newest first). Each bullet is an array of `segments` — plain strings render as text, `{ text, href }` objects render as inline links.

## Deployment

Optimized for [Vercel](https://vercel.com). Import the repository, set the environment variables above in the project settings, and deploy. Any Node.js host that supports Next.js 15 will also work.

## License

Personal project. All rights reserved unless stated otherwise.
