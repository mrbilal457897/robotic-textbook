---
name: micro-interactions
description: Add subtle animations and interactions to textbook pages without harming performance. Create CSS-based animations for cards, diagrams, and sections that improve engagement while respecting accessibility constraints and maintaining Lighthouse scores above 90 for the Physical AI & Humanoid Robotics Interactive Textbook.
---

# Micro-Interactions Design Skill

## Overview

This skill provides a system for adding subtle, delightful micro-interactions to the Physical AI & Humanoid Robotics Interactive Textbook. Micro-interactions are small, purposeful animations and transitions that provide visual feedback, guide user attention, and create a sense of responsiveness without sacrificing performance. This skill ensures all animations follow accessibility guidelines, use efficient CSS, respect user preferences, and maintain a professional, polished feel aligned with the "Neural Circuitry Futurism" design theme.

## When to Use This Skill

- When UI feels static or boring
- Adding hover states to buttons, cards, and links
- Guiding user attention to important sections
- Providing visual feedback on interactions (click, scroll, focus)
- Revealing content on scroll or click
- Creating smooth page transitions
- Animating loading states and progress indicators
- When cards need engaging entrance animations
- Implementing smooth state changes without jarring jumps
- When you want to improve user engagement subtly
- Polishing interactive elements for a premium feel

## Step-by-Step Instructions

### 1. Interaction Purpose Definition

Before adding animation, clarify its purpose:

- **Visual Feedback**: Confirm user action (click, hover, focus)
- **Attention Guidance**: Draw attention to important content
- **State Change**: Indicate change in element state (expand, collapse, activate)
- **Entrance Animation**: Introduce new content smoothly
- **Micro-Feedback**: Acknowledge interaction (scale, color shift)
- **Delight**: Add personality without interference

**Decision Framework**:
- Is this animation purposeful, not decorative? → Use it
- Does it distract from content? → Remove or reduce
- Is it faster than 300ms? → Good for feedback
- Does it cause layout shift? → Use transform or opacity instead
- Does it loop infinitely? → Only for loading states

### 2. Performance Analysis

Before implementing, ensure animation won't harm performance:

- **60fps Target**: Animation must run at 60 frames per second (16.67ms per frame)
- **GPU Acceleration**: Use `transform` and `opacity` (composited properties)
- **Avoid Reflow**: Don't animate `width`, `height`, `top`, `left`, `margin`, `padding`
- **Composite Layers**: Use `will-change` for expensive animations
- **Mobile Testing**: Test on actual devices with throttling (Chrome DevTools)
- **Lighthouse**: Verify score ≥ 90 (no performance degradation)
- **Profiling**: Use Chrome DevTools Performance tab to identify jank

### 3. Timing & Easing Selection

Choose appropriate timing for different interaction types:

**Timing Durations**:
- **Micro Feedback** (hover color): 150–200ms (quick acknowledgment)
- **State Change** (expand/collapse): 200–300ms (noticeable but snappy)
- **Entrance Animation** (reveal): 300–500ms (smooth, elegant)
- **Page Transition**: 300–400ms (feels responsive)
- **Loading States**: 1–2s (visible but not annoying)

**Easing Functions**:
- **Ease-in-out**: Default for most interactions (smooth acceleration and deceleration)
- **Ease-out**: Entrance animations (quick start, gentle landing)
- **Ease-in**: Exit animations (gentle start, quick finish)
- **Linear**: Progress bars, spinners (constant, predictable)
- **Cubic-bezier**: Custom easing for brand personality

### 4. Accessibility Compliance

Ensure animations respect user preferences:

- **prefers-reduced-motion**: Disable animations for users who prefer reduced motion
- **High Contrast**: Ensure animations don't hide content
- **Focus Indicators**: Always show focus rings, no animation covers them
- **Screen Readers**: Animations don't interfere with screen reader announcements
- **No Flashing**: Avoid animations with flicker (> 3Hz causes seizure risk)
- **Skip Animations**: Provide option to skip complex entrance animations

