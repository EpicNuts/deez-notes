import { shadow } from "@/styles/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import DarkModeToggle from "./DarkModeToggle";
import LogoutButton from "./LogoutButton";
import { getUser } from "@/auth/server";
import { SidebarTrigger } from "./ui/sidebar";

async function Header() {
  const user = await getUser();

  return (
    <header
      className="bg-popover bg-popover relative flex h-24 w-full items-center justify-between px-3 sm:px-8"
      style={{
        boxShadow: shadow,
      }}
      data-testid="header"
    >
      <SidebarTrigger
        className="absolute top-1 left-1"
        data-testid="sidebar-trigger"
      />
      <Link className="flex items-end gap-2" href="/" data-testid="logo-link">
        <Image
          src="/Walnut.svg"
          height={60}
          width={60}
          alt="logo"
          className="rounded-full"
          data-testid="logo"
          priority
        />
        <h1
          className="flex flex-col pb-1 text-2xl leading-6 font-semibold"
          data-testid="logo-text"
        >
          DEEZ <span>Notes</span>
        </h1>
      </Link>

      <div className="flex gap-4">
        {user ? (
          <LogoutButton />
        ) : (
          <>
            <Button data-testid="signup-button" asChild>
              <Link href="/sign-up" className="hidden sm:block">
                Sign Up
              </Link>
            </Button>
            <Button data-testid="login-button" asChild variant="outline">
              <Link href="/login">Login</Link>
            </Button>
          </>
        )}

        <Button data-testid="faq-button" asChild variant="outline">
          <Link href="/faq">FAQ</Link>
        </Button>

        <DarkModeToggle />
      </div>
    </header>
  );
}

export default Header;
