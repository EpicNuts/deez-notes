'use client'


import useNote from "@/hooks/useNote";
import { Note } from "@prisma/client"
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SidebarMenuButton } from "./ui/sidebar";
import Link from "next/link";

type Props = {
  note: Note; 
};

function SelectNoteButton({ note }: Props) {
  const noteId = useSearchParams().get("noteId") || "";

  const { noteText: selectedNoteText } = useNote();
  const [shouldUseGlobalNoteText, setShouldUseGlobalNoteText] = useState(false);
  const [localNoteText, setLocalNoteText] = useState(note.text);
  
   useEffect(() => {
    if (noteId === note.id) {
      setShouldUseGlobalNoteText(true);
    } else {
      setShouldUseGlobalNoteText(false);
    }
  }, [noteId, note.id]);

  useEffect(() => {
    if (shouldUseGlobalNoteText) {
      setLocalNoteText(selectedNoteText);
    }
  }, [selectedNoteText, shouldUseGlobalNoteText]);

  // Determine what text to display
  const blankNoteText = "EMPTY NOTE";
  const isEmptyNote = !localNoteText && !shouldUseGlobalNoteText;
  const noteText = isEmptyNote
      ? blankNoteText 
      : localNoteText || blankNoteText;


  // Format the timestamp
  const formattedTime = new Date(note.updatedAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <SidebarMenuButton 
      asChild
      className={`items-start gap-0 pr-12 ${
        note.id === noteId && "bg-sidebar-accent/50"
      }`}
    >
      <Link href={`/?noteId=${note.id}`} className="flex h-fit flex-col">
        {/* Display Date and Time */}
        <p className="text-muted-foreground/70 text-xs">
        <span>{new Date(note.updatedAt).toLocaleDateString()}  |  </span>
          <span className="text-muted-foreground/50 text-[0.65rem]">
            {formattedTime}
          </span>
        </p>

        {/* Note Text */}
        <p 
          className={`
            mt-2 
            px-4 
            ${
              isEmptyNote
                ? "opacity-30 group-hover/item:opacity-100"
                  : note.id === noteId
                  ? "opacity-100"
                  : "opacity-0"
            }
            group-hover/item:opacity-100 
            transition-opacity 
            duration-1000 
            ease-out 
            w-full 
            overflow-hidden 
            truncate 
            text-ellipsis 
            whitespace-nowrap 
            group-hover/item:duration-200 
            group-hover/item:ease-in
          `}
        >
          {noteText.length > 100 ? `${noteText.slice(0, 100)}...` : noteText}
        </p>
      </Link>
    </SidebarMenuButton> 
  )
}

export default SelectNoteButton