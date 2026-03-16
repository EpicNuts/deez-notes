import { test as base, Page } from "@playwright/test";

const VERCEL_AUTOMATION_BYPASS_SECRET =
  process.env.VERCEL_AUTOMATION_BYPASS_SECRET || "";

// Test user helpers for consistent auth across tools
export const getRandomTestUser = () => ({
  email: `test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`,
  password: "testpassword123"
});

// Auth helpers using the same API endpoints as Cypress
export const playwrightAuthHelpers = {
  async authenticateUser(page: Page) {
    const user = getRandomTestUser();
    
    // Use test API for fast authentication
    const response = await page.request.post('/api/auth/signup', {
      data: { email: user.email, password: user.password }
    });
    
    if (!response.ok() && !response.url().includes('already')) {
      throw new Error(`Auth failed: ${await response.text()}`);
    }
    
    // Navigate to app to activate session
    await page.goto('/notes');
    return user;
  },

  async loginExistingUser(page: Page, user: { email: string; password: string }) {
    const response = await page.request.post('/api/auth/login', {
      data: { email: user.email, password: user.password }
    });
    
    if (!response.ok()) {
      throw new Error(`Login failed: ${await response.text()}`);
    }
    
    await page.goto('/notes');
    return user;
  }
};

export const test = base.extend({});

test.beforeEach(async ({ page }) => {
  await page.route("/", async (route, request) => {
    const headers = {
      ...request.headers(),
      "x-vercel-protection-bypass": VERCEL_AUTOMATION_BYPASS_SECRET,
      "x-vercel-set-bypass-cookie": "true",
    };
    await route.continue({ headers });
  });
});
