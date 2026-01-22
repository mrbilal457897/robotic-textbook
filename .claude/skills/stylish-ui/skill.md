---
name: stylish-ui
description: Design modern, stylish, and accessible UI components for Docusaurus documentation pages. Create responsive cards, buttons, badges, and callouts with smooth animations while maintaining academic readability and WCAG accessibility standards for the Physical AI & Humanoid Robotics Interactive Textbook.
---

# Stylish UI Skill

## Overview

This skill enables the creation of modern, visually compelling UI components for Docusaurus documentation pages. It combines contemporary design patterns with accessibility best practices to enhance the textbook's visual presence while maintaining academic integrity and content readability.

## When to Use This Skill

- When existing UI looks outdated or lacks visual polish
- When enhancing visual clarity and hierarchy of content
- When designing module cards, lesson previews, or feature sections
- When creating interactive elements that need visual enhancement
- When building consistent design systems across documentation
- When improving user engagement through modern aesthetics

## Core Design Principles

### Modern Aesthetics
- Clean, minimalist designs with purposeful whitespace
- Subtle gradients and layered shadows for depth
- Smooth transitions (200–300ms) for all interactive elements
- Color-coordinated visual hierarchy
- Consistent typography and spacing scales

### Academic Readability
- Typography that prioritizes clarity over style
- Sufficient contrast ratios (WCAG AA: 4.5:1 minimum)
- Line lengths optimized for reading (50–75 characters)
- Generous padding and margins for visual breathing room
- Hierarchy that guides readers through content

### Responsive & Accessible
- Mobile-first design approach
- Touch-friendly interaction targets (minimum 44×44px)
- Keyboard navigation support
- ARIA labels and semantic HTML
- `prefers-reduced-motion` support for animations

### Performance-Optimized
- Minimal CSS/JavaScript overhead
- CSS variables for theming and consistency
- Lazy-loaded images where applicable
- Optimized animation performance (GPU acceleration)
- Efficient DOM structure avoiding redundancy

## Step-by-Step UI Design Workflow

### Phase 1: Component Planning

**1.1 Define Component Purpose**
- Identify the component type (card, button, badge, callout, etc.)
- Write a one-sentence purpose statement
- List use cases within the textbook (e.g., "Module preview cards")
- Determine content structure (what data goes inside?)
- Sketch initial layout (wireframe)

**1.2 Analyze Design Context**
- Review existing textbook design system
- Check current color palette and typography
- Identify similar components already in use
- Note accessibility requirements
- Document responsive breakpoints needed

**1.3 Plan Interaction States**
- Default state (static appearance)
- Hover state (desktop interaction)
- Active/Focus state (keyboard navigation)
- Disabled state (if applicable)
- Dark mode variant (if supported)

**1.4 Define Layout Breakpoints**
- Mobile: < 640px (single column, touch-friendly)
- Tablet: 640px–1024px (two columns, balanced)
- Desktop: > 1024px (multi-column, expanded content)
- Ultra-wide: > 1440px (premium layout)

### Phase 2: Visual Design

**2.1 Choose Color Scheme**
- Primary color: Brand/action color (blue, indigo)
- Secondary color: Accent/alternative (accent shade)
- Neutral palette: Grays for backgrounds and text
- Semantic colors: Green (success), Amber (warning), Red (error)
- Ensure sufficient contrast ratios (WCAG AA)

**2.2 Define Typography**
- Heading font: Bold, larger scale (24–48px)
- Body font: Regular, readable size (14–18px)
- Monospace font: Code/technical content (12–14px)
- Line height: 1.5–1.6 for body text
- Letter spacing: Subtle tightening for headings

**2.3 Establish Spacing Scale**
- Base unit: 4px or 8px
- Scale progression: 4, 8, 12, 16, 24, 32, 48, 64px
- Padding: Internal spacing within components
- Margin: External spacing between components
- Gap: Spacing in flexbox/grid layouts

**2.4 Plan Shadow & Elevation**
- Subtle shadow: `0 1px 2px rgba(0,0,0,0.05)` (baseline)
- Medium shadow: `0 4px 6px rgba(0,0,0,0.1)` (elevated)
- Strong shadow: `0 10px 15px rgba(0,0,0,0.15)` (prominent)
- Hover elevation: Increase shadow on interaction
- Dark mode adjustment: Adjust opacity for visibility

### Phase 3: CSS Implementation

