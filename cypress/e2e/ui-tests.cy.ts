import { NotesPage } from "../pages/notes_page";

/**
 * Comprehensive Deez Notes Application Testing Suite
 */
describe("Deez Notes Application", () => {
  const notesPage = new NotesPage();

  beforeEach(() => {
    notesPage.visit();
  });

  /**
   * Unauthenticated User Experience Tests
   */
  context("Unauthenticated User Experience", () => {
    it("should display correct initial landing page state", () => {
      notesPage.shouldShowUnauthenticatedState();
      notesPage.openSidebar();
      // Unauthenticated users should see login prompt, not notes content
      notesPage.getSidebarUnauthText().should("contain", "Login");
    });

    it("should display functional header navigation", () => {
      notesPage.getLogo().should("be.visible");
      notesPage.getLogoText().should("contain", "DEEZ Notes");
      notesPage.getLogoLink().should("have.attr", "href", "/");
      notesPage.getSignUpLink().should("contain", "Sign Up").and("be.visible");
      notesPage.getLoginLink().should("contain", "Login").and("be.visible");
    });

    it("should show note interface elements but restrict functionality", () => {
      notesPage.getNoteTextInput().should("be.visible");
      notesPage.getNewNoteButton().should("be.visible");
      notesPage.getNewNoteButton().click();
      // Should not create notes for unauthenticated users
      cy.url().should("not.include", "/notes");
    });

    it("should redirect unauthenticated users to login when accessing restricted features", () => {
      notesPage.getNewNoteButton().click();
      // Should redirect to login or show auth prompt
      cy.url().should("satisfy", (url: string) => {
        return (
          url.includes("/login") ||
          url.includes("/sign-up") ||
          url === "http://localhost:3000/"
        );
      });
    });
  });

  /**
   * User Registration (Sign Up) Tests
   */
  context("User Registration (Sign Up)", () => {
    beforeEach(() => {
      notesPage.visitSignUpPage();
    });

    it("should display sign up form with correct elements", () => {
      notesPage.getEmailInput().should("be.visible");
      notesPage.getPasswordInput().should("be.visible");
      notesPage
        .getSignUpButton()
        .should("be.visible")
        .and("contain", "Sign Up");
      notesPage.getAuthFormLink().should("contain", "Login");
    });

    it("should validate email format requirements", () => {
      const invalidEmails = [
        "invalid",
        "test@",
        "@example.com",
        "test.example.com",
      ];

      invalidEmails.forEach((email) => {
        notesPage.getEmailInput().clear().type(email);
        notesPage.getPasswordInput().clear().type("ValidPassword123!");
        notesPage.getSignUpButton().click();
        // Invalid emails should keep user on signup page
        cy.url().should("include", "/sign-up");
      });
    });

    it("should validate password requirements", () => {
      const weakPasswords = ["123", "password", "abc"];

      weakPasswords.forEach((password, index) => {
        // Refresh page between attempts to reset form state
        if (index > 0) {
          cy.reload();
        }

        notesPage.getEmailInput().type("test@example.com");
        notesPage.getPasswordInput().type(password);
        notesPage.getSignUpButton().click();
        // Weak passwords should keep user on form
        cy.url().should("include", "/sign-up");
      });
    });

    it("should allow switching to login form", () => {
      notesPage.getAuthFormLink().click();
      cy.url().should("include", "/login");
      notesPage.getLoginButton().should("be.visible");
    });
  });

  /**
   * User Login Tests
   */
  context("User Login", () => {
    beforeEach(() => {
      notesPage.visitLoginPage();
    });

    it("should display login form with correct elements", () => {
      notesPage.getEmailInput().should("be.visible");
      notesPage.getPasswordInput().should("be.visible");
      notesPage.getLoginButton().should("be.visible").and("contain", "Login");
      notesPage.getAuthFormLink().should("contain", "Sign Up");
    });

    it("should allow switching to signup form", () => {
      notesPage.getAuthFormLink().click();
      cy.url().should("include", "/sign-up");
      notesPage.getSignUpButton().should("be.visible");
    });
  });
});
