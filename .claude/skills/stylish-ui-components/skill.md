---
name: stylish-ui-components
description: Design modern, stylish, and accessible UI components for Docusaurus documentation pages. Create responsive buttons, cards, section layouts, and smooth animations while maintaining academic readability and accessibility standards for the Physical AI & Humanoid Robotics Interactive Textbook.
---

# Stylish UI Components Skill

## Overview

This skill enables the design and implementation of modern, visually compelling UI components for Docusaurus documentation pages. It combines contemporary design patterns with accessibility best practices to enhance the learning experience while maintaining the academic integrity of the textbook.

## When to Use This Skill

- Designing or upgrading textbook UI components
- Creating module cards, lesson previews, or feature highlights
- When pages look outdated or visually weak
- Implementing interactive elements that need visual enhancement
- Building consistent design systems across documentation pages

## Step-by-Step Instructions

### 1. Component Planning
- Identify which components need design updates (buttons, cards, sections)
- Define the component's purpose and context within the textbook
- Sketch layout and interaction states (default, hover, active, disabled)
- Plan responsiveness breakpoints: mobile (< 640px), tablet (640–1024px), desktop (> 1024px)

### 2. Accessibility Audit
- Ensure color contrast ratios meet WCAG AA standards (4.5:1 for text)
- Verify keyboard navigation is intuitive (Tab, Enter, Escape keys)
- Add proper ARIA labels and semantic HTML
- Test with screen readers (NVDA, JAWS, or Safari VoiceOver)
- Avoid relying solely on color to convey information

### 3. Design Implementation
- Use CSS-in-JS or Tailwind for component styling
- Implement consistent spacing using a modular scale
- Create hover states with smooth transitions (200–300ms)
- Apply subtle shadows and elevation for depth
- Ensure consistent typography hierarchy

### 4. Animation & Transitions
- Add smooth hover effects (scale, color, shadow changes)
- Use CSS transitions or Framer Motion for animations
- Keep animations under 300ms for performance
- Provide `prefers-reduced-motion` support for accessibility
- Test animations on low-end devices

### 5. Responsive Design
- Design mobile-first, then enhance for larger screens
- Use CSS media queries or Tailwind responsive classes
- Test on actual devices (not just browser DevTools)
- Ensure touch targets are at least 44px × 44px on mobile
- Optimize image assets for different screen sizes

### 6. Performance Optimization
- Lazy load images and heavy components
- Minimize CSS bundle size
- Avoid layout shifts (Cumulative Layout Shift < 0.1)
- Use CSS classes efficiently (avoid inline styles)
- Test Lighthouse scores (aim for 90+)

### 7. Integration with Docusaurus
- Use Docusaurus theme files (`src/css/custom.css`, `swizzled` components)
- Wrap custom components in MDX files properly
- Ensure components work with both light and dark modes
- Test with Docusaurus build and preview commands
- Maintain compatibility with existing Docusaurus plugins

### 8. Testing & Validation
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Responsive design testing at multiple breakpoints
- Accessibility testing with automated tools (axe, Lighthouse)
- Manual keyboard navigation testing
- Performance profiling with DevTools

## UI Examples for Textbook Pages

### Modern Button Styles
```jsx
/* Primary Button - Call-to-action */
<button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg
  hover:bg-blue-700 transition-colors duration-200 shadow-md
  hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
  Start Learning
</button>

/* Secondary Button - Alternative action */
<button className="px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold
  rounded-lg hover:bg-blue-50 transition-colors duration-200
  focus:outline-none focus:ring-2 focus:ring-blue-500">
  Learn More
</button>

/* Ghost Button - Minimal style */
<button className="px-6 py-3 text-blue-600 font-semibold
  hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors
  duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
  Explore
</button>
```

### Module Card Component
```jsx
<div className="bg-white rounded-xl shadow-md hover:shadow-xl
  transition-shadow duration-300 overflow-hidden border border-gray-100">
  <img src="module-image.png" alt="Module thumbnail"
    className="w-full h-48 object-cover" />
  <div className="p-6">
    <h3 className="text-xl font-bold text-gray-900 mb-2">
      ROS 2 Fundamentals
    </h3>
    <p className="text-gray-600 text-sm mb-4">
      Learn the basics of Robot Operating System 2 and create your first node.
    </p>
    <div className="flex justify-between items-center">
      <span className="text-xs font-semibold text-blue-600">4 lessons</span>
      <a href="#" className="text-blue-600 font-semibold hover:text-blue-700">
        Start →
      </a>
    </div>
  </div>
</div>
```

