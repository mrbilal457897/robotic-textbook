---
name: ui-animations
description: Add subtle animations and interactions to textbook pages without harming performance. Create CSS-based animations for cards, diagrams, and sections that improve engagement while respecting accessibility constraints and maintaining Lighthouse scores above 90 for the Physical AI & Humanoid Robotics Interactive Textbook.
---

# UI Animations Skill

## Overview

This skill enables the creation of subtle, purposeful animations and interactions that enhance textbook engagement without introducing performance overhead or accessibility issues. It focuses on CSS-based animations, lightweight transitions, and animation patterns that maintain high performance standards while respecting user preferences for reduced motion.

## When to Use This Skill

- When pages feel static or lack visual feedback
- When adding entrance animations to content blocks
- When enhancing hover interactions on interactive elements
- When creating scroll-triggered animations for diagrams
- When adding loading or completion states
- When improving feedback for user interactions (clicks, hovers)
- When animating transitions between page states

## Core Animation Principles

### Purposeful Motion
- Every animation should serve a purpose (draw attention, provide feedback, improve clarity)
- Avoid decorative motion that doesn't enhance user experience
- Animations should clarify relationships or hierarchies
- Use motion to guide user attention to important content

### Performance-First
- Use CSS transforms and opacity for GPU acceleration
- Avoid animating layout properties (width, height, position)
- Keep animations under 300ms for snappy feel
- Minimize repaints and reflows
- Test with DevTools Performance tab

### Accessibility Compliance
- Respect `prefers-reduced-motion` media query
- Provide non-animated fallbacks
- Never hide essential content behind animation
- Don't use rapid blinking or flashing (> 3 Hz)
- Allow users to skip or pause animations

### Subtle & Non-Distracting
- Use opacity and transform over scale
- Keep animation intensity low (avoid exaggerated movements)
- Use easing functions that feel natural
- Avoid multiple simultaneous animations on same element
- Let animations enhance, not distract from content

## Step-by-Step Animation Implementation Workflow

### Phase 1: Planning & Design

**1.1 Define Animation Purpose**
- Identify what the animation should communicate
- Determine if animation is decorative, informational, or feedback
- Consider whether animation is necessary
- Document animation goal in 1–2 sentences
- Sketch animation storyboard (rough frames)

**1.2 Select Animation Type**
- **Entrance**: Content appearing on page load or scroll
- **Hover**: Interactive feedback on element interaction
- **Transition**: Smooth change between states
- **Scroll**: Animation triggered by user scrolling
- **Loading**: Feedback during async operations
- **Success/Error**: Confirmation or problem indication

**1.3 Choose Animation Properties**
- **Opacity**: Fade in/out (best for GPU)
- **Transform**: Scale, translate, rotate (best for GPU)
- **Color**: Background or text color shifts
- **Box-shadow**: Elevation and depth changes
- **Avoid**: Width, height, position, padding (cause reflows)

**1.4 Plan Timing & Easing**
- Duration: 150ms–300ms for interactions, up to 500ms for entrance
- Easing: `ease-out` for entrance, `ease-in-out` for transitions
- Stagger: Multiple elements with 50–100ms delays
- Sequence: Plan if animations happen together or in sequence

**1.5 Plan Accessibility**
- Add `prefers-reduced-motion: reduce` support
- Plan fallback for users with motion disabled
- Ensure animation doesn't affect content structure
- Test with screen readers
- Verify focus management

### Phase 2: CSS Animation Implementation

**2.1 Create Base Animation Classes**
```css
/* Entrance Animations */
@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideInLeft {
    from {
        opacity: 0;
        transform: translateX(-20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes scaleIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

/* Apply animations */
.fade-in {
    animation: fadeIn 300ms ease-out;
}

.slide-in-up {
    animation: slideInUp 300ms ease-out;
}

.slide-in-left {
    animation: slideInLeft 300ms ease-out;
}

.scale-in {
    animation: scaleIn 300ms ease-out;
}
```

**2.2 Create Transition Utilities**
```css
/* Quick utility classes for transitions */
.transition-all {
    transition: all 200ms ease-in-out;
}

.transition-colors {
    transition: background-color 200ms ease-in-out, color 200ms ease-in-out;
}

.transition-opacity {
    transition: opacity 200ms ease-in-out;
}

.transition-transform {
    transition: transform 200ms ease-in-out;
}

.transition-shadow {
    transition: box-shadow 200ms ease-in-out;
}

.transition-slow {
    transition: all 300ms ease-in-out;
}

.transition-fast {
    transition: all 150ms ease-in-out;
}
```

