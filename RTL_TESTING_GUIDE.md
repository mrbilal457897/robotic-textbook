# RTL Layout Testing Guide (T113)

## Overview

This guide provides comprehensive procedures for testing Right-to-Left (RTL) layout support in Arabic (العربية) and Urdu (اردو) languages.

**Target Languages**:
- Arabic (ar) - Direction: rtl
- Urdu (ur) - Direction: rtl

**Related Languages** (LTR for reference):
- English (en) - Direction: ltr
- Chinese (zh) - Direction: ltr
- Spanish (es) - Direction: ltr

---

## Quick Start

### Switch to RTL Language

1. Open site in browser: `http://localhost:3000`
2. Click language selector in navbar
3. Select "العربية" (Arabic) or "اردو" (Urdu)
4. Page reloads in RTL mode
5. URL changes to: `/ar/` or `/ur/`

---

## T113: RTL Layout Testing Procedure

### Test Environment Setup

```bash
npm start
# Site runs at http://localhost:3000
```

### Browser DevTools Setup

For best results, test in:
- Chrome/Chromium (recommended for DevTools)
- Firefox (good RTL support)
- Safari (test on Mac if possible)
- Edge (Chromium-based)

### Testing Approach

Test each section systematically in both Arabic and Urdu, comparing to English baseline.

---

## Testing Checklist: Homepage Sections

### 1. Navbar/Header

**English (Baseline)**:
- [ ] Logo on left
- [ ] Navigation links in center
- [ ] Search button on right
- [ ] Language selector on right
- [ ] Login button on far right
- [ ] Left-to-right layout

**Arabic / Urdu (RTL)**:
- [ ] Logo on RIGHT (mirrored)
- [ ] Navigation links in center
- [ ] Search button on LEFT (mirrored)
- [ ] Language selector on LEFT (mirrored)
- [ ] Login button on FAR LEFT (mirrored)
- [ ] All text right-aligned
- [ ] Hamburger menu on LEFT (mirrored)
- [ ] Navbar properly reflects
- [ ] No layout overflow
- [ ] All elements properly spaced

**Specific Checks**:
```
English:  [Logo] [Nav] ... [Search] [Lang] [Login]
          ← to →

Arabic:   [Login] [Lang] [Search] ... [Nav] [Logo]
          → to ←
```

**Issue**: If layout doesn't mirror, check RTL CSS overrides

---

### 2. Hero Section

**English (Baseline)**:
- [ ] Hero image/gradient on right side
- [ ] Text content on left
- [ ] CTA button on left
- [ ] Text left-aligned

**Arabic / Urdu (RTL)**:
- [ ] Hero image/gradient on LEFT side (mirrored)
- [ ] Text content on RIGHT
- [ ] CTA button on RIGHT
- [ ] Text right-aligned
- [ ] Tagline properly mirrored
- [ ] No text overflow in hero
- [ ] Button text fully visible

**Specific Checks**:
```
English:  [Image] | [Text] [Button]
Arabic:   [Text] [Button] | [Image]
```

**Issue**: If image doesn't mirror, check CSS positioning

---

### 3. Module Cards Grid

**English (Baseline)**:
- [ ] Cards in 4-column grid (desktop)
- [ ] Left card first, right card last
- [ ] Card titles left-aligned
- [ ] Card text left-aligned

**Arabic / Urdu (RTL)**:
- [ ] Cards in 4-column grid (desktop)
- [ ] Grid direction reversed (right card first)
- [ ] Card titles right-aligned
- [ ] Card text right-aligned
- [ ] Card hover effect works
- [ ] Card content fully visible (no overflow)
- [ ] Cards properly spaced
- [ ] Grid maintains alignment

**Tablet Check** (768px):
- [ ] 2-column grid proper
- [ ] Cards fill width appropriately
- [ ] No horizontal scroll

**Mobile Check** (375px):
- [ ] 1-column grid
- [ ] Cards full width
- [ ] No overflow

**Issue**: If grid doesn't reverse, check CSS grid direction

---

### 4. Sidebar Navigation

**English (Baseline)**:
- [ ] Sidebar on LEFT
- [ ] Menu items indented left
- [ ] Scroll bar on RIGHT

**Arabic / Urdu (RTL)**:
- [ ] Sidebar on RIGHT (mirrored)
- [ ] Menu items indented right
- [ ] Scroll bar on LEFT
- [ ] Active item highlighted correctly
- [ ] No overlap with content
- [ ] Hover states work properly

