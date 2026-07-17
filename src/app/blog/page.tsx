import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import ScrollReveal from "@/components/scroll-reveal";
import { blogPosts } from "@/data/blog";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog — Meherab Hossain",
  description: "Notes on design, engineering, and the craft of building for the web.",
};

export default function BlogPage() {
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
              Blog
            </h1>
            <p className="text-sm tx-muted">
              Notes on design, engineering, and the craft of building for the web · {blogPosts.length} posts
            </p>
          </div>

          <div className="border bd-cute rounded-xl p-4 sm:p-5">
            <div className="flex flex-col">
              {blogPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block border-b bd-cute last:border-b-0 py-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="min-w-0">
                      <h3 className="text-sm font-medium tx-main group-hover:tx-muted transition-colors truncate">
                        {post.title}
                      </h3>
                      <p className="text-xs tx-muted mt-0.5 truncate">{post.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <time
                          dateTime={post.date}
                          className="text-[11px] tx-muted-darker tabular-nums"
                        >
                          {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </time>
                        <span aria-hidden="true" className="text-[11px] tx-muted-darker">·</span>
                        <span className="text-[11px] tx-muted-darker">{post.readingTime}</span>
                      </div>
                    </div>
                  </div>
                  <span aria-hidden="true" className="inline-flex items-center justify-center w-9 h-9 shrink-0 rounded-full border bd-cute tx-muted transition-all duration-300 group-hover:tx-main group-hover:border-[var(--text)] group-hover:scale-110">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform duration-300">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </main>
    </>
  );
}
