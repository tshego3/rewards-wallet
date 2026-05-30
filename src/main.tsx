import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import './global.css';
import { theme } from './theme';
import { App } from './App';
import { createRoot } from 'react-dom/client';

const root = document.getElementById('app');
if (!root) throw new Error('Root element not found');

createRoot(root).render(
  <MantineProvider theme={theme} defaultColorScheme="dark">
    <App />
  </MantineProvider>,
);

// Register service worker for offline-first caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(
      new URL('/rewards-wallet/sw.js', window.location.origin).href
    ).catch(() => {
      // SW registration failed - app still works without it
    });
  });
}
