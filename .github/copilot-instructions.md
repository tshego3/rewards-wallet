# Engineering Rules (TypeScript + Vite + Mantine PWA)

These rules are mandatory for all feature work, bug fixes, and refactors in this repository.

## 1) Platform Identity

1. Stack is TypeScript + Vite (pure PWA, no React/Vue/Angular frameworks).
2. UI library is [Mantine](https://mantine.dev/) (Core, Hooks, and Spotlight).
3. This is a client-side-only, offline-first PWA — no backend, no database server, no authentication server, no server-side APIs.
4. All data persists locally on device via IndexedDB (using the `idb` wrapper library). Zero server calls.
5. PWA features via Workbox Service Worker for offline-first caching and Web App Manifest for installability.
6. Deployment target is GitHub Pages.

## 2) Non-Negotiable Architecture Rules

1. No server-side code — no Express, no Node server, no SSR runtime.
2. No remote database connections or ORM usage. IndexedDB is the sole data layer.
3. No authentication flows requiring a backend (no JWT issuance, no session cookies, no OAuth server callbacks).
4. No API calls to services you control on a server. Zero network calls for app functionality.
5. All data lives in IndexedDB (`rewards-wallet-db`). Static content lives in source or `public/`.
6. Keep modules small and focused — one concern per file.
7. Shared types and interfaces live in `src/types/`. Do not duplicate type definitions across modules.
8. Routing is client-side hash router or lightweight vanilla router. No framework router libraries.

## 3) Project Structure Rules

1. Entry point is `index.html` at the project root, with scripts in `src/`.
2. Keep a flat, predictable structure:
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
3. Vite config lives at the project root (`vite.config.ts`) with `base: '/rewards-wallet/'` for GitHub Pages.
4. Static assets (icons, fonts) belong in `public/`. No `src/assets/` for runtime data — use IndexedDB.
5. `src/theme/` is the centralized design token source — all Monolithic Clarity palette values originate here.

## 4) TypeScript Rules

1. Enable `strict: true` in `tsconfig.json` — no exceptions.
2. Strictly **no `any` types**. Use explicit interfaces and types for all components, props, and data models.
3. Never use `@ts-ignore` or `@ts-expect-error` without a comment explaining why it is necessary.
4. Use `interface` for object shapes and `type` for unions, intersections, and computed types.
5. Export types from `src/types/` and import them where needed — no inline duplication.
6. Prefer `const` over `let`; never use `var`.
7. Use template literals over string concatenation.
8. Prefer `readonly` properties where mutation is not required.
9. Use functional TypeScript with module pattern. No class-based patterns unless justified.

## 5) Design System and Styling Rules

### Monolithic Clarity Dark Theme

1. **All design tokens live in `src/theme/`** — the Mantine theme override consuming the Monolithic Clarity dark palette from `docs/design-system.md`. This is the single source of visual truth.
2. The theme is consumed by `MantineProvider` at app initialization. All palette, font, radius, and spacing values derive from the theme config.
3. **No hardcoded colors, font families, or spacing values in components** — components must use Mantine theme tokens or CSS variables (`var(--mantine-color-*)`) exclusively.
4. If a component needs a design token in TypeScript, import from `src/theme/` — never inline the value.

### Color Palette (Monolithic Clarity)

5. **Background/Canvas: Charcoal (`#131313`)** — main app background, minimizes eye strain.
6. **Surface: Graphite (`#1C1C1C`)** — primary UI containers, sidebars, feed lists.
7. **Elevated: Slate Gray (`#2D2D2D`)** — hover states, active elements, input backgrounds.
8. **Primary Text: Off-White (`#F5F5F5`)** — prevents halogen vibration on dark backgrounds.
9. **Secondary Text: Muted (`#999999`)** — metadata and less critical information.
10. **Accent: White (`#FFFFFF`)** — active states, indicators, and primary buttons.
11. Depth is conveyed through **tonal layering only** — no shadows. Use background lightness tiers for elevation.
12. Glassmorphism for overlays: 80% opacity + 20px backdrop blur with 1px Slate Gray border.

### Typography

13. **Inter** is the sole font family — used for all headings, body, and labels. No secondary fonts.
14. Headlines use tight letter-spacing (`-0.02em`) and semi-bold weight for visual anchoring.
15. Body text uses generous 1.6 line-height for readability.
16. Labels use increased tracking for metadata differentiation.
17. Load Inter via Google Fonts or self-host in `public/fonts/`.

### Shape and Spacing

18. Rounded corners: 8px standard, 16px cards, 24px outer wrappers.
19. Spacing based on 4px baseline grid. Container padding: 24px desktop, 16px mobile.
20. Soft 1px dividers using Slate Gray — no heavy borders.

### Asset Rules

21. All images and visual assets must be real — supplied by the business or from approved stock. Never use AI-generated images.
22. If an asset is missing, use a themed placeholder container with a `<!-- TODO: replace with real asset -->` comment.
23. Use `@tabler/icons-react` for all UI icons (wallet, cards, search, settings, star, etc.).

### Styling Rules

24. Use Mantine's built-in styling approaches: component props (`color`, `variant`, `size`) and the `style` prop referencing theme tokens.
25. Keep responsive design mobile-first. Base styles target phone viewport. Use min-width media queries to scale up to tablet/desktop.
26. **No `.module.css` files.** Centralize style objects if needed and import them. No inline style definitions in component files.
27. **No hardcoded color values in components.** All colors must reference theme tokens.
28. No `!important` unless overriding third-party library styles with no alternative.
29. Maintain visual hierarchy with Mantine's spacing scale and type scale derived from the theme.

## 6) Data Layer Rules (IndexedDB)

1. Database name: `rewards-wallet-db`.
2. Use the `idb` wrapper library for all IndexedDB operations — no raw IndexedDB API calls.
3. Object store: `cards` — stores loyalty card records.
4. Schema:
   ```typescript
   interface LoyaltyCard {
     id: string;
     name: string;           // Store/program name (e.g. "Pick n Pay Smart Shopper")
     category: 'retail' | 'grocery' | 'fuel' | 'pharmacy' | 'other';
     barcode: string;        // EAN-13 or Code 128 number for SA till scanners
     barcodeFormat: 'EAN13' | 'CODE128';
     points: number;
     color: string;          // Card accent color
     isFavorite: boolean;
     createdAt: number;
     updatedAt: number;
   }
   ```
5. Operations: Add card, edit card, delete card, toggle favorite, filter by category, search by name.
6. All CRUD logic lives in `src/db/` — no database operations in component or screen files.
7. Export/import as JSON for backup (Settings screen).

## 7) Security Rules (Client-Side)

1. Never store secrets, API keys, or credentials in source code or localStorage.
2. If consuming a third-party public API, use environment variables via Vite's `import.meta.env` (prefixed `VITE_`) — never commit `.env` files with real keys.
3. Sanitize any user-generated content before rendering to prevent XSS. Use `textContent` over `innerHTML` unless deliberately rendering trusted markup.
4. Do not use `eval()`, `Function()`, or `document.write()`.
5. Set `rel="noopener noreferrer"` on all external links opened with `target="_blank"`.
6. If using forms, validate inputs client-side for UX — but never trust client-side validation as a security boundary.

## 8) UI and Interaction Rules

Refer to `docs/design-system.md` for the full Monolithic Clarity design specification including color tokens, typography scale, spacing system, and component specifications.

1. Follow a calm, productivity-focused aesthetic: generous whitespace, clear hierarchy, intentional tonal layering — all derived from the Mantine theme.
2. Use Mantine's `Paper` and `Card` components with `radius` props for tonal layering. No shadows; depth through background color tiers only.
3. Keep typography consistent — use Mantine's `Title`, `Text` components. Font families and scale come exclusively from the Mantine theme.
4. All interactive elements must have visible focus states — Mantine handles this by default; do not disable `focusRing` in the theme.
5. Touch-optimized tap targets (min 44px hit area). Touch-first interactions: swipe, tap, long-press.
6. Maintain a minimum 4.5:1 contrast ratio for text (WCAG AA).
7. Responsive design is mandatory — mobile-first CSS, test at mobile (360px), tablet (768px), and desktop (1280px+).
8. Animations must respect `prefers-reduced-motion`.
9. **Consult Mantine component API first** — before building custom UI, check https://mantine.dev/core/ for an existing component.

### Screen Specifications

10. **AppShell**: Bottom tab navigation (mobile), left sidebar (desktop). Tabs: Home, Search, Settings.
11. **Dashboard**: Vertical card list with card color accent, store name, points. Floating "+" button. Tap card opens Details.
12. **Card Details**: Full-screen card with scannable barcode (SVG, white bg, full width), card name, points, edit/delete actions. Tap barcode for full-screen scan mode.
13. **Add/Edit Card**: Bottom sheet (mobile) or modal (desktop) with fields: store name, barcode number, category picker, card color picker. Save to IndexedDB.
14. **Search**: Sticky top search bar with instant filtering by name or category chips (horizontally scrollable).
15. **Settings**: List view with data export/import (JSON), clear all data, about section.

### Interaction Patterns

16. Tap barcode to expand full-screen for scanning (bright white bg, max brightness hint).
17. Cards use subtle scale transform on press.
18. Smooth page transitions between screens.
19. Desktop: hover states use Slate Gray background transition, active nav shows 2px left white accent border.

## 9) Barcode Rendering Rules

1. Use `JsBarcode` library to render EAN-13 or Code 128 barcodes as SVG.
2. Barcode must render on a **white background strip** with sufficient quiet zones so SA retail till scanners can read it on the dark UI.
3. Minimum barcode height: 80px. Full-width rendering in Card Details view.
4. Provide a full-screen barcode tap action that maximizes the barcode for easy scanning at checkout.
5. No barcode image assets — JsBarcode renders inline SVG at runtime.

## 10) PWA Rules

1. App must work fully offline — entire functionality available without network.
2. Service Worker uses Workbox for precaching all static assets (`src/sw.ts`).
3. Web App Manifest (`public/manifest.webmanifest`) with: app name, icons (192x192, 512x512), `display: standalone`, `theme_color` matching Charcoal (#131313).
4. Mobile "Add to Home Screen" optimized — standalone display, status bar theme color.
5. Installable on both mobile and desktop.

## 11) Performance Rules

1. Use Vite's built-in code splitting — dynamic `import()` for screens or heavy modules.
2. Optimize images at build time (use appropriate formats: WebP/AVIF for photos, SVG for icons).
3. Lazy-load images and heavy assets below the fold.
4. Keep the initial bundle small — audit with `vite build --report` or `npx vite-bundle-visualizer`.
5. Avoid render-blocking resources; defer non-critical scripts and styles.
6. Do not import entire libraries when only a single utility is needed (tree-shake or import specific paths).
7. Service Worker must cache all static assets for instant load on repeat visits.

## 12) Testing Rules

1. Use Vitest for unit tests (aligned with Vite).
2. Test pure utility functions, IndexedDB operations, and any non-trivial logic.
3. Keep tests co-located with source files (`db/cards.ts` -> `db/cards.test.ts`) or in a parallel `__tests__/` folder.
4. Run `npm run build` to verify zero TypeScript errors and successful production build.
5. Validate accessibility with automated checks (axe-core or similar) on key screens.

## 13) Change Management Rules

1. Prefer minimal, scoped changes over broad rewrites.
2. Do not refactor unrelated areas while implementing targeted fixes.
3. Keep naming, formatting, and coding style aligned with surrounding code.
4. Use ESLint and Prettier (or Biome) — code must pass lint with zero errors before merge.
5. No nested ternaries or deeply nested conditionals — prefer early returns and flat logic.
6. Keep functions short and focused (<=40 lines preferred). If longer, break it up.
7. Use direct, descriptive naming for variables, functions, and files.
8. Apply DRY — reuse existing utilities before creating parallel implementations.
9. If code cannot be understood quickly without comments, simplify it first.
10. Clean code. No em dashes or emojis in comments.
11. AI agent compliance check: before finalizing changes, verify alignment with this document and `docs/design-system.md`.

## 14) Build and Tooling Rules

1. Use `npm` — do not mix package managers.
2. Lock files (`package-lock.json`) must be committed.
3. All dependencies must be explicitly listed in `package.json` — no relying on transitive installs.
4. Dev dependencies vs. production dependencies must be correctly categorized.
5. Keep Vite and TypeScript versions up to date; pin major versions to avoid surprise breakage.
6. Use `vite preview` to verify the production build locally before deploying.
7. **All dependency versions must be pinned exactly** (no `^` or `~` prefixes). Use `.npmrc` with `save-exact=true` to enforce this.
8. Do not add bloated or unnecessary packages. Prefer lightweight, single-purpose dependencies. Justify every new dependency.
9. Use only MIT/Open Source licensed libraries.
10. Core dependencies: `@mantine/core`, `@mantine/hooks`, `@mantine/spotlight`, `idb`, `jsbarcode`, `workbox-precaching`, `@tabler/icons-react`.

## 15) Accessibility Rules

1. Use semantic HTML elements (`<nav>`, `<main>`, `<section>`, `<button>`, etc.) — do not use `<div>` for interactive elements.
2. All form inputs must have associated `<label>` elements.
3. Ensure keyboard navigation works for all interactive elements.
4. Use ARIA attributes only when semantic HTML is insufficient — do not over-ARIA.
5. Page must have a single `<h1>` and headings must follow logical order.
6. Skip-to-content link should be present for keyboard users.
7. Touch targets minimum 44px for mobile accessibility.

## 16) Deployment Rules (GitHub Pages)

1. Set `base: '/rewards-wallet/'` in `vite.config.ts`.
2. Build output is a static folder (`dist/`) deployed to GitHub Pages.
3. Deploy with `npx gh-pages -d dist`.
4. In GitHub repo Settings > Pages, set source to the `gh-pages` branch.
5. Ensure `public/` assets (manifest.webmanifest, icons, robots.txt) are correctly copied to build output.
6. Verify PWA install prompt works on the deployed URL over HTTPS.
7. Never include source maps in production deployments unless explicitly required for debugging.
8. Configure proper cache headers for hashed assets (Vite handles filename hashing by default).