import { NotesPage } from '../pages/notes_page';

describe('validate Deez Notes app', () => {
  const notesPage = new NotesPage();

  beforeEach(() => {
    notesPage.visit();
  })
  
  context('validate initial landing page state', () => {
    it('validate header', () => {
      // Validate all expected Header elements, including the sidebar trigger
      notesPage.getSidebarTrigger().should('exist');

      // ... the deez-notes logo, the linked page name,
      notesPage.getLogo().should('exist');
      notesPage.getLogoText().should('contain', 'DEEZ Notes');
      notesPage.getLogoLink().should('have.attr', 'href', '/');
      
      // ... the sign up, login, and FAQ button links
      notesPage.getSignUpLink().should('contain', 'Sign Up');
      notesPage.getLoginLink().should('contain', 'Login');
      notesPage.getFaqLink().should('contain', 'FAQ');
    })

    it('validate main content', () => {
      // Validate all unauthorised main content elements exist
      notesPage.getAskAiButton().should('be.visible');
      notesPage.getNewNoteButton().should('be.visible');
      notesPage.getNoteTextInput().should('be.visible');

      // Validate the note text input is empty
      notesPage.getNoteTextInput().should('have.value', '');
      notesPage.getNoteTextInput().should('have.attr', 'placeholder', 'Type your notes here...')
    })
    
    it('validate sidebar', () => {
      // Sidebar should be initially closed
      notesPage.getSidebarGroupContent().should('not.exist')
      
      // Click the sidebar trigger
      notesPage.getSidebarTrigger().click()

      // Sidebar should now be visible
      notesPage.getSidebarUnauthText().should('be.visible')
    })
  })

  context('sign up', () => {
    beforeEach(() => {
      cy.get('[href="/sign-up"]').should('contain', 'Sign Up').click()
      cy.url().should('include', '/sign-up')
    })

    it('sign up form validation', () => {
      cy.get('[data-testid="sign-up-form"]').should('exist')
      
      cy.get('#email').should('exist')
      cy.get('#email').type('lol')

      cy.get('#password').should('exist')
      cy.get('#password').type('lol')

      cy.get('[data-testid="auth-form"]').should('exist')
      // cy.get('[data-testid="login-button"]').should('not.exist')
      cy.get('[data-testid="sign-up-button"]').should('exist')
      cy.get('[data-testid="sign-up-button"]').click()
    })
  })

  context.skip('login', () => {
    beforeEach(() => {
      cy.get('[data-testid="header"] [href="/login"]').should('contain', 'Login').click()
      cy.url().should('include', '/login')
    })

    it('login form validation', () => {
      // cy.get('[data-testid="login-form"]').should('exist')

      cy.get('#email').should('exist')
      // cy.get('#email').type('lol')

      cy.get('#password').should('exist')
      // cy.get('#password').type('lol')

      cy.get('[data-testid="auth-form"]').should('exist')
      cy.get('[data-testid="sign-up-button"]').should('not.exist')
      cy.get('[data-testid="login-button"]').should('exist')
      cy.get('[data-testid="login-button"]').click()
      
    })
  })

  context.skip('faq', () => {
    beforeEach(() => {
      cy.get('[href="/faq"]').should('contain', 'FAQ').click()
      cy.url().should('include', '/faq')
    })

    it('passes', () => {
      cy.get('[data-testid="faq-form"]').should('exist')
      cy.get('[data-testid="faq-email"]').type('')
    })
  })
})