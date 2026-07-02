import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { entryUrl, getEntryLang, isPublished } from '../../utils/content';

export async function GET(context) {
  const posts = await getCollection('posts');
  const projects = await getCollection('projects');
  const items = [
    ...posts
      .filter((entry) => isPublished(entry) && getEntryLang(entry) === 'en')
      .map((entry) => ({ entry, collection: 'posts' })),
    ...projects
      .filter((entry) => isPublished(entry) && getEntryLang(entry) === 'en')
      .map((entry) => ({ entry, collection: 'projects' })),
  ].sort((a, b) => b.entry.data.date.valueOf() - a.entry.data.date.valueOf());

  return rss({
    title: 'Dewflow Lab',
    description: 'Personal project lab and technical review archive.',
    site: new URL('/en/', context.site),
    items: items.map(({ entry, collection }) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.date,
      link: entryUrl(collection, entry),
      categories: entry.data.tags,
    })),
    customData: '<language>en-US</language>',
  });
}
