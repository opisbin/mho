"use client";

import { useState, useMemo } from "react";
import { FiCheckCircle, FiArrowLeft, FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import { grindData, generateTimeline, barHeight, type GrindSegment } from "@/data/grind-data";

function Segment({ segment }: { segment: GrindSegment }) {
  if (typeof segment === "string") return <>{segment}</>;
  const external = /^https?:\/\//.test(segment.href);
  return (
    <a
      href={segment.href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="transition-opacity hover:opacity-80 underline-offset-2 hover:underline"
      style={{ color: "var(--grind-link)" }}
    >
      {segment.text}
    </a>
  );
}

export default function GrindLog() {
  const [currentEntryIndex, setCurrentEntryIndex] = useState(0);
  const timeline = useMemo(() => generateTimeline(), []);

  if (!grindData.length) {
    return (
      <section className="border bd-cute rounded-xl p-4 sm:p-6" id="grind">
        <h2 className="text-lg font-medium tx-main mb-8">Grind Log</h2>
        <p className="text-sm tx-muted">No logs yet. Start grinding!</p>
      </section>
    );
  }

  const entry = grindData[currentEntryIndex];

  // Newest entry is index 0. "Previous" moves to older entries (higher index).
  const goPrev = () => setCurrentEntryIndex((i) => Math.min(i + 1, grindData.length - 1));
  const goNext = () => setCurrentEntryIndex((i) => Math.max(i - 1, 0));

  const jumpTo = (entryIndex: number) => {
    if (entryIndex >= 0) setCurrentEntryIndex(entryIndex);
  };

  const selectedTimelineIndex = timeline.findIndex((d) => d.date === entry.date);

  const dateLabel = new Date(entry.date + "T00:00:00")
    .toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    .toUpperCase();

  return (
    <section className="border bd-cute rounded-xl p-4 sm:p-6" id="grind">
      {/* Header */}
      <h2 className="text-lg font-medium tx-main mb-8">Grind Log {entry.logNumber}</h2>

        {/* Checklist body */}
        <ul className="space-y-3 mb-8">
          {entry.items.map((item, i) => (
            <li key={i} className="flex gap-3 text-sm tx-muted leading-relaxed">
              <FiCheckCircle
                className="mt-0.5 shrink-0"
                size={15}
                style={{ color: "var(--grind-active)" }}
                aria-hidden="true"
              />
              <span>
                {item.segments.map((seg, j) => (
                  <Segment key={j} segment={seg} />
                ))}
              </span>
            </li>
          ))}
        </ul>

        {/* Timeline scrubber */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={goPrev}
              disabled={currentEntryIndex === grindData.length - 1}
              className="w-9 h-9 rounded-md border bd-cute flex items-center justify-center tx-muted hover:tx-main disabled:opacity-30 transition-colors"
              aria-label="Previous log entry"
            >
              <FiArrowLeft size={15} />
            </button>
            <p className="text-xs font-mono-display tx-muted tracking-[0.2em]">{dateLabel}</p>
            <button
              onClick={goNext}
              disabled={currentEntryIndex === 0}
              className="w-9 h-9 rounded-md border bd-cute flex items-center justify-center tx-muted hover:tx-main disabled:opacity-30 transition-colors"
              aria-label="Next log entry"
            >
              <FiArrowRight size={15} />
            </button>
          </div>

          <div className="flex items-end justify-center gap-[3px] h-14 overflow-hidden">
            {timeline.map((day, i) => {
              const isSelected = i === selectedTimelineIndex;
              const offset = i - selectedTimelineIndex; // <0 past, >0 future
              const h = Math.round(barHeight(offset) * 100);

              if (offset > 0) {
                // Faint dotted bars for days after the selected one.
                return (
                  <span
                    key={day.date}
                    className="w-[3px] rounded-full"
                    style={{
                      height: `${h}%`,
                      backgroundImage:
                        "repeating-linear-gradient(to top, var(--grind-bar) 0 2px, transparent 2px 5px)",
                      opacity: 0.4,
                    }}
                    aria-hidden="true"
                  />
                );
              }

              return (
                <button
                  key={day.date}
                  onClick={() => jumpTo(day.entryIndex)}
                  disabled={!day.hasEntry}
                  aria-label={day.date + (day.hasEntry ? " — has entry" : "")}
                  className={`w-[3px] rounded-full transition-all ${
                    day.hasEntry ? "cursor-pointer hover:brightness-150" : "cursor-default"
                  }`}
                  style={{
                    height: `${h}%`,
                    backgroundColor: isSelected ? "var(--grind-marker)" : "var(--grind-bar)",
                    opacity: isSelected ? 1 : 0.75,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Quote footer */}
        {entry.quote && (
          <div className="mt-8 pt-6 border-t bd-cute text-center">
            <p className="font-serif-display italic text-base tx-muted mb-2">
              &ldquo;{entry.quote.text}&rdquo;
            </p>
            <p className="text-xs tx-muted-darker">
              — {entry.quote.author}
              {entry.quote.href && (
                <a
                  href={entry.quote.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center ml-1 hover:tx-muted transition-colors"
                  aria-label={"Link for " + entry.quote.author}
                >
                  <FiArrowUpRight size={12} />
                </a>
              )}
            </p>
          </div>
        )}
    </section>
  );
}
