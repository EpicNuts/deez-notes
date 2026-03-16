/// <reference types="cypress" />

/**
 * Type declarations for custom Cypress commands
 *
 * Currently using workflow pattern instead of custom commands for better maintainability.
 * See cypress/support/workflows.ts for reusable test functions.
 */

declare global {
  namespace Cypress {
    interface Chainable {
      // No custom commands currently defined - using workflow pattern instead
    }
  }
}

export {};
