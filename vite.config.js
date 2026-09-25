import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // GitHub Pages serves project sites below /<repository-name>/.
  // Keep this as /asha-setu/ unless you rename the GitHub repository.
  base: '/Asha-setu-2.0/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Setu — Referral Continuity',
        short_name: 'Setu',
        description: 'Offline-first patient visit and referral tracking for frontline health workers',
        theme_color: '#0F3D3E',
        background_color: '#FAF9F6',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}']
      }
    })
  ]
});
