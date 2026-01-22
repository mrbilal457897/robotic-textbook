---
name: ui-card-system
description: Design modern reusable card components for the Physical AI & Humanoid Robotics Interactive Textbook. Create responsive card layouts with hover, focus, and elevation effects, light/dark mode support, optimized for MDX usage with Tailwind CSS and accessibility compliance.
---

# Card System Design Skill

## Overview

This skill provides a comprehensive system for designing and implementing reusable card components across the Physical AI & Humanoid Robotics Interactive Textbook. Cards are fundamental UI building blocks used for feature highlights, lesson previews, module summaries, and content organization. This skill ensures consistent, accessible, responsive card designs that work seamlessly with Docusaurus and MDX while adhering to the "Neural Circuitry Futurism" design theme.

## When to Use This Skill

- Creating feature blocks or lesson highlights
- Designing module overview cards
- Building topic preview grids
- Implementing lesson/tutorial discovery cards
- Creating callout cards for important concepts
- Organizing content sections with visual hierarchy
- When you need consistent, professional card layouts
- When cards require hover states, elevation, or interactive feedback

## Step-by-Step Instructions

### 1. Card Requirements Analysis

Before designing a card, define its purpose:

- **Type**: Feature, lesson preview, module overview, callout, code highlight, stat/metric
- **Content**: Identify what goes inside (icon, title, description, badge, CTA button, etc.)
- **Container**: Single card, grid layout, or carousel
- **Interaction**: Hover effects, clickability, focus states required
- **Context**: Where will this card appear? (homepage, module page, sidebar, etc.)

### 2. Layout & Structure

Establish the card's internal structure:

- Define card dimensions: width, aspect ratio, min/max sizes
- Establish internal padding and spacing using the modular scale (0.25rem, 0.5rem, 1rem, 1.5rem, 2rem, 3rem)
- Plan content hierarchy: icon/image → title → description → metadata → CTA
- Consider mobile vs. desktop layouts (stacked on mobile, side-by-side on desktop)
- Account for RTL languages if applicable (Urdu, Arabic support)

### 3. Visual Styling

Apply the Neural Circuitry Futurism theme to cards:

