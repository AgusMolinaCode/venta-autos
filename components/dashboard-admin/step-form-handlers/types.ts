import { VehiculoConFotos } from "@/lib/supabase";

export interface DeleteDialogState {
  open: boolean;
  vehicleId: string | null;
  vehicleName: string;
}

export interface StepFormHandlersReturn {
  // Estados
  isAddModalOpen: boolean;
  editingVehicle: VehiculoConFotos | null;
  viewingVehicle: VehiculoConFotos | null;
  deleteDialog: DeleteDialogState;
  isDeleting: boolean;
  
  // Handlers
  handleAddVehicle: () => void;
  handleEditVehicle: (vehicle: VehiculoConFotos) => void;
  handleViewDetails: (vehicle: VehiculoConFotos) => void;
  handleDeleteVehicle: (vehicleId: string) => void;
  confirmDelete: () => Promise<void>;
  closeDeleteDialog: () => void;
  
  // Modal handlers
  closeAddModal: () => void;
  closeEditModal: () => void;
  closeViewModal: () => void;
  onAddSuccess: () => void;
  onEditSuccess: () => void;
}