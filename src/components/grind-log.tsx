"use client";

import { useState, useCallback } from "react";
import { grindData, generateCalendarData, monthNames, getGrindEntry } from "@/data/grind-data";

const today = new Date();

export default function GrindLog() {
  const [currentEntryIndex, setCurrentEntryIndex] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  if (!grindData.length) {
    return (
      <section className="py-16 sm:py-20" id="grind">
        <h2 className="text-lg font-medium tx-main mb-8">Grind Log</h2>
        <p className="text-sm tx-muted">No logs yet. Start grinding!</p>
      </section>
    );
  }

  const currentEntry = grindData[currentEntryIndex];
  const calendarCells = generateCalendarData(currentYear, currentMonth);

  const goPrev = () => { if (currentEntryIndex < grindData.length - 1) setCurrentEntryIndex(currentEntryIndex + 1); };
  const goNext = () => { if (currentEntryIndex > 0) setCurrentEntryIndex(currentEntryIndex - 1); };
  const goPrevMonth = () => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); } else setCurrentMonth(currentMonth - 1); };
  const goNextMonth = () => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); } else setCurrentMonth(currentMonth + 1); };

  const jumpToDate = useCallback((dateStr: string) => {
    if (!dateStr) return;
    const idx = grindData.findIndex((e) => e.date === dateStr);
    if (idx >= 0) setCurrentEntryIndex(idx);
  }, []);

  const todayStr = today.toISOString().split("T")[0];

  return (
    <section className="py-16 sm:py-20" id="grind">
      <h2 className="text-lg font-medium tx-main mb-8">Grind Log</h2>
      <div className="surface p-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs tx-muted mb-1">{currentEntry.logNumber}</p>
            <p className="text-xs tx-muted uppercase tracking-wide">{new Date(currentEntry.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={goPrev} disabled={currentEntryIndex === grindData.length - 1} className="text-xs tx-muted hover:tx-main disabled:opacity-30 transition-colors px-2 py-1 min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Previous entry">← Prev</button>
            <button onClick={goNext} disabled={currentEntryIndex === 0} className="text-xs tx-muted hover:tx-main disabled:opacity-30 transition-colors px-2 py-1 min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Next entry">Next →</button>
          </div>
        </div>
        <p className="text-sm tx-muted leading-relaxed mb-3">{currentEntry.content}</p>
        {currentEntry.leetcode && currentEntry.leetcode.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {currentEntry.leetcode.map((problem) => (
              <span key={problem} className="text-xs px-2.5 py-1 rounded-full tx-muted border bd-cute" style={{ backgroundColor: "var(--grind-empty)" }}>{problem}</span>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={goPrevMonth} className="text-xs tx-muted hover:tx-main px-2 py-1 min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Previous month">←</button>
        <p className="text-sm tx-main">{monthNames[currentMonth]} {currentYear}</p>
        <button onClick={goNextMonth} className="text-xs tx-muted hover:tx-main px-2 py-1 min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Next month">→</button>
      </div>
      <div className="grid grid-cols-7 gap-1.5 min-w-0">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="text-[10px] tx-muted-darker text-center h-4 flex items-center justify-center">{d}</div>
        ))}
        {calendarCells.map((cell, i) => {
          if (cell.day === 0) return <div key={i} className="aspect-square" />;

          const isFuture = cell.date > todayStr;
          const isToday = cell.isCurrent;
          const isActive = cell.active && !isFuture;

          return (
            <button
              key={i}
              onClick={() => jumpToDate(cell.date)}
              disabled={!isActive && !isToday}
              aria-label={cell.date}
              className={`aspect-square rounded-sm transition-colors flex items-center justify-center text-[9px] cursor-pointer
                ${isToday ? "bg-white ring-1 ring-white/40" : ""}
                ${isActive && !isToday ? "hover:brightness-125 active:brightness-150" : ""}
                ${!isActive && !isToday && cell.day > 0 ? "opacity-30" : ""}
                ${cell.day === 0 ? "bg-transparent" : ""}
              `}
              style={
                isFuture && !isToday
                  ? { backgroundColor: "var(--grind-empty)", opacity: 0.25, cursor: "not-allowed" }
                  : isToday
                    ? {}
                    : isActive
                      ? { backgroundColor: "var(--grind-active)" }
                      : cell.day > 0
                        ? { backgroundColor: "var(--grind-empty)" }
                        : {}
              }
            >
              {cell.day > 0 && (
                <span className={isToday ? "tx-main" : "tx-muted-darker"}>{cell.day}</span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
