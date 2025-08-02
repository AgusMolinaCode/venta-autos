"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { useVehicles } from "../../hooks/use-vehicles";
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
  EmptyState,
  StatusFilterButtons,
} from "./ui";
import {
  VehicleDetailsModal,
  DeleteConfirmationModal,
} from "../../modals";
import LoadingStepForm from "./ui/LoadingStepForm";
import {
  useStepFormHandlers,
  useSortableTable,
  useStatusFilter,
} from "./step-form-handlers";
import { SortableHeader } from "@/components/ui/sortable-header";
import { ColumnDef } from "@tanstack/react-table";
import { VehiculoConFotos } from "@/lib/supabase";

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

  const {
    isAddModalOpen,
    editingVehicle,
    viewingVehicle,
    deleteDialog,
    isDeleting,
    handleAddVehicle,
    handleEditVehicle,
    handleViewDetails,
    handleDeleteVehicle,
    confirmDelete,
    closeDeleteDialog,
    closeAddModal,
    closeEditModal,
    closeViewModal,
    onAddSuccess,
    onEditSuccess,
  } = useStepFormHandlers({
    onClick,
    vehicles,
    deleteVehicle,
    refetch,
  });

  // Hook de filtrado por estado
  const {
    activeFilter,
    setActiveFilter,
    filteredVehicles,
  } = useStatusFilter({ vehicles });

  // Definir columnas para el sorting
  const columns: ColumnDef<VehiculoConFotos>[] =
    [
      {
        accessorKey: "marca",
        id: "marca",
      },
      {
        accessorKey: "kilometraje",
        id: "kilometraje",
      },
    ];

  // Hook de sorting (aplicado a vehículos filtrados)
  const { getSortedData, table } =
    useSortableTable({
      data: filteredVehicles,
      columns,
    });

  // Obtener datos ordenados y filtrados
  const sortedAndFilteredVehicles =
    getSortedData();

  if (loading) {
    return <LoadingStepForm />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Vehículos
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredVehicles.length} de{" "}
            {vehicles.length} vehículo
            {vehicles.length !== 1
              ? "s"
              : ""}
            {activeFilter !== "all" && (
              <span className="ml-1 font-medium">
                ({activeFilter})
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <StatusFilterButtons
            activeFilter={activeFilter}
            onFilterChange={
              setActiveFilter
            }
          />
          <Button
            onClick={handleAddVehicle}
            disabled={disabled}
            className="flex items-center gap-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700"
          >
            <IconPlus className="h-4 w-4" />
            Agregar vehículo
          </Button>
        </div>
      </div>

      {sortedAndFilteredVehicles.length ===
      0 ? (
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
                  <SortableHeader
                    column={
                      table.getColumn(
                        "marca",
                      )!
                    }
                  >
                    Marca
                  </SortableHeader>
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
                  <SortableHeader
                    column={
                      table.getColumn(
                        "kilometraje",
                      )!
                    }
                  >
                    Kilometraje
                  </SortableHeader>
                </TableHead>
                <TableHead className="w-24 text-center">
                  Estado
                </TableHead>
                <TableHead className="w-24 text-right">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAndFilteredVehicles.map(
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
                    onStatusChange={() => {
                      // No hacer refetch, el cache ya maneja el estado
                    }}
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
        onClose={closeAddModal}
        onSuccess={onAddSuccess}
      />

      {/* Vehicle Details Modal */}
      <VehicleDetailsModal
        vehicle={viewingVehicle}
        isOpen={!!viewingVehicle}
        onClose={closeViewModal}
      />

      {/* Edit Modal */}
      {editingVehicle && (
        <AddCarModal
          isOpen={true}
          onClose={closeEditModal}
          onSuccess={onEditSuccess}
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