**Implementation**:
```css
/* Respect user preference for reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 5. Hover State Animations

Implement smooth hover feedback:

- **Scale**: Slight scale up (1.02–1.05) for buttons and cards
- **Shadow**: Elevation with shadow on hover
- **Color**: Shift to accent color or brighten
- **Underline**: Animated underline for links (expand or slide)
- **Glow**: Subtle glow effect for highlighting
- **Combination**: Use transform + shadow for depth

All transitions should be smooth (0.2–0.3s ease-in-out).

### 6. Focus State Animations

Make keyboard focus visually distinct:

- **Focus Ring**: Visible 2px ring, never removed
- **Background Highlight**: Subtle background color change
- **Glow Effect**: Soft shadow glow
- **Underline**: Animated underline for links
- **Combination**: Ring + slight scale for buttons

Must be immediately visible when Tab key is pressed.

### 7. Scroll-Triggered Animations

Reveal content as user scrolls:

- **Fade In**: Opacity 0 → 1 as element enters viewport
- **Slide In**: Transform translateY (down 20px → 0) on scroll
- **Scale In**: Transform scale (0.8 → 1) as element appears
- **Stagger**: Delay animations for multiple elements (cascade effect)
- **One-time**: Animation plays only once, not on scroll up
- **Intersection Observer**: Use for performance (only animate visible elements)

### 8. Loading State Animations

Provide feedback for async operations:

- **Spinner**: Rotating circle (linear, infinite animation)
- **Skeleton**: Shimmer effect on placeholder content
- **Progress Bar**: Smooth width animation to full or indeterminate animation
- **Pulse**: Subtle pulse effect (opacity fade in/out)
- **Bounce**: Gentle bounce for emphasis

All should be smooth, non-distracting, and under 1s per cycle.

### 9. Color & State Change Animations

Smoothly transition between states:

- **Button Activation**: Background color + slight scale
- **Toggle Switch**: Smooth color transition + knob movement
- **Tab Change**: Underline animation to new tab
- **Badge/Alert**: Subtle glow or pulse on appearance
- **Progress**: Smooth color transition (gray → success green)

### 10. Integration & Testing

Complete validation before deployment:

- **Cross-browser**: Chrome, Firefox, Safari, Edge
- **Responsive**: Test on mobile (usually slower devices)
- **DevTools Throttling**: Test with 4x CPU slowdown
- **Lighthouse**: Run performance audit (score ≥ 90)
- **Keyboard**: Test all focus states with Tab key
- **Screen Reader**: Ensure animations don't interfere
- **prefers-reduced-motion**: Test with "Reduce motion" enabled
- **Low-end Devices**: Test on actual older devices if possible
- **Accessibility**: axe DevTools, no color-only indicators

## Micro-Interaction Design Rules

### Timing Standards

**Fast Interactions** (150–200ms):
- Button hover feedback
- Link underline animation
- Icon color change
- Subtle scale effects

**Normal Interactions** (250–300ms):
- Card entrance animations
- Modal slide-in
- Dropdown expand/collapse
- Tab switching
- State changes

**Slower Interactions** (400–500ms):
- Page transitions
- Large content reveal
- Complex animations
- Staggered element sequences

**Loading States** (1–2s):
- Spinner rotation
- Skeleton shimmer
- Progress bar fill
- Pulsing indicators

### Easing Functions

**CSS Easing Presets**:
```css
/* Most interactions: smooth acceleration + deceleration */
transition: all 0.3s ease-in-out;

/* Entrance animations: quick start, gentle landing */
animation: slideIn 0.4s ease-out;

/* Exit animations: gentle start, quick finish */
animation: slideOut 0.3s ease-in;

/* Progress bars, loading: constant speed */
animation: spin 1s linear infinite;

/* Custom easing for brand feel */
transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Performance Best Practices

**GPU-Accelerated Properties** (use these):
- `transform: translate()`, `scale()`, `rotate()`
- `opacity`

