import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import compress from 'astro-compress';
import icon from "astro-icon";

import react from "@astrojs/react";

import yaml from '@rollup/plugin-yaml';

// https://astro.build/config
export default defineConfig({
  site: 'https://saulo.engineer',
  compressHTML: true,
  integrations: [mdx(), icon(), tailwind({
    applyBaseStyles: false
  }), compress(), react(), yaml()]
});