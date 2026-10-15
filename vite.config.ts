import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

const basePath = process.env.GITHUB_PAGES === 'true' ? '/solo-leveling-system/' : '/';

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['system-icon.svg', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'THE SYSTEM // Solo Leveling Fitness HUD',
        short_name: 'THE SYSTEM',
        description: 'Solo Leveling Hunter System Fitness & V-Taper Protocol for Galaxy Z Fold 5',
        theme_color: '#02050b',
        background_color: '#02050b',
        display: 'standalone',
        orientation: 'any',
        start_url: basePath,
        scope: basePath,
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'system-icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any'
          }
        ]
      }
    })
  ]
});
