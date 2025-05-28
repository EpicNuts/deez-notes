describe('validate Deez Notes app', () => {
  
  beforeEach(() => {
    cy.visit('/')
  })
  
  context('validate initial landing page state', () => {
    it('validate header', () => {
      // Validate all expected Header elements, including the sidebar trigger
      cy.get('[data-testid="sidebar-trigger"]').should('exist')
      
      // ... the deez-notes logo, the linked page name,
      cy.get('[data-testid="logo"]').should('exist')
      cy.get('[data-testid="logo-text"]').should('contain', 'DEEZ Notes')
      cy.get('[data-testid="logo-link"]').should('have.attr', 'href', '/')
      
      // ... the sign up, login, and FAQ button links
      cy.get('[href="/sign-up"]').should('contain', 'Sign Up')
      cy.get('[href="/login"]').should('contain', 'Login')
      cy.get('[href="/faq"]').should('contain', 'FAQ')
    })

    it('validate main content', () => {
      // Validate all unauthorised main content elements exist
      cy.get('[data-testid="ask-ai-button"]').should('be.visible')
      cy.get('[data-testid="new-note-button"]').should('be.visible')
      cy.get('[data-testid="note-text-input"]').should('be.visible')

      // Validate the note text input is empty
      cy.get('[data-testid="note-text-input"]').should('have.value', '')
      cy.get('[data-testid="note-text-input"]').should('have.attr', 'placeholder', 'Type your notes here...')
    })
    
    it('validate sidebar', () => {
      // Sidebar should be initially closed
      cy.get('[data-testid="sidebar-group-content"]').should('not.exist')
      
      // Click the sidebar trigger
      cy.get('[data-testid="sidebar-trigger"]').click()
      
      // Sidebar should now be visible
      cy.get('[data-testid="sidebar-unauthenticated-text"]').should('be.visible')
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