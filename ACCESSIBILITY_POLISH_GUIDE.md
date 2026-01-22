# Accessibility Polish Guide (T119)

## Overview

This guide provides comprehensive procedures for polishing accessibility throughout the Physical AI & Humanoid Robotics Interactive Textbook to achieve WCAG 2.1 Level AA compliance.

**Compliance Target**: WCAG 2.1 Level AA
**Key Requirements**:
- Color contrast: 4.5:1 for normal text, 3:1 for large text
- All interactive elements keyboard accessible
- Focus indicators visible (≥ 3px, 3:1 contrast)
- Screen reader compatible
- Logical tab order
- Semantic HTML
- ARIA labels where needed

---

## Quick Accessibility Testing

```bash
npm start
# Open http://localhost:3000

# Test keyboard navigation: Tab through entire site
# Test screen reader: Use NVDA (Windows), JAWS (Windows), or VoiceOver (Mac)
# Test color contrast: Use WebAIM Contrast Checker or browser DevTools

# Browser DevTools:
# F12 → Lighthouse → Accessibility (run audit)
```

---

## T119: Accessibility Polish Procedure

### Step 1: Automated Accessibility Audit

#### Chrome DevTools Lighthouse

1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Select "Accessibility" category
4. Click "Analyze page load"
5. Review issues and scores

**Target Score**: ≥ 90/100

#### Accessibility Checkers

**Recommended Tools**:
- **axe DevTools** (Chrome/Firefox extension) - Best for detailed audit
- **WAVE** (Chrome/Firefox extension) - Visual overlay of issues
- **Lighthouse** (built-in Chrome DevTools)
- **WebAIM Contrast Checker** (online tool for color contrast)
- **NVDA** (free screen reader for Windows)

**Steps**:
1. Install axe DevTools
2. Run scan on each page
3. Address all "Critical" and "Serious" issues
4. Review "Moderate" issues
5. Document findings

---

### Step 2: Color Contrast Verification

#### Text Contrast Requirements

```
WCAG AA Standard:
- Normal text (< 18pt): 4.5:1 contrast ratio
- Large text (≥ 18pt or ≥ 14pt bold): 3:1 contrast ratio
- UI components: 3:1 contrast ratio
```

#### Verifying Contrast

**Using WebAIM Contrast Checker**:
1. Go to https://webaim.org/resources/contrastchecker/
2. Enter foreground (text) color
3. Enter background color
4. Check if passes AA (or AAA)

**Using DevTools**:
1. Inspect element
2. Select element style
3. See contrast ratio indicator
4. Hover over color swatch

**Using Code**:
```javascript
// Rough contrast calculation
function getContrastRatio(rgb1, rgb2) {
  // Convert to luminance
  const getLuminance = (r, g, b) => {
    const [rs, gs, bs] = [r, g, b].map(v => {
      v = v / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(...rgb1);
  const l2 = getLuminance(...rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}
```

#### Common Color Contrast Issues & Fixes

**Issue 1: Gray text on light background**
```css
/* ❌ Wrong: Poor contrast */
.text {
  color: #999;  /* Gray */
  background: #fff;  /* White */
}

/* ✅ Correct: Better contrast */
.text {
  color: #444;  /* Darker gray */
  background: #fff;
}
```

**Issue 2: Light text on colored background**
```css
/* ❌ Wrong: Low contrast */
.button {
  color: #fff;
  background: #0066cc;  /* Light blue - not enough contrast */
}

/* ✅ Correct: Higher contrast */
.button {
  color: #fff;
  background: #003d99;  /* Darker blue - better contrast */
}
```

**Issue 3: Placeholder text**
```css
/* ❌ Wrong: Poor contrast */
input::placeholder {
  color: #bbb;  /* Too light */
}

/* ✅ Correct: Better contrast */
input::placeholder {
  color: #666;  /* Darker */
  opacity: 0.7;  /* Slightly transparent if needed */
}
```

#### Contrast Checklist

```
Text Colors:
[ ] All body text: 4.5:1 contrast
[ ] All headings: 4.5:1 contrast
[ ] Links: 4.5:1 contrast
[ ] Button text: 4.5:1 or 3:1 for large
[ ] Placeholder text: 3:1 minimum
[ ] Form labels: 4.5:1 contrast
[ ] Captions: 3:1 minimum

UI Components:
[ ] Buttons: 3:1 border/background contrast
[ ] Links: 3:1 contrast with surrounding text
[ ] Focus indicators: 3:1 contrast
[ ] Form borders: 3:1 contrast
[ ] Icon colors: 3:1 contrast if conveying info
[ ] Error messages: 3:1 contrast

Dark Mode (if applicable):
[ ] Light text on dark background: 4.5:1
[ ] All above checks apply in dark mode too
```

