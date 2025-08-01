"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDots, IconEdit, IconEye, IconTrash } from "@tabler/icons-react";
import { VehiculoConFotos } from "@/lib/supabase";

interface VehicleActionsMenuProps {
  vehicle: VehiculoConFotos;
  onEdit: (vehicle: VehiculoConFotos) => void;
  onDelete: (vehicleId: string) => void;
  onViewDetails: (vehicle: VehiculoConFotos) => void;
  size?: "sm" | "md";
}

export function VehicleActionsMenu({
  vehicle,
  onEdit,
  onDelete,
  onViewDetails,
  size = "md"
}: VehicleActionsMenuProps) {
  const buttonSize = size === "sm" ? "sm" : "sm";
  const iconSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={buttonSize}
          className="h-8 w-8 p-0 hover:bg-muted"
        >
          <IconDots className={iconSize} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => onViewDetails(vehicle)}>
          <IconEye className="h-4 w-4 mr-2" />
          Ver detalle
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(vehicle)}>
          <IconEdit className="h-4 w-4 mr-2" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete(vehicle.id!)}
          className="text-destructive focus:text-destructive"
        >
          <IconTrash className="h-4 w-4 mr-2" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}