/**
 * Simple Test User Management
 * 
 * Provides clean utilities for real authentication testing.
 * No mocking - tests actual auth flow with real Supabase integration.
 */

export interface TestUser {
  email: string;
  password: string;
}

/**
 * Get test user credentials from environment
 */
export function getTestUser(): TestUser {
  const email = Cypress.env('TEST_USER_EMAIL');
  const password = Cypress.env('TEST_USER_PASSWORD');
  
  if (!email || !password) {
    throw new Error('Test user credentials not found. Set CYPRESS_TEST_USER_EMAIL and CYPRESS_TEST_USER_PASSWORD');
  }
  
  return { email, password };
}

/**
 * Clear authentication state between tests
 */
export function clearAuthState(): void {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.clearAllSessionStorage();
}

/**
 * Create test user via sign-up form (real Supabase integration)
 */
export function createTestUser(): Cypress.Chainable<TestUser> {
  const user = getTestUser();
  
  cy.visit('/sign-up');
  cy.get('#email').type(user.email);
  cy.get('#password').type(user.password);
  cy.get('[data-testid="sign-up-button"]').click();
  
  // With email verification disabled, should redirect on success
  cy.url({ timeout: 10000 }).should('not.include', '/sign-up');
  
  return cy.wrap(user);
}

/**
 * Login with test user credentials (real authentication flow)
 */
export function loginTestUser(): Cypress.Chainable<TestUser> {
  const user = getTestUser();
  
  cy.visit('/login');
  cy.get('#email').type(user.email);
  cy.get('#password').type(user.password);
  cy.get('[data-testid="login-button"]').click();
  
  // Should redirect away from login on success
  cy.url({ timeout: 10000 }).should('not.include', '/login');
  
  return cy.wrap(user);
}

/**
 * Logout using the logout button (real logout flow)
 */
export function logoutTestUser(): void {
  cy.get('[data-testid="logout-button"]').click();
  
  // Should redirect to unauthenticated state
  cy.url().should('not.include', '/notes');
}