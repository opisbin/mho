import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import ScrollReveal from "@/components/scroll-reveal";
import ProjectsGrid from "@/components/projects-grid";

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
          <ProjectsGrid />
        </ScrollReveal>
      </main>
    </>
  );
}
