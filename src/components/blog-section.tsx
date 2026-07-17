"use client";

import ScrollReveal from "./scroll-reveal";
import { blogPosts } from "@/data/blog";
import Link from "next/link";

export default function BlogSection() {
  return (
    <ScrollReveal>
      <section className="border bd-cute rounded-xl p-4 sm:p-6" id="blog">
        <h2 className="text-lg font-medium tx-main mb-8">Blogs</h2>
        <div className="flex flex-col gap-6">
          {blogPosts.slice(0, 3).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block"
            >
              <div className="flex items-start justify-between gap-4">
                <h3
                  className="text-[15px] tx-main group-hover:tx-muted transition-colors font-serif-display"
                >
                  {post.title}
                </h3>
                <span className="text-xs tx-muted-darker whitespace-nowrap mt-1">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </Link>
          ))}
        </div>
        <Link
          href="/blog"
          className="inline-block mt-6 text-sm tx-muted tx-hover underline underline-offset-4"
        >
          View all →
        </Link>
      </section>
    </ScrollReveal>
  );
}
