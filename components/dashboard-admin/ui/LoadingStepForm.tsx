import React from "react";
import { IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VehicleTableRowSkeleton } from "./vehicle-table-skeleton";

const LoadingStepForm = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          Vehículos
        </h2>
        <Button
          disabled
          className="flex items-center gap-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700"
        >
          <IconPlus className="h-4 w-4" />
          Agregar vehículo
        </Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">
                Foto
              </TableHead>
              <TableHead className="w-32">
                Marca
              </TableHead>
              <TableHead className="w-40">
                Modelo
              </TableHead>
              <TableHead className="w-32">
                Versión
              </TableHead>
              <TableHead className="w-20 text-center">
                Año
              </TableHead>
              <TableHead className="w-32 text-right">
                Precio
              </TableHead>
              <TableHead className="w-32 text-right">
                Kilometraje
              </TableHead>
              <TableHead className="w-24 text-center">
                Estado
              </TableHead>
              <TableHead className="w-16 text-right">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({
              length: 8,
            }).map((_, i) => (
              <VehicleTableRowSkeleton
                key={i}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LoadingStepForm;
