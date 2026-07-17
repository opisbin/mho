// Blog data is now file-based: posts live as .md/.mdx files in content/blog/.
// Hermes (or any agent) drops a new file there with frontmatter and it shows up.
// See src/lib/blog-loader.ts for the loader + frontmatter schema.

export type { BlogPost } from "@/lib/blog-loader";
export { getAllPosts, getPostBySlug, getAllSlugs } from "@/lib/blog-loader";

import { getAllPosts } from "@/lib/blog-loader";

// Backward-compatible names used by existing pages.
export const blogPosts = getAllPosts();
