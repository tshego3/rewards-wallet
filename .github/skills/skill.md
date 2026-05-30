
# Agent Skills (TypeScript + Vite + Mantine PWA)

This document defines what an AI coding agent is expected to do well in this repository.

## Architecture Overview

This project is a **client-side-only, offline-first PWA** built with TypeScript, Vite, and Mantine UI. There is no backend, no server-side code, no remote database. All data persists locally via IndexedDB.

```
rewards-wallet/
  public/
    manifest.webmanifest   -- PWA manifest (name, icons, theme_color, display: standalone)
    icons/                 -- App icons (192x192, 512x512 for PWA install)
  src/
    types/                 -- LoyaltyCard, UserPreferences interfaces
    db/                    -- IndexedDB setup and CRUD operations (idb wrapper)
    theme/                 -- Mantine theme override (Monolithic Clarity dark tokens)
    components/            -- CardPreview, BarcodeDisplay, CategoryChip, AddCardForm
    screens/               -- Dashboard, CardDetails, Search, Settings
    sw.ts                  -- Service Worker (Workbox precaching)
    main.ts                -- App entry with MantineProvider and router
```

**Golden rules:**
- No server-side code, no API endpoints, no remote database. IndexedDB is the sole data layer.
- All design tokens originate from `src/theme/` (Monolithic Clarity dark palette).
- No hardcoded colors, font families, or spacing in components -- use Mantine theme tokens or CSS variables.
- All CRUD logic lives in `src/db/` -- no database operations in component or screen files.
- Routing is client-side hash router or lightweight vanilla router.
- Functional TypeScript with module pattern. No class-based patterns.
- Color palette: Charcoal (#131313) background, Graphite (#1C1C1C) surface, Slate Gray (#2D2D2D) elevated, Off-White (#F5F5F5) text, White (#FFFFFF) accent.
- Typography: **Inter** exclusively for all text.
- All visual assets must be real -- strictly no AI-generated images.
- Pure PWA: offline-first, installable, Service Worker caches all static assets.

## Core Delivery Skills

1. Build UI using Mantine's component library with the Monolithic Clarity dark theme.
2. Implement IndexedDB CRUD operations via the `idb` wrapper library in `src/db/`.
3. Maintain centralized theming -- all design tokens flow from `src/theme/` through MantineProvider.
4. Implement responsive, mobile-first layouts using Mantine components and min-width media queries.
5. Render scannable barcodes using JsBarcode (EAN-13 or Code 128) on white background strips.
6. Write type-safe code with `strict: true` TypeScript -- explicit interfaces, strictly no `any`.
7. Maintain PWA functionality -- Service Worker, manifest, offline-first behavior.
8. Perform a mandatory compliance pass before completion: confirm changes align with `.github/copilot-instructions.md` and `docs/design-system.md`.

## Theme and Styling Skills

### Monolithic Clarity Dark Theme

1. All design tokens live in `src/theme/` -- the Mantine theme override consuming the dark palette from `docs/design-system.md`.
2. The theme is consumed by `MantineProvider` at app initialization. All colors, fonts, radii, and spacing derive from the theme config.
3. Components use Mantine theme tokens (`var(--mantine-color-*)`) or component props (`color`, `variant`, `size`) -- never hardcoded values.
4. If a component needs a design token in TypeScript, import from `src/theme/` -- never inline the value.

### Styling Patterns

5. Use Mantine's built-in styling: component props and the `style` prop referencing theme tokens.
6. No `.module.css` files. Centralize style objects if needed and import them.
7. No hardcoded color values in components. All colors must reference theme tokens.
8. Depth is conveyed through tonal layering only -- no shadows.
9. Glassmorphism for overlays: 80% opacity + 20px backdrop blur with 1px Slate Gray border.

## Data Layer Skills (IndexedDB)

1. Use the `idb` wrapper library for all IndexedDB operations -- no raw IndexedDB API.
2. Database name: `rewards-wallet-db`. Object store: `cards`.
3. Implement operations: add card, edit card, delete card, toggle favorite, filter by category, search by name.
4. All CRUD logic is encapsulated in `src/db/` -- screens and components call db functions, never touch IndexedDB directly.
5. Export/import as JSON for backup functionality.

## Mantine UI Skills

1. Use Mantine components (`Paper`, `Card`, `AppShell`, `TextInput`, `ActionIcon`, `Modal`, etc.) for all UI.
2. Consult https://mantine.dev/core/ before implementing any UI pattern.
3. Apply the Monolithic Clarity theme via `MantineProvider` at the app root.
4. Use Mantine hooks (`useMediaQuery`, `useDisclosure`, etc.) for responsive behavior and UI state.
5. Never override `MantineProvider` in child components.
6. Use `@tabler/icons-react` for all UI icons.

## Component Patterns

### LoyaltyCard Type

```typescript
// src/types/index.ts
export interface LoyaltyCard {
  readonly id: string;
  readonly name: string;
  readonly category: 'retail' | 'grocery' | 'fuel' | 'pharmacy' | 'other';
  readonly barcode: string;
  readonly barcodeFormat: 'EAN13' | 'CODE128';
  readonly points: number;
  readonly color: string;
  readonly isFavorite: boolean;
  readonly createdAt: number;
  readonly updatedAt: number;
}

export type CardCategory = LoyaltyCard['category'];
```

### Database Module Pattern

```typescript
// src/db/cards.ts
import { openDB } from 'idb';
import type { LoyaltyCard } from '../types';

const DB_NAME = 'rewards-wallet-db';
const DB_VERSION = 1;
const STORE_NAME = 'cards';

function getDb() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
}

export async function getAllCards(): Promise<LoyaltyCard[]> {
  const db = await getDb();
  return db.getAll(STORE_NAME);
}

export async function addCard(card: LoyaltyCard): Promise<void> {
  const db = await getDb();
  await db.put(STORE_NAME, card);
}

export async function deleteCard(id: string): Promise<void> {
  const db = await getDb();
  await db.delete(STORE_NAME, id);
}
```

### Theme Pattern

```typescript
// src/theme/index.ts
import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'gray',
  fontFamily: 'Inter, sans-serif',
  colors: {
    dark: [
      '#F5F5F5',  // text
      '#999999',  // muted
      '#2D2D2D',  // elevated / slate gray
      '#1C1C1C',  // surface / graphite
      '#131313',  // canvas / charcoal
      '#0e0e0e',  // deepest
      '#131313',
      '#1C1C1C',
      '#2D2D2D',
      '#353534',
    ],
  },
  radius: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  },
});
```

### Barcode Component Pattern

```typescript
// src/components/BarcodeDisplay.ts
import JsBarcode from 'jsbarcode';
import type { LoyaltyCard } from '../types';

export function renderBarcode(
  svgElement: SVGElement,
  card: LoyaltyCard
): void {
  JsBarcode(svgElement, card.barcode, {
    format: card.barcodeFormat === 'EAN13' ? 'EAN13' : 'CODE128',
    width: 2,
    height: 80,
    displayValue: true,
    background: '#FFFFFF',
    lineColor: '#000000',
    margin: 10,
  });
}
```

### App Entry Pattern

```typescript
// src/main.ts
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { theme } from './theme';

// Initialize MantineProvider with Monolithic Clarity theme
// Set up hash router for screen navigation
// Register Service Worker for offline-first caching
```

### Screen Pattern

```typescript
// src/screens/Dashboard.ts
import { getAllCards } from '../db/cards';
import type { LoyaltyCard } from '../types';

export async function renderDashboard(container: HTMLElement): Promise<void> {
  const cards = await getAllCards();
  // Render vertical card list with color accents, store names, points
  // Floating "+" button to add new card
  // Tap card navigates to CardDetails screen
}
```

## Barcode Rendering Skills

1. Use `JsBarcode` library to render EAN-13 or Code 128 barcodes as inline SVG.
2. Barcode must render on a white background strip with sufficient quiet zones for SA retail till scanners.
3. Minimum barcode height: 80px. Full-width rendering in Card Details view.
4. Implement full-screen barcode tap action (bright white bg, maximized for scanning).
5. No barcode image assets -- JsBarcode renders at runtime.

## PWA Skills

1. Service Worker uses Workbox for precaching all static assets (`src/sw.ts`).
2. Web App Manifest includes: app name, icons (192x192, 512x512), `display: standalone`, `theme_color: #131313`.
3. App must work fully offline -- entire functionality available without network.
4. Mobile "Add to Home Screen" optimized with standalone display and themed status bar.
5. Configure `vite.config.ts` with `base: '/rewards-wallet/'` for GitHub Pages deployment.

## Security Skills (Client-Side)

1. Never store secrets or API keys in source code or localStorage.
2. Use `import.meta.env.VITE_*` for any third-party API keys -- never commit `.env` files.
3. Use `textContent` over `innerHTML` to prevent XSS. Sanitize user-generated content.
4. Do not use `eval()`, `Function()`, or `document.write()`.
5. Set `rel="noopener noreferrer"` on external links with `target="_blank"`.
6. Validate form inputs client-side for UX; never trust client validation as a security boundary.

## Quality and Maintenance Skills

1. Run `npm run build` after changes to verify zero TypeScript errors and successful build.
2. Add or update Vitest tests when behavior changes (db operations, utilities).
3. Keep edits minimal, scoped, and style-consistent with nearby code.
4. Avoid unrelated refactors while implementing requested changes.
5. Resolve all ESLint errors and TypeScript strict-mode violations before completion.
6. Strictly no `any` types -- use explicit interfaces for all data models.
7. Keep functions short (<=40 lines) and focused on one concern.
8. Use direct, descriptive naming for functions, variables, and files.
9. Apply DRY -- reuse existing utilities and db functions before creating duplicates.
10. If code cannot be understood quickly without comments, simplify first.
11. Functional TypeScript with module pattern. No class-based patterns unless justified.
12. Clean code. No em dashes or emojis in comments.

## Testing Skills

1. Use Vitest for unit tests, co-located with source files (`db/cards.test.ts`).
2. Test IndexedDB operations (add, edit, delete, filter, search).
3. Test pure utility functions and data transformation logic.
4. Validate that theme tokens generate expected Mantine values.
5. Name tests descriptively: `describe('addCard')` -> `it('persists card to IndexedDB and returns stored record')`.

### Test Pattern

```typescript
// src/db/cards.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { addCard, getAllCards, deleteCard } from './cards';
import type { LoyaltyCard } from '../types';

const mockCard: LoyaltyCard = {
  id: 'test-1',
  name: 'Pick n Pay Smart Shopper',
  category: 'grocery',
  barcode: '6001234567890',
  barcodeFormat: 'EAN13',
  points: 1250,
  color: '#2D2D2D',
  isFavorite: false,
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

describe('cards db', () => {
  beforeEach(async () => {
    // Clear test database
  });

  it('adds a card and retrieves it', async () => {
    await addCard(mockCard);
    const cards = await getAllCards();
    expect(cards).toHaveLength(1);
    expect(cards[0].name).toBe('Pick n Pay Smart Shopper');
  });

  it('deletes a card by id', async () => {
    await addCard(mockCard);
    await deleteCard('test-1');
    const cards = await getAllCards();
    expect(cards).toHaveLength(0);
  });
});
```

## Typical Skill Applications

1. Add new loyalty cards with barcode rendering and IndexedDB persistence.
2. Implement card filtering by category and search by name.
3. Build responsive screen layouts (Dashboard, CardDetails, Search, Settings).
4. Implement full-screen barcode scanning mode with white background.
5. Export/import card data as JSON for backup.
6. Maintain offline-first PWA behavior through Service Worker updates.
7. Update theme tokens when design system evolves.

## Accessibility Skills

1. Use semantic HTML elements (`<nav>`, `<main>`, `<section>`, `<button>`) -- no `<div>` for interactive elements.
2. All form inputs must have associated `<label>` elements.
3. Maintain keyboard navigability -- Mantine components support this by default; do not break it.
4. Use ARIA attributes only when Mantine's built-in accessibility is insufficient.
5. Ensure color contrast meets WCAG AA (4.5:1 minimum) on the dark theme.
6. Touch targets minimum 44px for mobile accessibility.
7. Respect `prefers-reduced-motion` -- Mantine handles this; do not override.

## Performance Skills

1. Use dynamic `import()` for screens and heavy modules to enable Vite code splitting.
2. Keep bundle lean -- import only needed Mantine components, not the entire library.
3. Service Worker must cache all static assets for instant load on repeat visits.
4. Audit bundle with `npx vite-bundle-visualizer` before major deploys.
5. Avoid render-blocking resources; defer non-critical scripts and assets.
6. Lazy-load heavy assets below the fold.

## Anti-Patterns (Explicitly Forbidden)

- DO NOT: Hardcode colors/fonts in component files -- use Mantine theme tokens or CSS variables
- DO NOT: Make network calls for app functionality -- this is an offline-first PWA
- DO NOT: Use `any` type -- use explicit interfaces and types
- DO NOT: Create custom UI components when Mantine provides an equivalent
- DO NOT: Override `MantineProvider` in child components
- DO NOT: Put CRUD logic in component or screen files -- all db operations live in `src/db/`
- DO NOT: Use raw IndexedDB API -- use the `idb` wrapper library
- DO NOT: Store sensitive data in localStorage or source code
- DO NOT: Use `var` declarations -- use `const` or `let`
- DO NOT: Use shadows for elevation -- use tonal layering only
- DO NOT: Use class-based patterns -- functional TypeScript with modules
- DO NOT: Skip the compliance check against `copilot-instructions.md` before finalizing
- DO NOT: Generate, create, or use AI-generated images/assets -- all visual assets must be real

## Asset Rules (Strictly No AI Generation)

1. **All images and visual assets must be real** -- supplied by the business or from approved stock. Never use AI-generated images.
2. Use `@tabler/icons-react` for all UI icons (wallet, cards, search, settings, star, etc.).
3. PWA icons (192x192, 512x512 PNG) live in `public/icons/`.
4. If an image is missing, use a themed placeholder container with a `<!-- TODO: replace with real asset -->` comment.
5. Do not use AI image generation tools to create any asset for this project.

## Reference Documentation

| Document | Purpose |
|----------|---------|
| **copilot-instructions.md** | Core engineering rules, architecture, data layer, deployment |
| **skills/skills.md** (this file) | Agent capabilities, practical code patterns, testing strategies |
| **docs/design-system.md** | Monolithic Clarity visual tokens, typography, spacing, components |
| **docs/implementation-guide.md** | Stitch prompt specifications and deployment guidelines |

For fast onboarding:
1. Read **copilot-instructions.md** for rules and architecture
2. Review `src/theme/` for current Monolithic Clarity design tokens
3. Review `src/types/` for the LoyaltyCard interface and related types
4. Use the patterns in this document as templates for new features