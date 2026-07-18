"use client";

import { motion } from "motion/react";
import ScrollReveal from "./scroll-reveal";
import SocialLinks from "./social-links";
import { profile } from "@/data/profile";
import { useState, useEffect } from "react";

export default function Hero() {
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    fetch("/api/github-contributions")
      .then((r) => r.json())
      .then((d) => {
        if (d.avatarUrl) setAvatarUrl(d.avatarUrl);
      })
      .catch(() => {});
  }, []);
  return (
    <ScrollReveal>
      <section id="hero" className="hero-grid border bd-cute rounded-xl p-4 sm:p-6 pt-8 pb-12">
        <div className="flex items-center gap-3 mb-6">
          {avatarUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={profile.name}
              width={48}
              height={48}
              className="rounded-lg w-12 h-12 object-cover"
            />
          )}
          <div>
            <p className="text-sm font-medium tx-main">{profile.name}</p>
            <p className="text-xs tx-muted">Software Engineer</p>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12">
          <div className="flex-1">
            <h1 className="text-4xl sm:text-5xl lg:text-[42px] leading-tight tx-main mb-6 font-serif-display" style={{ letterSpacing: "0.9px" }}>{profile.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mb-8 group/ctas">
              <motion.a
                href="mailto:hmeherab@outlook.com"
                className="btn-primary inline-flex items-center gap-1.5 px-5 py-1.5 rounded-lg text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <span>Get in touch</span>
                <motion.span
                  initial={{ x: 0, opacity: 0.5 }}
                  whileHover={{ x: 3, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="inline-block"
                  aria-hidden="true"
                >
                  →
                </motion.span>
              </motion.a>
              <motion.a
                href="mailto:hmeherab@outlook.com?subject=Booking%20a%20call"
                className="btn-ghost inline-flex items-center gap-1.5 px-5 py-1.5 rounded-lg border text-sm font-medium"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <span>Book a call</span>
                <motion.span
                  initial={{ x: 0, opacity: 0.4 }}
                  whileHover={{ x: 3, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="inline-block"
                  aria-hidden="true"
                >
                  →
                </motion.span>
              </motion.a>
            </div>
            <SocialLinks />
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}

