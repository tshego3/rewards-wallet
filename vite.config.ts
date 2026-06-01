import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import type { Plugin } from 'vite';

function deferCssPlugin(): Plugin {
  return {
    name: 'defer-css',
    enforce: 'post',
    transformIndexHtml(html) {
      return html.replace(
        /<link rel="stylesheet"([^>]*?)>/g,
        '<link rel="stylesheet"$1 media="print" onload="this.media=\'all\'">'
      );
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    deferCssPlugin(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      outDir: 'dist',
      injectRegister: false,
      manifest: false,
      injectManifest: {
        rollupFormat: 'iife',
      },
    }),
  ],
  base: '/rewards-wallet/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    cssMinify: true,
    rollupOptions: {
      input: {
        main: 'index.html',
      },
      output: {
        manualChunks: {
          'framework': ['react', 'react-dom', '@mantine/core', '@mantine/hooks'],
        },
      },
    },
  },
});
