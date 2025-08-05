"use client";

import {
  IconCar,
  IconCalendar,
  IconGasStation,
  IconSettings,
  IconPalette,
  IconBrandToyota,
  IconListDetails,
  IconSpeedboat,
} from "@tabler/icons-react";
import { formatKilometraje } from "@/utils/formatters";
import { VehicleDetailsGridProps, VehicleField, VehicleFieldLabel } from "@/utils/interfaces";

export function VehicleDetailsGrid({ vehicle }: VehicleDetailsGridProps) {
  const getFieldIcon = (label: VehicleFieldLabel) => {
    switch (label) {
      case "Marca":
        return <IconBrandToyota className="h-4 w-4" />;
      case "Modelo":
        return <IconCar className="h-4 w-4" />;
      case "Año":
        return <IconCalendar className="h-4 w-4" />;
      case "Kilometraje":
        return <IconSpeedboat className="h-4 w-4" />;
      case "Versión":
        return <IconListDetails className="h-4 w-4" />;
      case "Combustible":
        return <IconGasStation className="h-4 w-4" />;
      case "Transmisión":
        return <IconSettings className="h-4 w-4" />;
      case "Color":
        return <IconPalette className="h-4 w-4" />;
      default:
        return <IconCar className="h-4 w-4" />;
    }
  };

  const formatFieldValue = (
    value: string | number | null | undefined,
  ): string => {
    if (value === null || value === undefined || value === "") {
      return "-";
    }
    return String(value);
  };

  const fields: VehicleField[] = [
    {
      label: "Marca",
      value: formatFieldValue(vehicle.marca),
    },
    {
      label: "Modelo",
      value: formatFieldValue(vehicle.modelo),
    },
    {
      label: "Año",
      value: formatFieldValue(vehicle.ano),
    },
    {
      label: "Kilometraje",
      value: vehicle.kilometraje ? formatKilometraje(vehicle.kilometraje) : "-",
    },
    {
      label: "Versión",
      value: formatFieldValue(vehicle.version),
    },
    {
      label: "Combustible",
      value: formatFieldValue(vehicle.combustible),
    },
    {
      label: "Transmisión",
      value: formatFieldValue(vehicle.transmision),
    },
    {
      label: "Color",
      value: formatFieldValue(vehicle.color),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {fields.map((field, index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/50"
        >
          <div className="p-1.5 bg-muted rounded-md text-muted-foreground">
            {getFieldIcon(field.label)}
          </div>
          <div className="flex-1 min-w-0">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {field.label}
            </label>
            <p
              className={`text-sm font-medium truncate ${
                field.value === "-"
                  ? "text-muted-foreground italic"
                  : "text-foreground"
              }`}
            >
              {field.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}