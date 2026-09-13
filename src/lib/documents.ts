import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export const COLLECTIONS = [
  { key: 'trainingFull', icon: 'training', folder: 'training-full', route: '/training', label: 'TRAINING DRILLBOOK', name: '훈련 드릴북' },
  { key: 'culture', icon: 'culture', folder: 'culture', route: '/culture', label: 'CULTURE', name: '반려동물 문화 이야기' },
  { key: 'health', icon: 'health', folder: 'health', route: '/health', label: 'HEALTH', name: '반려동물 건강 이야기' }
] as const;

export type CollectionMeta = (typeof COLLECTIONS)[number];
export type CollectionKey = CollectionMeta['key'];

export function metaForFolder(folder: string): CollectionMeta | undefined {
  return COLLECTIONS.find((c) => c.folder === folder);
}

export interface DocumentRef {
  entry: CollectionEntry<CollectionKey>;
  collection: CollectionMeta;
  href: string;
}

export function hrefForEntry(entry: CollectionEntry<CollectionKey>): string {
  // URLs are keyed on the `slug` frontmatter field alone, so moving a document
  // between content folders never changes its URL. Falls back to the file id
  // for any document that hasn't been given a slug yet.
  return `/docs/${entry.data.slug ?? entry.id}`;
}

export async function getAllDocuments(): Promise<DocumentRef[]> {
  const lists = await Promise.all(COLLECTIONS.map((c) => getCollection(c.key)));
  return COLLECTIONS.flatMap((collection, i) =>
    lists[i].map((entry) => ({
      entry: entry as CollectionEntry<CollectionKey>,
      collection,
      href: hrefForEntry(entry as CollectionEntry<CollectionKey>)
    }))
  );
}

export function groupByCategory(documents: DocumentRef[]): Map<string, DocumentRef[]> {
  const groups = new Map<string, DocumentRef[]>();
  for (const doc of documents) {
    const category = doc.entry.data.category?.trim() || '미분류';
    if (!groups.has(category)) groups.set(category, []);
    groups.get(category)!.push(doc);
  }
  for (const docs of groups.values()) {
    docs.sort((a, b) => (a.entry.data.order ?? 0) - (b.entry.data.order ?? 0));
  }
  return groups;
}