**3.1 Set Up CSS Architecture**
```css
/* Define CSS variables for theming */
:root {
    /* Colors */
    --color-primary: #2563eb;
    --color-primary-dark: #1e40af;
    --color-secondary: #4f46e5;
    --color-gray-900: #111827;
    --color-gray-100: #f9fafb;

    /* Typography */
    --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    --font-mono: 'Courier New', monospace;

    /* Spacing */
    --space-xs: 0.25rem;
    --space-sm: 0.5rem;
    --space-md: 1rem;
    --space-lg: 1.5rem;
    --space-xl: 2rem;
    --space-2xl: 3rem;

    /* Shadows */
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.15);

    /* Transitions */
    --transition-fast: 150ms ease-in-out;
    --transition-base: 200ms ease-in-out;
    --transition-slow: 300ms ease-in-out;

    /* Border radius */
    --radius-sm: 0.375rem;
    --radius-md: 0.5rem;
    --radius-lg: 0.75rem;
    --radius-xl: 1rem;
}

/* Dark mode support */
[data-theme='dark'] {
    --color-primary: #3b82f6;
    --color-gray-900: #f3f4f6;
    --color-gray-100: #1f2937;
}
```

**3.2 Create Base Component Styles**
```css
.component {
    /* Layout */
    display: flex;
    flex-direction: column;
    align-items: stretch;

    /* Typography */
    font-family: var(--font-sans);
    font-size: 1rem;
    line-height: 1.5;
    color: var(--color-gray-900);

    /* Spacing */
    padding: var(--space-md);
    margin: 0;

    /* Visual */
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);

    /* Interaction */
    transition: all var(--transition-base);
    cursor: pointer;
}

.component:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
}

.component:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
}
```

**3.3 Implement Responsive Styles**
```css
/* Mobile-first (default) */
.grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-md);
}

/* Tablet */
@media (min-width: 640px) {
    .grid {
        grid-template-columns: repeat(2, 1fr);
        gap: var(--space-lg);
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .grid {
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-xl);
    }
}
```

**3.4 Add Animation Support**
```css
/* Smooth transitions */
@media (prefers-reduced-motion: no-preference) {
    .interactive {
        transition: all var(--transition-base);
    }

    .interactive:hover {
        transform: scale(1.02);
    }
}

/* Respect prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
    .interactive {
        transition: none;
        animation: none;
    }
}

/* Fade-in animation */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-in {
    animation: fadeIn var(--transition-slow);
}
```

### Phase 4: Component-Specific Design

**4.1 Design Cards**
- Purpose: Container for grouped content
- Key elements: Header, image, body, footer
- Hover behavior: Subtle elevation and shadow increase
- Use cases: Module cards, lesson previews, feature highlights

**4.2 Design Buttons**
- Variants: Primary, secondary, ghost, danger
- States: Default, hover, active, disabled, focus
- Sizes: Small, medium, large
- Icons: Support inline icons with proper spacing

**4.3 Design Badges**
- Purpose: Label or status indicator
- Variants: Primary, secondary, success, warning, error
- Sizes: Small and medium
- Styling: Pill-shaped with contrasting background/text

**4.4 Design Callouts**
- Purpose: Highlight important information
- Types: Info, tip, warning, danger, note
- Structure: Icon, title, body content
- Styling: Left-side accent color bar or background tint

### Phase 5: Accessibility & Testing

**5.1 Verify Accessibility**
- [ ] Color contrast ≥ 4.5:1 for normal text
- [ ] Color contrast ≥ 3:1 for large text
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Screen reader announces interactive elements
- [ ] Focus indicators visible and clear
- [ ] Icons have alt text or ARIA labels
- [ ] Form inputs have labels

**5.2 Responsive Testing**
- [ ] Test on mobile (375px width)
- [ ] Test on tablet (768px width)
- [ ] Test on desktop (1024px width)
- [ ] Test on ultra-wide (1440px width)
- [ ] Test touch interactions on real devices
- [ ] Verify text readability at all sizes

