import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog | SONALI.SH",
  description: "Articles on web development, React, TypeScript, and software engineering best practices.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const timestamp = new Date().toISOString().slice(0, 10);

  return (
    <section className="py-12 md:py-16">
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
              sonali@dev:~/blog
            </span>
            <span className="text-[10px] font-mono text-text-muted">{timestamp}</span>
          </div>

          {/* Terminal Body */}
          <div className="p-4 md:p-6 font-mono text-sm">
            {/* Command Input */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-green">❯</span>
              <span className="text-cyan">ls</span>
              <span className="text-text-muted">-la ./posts</span>
              <span className="w-2 h-4 bg-cyan/80 animate-pulse ml-1" />
            </div>

            {/* Output Header */}
            <div className="text-[11px] text-text-muted mb-4 pb-2 border-b border-border/30">
              <span className="text-cyan">{posts.length}</span> articles found • sorted by date desc
            </div>

            {/* Posts List */}
            <div className="space-y-1">
              {posts.map((post, index) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block py-3 border-b border-border/20 last:border-0 hover:bg-cyan/5 -mx-4 px-4 transition-colors"
                >
                  {/* File Entry Row */}
                  <div className="flex items-start gap-3">
                    {/* File Icon & Permissions */}
                    <div className="flex-shrink-0 text-[11px] text-text-muted hidden sm:block">
                      <span className="text-magenta">-rw-r--r--</span>
                    </div>

                    {/* Date */}
                    <time
                      dateTime={post.date}
                      className="flex-shrink-0 text-[11px] text-text-muted w-20"
                    >
                      {formatDate(post.date).replace(/, \d{4}$/, "")}
                    </time>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      {/* Title as filename */}
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-cyan group-hover:text-cyan group-hover:underline underline-offset-2 text-[13px]">
                          {post.slug}.md
                        </span>
                        {index === 0 && (
                          <span className="px-1.5 py-0.5 text-[9px] bg-green/20 text-green border border-green/30 rounded">
                            NEW
                          </span>
                        )}
                      </div>

                      {/* Title & Excerpt */}
                      <p className="text-text-primary text-[13px] leading-relaxed mb-1 group-hover:text-cyan transition-colors">
                        {post.title}
                      </p>
                      <p className="text-text-muted text-[11px] leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>

                      {/* Tags as inline comments */}
                      {post.tags && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] text-magenta/80"
                            >
                              #{tag}
                            </span>
                          ))}
                          <span className="text-[10px] text-text-muted ml-auto">
                            {post.readingTime}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Footer Command */}
            <div className="mt-6 pt-4 border-t border-border/30">
              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-green">❯</span>
                <span className="text-text-muted">_</span>
                <span className="w-2 h-3.5 bg-cyan/60 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Subscribe - Minimal */}
        <div className="mt-6 text-center">
          <p className="text-[11px] text-text-muted font-mono mb-2">
            /* want updates? */
          </p>
          <Link
            href="mailto:sonali.sharma110114@gmail.com?subject=Subscribe%20to%20Blog"
            className="text-[11px] font-mono text-cyan hover:underline underline-offset-2"
          >
            subscribe@sonali.sh →
          </Link>
        </div>
      </div>
    </section>
  );
}