**2.3 Add Hover Interaction States**
```css
/* Hover lift effect for cards */
.card-interactive {
    transition: all 200ms ease-out;
    cursor: pointer;
}

.card-interactive:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.card-interactive:active {
    transform: translateY(-2px);
}

/* Button hover effects */
.button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.button:active {
    transform: translateY(0);
}

/* Link underline animation */
.link-animated {
    position: relative;
    text-decoration: none;
    color: #2563eb;
}

.link-animated::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: #2563eb;
    transition: width 200ms ease-out;
}

.link-animated:hover::after {
    width: 100%;
}
```

**2.4 Implement Accessibility Support**
```css
/* Respect user preferences for reduced motion */
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}

/* Alternative: subtle opacity change instead of motion */
@media (prefers-reduced-motion: reduce) {
    .fade-in,
    .slide-in-up,
    .slide-in-left,
    .scale-in {
        animation: none;
        opacity: 1;
        transform: none;
    }
}

/* Disable animations for users with specific preferences */
@media (prefers-reduced-motion: reduce) {
    .card-interactive:hover {
        transform: none;
    }

    .button:hover {
        transform: none;
    }
}
```

### Phase 3: Advanced Animation Patterns

**3.1 Staggered Animation (Multiple Elements)**
```css
/* Stagger effect for list items */
@keyframes slideInUpStagger {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.list-item {
    animation: slideInUpStagger 300ms ease-out backwards;
}

.list-item:nth-child(1) { animation-delay: 0ms; }
.list-item:nth-child(2) { animation-delay: 50ms; }
.list-item:nth-child(3) { animation-delay: 100ms; }
.list-item:nth-child(4) { animation-delay: 150ms; }
.list-item:nth-child(5) { animation-delay: 200ms; }
```

**3.2 Loading Animation**
```css
@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(37, 99, 235, 0.2);
    border-top-color: #2563eb;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
    .spinner {
        animation: none;
        opacity: 0.5;
    }
}
```

**3.3 Pulse Animation (Attention)**
```css
@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.7;
    }
}

.pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@media (prefers-reduced-motion: reduce) {
    .pulse {
        animation: none;
        opacity: 1;
    }
}
```

**3.4 Bounce Animation (Emphasis)**
```css
@keyframes bounce {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}

.bounce {
    animation: bounce 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
}

@media (prefers-reduced-motion: reduce) {
    .bounce {
        animation: none;
    }
}
```

**3.5 Smooth Scroll-Triggered Animation**
```css
/* Intersection Observer with animation class */
.scroll-fade-in {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 600ms ease-out, transform 600ms ease-out;
}

.scroll-fade-in.visible {
    opacity: 1;
    transform: translateY(0);
}

/* Minimal JavaScript for scroll animation */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('.scroll-fade-in').forEach(el => {
    observer.observe(el);
});
```

### Phase 4: MDX Component Animation

**4.1 Create Animated React Components**
```jsx
// src/components/AnimatedCard.jsx
import React from 'react';
import styles from './AnimatedCard.module.css';

export default function AnimatedCard({ children, delay = 0 }) {
    return (
        <div
            className={styles.animatedCard}
            style={{
                animationDelay: `${delay}ms`,
            }}
        >
            {children}
        </div>
    );
}
```

```css
/* src/components/AnimatedCard.module.css */
.animatedCard {
    animation: slideInUp 300ms ease-out;
    animation-fill-mode: both;
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (prefers-reduced-motion: reduce) {
    .animatedCard {
        animation: none;
        opacity: 1;
        transform: none;
    }
}
```

**4.2 Animated Diagram Component**
```jsx
// src/components/AnimatedDiagram.jsx
export default function AnimatedDiagram({ src, alt }) {
    return (
        <div className="diagram-container">
            <img
                src={src}
                alt={alt}
                className="diagram-animated"
                loading="lazy"
            />
        </div>
    );
}
```

```css
.diagram-container {
    margin: 2rem 0;
    overflow: hidden;
    border-radius: 8px;
}

.diagram-animated {
    width: 100%;
    height: auto;
    animation: fadeIn 400ms ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
```

