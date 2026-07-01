import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = parseArgs(process.argv.slice(2));
const type = args.type;
const lang = args.lang ?? 'zh';
const title = args.title;
const date = today();
const draft = args.draft === undefined ? true : parseBoolean(args.draft);

if (type !== 'post' && type !== 'project') {
  fail('Missing or invalid --type. Use "post" or "project".');
}

if (lang !== 'zh' && lang !== 'en') {
  fail('Invalid --lang. Use "zh" or "en".');
}

if (!title) {
  fail('Missing --title.');
}

const slug = cleanSlug(args.slug ?? slugFromTitle(title, type, date));
const collectionDir = type === 'post' ? 'posts' : 'projects';
const targetPath = path.resolve(projectRoot, 'src', 'content', collectionDir, lang, `${slug}.mdx`);
const expectedBase = path.resolve(projectRoot, 'src', 'content', collectionDir, lang);

if (!targetPath.startsWith(expectedBase + path.sep)) {
  fail('Invalid --slug. It must stay inside the target content directory.');
}

if (fs.existsSync(targetPath)) {
  fail(`Target already exists: ${targetPath}`);
}

fs.mkdirSync(path.dirname(targetPath), { recursive: true });
fs.writeFileSync(targetPath, template({ type, title, slug, lang, date, draft }), 'utf8');

console.log(`Created ${targetPath}`);

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith('--')) {
      continue;
    }

    const [rawKey, rawValue] = arg.slice(2).split('=', 2);
    if (!rawKey) {
      continue;
    }

    if (rawValue !== undefined) {
      parsed[rawKey] = rawValue;
      continue;
    }

    const next = argv[index + 1];
    if (next && !next.startsWith('--')) {
      parsed[rawKey] = next;
      index += 1;
    } else {
      parsed[rawKey] = 'true';
    }
  }
  return parsed;
}

function parseBoolean(value) {
  return !['false', '0', 'no', 'off'].includes(String(value).toLowerCase());
}

function today() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
}

function slugFromTitle(value, entryType, entryDate) {
  const asciiSlug = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

  return asciiSlug || `${entryDate}-new-${entryType}`;
}

function cleanSlug(value) {
  const slug = String(value)
    .trim()
    .replace(/\\/g, '/')
    .replace(/\.mdx?$/i, '')
    .replace(/^\/+|\/+$/g, '')
    .toLowerCase();

  if (!slug || slug.includes('..') || slug.split('/').some((part) => part.length === 0)) {
    fail('Invalid --slug.');
  }

  if (!/^[a-z0-9][a-z0-9/-]*[a-z0-9]$|^[a-z0-9]$/.test(slug)) {
    fail('Slug may contain only lowercase letters, numbers, hyphens, and forward slashes.');
  }

  return slug;
}

function yamlString(value) {
  return JSON.stringify(value);
}

function template({ type: entryType, title: entryTitle, slug: entrySlug, lang: entryLang, date: entryDate, draft: isDraft }) {
  const translationKey = entrySlug.split('/').at(-1);
  const common = [
    '---',
    `title: ${yamlString(entryTitle)}`,
    'description: "TODO: add a one-sentence summary."',
    `date: ${entryDate}`,
    `updatedDate: ${entryDate}`,
    'tags: []',
    'featured: false',
    `draft: ${isDraft ? 'true' : 'false'}`,
    `lang: ${entryLang}`,
    `translationKey: ${translationKey}`,
    '# series: Series name',
    '# sourceNote: source-notes/obsidian/example.md',
    '# cover: /images/example.png',
    '# coverAlt: Cover image description',
    'changelog:',
    `  - date: ${entryDate}`,
    '    note: "Created draft"',
  ];

  if (entryType === 'project') {
    common.splice(
      9,
      0,
      'status: idea',
      'stack: []',
      'links: []',
    );
  }

  const body = entryType === 'project'
    ? [
        '',
        `# ${entryTitle}`,
        '',
        '## Background',
        '',
        'TODO',
        '',
        '## Goal',
        '',
        'TODO',
        '',
        '## Implementation',
        '',
        'TODO',
        '',
        '## Review',
        '',
        'TODO',
      ]
    : [
        '',
        `# ${entryTitle}`,
        '',
        '## Notes',
        '',
        'TODO',
      ];

  return `${[...common, '---', ...body].join('\n')}\n`;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
