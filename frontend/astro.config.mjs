// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'

import partytown from '@astrojs/partytown'

// https://astro.build/config
export default defineConfig({
  integrations: [react(), sitemap(), partytown()],
  site: 'https://quickify.tools',
  vite: {
    plugins: [tailwindcss()],
  },
})
