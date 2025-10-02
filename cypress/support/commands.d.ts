/// <reference types="cypress" />

/**
 * Type declarations for custom Cypress commands
 * 
 * WHY: This file provides TypeScript intellisense for our custom commands
 * Using the standard Cypress namespace approach - this is the official pattern
 */

declare namespace Cypress {
  interface Chainable {
    /**
     * Login as a test user with valid credentials
     * WHY: Most tests need an authenticated user
     */
    loginAsTestUser(): Chainable<void>
    
    /**
     * Create a test note with optional content
     * WHY: Many tests need a note to work with
     */
    createTestNote(content?: string): Chainable<string>
    
    /**
     * Wait for auto-save to complete
     * WHY: Auto-save has debounced timing that tests need to respect
     */
    waitForAutoSave(): Chainable<void>
    
    /**
     * Validate toast message appears
     * WHY: User feedback validation is critical for UX testing
     */
    validateToast(message: string): Chainable<void>
    
    /**
     * Clean up test data (notes, user state)
     * WHY: Test isolation requires clean state between tests
     */
    clearTestData(): Chainable<void>
    
    /**
     * Simulate network failure for error testing
     * WHY: Error scenarios need predictable network conditions
     */
    simulateNetworkFailure(): Chainable<void>
    
    /**
     * Restore network after failure simulation
     */
    restoreNetwork(): Chainable<void>

    /**
     * Generate unique test email
     */
    generateTestEmail(): Chainable<string>

    /**
     * Wait for element to be stable
     */
    waitForStable(): Chainable<JQuery<HTMLElement>>
  }
}