"use client";

import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  vehicleId?: string;
  status?: "En Preparación" | "Publicado" | "Pausado" | "Vendido";
  className?: string;
}

const STATUS_CONFIG = {
  "En Preparación": {
    label: "En Preparación",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
  },
  "Publicado": {
    label: "Publicado", 
    className: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
  },
  "Pausado": {
    label: "Pausado",
    className: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800"
  },
  "Vendido": {
    label: "Vendido",
    className: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
  }
} as const;

function getRandomStatus(vehicleId?: string): keyof typeof STATUS_CONFIG {
  if (!vehicleId) return "En Preparación";
  
  const statuses = Object.keys(STATUS_CONFIG) as Array<keyof typeof STATUS_CONFIG>;
  const index = vehicleId.charCodeAt(0) % statuses.length;
  return statuses[index];
}

export function StatusBadge({ vehicleId, status, className }: StatusBadgeProps) {
  const currentStatus = status || getRandomStatus(vehicleId);
  const config = STATUS_CONFIG[currentStatus];

  return (
    <span
      className={cn(
        "px-2 py-1 rounded-full text-xs font-medium border inline-flex items-center",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}