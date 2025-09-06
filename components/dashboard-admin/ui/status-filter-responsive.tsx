"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ESTADOS,
  EstadoType,
} from "@/constants";

interface StatusFilterResponsiveProps {
  activeFilter: EstadoType | "all";
  onFilterChange: (filter: EstadoType | "all") => void;
  className?: string;
}

const STATUS_CONFIG = {
  "all": {
    label: "Todos",
    className: "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800",
    activeClassName: "bg-slate-200 text-slate-900 border-slate-300 dark:bg-slate-800/30 dark:text-slate-300 dark:border-slate-700"
  },
  "preparación": {
    label: "Preparación",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
    activeClassName: "bg-yellow-200 text-yellow-900 border-yellow-300 dark:bg-yellow-800/30 dark:text-yellow-300 dark:border-yellow-700"
  },
  "publicado": {
    label: "Publicado",
    className: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
    activeClassName: "bg-green-200 text-green-900 border-green-300 dark:bg-green-800/30 dark:text-green-300 dark:border-green-700"
  },
  "pausado": {
    label: "Pausado",
    className: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800",
    activeClassName: "bg-gray-200 text-gray-900 border-gray-300 dark:bg-gray-800/30 dark:text-gray-300 dark:border-gray-700"
  },
  "vendido": {
    label: "Vendido",
    className: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    activeClassName: "bg-blue-200 text-blue-900 border-blue-300 dark:bg-blue-800/30 dark:text-blue-300 dark:border-blue-700"
  }
} as const;

export function StatusFilterResponsive({
  activeFilter,
  onFilterChange,
  className,
}: StatusFilterResponsiveProps) {
  const activeConfig = STATUS_CONFIG[activeFilter];

  return (
    <>
      {/* Desktop: Button Layout (hidden on small screens) */}
      <div
        className={cn(
          "hidden md:flex gap-2 flex-wrap",
          className,
        )}
      >
        {/* Botón "Todos" */}
        {(() => {
          const config = STATUS_CONFIG["all"];
          const isActive = activeFilter === "all";
          
          return (
            <Button
              key="all"
              variant="ghost"
              size="sm"
              onClick={() => onFilterChange("all")}
              className={cn(
                "px-2 py-1 h-auto rounded-full text-xs font-medium border inline-flex items-center gap-1 hover:opacity-80 transition-all duration-200",
                isActive ? config.activeClassName : config.className
              )}
            >
              {config.label}
            </Button>
          );
        })()}

        {/* Botones de estados específicos */}
        {ESTADOS.map((estado) => {
          const config = STATUS_CONFIG[estado];
          const isActive = activeFilter === estado;

          return (
            <Button
              key={estado}
              variant="ghost"
              size="sm"
              onClick={() => onFilterChange(estado)}
              className={cn(
                "px-2 py-1 h-auto rounded-full text-xs font-medium border inline-flex items-center gap-1 hover:opacity-80 transition-all duration-200",
                isActive ? config.activeClassName : config.className
              )}
            >
              {config.label}
            </Button>
          );
        })}
      </div>

      {/* Mobile: Dropdown Layout (visible only on small screens) */}
      <div className={cn("md:hidden", className)}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "px-3 py-2 h-auto rounded-full text-sm font-medium border inline-flex items-center gap-2 hover:opacity-80 transition-all duration-200",
                activeConfig.activeClassName
              )}
            >
              {activeConfig.label}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {/* Opción "Todos" */}
            <DropdownMenuItem
              onClick={() => onFilterChange("all")}
              className={cn(
                "cursor-pointer flex items-center gap-2",
                activeFilter === "all" && "bg-muted font-medium"
              )}
            >
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  "bg-slate-500"
                )}
              />
              Todos
              {activeFilter === "all" && (
                <span className="ml-auto text-sm">✓</span>
              )}
            </DropdownMenuItem>

            {/* Opciones de estados específicos */}
            {ESTADOS.map((estado) => {
              const config = STATUS_CONFIG[estado];
              const isActive = activeFilter === estado;

              return (
                <DropdownMenuItem
                  key={estado}
                  onClick={() => onFilterChange(estado)}
                  className={cn(
                    "cursor-pointer flex items-center gap-2",
                    isActive && "bg-muted font-medium"
                  )}
                >
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      estado === "preparación" && "bg-yellow-500",
                      estado === "publicado" && "bg-green-500",
                      estado === "pausado" && "bg-gray-500",
                      estado === "vendido" && "bg-blue-500"
                    )}
                  />
                  {config.label}
                  {isActive && (
                    <span className="ml-auto text-sm">✓</span>
                  )}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}