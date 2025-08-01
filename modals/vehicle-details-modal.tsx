"use client";

import { PriceDisplay } from "@/components/dashboard-admin/ui/price-display";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VehiculoConFotos } from "@/lib/supabase";

import {
  formatKilometraje,
  formatDate,
} from "@/utils/formatters";
import { IconCar } from "@tabler/icons-react";
import Image from "next/image";

interface VehicleDetailsModalProps {
  vehicle: VehiculoConFotos | null;
  isOpen: boolean;
  onClose: () => void;
}

export function VehicleDetailsModal({
  vehicle,
  isOpen,
  onClose,
}: VehicleDetailsModalProps) {
  if (!vehicle) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {vehicle.marca}{" "}
            {vehicle.modelo}{" "}
            {vehicle.ano}
          </DialogTitle>
          <DialogDescription>
            Detalles completos del
            vehículo
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Photos Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">
              Fotos
            </h3>
            {vehicle.fotos &&
            vehicle.fotos.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {vehicle.fotos.map(
                  (foto, index) => (
                    <div
                      key={foto.id}
                      className="relative aspect-video rounded-lg overflow-hidden bg-muted"
                    >
                      <Image
                        src={`/api/storage/image?path=${foto.storage_path}`}
                        alt={`${vehicle.marca} ${vehicle.modelo} - Foto ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        priority={
                          foto.is_primary
                        }
                        width={300}
                        height={200}
                      />
                      {foto.is_primary && (
                        <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                          Principal
                        </div>
                      )}
                    </div>
                  ),
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 bg-muted rounded-lg">
                <div className="text-center">
                  <IconCar className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    Sin fotos
                    disponibles
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">
              Información del Vehículo
            </h3>
            <div className="space-y-3">
              <VehicleDetailsGrid
                vehicle={vehicle}
              />

              <div className="border-t pt-4">
                <label className="text-sm font-medium text-muted-foreground">
                  Precio
                </label>
                <div className="mt-1">
                  <PriceDisplay
                    price={
                      vehicle.precio
                    }
                    currency={
                      vehicle.moneda
                    }
                    size="lg"
                  />
                </div>
              </div>

              {vehicle.descripcion && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Descripción
                  </label>
                  <p className="text-foreground whitespace-pre-wrap mt-1">
                    {
                      vehicle.descripcion
                    }
                  </p>
                </div>
              )}

              <div className="text-xs text-muted-foreground border-t pt-4">
                <p>
                  Creado:{" "}
                  {formatDate(
                    vehicle.created_at!,
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function VehicleDetailsGrid({
  vehicle,
}: {
  vehicle: VehiculoConFotos;
}) {
  const fields = [
    {
      label: "Marca",
      value: vehicle.marca,
    },
    {
      label: "Modelo",
      value: vehicle.modelo,
    },
    {
      label: "Año",
      value: vehicle.ano,
    },
    {
      label: "Kilometraje",
      value: formatKilometraje(
        vehicle.kilometraje,
      ),
    },
    {
      label: "Versión",
      value: vehicle.version,
    },
    {
      label: "Combustible",
      value: vehicle.combustible,
    },
    {
      label: "Transmisión",
      value: vehicle.transmision,
    },
    {
      label: "Color",
      value: vehicle.color,
    },
  ].filter((field) => field.value);

  return (
    <div className="grid grid-cols-2 gap-4">
      {fields.map((field, index) => (
        <div key={index}>
          <label className="text-sm font-medium text-muted-foreground">
            {field.label}
          </label>
          <p className="text-foreground">
            {field.value}
          </p>
        </div>
      ))}
    </div>
  );
}
