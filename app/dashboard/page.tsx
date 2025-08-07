"use client";
import React, { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "@/components/ui/sidebar";
import { useAuth } from "@/components/auth/auth-provider";
import { useRouter } from "next/navigation";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ui/ModeToggle";
import StepForm from "@/components/dashboard-admin/main/step-form";
import AddCarModal from "@/components/dashboard-admin/add-car-modal";
import MainInfo from "@/components/dashboard-admin/main/mainInfo";

function Page() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [open, setOpen] =
    useState(false);
  const [activeView, setActiveView] =
    useState<"dashboard" | "vehicles">(
      "dashboard",
    );

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      onClick: () =>
        setActiveView("dashboard"),
      isActive:
        activeView === "dashboard",
    },
    {
      label: "Listado de Autos",
      href: "#",
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      onClick: () =>
        setActiveView("vehicles"),
      isActive:
        activeView === "vehicles",
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      onClick: async () => {
        await signOut();
        router.push('/');
      },
    },
  ];
  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
        "h-screen", // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      <Sidebar
        open={open}
        setOpen={setOpen}
      >
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? (
              <Logo />
            ) : (
              <LogoIcon />
            )}
            <div className="mt-8 flex flex-col gap-2">
              {links.map(
                (link, idx) => (
                  <SidebarLink
                    key={idx}
                    link={link}
                  />
                ),
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-center">
              {" "}
            </div>
            <ModeToggle />
            <SidebarLink
              link={{
                label: user?.email || "Usuario",
                href: "#",
                icon: (
                  <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-xs text-white font-bold">
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard
        activeView={activeView}
      />
    </div>
  );
}
const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        Acet Labs
      </motion.span>
    </a>
  );
};
const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </a>
  );
};

// Dashboard component with conditional content
const Dashboard = ({
  activeView,
}: {
  activeView: "dashboard" | "vehicles";
}) => {
  const [
    isAddCarModalOpen,
    setIsAddCarModalOpen,
  ] = useState(false);
  const [
    liveVehicleData,
    setLiveVehicleData,
  ] = useState<{
    marca?: string;
    modelo?: string;
    ano?: number;
  } | null>(null);

  const handleCarSubmit = (formData: {
    marca: string;
    modelo: string;
    ano: number;
    kilometraje?: number;
    version?: string;
    combustible?: string;
    transmision?: string;
    color?: string;
    descripcion?: string;
    precio?: number;
    moneda?: "ARS" | "USD";
  }) => {
    // Aquí puedes manejar el envío de datos (API, base de datos, etc.)
  };

  const getPageTitle = () => {
    switch (activeView) {
      case "dashboard":
        return "Dashboard de Vehículos";
      case "vehicles":
        return "Listado de Vehículos";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-zinc-200 bg-slate-50 p-2 md:p-10 dark:border-zinc-700 dark:bg-zinc-900">
        {/* Header dinámico */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-200">
            {getPageTitle()}
          </h1>
        </div>

        {/* Contenido condicional basado en la vista activa */}
        {activeView === "dashboard" && (
          <MainInfo />
        )}

        {activeView === "vehicles" && (
          <div className="flex flex-1 gap-2">
            <div className="flex-1 rounded-lg bg-zinc-100 p-6 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-900">
              <StepForm />
            </div>
          </div>
        )}

        {/* Modal para agregar auto */}
        <AddCarModal
          isOpen={isAddCarModalOpen}
          onClose={() =>
            setIsAddCarModalOpen(false)
          }
          onSubmit={handleCarSubmit}
        />
      </div>
    </div>
  );
};

export default Page;
