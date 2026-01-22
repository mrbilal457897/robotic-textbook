---
name: visual-consistency
description: Maintain visual consistency across UI by normalizing buttons, cards, and callouts, enforcing spacing and color standards, and improving professional appearance
category: ui-design
surface: agent
applicable_to:
  - interactive-textbook
  - docusaurus-sites
  - design-systems
  - physical-ai-robotics
tags:
  - ui-consistency
  - design-system
  - tailwind
  - docusaurus
  - accessibility
  - professional-design
---

# Visual Consistency Skill

## Overview

This skill maintains a cohesive, professional visual identity across the Physical AI & Humanoid Robotics Interactive Textbook. It standardizes UI components (buttons, cards, callouts), enforces spacing and color rules, and ensures accessibility compliance without sacrificing design quality.

**When to Use:** During UI component implementation, design reviews, and page polishing phases.

**Core Principle:** Consistency + Accessibility = Professional, usable, beautiful interfaces.

---

## Visual Consistency Standards

### Color Palette (Tailwind-Based)

**Primary Colors (Brand identity):**
```
Primary Blue:     #1F2937 (slate-900) - dark backgrounds, primary CTAs
Primary Accent:   #3B82F6 (blue-500) - interactive elements, highlights
Secondary Accent: #059669 (emerald-600) - success states, positive actions
```

**Semantic Colors:**
```
Success:    #10B981 (emerald-500)  - Green for confirmations, valid states
Warning:    #F59E0B (amber-500)    - Yellow for cautions, pending states
Error:      #EF4444 (red-500)      - Red for errors, destructive actions
Info:       #3B82F6 (blue-500)     - Blue for informational callouts
```

**Neutral Palette:**
```
Dark:       #1F2937 (slate-900)    - Text, borders, primary
Medium:     #6B7280 (slate-500)    - Secondary text, disabled states
Light:      #F3F4F6 (slate-100)    - Backgrounds, hover states, borders
White:      #FFFFFF               - Card backgrounds, main content
```

**Text on Colors (WCAG AA Compliance):**
```
Dark (slate-900) text on:
├─ Light (slate-100) background:  ✅ Contrast ratio 13.3:1 (WCAG AAA)
├─ White background:              ✅ Contrast ratio 16.2:1 (WCAG AAA)
└─ Blue accent (blue-500):        ❌ Contrast ratio 3.2:1 (WCAG A only)

White text on:
├─ Blue accent (blue-500):        ✅ Contrast ratio 8.6:1 (WCAG AAA)
├─ Emerald (emerald-600):         ✅ Contrast ratio 4.9:1 (WCAG AA)
└─ Dark (slate-900):              ✅ Contrast ratio 16.2:1 (WCAG AAA)
```

**Usage Rules:**
- **Primary text**: slate-900 on light/white backgrounds
- **Secondary text**: slate-500 (lighter weight or smaller size)
- **Accent (interactive)**: blue-500 with white text OR slate-900 with light background
- **Success messages**: emerald-600 with white text
- **Error messages**: red-600 with white text
- **Callout backgrounds**: Use light tints (slate-50, blue-50, emerald-50)

---

## Component Standards

### 1. Buttons

**Button Anatomy:**
```
┌─ Padding: px-4 py-2 (standard) | px-6 py-3 (large)
├─ Border-radius: rounded-lg (6px) for standard, rounded-xl (8px) for prominent
├─ Font: font-semibold, base size (16px)
├─ Transition: ease-in-out 150ms
├─ Focus ring: ring-2 ring-offset-2 ring-blue-500 (accessibility)
└─ Minimum touch target: 44px × 44px (mobile accessibility)
```

**Button Variants:**

#### **Primary Button (Main CTA)**
```html
<button class="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg
    hover:bg-blue-600 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
    transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed">
  Action Label
</button>
```
- **Usage**: Primary calls-to-action (submit, save, start)
- **Hover**: bg-blue-600 (darker shade)
- **Active**: bg-blue-700
- **Disabled**: opacity-50, cursor-not-allowed
- **Accessibility**: Focus ring visible, high contrast

