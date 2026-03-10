import { defineConfig } from "cypress";
import dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

export default defineConfig({
  e2e: {
    // Reduce verbose output in test runner
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("task", {
        checkIfUserExists(email: string) {
          // TODO: Implement database check for user existence
          // For now, return false to always create user
          return false;
        },

        createVerifiedTestUser({
          email,
          password,
        }: {
          email: string;
          password: string;
        }) {
          // TODO: Implement direct database user creation with email_confirmed_at set
          // This would use your Supabase admin client or direct database connection
          console.log(`Creating verified test user: ${email}`);
          return { success: true, user: { email, verified: true } };
        },

        cleanupTestUser(email: string) {
          // TODO: Remove test user from database
          console.log(`Cleaning up test user: ${email}`);
          return { success: true };
        },
      });
    },
    chromeWebSecurity: false,
    baseUrl: "http://localhost:3000",
    env: {
      // Test user credentials from environment
      TEST_USER_EMAIL: process.env.CYPRESS_TEST_USER_EMAIL,
      TEST_USER_PASSWORD: process.env.CYPRESS_TEST_USER_PASSWORD,
    },
  },
});
