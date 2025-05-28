import { test } from '../test.extend';
import { expect } from '@playwright/test';

test.describe('validate Deez Notes app', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('validate initial landing page state', () => {
    test('validate header', async ({ page }) => {      
      // Validate all expected Header elements, including the sidebar trigger
      await expect(page.locator('[data-testid="sidebar-trigger"]')).toBeVisible();

      // ... the deez-notes logo, the linked page name,
      await expect(page.locator('[data-testid="logo"]')).toBeVisible();
      await expect(page.locator('[data-testid="logo-text"]')).toContainText('DEEZ Notes');
      await expect(page.locator('[data-testid="logo-link"]')).toHaveAttribute('href', '/');
      
      // ... the sign up, login, and FAQ button links
      await expect(page.locator('[href="/sign-up"]')).toContainText('Sign Up');
      await expect(page.getByTestId('login-button')).toContainText('Login');
      await expect(page.locator('[href="/faq"]')).toContainText('FAQ');
    });

    test('validate main content', async ({ page }) => {
      // Validate all unauthorised main content elements exist
      await expect(page.locator('[data-testid="ask-ai-button"]')).toBeVisible();
      await expect(page.getByTestId("new-note-button")).toBeVisible();
      await expect(page.locator('[data-testid="note-text-input"]')).toBeVisible();
      
      // Validate the note text input is empty
      await expect(page.locator('[data-testid="note-text-input"]')).toHaveValue('');
      await expect(page.locator('[data-testid="note-text-input"]')).toHaveAttribute('placeholder', 'Type your notes here...');
    });

    test('validate sidebar', async ({ page }) => {
      // Sidebar should be initially closed
      await expect(page.locator('[data-testid="sidebar-group-content"]')).toHaveCount(0);

      // Click the sidebar trigger
      await page.locator('[data-testid="sidebar-trigger"]').click();

      // Sidebar should now be visible
      await expect(page.locator('[data-testid="sidebar-unauthenticated-text"]')).toBeVisible();
    });
  });

  test.describe('sign up', () => {
    test.beforeEach(async ({ page }) => {
      await page.locator('[href="/sign-up"]').click();
      await expect(page).toHaveURL(/\/sign-up/);
    });

    test('sign up form validation', async ({ page }) => {
      await expect(page.locator('[data-testid="sign-up-form"]')).toBeVisible();
      
      await expect(page.locator('#email')).toBeVisible();
      await page.locator('#email').fill('lol');
      
      await expect(page.locator('#password')).toBeVisible();
      await page.locator('#password').fill('lol');
      
      await expect(page.locator('[data-testid="auth-form"]')).toBeVisible();
      // await expect(page.locator('[data-testid="login-button"]')).toHaveCount(0);
      await expect(page.locator('[data-testid="sign-up-button"]')).toBeVisible();
      await page.locator('[data-testid="sign-up-button"]').click();
    });
  });

  test.describe.skip('login', () => {
    test.beforeEach(async ({ page }) => {
      await page.locator('[data-testid="header"] [href="/login"]').click();
      await expect(page).toHaveURL(/\/login/);
    });

    test('login form validation', async ({ page }) => {
      // await page.locator('[data-testid="login-form"]')).toBeVisible();
      
      await expect(page.locator('#email')).toBeVisible();
      // await page.locator('#email').fill('lol');
      
      await expect(page.locator('#password')).toBeVisible();
      // await page.locator('#password').fill('lol');
      
      await expect(page.locator('[data-testid="auth-form"]')).toBeVisible();
      await expect(page.locator('[data-testid="sign-up-button"]')).toHaveCount(0);
      await expect(page.locator('[data-testid="login-button"]')).toBeVisible();
      await page.locator('[data-testid="login-button"]').click();
    });
  });

  test.describe.skip('faq', () => {
    test.beforeEach(async ({ page }) => {
      await page.locator('[href="/faq"]').click();
      await expect(page).toHaveURL(/\/faq/);
    });

    test('passes', async ({ page }) => {
      await expect(page.locator('[data-testid="faq-form"]')).toBeVisible();
      await page.locator('[data-testid="faq-email"]').fill('');
    });
  });
});