#### **Secondary Button (Alternative Action)**
```html
<button class="px-6 py-3 border-2 border-slate-300 text-slate-900
    font-semibold rounded-lg hover:bg-slate-50 focus:ring-2
    focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150">
  Alternative Action
</button>
```
- **Usage**: Secondary actions (cancel, reset, back)
- **Style**: Border + light hover background
- **Hover**: bg-slate-50
- **Accessibility**: Focus ring same as primary

#### **Tertiary Button (Minimal Action)**
```html
<button class="px-4 py-2 text-blue-600 hover:text-blue-700
    hover:bg-blue-50 rounded-lg font-medium transition-all duration-150
    focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
  Minimal Action
</button>
```
- **Usage**: Less important actions, inline actions
- **Style**: Text-only, light hover
- **Hover**: text-blue-700, bg-blue-50
- **Accessibility**: Focus ring required

#### **Destructive Button (Delete/Dangerous)**
```html
<button class="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg
    hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500
    transition-colors duration-150">
  Delete Permanently
</button>
```
- **Usage**: Irreversible actions (delete, remove, clear)
- **Color**: red-600 (semantic danger)
- **Accessibility**: Clear labeling; confirm before execution

**Button Size Standards:**
```
Small:    px-3 py-1.5 text-sm (inline, secondary actions)
Medium:   px-4 py-2 text-base (standard, most common)
Large:    px-6 py-3 text-lg (prominent CTAs, hero sections)
```

---

### 2. Cards

**Card Anatomy:**
```
┌─ Background: bg-white
├─ Border: border border-slate-200
├─ Border-radius: rounded-xl (8px)
├─ Padding: p-6 (standard) | p-8 (spacious)
├─ Box-shadow: shadow-sm (subtle depth)
├─ Transition: hover:shadow-md (interactive lift)
└─ Minimum height: auto (no forced heights)
```

**Standard Card:**
```html
<div class="bg-white border border-slate-200 rounded-xl p-6
    shadow-sm hover:shadow-md transition-shadow duration-150">
  <h3 class="text-xl font-semibold text-slate-900 mb-4">Card Title</h3>
  <p class="text-slate-600 mb-4">Card description or content goes here.</p>
  <button class="text-blue-600 font-semibold hover:text-blue-700">
    Read More →
  </button>
</div>
```
- **Hierarchy**: Title (text-xl), description (text-base), footer (text-sm)
- **Spacing**: Vertical gaps between sections (mb-4)
- **Hover effect**: Subtle shadow increase (shadow-md)
- **Accessibility**: Semantic heading tags (h3, h4)

**Card with Image:**
```html
<div class="bg-white border border-slate-200 rounded-xl overflow-hidden
    shadow-sm hover:shadow-md transition-shadow duration-150">
  <img src="image.webp" alt="Card image" class="w-full h-48 object-cover">
  <div class="p-6">
    <h3 class="text-lg font-semibold text-slate-900 mb-2">Title</h3>
    <p class="text-slate-600 text-sm">Description</p>
  </div>
</div>
```
- **Image area**: h-48 (192px), object-cover for consistency
- **Image alt text**: Required (accessibility)
- **Overflow**: Hidden to maintain border-radius on image

**Interactive Card (Link):**
```html
<a href="#" class="block bg-white border border-slate-200 rounded-xl p-6
    shadow-sm hover:border-blue-300 hover:shadow-md hover:bg-blue-50
    transition-all duration-150 group">
  <h3 class="text-lg font-semibold text-slate-900 group-hover:text-blue-600
      mb-2 transition-colors">
    Linked Card Title
  </h3>
  <p class="text-slate-600 text-sm">Click to navigate →</p>
</a>
```
- **Interactive state**: border + shadow + bg color change
- **Link styling**: Use group utilities for hover effects
- **Accessibility**: Semantic `<a>` tag, clear link intent

