"use client";

import { useEffect, useRef, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const current = (document.documentElement.getAttribute("data-theme") as "dark" | "light") || "dark";
    setTheme(current);
    setMounted(true);
  }, []);

  const toggle = (e: React.MouseEvent) => {
    const next = theme === "dark" ? "light" : "dark";

    const applyTheme = () => {
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (err) {}
      setTheme(next);
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const supportsVT = (document as any).startViewTransition && !reduce;
    if (!supportsVT) {
      applyTheme();
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    if (!document.documentElement.classList.contains("theme-anim")) {
      document.documentElement.classList.add("theme-anim");
    }
    document.documentElement.style.setProperty("--reveal-x", `${x}px`);
    document.documentElement.style.setProperty("--reveal-y", `${y}px`);
    document.documentElement.style.setProperty("--reveal-r", `${endRadius}px`);

    const transition = (document as any).startViewTransition(() => {
      applyTheme();
    });
    transition.finished.finally(() => {
      document.documentElement.classList.remove("theme-anim");
    });
  };

  return (
    <button
      ref={buttonRef}
      onClick={toggle}
      aria-label="Toggle theme"
      className="tx-muted hover:tx-main transition-colors duration-200 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md"
    >
      {mounted ? (
        theme === "dark" ? (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )
      ) : (
        <span className="block w-[18px] h-[18px]" />
      )}
    </button>
  );
}
