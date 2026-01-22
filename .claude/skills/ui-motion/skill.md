---
name: ui-motion
description: Add meaningful animations to textbook pages for enhanced storytelling. Create entrance animations, scroll-based reveals, and transitions that respect user motion preferences while maintaining performance and accessibility standards for the Physical AI & Humanoid Robotics Interactive Textbook.
---

# UI Motion & Storytelling Skill

## Overview

This skill provides a system for adding meaningful, purposeful animations to the Physical AI & Humanoid Robotics Interactive Textbook that enhance storytelling, guide user attention, and create engaging narrative flow. Unlike micro-interactions (small, quick feedback), UI motion encompasses larger animations that introduce content, reveal information on scroll, and transition between states. This skill ensures all animations improve user experience, respect accessibility preferences, maintain 60fps performance, and align with the "Neural Circuitry Futurism" design theme.

## When to Use This Skill

- When enhancing storytelling with entrance animations
- Introducing new content sections smoothly
- Revealing information as users scroll through page
- Creating visual flow between related sections
- Guiding user attention to important content
- Page transitions and navigation animations
- Staggered reveals for lists and grids
- Subtle parallax effects for depth
- Loading state animations and transitions
- When UI needs momentum and personality
- Creating immersive learning experiences
- When animations improve information hierarchy

## Step-by-Step Instructions

### 1. Purpose & Narrative Analysis

Before adding animation, clarify its storytelling purpose:

- **Entrance Animation**: Introduce new section, capture attention
- **Scroll Reveal**: Unveil information at the right moment in user journey
- **Visual Flow**: Guide eyes from one element to next
- **State Transition**: Communicate change (expand, collapse, activate)
- **Emphasis**: Highlight important information
- **Momentum**: Create sense of liveliness and responsiveness
- **Spatial Relationship**: Show hierarchy or connection between elements

**Decision Framework**:
- Does this animation serve a narrative purpose? → Use it
- Is it purely decorative? → Remove or reconsider
- Does it distract from content? → Reduce duration or simplify
- Does it help users understand the page better? → Use it

### 2. Animation Timing & Duration

Choose appropriate timing for different animation types:

**Entrance Animations**:
- Page load: 400–600ms (noticeable, welcome)
- Section reveal: 300–500ms (smooth, elegant)
- Card entrance: 300–400ms per card
- Staggered reveals: 100–150ms delay between items

**Scroll Reveals**:
- Fade in: 300–500ms (smooth appearance)
- Slide in: 400–600ms (movement creates momentum)
- Scale in: 300–500ms (growth effect)
- Combined (fade + slide): 400–500ms total

**Page Transitions**:
- Exit animation: 150–300ms (quick departure)
- Fade out: 200–300ms
- Slide out: 300–400ms
- Cross-fade: 300–400ms

**Loading States**:
- Spinner: 1–2s per rotation (visible, calming)
- Progress bar: Smooth, not too fast or slow
- Skeleton: 1.5s shimmer cycle (hypnotic but gentle)

### 3. Easing Strategy

Select easing functions that communicate intent:

**Entrance Animations** (elements appear):
- Ease-out: Quick start, gentle landing (feels light)
- Example: `cubic-bezier(0.34, 1.56, 0.64, 1)` (bounce slight)
- Purpose: Makes appearance feel natural, not rigid

**Scroll Reveals** (content enters viewport):
- Ease-in-out: Smooth acceleration and deceleration
- Example: `cubic-bezier(0.42, 0, 0.58, 1)` (smooth sine)
- Purpose: Professional, predictable motion

**Exit Animations** (elements leave):
- Ease-in: Gentle start, quick finish
- Example: `cubic-bezier(0.42, 0, 1, 1)` (quick exit)
- Purpose: Feels natural, like object leaving screen

**Emphasis** (attention grab):
- Custom elastic: `cubic-bezier(0.34, 1.56, 0.64, 1)` (slight bounce)
- Purpose: Creates personality, draws attention

### 4. Entrance Animation Patterns

Implement engaging entrance animations:

**Fade In** (simplest):
- Start: `opacity: 0`
- End: `opacity: 1`
- Duration: 300–400ms ease-out
- Use for: Text, subtle appearances