**Issue**: If sidebar doesn't appear on right, check CSS positioning

---

### 5. Content Pages (Module Pages)

**English (Baseline)**:
- [ ] Content left-aligned
- [ ] Paragraphs flow left to right
- [ ] Images aligned correctly
- [ ] Lists with bullets on left

**Arabic / Urdu (RTL)**:
- [ ] Content right-aligned
- [ ] Paragraphs flow right to left
- [ ] Images positioned correctly (may be mirrored)
- [ ] Lists with bullets on right
- [ ] Reading order flows right to left
- [ ] No text overflow
- [ ] Line breaks appropriate for language
- [ ] Special characters render correctly

**Code Blocks** (should stay LTR):
- [ ] Code stays left-aligned (NOT mirrored)
- [ ] Code syntax highlighting preserves
- [ ] Code text readable
- [ ] Parentheses and brackets correct orientation
- [ ] Examples: `function test() {}` stays LTR

**Lists and Numbering**:
- [ ] Numbered lists: numbers on right
- [ ] Bulleted lists: bullets on right
- [ ] Nested lists indent correctly

**Issue**: If code block is mirrored, add `direction: ltr` CSS

---

### 6. Footer

**English (Baseline)**:
- [ ] Logo on left
- [ ] Links in center/right columns
- [ ] Copyright on bottom left
- [ ] Social icons on bottom right

**Arabic / Urdu (RTL)**:
- [ ] Logo on RIGHT (mirrored)
- [ ] Links in center/left columns (reversed)
- [ ] Copyright on bottom RIGHT (mirrored)
- [ ] Social icons on bottom LEFT (mirrored)
- [ ] All footer links clickable
- [ ] Footer text properly aligned
- [ ] No content overflow

**Issue**: If footer doesn't mirror, check CSS flex direction

---

### 7. Interactive Elements

#### Buttons

**English (Baseline)**:
- [ ] Button text left-aligned
- [ ] Button icon on right (if present)
- [ ] Button padding consistent

**Arabic / Urdu (RTL)**:
- [ ] Button text right-aligned
- [ ] Button icon on LEFT (mirrored)
- [ ] Button padding consistent on both sides
- [ ] Button hover effect works
- [ ] All buttons clickable and responsive
- [ ] Text fully visible (no truncation)

#### Form Inputs

**English (Baseline)**:
- [ ] Input field left-to-right
- [ ] Label on left
- [ ] Error messages below

**Arabic / Urdu (RTL)**:
- [ ] Input field right-to-left input direction
- [ ] Label on RIGHT
- [ ] Error messages below (still readable)
- [ ] Placeholder text right-aligned
- [ ] Cursor enters from right
- [ ] Input fully visible

#### Dropdown/Select

- [ ] Dropdown arrow on LEFT (mirrored)
- [ ] Menu items right-aligned
- [ ] Selection highlight correct
- [ ] Keyboard navigation works

#### Checkboxes & Radio Buttons

- [ ] Checkbox/radio on RIGHT
- [ ] Label on LEFT
- [ ] Both clickable
- [ ] Checked state visible

---

### 8. Tables (if present)

**English (Baseline)**:
- [ ] Headers left-aligned
- [ ] Data left-to-right flow
- [ ] Scroll bar on right

**Arabic / Urdu (RTL)**:
- [ ] Headers right-aligned
- [ ] Data right-to-left flow
- [ ] Scroll bar on LEFT
- [ ] All cells content visible
- [ ] No horizontal overflow on mobile
- [ ] Numbers stay LTR (if applicable)

---

### 9. Animations & Transitions

**English (Baseline)**:
- [ ] Animations smooth
- [ ] Entrance from left side
- [ ] Hover effects consistent

**Arabic / Urdu (RTL)**:
- [ ] Animations smooth (60 FPS)
- [ ] Entrance from right side (if applicable)
- [ ] Hover effects consistent
- [ ] Direction-aware animations working
- [ ] No animation stuttering

---

### 10. Images & Icons

**Icons** (directional):
- [ ] Back arrow points LEFT (← in LTR)
- [ ] Back arrow points RIGHT (→ in RTL)
- [ ] Forward arrow points RIGHT (→ in LTR)
- [ ] Forward arrow points LEFT (← in RTL)
- [ ] Chevrons/carets properly mirrored

