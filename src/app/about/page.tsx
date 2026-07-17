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
          <h1 className="text-3xl tx-main mb-8 font-serif-display">
            About
          </h1>
          <p className="text-sm tx-muted leading-relaxed mb-6">
            I'm {profile.name}, a full-stack developer and designer based in {profile.location}.
            {profile.bio}
          </p>
          <p className="text-sm text-gray-400 leading-relaxed mb-6">
            I focus on the intersection of design and engineering ??? building products that don't just work,
            but feel good to use. I'm particularly interested in interactive interfaces, animation, and
            the craft of typography on the web.
          </p>
          <p className="text-sm text-gray-400 leading-relaxed mb-12">
            When I'm not coding, you can find me sketching interfaces, reading about new tools,
            or contributing to open source projects.
          </p>

          <h2 className="text-lg font-medium tx-main mb-4">Connect</h2>
          <div className="flex flex-col gap-2">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm tx-muted tx-hover transition-colors"
              >
                {link.name} ???
              </a>
            ))}
          </div>
        </ScrollReveal>
      </main>
    </>
  );
}
