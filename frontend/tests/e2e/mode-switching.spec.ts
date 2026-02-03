/**
 * E2E tests for mode switching functionality
 * Tests mode boundary enforcement, switching prompts, and source labels
 */

import { test, expect } from "@playwright/test";

test.describe("Mode Switching - Basic Functionality", () => {
  test.beforeEach(async ({ page }) => {
    // Mock chat API to return mode-specific responses
    await page.route("**/api/v1/chat", async (route) => {
      const request = route.request();
      const postData = request.postDataJSON();

      const mode = postData.mode || "book-only";
      let response = "";
      let has_external_knowledge = false;

      // Generate mode-specific responses
      if (mode === "book-only") {
        response = `Based on the textbook, neural networks are computational models inspired by biological neurons. They consist of interconnected layers that process information.`;
      } else if (mode === "selected-text-only") {
        response = `This passage explains that ${postData.selected_text?.substring(0, 50)}... is a fundamental concept in robotics.`;
      } else if (mode === "general-knowledge") {
        response = `**[Textbook]**

From the textbook: Neural networks are computational models used in machine learning.

---

**[General Knowledge]**

In industry practice, neural networks power applications like image recognition, natural language processing, and autonomous vehicles.

---

*Note: This answer combines textbook content with general knowledge to provide additional context.*`;
        has_external_knowledge = true;
      }

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          conversation_id: "test-conv-id",
          message_id: "test-msg-id",
          response,
          citations: [],
          confidence_score: 0.85,
          mode,
          has_external_knowledge,
          timestamp: new Date().toISOString(),
          conversation_updated_at: new Date().toISOString(),
        }),
      });
    });

    // Navigate to chat page
    await page.goto("/");
  });

  test("should display all three mode options", async ({ page }) => {
    // Find mode selector buttons
    const bookOnlyButton = page.getByRole("button", { name: /book only/i });
    const selectedTextButton = page.getByRole("button", { name: /selected text/i });
    const generalButton = page.getByRole("button", { name: /general/i });

    await expect(bookOnlyButton).toBeVisible();
    await expect(selectedTextButton).toBeVisible();
    await expect(generalButton).toBeVisible();
  });

  test("should start in Book-Only mode by default", async ({ page }) => {
    const bookOnlyButton = page.getByRole("button", { name: /book only/i });

    // Check if Book-Only mode is active (has active styling)
    await expect(bookOnlyButton).toHaveClass(/border-blue-600|bg-blue-50/);
  });

  test("should show confirmation dialog when switching modes", async ({ page }) => {
    // Click on General mode
    const generalButton = page.getByRole("button", { name: /general/i });
    await generalButton.click();

    // Confirmation dialog should appear
    const confirmationDialog = page.locator('text="Switch Answering Mode?"');
    await expect(confirmationDialog).toBeVisible();

    // Should show current and target modes
    await expect(page.locator('text=/from.*Book Only/i')).toBeVisible();
    await expect(page.locator('text=/to.*General/i')).toBeVisible();
  });

  test("should cancel mode switch when Cancel is clicked", async ({ page }) => {
    // Click on General mode
    const generalButton = page.getByRole("button", { name: /general/i });
    await generalButton.click();

    // Click Cancel
    const cancelButton = page.getByRole("button", { name: /cancel/i });
    await cancelButton.click();

    // Dialog should close
    await expect(page.locator('text="Switch Answering Mode?"')).not.toBeVisible();

    // Should still be in Book-Only mode
    const bookOnlyButton = page.getByRole("button", { name: /book only/i });
    await expect(bookOnlyButton).toHaveClass(/border-blue-600|bg-blue-50/);
  });

  test("should switch mode when confirmed", async ({ page }) => {
    // Click on General mode
    const generalButton = page.getByRole("button", { name: /general/i });
    await generalButton.click();

    // Click Switch Mode
    const switchButton = page.getByRole("button", { name: /switch mode/i });
    await switchButton.click();

    // Dialog should close
    await expect(page.locator('text="Switch Answering Mode?"')).not.toBeVisible();

    // General mode should now be active
    await expect(generalButton).toHaveClass(/border-blue-600|bg-blue-50/);
  });

  test("should not show confirmation when clicking current mode", async ({ page }) => {
    // Click on Book-Only (already active)
    const bookOnlyButton = page.getByRole("button", { name: /book only/i });
    await bookOnlyButton.click();

    // No confirmation dialog should appear
    await expect(page.locator('text="Switch Answering Mode?"')).not.toBeVisible();
  });

  test("should show warning for General Knowledge mode", async ({ page }) => {
    // Click on General mode
    const generalButton = page.getByRole("button", { name: /general/i });
    await generalButton.click();

    // Warning should be displayed
    await expect(page.locator('text=/external knowledge/i')).toBeVisible();
    await expect(page.locator('text=/labeled to distinguish sources/i')).toBeVisible();
  });
});