**4.3 Interactive Section Component**
```jsx
// src/components/InteractiveSection.jsx
import React, { useState } from 'react';
import styles from './InteractiveSection.module.css';

export default function InteractiveSection({ title, children }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className={styles.section}>
            <button
                className={styles.toggle}
                onClick={() => setIsExpanded(!isExpanded)}
                aria-expanded={isExpanded}
            >
                {title}
                <span className={styles.icon}>▼</span>
            </button>
            {isExpanded && (
                <div className={styles.content}>
                    {children}
                </div>
            )}
        </div>
    );
}
```

```css
/* src/components/InteractiveSection.module.css */
.section {
    margin: 1.5rem 0;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
}

.toggle {
    width: 100%;
    padding: 1rem;
    background: #f9fafb;
    border: none;
    border-bottom: 1px solid #e5e7eb;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background-color 200ms ease-out;
}

.toggle:hover {
    background: #f3f4f6;
}

.icon {
    display: inline-block;
    transition: transform 200ms ease-out;
}

.toggle[aria-expanded="true"] .icon {
    transform: rotate(180deg);
}

.content {
    padding: 1.5rem;
    animation: slideDown 300ms ease-out;
}

@keyframes slideDown {
    from {
        opacity: 0;
        max-height: 0;
    }
    to {
        opacity: 1;
        max-height: 1000px;
    }
}

@media (prefers-reduced-motion: reduce) {
    .toggle,
    .icon,
    .content {
        transition: none;
        animation: none;
    }
}
```

### Phase 5: Performance Optimization

**5.1 GPU-Accelerated Animations**
```css
/* Good: GPU-accelerated properties */
.card:hover {
    /* These properties are GPU-accelerated */
    transform: translateY(-4px);
    opacity: 0.95;
    filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1));
}

/* Bad: Not GPU-accelerated */
.card:hover {
    /* These cause reflows and repaints */
    height: 300px;
    width: 250px;
    margin-top: 10px;
    padding: 20px;
}
```

**5.2 will-change Optimization**
```css
/* Use will-change sparingly (only for animated elements) */
.card-animated {
    will-change: transform, opacity;
    animation: slideIn 300ms ease-out;
}

/* Remove will-change after animation */
.card-animated {
    will-change: auto;
}
```

**5.3 containment for Performance**
```css
/* Use CSS containment to improve performance */
.card {
    contain: layout style paint;
    animation: fadeIn 300ms ease-out;
}

.list-item {
    contain: layout style paint;
    animation: slideInUp 300ms ease-out backwards;
}
```

**5.4 Debounce Scroll Animations**
```javascript
// Debounce scroll event handler
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateScrollAnimations();
            ticking = false;
        });
        ticking = true;
    }
});

function updateScrollAnimations() {
    document.querySelectorAll('.scroll-animate').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            el.classList.add('visible');
        }
    });
}
```

### Phase 6: Testing & Validation