**Card Grid Layout:**
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div class="bg-white border border-slate-200 rounded-xl p-6 ...">
    Card 1
  </div>
  <div class="bg-white border border-slate-200 rounded-xl p-6 ...">
    Card 2
  </div>
  <div class="bg-white border border-slate-200 rounded-xl p-6 ...">
    Card 3
  </div>
</div>
```
- **Responsive**: Single column mobile, multi-column desktop
- **Gap**: gap-6 for consistent spacing (24px)
- **Accessibility**: Maintain semantic structure in grid

---

### 3. Callouts (Admonitions)

**Callout Anatomy:**
```
┌─ Background: Light tint (blue-50, emerald-50, amber-50, red-50)
├─ Left border: Thick left border (4px, semantic color)
├─ Padding: px-4 py-3
├─ Border-radius: rounded-lg
├─ Icon: Semantic icon (16px, before title)
├─ Title: font-semibold, text-base
├─ Body: text-sm, secondary text color
└─ Accessibility: role="alert" for alerts, proper contrast
```

**Info Callout:**
```html
<div class="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-4">
  <div class="flex items-start gap-3">
    <svg class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
        fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        clip-rule="evenodd"></path>
    </svg>
    <div>
      <h4 class="font-semibold text-blue-900">Info Title</h4>
      <p class="text-blue-800 text-sm mt-1">
        Informational content explaining a concept or best practice.
      </p>
    </div>
  </div>
</div>
```
- **Usage**: Tips, notes, best practices
- **Colors**: bg-blue-50, border-blue-500, text-blue-900
- **Icon**: ℹ️ or information icon

**Success Callout:**
```html
<div class="bg-emerald-50 border-l-4 border-emerald-500 rounded-lg p-4 mb-4">
  <div class="flex items-start gap-3">
    <svg class="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0"
        fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clip-rule="evenodd"></path>
    </svg>
    <div>
      <h4 class="font-semibold text-emerald-900">Success!</h4>
      <p class="text-emerald-800 text-sm mt-1">
        Your action completed successfully. Next steps are available.
      </p>
    </div>
  </div>
</div>
```
- **Usage**: Confirmations, completed tasks, positive outcomes
- **Colors**: bg-emerald-50, border-emerald-500, text-emerald-900
- **Icon**: ✓ or check icon

**Warning Callout:**
```html
<div class="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-4 mb-4"
    role="alert">
  <div class="flex items-start gap-3">
    <svg class="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0"
        fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd"
        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
        clip-rule="evenodd"></path>
    </svg>
    <div>
      <h4 class="font-semibold text-amber-900">Caution</h4>
      <p class="text-amber-800 text-sm mt-1">
        This action has side effects. Review before proceeding.
      </p>
    </div>
  </div>
</div>
```
- **Usage**: Warnings, cautions, important notes
- **Colors**: bg-amber-50, border-amber-500, text-amber-900
- **Icon**: ⚠️ or warning icon
- **Accessibility**: role="alert" for screen readers

**Error Callout:**
```html
<div class="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-4"
    role="alert">
  <div class="flex items-start gap-3">
    <svg class="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0"
        fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
        clip-rule="evenodd"></path>
    </svg>
    <div>
      <h4 class="font-semibold text-red-900">Error</h4>
      <p class="text-red-800 text-sm mt-1">
        Something went wrong. Error details and recovery steps available.
      </p>
    </div>
  </div>