**Fade + Slide In** (classic):
- Start: `opacity: 0; transform: translateY(20px)` (or X)
- End: `opacity: 1; transform: translateY(0)`
- Duration: 400–500ms ease-out
- Use for: Cards, sections, images

**Scale In** (emphasis):
- Start: `opacity: 0; transform: scale(0.8)`
- End: `opacity: 1; transform: scale(1)`
- Duration: 300–400ms ease-out
- Use for: Important content, CTAs

**Rotate + Fade In** (personality):
- Start: `opacity: 0; transform: rotate(-5deg) scale(0.8)`
- End: `opacity: 1; transform: rotate(0) scale(1)`
- Duration: 400–500ms ease-out
- Use for: Icons, badges, accents

### 5. Scroll-Triggered Reveals

Use Intersection Observer for performance:

- Monitor when elements enter viewport
- Trigger animation at threshold (10–50% visible)
- Use `animation-fill-mode: both` to maintain final state
- Disable animation if `prefers-reduced-motion`
- One-time animation (no re-trigger on scroll up)

**Implementation**:
1. Add `[data-scroll-reveal]` attribute to elements
2. Intersection Observer detects element visibility
3. Add class to trigger animation
4. Class remains applied (element stays visible)

### 6. Staggered & Cascading Effects

Create elegant sequences for multiple elements:

**Cascade Delays**:
- First item: 0ms
- Second: 100–150ms
- Third: 200–300ms
- Formula: `delay = itemIndex * 100ms`

**Visual Effect**:
- Creates elegant reveal sequence
- Draws attention across items
- Feels coordinated, not random
- Max total stagger: 500–700ms

**HTML Data Attributes**:
```html
<div data-scroll-reveal style="--item-index: 0">Item 1</div>
<div data-scroll-reveal style="--item-index: 1">Item 2</div>
<div data-scroll-reveal style="--item-index: 2">Item 3</div>
```

### 7. Parallax & Depth Effects

Implement subtle parallax for visual interest:

**Subtle Parallax** (not distracting):
- Small offset (10–30px)
- Slower than scroll speed (0.5–0.8x)
- Only on desktop (skip mobile)
- Smooth, not jumpy

**Fixed Background** (alternative):
- Background image moves slower than foreground
- Creates depth perception
- Works on all devices
- `background-attachment: fixed` or JavaScript

**Depth Stacking**:
- Multiple layers move at different speeds
- Creates 3D illusion
- Keep movements subtle
- Use `will-change: transform` for performance

### 8. Accessibility Compliance

Ensure animations respect user preferences:

**prefers-reduced-motion**:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

**Focus & Keyboard**:
- Animations don't hide content
- Focus indicators always visible
- Keyboard navigation unaffected
- No animations block interaction

**Screen Readers**:
- Animated content is still readable
- ARIA live regions announce changes
- No hidden by animation
- Logical reading order maintained

**Contrast & Visibility**:
- Content visible before animation starts
- No animations that hide text
- Color remains distinguishable
- No flashing (< 3Hz)

### 9. Loading & Transition States

Provide feedback during async operations:

**Page Transitions**:
- Exit animation: Quick fade out (150–250ms)
- Enter animation: Fade in (300–400ms)
- Prevents jarring layout changes
- Smooth, continuous flow

**Content Loading**:
- Skeleton shimmer: 1.5s cycle
- Progress bar: Smooth animation
- Spinner: 1s rotation
- Message: "Loading..." text appears

**State Changes**:
- Smooth color transitions
- Scale or opacity changes
- Never instant/jarring
- Duration: 200–300ms

### 10. Testing & Optimization

Complete validation before deployment:

