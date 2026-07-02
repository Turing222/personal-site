import type { CollectionEntry } from 'astro:content';

export type SiteLang = 'zh' | 'en';
export type ContentEntry = CollectionEntry<'posts'> | CollectionEntry<'projects'>;

const langSet = new Set(['zh', 'en']);

export function isPublished(entry: ContentEntry) {
  return !entry.data.draft || !import.meta.env.PROD;
}

export function getEntryLang(entry: ContentEntry): SiteLang {
  const frontmatterLang = 'lang' in entry.data ? entry.data.lang : undefined;
  if (frontmatterLang === 'en' || frontmatterLang === 'zh') {
    return frontmatterLang;
  }

  const firstSegment = entry.id.split('/')[0];
  return firstSegment === 'en' ? 'en' : 'zh';
}

export function stripLangFromId(id: string) {
  const segments = id.split('/');
  if (langSet.has(segments[0])) {
    return segments.slice(1).join('/');
  }
  return id;
}

export function entryUrl(collection: 'posts' | 'projects', entry: ContentEntry) {
  const lang = getEntryLang(entry);
  const slug = stripLangFromId(entry.id);
  const prefix = lang === 'en' ? `/en/${collection}` : `/${collection}`;
  return `${prefix}/${slug}/`;
}

export function getTranslationUrl(
  collection: 'posts' | 'projects',
  entry: ContentEntry,
  allEntries: ContentEntry[],
): string | undefined {
  const lang = getEntryLang(entry);
  const key = entry.data.translationKey;
  const slug = stripLangFromId(entry.id);
  const counterpart = allEntries.find((candidate) => {
    if (getEntryLang(candidate) === lang || !isPublished(candidate)) {
      return false;
    }
    if (key && candidate.data.translationKey === key) {
      return true;
    }
    return stripLangFromId(candidate.id) === slug;
  });
  return counterpart ? entryUrl(collection, counterpart) : undefined;
}

export function tagToSlug(tag: string) {
  return tag.trim().toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-');
}

export function matchesTagSlug(tag: string, slug: string) {
  return tagToSlug(tag) === slug;
}
