"use client";

import { IconCar } from "@tabler/icons-react";
import { VehiculoConFotos } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface VehicleImageProps {
  vehicle: VehiculoConFotos;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showFallback?: boolean;
}

const sizeClasses = {
  sm: "w-10 h-10",
  md: "w-16 h-16", 
  lg: "w-24 h-24",
  xl: "w-32 h-32"
};

const iconSizes = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8", 
  xl: "h-10 w-10"
};

export function VehicleImage({ 
  vehicle, 
  size = "md", 
  className,
  showFallback = true 
}: VehicleImageProps) {
  const primaryPhoto = vehicle.fotos?.find(foto => foto.is_primary) || vehicle.fotos?.[0];
  const photoUrl = primaryPhoto 
    ? `/api/storage/image?path=${primaryPhoto.storage_path}`
    : null;

  return (
    <div className={cn(
      sizeClasses[size],
      "rounded-md overflow-hidden bg-muted flex items-center justify-center",
      className
    )}>
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={`${vehicle.marca} ${vehicle.modelo}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : showFallback ? (
        <IconCar className={cn(iconSizes[size], "text-muted-foreground")} />
      ) : null}
    </div>
  );
}