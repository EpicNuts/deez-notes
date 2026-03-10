/**
 * Authentication Workflows
 *
 * High-level authentication flows that combine page objects
 * and test data management for common test scenarios.
 */

import { LoginPage } from "./LoginPage";
import { SignUpPage } from "./SignUpPage";
import { NotesPage } from "./NotesPage";
import { getTestUser, getRandomTestUser, TestUser } from "../support/testAuth";

export class AuthWorkflows {
  private loginPage = new LoginPage();
  private signUpPage = new SignUpPage();
  private notesPage = new NotesPage();

  /**
   * Create test user via sign-up form (real Supabase integration)
   * Uses a random email to ensure unique user creation for each test
   */
  createTestUser(): Cypress.Chainable<TestUser> {
    const user = getRandomTestUser();

    this.signUpPage
      .visit()
      .signUpWithCredentials(user)
      .shouldRedirectFromSignUp();

    return cy.wrap(user);
  }

  /**
   * Create a known test user that can be used for subsequent login tests
   */
  createKnownTestUser(): Cypress.Chainable<TestUser> {
    const user = getTestUser();

    this.signUpPage
      .visit()
      .signUpWithCredentials(user);

    // Check if sign-up succeeded or user already exists
    cy.url({ timeout: 5000 }).then((url) => {
      if (url.includes('/sign-up')) {
        // User already exists, that's fine for a known user
        cy.log('Known test user already exists');
      }
    });

    return cy.wrap(user);
  }

  /**
   * Login with test user credentials (real authentication flow)
   */
  loginTestUser(): Cypress.Chainable<TestUser> {
    const user = getTestUser();

    this.loginPage
      .visit()
      .loginWithCredentials(user)
      .shouldRedirectFromLogin();

    return cy.wrap(user);
  }

  /**
   * Logout using the logout button (real logout flow)
   */
  logoutTestUser(): void {
    this.notesPage.logout();
  }

  /**
   * Combined flow: create user and verify authenticated state
   */
  createAndVerifyUser(): Cypress.Chainable<TestUser> {
    return this.createTestUser().then((user) => {
      // Verify authenticated state
      cy.get('[data-testid="logout-button"]').should("be.visible");
      cy.url().should("not.include", "/sign-up");
      return cy.wrap(user);
    });
  }

  /**
   * Combined flow: login existing user and verify state
   */
  loginAndVerifyUser(): Cypress.Chainable<TestUser> {
    return this.loginTestUser().then((user) => {
      // Verify authenticated state and success toast
      cy.get('[data-testid="logout-button"]').should("be.visible");
      cy.get('[data-testid="sonner-toast"]').should("be.visible");
      return cy.wrap(user);
    });
  }
}