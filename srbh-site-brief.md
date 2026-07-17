# srbh.site — Complete Build Brief

> Hand this file to your coding agent to rebuild an identical clone of [srbh.site](https://www.srbh.site/).
> Last analyzed: 2026-07-17

---

## 1. Technical Stack

| Layer | Choice |
|-------|--------|
| **Framework** | Next.js 15+ (App Router) with **Turbopack** |
| **Styling** | Tailwind CSS v4 (CSS Modules) |
| **Animation** | **Motion** (`motion` on npm, successor to Framer Motion) |
| **Fonts** | Inter (body), Instrument Serif (headings), Geist Mono (code) — via `next/font` |
| **Hosting** | **Vercel** (with `@vercel/analytics` + `@vercel/speed-insights`) |
| **Analytics** | **PostHog** (self-hosted at `/ingest/` — session recording, surveys, dead-click tracking, web vitals) |
| **Image CDN** | ImageKit (`ik.imagekit.io`) for project screenshots |
| **Blog** | MDX-based (standard Next.js MDX pattern) |
| **OG Images** | Auto-generated via Next.js `generateMetadata` or `opengraph-image.tsx` |

### Commands to scaffold

```bash
# 1. Create project
npx create-next-app@latest my-site --typescript --tailwind --eslint --app --src-dir

# 2. Install animation library
npm install motion

# 3. Install fonts (or use next/font Google)
npm install @fontsource/inter @fontsource/geist-mono @fontsource/instrument-serif
# Alternative: use `next/font/google` for Inter, Geist Mono is available as local font

# 4. Vercel analytics
npm install @vercel/analytics @vercel/speed-insights

# 5. MDX blog support
npm install @next/mdx @mdx-js/loader @mdx-js/mdx

# 6. PostHog (optional)
npm install posthog-js
```

---

## 2. Site Structure (Sections on Homepage)

The site is a **single-page layout** with these sections, scrollable vertically:

```
Nav Bar  (sticky top, 5 links: Home · About · Projects · Components · Blogs)
┌─────────────────────────────────────────────┐
│  Hero Section                                │
│  "Saurabh Sharma" (h2, 18px)               │
│  "Designing & Engineering Digital            │
│   Experiences" (h1, 36px)                   │
│  [Get in touch] [Book a call]                │
│  GitHub streak card (sidebar)                │
│  Social links: X · GitHub · LinkedIn ·       │
│    Peerlist · Email                         │
├─────────────────────────────────────────────┤
│  Projects Section                            │
│  2 project cards:                            │
│  - Ping (chat app)                          │
│  - Creation Gallery (art showcase)          │
│  [View all] link                            │
├─────────────────────────────────────────────┤
│  Blogs Section                               │
│  3 blog post links with date:               │
│  - Telegram Bot → Daily Logs to GitHub      │
│  - 3D Phone with TailwindCSS & Motion.dev   │
│  - Multiple GitHub Accounts                 │
│  [View all] link                            │
├─────────────────────────────────────────────┤
│  Grind Log Section                           │
│  "#011" entry + daily log text              │
│  Calendar grid (30-days per row, squarish    │
│  cells, colored by activity)                │
│  [Previous Day] [Next Day]                   │
└─────────────────────────────────────────────┘
Footer (minimal, social links)
```

### Subpages
- `/about` — About page
- `/projects` — All projects listing
- `/components` — UI components showcase
- `/blog` — Blog listing (MDX-based)
- `/blog/[slug]` — Individual blog post (MDX, prose layout)

---

## 3. Visual Design Specification

### 3.1 Color Palette (Dark Theme Only)

| Token | Value | Usage |
|-------|-------|-------|
| `bg-primary` | `#000000` (black) | Page background |
| `bg-secondary` | `#111111` or `#0a0a0a` | Card/section backgrounds |
| `text-primary` | `#ffffff` (white) | Headings (h1, h2, h3) |
| `text-secondary` | Gray ~ `#a0a0a0` (lab(66.128...)) | Body text, paragraph |
| `text-muted` | Darker gray | Subtle labels |
| `accent-link` | Muted blue ~ `#5b8def` (lab(65.93 -0.83 -8.17)) | Links, inline anchors |
| `accent-button` | Transparent bg, white text, white border | Pill buttons |
| `grind-empty` | Dark gray ~ `#1a1a1a` | Calendar cell: no activity |
| `grind-active` | Lighter shade | Calendar cell: activity done |

The site uses `color-scheme: dark` and `class="dark"` on `<html>`. Theme toggle button exists but appears always-on-dark in practice.

### 3.2 Typography

| Element | Font | Size | Weight | Color | Letter Spacing |
|---------|------|------|--------|-------|---------------|
| h1 (hero) | **Instrument Serif** | `36px` | 400 (regular) | White | `0.9px` |
| h2 (section titles) | **Inter** | `18px` | 500 (medium) | White | normal |
| h3 (card titles) | **Inter** | `16px` | 600 (semibold) | White | normal |
| h4 (blog titles) | **Instrument Serif** or Inter | `15px` | 400 | White | — |
| Body / paragraph | **Inter** | `14px` | 400 | Gray (~#a0a0a0) | normal |
| Nav links | **Inter** | `14px` | 500 | Gray → White on hover | normal |
| Code | **Geist Mono** | `13px` | — | — | — |
| Buttons | **Inter** | `14px` | 500 | Gray / White | — |
| Small / meta | **Inter** | `12px` | 400 | Muted gray | — |

Font stack (CSS variable names from the source):
- `--font-inter` — Inter, Inter Fallback, sans-serif
- `--font-instrument-serif` — Instrument Serif, Instrument Serif Fallback
- `--font-geist-mono` — Geist Mono, monospace

### 3.3 Spacing & Layout

- **Max content width**: ~640–720px centered (the page has generous side padding on mobile)
- **Section spacing**: `py-16` to `py-24` (64px–96px vertical padding per section)
- **Component gap**: `gap-6` to `gap-8` (24px–32px between cards/sections)
- **Container padding**: `px-4` to `px-6` (16px–24px) on mobile, more on desktop
- **Stack spacing**: `space-y-4` (16px) between stacked elements
- **Navigation**: Fixed/sticky top bar, ~60px height, `backdrop-blur` or transparent

### 3.4 Components

#### Buttons
- **Primary (Get in touch)**: Pill shape (`rounded-full` or huge border-radius), white border (`1px solid`), transparent `bg`, white text, `px-6 py-2.5`, hover: bg white + text black
- **Text (Book a call)**: Plain link, no border, accent color, underline on hover
- **Navigation tabs**: Text-only links, inactive = gray, active/hover = white, optional subtle underline

#### Project Cards
- 2-column grid on desktop, single column on mobile
- Image at top (rounded `md:rounded-lg`, object-cover, aspect-video or 4:3)
- Title (h3, Inter semibold) below image
- Optional description text (14px gray)
- Subtle hover effect: slight scale-up (1.02x) or brightness shift
- Images served from ImageKit CDN with `tr=f-auto,w-600,q-80` params

#### Blog List
- Title (Instrument Serif, ~15px, white)
- Date inline or below (12px, muted gray)
- Hover: link color change or underline
- Clean, minimal — no card border, just text on background

#### Grind Log (Daily Calendar)
- **Header**: "#011" log number, date "JULY 16, 2026"
- **Content**: Free-form text (LeetCode problems solved, what was done)
- **Calendar grid**: ~30 cells per row, each cell is a small square (aspect-ratio 1:1, ~12-16px)
- Calendar spans about 3 months visible at once
- Each day is clickable (go to that date's log)
- Past dates after ~July 16 are disabled/grayed out
- Future dates always disabled
- Navigation: [Previous Day] [Next Day] buttons
- Scrollable grid of date labels at bottom

#### Navigation
- Desktop: horizontal row of links (Home, About, Projects, Components, Blogs) + theme toggle button (sun/moon icon)
- Mobile: same, possibly collapses to hamburger
- Active link: white, inactive: gray

### 3.5 Animations

Uses **Motion** (Framer Motion's successor, from `motion` package — likely `motion/react`).

Animation patterns to implement:
1. **Fade-in on scroll**: Sections reveal with `initial={{ opacity: 0, y: 20 }}` → `whileInView={{ opacity: 1, y: 0 }}` with `viewport={{ once: true }}`
2. **Stagger children**: Project cards / blog items stagger in sequence
3. **Hover scale**: Project images scale 1.02–1.05x on hover
4. **Smooth scroll**: `scroll-behavior: smooth` or Lenis for smooth anchor scrolling
5. **Page transitions**: View transitions or fade between routes (optional but present on the original)
6. **Theme toggle**: Smooth transition on `html` class toggle

### 3.6 Responsive Breakpoints

| Breakpoint | Layout changes |
|------------|---------------|
| **default (mobile)** | Single column, stacked sections, nav becomes hamburger? (check), calendar cells smaller |
| **sm (640px)** | Slightly larger padding, text scales up |
| **md (768px)** | Project cards → 2-column grid, more horizontal breathing room |
| **lg (1024px)** | Max content width pegged, hero may have sidebar (GitHub streak) |

---

## 4. File-by-File Project Structure to Generate

```
my-site/
├── app/
│   ├── globals.css            # Tailwind directives + custom dark theme
│   ├── layout.tsx             # Root layout: fonts, analytics, PostHog, metadata
│   ├── page.tsx               # Homepage: all sections
│   ├── about/
│   │   └── page.tsx
│   ├── projects/
│   │   └── page.tsx
│   ├── components/
│   │   └── page.tsx
│   ├── blog/
│   │   ├── page.tsx           # Blog listing
│   │   └── [slug]/
│   │       └── page.tsx       # Individual blog post (MDX)
│   └── opengraph-image.tsx    # Auto-generated OG image
├── components/
│   ├── navbar.tsx             # Navigation bar (sticky, responsive)
│   ├── hero.tsx               # Hero section
│   ├── projects-section.tsx   # Projects grid
│   ├── project-card.tsx       # Individual project card
│   ├── blog-section.tsx       # Blog preview list
│   ├── grind-log.tsx          # Daily log + calendar grid
│   ├── social-links.tsx       # X, GitHub, LinkedIn, etc.
│   └── theme-toggle.tsx       # Dark/light toggle (works with dark-only)
├── lib/
│   ├── posts.ts               # MDX blog utilities
│   └── grind-data.ts          # Grind log data source
├── content/
│   └── blog/                  # MDX blog posts
├── public/
│   └── profile.png            # Profile photo
├── tailwind.config.ts         # Tailwind config with custom colors
├── next.config.ts             # Next.js config (MDX, images)
├── postcss.config.mjs
└── package.json
```

---

## 5. Key Implementation Notes

### 5.1 Tailwind CSS v4 Dark Theme Setup
```css
/* globals.css */
@import "tailwindcss";

@theme {
  --font-inter: "Inter", sans-serif;
  --font-instrument-serif: "Instrument Serif", serif;
  --font-geist-mono: "Geist Mono", monospace;
  --color-surface: #0a0a0a;
  --color-surface-card: #111111;
  --color-muted: #a0a0a0;
}
```

The `<html>` tag has `class="dark"` and `style="color-scheme: dark"`.

### 5.2 Font Loading (next/font)
```ts
// In layout.tsx
const inter = localFont({
  src: './fonts/Inter-Variable.woff2',
  variable: '--font-inter',
  display: 'swap',
})
// Same pattern for Instrument Serif and Geist Mono
// Apply: <body className={`${inter.variable} ${instSerif.variable} ${geistMono.variable}`}>
```

### 5.3 Hero Layout
```
┌──────────────────────────────────────┐
│  [Saurabh Sharma]         [GitHub]   │
│  (h2, small, uppercase?) | streak    │
│                           | card     │
│  Designing & Engineering  |          │
│  Digital Experiences      |          │
│  (h1, large, serif)       |          │
│                           |          │
│  [Get in touch] Book a call          │
│                                       │
│  X · GitHub · LinkedIn · Peerlist ·   │
│  Email                                │
└──────────────────────────────────────┘
```
The hero is split: main content on left, GitHub streak card on right (desktop only, stacks on mobile).

### 5.4 Grind Log Calendar Grid
The calendar is an interactive heatmap-style grid where each cell represents a day. Implement as:
```tsx
// Grid of 7 columns (days of week) × N rows
// Each cell is an anchor/button
// Color intensity based on activity level
// Current date highlighted
// Disabled dates (future) are dimmed
```

### 5.5 Motion Animations (import from `motion`)
```tsx
import { motion } from "motion/react";
// or: import * as motion from "motion/react-client";

// Scroll reveal
<motion.div
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
>
```

### 5.6 MDX Blog
```ts
// next.config.ts
import createMDX from '@next/mdx'
const withMDX = createMDX({})
export default withMDX({ pageExtensions: ['ts', 'tsx', 'mdx'] })
```

### 5.7 Vercel Analytics
```tsx
// In layout.tsx
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
// <Analytics /> and <SpeedInsights /> inside <body>
```

### 5.8 PostHog (optional, based on `/ingest/` prefix — self-hosted)
```tsx
// Using posthog-js
// Init in a useEffect on layout mount
```

---

## 6. Exact Data Flow

1. **Profile data** — Static data in `page.tsx` or a `data/profile.ts` file (name, tagline, social links, GitHub stats)
2. **Projects** — Array of objects in `data/projects.ts`: `{ title, description, image, url, github }`
3. **Blog posts** — MDX files in `content/blog/`, frontmatter for title, date, description, slug
4. **Grind log** — JSON/TS data file: `{ date: string, logNumber: string, content: string, leetcode?: string[] }[]`
5. **GitHub streak** — Could be a static embed or a GitHub-readme-stats-style card (check if it's a real-time embed or static)

---

## 7. Deployment

```bash
git init && git add . && git commit -m "init"
git remote add origin <your-repo-url>
git push -u origin main
# Connect repo to Vercel — it auto-detects Next.js
# Set env vars:
#   NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxx (if using PostHog)
```

Domain: Register any domain → point nameservers to Vercel → add custom domain in Vercel dashboard.

---

## 8. Customization Checklist (Make It Yours)

- [ ] Replace name "Saurabh Sharma" with your name
- [ ] Replace tagline with your own
- [ ] Replace profile photo (`/public/profile.png`)
- [ ] Replace social links (X, GitHub, LinkedIn, etc.)
- [ ] Replace project cards with your own projects
- [ ] Replace blog posts with your own MDX files
- [ ] Replace GitHub streak with your actual GitHub stats
- [ ] Replace ImageKit URLs with your own image hosting (or use Imgur, Cloudinary, or local)
- [ ] Replace domain in OG image URL
- [ ] Remove PostHog or replace with your own key
- [ ] Swap `@fontsource/*` fonts if you want different typefaces
- [ ] Update grind log data with your own daily logs
- [ ] Change favicon (`/public/favicon.ico`)

---

## 9. Design Essence (Why It Looks Good)

> **Minimalist dark mode with editorial typography.**

1. **High contrast, low noise**: Black background, white text, no gradients, no glassmorphism, no heavy shadows. Every element earns its space.
2. **Type pairing**: Instrument Serif (elegant, editorial serif for headlines) + Inter (clean, readable sans for body) gives a design-engineer feel — creative but precise.
3. **Generous whitespace**: Sections breathe. Nothing feels cramped. The layout is centered with a comfortable reading width (~680px).
4. **Subtle motion**: Scroll-triggered fade-ins add polish without being distracting. Animations are restrained (don't move things around, just reveal them).
5. **Personal log as feature**: The daily "Grind Log" gives the site authentic personality — it's not just a portfolio, it's a living document of the person's work. This is a unique differentiator.
6. **No over-engineering**: It's a static-ish Next.js site that could be plain HTML+CSS. Fast, light, loads instantly.

---

*Built with analysis of https://www.srbh.site/ — July 2026*