**6.1 Accessibility Testing**
- [ ] Test with `prefers-reduced-motion` enabled
- [ ] Verify animations don't prevent content access
- [ ] Test with screen readers (animations shouldn't break reading)
- [ ] Verify focus management during animations
- [ ] Check animation duration ≤ 300ms

**6.2 Performance Testing**
- [ ] Run Lighthouse audit (should score ≥ 90)
- [ ] Check DevTools Performance tab for jank
- [ ] Monitor CPU usage during animations
- [ ] Verify 60fps performance on low-end devices
- [ ] Test animations with "Slow 3G" network throttling

**6.3 Cross-Browser Testing**
- [ ] Chrome/Chromium (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

**6.4 Visual Regression Testing**
- [ ] Screenshot compare with/without animations
- [ ] Verify animations are consistent across browsers
- [ ] Check for visual glitches or stuttering
- [ ] Validate color rendering across devices

## Animation Examples

### Example 1: Card Entrance Animation

```jsx
<div className="card-wrapper">
    <div className="card card-fade-in">
        <img src="module.jpg" alt="Module" />
        <h3>ROS 2 Fundamentals</h3>
        <p>Learn the basics of Robot Operating System 2.</p>
    </div>
</div>
```

```css
.card {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
}

.card-fade-in {
    animation: fadeInUp 400ms ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (prefers-reduced-motion: reduce) {
    .card-fade-in {
        animation: none;
        opacity: 1;
        transform: none;
    }
}
```

---

### Example 2: Hover Lift & Shadow

```jsx
<a href="/lesson" className="lesson-card">
    <div className="lesson-icon">📚</div>
    <h4>Lesson Title</h4>
    <p>Click to explore this lesson</p>
</a>
```

```css
.lesson-card {
    display: block;
    padding: 1.5rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    text-decoration: none;
    color: inherit;
    cursor: pointer;

    /* Enable smooth transitions */
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.lesson-card:hover {
    /* Lift the card up */
    transform: translateY(-6px);
    /* Deepen the shadow */
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.lesson-card:active {
    /* Slight press-down feedback */
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
}

.lesson-icon {
    font-size: 2rem;
    margin-bottom: 0.75rem;
    transition: transform 200ms;
}

.lesson-card:hover .lesson-icon {
    transform: scale(1.1);
}

@media (prefers-reduced-motion: reduce) {
    .lesson-card,
    .lesson-icon {
        transition: none;
    }

    .lesson-card:hover,
    .lesson-card:active {
        transform: none;
    }

    .lesson-card:hover .lesson-icon {
        transform: none;
    }
}
```

---

### Example 3: Staggered List Animation

```jsx
<div className="lesson-grid">
    <div className="lesson-item" style={{ '--delay': '0ms' }}>
        Lesson 1
    </div>
    <div className="lesson-item" style={{ '--delay': '50ms' }}>
        Lesson 2
    </div>
    <div className="lesson-item" style={{ '--delay': '100ms' }}>
        Lesson 3
    </div>
    <div className="lesson-item" style={{ '--delay': '150ms' }}>
        Lesson 4
    </div>
</div>
```

```css
.lesson-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
}

.lesson-item {
    padding: 1.5rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);

    /* Staggered entrance animation */
    animation: slideInUp 400ms ease-out backwards;
    animation-delay: var(--delay);
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (prefers-reduced-motion: reduce) {
    .lesson-item {
        animation: none;
        opacity: 1;
        transform: none;
    }
}
```

---

### Example 4: Loading State Animation

```jsx
<div className="loading-container">
    <div className="spinner"></div>
    <p>Loading simulation environment...</p>
</div>
```

```css
@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.spinner {
    width: 48px;
    height: 48px;
    border: 4px solid rgba(37, 99, 235, 0.2);
    border-top-color: #2563eb;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 2rem auto;
}

/* Provide loading indicator for users with reduced motion */
@media (prefers-reduced-motion: reduce) {
    .spinner {
        animation: none;
        border-top-color: #2563eb;
        opacity: 0.7;
    }
}
```

---

### Example 5: Scroll-Triggered Diagram Animation

```jsx
<div className="diagram-wrapper">
    <img
        src="robot-architecture.svg"
        alt="Robot system architecture"
        className="diagram-scroll-fade"
    />
</div>
```

```javascript
// Initialize scroll animation observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Unobserve after animation completes
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1  // Trigger when 10% visible
});

// Observe all diagrams
document.querySelectorAll('.diagram-scroll-fade').forEach(el => {
    observer.observe(el);
});
```

```css
.diagram-scroll-fade {
    width: 100%;
    height: auto;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 600ms ease-out, transform 600ms ease-out;
}

.diagram-scroll-fade.visible {
    opacity: 1;
    transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
    .diagram-scroll-fade {
        opacity: 1;
        transform: none;
        transition: none;
    }
}
```

---

### Example 6: Button Click Feedback Animation

```jsx
<button className="button button-primary">
    <span className="button-text">Start Simulation</span>
    <span className="button-ripple"></span>
</button>
```

```css
.button {
    position: relative;
    overflow: hidden;
    padding: 0.75rem 1.5rem;
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 200ms;
}

.button:hover {
    background: #1e40af;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    transform: translateY(-2px);
}

.button:active {
    transform: translateY(0);
}

/* Ripple effect on click */
.button-ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    transform: scale(0);
    pointer-events: none;
}

.button:active .button-ripple {
    animation: ripple 600ms ease-out;
}

@keyframes ripple {
    from {
        width: 40px;
        height: 40px;
        opacity: 1;
        transform: scale(0);
    }
    to {
        width: 400px;
        height: 400px;
        opacity: 0;
        transform: scale(1);
    }
}

@media (prefers-reduced-motion: reduce) {
    .button,
    .button-ripple {
        transition: none;
        animation: none;
    }

    .button:hover {
        transform: none;
    }
}
```

---

### Example 7: Smooth Color Transition

```jsx
<div className="status-badge status-success">
    ✓ Simulation Ready
</div>
```

```css
.status-badge {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: 600;
    transition: background-color 300ms, color 300ms;
}

.status-success {
    background-color: #dcfce7;
    color: #166534;
}

.status-warning {
    background-color: #fef08a;
    color: #92400e;
}

.status-error {
    background-color: #fee2e2;
    color: #991b1b;
}

/* Smooth transition when status changes */
.status-badge.updating {
    background-color: #eff6ff;
    color: #1e40af;
}
```

## Tools & Techniques

### CSS Animation Tools
- **Chrome DevTools** — Inspect animations, debug performance
- **Firefox Developer Tools** — Animation timeline debugging
- **Safari DevTools** — Cross-browser animation testing
- **Lighthouse** — Performance and animation impact scoring

### Testing Tools
- **Accessibility Inspector** — Verify WCAG compliance
- **Screen Reader Tests** — NVDA, JAWS, VoiceOver
- **Motion Testing** — prefers-reduced-motion testing
- **Performance Profiler** — GPU utilization and frame rate

### Design & Prototyping
- **Figma** — Design animations before implementation
- **Excalidraw** — Quick animation storyboards
- **CodePen** — Test animations in isolation
- **Browser DevTools** — Real-time animation tweaking

### Performance Monitoring
- **Lighthouse CI** — Automated performance testing
- **WebPageTest** — Detailed animation performance
- **GTmetrix** — Animation impact analysis
- **Chrome User Experience Report** — Real-world metrics

## Animation Best Practices

### Duration Guidelines
- **Micro-interactions** (100–150ms): Button clicks, hover states
- **Transitions** (200–300ms): Card reveals, state changes
- **Entrance animations** (300–500ms): Page loads, scroll reveals
- **Loading states** (600–800ms): Subtle pulses, spinners
- **Max**: Never exceed 500ms for entrance, 300ms for interactions

### Easing Function Selection
- `ease-out`: Entry animations (element appears)
- `ease-in-out`: Transitions (smooth state changes)
- `ease-in`: Exit animations (element disappears)
- `cubic-bezier(0.4, 0, 0.2, 1)`: Premium smooth easing
- Avoid: `linear` (feels robotic)

### GPU Acceleration Checklist
- ✅ Use `transform: translateY()`, `translateX()`, `translate3d()`
- ✅ Use `opacity` changes
- ✅ Use `filter` effects
- ❌ Avoid animating: `width`, `height`, `top`, `left`, `margin`, `padding`
- ❌ Avoid `background-position` for backgrounds (use `transform`)

### Accessibility Checklist
- ✅ Respect `prefers-reduced-motion`
- ✅ Keep animations < 300ms for interactions
- ✅ Provide non-animated fallback
- ✅ Avoid flashing > 3 Hz
- ✅ Test with keyboard navigation
- ✅ Verify screen reader announcements
- ❌ Don't hide content behind animation
- ❌ Don't auto-play animations

## Acceptance Criteria

- [ ] All animations respect `prefers-reduced-motion`
- [ ] Animations are smooth (60fps on standard devices)
- [ ] Animation duration ≤ 300ms for interactions, ≤ 500ms for entrance
- [ ] GPU acceleration used (no layout thrashing)
- [ ] Lighthouse performance score ≥ 90
- [ ] No console warnings or errors
- [ ] Keyboard navigation works with animations
- [ ] Screen readers announce animated content
- [ ] Color contrast maintained during animations
- [ ] Animations tested on 3+ devices
- [ ] Animations tested in light and dark modes
- [ ] No rapid blinking or flashing (> 3 Hz)
- [ ] Fallback content visible without animations
- [ ] Cross-browser compatibility verified
- [ ] Animations enhance, not distract from content

## Quality Checklist

**Animation Design:**
- [ ] Every animation has a clear purpose
- [ ] Animation duration feels natural
- [ ] Easing function is appropriate for animation type
- [ ] Animations are consistent across component
- [ ] Staggering (if used) feels intentional

**Performance:**
- [ ] Using GPU-accelerated properties
- [ ] No unnecessary repaints or reflows
- [ ] Animations perform well on low-end devices
- [ ] Lighthouse scores maintained ≥ 90
- [ ] DevTools shows smooth 60fps

**Accessibility:**
- [ ] `prefers-reduced-motion` respected
- [ ] Animations don't block content access
- [ ] Keyboard navigation unaffected
- [ ] Screen reader announcements clear
- [ ] Focus management during animations

**Code Quality:**
- [ ] CSS organized and commented
- [ ] Animation classes follow naming convention
- [ ] No hardcoded durations (use variables)
- [ ] JavaScript minimal and well-documented
- [ ] Fallbacks for animation support

---

Save it as `.claude/skills/ui-animations/skill.md`
