'use client'

import { Note } from "@prisma/client"

type Props = {
  note: Note; 
};

function SelectNoteButton({ note }: Props) {
  return <div>SelectNoteButton</div>
}

export default SelectNoteButton