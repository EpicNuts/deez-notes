/**
 * Enhanced Page Object for Deez Notes Application
 * 
 * WHY this structure:
 * 1. Separation of Concerns: Element getters vs. action methods vs. validation methods
 * 2. Chainable Interface: Methods return 'this' for fluent API
 * 3. Semantic Naming: Methods describe user intentions, not technical details
 * 4. Error Handling: Built-in waits and validations
 */
export class NotesPage {
  // ===== NAVIGATION METHODS =====
  // These handle complex navigation flows with built-in validations
  
  visit() {
    cy.visit('/');
    this.waitForPageLoad();
    return this;
  }

  visitLoginPage() {
    cy.visit('/login');
    this.waitForLoginPageLoad();
    return this;
  }

  visitSignUpPage() {
    cy.visit('/sign-up');
    this.waitForSignUpPageLoad();
    return this;
  }

  // ===== AUTHENTICATION ACTIONS =====
  // High-level methods that encapsulate complex user workflows
  
  loginWithCredentials(email: string, password: string) {
    this.visitLoginPage()
        .fillLoginForm(email, password)
        .submitLoginForm();
    return this;
  }

  signUpWithCredentials(email: string, password: string) {
    this.visitSignUpPage()
        .fillSignUpForm(email, password)
        .submitSignUpForm();
    return this;
  }

  logout() {
    this.getLogoutButton().click();
    this.waitForLogoutCompletion();
    return this;
  }

  // ===== FORM INTERACTION METHODS =====
  // These encapsulate form interactions with proper error handling
  
  fillLoginForm(email: string, password: string) {
    this.getEmailInput().clear().type(email);
    this.getPasswordInput().clear().type(password);
    return this;
  }

  fillSignUpForm(email: string, password: string) {
    this.getEmailInput().clear().type(email);
    this.getPasswordInput().clear().type(password);
    return this;
  }

  submitLoginForm() {
    this.getLoginButton().click();
    return this;
  }

  submitSignUpForm() {
    this.getSignUpButton().click();
    return this;
  }

  // ===== NOTE MANAGEMENT ACTIONS =====
  // These represent user goals, not just button clicks
  
  createNewNote() {
    this.getNewNoteButton().click();
    this.waitForNoteCreation();
    return this;
  }

  typeInCurrentNote(content: string) {
    this.getNoteTextInput().clear().type(content);
    this.waitForAutoSave();
    return this;
  }

  appendToCurrentNote(content: string) {
    this.getNoteTextInput().type(content);
    this.waitForAutoSave();
    return this;
  }

  // ===== SIDEBAR INTERACTIONS =====
  // Sidebar has complex state management that needs proper abstractions
  
  openSidebar() {
    this.getSidebarTrigger().click();
    cy.wait(500); // Small wait for sidebar animation
    return this;
  }

  closeSidebar() {
    // WHY: Different ways to close sidebar (click trigger, press escape, click outside)
    this.getSidebarTrigger().click();
    this.waitForSidebarClose();
    return this;
  }

  selectNoteFromSidebar(noteId: string) {
    this.getSelectNoteButton(noteId).click();
    this.waitForNoteSelection(noteId);
    return this;
  }

  // ===== ELEMENT GETTERS =====
  // Centralized selectors with consistent naming
  
  // Header Elements
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

  getLogoutButton() {
    return cy.get('[data-testid="logout-button"]');
  }

  // Form Elements
  getEmailInput() {
    return cy.get('#email');
  }

  getPasswordInput() {
    return cy.get('#password');
  }

  getLoginButton() {
    return cy.get('form [data-testid="login-button"]');
  }

  getSignUpButton() {
    return cy.get('form [data-testid="sign-up-button"]');
  }

  getAuthFormLink() {
    return cy.get('[data-testid="auth-form-link"]');
  }

  // Main Content Elements
  getAskAiButton() {
    return cy.get('[data-testid="ask-ai-button"]');
  }

  getNewNoteButton() {
    return cy.get('[data-testid="new-note-button"]');
  }

  getNoteTextInput() {
    return cy.get('[data-testid="note-text-input"]');
  }

  // Sidebar Elements
  getSidebarGroupContent() {
    return cy.get('[data-testid="sidebar-group-content"]');
  }

  getSidebarUnauthText() {
    return cy.get('[data-testid="sidebar-unauthenticated-text"]');
  }

  getSelectNoteButton(noteId: string) {
    return cy.get(`[data-testid="select-note-button ${noteId}"]`);
  }

  // Toast Elements
  getToastMessage() {
    return cy.get('[data-sonner-toast]');
  }

  // ===== VALIDATION METHODS =====
  // These encapsulate common assertions and make tests more readable
  
  shouldShowUnauthenticatedState() {
    this.getSignUpLink().should('be.visible');
    this.getLoginLink().should('be.visible');
    this.getSidebarTrigger().click();
    this.getSidebarUnauthText().should('be.visible');
    return this;
  }

  shouldShowAuthenticatedState() {
    this.getLogoutButton().should('be.visible');
    this.getNewNoteButton().should('be.visible');
    return this;
  }

  shouldShowToast(message: string) {
    this.getToastMessage().should('contain', message);
    return this;
  }

  shouldBeOnNotePage(noteId?: string) {
    if (noteId) {
      cy.url().should('include', `noteId=${noteId}`);
    }
    this.getNoteTextInput().should('be.visible');
    return this;
  }

  shouldHaveNoteContent(content: string) {
    this.getNoteTextInput().should('have.value', content);
    return this;
  }

  // ===== WAIT METHODS =====
  // Proper wait strategies prevent flaky tests
  
  waitForPageLoad() {
    // Ensures all critical elements are loaded before proceeding
    this.getLogo().should('be.visible');
    this.getSidebarTrigger().should('be.visible');
  }

  waitForLoginPageLoad() {
    // Wait for page to load and form elements to be interactive
    cy.url().should('include', '/login');
    cy.get('[data-testid="auth-form"]').should('be.visible');
    this.getEmailInput().should('be.visible');
    this.getPasswordInput().should('be.visible');
    cy.get('form [data-testid="login-button"]').should('be.visible');
  }

  waitForSignUpPageLoad() {
    // Wait for page to load and form elements to be interactive
    cy.url().should('include', '/sign-up');
    cy.get('[data-testid="sign-up-form"]').should('be.visible');
    this.getEmailInput().should('be.visible');
    this.getPasswordInput().should('be.visible');
    cy.get('form [data-testid="sign-up-button"]').should('be.visible');
  }

  waitForNoteCreation() {
    // Note creation involves redirect and state update
    cy.url().should('include', 'noteId=');
    this.shouldShowToast('New note created');
  }

  waitForAutoSave() {
    // Auto-save has a 2-second debounce delay
    cy.wait(2500); // Give extra time for auto-save completion
  }

  waitForSidebarOpen() {
    // Only authenticated users have sidebar-group-content
    // Check if user is authenticated first
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="new-note-button"]').length > 0) {
        // User is authenticated - expect sidebar content
        this.getSidebarGroupContent().should('be.visible');
      } else {
        // User is unauthenticated - expect login prompt
        this.getSidebarUnauthText().should('be.visible');
      }
    });
  }

  waitForSidebarClose() {
    this.getSidebarGroupContent().should('not.exist');
  }

  waitForNoteSelection(noteId: string) {
    cy.url().should('include', `noteId=${noteId}`);
  }

  waitForLogoutCompletion() {
    this.getLoginLink().should('be.visible');
    this.getSignUpLink().should('be.visible');
  }
}