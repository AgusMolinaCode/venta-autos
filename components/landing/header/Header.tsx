import React from "react";
import { UserModeToggle } from "@/components/ui/UserModeToggle";
import { AuthButton } from "@/components/auth/auth-button";
import Link from "next/link";

const Header: React.FC = () => {
  return (
    <header className="bg-zinc-100 dark:bg-zinc-800 h-[60px]">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold text-zinc-800 dark:text-zinc-200"
        >
          Bs.As Car
        </Link>

        <div className="flex items-center space-x-3">
          <AuthButton />
          <UserModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
