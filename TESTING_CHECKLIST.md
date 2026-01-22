# Testing Checklist for Phase 2 & Beyond

This document provides comprehensive testing procedures for responsive design, animation performance, and interactive states.

## T038: Responsive Design Testing

Test the site at these breakpoints to ensure proper responsive behavior.

### Breakpoints to Test

1. **Mobile (375px)** - iPhone SE, small phones
2. **Tablet (768px)** - iPad, tablets
3. **Desktop (1200px)** - Standard desktop
4. **Wide (1440px)** - Large monitors

### Testing Procedure

#### Step 1: Set up browser
```bash
npm start
# Open http://localhost:3000 in your browser
```

#### Step 2: Open DevTools
- Press `F12` or `Cmd+Option+I`
- Click "Toggle device toolbar" (Ctrl+Shift+M or Cmd+Shift+M)

#### Step 3: Test each breakpoint

**For 375px (Mobile):**
- [ ] Homepage loads without horizontal scroll
- [ ] Navigation hamburger menu appears
- [ ] Hero section text readable and centered
- [ ] Module cards stack vertically (1 column)
- [ ] Quiz questions fully visible
- [ ] Buttons large enough to tap (≥48px)
- [ ] Input fields large enough for touch
- [ ] No text truncation without reason

**For 768px (Tablet):**
- [ ] No horizontal scroll
- [ ] Navbar compact but readable
- [ ] Hero section properly proportioned
- [ ] Module cards in 2-column grid
- [ ] Timeline should adjust to tablet layout
- [ ] Images scale appropriately
- [ ] Touch targets remain ≥48px

**For 1200px (Desktop):**
- [ ] Full layout displayed
- [ ] All sections visible without scrolling excess
- [ ] Module cards in 4-column grid
- [ ] Sidebar visible if applicable
- [ ] Proper spacing and alignment
- [ ] Desktop navigation fully visible

**For 1440px (Wide Desktop):**
- [ ] Content doesn't extend beyond reasonable width
- [ ] Proper use of whitespace
- [ ] No text lines too long (70-80 chars)
- [ ] Layout remains visually balanced

#### Step 4: Test specific components

**Navbar/Header:**
- [ ] 375px: Hamburger menu visible
- [ ] 768px: Navigation items visible or menu appears
- [ ] 1200px+: Full navigation visible
- [ ] Logo always visible and clickable

**Hero Section:**
- [ ] 375px: Text centered, readable, no overflow
- [ ] 768px: Image and text properly balanced
- [ ] 1200px+: Full hero with animations visible

**Module Cards:**
- [ ] 375px: 1 column, full width with padding
- [ ] 768px: 2 columns, proper spacing
- [ ] 1200px: 4 columns, equal spacing
- [ ] Cards maintain aspect ratio

**Footer:**
- [ ] 375px: Links stacked vertically, readable
- [ ] 768px: Links in 2-3 columns
- [ ] 1200px+: Full footer layout

#### Step 5: Test content pages

Navigate to different content pages and verify:
- [ ] Reading time displays correctly at all sizes
- [ ] Code blocks don't overflow (use horizontal scroll if needed)
- [ ] Tables are readable (scroll if needed on mobile)
- [ ] Images scale proportionally
- [ ] Breadcrumb navigation works

#### Step 6: Interactive elements

Test interaction at each breakpoint:
- [ ] Links clickable with sufficient spacing
- [ ] Buttons respond to clicks
- [ ] Forms input fields easily accessible
- [ ] Dropdowns work on touch devices
- [ ] Modals fit screen and are closable

#### Step 7: Test actual devices (if available)

Test on real devices when possible:
- [ ] iPhone SE or similar (375px)
- [ ] iPad or tablet (768px)
- [ ] Desktop monitor (1200px+)
- [ ] Very large monitor (1440px+)

### Responsive Testing Checklist

