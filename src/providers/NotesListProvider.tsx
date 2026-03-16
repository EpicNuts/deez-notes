"use client";

import { Note } from "@/db/client";
import { createContext, useState, useContext, useEffect } from "react";

type NotesListContextType = {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  addNoteLocally: (note: Note) => void;
  deleteNoteLocally: (noteId: string) => void;
};

const NotesListContext = createContext<NotesListContextType>({
  notes: [],
  setNotes: () => {},
  addNoteLocally: () => {},
  deleteNoteLocally: () => {},
});

export function useNotesList() {
  const context = useContext(NotesListContext);
  if (!context) {
    throw new Error("useNotesList must be used within a NotesListProvider");
  }
  return context;
}

type Props = {
  children: React.ReactNode;
  initialNotes: Note[];
};

export function NotesListProvider({ children, initialNotes }: Props) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);

  // Sync provider state when initialNotes changes (after auth state changes)
  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes]);

  const addNoteLocally = (note: Note) => {
    setNotes((prevNotes) => [note, ...prevNotes]);
  };

  const deleteNoteLocally = (noteId: string) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
  };

  return (
    <NotesListContext.Provider
      value={{
        notes,
        setNotes,
        addNoteLocally,
        deleteNoteLocally,
      }}
    >
      {children}
    </NotesListContext.Provider>
  );
}
