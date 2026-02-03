# Phase 6: Citation Navigation Validation Guide

**User Story 4**: Citation Navigation and Source Preview
**Tasks**: T124-T125 (Manual QA)
**Purpose**: Validate that citation navigation and source preview work correctly across all devices

---

## Prerequisites

1. **Backend running**: `uvicorn src.main:app --reload --host 0.0.0.0 --port 8000` (from `backend/`)
2. **Frontend running**: `npm run dev` (from `frontend/`)
3. **Textbook content ingested**: At least one book in Qdrant vector database with citations
4. **Test devices**: Desktop browser, tablet, mobile device (or browser dev tools)
5. **Browser**: Chrome/Firefox/Safari for testing

---

## T124: Manual QA - Test Citation Navigation for 20 Different Citations

### Objective
Verify that the complete citation navigation workflow works correctly for a variety of citation types and content sources.

### Test Citation Types

Test **20 different citations** covering these categories:

#### Category 1: Different Chapter Citations (5 citations)
1. Citation from Chapter 1 (Introduction)
2. Citation from Chapter 3 (Mid-book content)
3. Citation from Chapter 7 (Later chapters)
4. Citation from Appendix or supplementary material
5. Citation from glossary or reference section

#### Category 2: Different Content Types (5 citations)
6. Citation from a paragraph (prose text)
7. Citation from a code block or example
8. Citation from a bulleted list
9. Citation from a table or figure caption
10. Citation from a definition or highlighted box

#### Category 3: Different Confidence Scores (5 citations)
11. High confidence citation (>90%)
12. Medium-high confidence (75-89%)
13. Medium confidence (60-74%)
14. Low-medium confidence (45-59%)
15. Low confidence (<45%)

#### Category 4: Edge Cases (5 citations)
16. Very short citation text (< 50 characters)
17. Very long citation text (> 500 characters)
18. Citation with special characters or formatting
19. Multiple citations from the same paragraph
20. Citation near the end of a chapter

### Test Procedure

For **each citation** (20 total):

#### Step 1: Trigger Citation
1. Open ChatPanel
2. Ask a question that generates the citation
3. **Record**: Question asked

#### Step 2: Verify Citation Badge
- [ ] Citation badge is visible in response
- [ ] Badge shows correct index number
- [ ] Badge has icon (BookOpen)
- [ ] Badge is clickable

#### Step 3: Test Hover Tooltip
- [ ] Hover over citation badge
- [ ] Tooltip appears within 300ms
- [ ] Tooltip shows chapter number
- [ ] Tooltip shows section (if applicable)
- [ ] Tooltip shows page number (if applicable)
- [ ] Tooltip shows confidence score
- [ ] Tooltip is readable (not cut off)

#### Step 4: Open Source Preview
- [ ] Click citation badge
- [ ] Source preview modal opens
- [ ] Modal displays within 500ms
- [ ] Modal has "Source Citation" header
- [ ] Modal shows chapter/section/page in header

#### Step 5: Verify Source Content
- [ ] Full passage text is displayed
- [ ] Text is readable (proper formatting, line breaks)
- [ ] Text matches expected citation source
- [ ] Background highlight (yellow) makes text stand out
- [ ] Confidence score is displayed
- [ ] Confidence score matches hover tooltip
- [ ] Chunk ID is displayed (monospace font)

#### Step 6: Verify Metadata
- [ ] Chapter title displayed (if available)
- [ ] Section title displayed (if available)
- [ ] All metadata is accurate

