export interface GrindEntry {
  date: string;
  logNumber: string;
  content: string;
  leetcode?: string[];
}

export const grindData: GrindEntry[] = [
  {
    date: "2026-07-16",
    logNumber: "#011",
    content: "Solved 3 LeetCode problems today (Two Sum II, Reverse Linked List, Merge Two Sorted Lists). Worked on the portfolio site's grind log calendar grid component. Also refactored the animation system to use Motion's layout animations.",
    leetcode: ["Two Sum II", "Reverse Linked List", "Merge Two Sorted Lists"],
  },
  {
    date: "2026-07-15",
    logNumber: "#010",
    content: "Built the calendar heatmap visualization for the grind log. Each cell represents a day with color intensity based on activity. Used CSS grid for layout.",
  },
  {
    date: "2026-07-14",
    logNumber: "#009",
    content: "Implemented responsive navigation with mobile hamburger menu. Added smooth scroll animations using Motion's scroll triggers.",
  },
];

export function getGrindEntry(date: string): GrindEntry | undefined {
  return grindData.find((e) => e.date === date);
}

export function generateCalendarData(year: number, month: number) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const cells: { date: string; day: number; active: boolean; isCurrent: boolean }[] = [];

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  for (let i = 0; i < firstDayOfWeek; i++) {
    cells.push({ date: "", day: 0, active: false, isCurrent: false });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = year + "-" + String(month + 1).padStart(2, "0") + "-" + String(day).padStart(2, "0");
    const hasEntry = grindData.some((e) => e.date === dateStr);
    const isCurrent = dateStr === todayStr;
    cells.push({ date: dateStr, day, active: hasEntry, isCurrent });
  }

  return cells;
}

export const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
