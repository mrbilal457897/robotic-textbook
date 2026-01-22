---
name: ui-buttons
description: Create consistent buttons and CTAs for the Physical AI & Humanoid Robotics Interactive Textbook. Design primary, secondary, and ghost buttons with hover, active, and disabled states, loading indicators, and full keyboard accessibility using Tailwind CSS without external JS frameworks.
---

# Button & CTA Design Skill

## Overview

This skill provides a comprehensive system for designing and implementing consistent, accessible button and Call-to-Action (CTA) components across the Physical AI & Humanoid Robotics Interactive Textbook. Buttons are critical interaction elements that guide users through navigation, form submission, and feature exploration. This skill ensures all buttons follow the "Neural Circuitry Futurism" design theme, maintain accessibility standards, and provide clear visual feedback for all interactive states.

## When to Use This Skill

- Adding action buttons to hero sections or module cards
- Creating form submission buttons (quizzes, login forms)
- Designing navigation CTAs (Next, Previous, Start Learning)
- Building call-to-action sections (Download, Subscribe, Enroll)
- Implementing dialog/modal action buttons
- Creating floating action buttons or icon buttons
- When you need consistent button styling across pages
- When buttons require loading states or disabled states
- When designing accessible navigation elements

## Step-by-Step Instructions

### 1. Button Purpose & Context Definition

Before designing a button, clarify its purpose:

- **Action Type**: Primary action (main goal), secondary action (alternative), tertiary (minimal)
- **Context**: Where does it live? (hero, card, form, footer, sticky footer, etc.)
- **User Goal**: What happens on click? (navigate, submit, open modal, download, etc.)
- **Priority**: Is this the main action or supporting action on the page/section?
- **Frequency**: Will users click this often? (affects visual prominence)

**Decision Matrix**:
- Main action, primary goal → **Primary Button**
- Alternative action, secondary importance → **Secondary Button**
- Less important, minimal visual weight → **Ghost Button**

### 2. Visual Hierarchy & Prominence

Establish button prominence based on importance:

