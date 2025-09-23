"use client";

import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { VehiculoConFotos } from "@/lib/supabase";
import { VehicleImage } from "./vehicle-image";
import { StatusDropdown } from "./status-dropdown";
import { PriceDisplay } from "./price-display";
// Vehicle status is now managed through database estado field
import { IconEdit, IconTrash } from "@tabler/icons-react";

interface VehicleTableRowProps {
  vehicle: VehiculoConFotos;
  onEdit: (
    vehicle: VehiculoConFotos,
  ) => void;
  onDelete: (vehicleId: string) => void;
  onViewDetails: (
    vehicle: VehiculoConFotos,
  ) => void;
  onStatusChange?: () => void;
}

export function VehicleTableRow({
  vehicle,
  onEdit,
  onDelete,
  onViewDetails,
  onStatusChange,
}: VehicleTableRowProps) {
  // Use estado from database vehicle object
  const currentStatus = vehicle.estado || "preparación";

  return (
    <TableRow 
      onClick={() => onViewDetails(vehicle)}
      className="cursor-pointer hover:bg-muted/50 transition-colors"
    >
      {/* Foto Principal */}
      <TableCell className="w-20">
        <VehicleImage
          vehicle={vehicle}
          size="sm"
        />
      </TableCell>

      {/* Marca */}
      <TableCell className="font-bold text-md w-32">
        {vehicle.marca}
      </TableCell>

      {/* Modelo */}
      <TableCell className="w-40 font-bold text-md">
        {vehicle.modelo}
      </TableCell>

      {/* Versión */}
      <TableCell className="w-32 font-bold text-md">
        {vehicle.version || "-"}
      </TableCell>

      {/* Año */}
      <TableCell className="text-center w-20 font-bold text-md">
        {vehicle.ano}
      </TableCell>

      {/* Precio */}
      <TableCell className="text-right w-32 font-bold text-md">
        <PriceDisplay
          price={vehicle.precio}
          currency={vehicle.moneda}
          size="sm"
        />
      </TableCell>

      {/* Kilometraje */}
      <TableCell className="text-right w-32 font-bold text-md">
        {vehicle.kilometraje
          ? `${vehicle.kilometraje.toLocaleString()} km`
          : "No especificado"}
      </TableCell>

      {/* Estado */}
      <TableCell 
        className="text-center w-24"
        onClick={(e) => e.stopPropagation()}
      >
        <StatusDropdown
          vehicleId={vehicle.id!}
          currentStatus={currentStatus}
          onStatusChange={
            onStatusChange
          }
        />
      </TableCell>

      {/* Acciones */}
      <TableCell 
        className="w-24 text-right"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-1 justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(vehicle)}
            className="h-8 w-8 p-0 hover:bg-muted"
            title="Editar vehículo"
          >
            <IconEdit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(vehicle.id!)}
            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
            title="Eliminar vehículo"
          >
            <IconTrash className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
