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
          <h1 className="text-3xl tx-main mb-8 font-serif-display">
            Blog
          </h1>
          <div className="flex flex-col divide-y bd-cute">
            {blogPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group py-5 block">
                <div className="flex items-baseline justify-between gap-4 mb-2">
                  <h3 className="text-base tx-main group-hover:tx-muted transition-colors" style={{ fontFamily: "var(--font-instrument-serif)" }}>
                    {post.title}
                  </h3>
                  <span className="text-xs tx-muted-darker whitespace-nowrap">
                    {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <p className="text-sm tx-muted">{post.description}</p>
              </Link>
            ))}
          </div>
        </ScrollReveal>
      </main>
    </>
  );
}
