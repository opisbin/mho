"use client";

import ScrollReveal from "./scroll-reveal";
import ProjectCard from "./project-card";
import { projects } from "@/data/projects";
import Link from "next/link";

export default function ProjectsSection() {
  return (
    <ScrollReveal>
      <section className="border bd-cute rounded-xl p-4 sm:p-6" id="projects">
        <h2 className="text-lg font-medium tx-main mb-8">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
        <Link
          href="/projects"
          className="inline-block mt-6 text-sm tx-muted tx-hover underline underline-offset-4"
        >
          View all →
        </Link>
      </section>
    </ScrollReveal>
  );
}
