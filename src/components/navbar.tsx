"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/data/profile";
import ThemeToggle from "./theme-toggle";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const navClass = `fixed top-0 left-0 right-0 z-50 bg-nav`;

  return (
    <nav className={navClass}>
      <div className="max-w-[720px] mx-auto px-4 sm:px-6 flex items-center justify-between h-14 border-b bd-cute">
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors duration-200 px-1 py-1 ${pathname === link.href ? "tx-main" : "tx-muted tx-hover"}`}
            >
              {link.name}
            </Link>
          ))}
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden tx-main p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            {mobileOpen ? (
              <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            ) : (
              <path d="M3 5H17M3 10H17M3 15H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            )}
          </svg>
        </button>
        <ThemeToggle />
      </div>
      <AnimatePresence>
        {mobileOpen && (
          reduce ? (
            <div
              ref={menuRef}
              className="md:hidden bg-nav backdrop-blur-md border-t bd-cute"
            >
              <div className="max-w-[720px] mx-auto px-4 py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm transition-colors px-2 py-3 min-h-[44px] flex items-center ${pathname === link.href ? "tx-main" : "tx-muted tx-hover"}`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="md:hidden bg-nav backdrop-blur-md border-t bd-cute"
            >
              <div className="max-w-[720px] mx-auto px-4 py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm transition-colors px-2 py-3 min-h-[44px] flex items-center ${pathname === link.href ? "tx-main" : "tx-muted tx-hover"}`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </nav>
  );
}
