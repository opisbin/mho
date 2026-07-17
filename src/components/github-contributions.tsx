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

interface Calendar {
  totalContributions: number;
  weeks: Week[];
  months: { name: string; year: number; firstDay: string }[];
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

  const levelOpacity = (color: string) => {
    if (!color) return 0;
    return 1;
  };

  if (err) {
    return (
      <section className="border bd-cute rounded-xl p-4 sm:p-6">
        <h2 className="text-sm font-medium tx-muted mb-3">
          GitHub Contributions
        </h2>
        <p className="text-xs tx-muted-darker">Add GITHUB_TOKEN to .env.local</p>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="border bd-cute rounded-xl p-4 sm:p-6">
        <h2 className="text-sm font-medium tx-muted mb-3">
          GitHub Contributions
        </h2>
        <div className="flex gap-0.5 flex-wrap">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-sm animate-pulse"
              style={{ backgroundColor: "var(--grind-empty)" }}
            />
          ))}
        </div>
      </section>
    );
  }

  const weekDays = ["Mon", "", "Wed", "", "Fri", "", ""];
  const monthLabels = data.months.map((m) => ({ ...m, label: m.name.slice(0, 3) }));

  return (
    <section className="border bd-cute rounded-xl p-4 sm:p-6" id="github-contributions">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-sm font-medium tx-main">GitHub Contributions</h2>
        <span className="text-xs tx-muted-darker">
          {data.totalContributions} contributions this year
        </span>
      </div>
      <div className="overflow-x-auto">
        <div className="flex gap-0.5" style={{ minWidth: data.weeks.length * 12 }}>
          {data.weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-0.5">
              {week.contributionDays.map((day, di) => (
                <div
                  key={di}
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{ backgroundColor: day.color || "var(--grind-empty)" }}
                  title={`${day.date}: ${day.contributionCount} contributions`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
