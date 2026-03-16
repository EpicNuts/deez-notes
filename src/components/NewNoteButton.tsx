"use client";

import { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { createNoteAction } from "@/actions/notes";
import { useNotesList } from "@/providers/NotesListProvider";

type Props = {
  user: User | null;
};

function NewNoteButton({ user }: Props) {
  const router = useRouter();
  const { addNoteLocally } = useNotesList();

  const [loading, setLoading] = useState(false);

  const handleClickNewNoteButton = async () => {
    if (!user) {
      router.push("/login");
    } else {
      setLoading(true);

      const uuid = uuidv4();
      
      // Create the note locally first (instant UI update)
      const newNote = {
        id: uuid,
        authorId: user.id,
        text: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      addNoteLocally(newNote);

      // Navigate to the new note immediately
      router.push(`/?noteId=${uuid}`);

      // Then create it on the server in background
      createNoteAction(uuid);

      toast.success("New note created");

      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClickNewNoteButton}
      variant="secondary"
      className="w-24"
      disabled={loading}
      data-testid="new-note-button"
    >
      {loading ? <Loader2 className="animate-spin" /> : "New Note"}
    </Button>
  );
}

export default NewNoteButton;
