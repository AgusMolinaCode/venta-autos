import React from "react";
import {
  IconCar,
  IconUserBolt,
} from "@tabler/icons-react";

const mainInfo = () => {
  return (
    <div className="flex gap-2">
      {/* Card 1: Total de Vehículos */}
      <div className="flex flex-col flex-1 rounded-lg bg-zinc-100 p-6 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-900">
        <span className="text-xs text-zinc-400">
          Total de Vehículos
        </span>
        <span className="text-2xl font-bold">
          127
        </span>
        <span className="text-xs text-green-400 mt-1">
          +12% vs mes anterior
        </span>
        <div className="ml-auto mt-2 bg-primary rounded-full p-2 inline-block">
          <IconCar className="h-5 w-5 text-primary-foreground" />
        </div>
      </div>
      {/* Card 2: Consultas Pendientes */}
      <div className="flex flex-col flex-1 rounded-lg bg-zinc-100 p-6 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-900 ">
        <span className="text-xs text-zinc-400">
          Consultas Pendientes
        </span>
        <span className="text-2xl font-bold">
          23
        </span>
        <span className="text-xs text-green-400 mt-1">
          +16% vs mes anterior
        </span>
        <div className="ml-auto mt-2 bg-primary rounded-full p-2 inline-block">
          <IconUserBolt className="h-5 w-5 text-primary-foreground" />
        </div>
      </div>
      {/* Card 3: Ventas del Mes */}
      <div className="flex flex-col flex-1 rounded-lg bg-zinc-100 p-6 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-900 ">
        <span className="text-xs text-zinc-400">
          Ventas del Mes
        </span>
        <span className="text-2xl font-bold">
          18
        </span>
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
      <div className="flex flex-col flex-1 rounded-lg bg-zinc-100 p-6 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-900 ">
        <span className="text-xs text-zinc-400">
          Ingresos del Mes
        </span>
        <span className="text-2xl font-bold">
          $2.8M
        </span>
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
  );
};

export default mainInfo;
