import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import ScrollReveal from "@/components/scroll-reveal";
import ProjectCard from "@/components/project-card";
import { allProjects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects — Meherab Hossain",
  description: "Selected work, experiments, and shipped products by Meherab Hossain.",
};

export default function ProjectsPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="max-w-[720px] mx-auto px-4 sm:px-6 pt-32 pb-16">
        <ScrollReveal>
          <h1 className="text-3xl tx-main mb-8 font-serif-display">
            Projects
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allProjects.map((project, i) => (
              <ProjectCard key={project.title} project={project} index={i} />
            ))}
          </div>
        </ScrollReveal>
      </main>
    </>
  );
}
