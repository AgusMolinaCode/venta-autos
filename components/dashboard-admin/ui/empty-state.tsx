"use client";

import { Button } from "@/components/ui/button";
import { IconCar, IconPlus } from "@tabler/icons-react";

interface EmptyStateProps {
  onAddVehicle: () => void;
  title?: string;
  description?: string;
  buttonText?: string;
}

export function EmptyState({
  onAddVehicle,
  title = "No hay vehículos registrados",
  description = "Comienza agregando tu primer vehículo al sistema. Podrás gestionar toda la información y fotos desde aquí.",
  buttonText = "Agregar primer vehículo"
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="rounded-full bg-muted p-6 mb-4">
        <IconCar className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground text-center mb-6 max-w-md">
        {description}
      </p>
      <Button
        onClick={onAddVehicle}
        className="flex items-center gap-2"
      >
        <IconPlus className="h-4 w-4" />
        {buttonText}
      </Button>
    </div>
  );
}