'use server'

import { getUser } from "@/auth/server";
import { prisma } from "@/db/prisma";
import { handleError } from "@/lib/utils";
import openai from "@/openai";
import { ChatCompletionMessageParam, Completions } from "openai/resources/index.mjs";

export const createNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to create a note");
 
    await prisma.note.create({
      data: { 
        id: noteId,
        authorId: user.id,
        text: "",
      },
    });

    return { errorMessage: null }
  } catch (error) {
    return handleError(error)
  }
};

export const updateNoteAction = async (noteId: string, text: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to update a note");
 
    await prisma.note.update({
      where: { id: noteId },
      data: { text },
    });

    return { errorMessage: null }
  } catch (error) {
    return handleError(error)
  }
};

export const deleteNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to delete a note");
 
    await prisma.note.delete({
      where: { id: noteId, authorId: user.id }
    });

    return { errorMessage: null }
  } catch (error) {
    return handleError(error)
  }
};

export const askAIAboutNotesAction = async (
  newQuestions: string[], 
  responses: string[]
) => {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to query our robots");
 
    const notes = await prisma.note.findMany({
      where: {authorId: user.id},
      orderBy: { createdAt: "desc" },
      select: {text: true, createdAt: true, updatedAt: true },
    });

    if (notes.length === 0) {
      return "You haven't written any notes yet."
    }

    const formattedNotes = notes
      .map((note) =>
      `
      Text: ${note.text}
      Created at: ${note.createdAt}
      Last updated: ${note.updatedAt}
      `.trim(),
    )
    .join("\n");

    const messages: ChatCompletionMessageParam[] = [
      {
        role: "developer",
        content: `
        You are a helpful assistant that answers questions about the notes written by the user.
        
        Here are the user's notes:
        ${formattedNotes}
        `,
      },
    ];

    for (let i=0; i < newQuestions.length; i++) {
      messages.push({ role: "user", content: newQuestions[i] });
      if (responses.length > i) {
        messages.push({ role: "assistant", content: responses[i] });
      }
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages
    })

    return completion.choices[0].message.content || "A problem has occurred";
  }
