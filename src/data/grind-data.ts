// A "segment" is a piece of an accomplishment line. A plain string renders as
// text; an object renders as an inline link (red accent in the UI).
export type GrindSegment = string | { text: string; href: string };

export interface GrindItem {
  segments: GrindSegment[];
}

export interface GrindQuote {
  text: string;
  author: string;
  href?: string;
}

export interface GrindEntry {
  date: string; // YYYY-MM-DD
  logNumber: string; // "#012"
  items: GrindItem[];
  quote?: GrindQuote;
}

// Newest entry first.
export const grindData: GrindEntry[] = [
  {
    date: "2026-07-17",
    logNumber: "#012",
    items: [
      {
        segments: [
          "Shipped a self-healing autoscaler for ",
          { text: "Nova", href: "https://ping.srbh.site" },
          ". The RL policy now reads live Istio traffic and adjusts replica counts every 5s — rollback stays under 8s across all 3 regions.",
        ],
      },
      {
        segments: [
          "Added a token-level replay timeline to ",
          { text: "Vox", href: "https://gallery.srbh.site" },
          " so you can scrub through every tool call and reasoning step of a multi-agent run like a video.",
        ],
      },
      {
        segments: [
          "Published a new post: ",
          {
            text: "Claude Code v2.1.212: Anthropic Finally Admits Agents Run Away",
            href: "/blog/claude-code-v2-1-212",
          },
          ".",
        ],
      },
    ],
    quote: {
      text: "Build the thing that builds the thing.",
      author: "Meherab Hossain",
    },
  },
  {
    date: "2026-07-16",
    logNumber: "#011",
    items: [
      {
        segments: [
          "Tuned ",
          { text: "Vox", href: "https://gallery.srbh.site" },
          "'s capability router — subtasks now dispatch by tags instead of hardcoded roles, dropping p95 latency to 1.2s.",
        ],
      },
      { segments: ["Wired Synth's constraint DSL to enforce foreign-key cardinality on generated rows before export."] },
      {
        segments: [
          "Rebuilt the portfolio's grind log as a horizontal timeline scrubber with ",
          { text: "Motion", href: "https://motion.dev" },
          " transitions.",
        ],
      },
    ],
  },
  {
    date: "2026-07-15",
    logNumber: "#010",
    items: [
      {
        segments: [
          "Drafted ",
          {
            text: "Claude Code Can Now Click Its Own Buttons",
            href: "/blog/claude-code-can-now-click-its-own-buttons",
          },
          " after testing the macOS computer-use preview end to end.",
        ],
      },
      { segments: ["Pushed Flux past 10k events/sec at sub-50ms latency on the Redis Streams pipeline."] },
    ],
  },
  {
    date: "2026-07-14",
    logNumber: "#009",
    items: [
      { segments: ["Reworked the portfolio navigation with a mobile menu and scroll-linked reveal animations."] },
      {
        segments: [
          "Migrated Synth's tabular diffusion sampler to ",
          { text: "Rust", href: "https://www.rust-lang.org" },
          ", lifting throughput to 120k rows/sec.",
        ],
      },
    ],
  },
];

export function getGrindEntry(date: string): GrindEntry | undefined {
  return grindData.find((e) => e.date === date);
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function toDateStr(d: Date): string {
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
}

export interface TimelineDay {
  date: string;
  hasEntry: boolean;
  entryIndex: number; // index into grindData, or -1
}

// Builds the horizontal day-strip window: a run of days ending a couple weeks
// in the future so the "upcoming" bars render as the faint dotted section.
export function generateTimeline(lookbackDays = 60, lookaheadDays = 21): TimelineDay[] {
  const today = new Date();
  const entryDates = grindData.map((e) => e.date);
  const earliest = entryDates.length
    ? entryDates.reduce((a, b) => (a < b ? a : b))
    : toDateStr(today);

  let start = addDays(today, -lookbackDays);
  if (toDateStr(start) > earliest) start = new Date(earliest);
  const end = addDays(today, lookaheadDays);

  const days: TimelineDay[] = [];
  for (let d = new Date(start); toDateStr(d) <= toDateStr(end); d = addDays(d, 1)) {
    const dateStr = toDateStr(d);
    const entryIndex = grindData.findIndex((e) => e.date === dateStr);
    days.push({ date: dateStr, hasEntry: entryIndex >= 0, entryIndex });
  }
  return days;
}

// Bar height as a ramp that swells toward the selected day and tapers off
// after it — matching the "crescendo into the marker" look. `offset` is the
// day's distance from the selected day (negative = past, positive = future).
export function barHeight(offset: number): number {
  if (offset <= 0) {
    // Past: rise smoothly from a short floor up to full height at the marker.
    const t = Math.max(0, 1 + offset / 18); // reaches 0 ~18 days before
    return 0.22 + Math.pow(t, 1.6) * 0.78;
  }
  // Future: quick drop then a low, gently fading tail.
  const t = Math.max(0, 1 - offset / 16);
  return 0.15 + Math.pow(t, 1.4) * 0.35;
}
