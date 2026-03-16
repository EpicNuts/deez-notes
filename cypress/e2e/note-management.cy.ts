/**
 * Note Management User Journey Tests
 *
 * Focuses on end-to-end note workflows that users actually experience.
 * Tests the critical sidebar update functionality and note operations.
 */

import { authWorkflows, noteWorkflows } from "../support/workflows";
import { appState } from "../support/appState";

describe("📝 Note Management User Journeys", () => {
  let testUser

  beforeEach(() => {
    authWorkflows.signupUser().then((user) => {
      testUser = user;
      cy.log(`Test user for note management: ${testUser.email}`);
    })
  });

  it.only("should start with one default note", () => {
    cy.get('[data-testid="sidebar-trigger"]').click();
    appState.shouldHaveNoteCountInSidebar(1); // App creates one empty note by default
    appState.getNoteId().then(noteId => {
      appState.shouldShowNoteInSidebar(noteId);
      appState.shouldBeOnNoteUrl(noteId);
    });
  });
  
  it("should create first note", () => {
    noteWorkflows.createNoteAndVerifySidebarUpdate();
    appState.shouldHaveNoteCountInSidebar(1);
  });
  
  it("should add content to note", () => {
    // Note from previous test exists
    noteWorkflows.typeTextAndVerifySidebarUpdate("My content");
  });
  
  it("should create second note", () => {
    noteWorkflows.createNoteAndVerifySidebarUpdate().then((secondNoteId) => {
      appState.shouldHaveNoteCountInSidebar(2); 
      appState.shouldBeOnNoteUrl(secondNoteId);
    });
  });


  // context("when user creates a new note", () => {
  //   it("should update sidebar immediately without page refresh", () => {
  //     noteWorkflows.createNoteAndVerifySidebarUpdate().then((noteId) => {
  //       // Verify user can access the new note
  //       appState.shouldHaveNoteInSidebar(noteId);
  //       appState.shouldBeOnNoteUrl(noteId);
        
  //       // Essential UX: no page refresh occurred during note creation
  //       appState.shouldAllowNoteEditing();
  //     });
  //   });

  //   it("should handle multiple note creation with consistent sidebar updates", () => {
  //     // Create first note
  //     noteWorkflows.createNoteAndVerifySidebarUpdate();
      
  //     // Create second note
  //     noteWorkflows.createNoteAndVerifySidebarUpdate().then((secondNoteId) => {
  //       // Should have 2 notes in sidebar
  //       appState.shouldHaveNotesInSidebar(2);
        
  //       // Should be on the newest note
  //       appState.shouldBeOnNoteUrl(secondNoteId);
  //     });
  //   });
  // });

  // context("when user deletes a note", () => {
  //   it("should update sidebar immediately", () => {
  //     // Create a note first
  //     noteWorkflows.createNoteAndVerifySidebarUpdate();
      
  //     // Delete it and verify sidebar updates
  //     noteWorkflows.deleteNoteAndVerifySidebarUpdate();
      
  //     // Note: App creates new note automatically if none exist, so we might still have a note
  //     // The key is that the original note was deleted (tested in deleteNoteAndVerifySidebarUpdate)
  //   });
  // });

  // context("when user types in a note", () => {
  //   it("should show text updates in sidebar", () => {
  //     noteWorkflows.createNoteAndVerifySidebarUpdate();
      
  //     const testText = "This is my important note content";
  //     noteWorkflows.typeTextAndVerifySidebarUpdate(testText);
      
  //     // Verify persistence
  //     cy.reload();
  //     appState.shouldShowNoteContent(testText);
  //   });
  // });

  // context("when user navigates between notes", () => {
  //   it("should maintain sidebar state consistently", () => {
  //     // Create first note with content
  //     noteWorkflows.createNoteAndVerifySidebarUpdate();
  //     noteWorkflows.typeTextAndVerifySidebarUpdate("First note content");
      
  //     // Store the first note ID for later navigation
  //     cy.url().then(url => {
  //       const firstNoteId = url.split('noteId=')[1];
        
  //       // Create second note with content  
  //       noteWorkflows.createNoteAndVerifySidebarUpdate();
  //       noteWorkflows.typeTextAndVerifySidebarUpdate("Second note content");
        
  //       // Navigate back to first note via sidebar
  //       cy.get(`[data-testid="select-note-button ${firstNoteId}"]`).click();
        
  //       // Wait for navigation and content load
  //       appState.shouldBeOnNoteUrl(firstNoteId);
  //       cy.wait(1000); // Wait for content to load
        
  //       // Should show correct content
  //       appState.shouldShowNoteContent("First note content");
        
  //       // Sidebar should still show both notes
  //       appState.shouldHaveNotesInSidebar(2);
  //     });
  //   });
  // });
});