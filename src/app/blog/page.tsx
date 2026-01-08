import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on web development, software engineering, and building products.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <header className="mb-12">
        <h1 className="font-heading text-4xl font-semibold mb-4">Blog</h1>
        <p className="text-lg text-foreground-muted max-w-2xl">
          Writing about web development, lessons learned, and things I find interesting.
        </p>
      </header>

      <div className="grid gap-8">
        {posts.map((post) => (
          <article key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="block group">
              <div className="flex items-center gap-3 text-sm text-foreground-muted mb-2">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span>&middot;</span>
                <span>{post.readingTime}</span>
              </div>
              <h2 className="font-heading text-xl font-semibold mb-2 group-hover:text-gold transition-colors">
                {post.title}
              </h2>
              <p className="text-foreground-muted">{post.excerpt}</p>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
