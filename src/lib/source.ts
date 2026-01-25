import { blog } from "@/../.source/server";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";
import { loader } from "fumadocs-core/source";
import type { InferPageType } from "fumadocs-core/source";

export const blogSource = loader({
  source: toFumadocsSource(blog, []),
  baseUrl: "/blog",
});

// Custom blog frontmatter type
export interface BlogFrontmatter {
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  tags?: string[];
  body: React.ComponentType;
}

export type BlogPage = InferPageType<typeof blogSource> & {
  data: BlogFrontmatter;
};