**Avoid These** (cause reflow/repaint):
- `width`, `height`
- `top`, `left`, `right`, `bottom`
- `margin`, `padding`
- `box-shadow` (use sparingly)
- `filter` (expensive, use sparingly)

**Optimization Techniques**:
```css
/* Enable GPU acceleration */
will-change: transform, opacity;

/* For complex animations, isolate in own layer */
contain: layout style paint;

/* Disable after animation completes */
.animated {
  will-change: transform;
  animation: slideIn 0.3s ease-out forwards;
}
@keyframes slideIn {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; will-change: auto; }
}
```

### Color & Visual Feedback

**Hover Color Shifts**:
- Brighten by 10–15% (lightness +10%)
- Shift hue slightly (rotate by 5–10°)
- Add subtle glow (box-shadow with transparent color)

**Focus Indicators**:
- Ring color: Electric Cyan (#00F0FF)
- Ring width: 2px
- Ring offset: 2–4px
- Never removed, always visible

**State Indicators**:
- Active: Darker shade or accent color
- Disabled: Reduced opacity (50%)
- Pending: Pulse or shimmer effect
- Complete: Solid color or checkmark animation

### Stagger & Cascade Effects

For multiple elements, use stagger delays:

```css
.list-item {
  animation: slideIn 0.5s ease-out backwards;
}
.list-item:nth-child(1) { animation-delay: 0s; }
.list-item:nth-child(2) { animation-delay: 0.1s; }
.list-item:nth-child(3) { animation-delay: 0.2s; }
.list-item:nth-child(n+4) { animation-delay: calc(0.1s * (var(--item-index))); }
```

Creates elegant cascade without JavaScript.

## Code Examples

### Basic Hover & Focus Animation (Buttons)

```html
<button class="
  px-6 py-2.5
  bg-[#00F0FF] text-[#0A0E14]
  font-bold rounded-lg
  shadow-md

  /* Smooth transitions */
  transition-all duration-300 ease-in-out

  /* Hover state */
  hover:shadow-lg hover:scale-105

  /* Focus state */
  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00F0FF]

  /* Active state */
  active:scale-95
">
  Start Learning
</button>

<style>
  button {
    /* GPU acceleration */
    will-change: transform, box-shadow;
  }

  /* Respect motion preferences */
  @media (prefers-reduced-motion: reduce) {
    button {
      transition: none;
    }
    button:hover {
      transform: none;
    }
  }
</style>
```

### Card Hover with Multiple Effects

```html
<div class="
  bg-white dark:bg-[#1A2230]
  rounded-xl
  p-6
  shadow-md

  /* Smooth all transitions */
  transition-all duration-300 ease-in-out

  /* Hover effects */
  hover:shadow-xl hover:scale-105 hover:-translate-y-1

  /* Focus-within for keyboard users */
  focus-within:ring-2 focus-within:ring-[#00F0FF]
">
  <h3 class="text-xl font-bold mb-2">Lesson Title</h3>
  <p class="text-gray-600 dark:text-[#9AABB8] mb-4">Description...</p>
  <a href="#" class="text-[#00F0FF] font-semibold hover:underline">
    Learn more →
  </a>
</div>

<style>
  div {
    will-change: transform, box-shadow;
  }

  @media (prefers-reduced-motion: reduce) {
    div {
      transition: none;
    }
    div:hover {
      transform: none;
      box-shadow: initial;
    }
  }
</style>
```

### Link Underline Animation

```html
<a href="#" class="
  text-[#00F0FF]
  font-semibold
  relative

  /* Animated underline */
  after:content-['']
  after:absolute after:bottom-0 after:left-0
  after:w-0 after:h-0.5
  after:bg-[#00F0FF]
  after:transition-all after:duration-300 after:ease-in-out

  hover:after:w-full
">
  Explore Course
</a>

<style>
  @media (prefers-reduced-motion: reduce) {
    a::after {
      transition: none;
    }
    a:hover::after {
      width: 100%;
    }
  }
</style>
```

### Scroll-Triggered Fade In

```html
<section class="
  opacity-0
  translate-y-5
  transition-all duration-500 ease-out
" data-fade-in>
  <h2 class="text-3xl font-bold mb-4">Section Title</h2>
  <p>Content appears smoothly as section enters viewport...</p>
</section>

<script>
  // Intersection Observer for performance
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100', 'translate-y-0');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px' // Start animation 100px before visible
  });

  document.querySelectorAll('[data-fade-in]').forEach(el => {
    observer.observe(el);
  });
</script>

<style>
  section[data-fade-in] {
    opacity: 0;
    transform: translateY(20px);
    will-change: opacity, transform;
  }

  section[data-fade-in].opacity-100 {
    opacity: 1;
    transform: translateY(0);
  }

  @media (prefers-reduced-motion: reduce) {
    section[data-fade-in] {
      opacity: 1;
      transform: none;
    }
  }
</style>
```

### Loading Spinner Animation

```html
<div class="
  inline-block
  w-6 h-6
  border-2 border-[#9AABB8]
  border-t-[#00F0FF]
  rounded-full
  animate-spin
"
role="status"
aria-label="Loading">
  <span class="sr-only">Loading...</span>
</div>

<style>
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .animate-spin {
    animation: spin 1s linear infinite;
    will-change: transform;
  }

  /* Respect motion preferences */
  @media (prefers-reduced-motion: reduce) {
    .animate-spin {
      animation: none;
      opacity: 0.5;
    }
  }
</style>
```

### Staggered List Animation

```html
<ul class="space-y-4">
  <li class="
    opacity-0
    translate-x-5
    animate-slideIn
  " style="--item-index: 0">
    <span>First item</span>
  </li>
  <li class="
    opacity-0
    translate-x-5
    animate-slideIn
  " style="--item-index: 1">
    <span>Second item</span>
  </li>
  <li class="
    opacity-0
    translate-x-5
    animate-slideIn
  " style="--item-index: 2">
    <span>Third item</span>
  </li>
</ul>

<style>
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .animate-slideIn {
    animation: slideIn 0.5s ease-out forwards;
    animation-delay: calc(0.1s * var(--item-index, 0));
    will-change: transform, opacity;
  }

  @media (prefers-reduced-motion: reduce) {
    .animate-slideIn {
      animation: none;
      opacity: 1;
      transform: none;
    }
  }
</style>
```

### Pulse Effect for Notifications

```html
<div class="
  absolute top-2 right-2
  w-3 h-3
  bg-red-500
  rounded-full
  animate-pulse
"
aria-label="Notification badge">
</div>

<style>
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    will-change: opacity;
  }

  @media (prefers-reduced-motion: reduce) {
    .animate-pulse {
      animation: none;
      opacity: 0.7;
    }
  }
</style>
```

### Glow Effect on Focus

```html
<button class="
  px-6 py-2.5
  bg-[#00F0FF] text-[#0A0E14]
  font-bold rounded-lg

  transition-all duration-300 ease-in-out
  focus:outline-none
  focus:ring-2 focus:ring-[#00F0FF] focus:ring-offset-2
  focus:shadow-lg focus:shadow-[#00F0FF]/50
">
  Interactive Button
</button>

<style>
  button {
    will-change: box-shadow, transform;
  }

  button:focus {
    box-shadow:
      0 0 0 2px #ffffff,
      0 0 0 4px #00f0ff,
      0 10px 15px rgba(0, 240, 255, 0.3);
  }

  @media (prefers-reduced-motion: reduce) {
    button {
      transition: none;
    }
    button:focus {
      box-shadow: 0 0 0 2px #00f0ff;
    }
  }
</style>
```

### Framer Motion Alternative (Optional)

```jsx
import { motion } from 'framer-motion';

export function AnimatedCard({ title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-100px' }}
      whileHover={{ scale: 1.05, boxShadow: '0 10px 15px rgba(0, 240, 255, 0.2)' }}
      className="
        bg-white dark:bg-[#1A2230]
        rounded-xl p-6
        shadow-md
        cursor-pointer
      "
    >
      <h3 className="text-xl font-bold font-rajdhani mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-[#9AABB8]">
        {description}
      </p>
    </motion.div>
  );
}
```

### Loading Skeleton with Shimmer

```html
<div class="space-y-4">
  <div class="
    h-8 bg-gray-200 dark:bg-[#374151]
    rounded-lg
    animate-shimmer
    bg-gradient-to-r
    from-transparent via-white to-transparent
    dark:from-transparent dark:via-[#1A2230] dark:to-transparent
  "></div>
  <div class="
    h-4 bg-gray-200 dark:bg-[#374151]
    rounded-lg
    animate-shimmer
    w-3/4
  "></div>
  <div class="
    h-4 bg-gray-200 dark:bg-[#374151]
    rounded-lg
    animate-shimmer
    w-1/2
  "></div>
</div>

<style>
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }

  .animate-shimmer {
    animation: shimmer 2s infinite;
    background-size: 1000px 100%;
    will-change: background-position;
  }

  @media (prefers-reduced-motion: reduce) {
    .animate-shimmer {
      animation: none;
      opacity: 0.5;
    }
  }
</style>
```

### Modal Slide-In Animation

```html
<div class="
  fixed inset-0
  bg-black/50
  opacity-0 invisible
  transition-all duration-300 ease-in-out
  data-modal-open:opacity-100 data-modal-open:visible
"
data-modal-backdrop>
  <div class="
    bg-white dark:bg-[#1A2230]
    rounded-xl
    p-8
    max-w-2xl

    transform
    translate-y-10
    transition-all duration-300 ease-out
    data-modal-open:translate-y-0
  ">
    <h2 class="text-2xl font-bold mb-4">Dialog Title</h2>
    <p class="text-gray-600 dark:text-[#9AABB8] mb-6">
      Content goes here...
    </p>
    <button class="
      px-6 py-2.5
      bg-[#00F0FF] text-[#0A0E14]
      font-bold rounded-lg
    ">
      Close
    </button>
  </div>
</div>

<script>
  const backdrop = document.querySelector('[data-modal-backdrop]');

  function openModal() {
    backdrop.setAttribute('data-modal-open', '');
  }

  function closeModal() {
    backdrop.removeAttribute('data-modal-open');
  }
</script>

<style>
  @media (prefers-reduced-motion: reduce) {
    [data-modal-backdrop],
    [data-modal-backdrop] > div {
      transition: none !important;
      transform: none !important;
    }
    [data-modal-backdrop].invisible {
      display: none;
    }
  }
</style>
```

### Smooth Scroll Behavior

```html
<style>
  /* Smooth scrolling for anchor links */
  html {
    scroll-behavior: smooth;
  }

  /* Respect motion preferences even for scroll */
  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
  }
</style>
```

## Common Micro-Interaction Patterns

### Hover Scale + Lift
```css
.card:hover {
  transform: scale(1.05) translateY(-4px);
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
}
```

### Focus Glow Ring
```css
.button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 240, 255, 0.5);
}
```

### Underline Animation
```css
.link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: currentColor;
  transition: width 0.3s ease-in-out;
}
.link:hover::after {
  width: 100%;
}
```

### Fade & Slide Entrance
```css
@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.fade-slide-in {
  animation: fadeSlideIn 0.4s ease-out;
}
```

### Loading Spinner
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}
.spinner {
  animation: spin 1s linear infinite;
}
```

### Pulse Effect
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### Bounce Animation
```css
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.bounce {
  animation: bounce 0.6s infinite;
}
```

## Tools & Technologies

- **CSS Transitions** — Smooth state changes (primary)
- **CSS Animations** — Keyframe-based animations
- **CSS Transforms** — GPU-accelerated `translate`, `scale`, `rotate`
- **CSS Variables** — Dynamic animation values
- **Intersection Observer API** — Scroll-triggered animations
- **Framer Motion** (optional) — React animation library for complex interactions
- **Chrome DevTools**:
  - Performance tab (detect jank, 60fps validation)
  - Rendering tab (paint flashing)
  - CPU Throttling (test on low-end devices)
- **Lighthouse** — Performance & accessibility audit
- **Accessibility Testing**:
  - prefers-reduced-motion detection
  - Screen reader compatibility
  - Keyboard navigation validation

## Constraints & Requirements

✅ **Must Do:**
- All animations respect `prefers-reduced-motion` media query
- Use GPU-accelerated properties (`transform`, `opacity`)
- Keep animations under 300ms (except entrances/exits)
- Maintain 60fps performance (no jank)
- Test on mobile devices with throttling
- Include focus indicators for keyboard users
- Lazy load heavy animations (Intersection Observer)
- Document animation purpose
- Test with Lighthouse ≥ 90 score
- Use semantic HTML
- Support light and dark modes

❌ **Must NOT Do:**
- Animate properties that cause reflow (`width`, `height`, `top`, `left`)
- Remove focus outlines
- Ignore `prefers-reduced-motion` preference
- Create animations that loop endlessly (except loading)
- Use expensive CSS properties without optimization (`filter`, `box-shadow`)
- Add animations without purpose
- Skip performance testing
- Ignore accessibility requirements
- Use JavaScript for simple transitions
- Break keyboard navigation

## Acceptance Criteria

- [ ] All animations run at 60fps (no jank, smooth)
- [ ] Timing appropriate for interaction type (150–500ms)
- [ ] Easing functions consistent and smooth
- [ ] `prefers-reduced-motion` respected (animations disabled)
- [ ] All GPU-accelerated properties used (`transform`, `opacity`)
- [ ] No reflow/repaint-causing properties animated
- [ ] Focus indicators visible and enhanced with animation
- [ ] Keyboard navigation fully functional
- [ ] Screen reader announces content correctly
- [ ] Loading states smooth and clear
- [ ] Hover states provide feedback
- [ ] Scroll-triggered animations perform well
- [ ] No layout shifts during animations
- [ ] Cross-browser compatible (Chrome, Firefox, Safari, Edge)
- [ ] Tested on mobile with 4x CPU slowdown
- [ ] Lighthouse performance score ≥ 90
- [ ] Light and dark modes supported
- [ ] Touch states smooth on mobile
- [ ] Animation code documented with purpose
- [ ] No flickering or visual glitches
- [ ] Animations enhance UX, don't distract

## Performance Checklist

- [ ] No animations on properties causing reflow
- [ ] `will-change` used for expensive animations
- [ ] Intersection Observer for scroll triggers
- [ ] GPU acceleration enabled (`transform`, `opacity`)
- [ ] Animation frame rate 60fps minimum
- [ ] No layout shifts (CLS < 0.1)
- [ ] Mobile performance tested (low-end devices)
- [ ] DevTools Performance tab shows smooth timeline
- [ ] No long tasks blocking main thread
- [ ] CSS animations preferred over JavaScript
- [ ] Keyframes optimized (minimal redraws)
- [ ] Chrome DevTools shows no red flags
- [ ] Lighthouse score ≥ 90
- [ ] Paint flashing shows minimal repaints
- [ ] Rendering performance stable
- [ ] No memory leaks from animations

## Accessibility Checklist

- [ ] `prefers-reduced-motion` implemented
- [ ] Animations don't remove focus indicators
- [ ] No color-only animation feedback
- [ ] Focus states clearly visible
- [ ] Keyboard navigation unaffected
- [ ] Screen reader announcements not disrupted
- [ ] No flickering animations (< 3Hz)
- [ ] Animations provide feedback, not distraction
- [ ] Skip animation option for modal/entrance
- [ ] Alt text/labels for animated elements
- [ ] Sufficient color contrast maintained
- [ ] Touch targets unaffected by animation

---

Save it as `.claude/skills/micro-interactions/skill.md`
