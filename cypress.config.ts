import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
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
      testUserEmail: process.env.CYPRESS_TEST_USER_EMAIL,
      testUserPassword: process.env.CYPRESS_TEST_USER_PASSWORD,
    },
  },
});
