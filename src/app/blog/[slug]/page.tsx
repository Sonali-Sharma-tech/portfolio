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
    title: `${post.title} | SONALI.SH`,
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
  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  if (!post) {
    notFound();
  }

  return (
    <article className="section">
      <div className="container max-w-3xl">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-text-muted hover:text-cyan transition-colors text-sm font-mono mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to blog
        </Link>

        {/* Article Header */}
        <header className="mb-10">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 text-sm font-mono text-text-muted mb-4">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span className="text-border">•</span>
            <span>{post.readingTime}</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-display leading-tight mb-4 text-text-primary">
            {post.title}
          </h1>

          {/* Tags */}
          {post.tags && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-mono text-magenta"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Article Content */}
        <div className="article-content">
          {post.content.split("\n\n").map((paragraph, index) => {
            // Handle headings
            if (paragraph.startsWith("## ")) {
              return (
                <h2 key={index} className="text-xl md:text-2xl font-display text-cyan mt-10 mb-4">
                  {paragraph.replace("## ", "")}
                </h2>
              );
            }

            // Handle subheadings
            if (paragraph.startsWith("### ")) {
              return (
                <h3 key={index} className="text-lg font-display text-text-primary mt-8 mb-3">
                  {paragraph.replace("### ", "")}
                </h3>
              );
            }

            // Handle code blocks
            if (paragraph.startsWith("```")) {
              const lines = paragraph.split("\n");
              const language = lines[0].replace("```", "");
              const code = lines.slice(1, -1).join("\n");
              return (
                <div key={index} className="my-6">
                  <div className="flex items-center justify-between px-4 py-2 bg-space-void border border-cyan/20 border-b-0 rounded-t">
                    <span className="text-xs font-mono text-cyan uppercase">
                      {language || "code"}
                    </span>
                  </div>
                  <pre className="bg-space-void border border-cyan/20 rounded-b p-4 overflow-x-auto">
                    <code className="text-sm text-green font-mono leading-relaxed">{code}</code>
                  </pre>
                </div>
              );
            }

            // Handle numbered lists
            if (/^\d+\./.test(paragraph)) {
              const items = paragraph.split("\n").filter(Boolean);
              return (
                <ol key={index} className="my-4 space-y-2 pl-4">
                  {items.map((item, i) => (
                    <li key={i} className="text-text-secondary leading-relaxed flex gap-2">
                      <span className="text-cyan font-mono text-sm min-w-[1.5rem]">{i + 1}.</span>
                      <span>{item.replace(/^\d+\.\s*/, "")}</span>
                    </li>
                  ))}
                </ol>
              );
            }

            // Handle bullet points
            if (paragraph.startsWith("- ") || paragraph.startsWith("* ")) {
              const items = paragraph.split("\n").filter(Boolean);
              return (
                <ul key={index} className="my-4 space-y-2 pl-4">
                  {items.map((item, i) => (
                    <li key={i} className="text-text-secondary leading-relaxed flex gap-2">
                      <span className="text-magenta">•</span>
                      <span>{item.replace(/^[-*]\s*/, "")}</span>
                    </li>
                  ))}
                </ul>
              );
            }

            // Handle inline code and bold in paragraphs
            if (paragraph.includes("`") || paragraph.includes("**")) {
              const processText = (text: string) => {
                // Split by code and bold patterns
                const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
                return parts.map((part, i) => {
                  if (part.startsWith("`") && part.endsWith("`")) {
                    return (
                      <code key={i} className="px-1.5 py-0.5 bg-cyan/10 text-cyan text-sm font-mono rounded">
                        {part.slice(1, -1)}
                      </code>
                    );
                  }
                  if (part.startsWith("**") && part.endsWith("**")) {
                    return <strong key={i} className="text-text-primary font-semibold">{part.slice(2, -2)}</strong>;
                  }
                  return part;
                });
              };

              return (
                <p key={index} className="my-4 text-text-secondary leading-relaxed">
                  {processText(paragraph)}
                </p>
              );
            }

            // Regular paragraphs
            if (paragraph.trim()) {
              return (
                <p key={index} className="my-4 text-text-secondary leading-relaxed">
                  {paragraph}
                </p>
              );
            }

            return null;
          })}
        </div>

        {/* Article Footer */}
        <footer className="mt-16 pt-8 border-t border-border/30">
          {/* Share */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-sm text-text-muted font-mono">Share:</span>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://sonali.sh/blog/${post.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-cyan transition-colors"
              aria-label="Share on X"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://sonali.sh/blog/${post.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-cyan transition-colors"
              aria-label="Share on LinkedIn"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>

          {/* Post Navigation */}
          <nav className="grid md:grid-cols-2 gap-4">
            {prevPost ? (
              <Link
                href={`/blog/${prevPost.slug}`}
                className="group p-4 border border-border/30 hover:border-cyan/50 transition-colors"
              >
                <span className="text-xs font-mono text-text-muted block mb-1">← Previous</span>
                <span className="text-text-primary group-hover:text-cyan transition-colors line-clamp-1">
                  {prevPost.title}
                </span>
              </Link>
            ) : (
              <div />
            )}

            {nextPost ? (
              <Link
                href={`/blog/${nextPost.slug}`}
                className="group p-4 border border-border/30 hover:border-cyan/50 transition-colors text-right"
              >
                <span className="text-xs font-mono text-text-muted block mb-1">Next →</span>
                <span className="text-text-primary group-hover:text-cyan transition-colors line-clamp-1">
                  {nextPost.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </nav>
        </footer>
      </div>
    </article>
  );
}
