import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts, formatDate } from "@/lib/posts";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      {/* Back link */}
      <Link
        href="/blog"
        className="inline-flex items-center text-sm text-foreground-muted hover:text-gold transition-colors mb-8"
      >
        &larr; Back to blog
      </Link>

      {/* Header */}
      <header className="mb-12">
        <div className="flex items-center gap-3 text-sm text-foreground-muted mb-4">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>&middot;</span>
          <span>{post.readingTime}</span>
        </div>

        <h1 className="font-heading text-4xl font-semibold mb-4">
          {post.title}
        </h1>

        {post.tags && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-sm px-3 py-1 bg-background-secondary rounded text-foreground-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <article className="prose prose-lg max-w-none">
        <div className="text-foreground leading-relaxed whitespace-pre-line">
          {post.content}
        </div>
      </article>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-border">
        <p className="text-foreground-muted text-sm">
          Thanks for reading! If you found this helpful, consider sharing it.
        </p>
      </footer>
    </div>
  );
}
