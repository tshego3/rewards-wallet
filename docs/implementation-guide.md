## Phase 1: UI Generation (Google Stitch Prompt)

Copy and paste the following prompt into the Google Stitch interface to generate the design system and UI layout.

### The Prompt

> **Role**: Lead UI/UX Designer and Front-End Architect.
> **Project**: "Rewards Wallet" - A modern dark-themed Reward & Loyalty Virtual Cards management application.
>
> **Design Requirements**:
>
> * **Core Directive:** ACTUALLY GENERATE THE SCREENS. Return structured UI layouts. Create visual hierarchy. Include components, spacing, and interactions. Do not explain the design. Do not describe intentions. Output only the generated UI structure.
> * **Brand Aesthetic:** Minimal Claude-inspired UI. Calm productivity-focused aesthetic with elegant typography and minimal visual noise. The interface should feel like a quiet, high-end digital workspace.
> * **Color Palette:**
>   - Background/Canvas: Charcoal (#131313)
>   - Surface: Graphite (#1C1C1C)
>   - Elevated: Slate Gray (#2D2D2D)
>   - Primary Text: Off-White (#F5F5F5)
>   - Secondary Text: Muted (#999999)
>   - Accent (subtle): White (#FFFFFF) for active states and indicators
> * **Typography:** Use **Inter** exclusively. Tight letter-spacing for headlines, generous 1.6 line-height for body.
> * **Visual Treatment:**
>   - Dark monochrome palette throughout
>   - Spacious layout with 4px baseline grid
>   - Rounded corners (8px standard, 16px cards, 24px outer wrappers)
>   - Soft 1px dividers using Slate Gray
>   - Subtle glassmorphism on overlays (80% opacity + 20px backdrop blur)
>   - No shadows. Depth through tonal layering only.
>
> * **Screens to Generate (Mobile-First):**
>   1. **Dashboard** - Single-column grid of saved loyalty cards with points balance per card, bottom tab navigation, and floating add button.
>   2. **Card Details View** - Full card visualization with a prominent **scannable barcode** (EAN-13 or Code 128 format, compatible with South African retail till scanners). Show card name, program, points balance, and barcode number. Tap barcode for full-screen scan mode. Include edit/delete actions.
>   3. **Add/Edit Card** - Bottom sheet or full-screen form to capture card name, program/store, barcode number, category, and card color.
>   4. **Search** - Top search bar with instant filter across saved cards by name or category.
>   5. **Settings** - Simple list view with data export/import (JSON backup) and clear data option.
>
> * **Required Layout Structure (Mobile-First, scales up to Desktop):**
>   - **Mobile (default):** Single-column, bottom tab navigation (Home, Search, Settings), 16px container padding, cards stack vertically
>   - **Desktop (breakpoint up):** Left sidebar navigation (collapsible, icon + label, active indicator with 2px white left border), central content area (max-width 960px, 24px padding)
>   - Card previews showing store name, truncated barcode, and points balance
>   - Card Details with full-width barcode rendered at scannable resolution (min height 80px, black bars on white background for contrast with till scanners)
>   - Floating action button for adding new cards (mobile), inline button (desktop)
>   - Category filters (horizontally scrollable chips on mobile, static row on desktop)
>   - Touch-optimized tap targets (min 44px hit area)
>
> **Deliverable**: High-fidelity screen layouts with full component structure, spacing values, and interaction states. Optimized for a pure PWA built with Vite + TypeScript + Mantine UI.

---

## Phase 2: Code Generation (MCP Stitch Prompt)

Once you have the Stitch Project ID, use this prompt to generate the functional codebase.

### The Prompt

> **Task**: Build a pure PWA using the UI design from **Project ID: [docs/design-system.md]**.
>
> **Technical Stack**:
> * **Framework**: Vite + TypeScript (pure PWA, no React/Vue/Angular).
> * **UI Library**: Mantine UI (Core, Hooks, and Spotlight for search).
> * **Storage**: IndexedDB (via `idb` wrapper library) for all loyalty card CRUD operations. Zero server calls. All data persists locally on device.
> * **PWA**: Service Worker with Workbox for offline-first caching, Web App Manifest for installability.
> * **Routing**: Client-side hash router or lightweight vanilla router.
> * **Type Safety**: Strictly **no "any"** types. Use explicit interfaces and types for all components, props, and data models.
> * **Licensing**: Use only MIT/Open Source libraries.
>
> **Data Layer (IndexedDB)**:
> * **Database**: `rewards-wallet-db`
> * **Object Stores**:
>   - `cards` - Loyalty cards (id, name, category, barcode, barcodeFormat, points, color, isFavorite, createdAt, updatedAt)
> * **Operations**: Add card, edit card, delete card, toggle favorite, filter by category, search by name.
>
> **Feature Specifications**:
> * **Theme**: Implement a custom Mantine Theme using the Monolithic Clarity dark palette from the Stitch design. Override all surface tokens, radius values, and typography scales.
> * **Barcode Rendering**: Use `JsBarcode` library to render EAN-13 or Code 128 barcodes as SVG. The barcode must be rendered on a **white background strip** with sufficient quiet zones so SA retail till scanners can read it even on the dark UI. Provide a "full-screen barcode" tap action that maximizes the barcode for easy scanning at checkout.
> * **Screens & Components (Mobile-First)**:
>   1. **AppShell**: Bottom tab navigation (mobile, default), left sidebar (desktop breakpoint). Tabs: Home, Search, Settings.
>   2. **Dashboard**: Vertical card list with card color accent, store name, points. Floating "+" button. Tap card opens Details.
>   3. **Card Details**: Full-screen card with scannable barcode (SVG, white bg, full width), card name, points, edit/delete actions. Tap barcode for full-screen scan mode.
>   4. **Add/Edit Card**: Bottom sheet (mobile) or modal (desktop) with fields: store name, barcode number, category picker, card color picker. Save to IndexedDB.
>   5. **Search**: Sticky top search bar with instant filtering by name or category chips (horizontally scrollable).
>   6. **Settings**: List view with data export/import (JSON), clear all data, about section.
> * **Interactions**:
>   - Touch-first: swipe, tap, long-press for contextual actions
>   - Tap barcode to expand full-screen for scanning (bright white bg, max brightness hint)
>   - Cards use subtle scale transform on press
>   - Smooth page transitions between screens
>   - Desktop: hover states use Slate Gray background transition, active nav shows 2px left white accent border
> * **PWA Features**:
>   - Offline-first: entire app works without network (no API calls)
>   - Installable on mobile and desktop (manifest.webmanifest)
>   - Service Worker caches all static assets
>   - Mobile: "Add to Home Screen" optimized (standalone display, status bar theme color)
> * **Layout Strategy**: Mobile-first CSS. Base styles target phone viewport. Use min-width media queries to scale up to tablet/desktop.
> * **Deployment**: Configure `vite.config.ts` with the correct base path for **GitHub Pages** deployment.
>
> **Code Style**:
> * Functional TypeScript with module pattern.
> * Modular file structure: `types/`, `theme/`, `components/`, `screens/`, `db/`.
> * Keep it simple. No unnecessary abstractions.
> * Clean code. No em dashes or emojis in comments.

---

## Developer Onboarding & Deployment Guidelines

### 1. Local Environment Setup

* Node.js v18+ required.
* Clone the repository and navigate to `rewards-wallet/`.
* Run `npm install` to install all pinned dependencies.
* Run `npm run dev` to start the Vite dev server.
* Run `npm run lint` to check for linting errors.
* Run `npm run test` to run the Vitest test suite.

### 2. Project Structure

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
    global.css             # Reduced-motion media query + base resets
  index.html
  vite.config.ts           # base: '/rewards-wallet/' for GitHub Pages
  tsconfig.json            # strict: true, no any
  eslint.config.js         # ESLint flat config (typescript-eslint strict)
  .npmrc                   # save-exact=true
```

### 3. IndexedDB Schema

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

### 4. Design Tokens

All Monolithic Clarity color, spacing, and radius values are centralized in `src/theme/index.ts` and exported as the `tokens` constant. Components must import from there. No hardcoded hex values in component files.

### 5. Deployment to GitHub Pages

1. Ensure `base: '/rewards-wallet/'` is set in `vite.config.ts`.
2. Run `npm run build` to type-check and generate the `dist` folder.
3. Deploy with `npx gh-pages -d dist`.
4. In GitHub repo Settings > Pages, set source to the `gh-pages` branch.
5. Verify PWA install prompt works on the deployed URL over HTTPS.

### 6. Handling Assets

* **Icons**: Use `@tabler/icons-react` for all UI icons (wallet, cards, search, settings, star, etc.).
* **PWA Icons**: 192x192 and 512x512 PNG icons live in `public/icons/`. Replace placeholders with real assets before production deploy.
* **Barcode**: JsBarcode renders barcodes as inline SVG at runtime. No barcode image assets needed.
* **Fonts**: Inter loaded via Google Fonts in `index.html`.
