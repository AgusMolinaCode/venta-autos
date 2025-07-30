"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { IconCar, IconEdit, IconTrash, IconPlus, IconEye, IconDots } from "@tabler/icons-react";
import { useVehicles } from "./hooks/use-vehicles";
import { VehiculoConFotos } from "@/lib/supabase";
import AddCarModal from "./add-car-modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface VehicleTableRowProps {
  vehicle: VehiculoConFotos;
  onEdit: (vehicle: VehiculoConFotos) => void;
  onDelete: (vehicleId: string) => void;
  onViewDetails: (vehicle: VehiculoConFotos) => void;
}

function VehicleTableRow({ vehicle, onEdit, onDelete, onViewDetails }: VehicleTableRowProps) {
  const primaryPhoto = vehicle.fotos?.find(foto => foto.is_primary) || vehicle.fotos?.[0];
  const photoUrl = primaryPhoto 
    ? `/api/storage/image?path=${primaryPhoto.storage_path}`
    : null;

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency === 'USD' ? 'USD' : 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = () => {
    // Hardcoded statuses for demo purposes
    const statuses = ['Preparación', 'Publicado', 'Pausado'] as const;
    type StatusType = typeof statuses[number];
    const randomStatus: StatusType = vehicle.id
      ? statuses[vehicle.id.charCodeAt(0) % statuses.length]
      : statuses[0];
    
    const statusColors: Record<StatusType, string> = {
      'Preparación': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Publicado': 'bg-green-100 text-green-800 border-green-200',
      'Pausado': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[randomStatus]}`}>
        {randomStatus}
      </span>
    );
  };

  return (
    <TableRow>
      {/* Foto Principal */}
      <TableCell className="w-20">
        <div className="w-12 h-12 rounded-md overflow-hidden bg-muted">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={`${vehicle.marca} ${vehicle.modelo}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <IconCar className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
        </div>
      </TableCell>
      
      {/* Marca */}
      <TableCell className="font-medium w-32">
        {vehicle.marca}
      </TableCell>
      
      {/* Modelo */}
      <TableCell className="w-40">
        {vehicle.modelo}
      </TableCell>
      
      {/* Versión */}
      <TableCell className="w-32">
        {vehicle.version || '-'}
      </TableCell>
      
      {/* Año */}
      <TableCell className="text-center w-20">
        {vehicle.ano}
      </TableCell>
      
      {/* Precio */}
      <TableCell className="text-right font-semibold text-primary w-32">
        {formatPrice(vehicle.precio, vehicle.moneda)}
      </TableCell>
      
      {/* Kilometraje */}
      <TableCell className="text-right w-32">
        {vehicle.kilometraje 
          ? `${vehicle.kilometraje.toLocaleString()} km`
          : 'No especificado'
        }
      </TableCell>
      
      {/* Estado */}
      <TableCell className="text-center w-24">
        {getStatusBadge()}
      </TableCell>
      
      {/* Acciones */}
      <TableCell className="w-16 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-muted"
            >
              <IconDots className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onViewDetails(vehicle)}>
              <IconEye className="h-4 w-4 mr-2" />
              Ver detalle
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(vehicle)}>
              <IconEdit className="h-4 w-4 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete(vehicle.id!)}
              className="text-destructive focus:text-destructive"
            >
              <IconTrash className="h-4 w-4 mr-2" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

function VehicleTableRowSkeleton() {
  return (
    <TableRow className="animate-pulse">
      <TableCell>
        <div className="w-12 h-12 bg-muted rounded-md" />
      </TableCell>
      <TableCell>
        <div className="h-4 bg-muted rounded-md w-20" />
      </TableCell>
      <TableCell>
        <div className="h-4 bg-muted rounded-md w-24" />
      </TableCell>
      <TableCell>
        <div className="h-4 bg-muted rounded-md w-20" />
      </TableCell>
      <TableCell>
        <div className="h-4 bg-muted rounded-md w-12 mx-auto" />
      </TableCell>
      <TableCell>
        <div className="h-4 bg-muted rounded-md w-20 ml-auto" />
      </TableCell>
      <TableCell>
        <div className="h-4 bg-muted rounded-md w-16 ml-auto" />
      </TableCell>
      <TableCell>
        <div className="h-6 bg-muted rounded-full w-16 mx-auto" />
      </TableCell>
      <TableCell>
        <div className="w-8 h-8 bg-muted rounded-md" />
      </TableCell>
    </TableRow>
  );
}

function EmptyState({ onAddVehicle }: { onAddVehicle: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="rounded-full bg-muted p-6 mb-4">
        <IconCar className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        No hay vehículos registrados
      </h3>
      <p className="text-muted-foreground text-center mb-6 max-w-md">
        Comienza agregando tu primer vehículo al sistema. Podrás gestionar toda la información y fotos desde aquí.
      </p>
      <Button onClick={onAddVehicle} className="flex items-center gap-2">
        <IconPlus className="h-4 w-4" />
        Agregar primer vehículo
      </Button>
    </div>
  );
}