```
MOBILE (375px)
[ ] No horizontal scroll
[ ] Touch targets ≥48px
[ ] Text readable
[ ] Navigation accessible
[ ] Forms usable
[ ] No layout shift on orient change
[ ] Images load and scale

TABLET (768px)
[ ] 2-column layouts work
[ ] Navigation visible
[ ] Images properly scaled
[ ] Touch interactions work
[ ] Forms accessible

DESKTOP (1200px)
[ ] Full layout visible
[ ] 4-column layouts work
[ ] Content properly spaced
[ ] Navigation full
[ ] All features accessible

WIDE (1440px)
[ ] Content width reasonable
[ ] No excessive whitespace
[ ] Readability maintained
[ ] Layout balanced
```

### Common Responsive Issues to Watch For

| Issue | Solution |
|-------|----------|
| Horizontal scroll on mobile | Check max-width on containers, padding on edges |
| Text too small on mobile | Increase font size, consider line-height |
| Images overflow | Use `max-width: 100%` and `height: auto` |
| Touch targets too small | Ensure ≥48px × 48px minimum |
| Layout shift on orientation change | Use appropriate media queries |
| Modal doesn't fit screen | Ensure height: auto on mobile, add scrolling |

---

## T039: Animation Performance Testing

Verify animations run smoothly at 60 FPS (frames per second).

### What is 60 FPS?

- 60 FPS = smooth animation
- 30 FPS = noticeable jank/stuttering
- < 30 FPS = severely choppy

### Testing Procedure

#### Step 1: Open DevTools Performance tab

1. Press `F12` or `Cmd+Option+I`
2. Click "Performance" tab
3. Click the record button (circle icon)

#### Step 2: Trigger animations

While recording, perform these actions:
- [ ] Scroll through the homepage (should trigger entrance animations)
- [ ] Hover over buttons (hover animations)
- [ ] Click quiz next button (page transition)
- [ ] Switch languages (if applicable)
- [ ] Open/close modals
- [ ] Trigger any animations in header/navbar

#### Step 3: Stop recording

Click the record button again to stop. Analysis will appear.

#### Step 4: Analyze performance

Look for these metrics:

**FPS (Frames Per Second)**
- Green line at top shows FPS over time
- [ ] Mostly green (60 FPS) ✅
- [ ] Yellow lines acceptable (30-60 FPS) ⚠️
- [ ] Red lines problematic (< 30 FPS) ❌

**Frame Rendering**
- Check "Frame rate" section
- [ ] Average ≥ 50 FPS

**Long Tasks**
- Tasks taking > 50ms are problematic
- [ ] No tasks > 100ms during animations
- [ ] Most tasks < 50ms

#### Step 5: Check specific animations

**Hero Section Animation:**
1. Scroll to hero section
2. Start performance recording
3. Look for entrance animation
4. [ ] Should see 60 FPS during animation

**Button Hover Effects:**
1. Start recording
2. Hover over buttons
3. [ ] FPS remains high during hover

**Quiz Transitions:**
1. Start recording
2. Click "Next" button in quiz
3. [ ] Page transition smooth (60 FPS)

**Module Card Hover:**
1. Scroll to module cards
2. Start recording
3. Hover over card
4. [ ] Glow effect smooth (60 FPS)

### Animation Performance Checklist

```
SMOOTH ANIMATIONS (60 FPS)
[ ] Hero entrance animation
[ ] Module card hover effects
[ ] Button hover states
[ ] Page transitions
[ ] Quiz progression
[ ] Modal open/close
[ ] Sidebar/menu animations
[ ] Scroll animations
[ ] Language switch animation
[ ] Timeline expand/collapse

PERFORMANCE TARGETS
[ ] Average FPS: ≥ 50
[ ] Peak FPS: 60
[ ] Long tasks: < 100ms
[ ] Layout shifts: Minimal
```