**Performance**:
- Test with DevTools Performance tab
- Verify 60fps (no frame drops)
- Check CPU usage (shouldn't spike)
- Test on mobile (low-end devices)
- Lighthouse: Performance ≥ 90

**Accessibility**:
- Test with `prefers-reduced-motion: reduce` enabled
- Keyboard navigation works
- Screen reader announces content
- Focus not lost during animations
- Color contrast maintained

**Cross-Browser**:
- Chrome, Firefox, Safari, Edge
- Test on actual devices
- Fallbacks for unsupported properties
- Graceful degradation

**Responsiveness**:
- Animations smooth on mobile
- Reduced/simplified on low-end devices
- Touch performance tested
- No jank on scroll

## UI Motion Design Rules

### Animation Duration Standards

**Fast Animations** (150–250ms):
- Micro-feedback, button clicks
- Loading indicator updates
- Quick visual changes

**Standard Animations** (300–400ms):
- Entrance animations, section reveals
- Most common duration
- Feels responsive and smooth

**Slower Animations** (500–700ms):
- Page transitions, major reveals
- Parallax effects
- Complex animations

**Loading States** (1–2s):
- Spinner rotations
- Progress bar fills
- Shimmer effects

### Easing Function Library

```css
/* Ease Out - Entrance animations */
ease-out: cubic-bezier(0.25, 0.46, 0.45, 0.94);

/* Ease In-Out - Scroll reveals */
ease-in-out: cubic-bezier(0.42, 0, 0.58, 1);

/* Ease In - Exit animations */
ease-in: cubic-bezier(0.42, 0, 1, 1);

/* Custom Bounce - Playful entrance */
bounce-ease: cubic-bezier(0.34, 1.56, 0.64, 1);

/* Custom Smooth - Elegant transitions */
smooth: cubic-bezier(0.37, 0, 0.63, 1);

/* Linear - Progress bars, spinners */
linear: cubic-bezier(0, 0, 1, 1);
```

### Performance Optimization Rules

**GPU-Accelerated Properties** (use these):
- `opacity`
- `transform: translate()`
- `transform: scale()`
- `transform: rotate()`

**Avoid These** (cause reflow/repaint):
- `width`, `height`
- `top`, `left`, `margin`, `padding`
- `background-color` (use opacity instead)
- `box-shadow` (use opacity shadows)

**Optimization Techniques**:
```css
/* Enable GPU acceleration */
will-change: transform, opacity;

/* Layer isolation for complex animations */
contain: layout style paint;
transform: translateZ(0); /* Forces GPU */

/* Disable will-change after animation */
animation: reveal 0.5s ease-out forwards;
```

### Stagger Delay Calculation

For N items appearing in sequence:

```
Item 0: 0ms
Item 1: 100ms
Item 2: 200ms
Item N: N × 100ms
```

**CSS Implementation**:
```css
.list-item {
  animation: slideIn 0.5s ease-out backwards;
  animation-delay: calc(100ms * var(--item-index));
}
```

### Color & Transition Rules

**Fade Animations**:
- Use `opacity` not `color` fade
- `opacity: 0 → 1` is GPU-accelerated
- Works in light/dark modes

**Color Transitions**:
- Duration: 200–300ms
- Easing: ease-in-out
- Never alone (combine with opacity or scale)

**Background Changes**:
- Use `opacity` overlay over background
- Avoid direct `background-color` transitions
- Maintain contrast during transition

## Code Examples

### Basic Fade In Entrance

```html
<section
  class="
    opacity-0
    animate-fadeIn
  "
  data-animate="entrance"
>
  <h2 class="text-3xl font-bold font-rajdhani text-gray-900 dark:text-[#E8EDF3]">
    Welcome to This Section
  </h2>
  <p class="text-gray-600 dark:text-[#9AABB8] mt-4">
    Content appears smoothly when page loads...
  </p>
</section>

<style>
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.4s ease-out forwards;
  }

  /* Respect motion preferences */
  @media (prefers-reduced-motion: reduce) {
    .animate-fadeIn {
      animation: none;
      opacity: 1;
    }
  }
</style>
```

### Fade + Slide In (Page Load)

```html
<div class="
  opacity-0
  translate-y-5
  animate-slideUp
">
  <div class="
    bg-white dark:bg-[#1A2230]
    rounded-xl p-8
    shadow-lg
  ">
    <h1 class="
      text-4xl font-bold font-rajdhani
      text-gray-900 dark:text-[#E8EDF3]
      mb-4
    ">
      Module Overview
    </h1>
    <p class="
      text-gray-600 dark:text-[#9AABB8]
      leading-7
    ">
      Learn the fundamentals of ROS 2...
    </p>
  </div>
</div>

<style>
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-slideUp {
    animation: slideUp 0.5s ease-out forwards;
  }

  @media (prefers-reduced-motion: reduce) {
    .animate-slideUp {
      animation: none;
      opacity: 1;
      transform: none;
    }
  }
</style>
```

### Scroll-Triggered Reveal (Intersection Observer)

```html
<section class="
  opacity-0
  translate-y-10
  transition-all duration-500 ease-out
" data-scroll-reveal>
  <h2 class="text-3xl font-bold mb-6 font-rajdhani text-gray-900 dark:text-[#E8EDF3]">
    Revealed on Scroll
  </h2>
  <p class="text-gray-600 dark:text-[#9AABB8] leading-7">
    This section appears when scrolled into view...
  </p>
</section>

<script>
  // Intersection Observer for scroll triggers
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Element is in viewport
        entry.target.classList.add('opacity-100', 'translate-y-0');
        // Only trigger once
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,  // Trigger when 10% visible
    rootMargin: '0px 0px -100px 0px' // Start 100px before visible
  });

  // Observe all reveal elements
  document.querySelectorAll('[data-scroll-reveal]').forEach(el => {
    observer.observe(el);
  });
</script>

<style>
  @media (prefers-reduced-motion: reduce) {
    [data-scroll-reveal] {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }
</style>
```

### Staggered List Animation

```html
<ul class="space-y-4">
  <li
    class="
      opacity-0
      translate-x-5
      animate-slideIn
    "
    style="--item-index: 0"
  >
    <div class="flex items-start gap-3">
      <span class="text-2xl text-[#00F0FF] flex-shrink-0">✓</span>
      <div>
        <h4 class="font-bold text-gray-900 dark:text-[#E8EDF3]">
          First Learning Point
        </h4>
        <p class="text-sm text-gray-600 dark:text-[#9AABB8]">
          Description of the first point...
        </p>
      </div>
    </div>
  </li>

  <li
    class="
      opacity-0
      translate-x-5
      animate-slideIn
    "
    style="--item-index: 1"
  >
    <div class="flex items-start gap-3">
      <span class="text-2xl text-[#00F0FF] flex-shrink-0">✓</span>
      <div>
        <h4 class="font-bold text-gray-900 dark:text-[#E8EDF3]">
          Second Learning Point
        </h4>
        <p class="text-sm text-gray-600 dark:text-[#9AABB8]">
          Description of the second point...
        </p>
      </div>
    </div>
  </li>

  <li
    class="
      opacity-0
      translate-x-5
      animate-slideIn
    "
    style="--item-index: 2"
  >
    <div class="flex items-start gap-3">
      <span class="text-2xl text-[#00F0FF] flex-shrink-0">✓</span>
      <div>
        <h4 class="font-bold text-gray-900 dark:text-[#E8EDF3]">
          Third Learning Point
        </h4>
        <p class="text-sm text-gray-600 dark:text-[#9AABB8]">
          Description of the third point...
        </p>
      </div>
    </div>
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
    animation-delay: calc(100ms * var(--item-index, 0));
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

### Card Grid with Staggered Entrance

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <article
    class="
      opacity-0
      scale-90
      animate-scaleIn
    "
    style="--card-index: 0"
  >
    <div class="
      bg-white dark:bg-[#1A2230]
      rounded-xl p-6
      shadow-md hover:shadow-lg
      transition-shadow duration-300
      h-full
    ">
      <div class="text-4xl mb-4">🚀</div>
      <h3 class="
        text-xl font-bold font-rajdhani
        text-gray-900 dark:text-[#E8EDF3]
        mb-3
      ">
        Topic 1
      </h3>
      <p class="
        text-gray-600 dark:text-[#9AABB8]
        text-sm leading-6
      ">
        Learn the fundamentals of this topic with hands-on examples...
      </p>
    </div>
  </article>

  <article
    class="
      opacity-0
      scale-90
      animate-scaleIn
    "
    style="--card-index: 1"
  >
    <div class="
      bg-white dark:bg-[#1A2230]
      rounded-xl p-6
      shadow-md hover:shadow-lg
      transition-shadow duration-300
      h-full
    ">
      <div class="text-4xl mb-4">🎯</div>
      <h3 class="
        text-xl font-bold font-rajdhani
        text-gray-900 dark:text-[#E8EDF3]
        mb-3
      ">
        Topic 2
      </h3>
      <p class="
        text-gray-600 dark:text-[#9AABB8]
        text-sm leading-6
      ">
        Advanced concepts and practical applications in real-world scenarios...
      </p>
    </div>
  </article>

  <article
    class="
      opacity-0
      scale-90
      animate-scaleIn
    "
    style="--card-index: 2"
  >
    <div class="
      bg-white dark:bg-[#1A2230]
      rounded-xl p-6
      shadow-md hover:shadow-lg
      transition-shadow duration-300
      h-full
    ">
      <div class="text-4xl mb-4">💡</div>
      <h3 class="
        text-xl font-bold font-rajdhani
        text-gray-900 dark:text-[#E8EDF3]
        mb-3
      ">
        Topic 3
      </h3>
      <p class="
        text-gray-600 dark:text-[#9AABB8]
        text-sm leading-6
      ">
        Expert tips and best practices for mastering the subject...
      </p>
    </div>
  </article>
</div>

<style>
  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.85);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .animate-scaleIn {
    animation: scaleIn 0.4s ease-out forwards;
    animation-delay: calc(100ms * var(--card-index, 0));
    will-change: transform, opacity;
  }

  @media (prefers-reduced-motion: reduce) {
    .animate-scaleIn {
      animation: none;
      opacity: 1;
      transform: none;
    }
  }
</style>
```

### Scroll-Reveal with Parallax Depth

```html
<section class="relative py-16 md:py-24 overflow-hidden">
  <!-- Background parallax layer -->
  <div class="
    absolute inset-0
    opacity-10
    pointer-events-none
  " data-parallax="0.5">
    <div class="text-9xl text-[#00F0FF] font-rajdhani">
      🤖
    </div>
  </div>

  <!-- Foreground content -->
  <div class="
    relative z-10
    max-w-4xl mx-auto px-4
    opacity-0 translate-y-10
  " data-scroll-reveal>
    <h2 class="
      text-4xl md:text-5xl font-bold font-rajdhani
      text-gray-900 dark:text-[#E8EDF3]
      mb-6
    ">
      The Future of Robotics
    </h2>

    <p class="
      text-lg text-gray-600 dark:text-[#9AABB8]
      leading-8 mb-6
    ">
      Physical AI combines cutting-edge machine learning with real-world robotics, opening unprecedented possibilities for automation and human-robot collaboration.
    </p>

    <button class="
      px-8 py-3
      bg-[#00F0FF] text-[#0A0E14]
      font-bold rounded-lg
      hover:shadow-lg transition-shadow
    ">
      Learn More
    </button>
  </div>
</section>

<script>
  // Scroll reveal
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100', 'translate-y-0');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('[data-scroll-reveal]').forEach(el => {
    revealObserver.observe(el);
  });

  // Parallax effect (desktop only)
  if (window.innerWidth >= 768) {
    window.addEventListener('scroll', () => {
      const parallaxElements = document.querySelectorAll('[data-parallax]');
      parallaxElements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax);
        el.style.transform = `translateY(${window.scrollY * speed}px)`;
      });
    }, { passive: true });
  }
</script>

<style>
  [data-scroll-reveal] {
    opacity: 0;
    transform: translateY(40px);
    transition-property: opacity, transform;
    transition-duration: 0.6s;
    transition-timing-function: ease-out;
    transition-delay: 0.1s;
  }

  [data-scroll-reveal].opacity-100 {
    opacity: 1;
    transform: translateY(0);
  }

  @media (prefers-reduced-motion: reduce) {
    [data-scroll-reveal] {
      transition: none;
      opacity: 1;
      transform: none;
    }
  }
</style>
```

### Page Transition (Entry Animation)

```html
<!-- Page wrapper with entrance animation -->
<div class="
  opacity-0
  animate-pageEnter
">
  <!-- Entire page content -->
  <header>...</header>
  <main>...</main>
  <footer>...</footer>
</div>

<style>
  @keyframes pageEnter {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .animate-pageEnter {
    animation: pageEnter 0.3s ease-in forwards;
  }

  @media (prefers-reduced-motion: reduce) {
    .animate-pageEnter {
      animation: none;
      opacity: 1;
    }
  }
</style>
```

### Loading State with Spinner + Text

```html
<div class="
  flex flex-col items-center justify-center
  py-12 gap-4
" data-loading-state="true">
  <!-- Spinner -->
  <div class="
    w-8 h-8
    border-4 border-gray-200 dark:border-[#374151]
    border-t-[#00F0FF]
    rounded-full
    animate-spin
  " role="status" aria-label="Loading"></div>

  <!-- Loading message -->
  <p class="
    text-gray-600 dark:text-[#9AABB8]
    animate-pulse
  ">
    Loading course content...
  </p>
</div>

<style>
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .animate-spin {
    animation: spin 1s linear infinite;
    will-change: transform;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .animate-spin,
    .animate-pulse {
      animation: none;
      opacity: 1;
    }
  }
</style>
```

### Reveal on Scroll with Multiple Elements

```html
<article class="max-w-4xl mx-auto px-4 py-12">
  <!-- Title revealed first -->
  <h1 class="
    text-4xl font-bold font-rajdhani
    text-gray-900 dark:text-[#E8EDF3]
    mb-8
    opacity-0 translate-y-10
  " data-scroll-reveal style="--reveal-delay: 0">
    Complete Guide to ROS 2
  </h1>

  <!-- Introductory paragraph -->
  <p class="
    text-lg text-gray-600 dark:text-[#9AABB8]
    leading-8 mb-12
    opacity-0 translate-y-10
  " data-scroll-reveal style="--reveal-delay: 100ms">
    Learn everything you need to know about Robot Operating System 2...
  </p>

  <!-- Three-column feature section -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
    <div class="
      opacity-0 translate-y-10
    " data-scroll-reveal style="--reveal-delay: 200ms">
      <div class="text-4xl mb-3">📚</div>
      <h3 class="font-bold text-gray-900 dark:text-[#E8EDF3] mb-2">
        Comprehensive
      </h3>
      <p class="text-sm text-gray-600 dark:text-[#9AABB8]">
        Complete coverage of ROS 2 concepts...
      </p>
    </div>

    <div class="
      opacity-0 translate-y-10
    " data-scroll-reveal style="--reveal-delay: 300ms">
      <div class="text-4xl mb-3">💻</div>
      <h3 class="font-bold text-gray-900 dark:text-[#E8EDF3] mb-2">
        Hands-On
      </h3>
      <p class="text-sm text-gray-600 dark:text-[#9AABB8]">
        Interactive examples and tutorials...
      </p>
    </div>

    <div class="
      opacity-0 translate-y-10
    " data-scroll-reveal style="--reveal-delay: 400ms">
      <div class="text-4xl mb-3">🚀</div>
      <h3 class="font-bold text-gray-900 dark:text-[#E8EDF3] mb-2">
        Advanced
      </h3>
      <p class="text-sm text-gray-600 dark:text-[#9AABB8]">
        Deep dive into advanced topics...
      </p>
    </div>
  </div>
</article>

<script>
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Get custom delay from style attribute
        const delay = entry.target.style.getPropertyValue('--reveal-delay') || '0';

        // Apply animation with delay
        setTimeout(() => {
          entry.target.classList.add('opacity-100', 'translate-y-0');
        }, parseInt(delay) || 0);

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('[data-scroll-reveal]').forEach(el => {
    observer.observe(el);
  });
</script>

<style>
  [data-scroll-reveal] {
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  }

  [data-scroll-reveal].opacity-100 {
    opacity: 1;
    transform: translateY(0);
  }

  @media (prefers-reduced-motion: reduce) {
    [data-scroll-reveal] {
      transition: none;
      opacity: 1;
      transform: none;
    }
  }
</style>
```

## Motion Animation Patterns

### Hero Section Entrance
```css
@keyframes heroSlideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.hero {
  animation: heroSlideDown 0.6s ease-out;
}
```

### Content Section Reveal
```css
@keyframes contentReveal {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.content-section {
  animation: contentReveal 0.5s ease-out both;
}
```

### Image Scale-In
```css
@keyframes imageScaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.lazy-image {
  animation: imageScaleIn 0.4s ease-out;
}
```

### Staggered List Cascade
```css
@keyframes listItemSlide {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
.list-item {
  animation: listItemSlide 0.5s ease-out backwards;
  animation-delay: calc(var(--index, 0) * 80ms);
}
```

### Emphasis Bounce
```css
@keyframes emphasize {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.08);
  }
}
.important {
  animation: emphasize 0.6s ease-in-out;
}
```

## Tools & Technologies

- **CSS Animations** — Keyframes for entrance, scroll reveals
- **CSS Transitions** — State changes, smooth updates
- **Intersection Observer API** — Scroll triggers (performance)
- **requestAnimationFrame** — Custom animations (if needed)
- **Transform & Opacity** — GPU-accelerated properties
- **CSS Variables** — Dynamic delays and parameters
- **Chrome DevTools**:
  - Performance tab (60fps validation)
  - Rendering tab (paint flashing)
  - CPU Throttling (mobile simulation)
- **Lighthouse** — Performance audit (≥90 target)
- **Accessibility Testing**:
  - `prefers-reduced-motion` validation
  - Screen reader compatibility
  - Keyboard navigation verification

## Constraints & Requirements

✅ **Must Do:**
- Respect `prefers-reduced-motion` (disable animations)
- Use GPU-accelerated properties (`transform`, `opacity`)
- Maintain 60fps performance
- Test on mobile with CPU throttling
- Include keyboard accessibility
- Support light and dark modes
- Validate with Lighthouse ≥ 90
- Provide semantic HTML
- Use Intersection Observer for scroll triggers
- Document animation purpose
- Keep durations 300–500ms (optimal)
- Test on actual devices

❌ **Must NOT Do:**
- Animate non-GPU properties (`width`, `height`, `margin`, `padding`)
- Remove or ignore `prefers-reduced-motion`
- Create animations that hide content
- Use animations without purpose
- Block interaction with animations
- Create layout shifts
- Use auto-play videos instead of animations
- Ignore accessibility
- Skip performance testing
- Create infinite animations (except loading)
- Use animations that distract from content

## Acceptance Criteria

- [ ] All animations run at 60fps (no jank, smooth)
- [ ] Animations serve clear narrative purpose
- [ ] Duration appropriate (300–500ms standard)
- [ ] Easing functions enhance motion quality
- [ ] Entrance animations start instantly on load
- [ ] Scroll reveals trigger at appropriate threshold
- [ ] Staggered animations cascade elegantly
- [ ] `prefers-reduced-motion` fully respected
- [ ] Focus indicators visible during animations
- [ ] Keyboard navigation fully functional
- [ ] Screen reader announces content correctly
- [ ] No layout shifts during/after animations
- [ ] GPU acceleration used (no reflow/repaint)
- [ ] Cross-browser compatible (Chrome, Firefox, Safari, Edge)
- [ ] Mobile performance verified with throttling
- [ ] Parallax effects subtle and performant
- [ ] Loading states clear and non-distracting
- [ ] Page transitions smooth and fast
- [ ] Color contrast maintained during animations
- [ ] No flickering or visual glitches
- [ ] Lighthouse performance score ≥ 90
- [ ] Light and dark modes both animated correctly
- [ ] Touch interactions smooth on mobile
- [ ] Animations enhance UX, don't distract
- [ ] Multiple animations don't overlap confusingly

## Performance Checklist

- [ ] No animations on reflow-causing properties
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
- [ ] Memory usage doesn't increase with animation
- [ ] CPU usage doesn't spike
- [ ] Smooth performance on throttled devices

## Accessibility Checklist

- [ ] `prefers-reduced-motion` implemented
- [ ] Animations don't remove focus indicators
- [ ] No color-only animation feedback
- [ ] Focus states clearly visible
- [ ] Keyboard navigation unaffected
- [ ] Screen reader announcements not disrupted
- [ ] No flickering animations (< 3Hz)
- [ ] Animations enhance storytelling
- [ ] Content visible before animation starts
- [ ] Animations don't block interaction
- [ ] Alt text/labels for animated elements
- [ ] Sufficient color contrast maintained
- [ ] Touch targets unaffected by animation
- [ ] Tab order logical and consistent
- [ ] ARIA live regions for state changes

---

Save it as `.claude/skills/ui-motion/skill.md`