- **Primary Button**: Bold, eye-catching, immediately visible
  - Use primary color (#00F0FF Electric Cyan or #FF6B35 Plasma Orange)
  - Full background fill
  - Largest visual weight

- **Secondary Button**: Clear but less prominent
  - Border outline with primary color
  - Transparent or light background
  - Medium visual weight

- **Ghost Button**: Minimal, unobtrusive
  - Text-only with color as the only indicator
  - No background or border
  - Smallest visual weight

### 3. Button Structure & Content

Define what goes inside the button:

- **Text Label**: Short, action-oriented (Start, Download, Explore, Next)
- **Icon**: Optional, placed before or after text (→, ↓, 📚, etc.)
- **Badge/Counter**: Optional, for notifications (3 pending tasks, etc.)
- **Loading Indicator**: Shows during async operations
- **Tooltip**: Optional, for context or keyboard shortcut hints

Keep labels concise: 1–3 words maximum for clarity.

### 4. Size & Dimension Planning

Choose appropriate button sizes:

- **Small**: 8px×32px padding, 12px font (secondary actions, inline buttons)
- **Medium**: 12px×24px padding, 14px font (standard, most common)
- **Large**: 16px×32px padding, 16px font (primary CTAs, hero sections)

Mobile: Ensure touch targets are ≥ 44px (height + width).

### 5. Interactive States Implementation

Implement all 6 interactive states with clear visual feedback:

1. **Default**: Base styling, ready for interaction
2. **Hover**: Highlight on mouse over (scale 1.05, shadow elevation, color shift)
3. **Focus**: Keyboard focus visible (focus ring, outline)
4. **Active**: Press-down effect (scale 0.98, darker color)
5. **Disabled**: Reduced opacity (50%), cursor-not-allowed, no hover effects
6. **Loading**: Spinner animation, text hidden or "Loading..."

All transitions: **0.2–0.3s ease-in-out** (smooth, responsive feedback).

### 6. Light & Dark Mode Theming

Ensure buttons adapt to both themes:

**Light Mode**:
- Primary Button: #00F0FF background, dark text
- Secondary Button: #00F0FF border, dark text
- Ghost Button: #00F0FF text

**Dark Mode**:
- Primary Button: #00F0FF background, dark text (high contrast)
- Secondary Button: #00F0FF border, #E8EDF3 text
- Ghost Button: #00F0FF text

Test contrast ratios: minimum 4.5:1 for text on button backgrounds (WCAG AA).

### 7. Keyboard & Accessibility

Implement full keyboard navigation:

- **Focus Indicator**: Visible outline or ring (never remove)
- **Tab Navigation**: Logical tab order (use semantic HTML, no tabindex hacks)
- **Enter/Space Activation**: Both keys activate buttons (`<button>` tag)
- **Disabled State**: Keyboard users cannot focus disabled buttons
- **ARIA Labels**: Add `aria-label` or `aria-labelledby` if needed
- **Loading State**: Add `aria-busy="true"` during async operations
- **Icons**: If button contains only an icon, add `aria-label` describing the action

### 8. Loading States & Async Feedback

For buttons that trigger async operations:

- Disable button immediately on click (prevent double-submission)
- Show loading spinner or text ("Loading...", "Saving...")
- Add `aria-busy="true"` to announce state to screen readers
- Disable all user interaction during loading
- Show success/error feedback after completion (optional toast)
- Re-enable button on completion
- Timeout protection: Auto-re-enable after 30 seconds if no response

### 9. Icon Usage & Spacing

When including icons in buttons:

- Icon size: Match button font size + 2–4px
- Spacing: 8px gap between icon and text
- Icon position: Before text for forward actions (→), after text for secondary info
- Icon-only buttons: Must have `aria-label` describing action
- SVG icons: Set `aria-hidden="true"` if text label exists

### 10. Integration & Testing

Before deployment, validate buttons:

- **Cross-browser**: Chrome, Firefox, Safari, Edge
- **Keyboard Navigation**: Tab through all buttons, test Enter/Space
- **Screen Reader**: NVDA/JAWS on Windows, VoiceOver on macOS
- **Responsive**: Test on mobile (touch), tablet, desktop
- **Color Contrast**: axe DevTools, Lighthouse (4.5:1 minimum)
- **Focus Indicators**: Visible in all states, never missing
- **Loading States**: Spinner visible, button disabled, text clear
- **Disabled States**: Visually distinct, no hover effects
- **Performance**: No layout shifts, 60fps animations

## Button Design System Rules

### Color Palette

**Primary Button Colors**:
- Light Mode Background: #00F0FF (Electric Cyan)
- Light Mode Text: #0A0E14 (Deep Space Black)
- Dark Mode Background: #00F0FF (Electric Cyan)
- Dark Mode Text: #0A0E14 (Deep Space Black)
- Hover: Brightness +10% or shadow elevation
- Active: Brightness -10%
- Disabled: Opacity 50%

**Secondary Button Colors**:
- Light Mode Border: #00F0FF (Electric Cyan)
- Light Mode Text: #00F0FF
- Light Mode Background: transparent
- Dark Mode Border: #00F0FF
- Dark Mode Text: #E8EDF3 (Light Text)
- Dark Mode Background: transparent
- Hover: Light background fill (opacity 10%)
- Active: Light background fill (opacity 20%)
- Disabled: Opacity 50%

**Ghost Button Colors**:
- Light Mode Text: #00F0FF
- Dark Mode Text: #00F0FF
- Hover: Underline or slight background
- Active: Darker shade or background
- Disabled: Opacity 50%

### Typography

- **Font**: Rajdhani (buttons), Source Code Pro (alternative)
- **Weight**: 600–700 (bold, legible)
- **Size**: 14px (small), 16px (medium), 18px (large)
- **Text Transform**: Sentence case (capitalize first letter only)
- **Letter Spacing**: Normal (no tracking adjustments)

### Spacing & Padding

**Button Padding** (Tailwind classes):
- **Small**: `px-3 py-1.5` (12px × 6px)
- **Medium**: `px-6 py-2.5` (24px × 10px)
- **Large**: `px-8 py-3` (32px × 12px)

**Icon Spacing**:
- Gap between icon and text: `gap-2` (8px)

**Button Groups**:
- Spacing between buttons: 12px (0.75rem)
- Horizontal arrangement on desktop
- Stack vertically on mobile (<640px)

### Border Radius

- All buttons: `rounded-lg` (8px)
- No extreme rounded corners (keeps professional look)

### Shadow & Elevation

- **Default**: No shadow or subtle `shadow-sm`
- **Hover**: Elevation with `shadow-md` or `shadow-lg`
- **Active**: Reduced shadow or no shadow (press-down effect)
- **Disabled**: No shadow

Use consistent elevation transitions for visual feedback.

### Transitions & Animations

All buttons use smooth transitions:

```css
transition: background-color 0.2s ease-in-out,
            color 0.2s ease-in-out,
            border-color 0.2s ease-in-out,
            box-shadow 0.2s ease-in-out,
            transform 0.2s ease-in-out,
            opacity 0.2s ease-in-out;
```

**State Durations**:
- Hover/Focus: 0.2s (quick feedback)
- Active: 0.15s (immediate press response)
- Loading: 0 (instant disable)
- Disabled: 0 (instant visual change)

### Focus Ring Styling

- **Width**: 2px–3px
- **Offset**: 2px–4px from button edge
- **Color**: #00F0FF (Electric Cyan) for visibility
- **Style**: Solid ring, never removed
- **Alternative**: On focus, change button background instead of adding ring

## Code Examples

### Primary Button (All States)

```html
<!-- Primary Button - Default -->
<button class="
  px-6 py-2.5
  bg-[#00F0FF] text-[#0A0E14]
  font-bold font-rajdhani text-base
  rounded-lg
  shadow-md
  transition-all duration-200 ease-in-out
  hover:shadow-lg hover:scale-105
  active:scale-98 active:shadow-sm
  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00F0FF]
  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
  dark:text-[#0A0E14] dark:bg-[#00F0FF]
">
  Start Learning
</button>

<!-- Primary Button - Hover State (CSS) -->
<button class="... hover:shadow-lg hover:scale-105 ...">
  Download Guide
</button>

<!-- Primary Button - Disabled State -->
<button class="... disabled:opacity-50 disabled:cursor-not-allowed ..." disabled>
  Coming Soon
</button>

<!-- Primary Button - With Icon -->
<button class="
  px-6 py-2.5
  bg-[#00F0FF] text-[#0A0E14]
  font-bold font-rajdhani rounded-lg
  flex items-center gap-2
  hover:shadow-lg transition-all
  focus:outline-none focus:ring-2 focus:ring-[#00F0FF]
">
  <span>→</span>
  Next Lesson
</button>
```

### Secondary Button (All States)

```html
<!-- Secondary Button - Default -->
<button class="
  px-6 py-2.5
  border-2 border-[#00F0FF]
  text-[#00F0FF]
  font-bold font-rajdhani text-base
  rounded-lg
  bg-transparent
  transition-all duration-200 ease-in-out
  hover:bg-[#00F0FF]/10 hover:shadow-md
  active:bg-[#00F0FF]/20 active:shadow-sm
  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00F0FF]
  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent
  dark:text-[#E8EDF3] dark:border-[#00F0FF]
">
  Learn More
</button>

<!-- Secondary Button - Hover (light background) -->
<button class="... hover:bg-[#00F0FF]/10 ...">
  Explore
</button>

<!-- Secondary Button - With Icon Before Text -->
<button class="
  px-6 py-2.5
  border-2 border-[#FF6B35]
  text-[#FF6B35]
  font-bold font-rajdhani
  flex items-center gap-2
  rounded-lg
  hover:bg-[#FF6B35]/10
  focus:ring-2 focus:ring-[#FF6B35]
">
  <span>📚</span>
  View Course
</button>
```

### Ghost Button (Text-Only)

```html
<!-- Ghost Button - Default -->
<button class="
  text-[#00F0FF]
  font-bold font-rajdhani text-base
  px-4 py-2
  rounded-lg
  transition-all duration-200 ease-in-out
  hover:bg-[#00F0FF]/10
  active:bg-[#00F0FF]/20
  focus:outline-none focus:ring-2 focus:ring-[#00F0FF]
  disabled:opacity-50 disabled:cursor-not-allowed
  dark:text-[#00F0FF]
">
  Cancel
</button>

<!-- Ghost Button - With Underline on Hover -->
<button class="
  text-[#00F0FF]
  font-bold font-rajdhani
  px-2 py-1
  relative
  after:absolute after:bottom-0 after:left-0
  after:w-0 after:h-0.5 after:bg-[#00F0FF]
  after:transition-all after:duration-300
  hover:after:w-full
  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00F0FF]
">
  Skip Tutorial
</button>

<!-- Ghost Button - Icon Only -->
<button
  class="
    text-[#00F0FF]
    text-2xl
    p-2
    rounded-lg
    hover:bg-[#00F0FF]/10
    focus:outline-none focus:ring-2 focus:ring-[#00F0FF]
  "
  aria-label="Close modal"
>
  ✕
</button>
```

### Button Sizes

```html
<!-- Small Button -->
<button class="px-3 py-1.5 text-sm font-bold text-[#0A0E14] bg-[#00F0FF] rounded-lg">
  Small
</button>

<!-- Medium Button (Standard) -->
<button class="px-6 py-2.5 text-base font-bold text-[#0A0E14] bg-[#00F0FF] rounded-lg">
  Medium
</button>

<!-- Large Button (Hero/CTA) -->
<button class="px-8 py-3 text-lg font-bold text-[#0A0E14] bg-[#00F0FF] rounded-lg">
  Large
</button>

<!-- Full Width Button (Mobile Forms) -->
<button class="w-full px-6 py-2.5 text-base font-bold text-[#0A0E14] bg-[#00F0FF] rounded-lg">
  Full Width
</button>
```

### Loading State Button

```html
<!-- Loading State - With Spinner -->
<button
  class="
    px-6 py-2.5
    bg-[#00F0FF] text-[#0A0E14]
    font-bold font-rajdhani rounded-lg
    flex items-center justify-center gap-2
    disabled:cursor-not-allowed
  "
  id="submitBtn"
  aria-busy="false"
>
  <span class="spinner hidden w-4 h-4 border-2 border-[#0A0E14] border-t-transparent rounded-full animate-spin"></span>
  <span class="button-text">Submit Quiz</span>
</button>

<style>
  button[aria-busy="true"] .spinner {
    display: inline-block;
  }
  button[aria-busy="true"] .button-text {
    display: none;
  }
  button[aria-busy="true"] {
    opacity: 0.8;
    pointer-events: none;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .animate-spin {
    animation: spin 1s linear infinite;
  }
</style>

<script>
  // Vanilla JS - No framework required
  const btn = document.getElementById('submitBtn');
  btn.addEventListener('click', async () => {
    btn.setAttribute('aria-busy', 'true');
    btn.disabled = true;

    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Success: reset button
      btn.setAttribute('aria-busy', 'false');
      btn.disabled = false;
    } catch (error) {
      // Error: reset button
      btn.setAttribute('aria-busy', 'false');
      btn.disabled = false;
    }
  });
</script>
```

### Disabled State Variations

```html
<!-- Disabled - Opacity Reduced -->
<button class="
  px-6 py-2.5
  bg-[#00F0FF] text-[#0A0E14]
  font-bold rounded-lg
  disabled:opacity-50 disabled:cursor-not-allowed
"
disabled>
  Disabled
</button>

<!-- Disabled - With Tooltip Hint -->
<div class="relative group">
  <button class="
    px-6 py-2.5
    bg-[#00F0FF] text-[#0A0E14]
    font-bold rounded-lg
    disabled:opacity-50
  "
  disabled>
    Locked Feature
  </button>
  <span class="
    absolute bottom-full left-1/2 -translate-x-1/2 mb-2
    px-3 py-1 bg-gray-900 text-white text-xs rounded
    opacity-0 group-hover:opacity-100 transition-opacity
    pointer-events-none
    dark:bg-gray-100 dark:text-gray-900
  ">
    Complete Module 1 first
  </span>
</div>

<!-- Disabled - Grayscale Approach -->
<button class="
  px-6 py-2.5
  bg-[#00F0FF] text-[#0A0E14]
  font-bold rounded-lg
  disabled:grayscale disabled:cursor-not-allowed
"
disabled>
  Coming Soon
</button>
```

### Button Group / Button Pair

```html
<!-- Horizontal Button Group -->
<div class="flex gap-3">
  <button class="
    px-6 py-2.5
    bg-[#00F0FF] text-[#0A0E14]
    font-bold rounded-lg
    flex-1 sm:flex-auto
    hover:shadow-lg transition-all
  ">
    Confirm
  </button>
  <button class="
    px-6 py-2.5
    border-2 border-[#00F0FF]
    text-[#00F0FF]
    font-bold rounded-lg
    flex-1 sm:flex-auto
    hover:bg-[#00F0FF]/10 transition-all
  ">
    Cancel
  </button>
</div>

<!-- Vertical Button Stack (Mobile) -->
<div class="flex flex-col gap-3 sm:flex-row sm:gap-3">
  <button class="
    w-full px-6 py-2.5
    bg-[#00F0FF] text-[#0A0E14]
    font-bold rounded-lg
  ">
    Next
  </button>
  <button class="
    w-full px-6 py-2.5
    border-2 border-[#00F0FF]
    text-[#00F0FF]
    font-bold rounded-lg
  ">
    Previous
  </button>
</div>
```

### CTA Section Example

```html
<!-- Hero CTA Section -->
<section class="py-12 px-6 bg-gradient-to-r from-[#0A0E14] to-[#1A2230]">
  <div class="max-w-2xl mx-auto text-center">
    <h2 class="text-3xl font-bold text-[#E8EDF3] font-rajdhani mb-4">
      Ready to Learn?
    </h2>
    <p class="text-[#9AABB8] mb-8 font-source-code-pro">
      Start your journey into Physical AI and Humanoid Robotics.
    </p>

    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <!-- Primary CTA -->
      <button class="
        px-8 py-3
        bg-[#00F0FF] text-[#0A0E14]
        font-bold font-rajdhani text-lg
        rounded-lg
        shadow-lg hover:shadow-2xl hover:scale-105
        transition-all duration-300
        focus:ring-2 focus:ring-offset-2 focus:ring-[#00F0FF]
      ">
        Start Free Course
      </button>

      <!-- Secondary CTA -->
      <button class="
        px-8 py-3
        border-2 border-[#FF6B35]
        text-[#FF6B35]
        font-bold font-rajdhani text-lg
        rounded-lg
        hover:bg-[#FF6B35]/10
        transition-all duration-300
      ">
        Watch Demo
      </button>
    </div>
  </div>
</section>
```

### Floating Action Button (FAB)

```html
<!-- Floating Action Button - Bottom Right -->
<button
  class="
    fixed bottom-8 right-8
    w-14 h-14
    bg-[#00F0FF] text-[#0A0E14]
    rounded-full
    shadow-lg hover:shadow-2xl hover:scale-110
    transition-all duration-300
    flex items-center justify-center
    font-bold text-2xl
    focus:ring-2 focus:ring-offset-2 focus:ring-[#00F0FF]
    z-40
  "
  aria-label="Scroll to top"
  id="scrollToTop"
>
  ↑
</button>

<script>
  const fab = document.getElementById('scrollToTop');
  fab.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
</script>
```

## Button Variants & Use Cases

### Primary Button
- **Purpose**: Main action, highest priority
- **Use Cases**: Start Learning, Submit Quiz, Download, Enroll, Save Changes
- **Visual**: Bold, filled background, prominent
- **Hover**: Elevation + slight scale
- **When to Use**: One per section/dialog

### Secondary Button
- **Purpose**: Alternative action, lower priority
- **Use Cases**: Learn More, View Details, Cancel, Back, Skip
- **Visual**: Outlined, transparent background, clear but subtle
- **Hover**: Light background fill
- **When to Use**: Paired with primary buttons

### Ghost Button
- **Purpose**: Minimal, unobtrusive actions
- **Use Cases**: Close, Dismiss, Cancel, Optional Links, Toggle
- **Visual**: Text-only, no background/border
- **Hover**: Underline or subtle background
- **When to Use**: Low-priority or repeated actions

### Icon Button
- **Purpose**: Compact actions with visual affordance
- **Use Cases**: Menu toggles, Search, Settings, Theme switcher
- **Visual**: Icon-centered, optional background
- **Accessibility**: Must have `aria-label`
- **When to Use**: Space-constrained areas (navbar, toolbar)

### Floating Action Button (FAB)
- **Purpose**: Persistent, prominent action throughout page
- **Use Cases**: Scroll-to-top, Chat, Help, Quick action
- **Visual**: Round, elevated, fixed position
- **Hover**: Scale + shadow elevation
- **When to Use**: Once per page, critical actions

### Loading Button
- **Purpose**: Provide feedback during async operations
- **Use Cases**: Form submission, Data fetching, File upload
- **Visual**: Spinner + disabled state
- **Accessibility**: `aria-busy="true"` during loading
- **When to Use**: Any button triggering server requests

## Tools & Technologies

- **Docusaurus 3.x** — Documentation framework
- **Tailwind CSS 3.x** — Utility-first CSS framework
- **Vanilla HTML/CSS** — No external JS frameworks required
- **CSS Transitions** — Smooth state changes
- **CSS Animations** — Loading spinners, effects
- **Semantic HTML** — `<button>`, `<a>` elements
- **ARIA Attributes** — `aria-label`, `aria-busy`, `aria-disabled`
- **Keyboard APIs** — Event listeners (click, keydown)
- **Accessibility Testing**:
  - axe DevTools (ARIA, contrast)
  - Lighthouse (accessibility)
  - WAVE (WCAG compliance)
  - Manual keyboard testing
  - Screen reader testing (NVDA, JAWS, VoiceOver)
- **Performance Tools**:
  - Chrome DevTools (rendering, 60fps check)
  - Lighthouse (performance, accessibility)

## Constraints & Requirements

✅ **Must Do:**
- Use Tailwind CSS utilities exclusively
- No external JavaScript frameworks (vanilla JS only for interactivity)
- Support all interactive states (default, hover, focus, active, disabled, loading)
- Implement keyboard navigation (Tab, Enter, Space)
- Provide visible focus indicators
- Maintain 4.5:1 contrast ratio (WCAG AA)
- Work in light and dark modes
- Be responsive across all breakpoints
- Use semantic HTML (`<button>`, `<a>`)
- Include ARIA labels where needed
- Smooth transitions (0.2–0.3s)
- Lazy load images if present

❌ **Must NOT Do:**
- Use JavaScript frameworks (React, Vue, etc.) for basic buttons
- Remove or hide focus outlines
- Hardcode colors (use Tailwind/CSS variables)
- Break existing Docusaurus structure
- Use unsupported browser APIs
- Create layout shifts on state changes
- Ignore keyboard accessibility
- Use inline styles for responsive design
- Skip color contrast validation
- Forget `aria-label` on icon-only buttons

## Acceptance Criteria

- [ ] All button variants render correctly (primary, secondary, ghost)
- [ ] All states implemented (default, hover, focus, active, disabled, loading)
- [ ] Smooth transitions (60fps, 0.2–0.3s duration)
- [ ] Color contrast passes WCAG AA (4.5:1 minimum) in light mode
- [ ] Color contrast passes WCAG AA (4.5:1 minimum) in dark mode
- [ ] Keyboard navigation fully functional (Tab, Enter, Space)
- [ ] Focus indicators visible in all states
- [ ] Screen reader announces button text and state correctly
- [ ] Loading state spinner visible and animated
- [ ] Disabled buttons not focusable by keyboard
- [ ] Button hover/active effects smooth, no jank
- [ ] Icon-only buttons have `aria-label`
- [ ] No console errors or warnings
- [ ] Buttons tested on 3+ breakpoints (mobile, tablet, desktop)
- [ ] Touch targets ≥ 44px on mobile
- [ ] Works in light and dark modes
- [ ] Lighthouse accessibility score ≥ 95
- [ ] Responsive design tested and working

## Keyboard Navigation Checklist

- [ ] Tab through buttons in logical order
- [ ] Enter key activates button
- [ ] Space key activates button
- [ ] Shift+Tab navigates backwards
- [ ] Focus visible at all times (never blurred)
- [ ] No keyboard traps
- [ ] Disabled buttons skip on Tab navigation
- [ ] Focus indicator matches design system
- [ ] Screen reader announces "button" element type
- [ ] Button labels clear and concise

## Accessibility Validation Checklist

- [ ] Semantic HTML used (`<button>` not `<div onclick>`)
- [ ] ARIA labels added for icon-only buttons
- [ ] Color not sole indicator of state
- [ ] Focus indicator never removed
- [ ] Contrast ratio ≥ 4.5:1 for text (light & dark)
- [ ] Hover effects don't prevent content visibility
- [ ] Touch targets ≥ 44×44px on mobile
- [ ] Loading state announced with `aria-busy`
- [ ] Disabled state semantically marked
- [ ] Font size ≥ 14px for readability
- [ ] No flickering animations (< 3Hz)
- [ ] Alternative text for icon buttons provided

## Testing & Validation Plan

### Cross-Browser Testing
- Chrome/Chromium (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest version)

### Device Testing
- Mobile: iPhone 12/14, Samsung S21/S23
- Tablet: iPad, iPad Pro
- Desktop: Windows, macOS

### Screen Reader Testing
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS)
- TalkBack (Android, if applicable)

### Performance Testing
- Lighthouse (aim for ≥ 90)
- No layout shifts on state changes
- 60fps animations
- < 100ms interaction response time

---

Save it as `.claude/skills/ui-buttons/skill.md`
