# Rewards Wallet

Offline-first loyalty card manager built as a pure PWA. Store, organize, and scan loyalty card barcodes directly from your phone or desktop browser. All data persists locally via IndexedDB with zero server calls.

## Tech Stack

- **Framework**: Vite + React + TypeScript (strict mode, no `any`)
- **UI Library**: Mantine 7 (Core, Hooks, Spotlight)
- **Storage**: IndexedDB via `idb` wrapper
- **Barcode**: JsBarcode (EAN-13, Code 128 SVG rendering)
- **Icons**: @tabler/icons-react
- **PWA**: Service Worker (cache-first), Web App Manifest
- **Design System**: Monolithic Clarity dark theme
- **Testing**: Vitest
- **Linting**: ESLint + typescript-eslint

## Getting Started

Prerequisites: Node.js v18+

```bash
git clone <repo-url>
cd rewards-wallet
npm install
npm run dev
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint on src/ |
| `npm run test` | Run Vitest test suite |

## Project Structure

```
rewards-wallet/
  public/
    manifest.webmanifest   # PWA manifest (standalone, theme_color #131313)
    sw.js                  # Service Worker (cache-first offline strategy)
    icons/                 # App icons (192x192, 512x512)
  src/
    types/                 # LoyaltyCard, CardFormData, RouteState interfaces
    db/                    # IndexedDB CRUD operations (idb wrapper)
    theme/                 # Mantine theme override + exported design tokens
    components/            # CardPreview, BarcodeDisplay, CategoryChip, AddCardForm, FullScreenBarcode
    screens/               # Dashboard, CardDetails, Search, Settings
    router.ts              # Hash-based client-side router
    App.tsx                # AppShell with responsive nav (bottom tabs / sidebar)
    main.tsx               # Entry point with MantineProvider + SW registration
    global.css             # Reduced-motion + base resets
  index.html
  vite.config.ts           # base: '/rewards-wallet/' for GitHub Pages
  tsconfig.json            # strict: true
  eslint.config.js         # ESLint flat config
  .npmrc                   # save-exact=true
```

## Lighthouse Testing

[Lighthouse](https://developer.chrome.com/docs/lighthouse/) is an open-source automated tool by Google that audits web pages for performance, accessibility, best practices, and SEO. It runs in Chrome DevTools (Audits tab) or via the command line.

Run Lighthouse against the **production build**, not the dev server. The dev server serves unminified, unbundled modules (~12MB) which produces misleading performance scores.

```bash
npm run build
npm run preview
# Then run Lighthouse against http://localhost:4173/rewards-wallet/
```

The production build is ~155 KB gzipped initial load with code-split screen chunks loaded on demand.

## Deployment (GitHub Pages)

```bash
npm run build
npx gh-pages -d dist
```

Then in GitHub repo Settings > Pages, set source to the `gh-pages` branch.

## Design Tokens

All color, spacing, and radius values are exported from `src/theme/index.ts` as the `tokens` object. Components must import from there rather than hardcoding hex values.

## Data Schema

```typescript
interface LoyaltyCard {
  id: string;
  name: string;           // Store/program name
  category: 'retail' | 'grocery' | 'fuel' | 'pharmacy' | 'other';
  barcode: string;        // EAN-13 or Code 128 number
  barcodeFormat: 'EAN13' | 'CODE128';
  points: number;
  color: string;          // Card accent color
  isFavorite: boolean;
  createdAt: number;
  updatedAt: number;
}
```

## License

MIT
