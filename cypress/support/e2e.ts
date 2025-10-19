// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands using ES2015 syntax:
import "./commands";

// Import type declarations for TypeScript support
/// <reference types="cypress" />
/// <reference path="./commands.d.ts" />

beforeEach(() => {
  cy.intercept(`**`, (req) => {
    req.headers["x-vercel-protection-bypass"] = Cypress.env(
      "VERCEL_AUTOMATION_BYPASS_SECRET",
    );
    req.headers["x-vercel-set-bypass-cookie"] = "true";
  });
});
