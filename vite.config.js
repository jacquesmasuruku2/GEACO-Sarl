import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'react-vendor',
              test: /node_modules[\\/](?:react|react-dom|scheduler|react-router|react-router-dom|react-helmet-async)(?:[\\/]|$)/,
              priority: 30,
            },
            {
              name: 'xlsx-vendor',
              test: /node_modules[\\/]xlsx[\\/]/,
              priority: 25,
            },
            {
              name: 'supabase-vendor',
              test: /node_modules[\\/]@supabase[\\/]/,
              priority: 20,
            },
            {
              name: 'export-vendor',
              test: /node_modules[\\/](?:html-to-image|jszip|qrcode\.react)(?:[\\/]|$)/,
              priority: 15,
            },
            {
              name: 'vendor',
              test: /node_modules[\\/]/,
              maxSize: 400 * 1024,
              priority: 10,
            },
          ],
        },
      },
    },
  },
})