test.describe("Mode-Specific Responses", () => {
  test.beforeEach(async ({ page }) => {
    // Same API mocking as above
    await page.route("**/api/v1/chat", async (route) => {
      const request = route.request();
      const postData = request.postDataJSON();

      const mode = postData.mode || "book-only";
      let response = "";
      let has_external_knowledge = false;

      if (mode === "book-only") {
        response = `Based on the textbook, neural networks are computational models.`;
      } else if (mode === "general-knowledge") {
        response = `**[Textbook]**

Textbook content about neural networks.

---

**[General Knowledge]**

Additional context from external sources.

---`;
        has_external_knowledge = true;
      }

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          conversation_id: "test-conv-id",
          message_id: "test-msg-id",
          response,
          citations: [],
          confidence_score: 0.85,
          mode,
          has_external_knowledge,
          timestamp: new Date().toISOString(),
          conversation_updated_at: new Date().toISOString(),
        }),
      });
    });

    await page.goto("/");
  });

  test("should display single section for Book-Only responses", async ({ page }) => {
    // Send a message in Book-Only mode
    const input = page.getByRole("textbox", { name: /ask a question/i });
    await input.fill("What are neural networks?");
    await input.press("Enter");

    // Wait for response
    await page.waitForSelector('text=/computational models/i');

    // Should not have source section labels
    await expect(page.locator('text=/\\[Textbook\\]/i')).not.toBeVisible();
    await expect(page.locator('text=/\\[General Knowledge\\]/i')).not.toBeVisible();
  });

  test("should display multi-section response for General Knowledge", async ({ page }) => {
    // Switch to General Knowledge mode
    const generalButton = page.getByRole("button", { name: /general/i });
    await generalButton.click();
    await page.getByRole("button", { name: /switch mode/i }).click();

    // Send a message
    const input = page.getByRole("textbox", { name: /ask a question/i });
    await input.fill("What are neural networks?");
    await input.press("Enter");

    // Wait for response
    await page.waitForTimeout(1000);

    // Should display both source labels
    await expect(page.locator('text=/Textbook/i').first()).toBeVisible();
    await expect(page.locator('text=/General Knowledge/i').first()).toBeVisible();
  });

  test("should display green border for textbook sections", async ({ page }) => {
    // Switch to General Knowledge mode
    const generalButton = page.getByRole("button", { name: /general/i });
    await generalButton.click();
    await page.getByRole("button", { name: /switch mode/i }).click();

    // Send a message
    const input = page.getByRole("textbox", { name: /ask a question/i });
    await input.fill("What are neural networks?");
    await input.press("Enter");

    // Wait for response
    await page.waitForTimeout(1000);

    // Find textbook section and check for green border
    const textbookSection = page.locator('text=/Textbook/i').locator('..');
    await expect(textbookSection).toHaveClass(/border-green-500/);
  });

  test("should display blue border for general knowledge sections", async ({ page }) => {
    // Switch to General Knowledge mode
    const generalButton = page.getByRole("button", { name: /general/i });
    await generalButton.click();
    await page.getByRole("button", { name: /switch mode/i }).click();

    // Send a message
    const input = page.getByRole("textbox", { name: /ask a question/i });
    await input.fill("What are neural networks?");
    await input.press("Enter");

    // Wait for response
    await page.waitForTimeout(1000);

    // Find general knowledge section and check for blue border
    const generalSection = page.locator('text=/General Knowledge/i').locator('..');
    await expect(generalSection).toHaveClass(/border-blue-500/);
  });
});

test.describe("Mode Boundary Enforcement", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/v1/chat", async (route) => {
      const request = route.request();
      const postData = request.postDataJSON();

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          conversation_id: "test-conv-id",
          message_id: "test-msg-id",
          response: "Test response",
          citations: [],
          confidence_score: 0.85,
          mode: postData.mode || "book-only",
          timestamp: new Date().toISOString(),
          conversation_updated_at: new Date().toISOString(),
        }),
      });
    });

    await page.goto("/");
  });

  test("should persist mode across multiple messages", async ({ page }) => {
    // Switch to General mode
    const generalButton = page.getByRole("button", { name: /general/i });
    await generalButton.click();
    await page.getByRole("button", { name: /switch mode/i }).click();

    // Send first message
    const input = page.getByRole("textbox", { name: /ask a question/i });
    await input.fill("First question");
    await input.press("Enter");

    await page.waitForTimeout(500);

    // Send second message
    await input.fill("Second question");
    await input.press("Enter");

    await page.waitForTimeout(500);

    // Mode should still be General
    await expect(generalButton).toHaveClass(/border-blue-600|bg-blue-50/);
  });

  test("should show mode in message metadata", async ({ page }) => {
    // Send message in Book-Only mode
    const input = page.getByRole("textbox", { name: /ask a question/i });
    await input.fill("Test question");
    await input.press("Enter");

    // Wait for response
    await page.waitForTimeout(500);

    // Check for mode badge in metadata
    await expect(page.locator('text=/book only/i').last()).toBeVisible();
  });
});

test.describe("Mode Switching Edge Cases", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/v1/chat", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          conversation_id: "test",
          message_id: "test",
          response: "Test response",
          citations: [],
          confidence_score: 0.8,
          mode: "book-only",
          timestamp: new Date().toISOString(),
          conversation_updated_at: new Date().toISOString(),
        }),
      });
    });

    await page.goto("/");
  });

  test("should close dialog when clicking outside", async ({ page }) => {
    // Click on General mode
    const generalButton = page.getByRole("button", { name: /general/i });
    await generalButton.click();

    // Click on dialog backdrop (outside the dialog content)
    await page.locator('.bg-black.bg-opacity-50').click({ position: { x: 10, y: 10 } });

    // Dialog should close
    await expect(page.locator('text="Switch Answering Mode?"')).not.toBeVisible();
  });

  test("should handle rapid mode switches", async ({ page }) => {
    // Rapidly click different modes
    const generalButton = page.getByRole("button", { name: /general/i });
    const selectedTextButton = page.getByRole("button", { name: /selected text/i });

    await generalButton.click();
    await page.getByRole("button", { name: /switch mode/i }).click();

    await page.waitForTimeout(100);

    await selectedTextButton.click();
    await page.getByRole("button", { name: /switch mode/i }).click();

    // Final mode should be Selected Text
    await expect(selectedTextButton).toHaveClass(/border-blue-600|bg-blue-50/);
  });
});