function VehicleDetailsModal({ vehicle, isOpen, onClose }: {
  vehicle: VehiculoConFotos | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!vehicle) return null;

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency === 'USD' ? 'USD' : 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {vehicle.marca} {vehicle.modelo} {vehicle.ano}
          </DialogTitle>
          <DialogDescription>
            Detalles completos del vehículo
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Photos Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Fotos</h3>
            {vehicle.fotos && vehicle.fotos.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {vehicle.fotos.map((foto, index) => (
                  <div key={foto.id} className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                    <img
                      src={`/api/storage/image?path=${foto.storage_path}`}
                      alt={`${vehicle.marca} ${vehicle.modelo} - Foto ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {foto.is_primary && (
                      <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                        Principal
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 bg-muted rounded-lg">
                <div className="text-center">
                  <IconCar className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Sin fotos disponibles</p>
                </div>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Información del Vehículo</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Marca</label>
                  <p className="text-foreground">{vehicle.marca}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Modelo</label>
                  <p className="text-foreground">{vehicle.modelo}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Año</label>
                  <p className="text-foreground">{vehicle.ano}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Kilometraje</label>
                  <p className="text-foreground">
                    {vehicle.kilometraje ? `${vehicle.kilometraje.toLocaleString()} km` : 'No especificado'}
                  </p>
                </div>
              </div>

              {vehicle.version && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Versión</label>
                  <p className="text-foreground">{vehicle.version}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {vehicle.combustible && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Combustible</label>
                    <p className="text-foreground">{vehicle.combustible}</p>
                  </div>
                )}
                {vehicle.transmision && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Transmisión</label>
                    <p className="text-foreground">{vehicle.transmision}</p>
                  </div>
                )}
              </div>

              {vehicle.color && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Color</label>
                  <p className="text-foreground">{vehicle.color}</p>
                </div>
              )}

              <div className="border-t pt-4">
                <label className="text-sm font-medium text-muted-foreground">Precio</label>
                <p className="text-2xl font-bold text-primary">
                  {formatPrice(vehicle.precio, vehicle.moneda)}
                </p>
              </div>

              {vehicle.descripcion && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Descripción</label>
                  <p className="text-foreground whitespace-pre-wrap">{vehicle.descripcion}</p>
                </div>
              )}

              <div className="text-xs text-muted-foreground border-t pt-4">
                <p>Creado: {new Date(vehicle.created_at!).toLocaleDateString('es-AR')}</p>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface StepFormProps {
  onClick?: () => void;
  disabled?: boolean;
}

/**
 * Componente de gestión de vehículos que reemplaza al StepForm original
 * Muestra una grilla de vehículos con funcionalidad CRUD completa
 */
const StepForm = ({ onClick, disabled }: StepFormProps) => {
  const { vehicles, loading, refetch, deleteVehicle } = useVehicles();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<VehiculoConFotos | null>(null);
  const [viewingVehicle, setViewingVehicle] = useState<VehiculoConFotos | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; vehicleId: string | null; vehicleName: string }>({
    open: false,
    vehicleId: null,
    vehicleName: ''
  });

  const handleAddVehicle = () => {
    if (onClick) {
      onClick();
    } else {
      setIsAddModalOpen(true);
    }
  };

  const handleEditVehicle = (vehicle: VehiculoConFotos) => {
    setEditingVehicle(vehicle);
  };

  const handleViewDetails = (vehicle: VehiculoConFotos) => {
    setViewingVehicle(vehicle);
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      setDeleteDialog({
        open: true,
        vehicleId,
        vehicleName: `${vehicle.marca} ${vehicle.modelo} ${vehicle.ano}`
      });
    }
  };

  const confirmDelete = async () => {
    if (deleteDialog.vehicleId) {
      await deleteVehicle(deleteDialog.vehicleId);
      setDeleteDialog({ open: false, vehicleId: null, vehicleName: '' });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Vehículos</h2>
          <Button disabled className="flex items-center gap-2">
            <IconPlus className="h-4 w-4" />
            Agregar vehículo
          </Button>
        </div>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Foto</TableHead>
                <TableHead className="w-32">Marca</TableHead>
                <TableHead className="w-40">Modelo</TableHead>
                <TableHead className="w-32">Versión</TableHead>
                <TableHead className="w-20 text-center">Año</TableHead>
                <TableHead className="w-32 text-right">Precio</TableHead>
                <TableHead className="w-32 text-right">Kilometraje</TableHead>
                <TableHead className="w-24 text-center">Estado</TableHead>
                <TableHead className="w-16 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 8 }).map((_, i) => (
                <VehicleTableRowSkeleton key={i} />
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
          <h2 className="text-2xl font-bold text-foreground">Vehículos</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {vehicles.length} vehículo{vehicles.length !== 1 ? 's' : ''} registrado{vehicles.length !== 1 ? 's' : ''}
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
        <EmptyState onAddVehicle={handleAddVehicle} />
      ) : (
        <div className="border rounded-lg bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Foto</TableHead>
                <TableHead className="w-32">Marca</TableHead>
                <TableHead className="w-40">Modelo</TableHead>
                <TableHead className="w-32">Versión</TableHead>
                <TableHead className="w-20 text-center">Año</TableHead>
                <TableHead className="w-32 text-right">Precio</TableHead>
                <TableHead className="w-32 text-right">Kilometraje</TableHead>
                <TableHead className="w-24 text-center">Estado</TableHead>
                <TableHead className="w-16 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <VehicleTableRow
                  key={vehicle.id}
                  vehicle={vehicle}
                  onEdit={handleEditVehicle}
                  onDelete={handleDeleteVehicle}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Modal */}
      <AddCarModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          setIsAddModalOpen(false);
          refetch();
        }}
      />

      {/* Vehicle Details Modal */}
      <VehicleDetailsModal
        vehicle={viewingVehicle}
        isOpen={!!viewingVehicle}
        onClose={() => setViewingVehicle(null)}
      />

      {/* Edit Modal */}
      {editingVehicle && (
        <AddCarModal
          isOpen={true}
          onClose={() => setEditingVehicle(null)}
          onSuccess={() => {
            setEditingVehicle(null);
            refetch();
          }}
          editingVehicle={editingVehicle}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open: false, vehicleId: null, vehicleName: '' })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar vehículo?</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar el vehículo <strong>{deleteDialog.vehicleName}</strong>?
              Esta acción no se puede deshacer y se eliminarán todas las fotos asociadas.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, vehicleId: null, vehicleName: '' })}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StepForm;
