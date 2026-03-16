/**
 * Sidebar Update Component Tests
 *
 * Tests the isolated component behavior of sidebar updates.
 * Focuses on UI state changes, not full user workflows.
 */

import { test } from "../test.extend";
import { expect } from "@playwright/test";

test.describe("Sidebar Update Components", () => {
  test.describe.skip("NotesListProvider Context Integration", () => {
    test.beforeEach(async ({ page }) => {
      // Start with authenticated state for component testing
      await page.goto("/");
      await page.locator('[href="/sign-up"]').click();
      await page.locator("#email").fill("test@example.com");
      await page.locator("#password").fill("password123");
      await page.locator('[data-testid="sign-up-button"]').click();
      
      // Wait for authentication to complete
      await expect(page.locator('[data-testid="new-note-button"]')).toBeVisible();
      
      // Open sidebar to see components
      await page.locator('[data-testid="sidebar-trigger"]').click();
    });

    test("new note button should add note to sidebar immediately", async ({ page }) => {
      // Count initial notes in sidebar
      const initialNotes = await page.locator('[data-testid*="select-note-button "]').count();
      
      // Create new note
      await page.locator('[data-testid="new-note-button"]').click();
      
      // Sidebar should immediately reflect the change (no network wait)
      await expect(page.locator('[data-testid*="select-note-button "]')).toHaveCount(initialNotes + 1);
      
      // Should navigate to new note
      await expect(page).toHaveURL(/noteId=/);
    });

    test("delete note button should remove note from sidebar immediately", async ({ page }) => {
      // Create a note first
      await page.locator('[data-testid="new-note-button"]').click();
      await expect(page.locator('[data-testid*="select-note-button "]')).toHaveCount(1);
      
      // Delete the note
      await page.locator('[data-testid*="delete-note-button "]').first().click();
      await page.locator('[data-testid="confirm-delete-button"]').click();
      
      // Sidebar should immediately update
      await expect(page.locator('[data-testid*="select-note-button "]')).toHaveCount(0);
    });

    test("text input should update sidebar note preview", async ({ page }) => {
      // Create a new note
      await page.locator('[data-testid="new-note-button"]').click();
      
      // Type text in the note
      const testText = "Component test note content";
      await page.locator('[data-testid="note-text-input"]').fill(testText);
      
      // Sidebar should show updated text preview (after debounce)
      // Wait for debounce to complete
      await page.waitForTimeout(1000);
      
      // Check sidebar contains the text
      await expect(page.locator('[data-testid="sidebar-group-content"]')).toContainText(testText.substring(0, 20));
    });
  });

  test.describe("SidebarGroupContent Component States", () => {
    test("should show empty state when no notes exist", async ({ page }) => {
      await page.goto("/");
      
      // Open sidebar
      await page.locator('[data-testid="sidebar-trigger"]').click();
      
      // Should show unauthenticated state
      await expect(page.locator('[data-testid="sidebar-unauthenticated-text"]')).toBeVisible();
    });

    test.skip("should show search functionality with notes", async ({ page }) => {
      // Authenticate and create notes
      await page.goto("/");
      await page.locator('[href="/sign-up"]').click();
      await page.locator("#email").fill("search-test@example.com");
      await page.locator("#password").fill("password123");
      await page.locator('[data-testid="sign-up-button"]').click();
      
      // Create notes with different content
      await page.locator('[data-testid="new-note-button"]').click();
      await page.locator('[data-testid="note-text-input"]').fill("First note about JavaScript");
      
      await page.locator('[data-testid="new-note-button"]').click();
      await page.locator('[data-testid="note-text-input"]').fill("Second note about Python");
      
      // Open sidebar
      await page.locator('[data-testid="sidebar-trigger"]').click();
      
      // Should show both notes initially
      await expect(page.locator('[data-testid*="select-note-button "]')).toHaveCount(2);
      
      // Search functionality should filter notes
      await page.locator('[data-testid="search-icon"]').click();
      await page.locator('input[placeholder*="Search"]').fill("JavaScript");
      
      // Should filter to only matching notes
      await expect(page.locator('[data-testid*="select-note-button "]')).toHaveCount(1);
      await expect(page.locator('[data-testid="sidebar-group-content"]')).toContainText("JavaScript");
    });
  });

  test.describe.skip("Component Error Handling", () => {
    test("should handle rapid note creation without UI glitches", async ({ page }) => {
      await page.goto("/");
      await page.locator('[href="/sign-up"]').click();
      await page.locator("#email").fill("rapid-test@example.com");
      await page.locator("#password").fill("password123");
      await page.locator('[data-testid="sign-up-button"]').click();
      
      await page.locator('[data-testid="sidebar-trigger"]').click();
      
      // Rapidly create multiple notes
      for (let i = 0; i < 3; i++) {
        await page.locator('[data-testid="new-note-button"]').click();
        // Small delay to allow navigation
        await page.waitForTimeout(100);
      }
      
      // Should have all notes in sidebar
      await expect(page.locator('[data-testid*="select-note-button "]')).toHaveCount(3);
      
      // All notes should be functional
      const noteButtons = page.locator('[data-testid*="select-note-button "]');
      
      // Click each note to verify navigation works
      for (let i = 0; i < 3; i++) {
        await noteButtons.nth(i).click();
        await expect(page).toHaveURL(/noteId=/);
        await expect(page.locator('[data-testid="note-text-input"]')).toBeVisible();
      }
    });
  });
});