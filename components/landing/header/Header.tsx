"use client";

import React from "react";
import { UserModeToggle } from "@/components/ui/UserModeToggle";
import { AuthButton } from "@/components/auth/auth-button";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";

interface HeaderProps {
  sidebarContent?: React.ReactNode;
}

// Componente para el ícono del sidebar móvil
const MobileSidebarIcon: React.FC = () => {
  const { open, setOpen } = useSidebar();
  
  return (
    <button
      onClick={() => setOpen(!open)}
      className="p-2 -ml-2 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
      aria-label="Abrir menú"
    >
      <IconMenu2 className="h-6 w-6 text-zinc-800 dark:text-zinc-200" />
    </button>
  );
};

// Componente para el overlay del sidebar móvil
const MobileSidebarOverlay: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { open, setOpen } = useSidebar();
  
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Background Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/20 z-[90] md:hidden"
            onClick={() => setOpen(false)}
          />
          
          {/* Sidebar Modal */}
          <motion.div
            initial={{
              x: "-100%",
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            exit={{
              x: "-100%",
              opacity: 0,
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className="fixed h-full w-80 left-0 top-0 bg-zinc-50/95 dark:bg-zinc-900/95 backdrop-blur-sm p-10 z-[100] flex flex-col justify-between md:hidden shadow-xl"
          >
            <div
              className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200 cursor-pointer"
              onClick={() => setOpen(!open)}
            >
              <IconX />
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Header: React.FC<HeaderProps> = ({ sidebarContent }) => {
  return (
    <SidebarProvider>
      <header className="bg-zinc-100 dark:bg-zinc-800 h-[60px]">
        <div className="container mx-auto px-4 py-4">
          {/* Mobile Layout */}
          <div className="md:hidden flex items-center justify-between">
            <MobileSidebarIcon />
            
            <Link
              href="/"
              className="text-xl font-bold text-zinc-800 dark:text-zinc-200"
            >
              Bs.As Cars
            </Link>

            <div className="flex items-center space-x-2">
              <AuthButton />
              <UserModeToggle />
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex justify-between items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-zinc-800 dark:text-zinc-200"
            >
              Bs.As Cars
            </Link>

            <div className="flex items-center space-x-3">
              <AuthButton />
              <UserModeToggle />
            </div>
          </div>
        </div>
        
        {/* Mobile Sidebar Overlay */}
        <MobileSidebarOverlay>
          {sidebarContent}
        </MobileSidebarOverlay>
      </header>
    </SidebarProvider>
  );
};

export default Header;
