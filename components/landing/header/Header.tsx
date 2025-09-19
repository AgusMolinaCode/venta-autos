"use client";

import React from "react";
import { UserModeToggle } from "@/components/ui/UserModeToggle";
import { AuthButton } from "@/components/auth/auth-button";
import { useAuth } from "@/components/auth/auth-provider";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { useDashboardNavigationSafe } from "@/contexts/dashboard-navigation-context";
import { IconMenu2, IconX, IconBrandTabler, IconCar } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";


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

// Props interface para el Header que incluye callbacks de navegación
interface HeaderProps {
  sidebarContent?: React.ReactNode;
  onDashboardNavigate?: () => void;
  onVehiclesNavigate?: () => void;
}

// Componente para el overlay del sidebar móvil
const MobileSidebarOverlay: React.FC<{ 
  children?: React.ReactNode;
}> = ({ children }) => {
  const { open, setOpen } = useSidebar();
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  // Usar custom hook para obtener dashboard navigation de forma segura
  const dashboardNavigation = useDashboardNavigationSafe();
  
  const handleNavigateToDashboard = () => {
    setOpen(false);
    
    if (pathname === '/dashboard' && dashboardNavigation) {
      // Ya estamos en dashboard, usar context para cambiar vista
      dashboardNavigation.navigateToDashboard();
    } else {
      // Navegar a dashboard desde otra ruta
      router.push('/dashboard');
    }
  };

  const handleNavigateToVehicles = () => {
    setOpen(false);
    
    if (pathname === '/dashboard' && dashboardNavigation) {
      // Ya estamos en dashboard, usar context para cambiar vista
      dashboardNavigation.navigateToVehicles();
    } else {
      // Navegar a dashboard con vista de vehículos
      router.push('/dashboard?view=vehicles');
    }
  };
  
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
            className="fixed h-full w-80 left-0 top-0 bg-zinc-50/95 dark:bg-zinc-900/95 backdrop-blur-sm p-10 z-[100] flex flex-col md:hidden shadow-xl"
          >
            <div
              className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200 cursor-pointer"
              onClick={() => setOpen(!open)}
            >
              <IconX />
            </div>
            
            {/* Navigation Content */}
            <div className="flex flex-col h-full">
              {/* Logo/Brand */}
              <div className="mb-8">
                <Link
                  href="/"
                  className="text-2xl font-bold text-zinc-800 dark:text-zinc-200"
                  onClick={() => setOpen(false)}
                >
                  Bs.As Cars
                </Link>
              </div>

              {/* Navigation Menu - Solo para usuarios autenticados */}
              {user && (
                <nav className="flex-1">
                  <div className="space-y-4">
                    <button
                      onClick={handleNavigateToDashboard}
                      className="flex items-center w-full p-3 text-left rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <IconBrandTabler className="h-5 w-5 mr-3 text-zinc-600 dark:text-zinc-400" />
                      <span className="text-zinc-800 dark:text-zinc-200 font-medium">
                        Dashboard
                      </span>
                    </button>

                    <button
                      onClick={handleNavigateToVehicles}
                      className="flex items-center w-full p-3 text-left rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <IconCar className="h-5 w-5 mr-3 text-zinc-600 dark:text-zinc-400" />
                      <span className="text-zinc-800 dark:text-zinc-200 font-medium">
                        Listado de Autos
                      </span>
                    </button>
                  </div>
                </nav>
              )}

              {/* User Info at Bottom */}
              {user && (
                <div className="mt-auto pt-4 border-t border-zinc-200 dark:border-zinc-700">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-sm text-white font-semibold mr-3">
                      {user.email?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                        {user.email}
                      </p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">
                        Usuario autenticado
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Custom Content */}
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Header: React.FC<HeaderProps> = ({ sidebarContent }) => {
  const pathname = usePathname();
  const isDashboardRoute = pathname === '/dashboard';
  
  return (
    <SidebarProvider>
      <header className=" dark:bg-neutral-900 bg-gray-50 h-[60px]">
        <div className="container mx-auto px-4 py-4">
          {/* Mobile Layout */}
          <div className="md:hidden flex items-center justify-between">
            {/* Solo mostrar ícono del sidebar en ruta /dashboard */}
            {isDashboardRoute && <MobileSidebarIcon />}
            
            <Link
              href="/"
              className={`font-bold text-zinc-800 dark:text-zinc-200 ${
                isDashboardRoute ? 'text-xl' : 'text-xl'
              }`}
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
        
        {/* Mobile Sidebar Overlay - Solo en ruta /dashboard */}
        {isDashboardRoute && (
          <MobileSidebarOverlay>
            {sidebarContent}
          </MobileSidebarOverlay>
        )}
      </header>
    </SidebarProvider>
  );
};

export default Header;
