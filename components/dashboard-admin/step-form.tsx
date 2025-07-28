"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { IconCar } from "@tabler/icons-react";

interface StepFormProps {
  onClick?: () => void;
  disabled?: boolean;
}

/**
 * Componente simplificado que actúa como trigger para el modal principal
 * @deprecated - Usar AddCarModal directamente en su lugar
 */
const StepForm = ({ onClick, disabled }: StepFormProps) => {
  return (
    <Button 
      className="flex items-center gap-2" 
      onClick={onClick}
      disabled={disabled}
    >
      <IconCar className="h-5 w-5" />
      Agregar Vehículo
    </Button>
  );
};

export default StepForm;