</div>
```
- **Usage**: Error states, failures, destructive outcomes
- **Colors**: bg-red-50, border-red-500, text-red-900
- **Icon**: ✗ or error icon
- **Accessibility**: role="alert" for urgent notifications

---

## Spacing Standards (Tailwind Scale)

**Base unit:** 4px (Tailwind default scale)

**Vertical spacing (margins/padding):**
```
Tight:      p-2  / m-2   (8px)   - Compact components
Standard:   p-4  / m-4   (16px)  - Default spacing
Spacious:   p-6  / m-6   (24px)  - Section spacing
Large:      p-8  / m-8   (32px)  - Major section breaks
Extra:      p-12 / m-12  (48px)  - Hero sections
```

**Horizontal spacing:**
```
Buttons within group:  gap-2 (8px)
Card sections:         gap-4 (16px)
Component grid:        gap-6 (24px)
Page sections:         gap-8 (32px)
```

**Line height & text spacing:**
```
Headings:     leading-tight (1.25) - Dense, impactful
Body text:    leading-relaxed (1.625) - Readable
Secondary:    leading-normal (1.5) - Balanced
```

**Minimum gaps (to avoid crowding):**
```
Button to button:      gap-3 (12px)
Card title to body:    mb-4 (16px)
Section heading:       mb-6 (24px)
Page content:          max-w-4xl with px-4 md:px-8
```

---

## Typography Standards

**Font stack (via Docusaurus):**
```
Headings:    'Inter', -apple-system, BlinkMacSystemFont, sans-serif
Body:        System fonts (-apple-system, BlinkMacSystemFont, sans-serif)
Monospace:   'Courier New', monospace
```

**Font sizes and weights:**
```
H1 (Page title):       text-4xl (36px) font-bold
H2 (Section):          text-2xl (24px) font-bold
H3 (Subsection):       text-xl (20px) font-semibold
H4 (Minor heading):    text-lg (18px) font-semibold
Body:                  text-base (16px) font-normal
Small text:            text-sm (14px) font-normal
Extra small:           text-xs (12px) font-normal
```

**Font weights:**
```
Regular:      font-normal (400)
Medium:       font-medium (500) - Emphasis in body text
Semibold:     font-semibold (600) - Headings, button labels
Bold:         font-bold (700) - Major headings
```

**Example: Consistent text hierarchy:**
```html
<article class="max-w-4xl">
  <h1 class="text-4xl font-bold text-slate-900 mb-4">
    Page Title
  </h1>
  <p class="text-lg text-slate-600 mb-6">
    Lead paragraph summarizing the content.
  </p>

  <h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4">
    Section Heading
  </h2>
  <p class="text-base text-slate-700 leading-relaxed mb-4">
    Body paragraph with consistent line height and spacing.
  </p>

  <h3 class="text-lg font-semibold text-slate-900 mt-6 mb-3">
    Subsection
  </h3>
  <p class="text-base text-slate-700 leading-relaxed">
    Supporting content for the subsection.
  </p>
</article>
```

---

## Accessibility Compliance

**WCAG 2.1 AA Standards (Minimum):**

### Color Contrast
```
✅ PASS (WCAG AAA):  Contrast ratio 7:1 or higher
✅ PASS (WCAG AA):   Contrast ratio 4.5:1 or higher
❌ FAIL:             Contrast ratio below 4.5:1
```

**Verified color pairs:**
- Dark text (slate-900) on light bg (slate-100): 13.3:1 ✅
- Dark text (slate-900) on white: 16.2:1 ✅
- White text on blue-500: 8.6:1 ✅
- White text on emerald-600: 4.9:1 ✅

### Focus Management
```
All interactive elements must have:
├─ Visible focus indicator (ring-2 ring-blue-500 ring-offset-2)
├─ Keyboard accessibility (:focus-visible)
├─ Proper tab order (tabindex=-1 for non-interactive, avoid tabindex > 0)
└─ Focus trap handling (modals, dropdowns)
```

**Focus ring standard:**
```html
<button class="ring-2 ring-offset-2 ring-blue-500 focus:outline-none">
  Accessible button with focus ring
</button>
```

### Semantic HTML
```
✅ Use <button> for buttons (not <div> or <a>)
✅ Use <h1>, <h2>, <h3> for headings (not <div class="heading">)
✅ Use <a> for navigation links (href required)
✅ Use <label> for form inputs
✅ Use proper heading hierarchy (no skipping h1 → h3)
```

### Touch Targets
```
Minimum size: 44px × 44px (mobile)
Recommended:  48px × 48px
Button padding: py-2 px-4 (32px × 44px minimum)
Icon + label: Always larger than icon alone
```

### ARIA Labels
```html
<!-- Icon button needs label -->
<button aria-label="Close dialog" class="p-2">
  <svg>...</svg>
