"use client";

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/components/auth/auth-provider';
import { VehiculoConFotos } from "@/lib/supabase";
import { formatVehicleName } from "@/utils/formatters";
import { DeleteDialogState, StepFormHandlersReturn } from './types';

interface UseStepFormHandlersProps {
  onClick?: () => void;
  vehicles: VehiculoConFotos[];
  deleteVehicle: (vehicleId: string) => Promise<boolean>;
  refetch: () => Promise<void>; // Keep for backward compatibility but won't be used
}

export function useStepFormHandlers({
  onClick,
  vehicles,
  deleteVehicle,
  refetch,
}: UseStepFormHandlersProps): StepFormHandlersReturn {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Estados modales
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<VehiculoConFotos | null>(null);
  const [viewingVehicle, setViewingVehicle] = useState<VehiculoConFotos | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    open: false,
    vehicleId: null,
    vehicleName: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Helper function to invalidate vehicles cache
  const invalidateVehicles = () => {
    queryClient.invalidateQueries({
      queryKey: ['vehicles', user?.id]
    });
  };

  // Handler para agregar vehículo
  const handleAddVehicle = () => {
    if (onClick) {
      onClick();
    } else {
      setIsAddModalOpen(true);
    }
  };

  // Handler para editar vehículo
  const handleEditVehicle = (vehicle: VehiculoConFotos) => {
    setEditingVehicle(vehicle);
  };

  // Handler para ver detalles
  const handleViewDetails = (vehicle: VehiculoConFotos) => {
    setViewingVehicle(vehicle);
  };

  // Handler para eliminar vehículo
  const handleDeleteVehicle = (vehicleId: string) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
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

  // Confirmar eliminación
  const confirmDelete = async () => {
    if (deleteDialog.vehicleId) {
      setIsDeleting(true);
      try {
        await deleteVehicle(deleteDialog.vehicleId);
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

  // Cerrar diálogo de eliminación
  const closeDeleteDialog = () => {
    if (!isDeleting) {
      setDeleteDialog({
        open: false,
        vehicleId: null,
        vehicleName: "",
      });
    }
  };

  // Modal handlers
  const closeAddModal = () => setIsAddModalOpen(false);
  const closeEditModal = () => setEditingVehicle(null);
  const closeViewModal = () => setViewingVehicle(null);

  const onAddSuccess = () => {
    setIsAddModalOpen(false);
    invalidateVehicles(); // Use React Query invalidation instead of manual refetch
  };

  const onEditSuccess = () => {
    setEditingVehicle(null);
    invalidateVehicles(); // Use React Query invalidation instead of manual refetch
  };

  return {
    // Estados
    isAddModalOpen,
    editingVehicle,
    viewingVehicle,
    deleteDialog,
    isDeleting,
    
    // Handlers
    handleAddVehicle,
    handleEditVehicle,
    handleViewDetails,
    handleDeleteVehicle,
    confirmDelete,
    closeDeleteDialog,
    
    // Modal handlers
    closeAddModal,
    closeEditModal,
    closeViewModal,
    onAddSuccess,
    onEditSuccess,
  };
}