- **Background**: Use card background color (#1A2230 dark, #FFFFFF light)
- **Borders**: Subtle borders with theme accent colors or gradients
- **Shadows**: Implement elevation with consistent shadow scales
- **Typography**: Apply Rajdhani (headings) and Source Code Pro (body) fonts
- **Color Accents**: Use Electric Cyan (#00F0FF), Plasma Orange (#FF6B35), or Titanium Silver (#B8C4CE)

### 4. Interactive States

Implement all interactive states:

- **Default**: Base styling without interaction
- **Hover**: Subtle scale (1.02–1.05), shadow elevation, color shifts
- **Focus**: Visible focus ring (outline-offset, ring-color matching theme)
- **Active**: Press-down effect if clickable
- **Disabled**: Reduced opacity, cursor-not-allowed

All state transitions must use smooth CSS transitions (0.2–0.3s ease-in-out).

### 5. Responsive Design

Ensure cards work across all breakpoints:

- **Mobile** (<640px): Full width or 1-column grid, large touch targets (44px+)
- **Tablet** (640–1024px): 2-column grid, optimized spacing
- **Desktop** (>1024px): 3+ column grid, expanded padding
- Test overflow behavior: text truncation, line clamping, image aspect ratios
- Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`)

### 6. Light/Dark Mode Support

Implement theme switching:

- Use CSS variables or Tailwind's `dark:` prefix
- Define color pairs for light/dark modes:
  - Light text: #111827 → Dark text: #E8EDF3
  - Light background: #FFFFFF → Dark background: #0A0E14
  - Light border: #E5E7EB → Dark border: #374151
- Test contrast ratios in both modes (WCAG AA minimum 4.5:1)
- Use `prefers-color-scheme` media query as fallback

### 7. Accessibility Implementation

Ensure full accessibility compliance:

- Use semantic HTML (`<article>`, `<section>`, `<a>`, `<button>`)
- Add descriptive ARIA labels for screen readers
- Ensure keyboard navigation (Tab order, Enter activation)
- Provide visible focus indicators (never remove outline)
- Include alt text for images
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Respect `prefers-reduced-motion` for animations

### 8. MDX Integration

Optimize cards for MDX usage:

- Create reusable React components (JSX)
- Export components in `.mdx` files properly
- Document component props clearly
- Ensure components render without Docusaurus-specific dependencies
- Support props for dynamic content (title, description, icon, href, etc.)
- Include TypeScript types if applicable

### 9. Performance Optimization

Minimize rendering impact:

- Lazy load images with `loading="lazy"`
- Optimize image assets (WebP format, appropriate sizes)
- Use CSS containment (`contain: layout paint;`)
- Avoid heavy animations that cause repaints
- Test with DevTools Performance tab
- Verify Lighthouse score ≥ 90

### 10. Testing & Validation

Complete validation before deployment:

- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Responsive testing at 3+ breakpoints
- Keyboard navigation (Tab through all cards)
- Screen reader testing (NVDA/JAWS on Windows, VoiceOver on Mac)
- Color contrast verification (axe, Lighthouse)
- Performance profiling (Lighthouse, WebPageTest)
- Manual light/dark mode testing

## Card Design System Rules

### Color Palette for Cards

**Light Mode**:
- Background: #FFFFFF (white)
- Border: #E5E7EB (light gray)
- Text Primary: #111827 (dark gray)
- Text Secondary: #6B7280 (medium gray)
- Accent: #00F0FF (Electric Cyan) or #FF6B35 (Plasma Orange)

**Dark Mode**:
- Background: #1A2230 (card blue) or #0A0E14 (deep black)
- Border: #374151 (dark gray)
- Text Primary: #E8EDF3 (light text)
- Text Secondary: #9AABB8 (medium gray)
- Accent: #00F0FF (Electric Cyan) or #FF6B35 (Plasma Orange)

### Typography Standards

- **Card Title**: Rajdhani 700, 1.25–1.5rem, primary text color
- **Card Description**: Source Code Pro 400, 1rem, secondary text color
- **Card Metadata**: Source Code Pro 400, 0.875rem, secondary text color
- **Card Label/Badge**: Rajdhani 600, 0.75rem, accent color

### Spacing Scale

- **XS**: 0.25rem (2px)
- **S**: 0.5rem (4px)
- **M**: 1rem (8px)
- **L**: 1.5rem (12px)
- **XL**: 2rem (16px)
- **2XL**: 3rem (24px)

Apply consistent padding internally: `p-4` (16px) for mobile, `p-6` (24px) for desktop.

### Shadow & Elevation System

Cards have 3 elevation levels:

1. **Flat** (minimal, default):
   ```css
   box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
   ```

2. **Elevated** (hover state):
   ```css
   box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
   ```

3. **Prominent** (interactive focus):
   ```css
   box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
   ```

Dark mode shadows use adjusted opacity: `rgba(0, 0, 0, 0.3)`, `rgba(0, 0, 0, 0.4)`, `rgba(0, 0, 0, 0.5)`.

### Border Radius

- Small cards: `rounded-lg` (8px)
- Medium cards: `rounded-xl` (12px)
- Large cards: `rounded-2xl` (16px)

### Interactive Transitions

All state changes use smooth transitions:

```css
transition: box-shadow 0.3s ease-in-out,
            transform 0.3s ease-in-out,
            background-color 0.3s ease-in-out,
            color 0.3s ease-in-out;
```

Hover scale: `scale(1.02)` to `scale(1.05)` depending on card type.

## Code Examples

### Base Card Component (Tailwind + React)

```jsx
// BaseCard.jsx
export function BaseCard({
  icon,
  title,
  description,
  href,
  children,
  className = ''
}) {
  const baseStyles = `
    bg-white dark:bg-[#1A2230]
    border border-gray-200 dark:border-[#374151]
    rounded-xl p-6
    shadow-sm hover:shadow-lg
    transition-all duration-300 ease-in-out
    hover:scale-105
    focus-within:outline-none focus-within:ring-2 focus-within:ring-[#00F0FF]
    ${className}
  `;

  const Wrapper = href ? 'a' : 'div';

  return (
    <Wrapper
      href={href}
      className={baseStyles}
      role={href ? 'link' : 'article'}
      aria-label={title}
    >
      {icon && (
        <div className="text-3xl mb-4 dark:text-[#00F0FF]">
          {icon}
        </div>
      )}

      {title && (
        <h3 className="text-xl font-bold text-gray-900 dark:text-[#E8EDF3] mb-2 font-rajdhani">
          {title}
        </h3>
      )}

      {description && (
        <p className="text-gray-600 dark:text-[#9AABB8] text-sm mb-4 font-source-code-pro">
          {description}
        </p>
      )}

      {children}
    </Wrapper>
  );
}
```

### Lesson Preview Card

```jsx
// LessonCard.jsx
export function LessonCard({
  title,
  description,
  readTime,
  difficulty,
  href,
  icon = '📚'
}) {
  const difficultyColor = {
    easy: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    medium: 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200',
    hard: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
  };

  return (
    <a
      href={href}
      className="
        block bg-gradient-to-br from-white to-gray-50
        dark:from-[#1A2230] dark:to-[#0A0E14]
        border border-gray-200 dark:border-[#374151]
        rounded-xl p-6
        shadow-md hover:shadow-xl
        transition-all duration-300 ease-in-out
        hover:scale-102 hover:translate-y-[-2px]
        focus:outline-none focus:ring-2 focus:ring-[#00F0FF]
        group
      "
      aria-label={`${title} - ${readTime} min read`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-3xl">{icon}</span>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${difficultyColor[difficulty]}`}>
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </span>
      </div>

      <h3 className="text-lg font-bold text-gray-900 dark:text-[#E8EDF3] mb-2 font-rajdhani group-hover:text-[#00F0FF] transition-colors">
        {title}
      </h3>

      <p className="text-gray-600 dark:text-[#9AABB8] text-sm mb-4 font-source-code-pro line-clamp-2">
        {description}
      </p>

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-[#9AABB8]">
        <span>⏱️ {readTime} min read</span>
        <span className="text-[#00F0FF] font-semibold group-hover:translate-x-1 transition-transform">
          →
        </span>
      </div>
    </a>
  );
}
```

### Module Card with Image

```jsx
// ModuleCard.jsx
export function ModuleCard({
  title,
  description,
  imageUrl,
  imageAlt,
  lessonCount,
  href,
  difficulty = 'medium'
}) {
  return (
    <a
      href={href}
      className="
        overflow-hidden
        bg-white dark:bg-[#1A2230]
        border border-gray-200 dark:border-[#374151]
        rounded-2xl
        shadow-md hover:shadow-2xl
        transition-all duration-300 ease-in-out
        hover:scale-105 hover:-translate-y-1
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00F0FF]
        group
        flex flex-col h-full
      "
      aria-label={`${title} module with ${lessonCount} lessons`}
    >
      {/* Image Section */}
      <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-[#00F0FF]/20 to-[#FF6B35]/20">
        <img
          src={imageUrl}
          alt={imageAlt}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-6 flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 dark:text-[#E8EDF3] mb-2 font-rajdhani group-hover:text-[#00F0FF] transition-colors">
          {title}
        </h3>

        <p className="text-gray-600 dark:text-[#9AABB8] text-sm mb-4 flex-1 font-source-code-pro line-clamp-3">
          {description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-[#374151]">
          <span className="text-xs font-semibold text-[#00F0FF]">
            {lessonCount} lessons
          </span>
          <span className="text-sm font-semibold text-gray-700 dark:text-[#E8EDF3]">
            Explore →
          </span>
        </div>
      </div>
    </a>
  );
}
```

### Callout/Alert Card

```jsx
// CalloutCard.jsx
export function CalloutCard({
  type = 'info',
  title,
  message,
  icon = 'ℹ️',
  children
}) {
  const styles = {
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-900 dark:text-blue-100',
      icon: '🔵'
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800',
      text: 'text-amber-900 dark:text-amber-100',
      icon: '⚠️'
    },
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-900 dark:text-green-100',
      icon: '✅'
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-900 dark:text-red-100',
      icon: '❌'
    }
  };

  const style = styles[type] || styles.info;

  return (
    <div
      className={`
        ${style.bg}
        border-l-4 ${style.border}
        rounded-lg p-6
        flex gap-4
      `}
      role="alert"
      aria-live="polite"
    >
      <span className="text-2xl flex-shrink-0" aria-hidden="true">
        {icon}
      </span>

      <div className={`flex-1 ${style.text}`}>
        {title && (
          <h4 className="font-bold font-rajdhani mb-2">
            {title}
          </h4>
        )}

        {message && (
          <p className="font-source-code-pro text-sm mb-2">
            {message}
          </p>
        )}

        {children}
      </div>
    </div>
  );
}
```

### Card Grid Layout

```jsx
// CardGrid.jsx
export function CardGrid({
  cards = [],
  variant = 'lesson',
  columns = { sm: 1, md: 2, lg: 3 }
}) {
  const gridClass = `
    grid gap-6
    grid-cols-1
    ${columns.md ? `md:grid-cols-${columns.md}` : 'md:grid-cols-2'}
    ${columns.lg ? `lg:grid-cols-${columns.lg}` : 'lg:grid-cols-3'}
  `;

  return (
    <div
      className={gridClass}
      role="list"
      aria-label={`${cards.length} ${variant} cards`}
    >
      {cards.map((card) => (
        <div key={card.id} role="listitem">
          {variant === 'lesson' && <LessonCard {...card} />}
          {variant === 'module' && <ModuleCard {...card} />}
          {variant === 'base' && <BaseCard {...card} />}
        </div>
      ))}
    </div>
  );
}
```

### Code Highlight Card

```jsx
// CodeCard.jsx
export function CodeCard({
  language = 'python',
  title,
  description,
  code,
  showLineNumbers = true
}) {
  return (
    <div
      className="
        bg-[#0A0E14] dark:bg-[#0A0E14]
        border border-[#374151]
        rounded-xl overflow-hidden
        shadow-lg
      "
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#374151] bg-[#1A2230]">
        {title && (
          <h4 className="font-bold text-[#00F0FF] font-rajdhani mb-1">
            {title}
          </h4>
        )}
        {description && (
          <p className="text-[#9AABB8] text-sm font-source-code-pro">
            {description}
          </p>
        )}
      </div>

      {/* Code */}
      <div className="overflow-x-auto p-6 font-jetbrains-mono text-sm text-[#E8EDF3]">
        <pre><code>{code}</code></pre>
      </div>
    </div>
  );
}
```

## Card Variants & Use Cases

### Feature Card
Purpose: Highlight key features on homepage
- Large icon/illustration
- Clear title (2-3 words)
- 1-2 sentence description
- Optional CTA button
- Hover: scale + shadow elevation

### Lesson Card
Purpose: Preview individual lessons in grids
- Icon or small thumbnail
- Title + description (1-2 lines)
- Difficulty badge (easy/medium/hard)
- Read time estimate
- Hover: slight lift, underline CTA

### Module Card
Purpose: Showcase full modules with context
- Large hero image
- Title + full description (3-4 lines)
- Lesson count
- Difficulty level
- Optional progress indicator
- Hover: image zoom + shadow elevation

### Stat Card
Purpose: Display metrics or key numbers
- Large number/percentage
- Context label
- Optional trend indicator (↑/↓)
- Minimal design
- Hover: glow effect around number

### Callout Card
Purpose: Highlight important information
- Colored left border (type-specific)
- Icon + title
- Message body
- Optional action button
- No hover state (informational)

### Code Card
Purpose: Display code examples with context
- Dark themed (matches code style)
- Title + language badge
- Syntax-highlighted code block
- Copy button (optional)
- Line numbers (optional)

## Tools & Technologies

- **Docusaurus 3.x** — Documentation framework
- **React 18+** — Component library
- **Tailwind CSS 3.x** — Utility-first CSS framework
- **MDX** — Markdown + JSX integration
- **TypeScript** (optional) — Type safety for components
- **CSS Transitions** — Smooth animations
- **CSS Variables** — Theme customization
- **Accessibility Testing**:
  - axe DevTools (color contrast, ARIA)
  - Lighthouse (performance, accessibility)
  - WAVE (WCAG compliance)
  - NVDA/JAWS (screen reader testing)
  - VoiceOver (macOS screen reader)
- **Performance Tools**:
  - Chrome DevTools (rendering, performance)
  - Lighthouse (performance metrics)
  - WebPageTest (real-world performance)

## Constraints & Requirements

✅ **Must Do:**
- Fully responsive (mobile, tablet, desktop)
- Work seamlessly with Docusaurus + MDX
- Support light and dark modes
- Implement all interactive states (hover, focus, active)
- Follow WCAG 2.1 AA accessibility standards
- Use Tailwind CSS utilities
- Smooth transitions (0.2–0.3s)
- Maintain focus indicators (never remove outline)
- Semantic HTML structure
- Lazy load images
- Support RTL languages (Urdu, Arabic)
- Achieve Lighthouse score ≥ 90

❌ **Must NOT Do:**
- Hardcode colors (use CSS variables or Tailwind theming)
- Break existing Docusaurus structure
- Remove focus outlines (replace with visible alternatives only)
- Use unsupported dependencies
- Ignore keyboard navigation
- Create layout shifts (CLS > 0.1 is failure)
- Use inline styles for responsive design
- Ignore text truncation/overflow behavior
- Skip image optimization
- Use auto-generated contrast ratios without validation

## Acceptance Criteria

- [ ] Card components render correctly in Docusaurus preview
- [ ] All interactive states implemented (hover, focus, active, disabled)
- [ ] Smooth transitions (60fps, 0.2–0.3s duration)
- [ ] Light mode colors tested for WCAG AA contrast (4.5:1 minimum)
- [ ] Dark mode colors tested for WCAG AA contrast (4.5:1 minimum)
- [ ] Responsive design tested at 3+ breakpoints (mobile, tablet, desktop)
- [ ] Keyboard navigation works (Tab, Shift+Tab, Enter)
- [ ] Screen reader announces content correctly
- [ ] Focus indicators visible in all states
- [ ] No console errors or warnings
- [ ] Images optimized and lazy-loaded
- [ ] Lighthouse performance score ≥ 90
- [ ] Dark mode toggle working correctly
- [ ] RTL layout correct (if applicable)
- [ ] Components work in MDX files without errors
- [ ] Documentation with usage examples provided

## Performance Targets

- **Rendering**: 60fps on 3G throttling
- **First Contentful Paint**: < 2 seconds
- **Page Weight**: < 500KB (excluding fonts)
- **Image Optimization**: WebP with fallbacks
- **CSS Bundle**: Minimize unused Tailwind classes
- **JavaScript**: No blocking scripts on card render path

## Accessibility Checklist

- [ ] Semantic HTML (`<article>`, `<section>`, `<a>`, `<button>`)
- [ ] ARIA labels for all images (`alt` attribute)
- [ ] Keyboard navigation fully functional
- [ ] Focus indicators always visible (outline or ring)
- [ ] Color not sole indicator of information
- [ ] Screen reader tested (NVDA, JAWS, VoiceOver)
- [ ] Contrast ratio ≥ 4.5:1 for text (light & dark modes)
- [ ] `prefers-reduced-motion` respected
- [ ] Touch targets ≥ 44px on mobile
- [ ] Alt text descriptive and concise
- [ ] Language attributes set correctly (for RTL)
- [ ] Form inputs have associated labels

---

Save it as `.claude/skills/ui-card-system/skill.md`
