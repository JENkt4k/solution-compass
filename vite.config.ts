import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const REPO_NAME = 'solution-compass';

const isDev = false;

const base = isDev ? '/' : `/${REPO_NAME}/`;

export default defineConfig({
  base, // Change this to match your repo name solution-compass/
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Solution Compass',
        short_name: 'SCompass',
        description: 'Navigate problem-solving patterns and solutions',
        start_url: base,
        scope: base,
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0f172a',
        orientation: 'portrait',
        icons: [
          {
            src: './icons/pwa-icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: './icons/pwa-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          }
        ]
      }
    })
  ]
})