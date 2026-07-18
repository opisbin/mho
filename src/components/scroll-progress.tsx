"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useReducedMotion } from "motion/react";

// In-page sections to track on the homepage, in document order.
// `id` must match the section elements rendered on that page.
const homeSections = [
  { id: "hero", label: "Intro" },
  { id: "github-contributions", label: "GitHub" },
  { id: "projects", label: "Projects" },
  { id: "blog", label: "Blogs" },
];

// Sub-pages are single documents — just label them by route.
function routeLabel(pathname: string): string {
  if (pathname.startsWith("/projects")) return "Projects";
  if (pathname.startsWith("/blog")) return "Blog";
  if (pathname.startsWith("/about")) return "About";
  return "Page";
}

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [active, setActive] = useState(
    isHome ? homeSections[0].label : routeLabel(pathname)
  );

  useEffect(() => {
    // Off the homepage, the label is just the route name — no section tracking.
    if (!isHome) {
      setActive(routeLabel(pathname));
      return;
    }

    setActive(homeSections[0].label);

    const observer = new IntersectionObserver(
      (entries) => {
        // Prefer the visible section closest to the top of the viewport.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          )[0];
        if (visible) {
          const match = homeSections.find((s) => s.id === visible.target.id);
          if (match) setActive(match.label);
        }
      },
      // Trigger when a section reaches the vertical middle band of the viewport.
      { rootMargin: "-40% 0px -55% 0px" }
    );

    homeSections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isHome, pathname]);

  return (
    <motion.div
      initial={reduce ? undefined : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        backgroundColor: "color-mix(in srgb, var(--nav-bg) 60%, transparent)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-2.5 py-1.5 rounded-full border bd-cute shadow-lg"
    >
      <svg width="20" height="20" viewBox="0 0 24 24">
        {/* Ring — rotated so progress starts at the top. */}
        <g transform="rotate(-90 12 12)">
          {/* Track */}
          <circle
            cx="12"
            cy="12"
            r="9"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="tx-muted opacity-25"
          />
          {/* Progress — Motion normalizes pathLength to 0–1, no dash math needed. */}
          <motion.circle
            cx="12"
            cy="12"
            r="9"
            fill="none"
            stroke="#ff9d3d"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ pathLength: scrollYProgress }}
          />
        </g>
        {/* Chevron in the center (upright — not affected by the ring rotation). */}
        <polyline
          points="9.5 10.5 12 13 14.5 10.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="tx-main"
        />
      </svg>
      <span className="relative text-xs tx-main pr-0.5 overflow-hidden">
        {/* Invisible sizer keeps the pill width stable during the swap. */}
        <span className="invisible whitespace-nowrap" aria-hidden="true">
          {active}
        </span>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={active}
            initial={reduce ? false : { y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { y: "-100%", opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 whitespace-nowrap"
          >
            {active}
          </motion.span>
        </AnimatePresence>
      </span>
    </motion.div>
  );
}
