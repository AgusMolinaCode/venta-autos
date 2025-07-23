"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconCar,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import VehicleModal from "@/components/dashboard-admin/vehicle-modal";
import { ModeToggle } from "@/components/ui/ModeToggle";

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
            <div className="flex justify-center">
            </div>
            <ModeToggle />
            <SidebarLink
              link={{
                label: "Manu Arora",
                href: "#",
                icon: (
                  <img
                  src="https://assets.aceternity.com/manu.png"
                  className="h-7 w-7 shrink-0 rounded-full"
                  width={50}
                  height={50}
                  alt="Avatar"
                  />
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
export const Logo = () => {
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
export const LogoIcon = () => {
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
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-zinc-200 bg-slate-50 p-2 md:p-10 dark:border-zinc-700 dark:bg-slate-900">
        <div className="flex gap-2">
          {/* Card 1: Total de Vehículos */}
          <div className="flex flex-col flex-1 rounded-lg bg-zinc-800 p-4 text-white border border-zinc-600">
            <span className="text-xs text-zinc-400">Total de Vehículos</span>
            <span className="text-2xl font-bold">127</span>
            <span className="text-xs text-green-400 mt-1">
              +12% vs mes anterior
            </span>
            <div className="ml-auto mt-2 bg-primary rounded-full p-2 inline-block">
              <IconCar className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
          {/* Card 2: Consultas Pendientes */}
          <div className="flex flex-col flex-1 rounded-lg bg-zinc-800 p-4 text-white border border-zinc-600">
            <span className="text-xs text-zinc-400">Consultas Pendientes</span>
            <span className="text-2xl font-bold">23</span>
            <span className="text-xs text-green-400 mt-1">
              +16% vs mes anterior
            </span>
            <div className="ml-auto mt-2 bg-primary rounded-full p-2 inline-block">
              <IconUserBolt className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
          {/* Card 3: Ventas del Mes */}
          <div className="flex flex-col flex-1 rounded-lg bg-zinc-800 p-4 text-white border border-zinc-600">
            <span className="text-xs text-zinc-400">Ventas del Mes</span>
            <span className="text-2xl font-bold">18</span>
            <span className="text-xs text-green-400 mt-1">
              +28% vs mes anterior
            </span>
            <div className="ml-auto mt-2 bg-primary rounded-full p-2 inline-block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-primary-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 17l6-6 4 4 8-8"
                />
              </svg>
            </div>
          </div>
          {/* Card 4: Ingresos del Mes */}
          <div className="flex flex-col flex-1 rounded-lg bg-zinc-800 p-4 text-white border border-zinc-600">
            <span className="text-xs text-zinc-400">Ingresos del Mes</span>
            <span className="text-2xl font-bold">$2.8M</span>
            <span className="text-xs text-green-400 mt-1">
              +15% vs mes anterior
            </span>
            <div className="ml-auto mt-2 bg-primary rounded-full p-2 inline-block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-primary-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 10c-4.41 0-8-1.79-8-4V6c0-2.21 3.59-4 8-4s8 1.79 8 4v8c0 2.21-3.59 4-8 4z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex flex-1 gap-2">
          <div className="flex-1 rounded-lg bg-slate-100 p-6 border border-zinc-200 dark:bg-slate-800 dark:border-zinc-700">
            <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
              Agregar Vehículo
            </h2>
            <VehicleModal />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
