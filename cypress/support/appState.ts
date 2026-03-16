/**
 * App State Assertions - what users actually care about experiencing
 * 
 * These assertions focus on user-visible outcomes, not implementation details.
 * Think from the user's perspective: "What should I see/be able to do?"
 */

/**
 * Authentication state validations
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
  },

  /**
   * Note-related state validations
   */

  getNoteId(): Cypress.Chainable<string> {
    return cy.url().then(url => {
      const noteId = url.split('?noteId=')[1];
      if (!noteId) throw new Error('No noteId found in URL');
      return noteId;
    })
  },

  shouldShowNoteInSidebar(noteId: string): void {
    cy.get(`[data-testid="select-note-button ${noteId}"]`).should("be.visible");
  },

  shouldNotShowNoteInSidebar(noteId: string): void {
    cy.get(`[data-testid="select-note-button ${noteId}"]`).should("not.exist");
  },

  shouldShowNoteContent(text: string): void {
    cy.get('[data-testid="note-text-input"]').should("contain.value", text);
  },

  shouldBeOnNoteUrl(noteId: string): void {
    cy.url().should("include", `noteId=${noteId}`);
  },

  shouldNotBeOnAnyNote(): void {
    cy.url().should("not.include", "noteId=");
  },

  /**
   * Sidebar state validations
   */
  openSidebar(): void {
    if (Cypress.$('[data-testid="sidebar-content"]').is(':visible')) {
      // Sidebar is already open, do nothing
      return;
    }
    cy.get('[data-testid="sidebar-trigger"]').click();
  },

  shouldHaveNoteCountInSidebar(count: number): void {
    cy.get('[data-testid="sidebar-group-content"]')
      .find('[data-testid*="select-note-button "]')
      .should('have.length', count);
  },

  shouldShowNotePreviewText(noteId: string, text: string): void {
    // Verify text appears in sidebar (for real-time updates)
    cy.get(`[data-testid="select-note-button ${noteId}"] [data-testid="note-text"]`)
      .should('contain', text.substring(0, 20)); // First 20 chars typically shown
  },

  shouldShowDefaultTextInNotePreview(noteId: string): void {
    cy.get(`[data-testid="select-note-button ${noteId}"] [data-testid="note-text"]`)
      .should('contain', "EMPTY NOTE"); // Default text for new notes
  },

  /**
   * UI interaction state
   */
  shouldShowLoadingState(): void {
    cy.get('[data-testid="loading-indicator"]').should("be.visible");
  },

  shouldHideLoadingState(): void {
    cy.get('[data-testid="loading-indicator"]').should("not.exist");
  },

  shouldAllowNoteEditing(): void {
    cy.get('[data-testid="note-text-input"]').should("be.enabled").should("be.visible");
  }
};