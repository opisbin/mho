"use client";

import { useEffect, useRef, useState } from "react";

const springDefaults = { damping: 45, stiffness: 400, mass: 1, restDelta: 0.001, restSpeed: 0.001 };

function DefaultCursorSVG() {
  return (
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 3L29 16L16 18L13 29L3 3Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SmoothCursor() {
  const [hidden, setHidden] = useState(true);
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const pos = useRef({ x: 0, y: 0 });
  const spring = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const prev = useRef({ x: 0, y: 0 });
  const rot = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const { damping, stiffness, mass } = springDefaults;
    let raf: number;

    const tick = () => {
      const dt = 16;
      const fx = -stiffness * (spring.current.x - pos.current.x) - damping * (spring.current.vx / dt) * mass;
      const fy = -stiffness * (spring.current.y - pos.current.y) - damping * (spring.current.vy / dt) * mass;

      spring.current.vx += (fx / mass) * dt;
      spring.current.vy += (fy / mass) * dt;
      spring.current.x += spring.current.vx * dt;
      spring.current.y += spring.current.vy * dt;

      // Rotation from velocity
      const sx = pos.current.x - prev.current.x;
      const sy = pos.current.y - prev.current.y;
      const spd = Math.hypot(sx, sy);
      if (spd > 0.5) {
        const target = (Math.atan2(sy, sx) * 180) / Math.PI + 90;
        let diff = target - rot.current;
        while (diff > 180) diff -= 360;
        while (diff < -180) diff += 360;
        rot.current += diff * 0.15;
      }
      prev.current.x = pos.current.x;
      prev.current.y = pos.current.y;

      if (outerRef.current) {
        outerRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }
      if (innerRef.current) {
        innerRef.current.style.transform = `translate3d(${spring.current.x - pos.current.x}px, ${spring.current.y - pos.current.y}px, 0) rotate(${rot.current}deg)`;
      }

      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      // Snap spring on first move
      if (spring.current.x === 0 && spring.current.y === 0) {
        spring.current.x = e.clientX;
        spring.current.y = e.clientY;
        prev.current.x = e.clientX;
        prev.current.y = e.clientY;
      }
      setHidden(false);
    };

    const onLeave = () => setHidden(true);
    const onEnter = () => setHidden(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={outerRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 9999,
        opacity: hidden ? 0 : 1,
        transition: "opacity 0.15s ease",
        color: "var(--text)",
      }}
    >
      <div
        ref={innerRef}
        style={{
          position: "absolute",
          top: -11,
          left: -11,
          willChange: "transform",
        }}
      >
        <DefaultCursorSVG />
      </div>
    </div>
  );
}
