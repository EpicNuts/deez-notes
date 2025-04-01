'use client'

import { User } from "@supabase/supabase-js";

type Props = {
  user: User | null;
}

function NewNoteButton({ user }: Props) {
  console.log(user?.email)
  return (
    <div>NewNoteButton</div>
  )
}

export default NewNoteButton