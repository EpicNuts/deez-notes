export class NotesPage {
  visit() {
    cy.visit('/');
  }

  getSidebarTrigger() {
    return cy.get('[data-testid="sidebar-trigger"]');
  }

  getLogo() {
    return cy.get('[data-testid="logo"]');
  }

  getLogoText() {
    return cy.get('[data-testid="logo-text"]');
  }

  getLogoLink() {
    return cy.get('[data-testid="logo-link"]');
  }

  getSignUpLink() {
    return cy.get('[href="/sign-up"]');
  }

  getLoginLink() {
    return cy.get('[href="/login"]');
  }

  getFaqLink() {
    return cy.get('[href="/faq"]');
  }

  getAskAiButton() {
    return cy.get('[data-testid="ask-ai-button"]');
  }

  getNewNoteButton() {
    return cy.get('[data-testid="new-note-button"]');
  }

  getNoteTextInput() {
    return cy.get('[data-testid="note-text-input"]');
  }

  getSidebarGroupContent() {
    return cy.get('[data-testid="sidebar-group-content"]');
  }

  getSidebarUnauthText() {
    return cy.get('[data-testid="sidebar-unauthenticated-text"]');
  }
}