**5.3 Cross-Browser Testing**
- [ ] Chrome/Chromium (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

**5.4 Performance Testing**
- [ ] Lighthouse score ≥ 90
- [ ] First Contentful Paint (FCP) < 2s
- [ ] Cumulative Layout Shift (CLS) < 0.1
- [ ] No unused CSS/JavaScript
- [ ] Images optimized and lazy-loaded

### Phase 6: Docusaurus Integration

**6.1 Create MDX Components**
```jsx
// src/components/ModuleCard.jsx
export default function ModuleCard({ title, description, icon, link }) {
  return (
    <a href={link} className="module-card">
      <div className="module-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="module-footer">
        Learn More →
      </div>
    </a>
  );
}
```

**6.2 Add Component Styling**
```css
/* src/css/components/module-card.css */
.module-card {
    display: flex;
    flex-direction: column;
    padding: var(--space-xl);
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    transition: all var(--transition-base);
    text-decoration: none;
    color: inherit;
}

.module-card:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-4px);
    border-color: var(--color-primary);
}

.module-icon {
    font-size: 2rem;
    margin-bottom: var(--space-md);
}

.module-card h3 {
    margin: 0 0 var(--space-sm) 0;
    font-size: 1.25rem;
    font-weight: 600;
}

.module-card p {
    margin: 0 0 var(--space-lg) 0;
    flex-grow: 1;
    color: #6b7280;
    line-height: 1.6;
}

.module-footer {
    color: var(--color-primary);
    font-weight: 500;
}
```

**6.3 Update docusaurus.config.js**
```javascript
// docusaurus.config.js
module.exports = {
  // ... other config
  presets: [
    [
      'classic',
      {
        docs: {
          // ... docs config
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  customFields: {
    colors: {
      primary: '#2563eb',
      secondary: '#4f46e5',
    },
  },
};
```

## Visual Component Examples

### Example 1: Modern Card Component

```jsx
<div className="card modern-card">
  <img
    src="module-image.jpg"
    alt="Module thumbnail"
    className="card-image"
  />
  <div className="card-content">
    <span className="card-badge">Intermediate</span>
    <h3 className="card-title">ROS 2 Fundamentals</h3>
    <p className="card-description">
      Learn the basics of Robot Operating System 2 and create your first node.
    </p>
    <div className="card-meta">
      <span className="meta-item">📚 4 lessons</span>
      <span className="meta-item">⏱️ 2.5 hours</span>
    </div>
  </div>
  <a href="#" className="card-button">Start Learning →</a>
</div>
```

**CSS Styling:**
```css
.modern-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.modern-card:hover {
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-8px);
}

.card-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.card-content {
    padding: 1.5rem;
}

.card-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background: #eff6ff;
    color: #1e40af;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.card-title {
    margin: 0.75rem 0 0.5rem 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
}

.card-description {
    margin: 0 0 1rem 0;
    color: #6b7280;
    line-height: 1.6;
    font-size: 0.95rem;
}

.card-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    font-size: 0.875rem;
    color: #9ca3af;
}

.card-button {
    display: block;
    color: #2563eb;
    text-decoration: none;
    font-weight: 600;
    transition: color 200ms;
}

.card-button:hover {
    color: #1e40af;
}
```

---

### Example 2: Button Variants

```jsx
{/* Primary Button */}
<button className="button button-primary">
  Start Learning
</button>

{/* Secondary Button */}
<button className="button button-secondary">
  Learn More
</button>

{/* Ghost Button */}
<button className="button button-ghost">
  Explore
</button>

{/* Button with Icon */}
<button className="button button-primary">
  <span className="button-icon">📚</span>
  Browse Modules
</button>

{/* Small Button */}
<button className="button button-primary button-sm">
  Go
</button>

{/* Large Button */}
<button className="button button-primary button-lg">
  Start Learning Today
</button>
```

**CSS Styling:**
```css
.button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 200ms;
    text-decoration: none;
    white-space: nowrap;
    min-height: 44px;
}

.button-primary {
    background: #2563eb;
    color: white;
    box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
}

.button-primary:hover {
    background: #1e40af;
    box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
    transform: translateY(-1px);
}

.button-primary:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
}

.button-secondary {
    background: white;
    color: #2563eb;
    border: 2px solid #2563eb;
}

.button-secondary:hover {
    background: #eff6ff;
}

.button-ghost {
    background: transparent;
    color: #2563eb;
}

.button-ghost:hover {
    background: #eff6ff;
}

.button-sm {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
}

.button-lg {
    padding: 1rem 2rem;
    font-size: 1.125rem;
}

.button-icon {
    display: inline-block;
    font-size: 1.25em;
}
```

---

### Example 3: Callout/Alert Components

```jsx
<div className="callout callout-info">
  <span className="callout-icon">ℹ️</span>
  <div className="callout-content">
    <h4 className="callout-title">Tip</h4>
    <p>
      Use the simulation environment to test your code before deploying
      to physical hardware.
    </p>
  </div>
</div>

<div className="callout callout-warning">
  <span className="callout-icon">⚠️</span>
  <div className="callout-content">
    <h4 className="callout-title">Warning</h4>
    <p>
      Never connect this example directly to physical hardware without
      proper safety review.
    </p>
  </div>
</div>

<div className="callout callout-success">
  <span className="callout-icon">✓</span>
  <div className="callout-content">
    <h4 className="callout-title">Success</h4>
    <p>Your simulation successfully completed all test cases.</p>
  </div>
</div>

<div className="callout callout-danger">
  <span className="callout-icon">✕</span>
  <div className="callout-content">
    <h4 className="callout-title">Error</h4>
    <p>Failed to load the simulation environment. Check your setup.</p>
  </div>
</div>
```

**CSS Styling:**
```css
.callout {
    display: flex;
    gap: 1rem;
    padding: 1rem 1.5rem;
    border-left: 4px solid;
    border-radius: 8px;
    margin: 1.5rem 0;
    background-color: #f9fafb;
}

.callout-info {
    border-left-color: #3b82f6;
    background-color: #eff6ff;
}

.callout-warning {
    border-left-color: #f59e0b;
    background-color: #fffbeb;
}

.callout-success {
    border-left-color: #10b981;
    background-color: #ecfdf5;
}

.callout-danger {
    border-left-color: #ef4444;
    background-color: #fef2f2;
}

.callout-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
    line-height: 1.4;
}

.callout-content {
    margin: 0;
}

.callout-title {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
    font-weight: 600;
}

.callout-content p {
    margin: 0;
    color: #374151;
    font-size: 0.95rem;
    line-height: 1.6;
}
```

---

### Example 4: Badge Components

```jsx
<span className="badge badge-primary">Beginner</span>
<span className="badge badge-secondary">Intermediate</span>
<span className="badge badge-success">Completed</span>
<span className="badge badge-warning">In Progress</span>
<span className="badge badge-danger">Advanced</span>

{/* With Icons */}
<span className="badge badge-success">
  <span className="badge-icon">✓</span>
  Completed
</span>
```

**CSS Styling:**
```css
.badge {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 600;
    border-radius: 20px;
    white-space: nowrap;
}

.badge-primary {
    background-color: #dbeafe;
    color: #1e40af;
}

.badge-secondary {
    background-color: #e0e7ff;
    color: #3730a3;
}

.badge-success {
    background-color: #dcfce7;
    color: #166534;
}

.badge-warning {
    background-color: #fef08a;
    color: #92400e;
}

.badge-danger {
    background-color: #fee2e2;
    color: #991b1b;
}

.badge-icon {
    font-size: 0.875em;
}
```

---

### Example 5: Responsive Grid Layout

```jsx
<div className="grid grid-3">
  <div className="card">...</div>
  <div className="card">...</div>
  <div className="card">...</div>
  <div className="card">...</div>
  <div className="card">...</div>
  <div className="card">...</div>
</div>
```

**CSS Styling:**
```css
.grid {
    display: grid;
    gap: 1.5rem;
    margin: 2rem 0;
}

/* 1 column on mobile */
.grid-1 {
    grid-template-columns: 1fr;
}

/* 2 columns on tablet */
.grid-2 {
    grid-template-columns: 1fr;
}

@media (min-width: 768px) {
    .grid-2 {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* 3 columns on desktop */
.grid-3 {
    grid-template-columns: 1fr;
    gap: 2rem;
}

@media (min-width: 768px) {
    .grid-3 {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 1024px) {
    .grid-3 {
        grid-template-columns: repeat(3, 1fr);
    }
}

/* Auto-fit grid */
.grid-auto {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
```

## Tools & Technologies

### Frontend Tools
- **Docusaurus 3.x** — Static site generator
- **MDX** — Markdown with React components
- **React** — Component library
- **Tailwind CSS** — Utility-first CSS (optional)
- **PostCSS** — CSS processing and polyfills

### Design & Asset Tools
- **Figma** — Design mockups and component library
- **Excalidraw** — Quick wireframes and diagrams
- **SVG Optimizer** — Compress and optimize SVGs
- **ImageOptim** — Compress raster images

### Testing & Validation Tools
- **Lighthouse** — Performance and accessibility audits
- **axe DevTools** — Automated accessibility testing
- **WAVE** — Web accessibility evaluation tool
- **WebAIM Contrast Checker** — Color contrast validation
- **Responsively App** — Responsive design testing

### Development Tools
- **VS Code** — Code editor with extensions
- **Prettier** — Code formatting
- **ESLint** — JavaScript linting
- **StyleLint** — CSS linting
- **Chrome DevTools** — Browser debugging

### Performance Tools
- **Bundle Analyzer** — Analyze bundle size
- **Lighthouse CI** — Automated performance testing
- **GTmetrix** — Page performance analysis
- **WebPageTest** — Detailed performance reports

## Design System Documentation

### Color Palette

**Primary Colors:**
- Primary: `#2563eb` (Blue)
- Primary Dark: `#1e40af` (Dark Blue)
- Primary Light: `#eff6ff` (Light Blue)

**Semantic Colors:**
- Success: `#10b981` (Green)
- Warning: `#f59e0b` (Amber)
- Danger: `#ef4444` (Red)
- Info: `#3b82f6` (Light Blue)

**Neutral Colors:**
- Gray 900: `#111827` (Almost Black)
- Gray 700: `#374151` (Dark Gray)
- Gray 500: `#6b7280` (Medium Gray)
- Gray 100: `#f9fafb` (Light Gray)
- White: `#ffffff` (Pure White)

### Typography Scale

- H1: 2.25rem (36px), weight 700
- H2: 1.875rem (30px), weight 700
- H3: 1.5rem (24px), weight 600
- H4: 1.25rem (20px), weight 600
- Body: 1rem (16px), weight 400
- Small: 0.875rem (14px), weight 400
- Tiny: 0.75rem (12px), weight 600

### Spacing Scale

- 2xs: 0.25rem (4px)
- xs: 0.5rem (8px)
- sm: 0.75rem (12px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)
- 3xl: 4rem (64px)

### Shadow System

- Subtle: `0 1px 2px rgba(0, 0, 0, 0.05)`
- Light: `0 4px 6px rgba(0, 0, 0, 0.07)`
- Medium: `0 10px 15px rgba(0, 0, 0, 0.1)`
- Large: `0 20px 25px rgba(0, 0, 0, 0.15)`

### Animation Timings

- Fast: 150ms
- Base: 200ms
- Slow: 300ms
- Very Slow: 500ms

## Constraints & Guidelines

### Docusaurus Compatibility

✅ **Must Do:**
- Use semantic HTML (buttons, links, headings)
- Implement CSS-in-JS or `custom.css`
- Create reusable React components
- Test with Docusaurus build process
- Support light and dark modes
- Maintain Docusaurus layout integration

❌ **Must NOT Do:**
- Use external CSS libraries (except Tailwind if configured)
- Break Docusaurus navigation or routing
- Create global style conflicts
- Hardcode Docusaurus-internal paths
- Override Docusaurus core components without swizzling

### Accessibility Requirements

✅ **Must Ensure:**
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast (4.5:1)
- Visible focus indicators
- Proper heading hierarchy
- Alt text for images
- ARIA labels where needed

### Performance Standards

✅ **Must Achieve:**
- Lighthouse Performance ≥ 90
- First Contentful Paint < 2s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1
- Zero layout thrashing
- GPU-accelerated animations

## Acceptance Criteria

- [ ] Components render correctly in Docusaurus
- [ ] All visual states (hover, focus, active) work
- [ ] Responsive design tested at 3+ breakpoints
- [ ] WCAG AA accessibility verified
- [ ] Dark mode variant included and tested
- [ ] Color contrast ≥ 4.5:1 for text
- [ ] Touch targets ≥ 44×44px on mobile
- [ ] Keyboard navigation fully supported
- [ ] Performance acceptable (Lighthouse ≥ 90)
- [ ] No console errors or warnings
- [ ] CSS organized and efficient
- [ ] Components documented with examples
- [ ] Animation respects `prefers-reduced-motion`
- [ ] Cross-browser compatible (Chrome, Firefox, Safari, Edge)
- [ ] Images optimized and properly formatted

## Quality Checklist

**Design Quality:**
- [ ] Visual hierarchy is clear and purposeful
- [ ] Whitespace and margins are consistent
- [ ] Typography hierarchy is evident
- [ ] Colors serve a purpose (not decorative)
- [ ] Icons are recognizable and consistent

**Accessibility:**
- [ ] Focus indicators visible (2px outline)
- [ ] Keyboard shortcuts documented
- [ ] ARIA labels complete and accurate
- [ ] Color not sole means of information
- [ ] Motion tested with reduced-motion settings

**Code Quality:**
- [ ] CSS is organized and commented
- [ ] No unused styles or selectors
- [ ] CSS variables used for theming
- [ ] Media queries follow mobile-first approach
- [ ] Component code is DRY

**Documentation:**
- [ ] Usage examples provided
- [ ] Props/customization documented
- [ ] Accessibility features noted
- [ ] Responsive behavior explained
- [ ] Version/browser requirements listed

---

Save it as `.claude/skills/stylish-ui/skill.md`
