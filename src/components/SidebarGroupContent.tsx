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
  const [isSearchExpanded, setIsSearchExpanded] = useState(false); // state to track the search box
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

  const handleSearchIconClick = () => {
    if (isSearchExpanded) {
      setSearchText("");
    }
    setIsSearchExpanded((prev) => !prev);
  };

  return (
    <SidebarGroupContentShadCN>
       {/* Header and Search Input */}
       <div className="relative">
        {/* Header Text */}
        <h2
          className={`
            absolute 
            left-2 
            text-lg 
            font-bold 
            transition-all 
            duration-400 
            ${isSearchExpanded 
              ? "top-0 -translate-y-2" 
              : "top-8 translate-y-0"
          }`}
        >
          Your Notes
        </h2>

        {/* Search Input */}
        <div
          className={`
            absolute 
            right-1 
            transition-all 
            duration-500 
            ${isSearchExpanded 
              ? "top-8 w-114/118" 
              : "top-8 w-10"
          }`}
        >
          <div className="relative">
            <Input
              className={`bg-muted transition-all duration-500 transform ${
                isSearchExpanded ? "pl-4 w-full" : "w-10"
              }`}
              style={{
                transformOrigin: "left",
                position: "absolute",
                right: 0,
              }}
              placeholder={isSearchExpanded ? "Search your notes..." : ""}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              disabled={!isSearchExpanded}
            />
            <SearchIcon
              className="
                absolute 
                right-2.5
                top-4 
                transform 
                -translate-y-1/2 
                cursor-pointer
                size-5
              "
              onClick={handleSearchIconClick} // handle click
            />
          </div>
        </div>
      </div>


      {/* Notes List */}
      <SidebarMenu className="w-114/118 mt-20"> 
        {filteredNotes.map((note) => (
          <SidebarMenuItem key={note.id} className="group/item left-1">
            <SelectNoteButton note={note} />
            <DeleteNoteButton 
              noteId={note.id} 
              deleteNoteLocally={deleteNoteLocally}
            />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroupContentShadCN>
  )
}

export default SidebarGroupContent;