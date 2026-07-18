import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import GitHubContributions from "@/components/github-contributions";
import GrindLog from "@/components/grind-log";
import ProjectsSection from "@/components/projects-section";
import BlogSection from "@/components/blog-section";
import { blogPosts } from "@/data/blog";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main" className="max-w-[720px] mx-auto px-4 sm:px-6 pt-20 pb-16 space-y-6">
        <Hero />
        <GitHubContributions />
        <ProjectsSection />
        <BlogSection blogPosts={blogPosts} />
        <GrindLog />
      </main>
    </>
  );
}
