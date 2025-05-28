import { test as base } from '@playwright/test';

const VERCEL_AUTOMATION_BYPASS_SECRET = process.env.VERCEL_AUTOMATION_BYPASS_SECRET || '';

export const test = base.extend({});

test.beforeEach(async ({ page }) => {
  await page.route('/', async (route, request) => {
    const headers = {
      ...request.headers(),
      'x-vercel-protection-bypass': VERCEL_AUTOMATION_BYPASS_SECRET,
      'x-vercel-set-bypass-cookie': 'true',
    };
    await route.continue({ headers });
  });
});