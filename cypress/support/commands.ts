/// <reference types="cypress" />

/**
 * Custom Cypress Commands for Deez Notes Testing
 *
 * WHY these commands exist:
 * 1. Test Isolation: Each test starts with a clean state
 * 2. Reusability: Common workflows available across all test files
 * 3. Reliability: Consistent error handling and wait strategies
 * 4. Maintainability: Implementation details centralized
 */

// ===== COMMAND IMPLEMENTATIONS =====

/**
 * Login as Test User
 * WHY: Almost every test needs an authenticated state
 * This provides a consistent, fast way to get there
 */
Cypress.Commands.add("loginAsTestUser", () => {
  // WHY: Using environment variables keeps credentials secure and configurable
  const email = Cypress.env("TEST_USER_EMAIL") || "cypress-test@example.com";
  const password = Cypress.env("TEST_USER_PASSWORD") || "CypressTest123!";

  // WHY: We use the UI login flow to test the actual user experience
  // Alternative would be to set tokens directly, but that skips UI validation
  cy.visit("/login");
  cy.get("#email").type(email);
  cy.get("#password").type(password);
  cy.get('[data-testid="login-button"]').click();

  // WHY: Verify login success before continuing
  cy.url().should("not.include", "/login");
  cy.get('[data-testid="new-note-button"]').should("be.visible");
});

/**
 * Create Test Note
 * WHY: Many tests need a note to interact with
 * Returns the noteId for further test operations
 */
Cypress.Commands.add("createTestNote", (content = "Test note content") => {
  // WHY: Ensure we're authenticated first
  cy.get('[data-testid="new-note-button"]').should("be.visible");

  cy.get('[data-testid="new-note-button"]').click();

  // WHY: Wait for note creation and redirect
  cy.url().should("include", "noteId=");
  cy.validateToast("New note created");

  // WHY: Add content if provided
  if (content) {
    cy.get('[data-testid="note-text-input"]').type(content);
    cy.waitForAutoSave();
  }

  // WHY: Extract and return noteId for test use
  cy.url().then((url) => {
    const noteId = new URL(url).searchParams.get("noteId");
    cy.wrap(noteId).as("currentNoteId");
  });
});

/**
 * Wait for Auto-Save
 * WHY: Auto-save has a 2-second debounce delay
 * Tests need to wait for this to avoid race conditions
 */
Cypress.Commands.add("waitForAutoSave", () => {
  // WHY: 2500ms gives buffer time beyond the 2000ms debounce
  cy.wait(2500);

  // WHY: Could also wait for network request completion
  // cy.intercept('POST', '/api/**').as('autoSave');
  // cy.wait('@autoSave');
});

/**
 * Validate Toast Message
 * WHY: Toast notifications are critical user feedback
 * This provides consistent validation across tests
 */
Cypress.Commands.add("validateToast", (message: string) => {
  // WHY: Sonner toast library uses this attribute
  cy.get("[data-sonner-toast]").should("be.visible").and("contain", message);

  // WHY: Wait for toast to disappear to avoid interference with next actions
  cy.get("[data-sonner-toast]").should("not.exist", { timeout: 10000 });
});

/**
 * Clear Test Data
 * WHY: Test isolation requires clean state
 * Each test should start fresh
 */
Cypress.Commands.add("clearTestData", () => {
  // WHY: This would ideally connect to a test database cleanup endpoint
  // For now, we'll use UI-based cleanup

  cy.window().then((win) => {
    // WHY: Clear localStorage/sessionStorage that might persist state
    win.localStorage.clear();
    win.sessionStorage.clear();
  });

  // WHY: Reset any Cypress state
  cy.clearCookies();
  cy.clearLocalStorage();
});

/**
 * Simulate Network Failure
 * WHY: Error scenarios need predictable network conditions
 * This allows testing offline behavior and error handling
 */
Cypress.Commands.add("simulateNetworkFailure", () => {
  // WHY: Intercept all API calls and force them to fail
  cy.intercept("**", { forceNetworkError: true }).as("networkFailure");
});

/**
 * Restore Network
 * WHY: Return to normal network conditions after failure simulation
 */
Cypress.Commands.add("restoreNetwork", () => {
  // WHY: Clear all network interceptions
  cy.intercept("**").as("networkRestored");
});

/**
 * Generate Unique Test Email
 * WHY: Avoid conflicts when running tests multiple times
 */
Cypress.Commands.add("generateTestEmail", () => {
  const timestamp = Date.now();
  const email = `cypress-test-${timestamp}@example.com`;
  cy.wrap(email);
});

/**
 * Wait for Element to be Stable
 * WHY: Some animations/transitions can cause flaky tests
 * This ensures elements are fully rendered before interaction
 */
Cypress.Commands.add("waitForStable", { prevSubject: "element" }, (subject) => {
  // WHY: Wait for element position to stabilize
  cy.wrap(subject).should("be.visible").and("not.be.disabled");
  cy.wait(100); // Small buffer for animations
  cy.wrap(subject);
});
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