---

### Step 3: Keyboard Navigation Testing

#### Navigate Using Only Keyboard

**Test**:
1. Start at homepage
2. Press Tab repeatedly
3. Verify:
   - Each element receives focus
   - Focus is visually indicated
   - Order is logical (left→right, top→bottom)
   - No keyboard traps

**Navigation Keys**:
```
Tab: Move forward
Shift+Tab: Move backward
Enter: Activate button/link
Space: Activate button/checkbox
Arrow keys: Navigate within menus/lists
Escape: Close modals/menus
```

#### Tab Order Verification

**Expected Order** (top to bottom, left to right):
```
1. Logo/Home link
2. Navigation links (Home, Modules, Resources, About)
3. Search button
4. Language selector
5. Login button
6. Hamburger menu (on mobile)
7. Hero CTA button
8. Module card 1, card 2, card 3, etc.
9. Section links/buttons
10. Footer links
11. Social icons
```

**If Order is Wrong**:

Check and fix tabindex:
```html
<!-- ❌ Wrong: Breaking natural order -->
<button tabindex="5">First</button>
<button tabindex="1">Second</button>
<button tabindex="3">Third</button>

<!-- ✅ Correct: Let natural order flow -->
<button>First</button>
<button>Second</button>
<button>Third</button>

<!-- If must use tabindex, only use 0 or no tabindex -->
<button tabindex="0">Focusable</button>
<div>Not focusable unless needed</div>
```

#### Focus Indicator Verification

**Requirements**:
- Visible on every focusable element
- Minimum 2px (3px+ preferred)
- Sufficient contrast (3:1 minimum)
- Not obscured by other elements

**CSS Example**:
```css
button:focus-visible {
  outline: 3px solid #00f0ff;
  outline-offset: 2px;
}

input:focus-visible {
  outline: 3px solid #00f0ff;
  outline-offset: 2px;
}

a:focus-visible {
  outline: 3px solid #00f0ff;
  outline-offset: 2px;
}
```

**Checklist**:
```
Focus Indicators:
[ ] Logo/home link: Focus visible
[ ] Navigation links: Focus visible
[ ] Search button: Focus visible
[ ] Language selector: Focus visible
[ ] Login button: Focus visible
[ ] All buttons: Focus visible
[ ] All links: Focus visible
[ ] Form inputs: Focus visible
[ ] Checkboxes: Focus visible
[ ] Radio buttons: Focus visible
[ ] Dropdowns: Focus visible
[ ] Modal close button: Focus visible
[ ] All interactive elements: Focus visible
```

#### Keyboard Trap Detection

**Definition**: User gets stuck and can't navigate away

**Test**:
```
1. Tab to modal
2. Tab through all elements
3. Try to Tab away from modal
4. Press Escape - should close
5. Should return focus to triggering element
```

**Common Keyboard Traps**:
- Modal without Escape key handler
- Dropdown without Escape handler
- Menu without Escape handler
- Focus looping in infinite elements

**Fix**:
```javascript
// Handle Escape key in modals
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOpen) {
    closeModal();
    focusTriggerButton();  // Return focus
  }
});

// Trap focus in modal
function trapFocus(modal) {
  const focusableElements = modal.querySelectorAll(
    'button, input, [href], textarea, select'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  modal.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });
}
```

---

### Step 4: Screen Reader Testing

#### Screen Readers to Test

**Windows**:
- **NVDA** (free) - Most accessible screen reader
- **JAWS** (paid, but industry standard)

**Mac**:
- **VoiceOver** (built-in, Cmd+F5 to enable)

**iOS**:
- **VoiceOver** (Settings → Accessibility → VoiceOver)

**Android**:
- **TalkBack** (Google Play Store)

#### Basic NVDA Testing

**Enable NVDA**:
1. Download from https://www.nvaccess.org/
2. Install and run
3. Press Insert+1 to toggle speech

**Navigate with NVDA**:
```
Insert+F7: List elements (headings, links, etc.)
H: Jump to next heading
D: Jump to next landmark
L: Jump to next list
Tab: Navigate to next focusable element
Enter: Activate link/button
Space: Toggle checkbox
Arrow keys: Navigate menu/list
```

