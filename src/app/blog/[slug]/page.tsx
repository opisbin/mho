import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPosts } from "@/data/blog";
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
  const post = blogPosts.find((p) => p.slug === slug);
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
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <>
      <Navbar />
      <main id="main" className="max-w-[680px] mx-auto px-4 sm:px-6 pt-32 pb-16">
        <ScrollReveal>
          <p className="text-xs tx-muted-darker mb-4">
            {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
          <h1 className="text-3xl sm:text-4xl tx-main mb-8 font-serif-display">
            {post.title}
          </h1>
          <article className="prose prose-sm max-w-none tx-muted leading-relaxed">
            <p>{post.description}</p>
            <p>This is a placeholder blog post. In a full implementation, this would render MDX content from <code className="tx-muted-darker">content/blog/{slug}.mdx</code>.</p>
          </article>
        </ScrollReveal>
      </main>
    </>
  );
}
