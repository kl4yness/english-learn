// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';

// https://astro.build/config
const MINIO_URL = process.env.MINIO || 'https://cloud.w1do.ru/english';

export default defineConfig({
  server: {
    host: "0.0.0.0"
  },

  output: 'server',
  integrations: [react()],

  adapter: node({
    mode: 'standalone',
  }),
  security: {
    allowedDomains: [
      { hostname: 'ваш-домен.ru', protocol: 'https' },
    ],
  },

  vite: {
    server: {
      watch: {
        usePolling: process.env.POLLING !== 'false',
        interval: 1000,
        ignored: [
          '**/dist/**',
          '**/node_modules/**',
          '**/.git/**',
          '**/.astro/**',
          '**/.idea/**',
          '**/.vscode/**',
          '**/docs/**',
          '**/source/**',
        ],
      },
      proxy: {
        '/uploads': {
          target: MINIO_URL,
          changeOrigin: true,
        }
      }
    }
  }
});