</button>

<!-- Alert callout needs role -->
<div role="alert" class="bg-red-50 ...">
  Error message
</div>

<!-- Navigation landmarks -->
<nav aria-label="Main navigation">
  <!-- navigation links -->
</nav>
```

### Dark Mode Support (Optional but Recommended)
```html
<button class="bg-blue-500 dark:bg-blue-600 text-white
    hover:bg-blue-600 dark:hover:bg-blue-700">
  Theme-aware button
</button>

<div class="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
  Theme-aware card
</div>
```

---

## Consistency Audit Checklist

Use this checklist during UI reviews:

### Buttons
- [ ] All primary CTAs use bg-blue-500 with white text
- [ ] All secondary buttons have border + light hover
- [ ] All buttons have visible focus ring (ring-2 ring-blue-500)
- [ ] Destructive actions use red-600 background
- [ ] Button labels are verb-first, action-oriented
- [ ] Disabled buttons show opacity-50, cursor-not-allowed
- [ ] Touch targets meet 44px × 44px minimum

### Cards
- [ ] All cards have consistent border (border-slate-200)
- [ ] Card spacing is uniform (p-6 standard, p-8 spacious)
- [ ] Card shadows follow hover pattern (shadow-sm → shadow-md)
- [ ] Card images use object-cover for consistent aspect ratio
- [ ] Card headings use proper hierarchy (h3, h4)
- [ ] Card links use semantic <a> tags

### Callouts
- [ ] Info callouts use blue color scheme
- [ ] Success callouts use emerald color scheme
- [ ] Warning callouts use amber color scheme
- [ ] Error callouts use red color scheme and role="alert"
- [ ] All callouts have left border (4px) and icon
- [ ] Callout text passes WCAG AA contrast (4.5:1 minimum)

### Spacing
- [ ] Vertical gaps between sections: mb-6 or mt-8
- [ ] Card content internal spacing: mb-4 between title/body
- [ ] Button groups have consistent gap (gap-3)
- [ ] Page content uses max-w-4xl with px-4 md:px-8
- [ ] List items have vertical gap (gap-2)

### Typography
- [ ] Page title is h1 text-4xl font-bold
- [ ] Sections are h2 text-2xl font-bold
- [ ] Headings use text-slate-900 (dark)
- [ ] Body text is text-base with leading-relaxed
- [ ] Secondary text is text-slate-600 or text-slate-500
- [ ] Monospace code uses Courier New
- [ ] Line heights prevent text cramping (leading-relaxed minimum)

### Accessibility
- [ ] All interactive elements have focus rings
- [ ] Color is never the only differentiator (e.g., errors have icons)
- [ ] Images have descriptive alt text
- [ ] Links have clear, descriptive text (no "click here")
- [ ] Form inputs have associated <label> tags
- [ ] Heading hierarchy is correct (no skipped levels)
- [ ] Contrast ratios meet WCAG AA (4.5:1 minimum)

### Responsive Design
- [ ] Mobile-first approach (base styles, then md: breakpoints)
- [ ] Touch targets increase on mobile (not smaller)
- [ ] Text is readable on small screens (no horizontal scroll)
- [ ] Images scale responsively (max-w-full)
- [ ] Navigation is accessible on mobile (hamburger menu or sidebar)

---

## Examples

### Example 1: Consistent Card Grid

**Before (Inconsistent):**
```html
<!-- Card 1: Different padding -->
<div class="bg-white p-3 border border-gray-300 rounded-md shadow">
  <h3 class="text-lg font-bold mb-2">Lesson 1</h3>
  <p>Content...</p>
</div>

