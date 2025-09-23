"use client";

import { VehiculoConFotos } from "@/lib/supabase";
import { VehicleImage } from "./vehicle-image";
import { StatusDropdown } from "./status-dropdown";
import { PriceDisplay } from "./price-display";
import { VehicleActionsMenu } from "./vehicle-actions-menu";
// Vehicle status is now managed through database estado field

interface VehicleCardProps {
  vehicle: VehiculoConFotos;
  onEdit: (vehicle: VehiculoConFotos) => void;
  onDelete: (vehicleId: string) => void;
  onViewDetails: (vehicle: VehiculoConFotos) => void;
  onStatusChange?: () => void;
}

export function VehicleCard({ 
  vehicle, 
  onEdit, 
  onDelete, 
  onViewDetails,
  onStatusChange
}: VehicleCardProps) {
  // Use estado from database vehicle object
  const currentStatus = vehicle.estado || "preparación";
  
  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 p-4 hover:shadow-md transition-shadow min-h-[320px] h-fit flex flex-col">
      {/* Vehicle Image */}
      <div className="w-full mb-4 flex-shrink-0">
        <VehicleImage 
          vehicle={vehicle} 
          size="lg" 
          className="rounded-md w-full h-40 object-cover"
        />
      </div>
      
      {/* Vehicle Info */}
      <div className="space-y-3 flex-1 flex flex-col">
        {/* Header with Status */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
              {vehicle.marca} {vehicle.modelo}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
              {vehicle.ano} • {vehicle.version || "Sin versión"}
            </p>
          </div>
          <StatusDropdown
            vehicleId={vehicle.id!}
            currentStatus={currentStatus}
            onStatusChange={onStatusChange}
          />
        </div>
        
        {/* Price and Details */}
        <div className="space-y-2 flex-1">
          <PriceDisplay 
            price={vehicle.precio} 
            currency={vehicle.moneda}
            size="sm"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {vehicle.kilometraje
              ? `${vehicle.kilometraje.toLocaleString()} km`
              : "Sin especificar"}
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex justify-end pt-3 mt-auto border-t border-gray-100 dark:border-zinc-700">
          <VehicleActionsMenu
            vehicle={vehicle}
            onEdit={onEdit}
            onDelete={onDelete}
            onViewDetails={onViewDetails}
          />
        </div>
      </div>
    </div>
  );
}