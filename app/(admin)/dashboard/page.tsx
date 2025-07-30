"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconCar,
  IconSettings,
  IconUserBolt,
  IconPlus,
  IconSearch,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { Button } from "@/components/ui/button";
import StepForm from "@/components/dashboard-admin/step-form";
import AddCarModal from "@/components/dashboard-admin/add-car-modal";
import MainInfo from "@/components/dashboard-admin/main/mainInfo";


function Page() {
  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Profile",
      href: "#",
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
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
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
        "h-screen" // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-center"></div>
            <ModeToggle />
            <SidebarLink
              link={{
                label: "Manu Arora",
                href: "#",
                icon: (
                  <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-xs text-white font-bold">
                    MA
                  </div>
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard />
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

// Dummy dashboard component with content
const Dashboard = () => {
  const [isAddCarModalOpen, setIsAddCarModalOpen] = useState(false);
  const [liveVehicleData, setLiveVehicleData] = useState<{
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

  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-zinc-200 bg-slate-50 p-2 md:p-10 dark:border-zinc-700 dark:bg-zinc-900">
        {/* Header con botón para agregar auto */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-200">
            Dashboard de Vehículos
          </h1>
          <div className="flex gap-3">
            <Button
              onClick={() => setIsAddCarModalOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white"
            >
              <IconPlus className="h-4 w-4 mr-2" />
              Agregar Auto
            </Button>
          </div>
        </div>
        <MainInfo />  
          
        <div className="flex flex-1 gap-2">
          <div className="flex-1 rounded-lg bg-slate-100 p-6 border border-zinc-800 dark:bg-zinc-900 dark:border-zinc-900">
            <StepForm />
          </div>
        </div>

        {/* Modal para agregar auto */}
        <AddCarModal
          isOpen={isAddCarModalOpen}
          onClose={() => setIsAddCarModalOpen(false)}
          onSubmit={handleCarSubmit}
        />
      </div>
    </div>
  );
};

export default Page;
