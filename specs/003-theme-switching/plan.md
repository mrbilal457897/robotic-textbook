# Implementation Plan — Theme Switching System

**Feature:** 003-theme-switching
**Date:** 2026-02-19

---

## Architecture

```
ThemeProvider (Root.tsx wrapper)
  ├── reads localStorage on mount
  ├── calls useColorMode() for light/dark sync
  ├── applies data-color-theme for sepia/high-contrast
  └── provides: { mode, resolvedMode, setMode, isLoading }

ThemeToggle (Navbar)
  ├── reads ThemeContext
  ├── button: opens accessible popover
  └── popover: 5 menu items with icons, labels, descriptions

CSS Variable System (variables.css)
  ├── :root — shared tokens (fonts, spacing, radius)
  ├── [data-theme="dark"] — Velvet Cosmos dark (existing)
  ├── [data-theme="light"] — warm lavender-white theme (NEW)
  ├── [data-color-theme="sepia"] — parchment theme (NEW)
  └── [data-color-theme="high-contrast"] — WCAG AAA (NEW)

FOUC Prevention
  ├── Docusaurus headTags inline script — adds no-theme-transition class
  ├── Script reads localStorage and applies data-color-theme before first paint
  └── ThemeContext removes no-theme-transition on first rAF after mount
```

---

## Execution Order

1. `src/lib/theme/index.ts` — types, storage, DOM utilities
2. `src/lib/theme/ThemeContext.tsx` — React context wrapping useColorMode()
3. `src/components/ThemeToggle/index.tsx` — accessible popover toggle
4. `src/components/ThemeToggle/styles.module.css` — all 4 theme adaptations
5. `src/css/variables.css` — light/sepia/high-contrast CSS tokens
6. `src/css/global.css` — theme-aware base styles + transition rules
7. `docusaurus.config.js` — headTags FOUC script
8. `tailwind.config.js` — data-theme="dark" dark mode selector
9. `src/theme/Root.tsx` — wrap with ThemeProvider
10. `src/theme/Navbar/index.tsx` — mount ThemeToggle

---

## File Inventory

### Created

| File                                           | Purpose                               |
| ---------------------------------------------- | ------------------------------------- |
| `src/lib/theme/index.ts`                       | Types, storage utilities, DOM helpers |
| `src/lib/theme/ThemeContext.tsx`               | React context + provider              |
| `src/components/ThemeToggle/index.tsx`         | Toggle UI component                   |
| `src/components/ThemeToggle/styles.module.css` | Toggle styles (all modes)             |

### Modified

| File                         | Change                                            |
| ---------------------------- | ------------------------------------------------- |
| `src/css/variables.css`      | Added full light/sepia/HC token blocks            |
| `src/css/global.css`         | Added theme transitions + per-mode base overrides |
| `docusaurus.config.js`       | Added headTags anti-FOUC script                   |
| `tailwind.config.js`         | Updated darkMode selector array                   |
| `src/theme/Root.tsx`         | Wrapped with ThemeProvider                        |
| `src/theme/Navbar/index.tsx` | Imported + mounted ThemeToggle                    |

---

## Color Token Reference

### Light Mode

- Background: `#F8F7FF` (warm lavender-white)
- Text: `#1A1527` (deep violet-black) — 13.5:1 contrast ✓
- Primary: `#6D28D9` (darker violet for light bg)
- Link: `#6D28D9` with underline

### Sepia Mode

- Background: `#F4ECD6` (parchment)
- Text: `#2C1A0E` (dark brown) — 11.8:1 contrast ✓
- Primary: `#7C3A10` (amber-brown)
- Link: `#7C3A10` with underline

### High-Contrast Mode

- Background: `#000000` — Text: `#FFFFFF` — 21:1 ✓ AAA
- Links: `#FFFF00` (yellow) — 19.5:1 on black ✓ AAA
- Focus rings: 3px solid `#FFFF00`

---

## Known Constraints

1. Sepia mode uses `data-color-theme="sepia"` layered on top of Docusaurus's `data-theme`. Components that use Docusaurus IFM variables will adapt automatically. Custom hardcoded hex colors will not.
2. High-contrast similarly layers on `data-theme="dark"`. Glassmorphism effects are deliberately suppressed in HC mode for clarity.
3. Future mode additions (e.g. "dim", "nord") require: a new entry in `THEME_MODES` array + a new CSS block in `variables.css` + the FOUC script update for localStorage keys.
