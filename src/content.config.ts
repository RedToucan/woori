import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const documentSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  category: z.string().optional(),
  // Groups documents that form a connected, ordered series (e.g. a multi-part
  // art-history collection) so they can be listed together instead of being
  // interleaved with unrelated standalone articles that merely share a
  // category. Documents without a series are standalone.
  series: z.string().optional(),
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
const culture = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/culture' }),
  schema: documentSchema
});
const health = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/health' }),
  schema: documentSchema
});

export const collections = { trainingFull, culture, health };
