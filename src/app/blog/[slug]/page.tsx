import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { blogPosts, getPostBySlug } from "@/data/blog";
import { renderMarkdown } from "@/lib/blog-loader";
import Navbar from "@/components/navbar";
import ScrollReveal from "@/components/scroll-reveal";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not found" };
  return {
    title: `${post.title} — Meherab Hossain`,
    description: post.description,
    openGraph: {
      title: `${post.title} — Meherab Hossain`,
      description: post.description,
      type: "article",
      publishedTime: new Date(post.date).toISOString(),
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const others = blogPosts.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <>
      <Navbar />
      <main id="main" className="max-w-[680px] mx-auto px-4 sm:px-6 pt-32 pb-16">
        <ScrollReveal>
          <Link href="/blog" className="text-sm tx-muted tx-hover inline-flex items-center gap-1 mb-6">
            <span aria-hidden="true">←</span> All posts
          </Link>

          <div className="flex items-center gap-3 text-xs tx-muted-darker mb-4">
            <span>{new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl tx-main mb-4 font-serif-display">
            {post.title}
          </h1>

          {post.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full rounded-xl mb-8 object-cover max-h-80"
            />
          )}

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-8">
              {post.tags.map((tag) => (
                <span key={tag} className="text-[11px] tx-muted px-2 py-0.5 rounded-full border bd-cute">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <article
            className="blog-prose max-w-none tx-muted leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }}
          />

          {others.length > 0 && (
            <div className="border-t bd-cute pt-8 mt-12">
              <h2 className="text-sm font-medium tx-muted mb-4">More posts</h2>
              <div className="flex flex-col gap-3">
                {others.map((o) => (
                  <Link key={o.slug} href={`/blog/${o.slug}`} className="group block">
                    <h3 className="text-sm font-semibold tx-main group-hover:tx-muted transition-colors">{o.title}</h3>
                    <p className="text-xs tx-muted mt-1">{o.description}</p>
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
