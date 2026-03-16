import { getUser } from "@/auth/server";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import Link from "next/link";
import SidebarGroupContent from "./SidebarGroupContent";

async function AppSidebar() {
  const user = await getUser();

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
          {user && <SidebarGroupContent />}
        </div>

        <SidebarGroup />
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
