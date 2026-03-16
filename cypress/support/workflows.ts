/**
 * Test Workflows - Focus on user goals, not implementation details
 * 
 * These helpers encapsulate complex user flows at the right abstraction level.
 * Tests should read like user stories, not technical specifications.
 */

import { getTestUser, getRandomTestUser, clearAuthState, TestUser } from "./testAuth";
import { appState } from "./appState";

export const authWorkflows = {
  signupUser(user?: TestUser): Cypress.Chainable<TestUser> {
    if (!user) {
      user = getRandomTestUser();
    }
    cy.visit("/sign-up");
    cy.get("#email").type(user.email);
    cy.get("#password").type(user.password);
    cy.get('[data-testid="sign-up-button"]').click();
    cy.url({ timeout: 15000 }).should("not.include", "/sign-up");
    return cy.wrap(user);
  },

  loginUser(user?: TestUser): Cypress.Chainable<TestUser> {
    if (!user) {
      user = getTestUser(); // Use known test user
    }
    cy.visit("/login");
    cy.get("#email").type(user.email);
    cy.get("#password").type(user.password);
    cy.get('[data-testid="login-button"]').click();
    cy.url({ timeout: 15000 }).should("not.include", "/login");
    return cy.wrap(user);
  },

  logout(): void {
    cy.get('[data-testid="logout-button"]').click();
    cy.url({ timeout: 10000 }).should("not.include", "noteId=");
    cy.url({ timeout: 10000 }).should("eq", Cypress.config().baseUrl + "/");
  },

  clearSession(): void {
    clearAuthState();
  }
};

/**
 * Note management workflows - focus on user goals with notes
 */
export const noteWorkflows = {
  createNoteAndVerifySidebarUpdate(): Cypress.Chainable<string> {
    cy.get('[data-testid="sidebar-trigger"]').click();
    return cy.get('[data-testid="sidebar-group-content"]').then($sidebar => {
      const currentNoteCount = $sidebar.find('[data-testid*="select-note-button "]').length;  
      // Create new note
      cy.get('[data-testid="new-note-button"]').click();
      // Sidebar should immediately show new note (no page refresh)
      appState.shouldHaveNoteCountInSidebar(currentNoteCount + 1);
      // Should navigate to new note
      cy.url().should('include', 'noteId=');
      // Return the noteId for further use
      return cy.url().then(url => {
        const noteId = new URL(url).searchParams.get('noteId');
        if (!noteId) throw new Error('Expected noteId in URL but got null');
        return cy.wrap(noteId);
      });
    });
  },

  /**
   * Delete a note and verify sidebar updates immediately 
   */
  deleteNoteAndVerifySidebarUpdate(): void {
    // Open sidebar first to ensure we can count notes
    cy.get('[data-testid="sidebar-trigger"]').click();
    // Get current note count
    cy.get('[data-testid="sidebar-group-content"]').then($sidebar => {
      const currentNoteCount = $sidebar.find('[data-testid*="select-note-button "]').length;
      if (currentNoteCount > 0) {
        // Delete the current note (we should be viewing one)
        cy.get('[data-testid="delete-note-button"]').click();
        // Confirm deletion if dialog appears
        cy.get('body').then($body => {
          if ($body.find('[data-testid="confirm-delete-button"]').length > 0) {
            cy.get('[data-testid="confirm-delete-button"]').click();
          }
        });
        // Wait for navigation away from note (app navigates to "/")
        cy.url().should('not.include', 'noteId=');
        // Sidebar should immediately reflect change
        appState.shouldHaveNoteCountInSidebar(currentNoteCount - 1);
      }
    });
  },

  /**
   * Type text and verify sidebar shows updated text
   */
  typeTextAndVerifySidebarUpdate(text: string): void {
    cy.get('[data-testid="note-text-input"]').clear().type(text);
    // Wait for save (app has auto-save with debounce)
    cy.wait(2000);
    // Open sidebar to see the text update
    cy.get('[data-testid="sidebar-trigger"]').click();
    appState.getNoteId().then(noteId => {
      appState.shouldShowNoteInSidebar(noteId);
      // Sidebar should show updated text
      appState.shouldShowNoteText(noteId, text);
    });
  }
};

