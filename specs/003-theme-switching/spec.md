# Feature Spec — Theme Switching System

**Feature ID:** 003-theme-switching
**Branch:** 003-theme-switching
**Status:** Draft
**Author:** Architect
**Date:** 2026-02-19

---

## 1. Feature Overview

Add a production-grade, accessible theme switching system to the Physical AI textbook (Docusaurus 3.x). The system supports four intentional reading modes and one system-default mode, backed by a semantic CSS token architecture designed for long-form reading.

### Modes

| Mode            | Trigger Class / Attribute          | Use Case                                 |
| --------------- | ---------------------------------- | ---------------------------------------- |
| `system`        | OS `prefers-color-scheme`          | Default — respects user OS setting       |
| `light`         | `data-theme="light"`               | Bright environments, high ambient light  |
| `dark`          | `data-theme="dark"`                | Default Velvet Cosmos — dim environments |
| `sepia`         | `data-color-theme="sepia"`         | Extended reading, reduced eye strain     |
| `high-contrast` | `data-color-theme="high-contrast"` | Accessibility — WCAG AAA                 |

---

## 2. UX Considerations

### Reading Environment Requirements

- Textbook content involves long reading sessions (20–60 min).
- Contrast must be comfortable, not harsh. Avoid pure `#000`/`#FFF`.
- Code blocks need distinct but readable backgrounds in all modes.
- Links must be distinguishable from body text without relying on color alone (underline + color).
- Headings must feel hierarchically distinct in each mode.

### Color Intentionality

- Light mode is NOT white-on-black inverted. It uses a warm lavender-tinted `#F8F7FF` base with deep violet text `#1A1527`.
- Sepia is parchment-inspired (`#F4ECD6`) with dark brown text (`#2C1A0E`). Optimized for late-night reading.
- High-contrast is pure WCAG AAA compliance: black background, white text, yellow links.

### Toggle UX

- A compact icon button in the Navbar opens a popover with all 5 options.
- Current active mode is visually indicated (filled ring + check icon).
- Keyboard navigable (Tab + Enter/Space + Escape to close).
- ARIA: `role="menu"`, `aria-haspopup`, `aria-expanded`, `aria-checked` on items.

---

## 3. Technical Architecture

### Stack Reality

This project is **Docusaurus 3.x**, not Next.js. Key differences:

- Theme persistence is handled via Docusaurus's `useColorMode()` for light/dark.
- Extended modes (sepia, high-contrast) use a separate `data-color-theme` attribute + custom context.
- FOUC prevention: Docusaurus handles light/dark. Extended modes use `headTags` inline script in `docusaurus.config.js`.

### Component Graph

```
Root.tsx
  └── ThemeProvider (src/lib/theme/ThemeContext.tsx)
        ├── wraps useColorMode() for light/dark sync
        ├── manages data-color-theme for sepia/high-contrast
        └── exposes: { mode, resolvedMode, setMode }

Navbar/index.tsx
  └── ThemeToggle (src/components/ThemeToggle/index.tsx)
        ├── reads from ThemeContext
        └── renders popover with 5 mode options
```

### CSS Token Strategy

```
:root                         → shared tokens (fonts, spacing, radius, transitions)
[data-theme="light"]          → light palette overrides
[data-theme="dark"]           → dark Velvet Cosmos palette (existing)
[data-color-theme="sepia"]    → sepia palette overrides (layered on top)
[data-color-theme="high-contrast"] → HC palette overrides
```

### Storage

- Key: `phyai-color-mode`
- Values: `'system' | 'light' | 'dark' | 'sepia' | 'high-contrast'`
- Docusaurus also stores its own key internally for light/dark sync.

### FOUC Prevention

- Docusaurus handles light/dark FOUC natively.
- Extended modes: inline `<script>` injected via `headTags` in `docusaurus.config.js` that reads localStorage and applies `data-color-theme` before first paint.

---

## 4. Risks

1. **Docusaurus colorMode conflict** — Docusaurus manages `data-theme` independently. Our context must stay in sync without fighting it. Mitigation: call `setDocColorMode()` when user picks light/dark; skip for sepia/high-contrast.

2. **CSS variable specificity** — Extended modes layer `data-color-theme` on top of `data-theme`. If a component hardcodes a hex value instead of using a CSS variable, it won't adapt. Mitigation: audit existing components post-implementation.

3. **SSR hydration** — Docusaurus uses SSR. Theme reads are client-only. Mitigation: use `useEffect` for all localStorage reads; provide SSR-safe defaults.

---

## 5. Acceptance Criteria

- [ ] Five theme modes selectable from Navbar toggle
- [ ] Theme persists across page reloads (localStorage)
- [ ] `system` mode respects `prefers-color-scheme` and updates on OS change
- [ ] No flash of incorrect theme on page load (all modes)
- [ ] WCAG AA minimum contrast in light/dark/sepia; AAA in high-contrast
- [ ] Toggle is keyboard-navigable and screen-reader announced
- [ ] Headings, body text, links, code blocks all adapt in each mode
- [ ] Existing layout spacing and typography scale unchanged
- [ ] Tailwind dark utilities work via `data-theme="dark"` selector
- [ ] Sepia and high-contrast modes have scoped CSS variable overrides
