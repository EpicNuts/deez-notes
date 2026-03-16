import type { Metadata } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import NoteProvider from "@/providers/NoteProvider";
import { NotesListProvider } from "@/providers/NotesListProvider";
import { getUser } from "@/auth/server";
import { prisma } from "@/db/prisma";
import { Note } from "@/db/client";

export const metadata: Metadata = {
  title: "Deez Notes",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  let notes: Note[] = [];
  if (user) {
    // Fetch notes for the user
    notes = await prisma.note.findMany({
      where: {
        authorId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NoteProvider>
            <NotesListProvider initialNotes={notes}>
              <SidebarProvider>
                <AppSidebar />
                <div className="flex min-h-screen w-full flex-col">
                  <Header />

                  <main className="flex flex-1 flex-col px-4 pt-10 xl:px-8">
                    {children}
                  </main>
                </div>
              </SidebarProvider>
            </NotesListProvider>

            <Toaster />
          </NoteProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