**Non-directional Icons** (should NOT mirror):
- [ ] Hamburger menu stays same
- [ ] Plus/minus signs stay same
- [ ] Search icon stays same
- [ ] Checkmarks stay same

---

## Common RTL Issues & Solutions

### Issue 1: Layout Doesn't Mirror

**Symptoms**:
- Components still appear on left/right in RTL
- Grid doesn't reverse
- Sidebar on wrong side

**Solution**:
1. Check CSS uses `margin-inline-start/end` instead of `margin-left/right`
2. Check `flex-direction` is not hardcoded
3. Check CSS Grid uses `justify-items` not fixed positioning
4. Verify RTL CSS overrides in `src/css/rtl.css`

**CSS Check**:
```css
/* Wrong: */
.element {
  margin-left: 1rem;  /* ❌ Ignored in RTL */
}

/* Right: */
.element {
  margin-inline-start: 1rem;  /* ✅ Works in both LTR and RTL */
}
```

---

### Issue 2: Text Overflow

**Symptoms**:
- Text gets cut off in RTL languages
- Buttons too small for text
- Content extends beyond container

**Possible Causes**:
- Fixed width containers
- Hardcoded padding values
- Font size too large for space
- Long compound words in Arabic/Urdu

**Solution**:
1. Use `flex: 1` or `flex-grow` for flexible layouts
2. Use `padding-inline-start/end` for padding
3. Test with actual Arabic/Urdu text (not English)
4. Check text-overflow CSS property
5. Use `word-break: break-word` if needed

---

### Issue 3: Code Blocks Mirrored (Wrong)

**Symptoms**:
- Code text flows right-to-left
- Parentheses in wrong order: `}( dnuof`
- Code unreadable

**Solution**:
1. Add to code block CSS:
```css
code, pre {
  direction: ltr !important;
  text-align: left !important;
}
```

2. Ensure code block inherits `direction: ltr`

---

### Issue 4: Sidebar/Drawer on Wrong Side

**Symptoms**:
- Sidebar appears on left in RTL mode
- Drawer slides from wrong direction

**Solution**:
1. Check CSS positioning:
```css
/* Wrong: */
.sidebar {
  left: 0;  /* ❌ Wrong side in RTL */
}

/* Right: */
.sidebar {
  inset-inline-start: 0;  /* ✅ Correct in both LTR/RTL */
}
```

2. Check if sidebar uses `position: absolute` vs `position: fixed`

---

### Issue 5: Images Incorrectly Mirrored

**Symptoms**:
- Images that should be LTR are flipped
- Text within images backwards
- Arrows pointing wrong way

**Solution**:
1. For images that should NOT be mirrored:
```css
img {
  direction: ltr;  /* Prevents image mirroring */
}
```

2. Only mirror directional graphics (arrows, indicators)

---

## Responsive RTL Testing

### Mobile (375px)

**Orientation: Portrait**
- [ ] Content full width
- [ ] Text readable
- [ ] Buttons touchable (≥48px)
- [ ] Sidebar drawer opens from right
- [ ] Hamburger menu on left
- [ ] No horizontal scroll
- [ ] Images scale properly

**Orientation: Landscape**
- [ ] Layout adapts to width
- [ ] No content hidden
- [ ] Touch targets still adequate
- [ ] Navigation accessible

### Tablet (768px)

- [ ] 2-column layouts correct
- [ ] Sidebar visible or drawer accessible
- [ ] Images properly sized
- [ ] Text readable at size
- [ ] Touch interaction works

### Desktop (1200px+)

- [ ] Full layout visible
- [ ] 4-column grids display correctly
- [ ] Sidebar properly positioned
- [ ] All interactive elements accessible

---

## Keyboard Navigation RTL Testing

### Tab Order

**English (Baseline)**:
- [ ] Tab moves left to right
- [ ] Shift+Tab moves right to left

**Arabic / Urdu (RTL)**:
- [ ] Tab moves right to left (visual direction)
- [ ] Shift+Tab moves left to right
- [ ] Focus indicator visible at each step
- [ ] No focus traps
- [ ] Logical tab order maintained

### Arrow Keys

**English (Baseline)**:
- [ ] Right arrow moves next
- [ ] Left arrow moves previous

**Arabic / Urdu (RTL)**:
- [ ] Left arrow moves next (visual direction)
- [ ] Right arrow moves previous (visual direction)
- [ ] Menu navigation works correctly
- [ ] Slider/carousel responds to correct keys

