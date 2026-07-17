"use client";

import { useEffect, useState } from "react";
import SocialLinks from "./social-links";

export default function Footer() {
  const [visits, setVisits] = useState<number | null>(null);

  useEffect(() => {
    // Hit counter once per browser session, then read lifetime tally
    const already = sessionStorage.getItem("visit-counted");
    const endpoint = already
      ? "https://abacus.jasoncameron.dev/get/srbh-portfolio-visits/visitors"
      : "https://abacus.jasoncameron.dev/hit/srbh-portfolio-visits/visitors";
    fetch(endpoint)
      .then((r) => r.json())
      .then((d) => {
        if (!already) sessionStorage.setItem("visit-counted", "1");
        setVisits(d.value);
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="border-t bd-cute mt-16 pt-6 pb-8 max-w-[720px] mx-auto px-4 sm:px-6 flex flex-col items-center gap-4">
      <div className="flex flex-col sm:flex-row items-center justify-between w-full">
        <div>
          <p className="text-xs tx-muted-darker text-center sm:text-left">
            Designed &amp; Developed by Meherab Hossain (Opi) with <span aria-label="love">❤️</span>
          </p>
          {visits !== null && (
            <p className="text-base tx-main tabular-nums mt-2 text-center sm:text-left font-serif-display">
              Visitors #{visits.toLocaleString()}
            </p>
          )}
        </div>
        <SocialLinks />
      </div>
    </footer>
  );
}
