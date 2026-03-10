/**
 * Login Page Object
 *
 * Handles all UI interactions for the login page.
 * Follows POM principles with chainable methods.
 */

import { TestUser } from "../support/testAuth";

export class LoginPage {
  // ===== NAVIGATION METHODS =====
  
  visit() {
    cy.visit("/login");
    this.waitForPageLoad();
    return this;
  }

  // ===== ELEMENT GETTERS =====
  
  getEmailInput() {
    return cy.get("#email");
  }

  getPasswordInput() {
    return cy.get("#password");
  }

  getLoginButton() {
    return cy.get('[data-testid="login-button"]');
  }

  getToastError() {
    // Use a more specific selector for error toasts
    return cy.get('[data-sonner-toast]', { timeout: 5000 }).contains('Error');
  }

  // ===== ACTION METHODS =====
  
  fillEmail(email: string) {
    this.getEmailInput().clear().type(email);
    return this;
  }

  fillPassword(password: string) {
    this.getPasswordInput().clear().type(password);
    return this;
  }

  fillForm(email: string, password: string) {
    this.fillEmail(email).fillPassword(password);
    return this;
  }

  submitForm() {
    this.getLoginButton().should('not.be.disabled').click();
    return this;
  }

  submitAndWaitForResponse() {
    this.submitForm();
    // Wait for either redirect or error state
    cy.wait(1000); // Brief wait for form submission
    return this;
  }

  loginWithCredentials(user: TestUser) {
    return this.fillForm(user.email, user.password).submitAndWaitForResponse();
  }

  // ===== VALIDATION METHODS =====
  
  shouldBeOnLoginPage() {
    cy.url().should("include", "/login");
    return this;
  }

  shouldRedirectFromLogin() {
    cy.url({ timeout: 10000 }).should("not.include", "/login");
    return this;
  }

  shouldShowErrorToast() {
    this.getToastError().should("be.visible");
    return this;
  }

  shouldShowLoadingState() {
    this.getLoginButton().find(".animate-spin").should("exist");
    return this;
  }

  shouldHaveValidEmail() {
    this.getEmailInput().should("match", ":valid");
    return this;
  }

  shouldHaveInvalidEmail() {
    this.getEmailInput().should("match", ":invalid");
    return this;
  }

  shouldHaveValidPassword() {
    this.getPasswordInput().should("match", ":valid");
    return this;
  }

  shouldHaveInvalidPassword() {
    this.getPasswordInput().should("match", ":invalid");
    return this;
  }

  // ===== WAIT METHODS =====
  
  private waitForPageLoad() {
    this.getEmailInput().should("be.visible");
    this.getPasswordInput().should("be.visible");
    this.getLoginButton().should("be.visible");
    
    return this;
  }
}