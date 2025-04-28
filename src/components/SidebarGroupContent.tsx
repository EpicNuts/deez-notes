"use client"

import { Note } from "@prisma/client"
import { SidebarGroupContent as SidebarGroupContentShadCN, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"
import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";
import SelectNoteButton from "./SelectNoteButton";
import DeleteNoteButton from "./DeleteNoteButton";

type Props = {
  notes: Note[];
}

function SidebarGroupContent({ notes }: Props) {
  const [searchText, setSearchText] = useState("");
  const [localNotes, setLocalNotes] = useState(notes);

  useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);

  const fuse = useMemo(() => {
    return new Fuse(localNotes, {
      keys: ["text"],
      threshold: .4,
    });
  }, [localNotes]);

  const filteredNotes = searchText 
    ? fuse.search(searchText).map((result) => result.item)
    : localNotes;

  const deleteNoteLocally = (noteId: string) => {
    setLocalNotes((prevNotes) => 
      prevNotes.filter((note) => note.id !== noteId)
  );
  };

  return (
    <SidebarGroupContentShadCN>
      <div className="left-1 w-114/118 relative flex items-center">
        <SearchIcon className="absolute left-2 size-4" />
        <Input
          className="bg-muted pl-8"
          placeholder="Search your notes..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          />
      </div>

      <SidebarMenu className="w-114/118 mt-4"> 
        {filteredNotes.map((note) => (
         <SidebarMenuItem
         key={note.id}
         className="group/item relative transition-all duration-300 hover:h-32 h-16 overflow-hidden bg-muted rounded-lg shadow-md"
       >
         {/* Date Display */}
         <div className="absolute top-2 left-2">
           <p className="text-sm font-medium text-primary">{new Date(note.createdAt).toLocaleDateString()}</p>
         </div>
   
         {/* Note Snippet (Hidden by Default, Visible on Hover) */}
         <div className="absolute inset-x-0 bottom-2 px-4 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
           <p className="text-xs text-muted">{note.text}</p>
         </div>
   
         {/* Delete Button (Visible on Hover) */}
         <div className="absolute top-2 right-2 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
           <DeleteNoteButton
             noteId={note.id}
             deleteNoteLocally={deleteNoteLocally}
           />
         </div>
       </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroupContentShadCN>
  )
}

export default SidebarGroupContent;