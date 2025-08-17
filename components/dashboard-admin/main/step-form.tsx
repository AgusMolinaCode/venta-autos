"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VehicleTableRow } from "../ui/vehicle-table-row";
import { EmptyState } from "../ui/empty-state";
import { StatusFilterButtons } from "../ui/status-filter-buttons";
import { DeleteConfirmationModal } from "@/modals/delete-confirmation-modal";
import LoadingStepForm from "../ui/LoadingStepForm";
import { useStepFormHandlers } from "../step-form-handlers/use-step-form-handlers";
import { useSortableTable } from "../step-form-handlers/use-sortable-table";
import { useStatusFilter } from "../step-form-handlers/use-status-filter";
import { SortableHeader } from "@/components/ui/sortable-header";
import { ColumnDef } from "@tanstack/react-table";
import { VehiculoConFotos } from "@/lib/supabase";
import { useVehicles } from "@/hooks/use-vehicles";
import { useVehicleSearch } from "@/hooks/use-vehicle-search";
import Buscador from "../buscador/Buscador";
import AddCarModal from "../add-car-modal";
import { VehicleDetailsModal } from "@/modals/details-modal/vehicle-details-modal";

interface StepFormProps {
  onClick?: () => void;
  disabled?: boolean;
}

const StepForm = ({ onClick, disabled }: StepFormProps) => {
  const { vehicles, loading, refetch, deleteVehicle } = useVehicles();

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
  const { activeFilter, setActiveFilter, filteredVehicles } = useStatusFilter({
    vehicles,
  });

  // Hook de búsqueda de vehículos
  const {
    searchQuery,
    setSearchQuery,
    filteredVehicles: searchFilteredVehicles,
    isSearching,
    hasActiveSearch,
    clearSearch,
  } = useVehicleSearch({
    vehicles: filteredVehicles,
  });

  // Definir columnas para el sorting
  const columns: ColumnDef<VehiculoConFotos>[] = [
    {
      accessorKey: "marca",
      id: "marca",
    },
    {
      accessorKey: "kilometraje",
      id: "kilometraje",
    },
  ];

  // Hook de sorting (aplicado a vehículos filtrados y buscados)
  const { getSortedData, table } = useSortableTable({
    data: searchFilteredVehicles,
    columns,
  });

  // Obtener datos ordenados, filtrados y buscados
  const finalFilteredVehicles = getSortedData();

  if (loading) {
    return <LoadingStepForm />;
  }

  return (
    <div className="space-y-6">
      <div className="lg:flex items-center justify-between">
        <div className="flex items-center gap-2 mg:gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">Vehículos</h2>
            <p className="text-sm text-muted-foreground lg:mt-1">
              {searchFilteredVehicles.length} de {vehicles.length} vehículo
              {vehicles.length !== 1 ? "s" : ""}
              {activeFilter !== "all" && (
                <span className="ml-1 font-medium">({activeFilter})</span>
              )}
            </p>
          </div>
          <Buscador
            vehicles={filteredVehicles}
            onSearch={() => {
              // La lógica de búsqueda se maneja internamente por el hook
            }}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            placeholder="Buscar por marca, modelo o año..."
            className="lg:ml-4"
          />
        </div>
        <div className="flex items-center gap-4">
          <StatusFilterButtons
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
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

      {finalFilteredVehicles.length === 0 ? (
        <EmptyState
          onAddVehicle={handleAddVehicle}
          title={
            hasActiveSearch
              ? `No se encontraron vehículos para "${searchQuery}"`
              : activeFilter !== "all"
              ? `No hay vehículos con estado "${activeFilter}"`
              : "No hay vehículos registrados"
          }
          description={
            hasActiveSearch
              ? "Intenta con otros términos de búsqueda como marca, modelo o año."
              : activeFilter !== "all"
              ? "Cambia el filtro o agrega vehículos con este estado."
              : "Comienza agregando tu primer vehículo al sistema. Podrás gestionar toda la información y fotos desde aquí."
          }
          buttonText={
            hasActiveSearch || activeFilter !== "all"
              ? "Agregar vehículo"
              : "Agregar primer vehículo"
          }
        />
      ) : (
        <div className="border rounded-lg bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Foto</TableHead>
                <TableHead className="w-32">
                  <SortableHeader column={table.getColumn("marca")!}>
                    Marca
                  </SortableHeader>
                </TableHead>
                <TableHead className="w-40">Modelo</TableHead>
                <TableHead className="w-32">Versión</TableHead>
                <TableHead className="w-20 text-center">Año</TableHead>
                <TableHead className="w-32 text-right">Precio</TableHead>
                <TableHead className="w-32 text-right">
                  <SortableHeader column={table.getColumn("kilometraje")!}>
                    Kilometraje
                  </SortableHeader>
                </TableHead>
                <TableHead className="w-24 text-center">Estado</TableHead>
                <TableHead className="w-24 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {finalFilteredVehicles.map((vehicle) => (
                <VehicleTableRow
                  key={vehicle.id}
                  vehicle={vehicle}
                  onEdit={handleEditVehicle}
                  onDelete={handleDeleteVehicle}
                  onViewDetails={handleViewDetails}
                  onStatusChange={() => {
                    // No hacer refetch, el cache ya maneja el estado
                  }}
                />
              ))}
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
          editingVehicle={editingVehicle}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteDialog.open}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        vehicleName={deleteDialog.vehicleName}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default StepForm;
