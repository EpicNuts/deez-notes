import { getUser } from "@/auth/server";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { prisma } from "@/db/prisma";
import { Note } from "@prisma/client";
import Link from "next/link";
import SidebarGroupContent from "./SidebarGroupContent";

async function AppSidebar() {
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
    <Sidebar>
      <SidebarContent className="custom-scrollbar">
        <SidebarGroup />
        {user ? null : (
          <p className="text-center" data-testid="sidebar-unauthenticated-text">
            <Link href="/login" className="underline">
              Login
            </Link>{" "}
            to see your notes
          </p>
        )}

        {/* Search Input and Notes */}
        <div className="flex flex-col gap-2">
          {user && <SidebarGroupContent notes={notes} />}
        </div>

        <SidebarGroup />
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
