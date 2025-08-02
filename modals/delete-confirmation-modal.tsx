"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  vehicleName: string;
  isDeleting?: boolean;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  vehicleName,
  isDeleting = false,
}: DeleteConfirmationModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="bg-card border p-4 rounded-2xl">
        <DialogHeader>
          <DialogTitle>
            ¿Eliminar vehículo?
          </DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas
            eliminar el vehículo{" "}
            <strong>
              {vehicleName}
            </strong>
            ? Esta acción no se puede
            deshacer y se eliminarán
            todas las fotos asociadas.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting
              ? "Eliminando..."
              : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
