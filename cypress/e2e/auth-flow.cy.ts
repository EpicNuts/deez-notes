/**
 * Real Authentication Testing
 * 
 * Tests the actual authentication implementation with real Supabase integration.
 * No mocking - this validates the complete auth flow.
 */

import { getTestUser, clearAuthState, createTestUser, loginTestUser, logoutTestUser } from '../support/testAuth';

describe.skip('Real Authentication Flow', () => {
  
  beforeEach(() => {
    // Start each test with clean auth state
    clearAuthState();
  });
  
  it('should create new user and login successfully', () => {
    // Test the complete flow: create user → login → verify authenticated state
    
    // Step 1: Create test user via sign-up
    createTestUser().then((user) => {
      cy.log(`✅ Created test user: ${user.email}`);
      
      // Step 2: Should be redirected and authenticated after sign-up
      cy.get('[data-testid="logout-button"]').should('be.visible');
      cy.log('✅ User is authenticated after sign-up');
    });
  });
  
  it('should login existing user successfully', () => {
    // Ensure user exists first
    createTestUser();
    
    // Clear auth state and test login flow
    clearAuthState();
    
    // Test login with existing credentials
    loginTestUser().then((user) => {
      cy.log(`✅ Logged in test user: ${user.email}`);
      
      // Verify authenticated state
      cy.get('[data-testid="logout-button"]').should('be.visible');
      cy.url().should('not.include', '/login');
    });
  });
  
  it('should reject invalid credentials', () => {
    const user = getTestUser();
    
    cy.visit('/login');
    cy.get('#email').type(user.email);
    cy.get('#password').type('wrong-password-123');
    cy.get('[data-testid="login-button"]').click();
    
    // Should stay on login page
    cy.url().should('include', '/login');
    cy.log('✅ Correctly rejected invalid credentials');
  });
  
  it('should logout successfully', () => {
    // First ensure user is logged in
    createTestUser();
    
    // Test logout
    logoutTestUser();
    
    // Verify unauthenticated state
    cy.get('[data-testid="logout-button"]').should('not.exist');
    cy.log('✅ Successfully logged out');
  });
  
});