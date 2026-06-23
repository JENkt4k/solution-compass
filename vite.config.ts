import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const REPO_NAME = 'solution-compass';

export default defineConfig(({ command }) => {
  const base = command === 'serve' ? '/' : `/${REPO_NAME}/`;

  return {
    base,
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['pwa-icon-192.png', 'pwa-icon-512.png'],
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
              src: 'icons/pwa-icon-192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: 'icons/pwa-icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        },
      }),
    ],
  };
});
