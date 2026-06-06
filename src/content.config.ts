import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const linkSchema = z.object({
  label: z.string(),
  url: z.string().url(),
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    cover: z.string().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    status: z.enum(['idea', 'building', 'shipped', 'archived']).default('building'),
    stack: z.array(z.string()).default([]),
    lang: z.enum(['zh', 'en']).default('zh'),
    translationKey: z.string().optional(),
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
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    lang: z.enum(['zh', 'en']).default('zh'),
    translationKey: z.string().optional(),
  }),
});

export const collections = { projects, posts };
