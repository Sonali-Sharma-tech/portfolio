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
    <section className="py-8 md:py-12">
      <div className="container max-w-2xl">
        {/* Terminal Window */}
        <div className="border border-cyan/30 bg-space-void/80 backdrop-blur-sm">
          {/* Terminal Header */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-cyan/20 bg-space-deep/50">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            </div>
            <span className="flex-1 text-center text-[10px] font-mono text-text-muted tracking-wider">
              vim ~/blog/{post.slug}.md
            </span>
            <span className="text-[10px] font-mono text-text-muted">
              {post.readingTime}
            </span>
          </div>

          {/* Terminal Body */}
          <div className="p-4 md:p-6 font-mono">
            {/* Back Link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-[11px] text-text-muted hover:text-cyan transition-colors mb-6"
            >
              <span className="text-green">❯</span>
              <span>cd ..</span>
              <span className="text-text-muted/60">// back to blog</span>
            </Link>

            {/* Article Header */}
            <header className="mb-6 pb-4 border-b border-border/30">
              {/* Meta Line */}
              <div className="flex flex-wrap items-center gap-2 text-[10px] text-text-muted mb-3">
                <span className="text-magenta">---</span>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span className="text-border">|</span>
                <span>{post.readingTime}</span>
                <span className="text-magenta">---</span>
              </div>

              {/* Title */}
              <h1 className="text-lg md:text-xl text-cyan leading-snug mb-3">
                # {post.title}
              </h1>

              {/* Tags */}
              {post.tags && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] text-magenta/80"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Article Content */}
            <article className="text-[13px] leading-relaxed text-text-secondary">
              {post.content.split("\n\n").map((paragraph, index) => {
                // Handle h2 headings
                if (paragraph.startsWith("## ")) {
                  return (
                    <h2 key={index} className="text-[15px] text-cyan mt-8 mb-3">
                      ## {paragraph.replace("## ", "")}
                    </h2>
                  );
                }

                // Handle h3 headings
                if (paragraph.startsWith("### ")) {
                  return (
                    <h3 key={index} className="text-[14px] text-text-primary mt-6 mb-2">
                      ### {paragraph.replace("### ", "")}
                    </h3>
                  );
                }

                // Handle code blocks
                if (paragraph.startsWith("```")) {
                  const lines = paragraph.split("\n");
                  const language = lines[0].replace("```", "");
                  const code = lines.slice(1, -1).join("\n");
                  return (
                    <div key={index} className="my-4">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-space-deep border border-cyan/20 border-b-0 text-[10px]">
                        <span className="text-cyan">{language || "code"}</span>
                        <span className="text-text-muted ml-auto">// snippet</span>
                      </div>
                      <pre className="bg-space-deep border border-cyan/20 p-3 overflow-x-auto">
                        <code className="text-[12px] text-green leading-relaxed">{code}</code>
                      </pre>
                    </div>
                  );
                }

                // Handle numbered lists
                if (/^\d+\./.test(paragraph)) {
                  const items = paragraph.split("\n").filter(Boolean);
                  return (
                    <ol key={index} className="my-4 space-y-1.5">
                      {items.map((item, i) => (
                        <li key={i} className="flex gap-2 text-text-secondary">
                          <span className="text-cyan text-[11px] min-w-[1.25rem]">{i + 1}.</span>
                          <span className="text-[13px]">{item.replace(/^\d+\.\s*/, "")}</span>
                        </li>
                      ))}
                    </ol>
                  );
                }

                // Handle bullet lists
                if (paragraph.startsWith("- ") || paragraph.startsWith("* ")) {
                  const items = paragraph.split("\n").filter(Boolean);
                  return (
                    <ul key={index} className="my-4 space-y-1.5">
                      {items.map((item, i) => (
                        <li key={i} className="flex gap-2 text-text-secondary">
                          <span className="text-magenta text-[11px]">→</span>
                          <span className="text-[13px]">{item.replace(/^[-*]\s*/, "")}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }

                // Handle inline code and bold
                if (paragraph.includes("`") || paragraph.includes("**")) {
                  const processText = (text: string) => {
                    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
                    return parts.map((part, i) => {
                      if (part.startsWith("`") && part.endsWith("`")) {
                        return (
                          <code key={i} className="px-1 py-0.5 bg-cyan/10 text-cyan text-[12px] rounded">
                            {part.slice(1, -1)}
                          </code>
                        );
                      }
                      if (part.startsWith("**") && part.endsWith("**")) {
                        return (
                          <strong key={i} className="text-text-primary font-medium">
                            {part.slice(2, -2)}
                          </strong>
                        );
                      }
                      return part;
                    });
                  };

                  return (
                    <p key={index} className="my-3 text-[13px] leading-relaxed">
                      {processText(paragraph)}
                    </p>
                  );
                }

                // Regular paragraphs
                if (paragraph.trim()) {
                  return (
                    <p key={index} className="my-3 text-[13px] leading-relaxed">
                      {paragraph}
                    </p>
                  );
                }

                return null;
              })}
            </article>

            {/* Footer */}
            <footer className="mt-8 pt-4 border-t border-border/30">
              {/* Share Row */}
              <div className="flex items-center gap-3 mb-6 text-[11px]">
                <span className="text-text-muted">// share:</span>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://sonali.sh/blog/${post.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-muted hover:text-cyan transition-colors"
                >
                  [twitter]
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://sonali.sh/blog/${post.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-muted hover:text-cyan transition-colors"
                >
                  [linkedin]
                </a>
              </div>

              {/* Navigation */}
              <div className="grid grid-cols-2 gap-3 text-[11px]">
                {prevPost ? (
                  <Link
                    href={`/blog/${prevPost.slug}`}
                    className="group p-3 border border-border/30 hover:border-cyan/50 transition-colors"
                  >
                    <span className="text-text-muted block mb-1">← prev</span>
                    <span className="text-text-primary group-hover:text-cyan transition-colors line-clamp-1">
                      {prevPost.slug}.md
                    </span>
                  </Link>
                ) : (
                  <div />
                )}

                {nextPost ? (
                  <Link
                    href={`/blog/${nextPost.slug}`}
                    className="group p-3 border border-border/30 hover:border-cyan/50 transition-colors text-right"
                  >
                    <span className="text-text-muted block mb-1">next →</span>
                    <span className="text-text-primary group-hover:text-cyan transition-colors line-clamp-1">
                      {nextPost.slug}.md
                    </span>
                  </Link>
                ) : (
                  <div />
                )}
              </div>

              {/* Command line */}
              <div className="mt-6 pt-4 border-t border-border/30">
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-green">❯</span>
                  <span className="text-text-muted">:wq</span>
                  <span className="text-text-muted/60">// saved and closed</span>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </section>
  );
}
