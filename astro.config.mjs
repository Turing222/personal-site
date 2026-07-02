import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://lab.9710221.xyz',
  integrations: [mdx(), sitemap()],
});
