/**
 * Test Workflows - Focus on user goals, not implementation details
 * 
 * These helpers encapsulate complex user flows at the right abstraction level.
 * Tests should read like user stories, not technical specifications.
 */

import { getTestUser, getRandomTestUser, clearAuthState, TestUser } from "./testAuth";

/**
 * Authentication workflows that hide implementation complexity
 */
export const authWorkflows = {
  /**
   * Get a user into an authenticated state (simplest path)
   * Test doesn't care if it's via signup or login - just wants auth state
   */
  authenticateUser(): Cypress.Chainable<TestUser> {
    const user = getRandomTestUser();
    
    // Go directly to signup (fastest path to auth state)
    cy.visit("/sign-up");
    cy.get("#email").type(user.email);
    cy.get("#password").type(user.password);
    cy.get('[data-testid="sign-up-button"]').click();
    
    // Wait for auth success (redirect away from signup)
    cy.url({ timeout: 15000 }).should("not.include", "/sign-up");
    
    return cy.wrap(user);
  },

  /**
   * Test the specific signup flow (when that's what you're actually testing)
   */
  signUpNewUser(): Cypress.Chainable<TestUser> {
    const user = getRandomTestUser();
    
    cy.visit("/sign-up");
    cy.get("#email").type(user.email);
    cy.get("#password").type(user.password);
    cy.get('[data-testid="sign-up-button"]').click();
    
    return cy.wrap(user);
  },

  /**
   * Test the specific login flow (requires existing user)
   */
  loginExistingUser(): Cypress.Chainable<TestUser> {
    const user = getTestUser(); // Use known test user
    
    cy.visit("/login");
    cy.get("#email").type(user.email);
    cy.get("#password").type(user.password);
    cy.get('[data-testid="login-button"]').click();
    
    // Wait for auth success
    cy.url({ timeout: 15000 }).should("not.include", "/login");
    
    return cy.wrap(user);
  },

  /**
   * Get into unauthenticated state
   */
  logout(): void {
    cy.get('[data-testid="logout-button"]').click();

    // Wait for logout to complete (redirect to login or show login/signup options)
    cy.url({ timeout: 10000 }).should("not.include", "noteId=");
    cy.url({ timeout: 10000 }).should("eq", Cypress.config().baseUrl + "/");
  },

  /**
   * Clean state for test isolation
   */
  clearSession(): void {
    clearAuthState();
  }
};

/**
 * App state assertions - what users actually care about
 */
export const appState = {
  shouldBeAuthenticated(): void {
    cy.get('[data-testid="logout-button"]').should("be.visible");
    cy.get('[data-testid="new-note-button"]').should("be.visible");
  },

  shouldBeUnauthenticated(): void {
    cy.get('[href="/login"]').should("be.visible");
    cy.get('[href="/sign-up"]').should("be.visible");
  },

  shouldShowError(): void {
    cy.get('[data-sonner-toast]').contains("Error").should("be.visible");
  }
};