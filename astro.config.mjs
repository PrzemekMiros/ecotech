import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { isExcludedFromIndexing } from './src/lib/indexing.mjs';

export default defineConfig({
  site: 'https://ecotechgroup.pl',
  output: 'server',
  // Negotiate Markdown at request time for prerendered pages as well as SSR pages.
  adapter: netlify({ edgeMiddleware: true }),
  image: {
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }]
  },
  integrations: [sitemap({
    filter: (page) => !isExcludedFromIndexing(new URL(page).pathname)
  })],
  vite: {
    plugins: [tailwindcss()]
  }
});
