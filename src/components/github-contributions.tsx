"use client";

import { useEffect, useState } from "react";

interface Day {
  contributionCount: number;
  date: string;
  color: string;
  weekday: number;
}

interface Week {
  contributionDays: Day[];
}

interface MonthMeta {
  name: string;
  year: number;
  firstDay: string;
}

interface Calendar {
  totalContributions: number;
  weeks: Week[];
  months: MonthMeta[];
}

// GitHub colors map to ~5 levels. Map to our own palette tokens (dark+light aware).
const GITHUB_LEVEL_COLORS: Record<string, string> = {
  "#ebedf0": "0",
  "#c6e48b": "1",
  "#7bc96f": "2",
  "#239a3b": "3",
  "#196127": "4",
  "#9be9a8": "1",
  "#40c463": "2",
  "#30a14e": "3",
  "#216e39": "4",
};

function levelFor(day: Day): number {
  // Prefer count-based: 0 -> 0, 1-3 ->1, 4-6 ->2, 7-9 ->3, 10+ ->4
  if (day.contributionCount <= 0) return 0;
  if (day.contributionCount <= 3) return 1;
  if (day.contributionCount <= 6) return 2;
  if (day.contributionCount <= 9) return 3;
  return 4;
}

function colorVar(level: number): string {
  return `var(--contrib-${level})`;
}

export default function GitHubContributions() {
  const [data, setData] = useState<Calendar | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch("/api/github-contributions")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setErr(d.error);
        else setData(d);
      })
      .catch((e) => setErr(e.message));
  }, []);

  if (err) {
    return (
      <section className="border bd-cute rounded-xl p-4 sm:p-6" id="github-contributions">
        <h2 className="text-sm font-medium tx-main mb-3">GitHub Contributions</h2>
        <p className="text-xs tx-muted-darker">Add GITHUB_TOKEN to .env.local to load contribution graph.</p>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="border bd-cute rounded-xl p-4 sm:p-6" id="github-contributions">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-sm font-medium tx-main">GitHub Contributions</h2>
          <span className="text-xs tx-muted-darker">Loading…</span>
        </div>
        <div className="flex gap-0.5 flex-wrap">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 animate-pulse rounded-[2px]"
              style={{ backgroundColor: "var(--grind-empty)" }}
            />
          ))}
        </div>
      </section>
    );
  }

  // Month labels: for each week column, find if a month starts within it (first day of month).
  // GitHub returns months meta; use firstDay to position label under correct week.
  const weekIndexByDate = new Map<string, number>();
  data.weeks.forEach((w, i) => {
    const first = w.contributionDays.find((d) => d);
    if (first) weekIndexByDate.set(first.date, i);
  });

  const monthMarkers: { label: string; weekIndex: number }[] = [];
  data.months.forEach((m) => {
    // Find week whose range contains firstDay
    const target = new Date(m.firstDay);
    let foundIdx = -1;
    for (let i = 0; i < data.weeks.length; i++) {
      const wk = data.weeks[i];
      if (!wk.contributionDays.length) continue;
      const start = new Date(wk.contributionDays[0].date).getTime();
      const end = start + 6 * 86400000;
      if (target.getTime() >= start && target.getTime() <= end) {
        foundIdx = i;
        break;
      }
    }
    if (foundIdx >= 0) {
      monthMarkers.push({ label: m.name.slice(0, 3), weekIndex: foundIdx });
    }
  });

  const weekDayLabels = ["Mon", "Wed", "Fri"];

  return (
    <section className="border bd-cute rounded-xl p-4 sm:p-6" id="github-contributions">
      <div className="flex items-baseline justify-between mb-4">
        <h2 style={{ letterSpacing: "0.08em" }} className="text-xl font-semibold tx-main font-serif-display">GitHub</h2>
        <span className="text-xs tx-muted tabular-nums">
          {data.totalContributions.toLocaleString()} contributions this year
        </span>
      </div>

      <div className="w-full">
        {/* Month labels row — same grid as weeks */}
        <div className="flex" aria-hidden="true">
          <div className="w-[26px] shrink-0" />
          <div className="grid flex-1" style={{ gridTemplateColumns: `repeat(${data.weeks.length}, 1fr)`, gap: "2px" }}>
            {data.weeks.map((_, wi) => {
              const marker = monthMarkers.find((m) => m.weekIndex === wi);
              return (
                <div key={wi} className="text-[9px] tx-muted-darker leading-3 min-w-0">
                  {marker ? marker.label : ""}
                </div>
              );
            })}
          </div>
        </div>

        {/* Body: weekday gutter + weeks grid */}
        <div className="flex mt-0.5" style={{ gap: "4px" }}>
          <div className="flex flex-col w-[26px] shrink-0 pt-0.5" aria-hidden="true">
            {Array.from({ length: 7 }).map((_, i) => {
              const weekday = (i + 1) % 7;
              const labelIdx = [1, 3, 5].indexOf(weekday);
              return (
                <div key={i} className="flex-1 text-[9px] tx-muted-darker leading-[10px]">
                  {labelIdx >= 0 ? weekDayLabels[labelIdx] : ""}
                </div>
              );
            })}
          </div>

          <div className="grid flex-1" style={{ gridTemplateColumns: `repeat(${data.weeks.length}, 1fr)`, gap: "2px" }}>
            {data.weeks.map((week, wi) => (
              <div key={wi} className="grid" style={{ gridTemplateRows: `repeat(7, 1fr)`, gap: "2px" }}>
                {week.contributionDays.map((day, di) => {
                  const lvl = levelFor(day);
                  return (
                    <div
                      key={di}
                      className="w-full aspect-square rounded-[2px] transition-colors"
                      style={{ backgroundColor: colorVar(lvl) }}
                      title={`${day.date}: ${day.contributionCount} contributions`}
                      role="img"
                      aria-label={`${day.date}: ${day.contributionCount} contributions`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 mt-1 text-[9px] tx-muted-darker pl-[30px]">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((lvl) => (
            <div
              key={lvl}
              className="w-2.5 h-2.5 rounded-[2px]"
              style={{ backgroundColor: colorVar(lvl) }}
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </section>
  );
}