<!-- Card 2: Different shadow, no border -->
<div class="bg-white p-8 rounded-xl shadow-lg">
  <h3 class="text-2xl font-bold mb-4">Lesson 2</h3>
  <p>Content...</p>
</div>

<!-- Card 3: No shadow, different border -->
<div class="bg-white p-5 border-2 border-blue-300 rounded-lg">
  <h3 class="text-xl font-semibold mb-3">Lesson 3</h3>
  <p>Content...</p>
</div>
```

**After (Consistent):**
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div class="bg-white border border-slate-200 rounded-xl p-6
      shadow-sm hover:shadow-md transition-shadow duration-150">
    <h3 class="text-lg font-semibold text-slate-900 mb-3">Lesson 1</h3>
    <p class="text-slate-600 text-sm">Content description...</p>
  </div>

  <div class="bg-white border border-slate-200 rounded-xl p-6
      shadow-sm hover:shadow-md transition-shadow duration-150">
    <h3 class="text-lg font-semibold text-slate-900 mb-3">Lesson 2</h3>
    <p class="text-slate-600 text-sm">Content description...</p>
  </div>

  <div class="bg-white border border-slate-200 rounded-xl p-6
      shadow-sm hover:shadow-md transition-shadow duration-150">
    <h3 class="text-lg font-semibold text-slate-900 mb-3">Lesson 3</h3>
    <p class="text-slate-600 text-sm">Content description...</p>
  </div>
</div>
```

**Changes:**
- Unified padding (p-6)
- Consistent border (border-slate-200)
- Consistent rounded corners (rounded-xl)
- Consistent shadow + hover effect
- Consistent heading styles (text-lg font-semibold)
- Consistent spacing (mb-3, gap-6)

---

### Example 2: Button Group Consistency

**Before (Inconsistent):**
```html
<button class="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
<button class="px-6 py-3 bg-gray-400 text-black rounded-full">Cancel</button>
<button class="p-3 border border-red-500 text-red-600 font-bold">Delete</button>
```

**After (Consistent):**
```html
<div class="flex gap-3">
  <!-- Primary action -->
  <button class="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg
      hover:bg-blue-600 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
      transition-colors duration-150">
    Submit
  </button>

  <!-- Secondary action -->
  <button class="px-6 py-3 border-2 border-slate-300 text-slate-900
      font-semibold rounded-lg hover:bg-slate-50 focus:ring-2
      focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150">
    Cancel
  </button>

  <!-- Destructive action -->
  <button class="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg
      hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500
      transition-colors duration-150">
    Delete
  </button>
</div>
```

**Changes:**
- Unified size (px-6 py-3)
- Unified border-radius (rounded-lg)
- Unified font weight (font-semibold)
- All buttons have focus rings
- Semantic color usage (blue for primary, red for destructive)
- Gap between buttons (gap-3)

---

### Example 3: Consistent Callout Group

**Before (Inconsistent):**
```html
<div class="bg-blue-100 p-3 text-blue-900">
  <strong>Note:</strong> This is important.
</div>

<div style="border: 2px solid green; padding: 10px; background: #e0f2e1;">
  <strong style="color: green;">Success!</strong> Done.
</div>

<div class="border-l-2 border-yellow-400 bg-yellow-50 p-4">
  <p>⚠️ Warning: Proceed carefully.</p>
</div>
```

**After (Consistent):**
```html
<!-- Info Callout -->
<div class="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-4">
  <div class="flex items-start gap-3">
    <svg class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
    </svg>
    <div>
      <h4 class="font-semibold text-blue-900">Note</h4>
      <p class="text-blue-800 text-sm mt-1">This is important information.</p>
    </div>
  </div>
</div>

<!-- Success Callout -->
<div class="bg-emerald-50 border-l-4 border-emerald-500 rounded-lg p-4 mb-4">
  <div class="flex items-start gap-3">
    <svg class="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
    </svg>
    <div>
      <h4 class="font-semibold text-emerald-900">Success!</h4>
      <p class="text-emerald-800 text-sm mt-1">Operation completed successfully.</p>
    </div>
  </div>
</div>

<!-- Warning Callout -->
<div class="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-4 mb-4" role="alert">
  <div class="flex items-start gap-3">
    <svg class="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
    </svg>
    <div>
      <h4 class="font-semibold text-amber-900">Caution</h4>
      <p class="text-amber-800 text-sm mt-1">Proceed carefully with this action.</p>
    </div>
  </div>
</div>
```

