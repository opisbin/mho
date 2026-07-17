import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import GitHubContributions from "@/components/github-contributions";
import ProjectsSection from "@/components/projects-section";
import BlogSection from "@/components/blog-section";
import ScrollReveal from "@/components/scroll-reveal";
import SocialLinks from "@/components/social-links";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main" className="max-w-[720px] mx-auto px-4 sm:px-6 pt-20 pb-16 space-y-6">
        <Hero />
        <GitHubContributions />
        <ProjectsSection />
        <BlogSection />
        <ScrollReveal>
          <footer className="border bd-cute rounded-xl p-4 sm:p-6 flex items-center justify-between">
            <p className="text-xs tx-muted-darker">© {new Date().getFullYear()} Meherab Hossain</p>
            <SocialLinks />
          </footer>
        </ScrollReveal>
      </main>
    </>
  );
}
