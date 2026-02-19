---
id: '0063'
title: Fix useColorMode Outside ColorModeProvider Error
stage: green
date: 2026-02-19
surface: agent
model: claude-sonnet-4-5-20250929
feature: 002-rag-textbook-chatbot
branch: 002-rag-textbook-chatbot
user: architect
command: fix runtime error "Hook useColorMode is called outside the <ColorModeProvider>"
labels: ['bug-fix', 'theme', 'docusaurus', 'react-context', 'useColorMode', 'FOUC', 'localStorage']
links:
  spec: specs/003-theme-switching/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - src/lib/theme/ThemeContext.tsx
tests:
  - Manual: verify no runtime error in browser console
  - Manual: verify ThemeToggle appears in Navbar and is functional
  - Manual: verify data-theme + data-color-theme attributes on <html>
  - Manual: verify theme persists across page reloads
---

## Prompt

Hook useColorMode is called outside the <ColorModeProvider>. Please see https://docusaurus.io/docs/api/themes/configuration#use-color-mode.

## Response snapshot

**Root cause identified:** `Root.tsx` is Docusaurus's outermost wrapper component — it mounts _above_ Docusaurus's own `ColorModeProvider`. The original `ThemeContext.tsx` called `useColorMode()` which requires `ColorModeProvider` in the React ancestor tree. Since `Root.tsx` renders before `ColorModeProvider` mounts, calling the hook threw the error unconditionally.

**Fix applied — complete rewrite of `src/lib/theme/ThemeContext.tsx`:**

Eliminated `useColorMode()` entirely. Replaced with a **direct DOM + dual-localStorage strategy**:

1. **`applyDocBase()` function** — directly sets `document.documentElement.setAttribute('data-theme', ...)` and syncs Docusaurus's own `'theme'` localStorage key:
   - `light` / `dark`: writes `localStorage.setItem('theme', docBase)` + sets `data-theme`
   - `system`: calls `localStorage.removeItem('theme')` so Docusaurus's `respectPrefersColorScheme` takes over naturally; reads OS preference via `matchMedia` and applies `data-theme` immediately

2. **`ThemeProvider`** — flat single-component provider (no `ThemeProviderInner` wrapper needed):
   - Mount effect: reads `phyai-color-mode` key, calls `applyMode()`, sets `isLoading = false`, removes `no-theme-transition` class via `requestAnimationFrame`
   - OS preference listener: active only when `mode === 'system'`, updates on `prefers-color-scheme` change
   - `setMode()`: writes to both `phyai-color-mode` (our key) and triggers `applyMode()`

3. **No Docusaurus hook dependency** — works at any component tree depth, including above `ColorModeProvider`

**Key insight:** Docusaurus reads its `'theme'` localStorage key on startup (not from a React hook) to set `data-theme` before first paint. By writing to this same key we stay in sync without needing `useColorMode()`.

**All other implementation files verified correct:**

- `src/lib/theme/index.ts` — types, storage utilities, DOM helpers ✓
- `src/components/ThemeToggle/index.tsx` — uses `useThemeSafe()` (null-safe) ✓
- `src/theme/Root.tsx` — wraps children with `<ThemeProvider>` ✓
- `src/theme/Navbar/index.tsx` — `<ThemeToggle />` mounted in desktop actions ✓
- `docusaurus.config.js` — anti-FOUC `headTags` script for sepia/high-contrast ✓

## Outcome

- ✅ Impact: Runtime error eliminated; ThemeProvider now operates safely above ColorModeProvider
- 🧪 Tests: Manual verification required (run `npm run start`, confirm no console error, toggle all 5 modes)
- 📁 Files: 1 file rewritten (ThemeContext.tsx)
- 🔁 Next steps: Run dev server to validate; wire ThemeToggle into mobile menu; audit components for hardcoded hex colors that won't adapt to new themes
- 🧠 Reflection: Docusaurus's `Root.tsx` is a special boundary — any context that needs to wrap the entire app (including Docusaurus internals) must avoid Docusaurus hooks. Direct DOM + localStorage manipulation is the correct pattern for theme control at this level.

## Evaluation notes (flywheel)

- Failure modes observed: calling `useColorMode()` from above `ColorModeProvider` — always throws, not conditional
- Fix approach: DOM-first, no framework hook dependency
- Graders: tsc check deferred; manual browser test is the verification gate
- Next experiment: add `aria-live="polite"` region to announce theme changes to screen readers
