"use client";

import ScrollReveal from "./scroll-reveal";
import SocialLinks from "./social-links";
import { profile } from "@/data/profile";

// Deterministic pseudo-random so server + client render identical streaks (no hydration mismatch).
function predictStreak(seed: number): boolean {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x) > 0.4;
}

export default function Hero() {
  return (
    <ScrollReveal>
      <section className="hero-grid border bd-cute rounded-xl p-4 sm:p-6 pt-8 pb-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12">
          <div className="flex-1">
            <h2 className="text-sm font-medium tx-main tracking-wide mb-2">{profile.subtitle}</h2>
            <h1 className="text-4xl sm:text-5xl lg:text-[42px] leading-tight tx-main mb-6 font-serif-display" style={{ letterSpacing: "0.9px" }}>{profile.title}</h1>
            <div className="flex items-center gap-4 mb-8">
              <a href="mailto:hello@meherab.dev" className="inline-flex items-center px-6 py-2.5 rounded-full border border-current tx-main text-sm font-medium hover:bg-current hover:text-[var(--bg)] transition-all duration-200">Get in touch</a>
              <a href="mailto:hello@meherab.dev?subject=Booking%20a%20call" className="text-sm tx-muted tx-hover underline underline-offset-4">Book a call</a>
            </div>
            <SocialLinks />
          </div>
          <div className="hidden lg:block flex-shrink-0">
            <div className="surface surface-hover p-4 w-[260px]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs tx-muted" style={{ backgroundColor: "var(--surface-card)" }} aria-hidden="true">SS</div>
                <div>
                  <p className="text-sm tx-main font-medium">{profile.name}</p>
                  <p className="text-xs tx-muted">{profile.location}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs tx-muted mb-2"><span aria-hidden="true">🔥</span><span>12 day streak</span><span>Total: 487</span></div>
              <div className="flex gap-0.5 flex-wrap">
                {Array.from({ length: 49 }).map((_, i) => {
                  const active = predictStreak(i);
                  return <div key={i} className="w-[6px] h-[6px] rounded-sm" style={{ backgroundColor: active ? "#16a34a" : "var(--grind-empty)" }} />;
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}

