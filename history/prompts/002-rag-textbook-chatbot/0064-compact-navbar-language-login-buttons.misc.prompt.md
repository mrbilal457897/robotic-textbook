---
id: '0064'
title: Compact Navbar Language and Login Buttons
stage: misc
date: 2026-02-19
surface: agent
model: claude-sonnet-4-5-20250929
feature: 002-rag-textbook-chatbot
branch: 002-rag-textbook-chatbot
user: architect
command: convert language selector and login button to smart compact size and style in navbar
labels:
  [
    'ui',
    'navbar',
    'language-selector',
    'login-button',
    'sizing',
    'velvet-cosmos',
    'violet',
    'accessibility',
  ]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - src/components/LanguageSelector/styles.module.css
  - src/components/Auth/styles.module.css
tests:
  - Manual: verify LanguageSelector button height matches ThemeToggle (~30px)
  - Manual: verify LoginButton height matches ThemeToggle (~30px)
  - Manual: verify no cyan colors remain in both components
  - Manual: verify hover states use violet (amethyst) palette
  - Manual: verify dropdown panels use correct bg-card variable
---

## Prompt

In navbar language selector icon and login with github button has too much size convert both into smart size and style

## Response snapshot

**Root cause:** Both components used oversized padding and old cyan color palette:

- `LanguageSelector .selectorButton`: `padding: 0.5rem 1rem` (8×16px), `color: #00f0ff` (cyan)
- `LoginButton .loginButton`: `padding: 0.75rem 1.5rem` (12×24px) — CTA-sized, gradient cyan background

**Reference:** ThemeToggle trigger uses `padding: 6px 10px` with `rgba(167,139,250,...)` violet palette.

**Changes — `src/components/LanguageSelector/styles.module.css`:**

- `.selectorButton`: `padding: 6px 10px`, `border-radius: 999px` (pill), `font-size: 0.8rem`, violet colors
- `.flag`: `font-size: 1rem` (was 1.2rem)
- `.languageName`: `font-size: 0.8rem` explicit
- `.chevron`: `font-size: 0.65rem`, `opacity: 0.7`
- `.dropdown`: uses `var(--bg-card)`, violet border, `border-radius: 12px`
- `.languageOption`: `padding: 0.55rem 0.85rem`, `font-size: 0.85rem`, violet hover/active
- `.checkmark`: `color: #A78BFA` (was cyan), `font-size: 0.85rem`

**Changes — `src/components/Auth/styles.module.css`:**

- `.loginButton`: `padding: 6px 12px`, pill shape, ghost violet style (was gradient cyan CTA)
- `.loginButton svg`: `14×14px` (was 18×18px)
- `.profileButton`: `padding: 3px`, violet border (was cyan)
- `.profileAvatar`: `28×28px` (was 36×36px), violet border
- `.profileDropdown`: uses `var(--bg-card)`, violet border, `border-radius: 12px`, `top: calc(100% + 8px)`
- `.dropdownItem`: `padding: 0.75rem 0.85rem`, violet border-bottom
- `.username`: `color: #A78BFA` (was cyan)
- `.dropdownLink/.dropdownButton`: `padding: 0.6rem 0.85rem`, `font-size: 0.85rem`, violet hover

## Outcome

- ✅ Impact: Both navbar buttons are now compact and visually consistent with ThemeToggle and the Velvet Cosmos violet design system
- 🧪 Tests: Manual visual verification required
- 📁 Files: 2 CSS files modified
- 🔁 Next: Audit remaining components for residual cyan colors; wire ThemeToggle into mobile menu
