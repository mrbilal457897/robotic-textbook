/**
 * E2E tests for basic question flow in Book-Only mode
 * Tests the complete user journey from opening chat to receiving answers
 */

import { test, expect } from "@playwright/test";

test.describe("Book-Only Mode - Basic Question Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Mock backend API responses
    await page.route("**/api/v1/chat", async (route) => {
      const request = route.request();
      const postData = request.postDataJSON();

      // Simulate successful chat response
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          conversation_id: "550e8400-e29b-41d4-a716-446655440000",
          message_id: "650e8400-e29b-41d4-a716-446655440000",
          response:
            "Inverse kinematics (IK) is the mathematical process of determining the joint angles needed to position a robot's end-effector at a desired location. Unlike forward kinematics which calculates the end-effector position from joint angles, IK solves the reverse problem.",
          citations: [
            {
              chunk_id: "chunk_abc123",
              text: "Inverse kinematics determines joint angles from desired end-effector position...",
              confidence: 0.92,
              source_type: "textbook",
              chapter: "3",
              section_title: "Motion Planning and Control",
              page_number: 45,
            },
            {
              chunk_id: "chunk_def456",
              text: "IK algorithms are essential for robot manipulation tasks...",
              confidence: 0.88,
              source_type: "textbook",
              chapter: "3",
              section_title: "Motion Planning and Control",
              page_number: 46,
            },
          ],
          confidence_score: 0.89,
          tokens_used: 350,
          mode: postData.mode || "book-only",
          tone: postData.tone || "academic",
          has_external_knowledge: false,
          timestamp: new Date().toISOString(),
          conversation_updated_at: new Date().toISOString(),
          metadata: {
            latency_ms: 2450,
            model: "gemini-2.0-flash-exp",
            embedding_model: "embed-english-v3.0",
            retrieval_count: 2,
          },
        }),
      });
    });

    // Navigate to a textbook chapter
    await page.goto("/textbook/physical-ai-robotics/chapter-3");
  });

  test("should successfully ask a question and receive a citation-backed answer", async ({
    page,
  }) => {
    // Step 1: Open the chat panel
    const chatButton = page.getByLabel("Open chat");
    await expect(chatButton).toBeVisible();
    await chatButton.click();

    // Verify chat panel is open
    await expect(page.getByText("Textbook Assistant")).toBeVisible();

    // Step 2: Verify book-only mode is selected (default)
    // Open settings to check mode
    await page.getByLabel("Settings").click();

    // Verify we can see the mode selector
    await expect(page.getByText(/mode/i)).toBeVisible();

    // Close settings
    await page.getByLabel("Settings").click();

    // Step 3: Type a question about inverse kinematics
    const messageInput = page.getByPlaceholder(/ask a question about the textbook/i);
    await expect(messageInput).toBeVisible();
    await messageInput.fill("What is inverse kinematics?");

    // Step 4: Submit the question
    await messageInput.press("Enter");

    // Step 5: Verify loading state appears
    await expect(messageInput).toBeDisabled();

    // Step 6: Wait for and verify the response appears
    await expect(
      page.getByText(/Inverse kinematics \(IK\) is the mathematical process/)
    ).toBeVisible({ timeout: 10000 });

    // Step 7: Verify citations are present
    const citations = page.getByRole("button", { name: /citation/i });
    await expect(citations.first()).toBeVisible();

    // Step 8: Verify the response is in the assistant message
    const assistantMessage = page.getByTestId("message-assistant");
    await expect(assistantMessage).toBeVisible();

    // Step 9: Verify user message is also displayed
    await expect(page.getByText("What is inverse kinematics?")).toBeVisible();
  });

  test("should display citations with correct metadata", async ({ page }) => {
    // Open chat and ask question
    await page.getByLabel("Open chat").click();
    await page.getByPlaceholder(/ask a question/i).fill("What is inverse kinematics?");
    await page.getByPlaceholder(/ask a question/i).press("Enter");

    // Wait for response
    await expect(
      page.getByText(/Inverse kinematics \(IK\) is the mathematical process/)
    ).toBeVisible({ timeout: 10000 });

    // Click on a citation badge
    const citationBadge = page.getByRole("button", { name: /citation/i }).first();
    await citationBadge.click();

    // Verify source preview modal opens
    await expect(page.getByText(/Motion Planning and Control/i)).toBeVisible();
    await expect(page.getByText(/Chapter 3/i)).toBeVisible();
    await expect(page.getByText(/Page 45/i)).toBeVisible();

    // Verify confidence score is displayed
    await expect(page.getByText(/confidence/i)).toBeVisible();
  });

  test("should allow user to navigate to source from citation", async ({ page }) => {
    // Open chat and ask question
    await page.getByLabel("Open chat").click();
    await page.getByPlaceholder(/ask a question/i).fill("What is inverse kinematics?");
    await page.getByPlaceholder(/ask a question/i).press("Enter");

    // Wait for response
    await expect(
      page.getByText(/Inverse kinematics \(IK\) is the mathematical process/)
    ).toBeVisible({ timeout: 10000 });

    // Click citation to open source preview
    await page.getByRole("button", { name: /citation/i }).first().click();

    // Click "Go to source" button
    const goToSourceButton = page.getByRole("button", { name: /go to source/i });
    await expect(goToSourceButton).toBeVisible();

    // Clicking should navigate to the chapter
    await goToSourceButton.click();

    // Verify navigation (URL should contain chapter-3)
    await expect(page).toHaveURL(/chapter-3/);
  });

  test("should maintain conversation context across multiple messages", async ({ page }) => {
    // Open chat
    await page.getByLabel("Open chat").click();

    // Ask first question
    await page.getByPlaceholder(/ask a question/i).fill("What is inverse kinematics?");
    await page.getByPlaceholder(/ask a question/i).press("Enter");

    // Wait for first response
    await expect(
      page.getByText(/Inverse kinematics \(IK\) is the mathematical process/)
    ).toBeVisible({ timeout: 10000 });

    // Ask follow-up question
    await page.getByPlaceholder(/ask a question/i).fill("How is it used in robotics?");
    await page.getByPlaceholder(/ask a question/i).press("Enter");

    // Wait for second response
    await expect(page.getByPlaceholder(/ask a question/i)).toBeDisabled();

    // Verify both messages are in history
    await expect(page.getByText("What is inverse kinematics?")).toBeVisible();
    await expect(page.getByText("How is it used in robotics?")).toBeVisible();
  });

  test("should show error message when API fails", async ({ page }) => {
    // Override the route to simulate API failure
    await page.route("**/api/v1/chat", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          detail: "Internal server error",
        }),
      });
    });

    // Open chat
    await page.getByLabel("Open chat").click();

    // Ask question
    await page.getByPlaceholder(/ask a question/i).fill("What is inverse kinematics?");
    await page.getByPlaceholder(/ask a question/i).press("Enter");

    // Verify error message is displayed
    await expect(page.getByText(/error/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/failed/i)).toBeVisible();

    // Verify error can be dismissed
    const dismissButton = page.getByLabel(/close|dismiss/i).first();
    await dismissButton.click();

    // Error should be gone
    await expect(page.getByText(/failed/i)).not.toBeVisible();
  });

  test("should handle optimistic locking conflict (409)", async ({ page }) => {
    // First request succeeds
    let requestCount = 0;
    await page.route("**/api/v1/chat", async (route) => {
      requestCount++;

      if (requestCount === 1) {
        // First request succeeds
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            conversation_id: "550e8400-e29b-41d4-a716-446655440000",
            message_id: "650e8400-e29b-41d4-a716-446655440000",
            response: "First response",
            citations: [],
            confidence_score: 0.9,
            tokens_used: 100,
            mode: "book-only",
            tone: "academic",
            has_external_knowledge: false,
            timestamp: new Date().toISOString(),
            conversation_updated_at: new Date().toISOString(),
            metadata: {},
          }),
        });
      } else {
        // Second request gets 409 conflict
        await route.fulfill({
          status: 409,
          contentType: "application/json",
          body: JSON.stringify({
            error: "CONVERSATION_UPDATED",
            message: "Conversation was updated in another tab/device. Refresh to see latest messages.",
            latest_updated_at: new Date().toISOString(),
          }),
        });
      }
    });

    // Open chat and send first message
    await page.getByLabel("Open chat").click();
    await page.getByPlaceholder(/ask a question/i).fill("First question");
    await page.getByPlaceholder(/ask a question/i).press("Enter");

    // Wait for first response
    await expect(page.getByText("First response")).toBeVisible({ timeout: 10000 });

    // Send second message (should trigger 409)
    await page.getByPlaceholder(/ask a question/i).fill("Second question");
    await page.getByPlaceholder(/ask a question/i).press("Enter");

    // Verify optimistic lock error is shown
    await expect(
      page.getByText(/updated in another tab|conflict/i)
    ).toBeVisible({ timeout: 10000 });
  });

  test("should disable input and show loading state during request", async ({ page }) => {
    // Slow down the API response
    await page.route("**/api/v1/chat", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 second delay
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          conversation_id: "550e8400-e29b-41d4-a716-446655440000",
          message_id: "650e8400-e29b-41d4-a716-446655440000",
          response: "Response after delay",
          citations: [],
          confidence_score: 0.9,
          tokens_used: 100,
          mode: "book-only",
          tone: "academic",
          has_external_knowledge: false,
          timestamp: new Date().toISOString(),
          conversation_updated_at: new Date().toISOString(),
          metadata: {},
        }),
      });
    });

    // Open chat and send message
    await page.getByLabel("Open chat").click();
    const input = page.getByPlaceholder(/ask a question/i);
    await input.fill("Test question");
    await input.press("Enter");

    // Verify input is disabled during loading
    await expect(input).toBeDisabled();

    // Wait for response
    await expect(page.getByText("Response after delay")).toBeVisible({ timeout: 10000 });

    // Verify input is re-enabled after response
    await expect(input).toBeEnabled();
  });

  test("should persist conversation when panel is closed and reopened", async ({ page }) => {
    // Open chat and send message
    await page.getByLabel("Open chat").click();
    await page.getByPlaceholder(/ask a question/i).fill("What is inverse kinematics?");
    await page.getByPlaceholder(/ask a question/i).press("Enter");

    // Wait for response
    await expect(
      page.getByText(/Inverse kinematics \(IK\) is the mathematical process/)
    ).toBeVisible({ timeout: 10000 });

    // Close chat panel
    await page.getByLabel("Close chat").click();

    // Verify panel is closed
    await expect(page.getByText("Textbook Assistant")).not.toBeVisible();

    // Reopen chat panel
    await page.getByLabel("Open chat").click();

    // Verify messages are still there
    await expect(page.getByText("What is inverse kinematics?")).toBeVisible();
    await expect(
      page.getByText(/Inverse kinematics \(IK\) is the mathematical process/)
    ).toBeVisible();
  });
});

test.describe("Book-Only Mode - Mobile Viewport", () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE size

  test("should work correctly on mobile viewport", async ({ page }) => {
    // Mock API
    await page.route("**/api/v1/chat", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          conversation_id: "550e8400-e29b-41d4-a716-446655440000",
          message_id: "650e8400-e29b-41d4-a716-446655440000",
          response: "Mobile response",
          citations: [],
          confidence_score: 0.9,
          tokens_used: 100,
          mode: "book-only",
          tone: "academic",
          has_external_knowledge: false,
          timestamp: new Date().toISOString(),
          conversation_updated_at: new Date().toISOString(),
          metadata: {},
        }),
      });
    });

    await page.goto("/textbook/physical-ai-robotics/chapter-3");

    // Open chat
    await page.getByLabel("Open chat").click();

    // Verify chat panel takes full screen on mobile
    const chatPanel = page.getByText("Textbook Assistant").locator("..");
    await expect(chatPanel).toBeVisible();

    // Send message
    await page.getByPlaceholder(/ask a question/i).fill("Mobile test");
    await page.getByPlaceholder(/ask a question/i).press("Enter");

    // Verify response
    await expect(page.getByText("Mobile response")).toBeVisible({ timeout: 10000 });
  });
});