---

## Language-Specific Text Testing

### Arabic (العربية)

**Text to Test**:
```
مرحبا بك في مشروع الذكاء الجسدي
```

**Checklist**:
- [ ] Text displays without rendering errors
- [ ] Diacritical marks visible (إ, ح, ع, etc.)
- [ ] Special character connections preserve
- [ ] Long text wraps correctly
- [ ] Text right-aligned in all UI elements

### Urdu (اردو)

**Text to Test**:
```
جسمانی ذہانت میں خوش آمدید
```

**Checklist**:
- [ ] Text displays without rendering errors
- [ ] Urdu-specific characters render (ء, ع, غ, ق)
- [ ] Word spacing appropriate
- [ ] Ligatures work correctly
- [ ] Text right-aligned in all UI elements

---

## Accessibility RTL Testing

### Focus Indicators

- [ ] Focus ring visible in both LTR and RTL
- [ ] Focus ring has 3:1 contrast ratio
- [ ] Focus ring doesn't get cut off
- [ ] Focus order is logical

### Screen Reader

**Test with NVDA, JAWS, or VoiceOver**:
- [ ] Page structure announced correctly
- [ ] Navigation read in proper order
- [ ] Form labels associated with inputs
- [ ] Alt text on images accurate
- [ ] Link text meaningful
- [ ] Language change announced

---

## Performance RTL Testing

### Animation Performance

- [ ] Animations smooth at 60 FPS in RTL
- [ ] No layout thrashing
- [ ] CSS transforms used (not left/right positioning)
- [ ] Animation timing consistent LTR/RTL

### Page Load

- [ ] Page loads same speed in RTL
- [ ] No RTL-specific performance regression
- [ ] Bundle size consistent

---

## Testing Checklist Summary

### Homepage Sections
- [ ] Navbar mirrors correctly
- [ ] Hero section layout reversed
- [ ] Module cards grid reversed
- [ ] Sidebar on right side
- [ ] Footer mirrored

### Content Pages
- [ ] Text right-aligned
- [ ] Lists have bullets on right
- [ ] Code blocks stay LTR
- [ ] Images positioned correctly
- [ ] Links work and underlines correct

### Interactive Elements
- [ ] Buttons properly aligned
- [ ] Form inputs accept RTL input
- [ ] Dropdowns display correctly
- [ ] Checkboxes/radios on right
- [ ] Hover/focus states work

### Responsive
- [ ] Mobile (375px) displays correctly
- [ ] Tablet (768px) layout proper
- [ ] Desktop (1200px+) fully visible
- [ ] No horizontal scrolling

### Accessibility
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Screen reader compatible
- [ ] Tab order logical

### Performance
- [ ] Animations smooth (60 FPS)
- [ ] Page loads quickly
- [ ] No layout shifts
- [ ] Text renders cleanly

---

## After Testing

### If Issues Found

1. Document issue:
   - Browser/device tested on
   - Language and URL
   - Description and screenshot
   - Expected vs actual behavior

2. Fix in CSS:
   - Update `src/css/rtl.css` with fixes
   - Use `direction: ltr` for code blocks
   - Use `margin-inline-start/end` instead of `margin-left/right`
   - Use `inset-inline-start/end` instead of `left/right`

3. Re-test to verify fix

### Final Validation

Before marking complete:
- [ ] All homepage sections tested in Arabic and Urdu
- [ ] No layout issues found
- [ ] Text properly aligned
- [ ] Interactive elements work
- [ ] Responsive design maintains across breakpoints
- [ ] Keyboard navigation correct
- [ ] No performance degradation

---

## References

- [MDN: CSS Logical Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties)
- [W3C: Structural Markup and Right-to-Left Text](https://www.w3.org/International/questions/qa-html-dir)
- [Arabic Web Typography](https://www.sitepoint.com/guide-arabic-web-typography/)
- [Chromatic: RTL Testing](https://www.chromatic.com/blog/visual-testing-for-rtl-interfaces/)

---

## Questions?

For RTL testing support:
1. Check CSS in `src/css/rtl.css` for proper overrides
2. Verify docusaurus.config.ts has correct RTL direction settings
3. Test both Arabic and Urdu for language-specific rendering issues
4. Use Chrome DevTools to inspect CSS and verify logical properties are used