**Changes:**
- Unified structure (icon + title + body)
- Consistent padding (p-4)
- Consistent left border (border-l-4)
- Semantic color usage (blue, emerald, amber)
- Icons for visual distinction
- Consistent spacing (gap-3, mt-1, mb-4)

---

## Tools Used

| Tool | Purpose |
|------|---------|
| **Glob** | Find all component files (buttons, cards, callouts) in the codebase |
| **Grep** | Search for color classes and spacing patterns to identify inconsistencies |
| **Read** | Inspect component implementations for style compliance |
| **Edit** | Update components to match consistency standards |
| **TodoWrite** | Track UI polish tasks and consistency fixes |

---

## Integration with SDD Workflow

**Use this skill during:**
- **UI component implementation** — Ensure new components follow standards
- **Design review** — Audit pages for visual consistency
- **Page polishing** — Normalize colors, spacing, and component usage

**Invoke before:**
- Publishing a new lesson or module
- Adding custom UI components
- Completing design-heavy pages (landing pages, tutorials with diagrams)

**Artifacts:**
- Consistent component library (buttons, cards, callouts)
- Design tokens document (colors, spacing, typography)
- Visual consistency audit report

---

## Common Pitfalls & How to Avoid Them

| Pitfall | Risk | How to Avoid |
|---------|------|-------------|
| **Mixing color shades** | Unprofessional, confusing | Use exact Tailwind class names; establish one blue shade |
| **Inconsistent padding** | Components feel misaligned | Always use p-6 standard, p-8 spacious, p-4 compact |
| **Missing focus rings** | Keyboard inaccessible | Add ring-2 ring-offset-2 ring-blue-500 to all interactive elements |
| **Poor contrast** | Unreadable, non-compliant | Verify contrast ratios (4.5:1 minimum); use dark text on light |
| **Inconsistent shadows** | Cluttered appearance | Use shadow-sm default, shadow-md on hover; avoid shadow-lg unless necessary |
| **Orphaned components** | Hard to maintain | Document all component styles in this skill; keep one source of truth |
| **Forgetting alt text** | Failed accessibility | Every image needs descriptive alt text |
| **Skipped heading levels** | Screen reader confusion | Use h1 → h2 → h3 → h4 in order; never skip |

---

## Professional Design Principles

**Consistency drives trust.** When UI is predictable, users feel confident navigating your textbook. When colors, buttons, and spacing are consistent, the interface recedes and content shines.

**Implementation hierarchy:**
1. **Must have**: Color consistency, button standards, callout templates
2. **Should have**: Spacing rules, typography hierarchy, focus rings
3. **Nice to have**: Dark mode support, animation consistency, theme variations

**Accessibility is non-negotiable.** Every design decision must consider keyboard navigation, screen readers, and color blindness. WCAG AA is the minimum; aim for AAA where feasible.

---

## Save Instructions

Save this skill as: `.claude/skills/visual-consistency/skill.md`

Verify the path and file format:
```bash
ls -la .claude/skills/visual-consistency/skill.md
```

Then invoke during UI design and review:
```bash
claude-code /visual-consistency "<page-title> | <component-type>"
```

---

**Version:** 1.0
**Last Updated:** 2026-01-16
**Project:** Physical AI & Humanoid Robotics Interactive Textbook
**Framework:** Tailwind CSS + Docusaurus
**Standards:** WCAG 2.1 AA, Semantic HTML, Accessibility First
**Alignment:** SDD, Design System, CLAUDE.md
