"use client";

import { useState } from "react";
import Image from "next/image";
import ProjectCard from "@/components/project-card";
import { allProjects } from "@/data/projects";

type View = "grid" | "list";

const CATEGORY_ORDER = ["Software", "AI", "SaaS", "Services"];

export default function ProjectsGrid() {
  const [view, setView] = useState<View>("grid");

  // Group projects by category, preserving CATEGORY_ORDER
  const grouped: { category: string; items: typeof allProjects }[] = [];
  CATEGORY_ORDER.forEach((category) => {
    const items = allProjects.filter((p) => p.category === category);
    if (items.length > 0) grouped.push({ category, items });
  });

  return (
    <>
      {/* Header: title + subtitle (left), toggle (right) */}
      <div className="border bd-cute rounded-xl p-4 sm:p-5 mb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1
              style={{ letterSpacing: "0.01em" }}
              className="text-[36px] leading-none tx-main font-serif-display"
            >
              Projects
            </h1>
            <p className="text-sm tx-muted">
              Selected projects, experiments, and products
            </p>
          </div>
          <div className="inline-flex items-center border bd-cute rounded-lg overflow-hidden shrink-0" role="group" aria-label="Project view">
          <button
            type="button"
            onClick={() => setView("grid")}
            aria-pressed={view === "grid"}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
              view === "grid" ? "bg-[var(--text)] text-[var(--bg)]" : "tx-muted hover:tx-main"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            Grid
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            aria-pressed={view === "list"}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors border-l bd-cute ${
              view === "list" ? "bg-[var(--text)] text-[var(--bg)]" : "tx-muted hover:tx-main"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            List
          </button>
          </div>
        </div>
      </div>

      {/* Grouped projects */}
      <div className="space-y-4">
        {grouped.map(({ category, items }) => (
          <section key={category} className="border bd-cute rounded-xl p-4 sm:p-5">
            <h2 className="text-sm font-medium tx-muted uppercase tracking-wider mb-4">
              {category}
            </h2>
            {view === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {items.map((project, i) => (
                  <ProjectCard key={project.slug} project={project} index={i} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col border-t bd-cute">
                {items.map((project, i) => (
                  <ListRow key={project.slug} project={project} index={i} />
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </>
  );
}

function ListRow({ project, index }: { project: typeof allProjects[number]; index: number }) {
  return (
    <a
      href={`/projects/${project.slug}`}
      className="group block border-b bd-cute py-4 flex items-center justify-between gap-4"
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden border bd-cute"
          style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(6px)" }}
        >
          <Image
            src={project.image}
            alt={project.title}
            width={56}
            height={56}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm tx-main group-hover:tx-muted transition-colors font-medium">
            {project.title.split(" — ")[0]}
          </h3>
          <p className="text-xs tx-muted mt-0.5 truncate">{project.tagline}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs tx-muted-darker tabular-nums whitespace-nowrap">{project.year}</span>
        <span aria-hidden="true" className="inline-flex items-center justify-center w-9 h-9 rounded-full border bd-cute tx-muted transition-all duration-300 group-hover:tx-main group-hover:border-[var(--text)] group-hover:scale-110">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform duration-300">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </span>
      </div>
    </a>
  );
}
