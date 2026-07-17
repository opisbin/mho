import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import ScrollReveal from "@/components/scroll-reveal";
import { profile, socialLinks } from "@/data/profile";

export const metadata: Metadata = {
  title: "About — Meherab Hossain",
  description: `Full-stack developer and designer based in Dhaka, Bangladesh. I build small, useful tools and write about AI-assisted dev work, indie SaaS, and developer workflows.`,
};

const workOn = [
  {
    title: "AI coding tools in practice",
    body: "Claude Code, Codex, Cursor, Hermes Agent. Not benchmark scores, but what actually holds up at 2am when the agent is on step 30 and the bill is climbing.",
  },
  {
    title: "Indie and dev-tool SaaS",
    body: "Small products with clear wedges. I write about the parts that aren't on the landing page: realistic MRR targets, marketing that doesn't feel like marketing, and why most \"AI wrapper\" ideas die in month two.",
  },
  {
    title: "Developer workflows",
    body: "The boring layer around AI agents: scripts that survive, CLIs that compose, configs that don't rot. Skills, hooks, MCP, scheduled jobs.",
  },
  {
    title: "Design and frontend",
    body: "Next.js, Tailwind, motion. The brief is always the same: ship something that feels fast, reads well, and doesn't beg for attention.",
  },
];

const notInterested = [
  "Benchmark theatre.",
  '"AGI by Q3" thought leadership.',
  "Tools that are demos with a landing page.",
  "Anything that requires pretending the model is the product.",
];

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
              {profile.title} · {profile.subtitle}
            </p>
          </div>

          <div className="border bd-cute rounded-xl p-4 sm:p-5 mb-4 space-y-4">
            <p className="text-sm tx-muted leading-relaxed">
              I&apos;m Meherab Hossain, a full-stack developer and designer. I build small, useful tools and write about the messy parts of AI-assisted dev work — token costs, runaway agents, the gap between vibe-coded demos and software you&apos;d ship to a customer.
            </p>
          </div>

          <div className="border bd-cute rounded-xl p-4 sm:p-5 mb-4">
            <h2 className="text-base font-medium tx-main mb-4">What I work on</h2>
            <div className="space-y-4">
              {workOn.map((item) => (
                <div key={item.title}>
                  <h3 className="text-sm font-medium tx-main mb-1">{item.title}</h3>
                  <p className="text-sm tx-muted leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border bd-cute rounded-xl p-4 sm:p-5 mb-4">
            <h2 className="text-base font-medium tx-main mb-4">What I&apos;m not interested in</h2>
            <ul className="space-y-2">
              {notInterested.map((item) => (
                <li key={item} className="text-sm tx-muted flex items-start gap-2">
                  <span className="tx-muted-darker mt-0.5">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border bd-cute rounded-xl p-4 sm:p-5 mb-4">
            <h2 className="text-base font-medium tx-main mb-4">How I work</h2>
            <p className="text-sm tx-muted leading-relaxed">
              I ship small. I keep things open source when I can. I&apos;d rather have 50 paying users who&apos;d miss the tool than 5,000 free users who churn the day a shinier thing shows up on Product Hunt. I write to think, and I publish what I learn so the next person doesn&apos;t have to rediscover it.
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
