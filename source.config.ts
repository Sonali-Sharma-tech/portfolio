import { defineDocs, defineCollections, frontmatterSchema } from "fumadocs-mdx/config";
import { z } from "zod";

export const blog = defineCollections({
  type: "doc",
  dir: "content/blog",
  schema: frontmatterSchema.extend({
    excerpt: z.string(),
    date: z.string(),
    readingTime: z.string(),
    tags: z.array(z.string()).optional(),
  }),
});
