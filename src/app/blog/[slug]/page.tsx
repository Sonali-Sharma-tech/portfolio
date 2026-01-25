import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogSource, type BlogPage } from "@/lib/source";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogSource.getPage([slug]) as BlogPage | undefined;

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: `${post.data.title} | SONALI.SH`,
    description: post.data.excerpt,
  };
}

export async function generateStaticParams() {
  const posts = blogSource.getPages();
  return posts.map((post) => ({
    slug: post.slugs[0],
  }));
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogSource.getPage([slug]) as BlogPage | undefined;

  if (!post) {
    notFound();
  }

  const allPosts = (blogSource.getPages() as BlogPage[]).sort((a, b) => {
    const dateA = new Date(a.data.date).getTime();
    const dateB = new Date(b.data.date).getTime();
    return dateB - dateA;
  });

  const currentIndex = allPosts.findIndex((p) => p.slugs[0] === slug);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  const MDXContent = post.data.body;

  return (
    <article className="py-8 md:py-12">
      <div className="container max-w-3xl">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-text-muted hover:text-cyan transition-colors text-sm font-mono mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>

        {/* Article Header */}
        <header className="mb-8 pb-6 border-b border-border/30">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-3 text-xs font-mono text-text-muted">
            <time dateTime={post.data.date}>{formatDate(post.data.date)}</time>
            <span className="w-1 h-1 bg-magenta rounded-full" />
            <span>{post.data.readingTime}</span>
          </div>

          {/* Title */}
          <h1 className="text-[20px] font-display leading-tight mb-4 text-text-primary">
            {post.data.title}
          </h1>

          {/* Tags */}
          {post.data.tags && (
            <div className="flex flex-wrap gap-2">
              {post.data.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs font-mono text-magenta border border-magenta/30 bg-magenta/5"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Article Content */}
        <div className="prose prose-invert prose-cyan max-w-none prose-headings:font-display prose-headings:text-cyan prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-14 prose-h2:mb-5 prose-h3:text-xl prose-h3:text-text-primary prose-h3:mt-10 prose-h3:mb-4 prose-p:text-text-secondary prose-p:text-lg prose-p:leading-relaxed prose-a:text-cyan prose-a:no-underline hover:prose-a:underline prose-strong:text-text-primary prose-code:text-cyan prose-code:bg-cyan/10 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-space-deep prose-pre:border prose-pre:border-cyan/20 [&_pre_code]:text-white [&_pre_code]:bg-transparent prose-li:text-text-secondary prose-ul:my-6 prose-ol:my-6">
          <MDXContent />
        </div>

        {/* Article Footer */}
        <footer className="mt-16 pt-10 border-t border-border/30">
          {/* Share */}
          <div className="flex items-center justify-between mb-12">
            <span className="text-sm text-text-muted font-mono">Share this article</span>
            <div className="flex items-center gap-4">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.data.title)}&url=${encodeURIComponent(`https://sonali.sh/blog/${slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-border flex items-center justify-center hover:border-cyan hover:text-cyan transition-colors"
                aria-label="Share on X"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://sonali.sh/blog/${slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-border flex items-center justify-center hover:border-cyan hover:text-cyan transition-colors"
                aria-label="Share on LinkedIn"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="grid md:grid-cols-2 gap-6">
            {prevPost ? (
              <Link
                href={prevPost.url}
                className="group p-6 border border-border/30 hover:border-cyan/50 transition-colors"
              >
                <span className="text-xs font-mono text-text-muted mb-2 block">Previous Article</span>
                <span className="text-lg font-display text-text-primary group-hover:text-cyan transition-colors line-clamp-2">
                  {prevPost.data.title}
                </span>
              </Link>
            ) : (
              <div />
            )}

            {nextPost ? (
              <Link
                href={nextPost.url}
                className="group p-6 border border-border/30 hover:border-cyan/50 transition-colors md:text-right"
              >
                <span className="text-xs font-mono text-text-muted mb-2 block">Next Article</span>
                <span className="text-lg font-display text-text-primary group-hover:text-cyan transition-colors line-clamp-2">
                  {nextPost.data.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </footer>
      </div>
    </article>
  );
}
