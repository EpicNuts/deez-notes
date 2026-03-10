/**
 * Real Authentication Testing
 *
 * Tests the actual authentication implementation with real Supabase integration.
 * No mocking - this validates the complete auth flow.
 * 
 * 🎯 **Roadmap 1.1: Authentication & Authorization Flow**
 * ✅ Complete login flow
 * ✅ Valid credentials login
 * ✅ Invalid credentials error handling
 * ✅ Password validation
 * ✅ Email format validation
 */

import {
  getTestUser,
  clearAuthState,
} from "../support/testAuth";
import { AuthWorkflows } from "../pages/AuthWorkflows";
import { LoginPage } from "../pages/LoginPage";
import { SignUpPage } from "../pages/SignUpPage";

describe("🔐 Authentication Flow Validation", () => {
  const authWorkflows = new AuthWorkflows();
  const loginPage = new LoginPage();

  beforeEach(() => {
    // Start each test with clean auth state
    clearAuthState();
  });

  describe("📝 Valid Credentials Login", () => {
    it.only("should create new user and login successfully", () => {
      // Test the complete flow: create user → login → verify authenticated state

      // Step 1: Create test user via sign-up
      authWorkflows.createTestUser().then((user) => {
        cy.log(`✅ Created test user: ${user.email}`);

        // Step 2: Should be redirected and authenticated after sign-up
        cy.get('[data-testid="logout-button"]', { timeout: 10000, log: false }).should("be.visible");
        cy.url().should("not.include", "/sign-up");
        cy.log("✅ User is authenticated after sign-up");
      });
    });

    it("should login existing user with valid credentials", () => {
      // Ensure user exists first
      authWorkflows.createKnownTestUser();

      // Clear auth state and test login flow
      clearAuthState();

      // Test login with existing credentials
      authWorkflows.loginTestUser().then((user) => {
        cy.log(`✅ Logged in test user: ${user.email}`);

        // Verify authenticated state and proper redirect
        cy.get('[data-testid="logout-button"]', { log: false }).should("be.visible");
        cy.url().should("not.include", "/login");
        
        // Verify success toast appears
        cy.get('[data-testid="sonner-toast"]').should('be.visible');
      });
    });

    it("should maintain session persistence across page reloads", () => {
      // Create and login user
      authWorkflows.createTestUser();

      // Verify session persists after reload
      cy.reload();
      cy.get('[data-testid="logout-button"]', { log: false }).should("be.visible");
      cy.url().should("not.include", "/login");
      cy.log("✅ Session persisted across page reload");
    });
  });

  describe("❌ Invalid Credentials Error Handling", () => {
    it("should reject completely invalid email/password combination", () => {
      loginPage
        .visit()
        .fillEmail("nonexistent@example.com")
        .fillPassword("wrongpassword123")
        .submitForm()
        .shouldBeOnLoginPage()
        .shouldShowErrorToast();

      cy.log("✅ Correctly rejected invalid credentials");
    });

    it("should reject valid email with wrong password", () => {
      const user = getTestUser();
      
      // First ensure user exists
      authWorkflows.createKnownTestUser();
      clearAuthState();

      loginPage
        .visit()
        .fillEmail(user.email)
        .fillPassword("definitively-wrong-password-123!")
        .submitForm()
        .shouldBeOnLoginPage();

      cy.log("✅ Correctly rejected wrong password for existing user");
    });

    it("should show loading state during authentication attempt", () => {
      loginPage
        .visit()
        .fillEmail("test@example.com")
        .fillPassword("testpassword")
        .submitForm()
        .shouldShowLoadingState();

      cy.log("✅ Loading state displayed during auth attempt");
    });
  });

  describe("📧 Email Format Validation", () => {
    it("should require valid email format in login form", () => {
      // Test various invalid email formats
      const invalidEmails = [
        "notanemail",
        "@example.com", 
        "test@",
        "test.example.com",
        "test@.com",
        "",
      ];

      invalidEmails.forEach((invalidEmail) => {
        loginPage
          .visit()
          .fillEmail(invalidEmail)
          .fillPassword("validpassword123")
          .submitForm()
          .shouldHaveInvalidEmail()
          .shouldBeOnLoginPage();

        cy.log(`✅ Rejected invalid email: ${invalidEmail}`);
      });
    });

    it("should accept valid email formats", () => {
      const validEmails = [
        "test@example.com",
        "user.name@domain.co.uk", 
        "firstname+lastname@company.org",
        "a@b.co",
      ];

      validEmails.forEach((validEmail) => {
        loginPage
          .visit()
          .fillEmail(validEmail)
          .fillPassword("validpassword123")
          .shouldHaveValidEmail();

        cy.log(`✅ Accepted valid email: ${validEmail}`);
      });
    });
  });

  describe("🔒 Password Validation", () => {
    it("should require password field to be filled", () => {
      loginPage
        .visit()
        .fillEmail("test@example.com")
        // Leave password empty
        .submitForm()
        .shouldHaveInvalidPassword()
        .shouldBeOnLoginPage();

      cy.log("✅ Required password field validation working");
    });

    it("should accept any non-empty password for login attempts", () => {
      const passwords = [
        "a", // Very short
        "simple", // No special chars
        "Complex123!", // Complex
        "   spaces   ", // With spaces
      ];

      passwords.forEach((password) => {
        loginPage
          .visit()
          .fillEmail("test@example.com")
          .fillPassword(password)
          .shouldHaveValidPassword();

        cy.log(`✅ Accepted password for submission: ${password.length} chars`);
      });
    });
  });

  describe("🚪 Logout Flow Validation", () => {
    it("should logout successfully and clear session", () => {
      // First ensure user is logged in
      authWorkflows.createTestUser();

      // Test logout
      authWorkflows.logoutTestUser();

      // Verify unauthenticated state
      cy.get('[data-testid="logout-button"]', { log: false }).should("not.exist");
      
      // Try to visit protected page - should redirect to login
      cy.visit("/notes", { failOnStatusCode: false });
      cy.url().should("include", "/login");
      cy.log("✅ Successfully logged out and cleared session");
    });

    it("should redirect to login when accessing protected routes while unauthenticated", () => {
      // Ensure clean state
      clearAuthState();
      
      // Try to access protected route
      cy.visit("/notes", { failOnStatusCode: false });
      cy.url().should("include", "/login");
      cy.log("✅ Properly redirected unauthenticated user to login");
    });
  });
});
