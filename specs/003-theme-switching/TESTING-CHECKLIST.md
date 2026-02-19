# Testing Checklist — Theme Switching System

**Feature:** 003-theme-switching
**Date:** 2026-02-19

---

## 1. Functional Tests

### Theme Selection

- [ ] Clicking the Navbar toggle button opens the popover
- [ ] All 5 modes visible in popover: System / Light / Dark / Sepia / High Contrast
- [ ] Selecting each mode applies the correct theme immediately
- [ ] Active mode shows checkmark icon
- [ ] Selecting the already-active mode does not cause any errors

### Persistence

- [ ] Reload page — theme matches the last-selected mode
- [ ] Open a new tab — theme matches localStorage (if set)
- [ ] Clear localStorage — defaults to System (OS preference)
- [ ] `localStorage.getItem('phyai-color-mode')` returns correct value after selection

### System Mode

- [ ] With System selected + OS in dark mode → dark theme applied
- [ ] With System selected + OS in light mode → light theme applied
- [ ] Changing OS preference while System is selected → theme updates in real-time
- [ ] System mode does not set `data-color-theme` attribute on `<html>`

### Extended Modes

- [ ] Sepia: `<html data-color-theme="sepia">` is present in DOM
- [ ] High-Contrast: `<html data-color-theme="high-contrast">` is present in DOM
- [ ] Switching from Sepia to Dark: `data-color-theme` attribute is removed from `<html>`
- [ ] Switching from Dark to Sepia: attribute is added correctly

---

## 2. Visual / Color Tests

### Light Mode

- [ ] Background is warm lavender-white `#F8F7FF`, not pure white
- [ ] Body text is dark violet-black `#1A1527`, not pure black
- [ ] Links are visible violet and underlined
- [ ] Code blocks have light purple tint `#EDE9F8`
- [ ] Navbar background is semi-transparent lavender
- [ ] No element has pure white or pure black except borders

### Dark Mode (existing Velvet Cosmos)

- [ ] Background remains `#0c0c0c` (unchanged)
- [ ] Text remains `#EDE8FA` (unchanged)
- [ ] Primary color remains `#A78BFA` (amethyst violet)

### Sepia Mode

- [ ] Background is warm parchment `#F4ECD6`
- [ ] Body text is dark brown `#2C1A0E`
- [ ] Navbar has parchment tint
- [ ] Links are amber-brown and underlined
- [ ] Code blocks are `#E8D5B0` background

### High-Contrast Mode

- [ ] Background is pure black `#000000`
- [ ] Body text is pure white `#FFFFFF`
- [ ] All links are yellow `#FFFF00`
- [ ] Code blocks have dark tint with yellow text
- [ ] Focus rings are 3px solid yellow on all interactive elements

---

## 3. WCAG Contrast Ratio Tests

Use a tool like https://webaim.org/resources/contrastchecker/

| Mode  | Text      | Background | Expected Ratio | Pass Level |
| ----- | --------- | ---------- | -------------- | ---------- |
| Light | `#1A1527` | `#F8F7FF`  | ≥ 13.5:1       | AA ✓       |
| Light | `#3D2D6B` | `#F8F7FF`  | ≥ 7.8:1        | AA ✓       |
| Light | `#6D28D9` | `#F8F7FF`  | ≥ 7.0:1        | AA ✓       |
| Dark  | `#EDE8FA` | `#0c0c0c`  | ≥ 15:1         | AAA ✓      |
| Dark  | `#A78BFA` | `#0c0c0c`  | ≥ 7.5:1        | AA ✓       |
| Sepia | `#2C1A0E` | `#F4ECD6`  | ≥ 11.8:1       | AA ✓       |
| Sepia | `#7C3A10` | `#F4ECD6`  | ≥ 5.5:1        | AA ✓       |
| HC    | `#FFFFFF` | `#000000`  | 21:1           | AAA ✓      |
| HC    | `#FFFF00` | `#000000`  | ≥ 19.5:1       | AAA ✓      |

---

## 4. Accessibility Tests

### Keyboard Navigation

- [ ] Tab to ThemeToggle trigger button
- [ ] Enter/Space opens popover
- [ ] Arrow Down/Up moves focus between menu items
- [ ] Enter/Space on focused item applies theme and closes popover
- [ ] Escape closes popover and returns focus to trigger
- [ ] Tab from last item closes popover (focus leaves)

### Screen Reader (NVDA/VoiceOver)

- [ ] Trigger announces: "Theme: [current mode]. Click to change."
- [ ] Button states `aria-haspopup="menu"` and `aria-expanded="true/false"`
- [ ] Menu is announced as "Reading Mode" menu
- [ ] Each option announces its label + description
- [ ] Active option announces `aria-checked="true"`
- [ ] Mode change is detectable (color change communicated through label update)

---

## 5. FOUC (Flash of Unstyled Content) Tests

- [ ] Hard refresh in Light mode → no flash of dark background before paint
- [ ] Hard refresh in Dark mode → no flash of light background
- [ ] Hard refresh in Sepia mode → no flash of dark/light background before sepia paints
- [ ] Hard refresh in High-Contrast mode → no flash of colored background
- [ ] Open browser DevTools → Network → throttle to Slow 3G → no extended flash
- [ ] Disable JavaScript → site falls back to system/dark theme gracefully

---

## 6. Cross-Browser Tests

- [ ] Chrome (latest) — all 5 modes
- [ ] Firefox (latest) — all 5 modes
- [ ] Safari (latest) — CSS variables + popover positioning
- [ ] Edge (latest) — all 5 modes
- [ ] Mobile Safari (iOS) — popover appears correctly, touch targets ≥ 48px
- [ ] Chrome Android — all 5 modes

---

## 7. Layout Regression Tests

- [ ] Homepage sections unchanged in all modes (spacing, typography scale)
- [ ] Docs module pages readable in all modes
- [ ] Navbar layout unchanged (toggle fits without overflow)
- [ ] Footer layout unchanged in all modes
- [ ] Chatbot panel adapts to all modes
- [ ] Code syntax highlighting visible in all modes (check Prism theme)

---

## 8. Future Mode Scalability Check

To confirm the architecture is ready for Sepia v2 / Dim / Nord modes:

- [ ] Add a new entry to `THEME_MODES` array in `src/lib/theme/index.ts`
- [ ] Add `[data-color-theme='new-mode'] { ... }` block to `variables.css`
- [ ] Add the `localStorage` key to the FOUC script in `docusaurus.config.js`
- [ ] Confirm new mode appears automatically in `ThemeToggle` popover
