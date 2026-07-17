import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import ScrollReveal from "@/components/scroll-reveal";
import { profile, socialLinks } from "@/data/profile";

export const metadata: Metadata = {
  title: "About — Meherab Hossain",
  description: `Full-stack developer and designer based in ${profile.location}. ${profile.bio}`,
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="max-w-[720px] mx-auto px-4 sm:px-6 pt-32 pb-16">
        <ScrollReveal>
          <div className="border bd-cute rounded-xl p-4 sm:p-5 mb-4">
            <h1
              style={{ letterSpacing: "0.01em" }}
              className="text-[36px] leading-none tx-main font-serif-display mb-2"
            >
              About
            </h1>
            <p className="text-sm tx-muted">
              {profile.title} · {profile.subtitle} based in {profile.location}
            </p>
          </div>

          <div className="border bd-cute rounded-xl p-4 sm:p-5 mb-4 space-y-4">
            <p className="text-sm tx-muted leading-relaxed">
              I'm {profile.name} — {profile.title.toLowerCase()} and {profile.subtitle.toLowerCase()} based in {profile.location}.
              {profile.bio}
            </p>
            <p className="text-sm tx-muted leading-relaxed">
              I focus on the intersection of design and engineering – building products that don&apos;t just work,
              but feel good to use. I&apos;m particularly interested in interactive interfaces, animation, and
              the craft of typography on the web.
            </p>
            <p className="text-sm tx-muted leading-relaxed">
              When I&apos;m not coding, you can find me sketching interfaces, reading about new tools,
              or contributing to open source projects.
            </p>
          </div>

          <div className="border bd-cute rounded-xl p-4 sm:p-5">
            <h2 className="text-base font-medium tx-main mb-4">Connect</h2>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border bd-cute text-sm tx-muted hover:tx-main hover:border-[var(--text)] transition-all"
                >
                  {link.name}
                  <span aria-hidden="true" className="opacity-50">→</span>
                </a>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </main>
    </>
  );
}
