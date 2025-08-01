"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { useVehicles } from "../../hooks/use-vehicles";
import { VehiculoConFotos } from "@/lib/supabase";
import AddCarModal from "./add-car-modal";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  VehicleTableRow,
  VehicleTableRowSkeleton,
  EmptyState,
} from "./ui";
import {
  VehicleDetailsModal,
  DeleteConfirmationModal,
} from "../../modals";
import { formatVehicleName } from "@/utils";

interface StepFormProps {
  onClick?: () => void;
  disabled?: boolean;
}

/**
 * Componente de gestión de vehículos que reemplaza al StepForm original
 * Muestra una grilla de vehículos con funcionalidad CRUD completa
 */
const StepForm = ({
  onClick,
  disabled,
}: StepFormProps) => {
  const {
    vehicles,
    loading,
    refetch,
    deleteVehicle,
  } = useVehicles();
  const [
    isAddModalOpen,
    setIsAddModalOpen,
  ] = useState(false);
  const [
    editingVehicle,
    setEditingVehicle,
  ] = useState<VehiculoConFotos | null>(
    null,
  );
  const [
    viewingVehicle,
    setViewingVehicle,
  ] = useState<VehiculoConFotos | null>(
    null,
  );
  const [
    deleteDialog,
    setDeleteDialog,
  ] = useState<{
    open: boolean;
    vehicleId: string | null;
    vehicleName: string;
  }>({
    open: false,
    vehicleId: null,
    vehicleName: "",
  });
  const [isDeleting, setIsDeleting] =
    useState(false);

  const handleAddVehicle = () => {
    if (onClick) {
      onClick();
    } else {
      setIsAddModalOpen(true);
    }
  };

  const handleEditVehicle = (
    vehicle: VehiculoConFotos,
  ) => {
    setEditingVehicle(vehicle);
  };

  const handleViewDetails = (
    vehicle: VehiculoConFotos,
  ) => {
    setViewingVehicle(vehicle);
  };

  const handleDeleteVehicle = (
    vehicleId: string,
  ) => {
    const vehicle = vehicles.find(
      (v) => v.id === vehicleId,
    );
    if (vehicle) {
      setDeleteDialog({
        open: true,
        vehicleId,
        vehicleName: formatVehicleName(
          vehicle.marca,
          vehicle.modelo,
          vehicle.ano,
        ),
      });
    }
  };

  const confirmDelete = async () => {
    if (deleteDialog.vehicleId) {
      setIsDeleting(true);
      try {
        await deleteVehicle(
          deleteDialog.vehicleId,
        );
        setDeleteDialog({
          open: false,
          vehicleId: null,
          vehicleName: "",
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const closeDeleteDialog = () => {
    if (!isDeleting) {
      setDeleteDialog({
        open: false,
        vehicleId: null,
        vehicleName: "",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">
            Vehículos
          </h2>
          <Button
            disabled
            className="flex items-center gap-2"
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
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Vehículos
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {vehicles.length} vehículo
            {vehicles.length !== 1
              ? "s"
              : ""}{" "}
            registrado
            {vehicles.length !== 1
              ? "s"
              : ""}
          </p>
        </div>
        <Button
          onClick={handleAddVehicle}
          disabled={disabled}
          className="flex items-center gap-2"
        >
          <IconPlus className="h-4 w-4" />
          Agregar vehículo
        </Button>
      </div>

      {vehicles.length === 0 ? (
        <EmptyState
          onAddVehicle={
            handleAddVehicle
          }
        />
      ) : (
        <div className="border rounded-lg bg-card">
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
              {vehicles.map(
                (vehicle) => (
                  <VehicleTableRow
                    key={vehicle.id}
                    vehicle={vehicle}
                    onEdit={
                      handleEditVehicle
                    }
                    onDelete={
                      handleDeleteVehicle
                    }
                    onViewDetails={
                      handleViewDetails
                    }
                  />
                ),
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Modal */}
      <AddCarModal
        isOpen={isAddModalOpen}
        onClose={() =>
          setIsAddModalOpen(false)
        }
        onSuccess={() => {
          setIsAddModalOpen(false);
          refetch();
        }}
      />

      {/* Vehicle Details Modal */}
      <VehicleDetailsModal
        vehicle={viewingVehicle}
        isOpen={!!viewingVehicle}
        onClose={() =>
          setViewingVehicle(null)
        }
      />

      {/* Edit Modal */}
      {editingVehicle && (
        <AddCarModal
          isOpen={true}
          onClose={() =>
            setEditingVehicle(null)
          }
          onSuccess={() => {
            setEditingVehicle(null);
            refetch();
          }}
          editingVehicle={
            editingVehicle
          }
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteDialog.open}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        vehicleName={
          deleteDialog.vehicleName
        }
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default StepForm;
