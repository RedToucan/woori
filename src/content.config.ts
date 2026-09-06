import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const documentSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  category: z.string().optional(),
  order: z.number().optional(),
  slug: z.string().optional(),
  status: z.string().optional(),
  source: z.string().optional(),
  sourceDocument: z.string().optional()
}).passthrough();

const trainingFull = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/training-full' }),
  schema: documentSchema
});
const encyclopediaFull = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/encyclopedia-full' }),
  schema: documentSchema
});

export const collections = { trainingFull, encyclopediaFull };
