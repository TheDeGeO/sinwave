// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import gruvboxMaterial from './src/assets/gruvbox-material-shiki.json';

// https://astro.build/config
export default defineConfig({
  site: 'https://thedegeo.github.io/sinwave',
  base: '/sinwave/',
  integrations: [mdx({
    syntaxHighlight: 'shiki',
    shikiConfig: {theme: gruvboxMaterial},
  })],
});
