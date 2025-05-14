describe('validate Deez Notes app', () => {
  beforeEach(() => {
    cy.visit('localhost:3000')
  })

  
  context('validate initial landing page state', () => {
    it('validate header', () => {
      cy.get('[href="/sign-up"]').should('contain', 'Sign Up')
      cy.get('[href="/login"]').should('contain', 'Login')
      cy.get('[href="/faq"]').should('contain', 'FAQ')
    })

    it('validate main content', () => {
      // cy.get('[data-cy="main-content"]').should('exist')
    })
    
    it('validate sidebar', () => {
      // cy.get('[href="/privacy"]').should('contain', 'Privacy Policy')  
    })
    
    it('validate footer', () => {
      // cy.get('[href="/privacy"]').should('contain', 'Privacy Policy')
    })
  })

  context('sign up', () => {
    it('passes', () => {
      cy.visit('localhost:3000/sign-up')
      cy.get('[data-cy="sign-up-form"]').should('exist')
      cy.get('#email').type('lol')
      cy.get('#password').type('lol')
      cy.get('[data-cy="auth-form"]').should('exist')
      cy.get('[data-cy="login-button"]').should('not.exist')
      cy.get('[data-cy="sign-up-button"]').should('exist')
      cy.get('[data-cy="sign-up-button"]').click()

    })
  })

  // context('login', () => {
  //   it('passes', () => {
  //     cy.visit('localhost:3000/login')
  //     cy.get('[data-cy="login-form"]').should('exist')
  //     cy.get('[data-cy="login-email"]').type('')
  //   })
  // })

  // context('faq', () => {
  //   it('passes', () => {
  //     cy.visit('localhost:3000/faq')
  //     cy.get('[data-cy="faq-form"]').should('exist')
  //     cy.get('[data-cy="faq-email"]').type('')
  //   })
  // })
})