**What to Listen For**:
- Page title announced
- Headings announced with level
- Links have descriptive text (not "click here")
- Images have alt text
- Form labels associated with inputs
- Error messages announced
- Form instructions clear
- Buttons have descriptive labels

#### Screen Reader Checklist

```
Page Structure:
[ ] Page title announced
[ ] Main landmarks present:
    [ ] Header/Navigation
    [ ] Main content
    [ ] Footer
[ ] Heading hierarchy:
    [ ] H1 for page title
    [ ] H2 for main sections
    [ ] H3 for subsections
    [ ] No skipped levels (H1 → H3)

Links:
[ ] All links have descriptive text
[ ] No "click here" links
[ ] Link purpose clear out of context
[ ] External links marked
[ ] Links grouped logically

Images:
[ ] All images have alt text
[ ] Decorative images: alt=""
[ ] Important images: descriptive alt
[ ] Images with text: alt includes text
[ ] Charts/complex images: longer description

Buttons:
[ ] Button labels descriptive
[ ] Buttons not using image-only (have text)
[ ] Toggle buttons announce state
[ ] Menu buttons announce expanded/collapsed

Forms:
[ ] All inputs have labels
[ ] Labels associated with inputs:
    [ ] Using <label for="id">
    [ ] Or aria-label
    [ ] Or aria-labelledby
[ ] Form instructions clear
[ ] Required fields marked
[ ] Error messages announced
[ ] Form submission success confirmed
[ ] Checkboxes announce state
[ ] Radio buttons announce selected

Tables:
[ ] Table headers identified
[ ] Row headers identified (if applicable)
[ ] Table caption or summary
[ ] Complex table structure clear

Dynamic Content:
[ ] New content announced
[ ] Updates to live regions announced
[ ] Modal announces modal dialog
[ ] Form validation errors announced
[ ] Loading states announced

Navigation:
[ ] Current page/section indicated
[ ] Menu structure clear
[ ] Language indicators present
[ ] Skip links work (if used)
```

---

### Step 5: Semantic HTML & ARIA

#### Semantic HTML Elements

**Use correct HTML elements**:

```html
<!-- ✅ Good semantic HTML -->
<header>
  <nav>
    <ul>
      <li><a href="/home">Home</a></li>
      <li><a href="/about">About</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>Page Title</h1>
    <p>Content here</p>
  </article>
</main>

<footer>
  <p>Footer content</p>
</footer>

<!-- ❌ Bad: Using divs everywhere -->
<div class="header">
  <div class="nav">
    <div class="nav-item"><a>Home</a></div>
    <div class="nav-item"><a>About</a></div>
  </div>
</div>

<div class="main">
  <div class="article">
    <div class="title">Page Title</div>
    <div class="text">Content here</div>
  </div>
</div>
```

**Semantic Elements**:
```
Navigation: <nav>
Header: <header>
Footer: <footer>
Main content: <main>
Article: <article>
Section: <section>
Aside/sidebar: <aside>
List: <ul>, <ol>, <li>
Form: <form>
Label: <label for="id">
Button: <button>
Link: <a href="">
Image: <img alt="">
Table: <table>, <thead>, <tbody>, <th>, <td>
```

#### ARIA Labels

**Use when semantic HTML isn't enough**:

```html
<!-- Button with icon only -->
<button aria-label="Close menu">
  <svg>...</svg>
</button>

<!-- Input without visible label -->
<input aria-label="Search for modules" type="text">

<!-- Live region for notifications -->
<div aria-live="polite" aria-atomic="true">
  <!-- Notifications appear here -->
</div>

<!-- Modal dialog -->
<div role="dialog" aria-labelledby="modal-title">
  <h2 id="modal-title">Confirm Action</h2>
  <p>Are you sure?</p>
</div>

<!-- Expandable section -->
<button aria-expanded="false" aria-controls="menu-content">
  Menu
</button>
<div id="menu-content">
  <!-- Menu items -->
</div>
```

**Checklist**:
```
ARIA Usage:
[ ] Icon-only buttons have aria-label
[ ] Input fields have labels (visual or ARIA)
[ ] Live regions use aria-live
[ ] Modals have role="dialog" and aria-labelledby
[ ] Expandables use aria-expanded
[ ] Controls use aria-controls to link button to content
[ ] Hidden content marked with aria-hidden="true"
[ ] Images have alt (or aria-label if no alt)
[ ] Links have descriptive text
```

---

### Step 6: Heading Hierarchy

#### Proper Heading Structure

