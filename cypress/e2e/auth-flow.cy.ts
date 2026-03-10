/**
 * Authentication User Journey Tests
 *
 * Focuses on end-to-end user workflows, not component details.
 * Tests core user goals: signup, login, session management, security.
 */

import { authWorkflows, appState } from "../support/workflows";

describe("🔐 Authentication User Journeys", () => {
  beforeEach(() => {
    authWorkflows.clearSession();
  });

  context("when a new user signs up", () => {
    it("should allow new user signup and access to notes", () => {
      authWorkflows.authenticateUser().then((user) => {
        cy.log(`New user created: ${user.email}`);
        appState.shouldBeAuthenticated();
        // Should be able to access notes functionality
        cy.get('[data-testid="new-note-button"]').should("be.visible");
      });
    });
  });

  context("when an existing user logs in", () => {
    it("should allow existing user login and access to notes", () => {
      authWorkflows.loginExistingUser().then((existingUser) => {
        cy.url({ timeout: 15000 }).should("not.include", "/login");
        appState.shouldBeAuthenticated();
        cy.get('[data-testid="new-note-button"]').should("be.visible");
        cy.log(`Existing user logged in: ${existingUser.email}`);
      });
    });

    it("should maintain session across page reloads", () => {
      authWorkflows.authenticateUser();
      
      // Reload page and verify still authenticated
      cy.reload();
      appState.shouldBeAuthenticated();
      cy.log("Session persisted across reload");
    });
  });

  context("when invalid credentials are provided", () => {
    it("should reject invalid login credentials", () => {
      cy.visit("/login");
      cy.get("#email").type("wrong@example.com");
      cy.get("#password").type("wrongpassword");
      cy.get('[data-testid="login-button"]').click();
      
      // Wait for form submission and check for error toast
      cy.get('[data-sonner-toast]', { timeout: 10000 }).contains("Error").should("be.visible");
      
      // Should stay on login page 
      cy.url().should("include", "/login");
      cy.log("Invalid credentials properly rejected");
    });
  });

  context("when logging out", () => {
    it("should logout and prevent access to protected features", () => {
      authWorkflows.loginExistingUser()
      appState.shouldBeAuthenticated();
    
      // Logout
      authWorkflows.logout();
      
      // Validate user unauthenticated
      appState.shouldBeUnauthenticated();      
    });
  });
});
