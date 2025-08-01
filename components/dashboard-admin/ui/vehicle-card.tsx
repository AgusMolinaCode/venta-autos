"use client";

import { VehiculoConFotos } from "@/lib/supabase";
import { VehicleImage } from "./vehicle-image";
import { StatusBadge } from "./status-badge";
import { PriceDisplay } from "./price-display";
import { VehicleActionsMenu } from "./vehicle-actions-menu";

interface VehicleCardProps {
  vehicle: VehiculoConFotos;
  onEdit: (vehicle: VehiculoConFotos) => void;
  onDelete: (vehicleId: string) => void;
  onViewDetails: (vehicle: VehiculoConFotos) => void;
}

export function VehicleCard({ 
  vehicle, 
  onEdit, 
  onDelete, 
  onViewDetails 
}: VehicleCardProps) {
  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Vehicle Image */}
        <div className="flex-shrink-0">
          <VehicleImage 
            vehicle={vehicle} 
            size="md" 
            className="rounded-md"
          />
        </div>
        
        {/* Vehicle Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                {vehicle.marca} {vehicle.modelo}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {vehicle.ano} • {vehicle.version || "Sin versión"}
              </p>
            </div>
            <StatusBadge vehicleId={vehicle.id} />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <PriceDisplay 
                price={vehicle.precio} 
                currency={vehicle.moneda}
                size="sm"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {vehicle.kilometraje
                  ? `${vehicle.kilometraje.toLocaleString()} km`
                  : "Kilometraje no especificado"}
              </p>
            </div>
            
            <VehicleActionsMenu
              vehicle={vehicle}
              onEdit={onEdit}
              onDelete={onDelete}
              onViewDetails={onViewDetails}
            />
          </div>
        </div>
      </div>
    </div>
  );
}