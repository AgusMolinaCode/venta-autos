"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  ESTADOS,
  EstadoType,
} from "@/constants";
import { useVehicleStatusDB } from "@/hooks/use-vehicle-status-db";

interface StatusDropdownProps {
  vehicleId: string;
  currentStatus?: EstadoType;
  onStatusChange?: (
    newStatus: EstadoType,
  ) => void;
  className?: string;
}

const STATUS_CONFIG = {
  preparación: {
    label: "Preparación",
    className:
      "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
    color: "yellow",
  },
  publicado: {
    label: "Publicado",
    className:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
    color: "green",
  },
  pausado: {
    label: "Pausado",
    className:
      "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800",
    color: "gray",
  },
  vendido: {
    label: "Vendido",
    className:
      "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    color: "blue",
  },
} as const;

export function StatusDropdown({
  vehicleId,
  currentStatus,
  onStatusChange,
  className,
}: StatusDropdownProps) {
  const {
    updateVehicleStatus,
    isLoading,
  } = useVehicleStatusDB();

  // Usar el estado actual proporcionado o valor por defecto
  const status = currentStatus || "preparación";

  const handleStatusChange = async (
    newStatus: EstadoType,
  ) => {
    if (
      newStatus === status ||
      isLoading
    )
      return;

    try {
      const success =
        await updateVehicleStatus(
          vehicleId,
          newStatus,
        );

      if (success) {
        onStatusChange?.(newStatus);
        toast.success(
          `Estado cambiado a "${STATUS_CONFIG[newStatus].label}"`,
        );
      } else {
        toast.error(
          "Error al cambiar el estado",
        );
      }
    } catch (error) {
      console.error(
        "Error al actualizar estado:",
        error,
      );
      toast.error(
        "Error inesperado al cambiar el estado",
      );
    }
  };

  const currentConfig =
    STATUS_CONFIG[status];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "px-1 py-1 h-auto rounded-full text-xs font-medium border inline-flex items-center gap-1 hover:opacity-80",
            currentConfig.className,
            isLoading && "opacity-50",
            className,
          )}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <>
              {currentConfig.label}
              <ChevronDown className="h-3 w-3" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-40"
      >
        {ESTADOS.map((estado) => {
          const config =
            STATUS_CONFIG[estado];
          const isCurrentStatus =
            estado === status;

          return (
            <DropdownMenuItem
              key={estado}
              onClick={() =>
                handleStatusChange(
                  estado,
                )
              }
              className={cn(
                "cursor-pointer",
                isCurrentStatus &&
                  "bg-muted font-medium",
              )}
              disabled={
                isCurrentStatus ||
                isLoading
              }
            >
              <div
                className={cn(
                  "w-2 h-2 rounded-full mr-2",
                  config.color ===
                    "yellow" &&
                    "bg-yellow-500",
                  config.color ===
                    "green" &&
                    "bg-green-500",
                  config.color ===
                    "gray" &&
                    "bg-gray-500",
                  config.color ===
                    "blue" &&
                    "bg-blue-500",
                )}
              />
              {config.label}
              {isCurrentStatus && (
                <span className="ml-auto text-md font-bold text-muted-foreground">
                  ✓
                </span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
