/**
 * Sign Up Page Object
 *
 * Handles all UI interactions for the sign-up page.
 * Follows POM principles with chainable methods.
 */

import { TestUser } from "../support/testAuth";

export class SignUpPage {
  // ===== NAVIGATION METHODS =====
  
  visit() {
    cy.visit("/sign-up");
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

  getSignUpButton() {
    return cy.get('[data-testid="sign-up-button"]');
  }

  getToastError() {
    return cy.get('[data-testid="sonner-toast"] + [role="group"]');
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
    this.getSignUpButton().click();
    return this;
  }

  signUpWithCredentials(user: TestUser) {
    return this.fillForm(user.email, user.password).submitForm();
  }

  // ===== VALIDATION METHODS =====
  
  shouldBeOnSignUpPage() {
    cy.url().should("include", "/sign-up");
    return this;
  }

  shouldRedirectFromSignUp() {
    cy.url({ timeout: 10000 }).should("not.include", "/sign-up");
    return this;
  }

  shouldShowErrorToast() {
    this.getToastError().should("be.visible");
    return this;
  }

  shouldHaveError() {
    // Check if we're still on sign-up page (indicating an error)
    cy.url().should("include", "/sign-up");
    return this;
  }

  shouldShowLoadingState() {
    this.getSignUpButton().find(".animate-spin").should("exist");
    return this;
  }

  // ===== WAIT METHODS =====
  
  private waitForPageLoad() {
    this.getEmailInput().should("be.visible");
    this.getPasswordInput().should("be.visible");
    this.getSignUpButton().should("be.visible");
    return this;
  }
}