#### Step 7: Test "Go to Source" Navigation
- [ ] "Go to source" button is visible
- [ ] Button has external link icon
- [ ] Click button
- [ ] Page navigates to correct textbook chapter
- [ ] URL changes to chapter URL
- [ ] URL includes hash fragment (e.g., #chunk_00042)

#### Step 8: Verify Paragraph Highlighting
- [ ] Target paragraph is visible on screen
- [ ] Paragraph has yellow/amber highlight
- [ ] Highlight animation starts immediately
- [ ] Highlight fades smoothly over 2 seconds
- [ ] After 2 seconds, highlight is gone completely
- [ ] Paragraph remains visible (not scrolled away)

#### Step 9: Close Modal
- [ ] Click Close button (X icon)
- [ ] Modal closes
- [ ] Can reopen by clicking citation again

### Validation Spreadsheet Template

Use this template to record test results:

| # | Question | Chapter | Confidence | Badge Visible | Tooltip OK | Preview Opens | Content Accurate | Nav Works | Highlight OK | Result |
|---|----------|---------|------------|---------------|------------|---------------|------------------|-----------|--------------|--------|
| 1 | [Question] | Ch 1 | 95% | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | PASS |
| 2 | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 20 | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |

### Acceptance Criteria

✅ **PASS** if:
- **18/20 citations** (90%) pass all 9 test steps
- Badge and tooltip work for 100% of citations
- Source preview displays correctly for ≥ 95% of citations
- "Go to source" navigation works for ≥ 90% of citations
- Paragraph highlighting works for ≥ 85% of navigations

❌ **FAIL** if:
- More than 2 citations fail multiple steps
- Badge or tooltip broken for any citation
- Source preview doesn't open for > 5% of citations
- Navigation fails for > 10% of citations
- Highlighting doesn't work for > 15% of navigations

---

## T125: Verify Scroll-to-Source Works on Desktop and Mobile

### Objective
Ensure citation navigation and paragraph highlighting work correctly across different screen sizes and devices.

### Test Devices

Test on **minimum 3 devices/viewport sizes**:

1. **Desktop** (1920x1080 or larger)
2. **Tablet** (768x1024, iPad size)
3. **Mobile** (375x667, iPhone size)

### Test Procedure

For **each device**:

#### Setup
1. Open textbook chapter in browser
2. Ensure device is at test viewport size
3. Enable device toolbar in Chrome DevTools (for simulated devices)

#### Test 1: Citation Badge Interaction

**Desktop**:
- [ ] Citation badges are visible and properly sized
- [ ] Hover tooltip appears on mouse hover
- [ ] Badge responds to click immediately
- [ ] Modal is centered and fully visible
- [ ] "Go to source" button is easily clickable

**Tablet**:
- [ ] Citation badges are touch-friendly (min 44x44px)
- [ ] Tap triggers modal (no hover on touch devices)
- [ ] Modal fills most of screen width
- [ ] Modal text is readable
- [ ] Buttons are touch-friendly

**Mobile**:
- [ ] Citation badges are large enough to tap
- [ ] Single tap opens modal (no accidental double-taps)
- [ ] Modal fills screen width (minus padding)
- [ ] Text doesn't overflow horizontally
- [ ] Buttons are easy to tap (no mis-taps)

#### Test 2: Source Preview Modal

**Desktop**:
- [ ] Modal max-width: 672px (2xl in Tailwind)
- [ ] Modal is centered horizontally and vertically
- [ ] Close button (X) is visible in top-right
- [ ] Passage text is readable with good line height
- [ ] Scrollable if content exceeds max-height (384px)

**Tablet**:
- [ ] Modal width: ~90% of screen width
- [ ] Modal height: Fits viewport (scrollable if needed)
- [ ] Close button accessible
- [ ] Buttons at bottom are visible without scrolling

**Mobile**:
- [ ] Modal width: ~95% of screen width
- [ ] Modal height: Fits viewport with minimal scrolling
- [ ] Passage text size is readable (≥ 14px)
- [ ] Buttons are stacked if needed for small screens

#### Test 3: Navigation and Scroll Behavior

**Desktop**:
- [ ] "Go to source" triggers navigation
- [ ] Page scrolls to target paragraph
- [ ] Scroll offset accounts for fixed header (~100px)
- [ ] Target paragraph is in center of viewport
- [ ] Highlight animation is smooth

**Tablet**:
- [ ] Navigation works correctly
- [ ] Scroll is smooth (not janky)
- [ ] Target paragraph is visible after scroll
- [ ] Highlight is visible and properly sized
- [ ] Animation completes in 2 seconds

**Mobile**:
- [ ] Navigation doesn't cause page reload
- [ ] Scroll is smooth on mobile
- [ ] Target paragraph is centered in small viewport
- [ ] Highlight doesn't overflow screen width
- [ ] Animation is smooth (60fps)

#### Test 4: Paragraph Highlighting

**Desktop**:
- [ ] Highlight color: Yellow/amber (rgba(251, 191, 36, 0.4))
- [ ] Highlight has rounded corners (border-radius: 0.25rem)
- [ ] Highlight has padding (0.5rem)
- [ ] Fade animation is smooth (2 seconds)
- [ ] After fade, paragraph returns to normal

**Tablet**:
- [ ] Highlight is visible on tablet screen
- [ ] Color is appropriate (not too bright)
- [ ] Animation doesn't lag or stutter
- [ ] Fade completes within 2 seconds

**Mobile**:
- [ ] Highlight is visible on small screen
- [ ] Highlight doesn't cause horizontal scroll
- [ ] Color is readable (sufficient contrast)
- [ ] Animation is smooth on mobile CPU
- [ ] No performance issues during fade

#### Test 5: Dark Mode (All Devices)

- [ ] Enable dark mode
- [ ] Citation badges have dark theme colors
- [ ] Tooltip has dark background
- [ ] Modal has dark background
- [ ] Passage text is readable in dark mode
- [ ] Highlight uses dark mode color (rgba(217, 119, 6, 0.3))
- [ ] Fade animation works in dark mode

### Device-Specific Issues to Check

**Desktop**:
- Mouse cursor changes to pointer on hover
- Keyboard navigation works (Tab, Enter, Escape)
- Tooltip doesn't flicker on mouse movement

**Tablet**:
- No accidental zooming when tapping badges
- Modal doesn't trigger pull-to-refresh
- Landscape orientation works correctly

**Mobile**:
- Portrait and landscape both work
- No issues with mobile browser UI (address bar)
- Doesn't trigger page reload on navigation
- Scroll position maintained after highlight

### Acceptance Criteria

✅ **PASS** if:
- All 3 devices pass all 5 test categories
- Citation interaction works on touch and mouse
- Modal is responsive and fits all viewport sizes
- Navigation works correctly on all devices
- Highlighting is smooth with no performance issues

❌ **FAIL** if:
- Any device fails multiple test categories
- Touch interaction broken on tablet/mobile
- Modal doesn't fit properly on mobile
- Scroll-to-source fails on any device
- Highlighting lags or stutters on mobile

---

## Quick Smoke Test (3 minutes)

Before full validation, run this quick test:

1. **Desktop**: Open chat, ask "What is ROS 2?", click citation, verify modal, click "Go to source", verify highlight
2. **Mobile**: Repeat same test on mobile viewport
3. **Dark mode**: Toggle dark mode, repeat citation test

✅ **Quick Test Passed** → Proceed with full validation
❌ **Quick Test Failed** → Debug issues before full validation

---

## Known Issues / Troubleshooting

### Issue: Highlight doesn't appear
**Solution**:
- Check if URL has hash fragment (e.g., #chunk_00042)
- Verify target paragraph exists with ID or data-chunk-id
- Check browser console for JavaScript errors
- Ensure CSS animation is loaded

### Issue: Modal doesn't open on mobile
**Solution**:
- Verify touch events are registered (not just mouse events)
- Check if modal backdrop is blocking clicks
- Test with Chrome DevTools mobile simulation
- Verify CSS pointer-events are not blocking

### Issue: Scroll offset is wrong
**Solution**:
- Adjust scroll-margin-top in CSS (currently 100px)
- Check if fixed header height changed
- Verify scroll-behavior: smooth is working

### Issue: Highlight fades too fast/slow
**Solution**:
- Check animation duration in globals.css (should be 2s)
- Verify animation-timing-function is ease-out
- Test on different devices (performance may vary)

---

## Validation Report Template

After completing T124-T125, document results in:
`specs/002-rag-textbook-chatbot/qa/phase-6-validation-report.md`

### Template

```markdown
# Phase 6: Citation Navigation Validation Report

**Date**: YYYY-MM-DD
**Tester**: [Name]
**Environment**: [Dev/Staging/Production]
**Backend Version**: [commit hash]
**Frontend Version**: [commit hash]

---

## T124: 20-Citation Navigation Test

**Citations Tested**: 20
**Test Steps per Citation**: 9

**Results**:
| Category | Passed | Failed | Pass Rate |
|----------|--------|--------|-----------|
| Citation Badge | __/20 | __/20 | __% |
| Hover Tooltip | __/20 | __/20 | __% |
| Source Preview | __/20 | __/20 | __% |
| "Go to Source" Nav | __/20 | __/20 | __% |
| Paragraph Highlight | __/20 | __/20 | __% |

**Overall Pass Rate**: __/20 (___%)

**Status**: ✅ PASS / ❌ FAIL

**Failed Citations**:
[List any failed citations with details]

**Notes**:
[Add observations, edge cases, or issues]

---

## T125: Desktop and Mobile Verification

**Devices Tested**: 3 (Desktop, Tablet, Mobile)

**Results**:

| Device | Badge Interaction | Modal Display | Navigation | Highlighting | Dark Mode | Result |
|--------|------------------|---------------|------------|--------------|-----------|--------|
| Desktop (1920x1080) | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ |
| Tablet (768x1024) | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ |
| Mobile (375x667) | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ |

**Status**: ✅ PASS / ❌ FAIL

**Device-Specific Issues**:
[List any device-specific problems]

**Notes**:
[Add observations about responsive behavior]

---

## Overall Phase 6 Status

**T124**: ✅ PASS / ❌ FAIL
**T125**: ✅ PASS / ❌ FAIL

**Overall**: ✅ PASS / ❌ FAIL

**Recommendations**:
[Any improvements or follow-up work needed]

---

**Approved By**: ___________
**Date**: ___________
```

---

**Last Updated**: 2026-02-03
**Version**: 1.0