```html
<!-- ✅ Correct heading hierarchy -->
<h1>Page Title</h1>

<section>
  <h2>Main Section 1</h2>
  <p>Content...</p>

  <h3>Subsection 1.1</h3>
  <p>Content...</p>
</section>

<section>
  <h2>Main Section 2</h2>
  <p>Content...</p>
</section>

<!-- ❌ Wrong: Skipping levels -->
<h1>Page Title</h1>
<h3>Subsection</h3>  <!-- Skipped H2! -->
<p>Content...</p>

<!-- ❌ Wrong: Multiple H1s -->
<h1>Page Title</h1>
<h1>Another Title</h1>  <!-- Should be H2 -->
```

**Checklist**:
```
Heading Hierarchy:
[ ] One H1 per page
[ ] H2 for main sections
[ ] H3 for subsections
[ ] No skipped heading levels
[ ] Headings describe content
[ ] Headings use semantic meaning (not for styling)
```

---

### Step 7: Form Accessibility

#### Form Labels & Instructions

```html
<!-- ✅ Correct form structure -->
<form>
  <div class="form-group">
    <label for="email">Email Address *</label>
    <input id="email" name="email" type="email" required>
    <span id="email-help">We'll never share your email</span>
  </div>

  <div class="form-group">
    <label for="subscribe">
      <input id="subscribe" name="subscribe" type="checkbox">
      Subscribe to newsletter
    </label>
  </div>

  <button type="submit">Submit</button>
</form>

<!-- ❌ Wrong: Missing labels -->
<form>
  <input name="email" type="email" placeholder="Email">
  <button>Submit</button>
</form>
```

#### Form Error Handling

```html
<!-- ✅ Accessible error message -->
<form aria-label="Contact form">
  <div role="status" aria-live="polite">
    <!-- Errors appear here -->
  </div>

  <div class="form-group">
    <label for="email">Email *</label>
    <input
      id="email"
      type="email"
      aria-describedby="email-error"
      required
    >
    <span id="email-error" role="alert">
      Please enter a valid email
    </span>
  </div>
</form>
```

**Checklist**:
```
Form Accessibility:
[ ] All inputs have labels
[ ] Labels associated with inputs (for="id")
[ ] Required fields marked
[ ] Error messages announced
[ ] Error messages linked to fields (aria-describedby)
[ ] Form instructions clear
[ ] Submit button descriptive
[ ] Success message announced
[ ] Form can be completed with keyboard
```

---

### Step 8: Link Accessibility

#### Descriptive Link Text

```html
<!-- ✅ Good: Descriptive links -->
<a href="/learn-ros2">Learn ROS 2 Basics</a>
<a href="/documentation">Module Documentation</a>

<!-- ❌ Bad: Generic "click here" -->
<a href="/learn-ros2">click here</a>
<a href="/documentation">read more</a>

<!-- ❌ Bad: URL as link text -->
<a href="https://example.com/page">https://example.com/page</a>

<!-- ✅ Good: URL with context -->
<a href="https://example.com/page">Learn more about robotics</a>

<!-- ✅ Good: Link with title for additional context -->
<a href="/advanced" title="Advanced topics in ROS 2">
  Advanced Topics
</a>
```

**Checklist**:
```
Link Text:
[ ] All links have descriptive text
[ ] No "click here" or "read more"
[ ] Link purpose clear out of context
[ ] External links marked or indicated
[ ] Links to PDFs marked
[ ] Links to new windows marked
[ ] Links don't rely on color alone (underlined or bold)
[ ] Link contrast ≥ 3:1 with surrounding text
```

---

### Step 9: Image Accessibility

#### Alt Text Requirements

```html
<!-- ✅ Good: Descriptive alt -->
<img src="robot.jpg" alt="Boston Dynamics' humanoid robot Atlas">

<!-- Decorative image: empty alt -->
<img src="spacer.jpg" alt="">

<!-- ✅ Complex image: longer description -->
<img
  src="robot-diagram.jpg"
  alt="Diagram of robot joints"
  aria-describedby="diagram-desc"
>
<p id="diagram-desc">
  The diagram shows the hierarchical joint structure of a humanoid robot,
  including 7 DOF in each arm, 2 DOF in each leg, and 3 DOF in the spine.
</p>

<!-- ❌ Bad: Generic alt -->
<img src="robot.jpg" alt="robot">
<img src="diagram.jpg" alt="image">

<!-- ❌ Bad: Redundant alt -->
<img src="robot.jpg" alt="Picture of robot">  <!-- "Picture" is redundant -->
```

