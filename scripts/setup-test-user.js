/**
 * Test User Setup Script
 * 
 * This script helps create a test user in Supabase for Cypress testing.
 * With email verification disabled, users can login immediately after creation.
 */

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Read environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const TEST_USER_EMAIL = process.env.CYPRESS_TEST_USER_EMAIL;
const TEST_USER_PASSWORD = process.env.CYPRESS_TEST_USER_PASSWORD;

async function createTestUser() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ Missing Supabase credentials in environment');
    return;
  }
  
  if (!TEST_USER_EMAIL || !TEST_USER_PASSWORD) {
    console.error('❌ Missing test user credentials in environment');
    return;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  try {
    console.log(`📧 Attempting to create test user: ${TEST_USER_EMAIL}`);
    
    // Try to sign up the test user
    const { data, error } = await supabase.auth.signUp({
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD,
    });

    if (error) {
      if (error.message.includes('already registered')) {
        console.log('✅ Test user already exists');
        console.log('🎯 User is ready for testing (email verification disabled)');
      } else {
        throw error;
      }
    } else {
      console.log('✅ Test user created successfully');
      console.log('🎯 User is ready for testing immediately (email verification disabled)');
    }

    console.log('\n🎯 Next steps:');
    console.log('1. Run: npm run cypress -- --spec "cypress/e2e/auth-flow.cy.ts"');
    console.log('2. Or run all tests: npm run cypress');
    
  } catch (error) {
    console.error('❌ Failed to create test user:', error.message);
  }
}

// Only run if called directly (ES module equivalent)
if (import.meta.url === `file://${process.argv[1]}`) {
  createTestUser();
}

export { createTestUser };