### Lesson Preview Cards (Grid)
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {lessons.map((lesson) => (
    <div key={lesson.id} className="bg-gradient-to-br from-blue-50 to-indigo-50
      rounded-lg p-6 border border-blue-200 hover:border-blue-400
      transition-colors duration-200 cursor-pointer group">
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-600
          transition-colors duration-200">
          {lesson.title}
        </h4>
        <span className="text-2xl">{lesson.icon}</span>
      </div>
      <p className="text-gray-700 text-sm mb-4">{lesson.description}</p>
      <div className="flex items-center text-xs text-gray-600">
        <span>📚 {lesson.readTime} min read</span>
      </div>
    </div>
  ))}
</div>
```

### Section Divider with Title
```jsx
<div className="my-12 flex items-center gap-4">
  <div className="flex-grow h-px bg-gradient-to-r from-transparent
    via-gray-300 to-transparent"></div>
  <h2 className="text-2xl font-bold text-gray-900 px-4 whitespace-nowrap">
    Explore Topics
  </h2>
  <div className="flex-grow h-px bg-gradient-to-r from-transparent
    via-gray-300 to-transparent"></div>
</div>
```

### Interactive Feature Highlight
```jsx
<div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white
  rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300">
  <h3 className="text-3xl font-bold mb-4">Interactive Simulations</h3>
  <p className="text-lg opacity-90 mb-6">
    Practice robotics concepts in real-time with our integrated simulators.
  </p>
  <button className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg
    hover:bg-gray-100 transition-colors duration-200 shadow-md">
    Launch Simulator
  </button>
</div>
```

## Design Principles

### Color Palette
- Primary: Blue (#2563EB) for main actions and links
- Secondary: Indigo (#4F46E5) for accents
- Neutral: Gray scale for text and backgrounds
- Success: Green (#10B981) for confirmations
- Warning: Amber (#F59E0B) for cautions
- Neutral backgrounds: White (#FFFFFF) and Gray (#F9FAFB)

### Typography
- Headings: Bold, 1.5–3rem, dark gray (#111827)
- Body text: Regular, 1rem, medium gray (#374151)
- Small text: Regular, 0.875rem, light gray (#6B7280)
- Font stack: `system-ui, -apple-system, sans-serif`

### Spacing
- XS: 0.25rem, S: 0.5rem, M: 1rem, L: 1.5rem, XL: 2rem, 2XL: 3rem
- Use consistent margins and padding for rhythm

### Shadows
- Subtle: `0 1px 2px rgba(0, 0, 0, 0.05)`
- Medium: `0 4px 6px rgba(0, 0, 0, 0.1)`
- Elevated: `0 10px 15px rgba(0, 0, 0, 0.15)`

## Tools & Technologies

- **Docusaurus 3.x** — Documentation framework
- **MDX** — Markdown + JSX integration
- **Tailwind CSS** — Utility-first CSS framework
- **CSS-in-JS** — Emotion or Styled Components (optional)
- **Framer Motion** — Smooth animations (optional)
- **React** — Component library
- **Accessibility Testing**: axe DevTools, Lighthouse, WAVE
- **Performance Monitoring**: Lighthouse, WebPageTest

## Constraints & Requirements

✅ **Must Do:**
- Work seamlessly with Docusaurus MDX structure
- Follow WCAG 2.1 AA accessibility standards
- Support light and dark modes
- Maintain page performance (Lighthouse > 90)
- Be responsive across all breakpoints
- Use semantic HTML and proper ARIA labels

❌ **Must NOT Do:**
- Break existing documentation structure
- Use unsupported or bloated dependencies
- Ignore keyboard navigation
- Create layout shifts or jank
- Hardcode colors (use CSS variables)
- Skip mobile optimization

## Acceptance Criteria

- [ ] All components render correctly in Docusaurus preview
- [ ] Hover states and transitions are smooth (60fps)
- [ ] Components are fully keyboard accessible
- [ ] Color contrast passes WCAG AA (4.5:1 for text)
- [ ] Responsive design tested on 3+ breakpoints
- [ ] No console errors or warnings
- [ ] Lighthouse performance score ≥ 90
- [ ] Components work in both light and dark modes
- [ ] Images optimized and lazy-loaded where appropriate
- [ ] Documentation includes usage examples

---

Save it as `.claude/skills/stylish-ui-components/skill.md`
