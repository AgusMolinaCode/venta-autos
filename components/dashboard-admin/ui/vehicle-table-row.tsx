"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { VehiculoConFotos } from "@/lib/supabase";
import { VehicleImage } from "./vehicle-image";
import { StatusBadge } from "./status-badge";
import { PriceDisplay } from "./price-display";
import { VehicleActionsMenu } from "./vehicle-actions-menu";

interface VehicleTableRowProps {
  vehicle: VehiculoConFotos;
  onEdit: (vehicle: VehiculoConFotos) => void;
  onDelete: (vehicleId: string) => void;
  onViewDetails: (vehicle: VehiculoConFotos) => void;
}

export function VehicleTableRow({
  vehicle,
  onEdit,
  onDelete,
  onViewDetails,
}: VehicleTableRowProps) {
  return (
    <TableRow>
      {/* Foto Principal */}
      <TableCell className="w-20">
        <VehicleImage vehicle={vehicle} size="sm" />
      </TableCell>

      {/* Marca */}
      <TableCell className="font-medium w-32">
        {vehicle.marca}
      </TableCell>

      {/* Modelo */}
      <TableCell className="w-40">
        {vehicle.modelo}
      </TableCell>

      {/* Versión */}
      <TableCell className="w-32">
        {vehicle.version || "-"}
      </TableCell>

      {/* Año */}
      <TableCell className="text-center w-20">
        {vehicle.ano}
      </TableCell>

      {/* Precio */}
      <TableCell className="text-right w-32">
        <PriceDisplay 
          price={vehicle.precio} 
          currency={vehicle.moneda}
          size="sm"
        />
      </TableCell>

      {/* Kilometraje */}
      <TableCell className="text-right w-32">
        {vehicle.kilometraje
          ? `${vehicle.kilometraje.toLocaleString()} km`
          : "No especificado"}
      </TableCell>

      {/* Estado */}
      <TableCell className="text-center w-24">
        <StatusBadge vehicleId={vehicle.id} />
      </TableCell>

      {/* Acciones */}
      <TableCell className="w-16 text-right">
        <VehicleActionsMenu
          vehicle={vehicle}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewDetails={onViewDetails}
          size="sm"
        />
      </TableCell>
    </TableRow>
  );
}