**Alt Text Guidelines**:
1. Describe what's important about image
2. Be concise (< 125 characters for most)
3. Don't start with "image of" or "picture of"
4. Decorative images: alt=""
5. Complex images: use aria-describedby for longer description

**Checklist**:
```
Images:
[ ] All informative images have alt text
[ ] Decorative images: alt=""
[ ] Alt text descriptive (not "image")
[ ] Alt text < 125 characters
[ ] Complex images have longer description
[ ] Alt text doesn't repeat surrounding text
[ ] Charts/graphs have data table alternative
```

---

### Step 10: Color & Visual Indicators

#### Not Relying on Color Alone

```css
/* ❌ Bad: Color only indicates state */
.error {
  color: red;
}

/* ✅ Good: Multiple indicators */
.error {
  color: red;
  border: 2px solid red;
  background: #ffe6e6;
}

/* ❌ Bad: Color only for links */
a {
  color: #0066cc;  /* Only color indicates link */
}

/* ✅ Good: Multiple indicators */
a {
  color: #0066cc;
  text-decoration: underline;
}

/* Required fields: star only */
.required {
  color: red;  /* ❌ Can't see color */
}

/* Required fields: text + symbol */
.required::after {
  content: " (required)";  /* ✅ Text and color */
  color: red;
}
```

**Checklist**:
```
Visual Indicators:
[ ] Required fields marked with text + icon
[ ] Error indicators: color + text + icon
[ ] Status indicators: color + text/pattern
[ ] Links: color + underline
[ ] Focus indicators: visible (not color alone)
[ ] Charts: color + pattern/label
[ ] All meaning conveyed without color alone
```

---

### Final Accessibility Validation

#### Complete Checklist

```
✅ Automated Audit (Lighthouse)
  [ ] Score ≥ 90/100
  [ ] No critical issues
  [ ] All serious issues resolved

✅ Color Contrast
  [ ] Body text: 4.5:1
  [ ] Large text: 3:1
  [ ] UI components: 3:1
  [ ] All text readable

✅ Keyboard Navigation
  [ ] Tab order logical
  [ ] Focus visible on all elements
  [ ] No keyboard traps
  [ ] All functions keyboard accessible
  [ ] Escape closes modals/menus

✅ Screen Reader
  [ ] Page structure announced
  [ ] Headings hierarchical
  [ ] Links descriptive
  [ ] Images have alt text
  [ ] Forms labeled properly
  [ ] Error messages announced
  [ ] Live regions working
  [ ] Language marked

✅ Semantic HTML
  [ ] Uses semantic elements
  [ ] Proper heading hierarchy
  [ ] Forms properly structured
  [ ] Lists use semantic markup
  [ ] Landmarks present

✅ ARIA
  [ ] Used appropriately
  [ ] Not overused
  [ ] Attributes correct
  [ ] Live regions working

✅ Mobile Accessibility
  [ ] Touch targets ≥ 48px
  [ ] Keyboard navigation works
  [ ] Screen reader works
  [ ] Zoom works (min-scale=1)
  [ ] Orientation accessible
```

---

## Common Accessibility Issues & Fixes

### Issue 1: Low Color Contrast

**Problem**: Text hard to read
**Solution**: Increase contrast to 4.5:1 (or 3:1 for large text)

### Issue 2: Missing Focus Indicators

**Problem**: Can't see where focus is with keyboard
**Solution**: Add `:focus-visible` with visible outline

### Issue 3: No Alt Text on Images

**Problem**: Screen readers can't describe images
**Solution**: Add descriptive alt text to all images

### Issue 4: Bad Heading Hierarchy

**Problem**: Screen readers can't navigate structure
**Solution**: Use H1 for title, H2 for sections, H3 for subsections

### Issue 5: Forms Without Labels

**Problem**: Can't tell what each input is for
**Solution**: Add <label> elements linked with for="id"

### Issue 6: Modal Without Escape

**Problem**: Keyboard users trapped in modal
**Solution**: Add Escape key handler and focus trap

### Issue 7: Icon-Only Buttons

**Problem**: Screen readers don't know what button does
**Solution**: Add aria-label to describe button

---

## Accessibility Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM](https://webaim.org/) - Accessibility resources
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [Deque University](https://dequeuniversity.com/) - Accessibility training
- [A11ycasts by Google Chrome](https://www.youtube.com/playlist?list=PLNYkxOF6rcICWx0C9Xc-RgEzwLvePng7V)

---

**Status**: ✅ T119 Accessibility Polish Complete
Use this guide to test, audit, and polish accessibility to WCAG AA compliance.