### Common Animation Performance Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Jank during scroll | Heavy DOM manipulation | Use CSS transforms, will-change |
| Stuttering animations | JavaScript blocking | Debounce/throttle event handlers |
| GPU memory issues | Too many animated elements | Limit concurrent animations |
| Layout thrashing | Measuring/modifying DOM repeatedly | Batch DOM operations |

### Optimization Tips

If animations are choppy:

1. **Use CSS Transforms**
   ```css
   /* Good - GPU accelerated */
   transform: translateX(100px);
   transform: scale(1.1);

   /* Bad - triggers layout */
   left: 100px;
   width: 110%;
   ```

2. **Use will-change (sparingly)**
   ```css
   .animated-element {
     will-change: transform;
   }
   ```

3. **Reduce animation complexity**
   - Simplify keyframes
   - Reduce number of properties being animated
   - Use shorter durations

4. **Profile regularly**
   - Run performance tests after major changes
   - Track FPS over time

---

## T040: Interactive States Testing

Verify all interactive elements have visible hover and focus states.

### What to Test

Interactive elements include:
- Buttons (all types)
- Links
- Form inputs
- Selects/dropdowns
- Checkboxes/radio buttons
- Cards (if clickable)
- Tabs
- Navigation items

### Testing Procedure

#### Step 1: Visual Hover States

For each interactive element:

**Buttons:**
```
[ ] Primary button hover: Visual change (color, shadow, scale)
[ ] Secondary button hover: Visual change
[ ] Ghost button hover: Visual change
[ ] Disabled button: No hover effect
```

**Links:**
```
[ ] Navigation links: Underline or color change on hover
[ ] Content links: Color change or underline on hover
[ ] Footer links: Visual feedback on hover
```

**Form Elements:**
```
[ ] Input fields: Border color change, shadow, or background
[ ] Select dropdowns: Hover effect visible
[ ] Checkboxes: Hover style visible
[ ] Radio buttons: Hover style visible
```

**Cards:**
```
[ ] Module cards: Shadow increase, scale, or glow on hover
[ ] Content cards: Visual feedback on hover
```

**Navigation:**
```
[ ] Navbar items: Hover state visible
[ ] Sidebar items: Highlight on hover
[ ] Tab buttons: Active/hover state clear
```

#### Step 2: Focus States (Keyboard Navigation)

Press `Tab` key to navigate through interactive elements:

```
[ ] Focus ring visible on every interactive element
[ ] Focus ring has sufficient contrast
[ ] Focus ring is not obscured
[ ] Focus order is logical (left-to-right, top-to-bottom)
```

**Testing focus states:**

1. Open page in browser
2. Press `Tab` repeatedly
3. For each element that receives focus:
   - [ ] Is there a visible focus indicator?
   - [ ] Is it sufficient contrast (WCAG AA: 3:1)?
   - [ ] Is it not hidden behind other elements?
   - [ ] Does it make sense in page order?

#### Step 3: Focus Visible vs Focus Ring

**Focus-visible (preferred):**
- Shows focus ring only on keyboard navigation
- Not on mouse click (cleaner UI)

Test this:
1. Click a button with mouse → no focus ring
2. Tab to same button → focus ring appears
3. [ ] Only keyboard navigation shows focus ring

#### Step 4: Active States

Test elements in "active" state:

```
[ ] Currently selected tab: Visually distinct
[ ] Current page in navigation: Highlighted
[ ] Pressed button: Shows "pressed" state
[ ] Checked checkbox: Visually distinct
[ ] Selected radio button: Visually distinct
```

#### Step 5: Disabled States

Test disabled interactive elements:

```
[ ] Disabled buttons: Grayed out, cursor not-allowed
[ ] Disabled input fields: Grayed out or obvious
[ ] Disabled form controls: No interaction
[ ] Cursor changes to "not-allowed"
```

### Interactive States Checklist

