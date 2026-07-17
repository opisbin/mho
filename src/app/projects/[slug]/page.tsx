import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/navbar";
import ScrollReveal from "@/components/scroll-reveal";
import { allProjects, getProjectBySlug } from "@/data/projects";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return allProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: `${project.title} — Meherab Hossain`,
    description: project.tagline,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const others = allProjects.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <>
      <Navbar />
      <main id="main" className="max-w-[720px] mx-auto px-4 sm:px-6 pt-32 pb-16">
        <ScrollReveal>
          <Link href="/projects" className="text-sm tx-muted tx-hover inline-flex items-center gap-1 mb-6">
            <span aria-hidden="true">←</span> All projects
          </Link>

          <p className="text-xs tx-muted-darker mb-2">{project.year} · {project.tags.join(" · ")}</p>
          <h1 className="text-3xl sm:text-4xl tx-main mb-2 font-serif-display">{project.title}</h1>
          <p className="text-sm tx-muted mb-6 leading-relaxed">{project.tagline}</p>

          <div className="aspect-video rounded-xl overflow-hidden bg-surface-card border bd-cute mb-8">
            <Image
              src={project.image}
              alt={project.title}
              width={1200}
              height={675}
              priority
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8 border bd-cute rounded-xl p-4">
            {project.metrics.map((m) => (
              <div key={m.label}>
                <p className="text-lg font-semibold tx-main">{m.value}</p>
                <p className="text-xs tx-muted-darker">{m.label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4 mb-8">
            <p className="text-sm tx-muted leading-relaxed">{project.longDescription}</p>
          </div>

          <div className="flex flex-wrap gap-3 mb-12">
            {project.url !== undefined && (
              <a
                className="btn-primary inline-flex items-center gap-1.5 px-5 py-1.5 rounded-lg text-sm font-medium cursor-not-allowed opacity-70"
              >
                Live demo →
              </a>
            )}
            {project.github !== undefined && (
              <a
                className="btn-ghost inline-flex items-center gap-1.5 px-5 py-1.5 rounded-lg border text-sm font-medium cursor-not-allowed opacity-70"
              >
                Source on GitHub
              </a>
            )}
          </div>

          {others.length > 0 && (
            <div className="border-t bd-cute pt-8">
              <h2 className="text-sm font-medium tx-muted mb-4">More projects</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {others.map((o) => (
                  <Link key={o.slug} href={`/projects/${o.slug}`} className="group block">
                    <h3 className="text-sm font-semibold tx-main group-hover:tx-muted transition-colors">{o.title}</h3>
                    <p className="text-xs tx-muted mt-1">{o.tagline}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </ScrollReveal>
      </main>
    </>
  );
}
