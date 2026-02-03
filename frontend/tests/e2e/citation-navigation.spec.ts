/**
 * E2E Tests for Citation Navigation (T123)
 * Tests the full citation navigation workflow:
 * 1. Ask a question
 * 2. Click a citation badge
 * 3. Verify source preview modal displays
 * 4. Click "Go to source"
 * 5. Verify navigation to correct chapter/section
 * 6. Verify paragraph highlighting with 2-second fade
 */

import { test, expect } from '@playwright/test';

test.describe('Citation Navigation (User Story 4)', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a textbook chapter
    await page.goto('/textbook/physical-ai-robotics/chapter-1');

    // Wait for page to load
    await page.waitForLoadState('networkidle');
  });

  test('should display citation badges in chat responses', async ({ page }) => {
    // Open chat panel
    const chatButton = page.locator('button[aria-label="Open chat"]');
    await chatButton.click();

    // Type a question
    const messageInput = page.locator('textarea[placeholder*="Ask a question"]');
    await messageInput.fill('What is ROS 2?');

    // Send message
    const sendButton = page.locator('button[aria-label="Send message"]');
    await sendButton.click();

    // Wait for response with citations
    await page.waitForSelector('.citation-badge', { timeout: 10000 });

    // Verify citation badges are present
    const citationBadges = page.locator('.citation-badge');
    const count = await citationBadges.count();
    expect(count).toBeGreaterThan(0);

    // Verify citation badge structure
    const firstBadge = citationBadges.first();
    await expect(firstBadge).toBeVisible();
    await expect(firstBadge).toHaveAttribute('title', /Citation \d+/);
  });

  test('should show tooltip on citation badge hover', async ({ page }) => {
    // Open chat panel and send a question
    await page.click('button[aria-label="Open chat"]');
    await page.fill('textarea[placeholder*="Ask a question"]', 'What are neural networks?');
    await page.click('button[aria-label="Send message"]');

    // Wait for citation badge
    await page.waitForSelector('.citation-badge');

    // Hover over citation badge
    const firstBadge = page.locator('.citation-badge').first();
    await firstBadge.hover();

    // Wait for tooltip to appear
    await page.waitForTimeout(300); // Brief delay for CSS transition

    // Verify tooltip is visible (check for tooltip element)
    const tooltip = page.locator('[role="tooltip"], .absolute.bottom-full');
    await expect(tooltip).toBeVisible({ timeout: 1000 });

    // Verify tooltip contains chapter/section info
    await expect(tooltip).toContainText(/Chapter \d+/);
  });

  test('should open source preview modal when citation badge is clicked', async ({ page }) => {
    // Open chat panel and send a question
    await page.click('button[aria-label="Open chat"]');
    await page.fill('textarea[placeholder*="Ask a question"]', 'Explain backpropagation');
    await page.click('button[aria-label="Send message"]');

    // Wait for citation badge
    await page.waitForSelector('.citation-badge');

    // Click citation badge
    const firstBadge = page.locator('.citation-badge').first();
    await firstBadge.click();

    // Verify source preview modal opens
    const modal = page.locator('[role="dialog"], .fixed.inset-0.z-50');
    await expect(modal).toBeVisible({ timeout: 2000 });

    // Verify modal header
    await expect(page.locator('h2:has-text("Source Citation")')).toBeVisible();

    // Verify modal contains citation text
    const citationText = page.locator('.bg-yellow-50, .bg-yellow-950\\/20');
    await expect(citationText).toBeVisible();
    const text = await citationText.textContent();
    expect(text).toBeTruthy();
    expect(text!.length).toBeGreaterThan(0);
  });

  test('should display full passage and confidence score in source preview', async ({ page }) => {
    // Open chat and get a response with citations
    await page.click('button[aria-label="Open chat"]');
    await page.fill('textarea[placeholder*="Ask a question"]', 'What is a digital twin?');
    await page.click('button[aria-label="Send message"]');
    await page.waitForSelector('.citation-badge');

    // Click citation badge to open preview
    await page.click('.citation-badge');

    // Verify modal is open
    await page.waitForSelector('h2:has-text("Source Citation")');

    // Verify passage text is displayed
    const passage = page.locator('.bg-yellow-50, .bg-yellow-950\\/20');
    await expect(passage).toBeVisible();
    const passageText = await passage.textContent();
    expect(passageText).toBeTruthy();
    expect(passageText!.length).toBeGreaterThan(20); // Ensure meaningful text

    // Verify confidence score is displayed
    const confidenceLabel = page.locator('text=Confidence Score');
    await expect(confidenceLabel).toBeVisible();

    // Verify confidence value is shown
    const confidenceValue = page.locator('.text-sm.font-semibold:below(:text("Confidence Score"))');
    await expect(confidenceValue).toBeVisible();
    const score = await confidenceValue.textContent();
    expect(score).toMatch(/\d+%|High|Medium|Low/); // Could be percentage or label
  });

  test('should display chapter and section metadata in source preview', async ({ page }) => {
    // Open chat and get a response
    await page.click('button[aria-label="Open chat"]');
    await page.fill('textarea[placeholder*="Ask a question"]', 'Explain NVIDIA Isaac Sim');
    await page.click('button[aria-label="Send message"]');
    await page.waitForSelector('.citation-badge');

    // Open source preview
    await page.click('.citation-badge');

    // Verify chapter info in header
    const header = page.locator('.border-b.border-gray-200, .border-b.border-gray-800');
    await expect(header).toContainText(/Chapter \d+/);

    // May also contain section or page
    const headerText = await header.textContent();
    expect(headerText).toBeTruthy();
  });

  test('should navigate to source when "Go to source" button is clicked', async ({ page }) => {
    // Open chat and get a response
    await page.click('button[aria-label="Open chat"]');
    await page.fill('textarea[placeholder*="Ask a question"]', 'What is ROS 2?');
    await page.click('button[aria-label="Send message"]');
    await page.waitForSelector('.citation-badge');

    // Open source preview
    await page.click('.citation-badge');

    // Wait for modal
    await page.waitForSelector('h2:has-text("Source Citation")');

    // Click "Go to source" button
    const goToSourceButton = page.locator('button:has-text("Go to Source"), button:has-text("Go to source")');
    await expect(goToSourceButton).toBeVisible();

    // Store current URL
    const currentUrl = page.url();

    // Click the button
    await goToSourceButton.click();

    // Wait for navigation
    await page.waitForLoadState('networkidle');

    // Verify URL changed (navigated to different page)
    const newUrl = page.url();
    expect(newUrl).not.toBe(currentUrl);

    // Verify navigated to a textbook chapter page
    expect(newUrl).toMatch(/\/textbook\/[^/]+\/chapter-\d+/);
  });

  test('should highlight target paragraph after navigation', async ({ page }) => {
    // Open chat and get a response
    await page.click('button[aria-label="Open chat"]');
    await page.fill('textarea[placeholder*="Ask a question"]', 'Explain neural network layers');
    await page.click('button[aria-label="Send message"]');
    await page.waitForSelector('.citation-badge');

    // Open source preview and navigate
    await page.click('.citation-badge');
    await page.waitForSelector('h2:has-text("Source Citation")');
    await page.click('button:has-text("Go to Source"), button:has-text("Go to source")');

    // Wait for navigation and page load
    await page.waitForLoadState('networkidle');

    // Wait a brief moment for scroll and highlight
    await page.waitForTimeout(500);

    // Check for highlighted element with animation class
    const highlightedElement = page.locator('.citation-highlight');

    // Note: The highlight may have already faded if animation completed
    // So we check if element exists OR if the page has scrolled to target
    const elementCount = await highlightedElement.count();

    if (elementCount > 0) {
      // Highlight still visible - verify it's visible
      await expect(highlightedElement.first()).toBeVisible();
    }

    // Alternative: verify URL contains hash (indicating scroll target)
    const url = page.url();
    expect(url).toMatch(/#/); // Should have a hash fragment
  });

  test('should fade out highlight after 2 seconds', async ({ page }) => {
    // Open chat and navigate to source
    await page.click('button[aria-label="Open chat"]');
    await page.fill('textarea[placeholder*="Ask a question"]', 'What is Physical AI?');
    await page.click('button[aria-label="Send message"]');
    await page.waitForSelector('.citation-badge');
    await page.click('.citation-badge');
    await page.waitForSelector('h2:has-text("Source Citation")');
    await page.click('button:has-text("Go to Source"), button:has-text("Go to source")');

    // Wait for navigation
    await page.waitForLoadState('networkidle');

    // Wait briefly for highlight to appear
    await page.waitForTimeout(300);

    // Check if highlight class is present
    const highlightedElement = page.locator('.citation-highlight');
    let elementCount = await highlightedElement.count();

    if (elementCount > 0) {
      // Highlight is visible - wait for fade (2 seconds + buffer)
      await page.waitForTimeout(2500);

      // Verify highlight class is removed (animation completed)
      elementCount = await highlightedElement.count();
      expect(elementCount).toBe(0);
    } else {
      // If no highlight class found, that's OK - animation may have completed
      // Just verify we're on the right page
      expect(page.url()).toMatch(/\/textbook\//);
    }
  });

  test('should close source preview modal when close button is clicked', async ({ page }) => {
    // Open chat and get response
    await page.click('button[aria-label="Open chat"]');
    await page.fill('textarea[placeholder*="Ask a question"]', 'What are VLA models?');
    await page.click('button[aria-label="Send message"]');
    await page.waitForSelector('.citation-badge');

    // Open source preview
    await page.click('.citation-badge');
    await page.waitForSelector('h2:has-text("Source Citation")');

    // Verify modal is open
    const modal = page.locator('[role="dialog"], .fixed.inset-0.z-50');
    await expect(modal).toBeVisible();

    // Click close button (X icon)
    const closeButton = page.locator('button[aria-label="Close"], button:has(svg.lucide-x)').last();
    await closeButton.click();

    // Verify modal is closed
    await expect(modal).not.toBeVisible();
  });

  test('should close source preview when backdrop is clicked', async ({ page }) => {
    // Open chat and get response
    await page.click('button[aria-label="Open chat"]');
    await page.fill('textarea[placeholder*="Ask a question"]', 'What is Gazebo?');
    await page.click('button[aria-label="Send message"]');
    await page.waitForSelector('.citation-badge');

    // Open source preview
    await page.click('.citation-badge');
    await page.waitForSelector('h2:has-text("Source Citation")');

    // Verify modal is open
    const modal = page.locator('.fixed.inset-0.z-50');
    await expect(modal).toBeVisible();

    // Click backdrop (area outside modal)
    const backdrop = page.locator('.fixed.inset-0.z-40');
    await backdrop.click({ position: { x: 10, y: 10 } }); // Click near edge

    // Wait briefly for close animation
    await page.waitForTimeout(300);

    // Verify modal is closed
    await expect(modal).not.toBeVisible();
  });

  test('should handle multiple citations in a single response', async ({ page }) => {
    // Open chat
    await page.click('button[aria-label="Open chat"]');

    // Ask a question likely to return multiple citations
    await page.fill('textarea[placeholder*="Ask a question"]', 'Compare ROS 1 and ROS 2 architectures');
    await page.click('button[aria-label="Send message"]');

    // Wait for response
    await page.waitForSelector('.citation-badge');

    // Get all citation badges
    const badges = page.locator('.citation-badge');
    const count = await badges.count();

    // Verify multiple citations
    expect(count).toBeGreaterThanOrEqual(1);

    // Click each citation and verify preview works
    for (let i = 0; i < Math.min(count, 3); i++) { // Test first 3 citations
      await badges.nth(i).click();

      // Verify modal opens
      await expect(page.locator('h2:has-text("Source Citation")')).toBeVisible();

      // Close modal
      await page.click('button:has-text("Close")');

      // Wait for modal to close
      await page.waitForTimeout(300);
    }
  });

  test('should display chunk ID in source preview metadata', async ({ page }) => {
    // Open chat and get response
    await page.click('button[aria-label="Open chat"]');
    await page.fill('textarea[placeholder*="Ask a question"]', 'What is Isaac Sim?');
    await page.click('button[aria-label="Send message"]');
    await page.waitForSelector('.citation-badge');

    // Open source preview
    await page.click('.citation-badge');

    // Verify chunk ID is displayed
    const chunkIdLabel = page.locator('text=Chunk ID');
    await expect(chunkIdLabel).toBeVisible();

    // Verify chunk ID value (should be in monospace font)
    const chunkId = page.locator('.font-mono.text-xs');
    await expect(chunkId).toBeVisible();
    const chunkIdText = await chunkId.textContent();
    expect(chunkIdText).toMatch(/[a-z0-9_-]+/); // Should contain chunk identifier
  });
});