```
HOVER STATES (All interactive elements)
[ ] Buttons have hover effect
[ ] Links have hover effect
[ ] Navigation items have hover effect
[ ] Cards have hover effect (if clickable)
[ ] Form inputs have hover effect
[ ] Tabs have hover effect
[ ] Clear visual feedback

FOCUS STATES (Keyboard navigation)
[ ] All focusable elements have focus indicator
[ ] Focus ring has sufficient contrast
[ ] Focus indicator not obscured
[ ] Focus order is logical
[ ] Focus visible on keyboard only (preferred)

ACTIVE STATES
[ ] Current page/tab is highlighted
[ ] Pressed buttons show active state
[ ] Selected items are visually distinct
[ ] Clear indication of current state

DISABLED STATES
[ ] Disabled elements are grayed out
[ ] Cursor is "not-allowed"
[ ] No interaction on disabled elements
[ ] Visually distinct from enabled state
```

### Accessibility Requirements

All interactive elements must meet:

1. **Visible Focus Indicator**
   - Cannot be a 1px outline
   - Minimum 2px, preferably 3px+
   - Sufficient contrast ratio (3:1 minimum)

2. **Logical Focus Order**
   - Left to right, top to bottom
   - No unexpected jumps
   - No tabindex > 0 (unless necessary)

3. **Keyboard Accessible**
   - All functions available via keyboard
   - No keyboard traps
   - Escape key closes modals

### Common Interactive State Issues

| Issue | Solution |
|-------|----------|
| No focus ring visible | Add outline or box-shadow on :focus-visible |
| Focus ring obscured | Increase z-index or reposition |
| Poor focus ring contrast | Use darker/lighter color that contrasts with background |
| Illogical tab order | Fix tabindex or DOM order |
| No hover effect | Add :hover styles |
| Disabled state unclear | Use reduced opacity and cursor: not-allowed |

### CSS Example: Proper Interactive States

```css
/* Hover state */
button:hover {
  background-color: #ff8c42;
  cursor: pointer;
}

/* Focus state (keyboard) */
button:focus-visible {
  outline: 3px solid #00f0ff;
  outline-offset: 2px;
}

/* Active state */
button:active {
  transform: scale(0.98);
}

/* Disabled state */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Current/selected state */
nav a.current {
  background-color: #ff6b35;
  font-weight: bold;
}
```

---

## Testing Execution Checklist

Before marking these tests complete, verify:

### T038 - Responsive Design
- [ ] Tested at all 4 breakpoints (375, 768, 1200, 1440px)
- [ ] No horizontal scrolling at any breakpoint
- [ ] Touch targets ≥48px
- [ ] Text readable at all sizes
- [ ] Images scale properly
- [ ] Tested on actual devices if available
- [ ] No layout shifts on orientation change

### T039 - Animation Performance
- [ ] Recorded performance during animations
- [ ] Average FPS ≥ 50 (preferably 60)
- [ ] No red frames during animations
- [ ] Long tasks < 100ms
- [ ] All major animations tested
- [ ] Mobile performance acceptable
- [ ] No GPU memory issues

### T040 - Interactive States
- [ ] All buttons have hover effects
- [ ] All links have hover effects
- [ ] All form inputs have hover effects
- [ ] Navigation has visible hover/active states
- [ ] Focus indicators visible on Tab
- [ ] Focus indicators have sufficient contrast
- [ ] Focus order is logical
- [ ] Disabled states are clear

---

## Final Approval

Once all tests pass:

```bash
# Run any automated tests
npm test

# Build the project
npm run build

# Verify no console errors
npm start
# (Check DevTools console for errors)
```

Then mark tasks complete:
- [ ] T038 ✅ Responsive behavior tested and verified
- [ ] T039 ✅ Animations smooth at 60 FPS verified
- [ ] T040 ✅ Interactive states properly implemented

---

For questions or issues during testing, check:
- [MDN: Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [WCAG 2.1 Focus Visible](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible)
