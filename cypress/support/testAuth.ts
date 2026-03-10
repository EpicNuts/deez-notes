/**
 * Test User Data Management
 *
 * Handles test user credentials and authentication state management.
 * Does NOT contain UI interactions - use page objects for those.
 */

export interface TestUser {
  email: string;
  password: string;
}

/**
 * Get test user credentials from environment
 */
export function getTestUser(): TestUser {
  const email = Cypress.env("TEST_USER_EMAIL");
  const password = Cypress.env("TEST_USER_PASSWORD");

  if (!email || !password) {
    throw new Error(
      "Test user credentials not found. Set CYPRESS_TEST_USER_EMAIL and CYPRESS_TEST_USER_PASSWORD",
    );
  }

  return { email, password };
}

/**
 * Create a random user email for tests that require unique users, 
 * using the base email from environment, with a to-the-second timestamp inserted 
 * before the '@' symbol.
 */
export function createRandomUserEmail(): string {
  const baseEmail = getTestUser().email;
  
  const [localPart, domain] = baseEmail.split("@");
  const timestamp = Date.now();
  return `${localPart}+${timestamp}@${domain}`;
}

/**
 * Generate a random test user with a unique email for each test run, using the base email from environment.
 * The password is the same for all test users, as defined in environment.
 */
export function getRandomTestUser(): TestUser {
  return {
    email: createRandomUserEmail(),
    password: getTestUser().password, // Use the same password for all test users
  };
}

/**
 * Clear authentication state between tests
 */
export function clearAuthState(): void {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.clearAllSessionStorage();
}
