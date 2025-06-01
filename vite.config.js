// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import {VitePWA} from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Automatically update the service worker when new content is available
      devOptions: {
        enabled: true, // Enable PWA features during development
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'images/hero.jpg'], // Assets to cache
      manifest: {
        name: 'LUX SUV',
        short_name: 'LUX SUV',
        description: 'Luxury SUV transportation for business, leisure, and special occasions.',
        theme_color: '#f59e0b', // Matches your yellow theme (bg-yellow)
        background_color: '#1f2937', // Matches your dark theme (bg-dark)
        display: 'standalone', // Makes the app look like a native app when installed
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable', // For adaptive icons on Android
          },
        ],
      },
    }),
  ],
  server: {
    mimeTypes: {
      'application/javascript': ['js'],
    },
  },
});