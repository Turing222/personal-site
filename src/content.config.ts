import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const linkSchema = z.object({
  label: z.string(),
  url: z.string().url(),
});

const changelogSchema = z.object({
  date: z.coerce.date(),
  note: z.string(),
});

const siteUpdateTypeSchema = z.enum(['feature', 'design', 'content', 'maintenance']);

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    series: z.string().optional(),
    sourceNote: z.string().optional(),
    changelog: z.array(changelogSchema).default([]),
    status: z.enum(['idea', 'building', 'shipped', 'archived']).default('building'),
    stack: z.array(z.string()).default([]),
    lang: z.enum(['zh', 'en']).default('zh'),
    translationKey: z.string(),
    links: z.array(linkSchema).default([]),
  }),
});

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    series: z.string().optional(),
    sourceNote: z.string().optional(),
    changelog: z.array(changelogSchema).default([]),
    lang: z.enum(['zh', 'en']).default('zh'),
    translationKey: z.string(),
  }),
});

const siteUpdates = defineCollection({
  loader: glob({ base: './src/content/site-updates', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    type: siteUpdateTypeSchema.default('feature'),
    lang: z.enum(['zh', 'en']).default('zh'),
    translationKey: z.string().optional(),
  }),
});

export const collections = { projects, posts, siteUpdates };
