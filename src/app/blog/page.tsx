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
          <header className="flex items-baseline justify-between mb-10">
            <h1
              style={{ letterSpacing: "0.08em" }}
              className="text-xl font-semibold tx-main font-serif-display"
            >
              Blog
            </h1>
            <span className="text-xs tx-muted tabular-nums">
              {blogPosts.length} posts
            </span>
          </header>

          <div className="flex flex-col">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block py-6 border-t bd-cute first:border-t-0 transition-colors"
              >
                <div className="flex items-baseline justify-between gap-4 mb-2">
                  <h3
                    className="text-base tx-main group-hover:tx-muted transition-colors font-serif-display"
                  >
                    {post.title}
                  </h3>
                  <time
                    dateTime={post.date}
                    className="text-[11px] tx-muted-darker tabular-nums whitespace-nowrap"
                  >
                    {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </time>
                </div>
                <p className="text-sm tx-muted leading-relaxed mb-3">{post.description}</p>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] tx-muted px-2 py-0.5 rounded-full border bd-cute font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-[11px] tx-muted-darker whitespace-nowrap inline-flex items-center gap-1">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {post.readingTime}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </ScrollReveal>
      </main>
    </>
  );
}
