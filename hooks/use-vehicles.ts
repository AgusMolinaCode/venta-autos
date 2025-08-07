"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase, VehiculoConFotos } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/auth-provider';

interface UseVehiclesReturn {
  vehicles: VehiculoConFotos[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  deleteVehicle: (vehicleId: string) => Promise<boolean>;
  updateVehicle: (vehicleId: string, updatedVehicle: VehiculoConFotos) => void;
}

export function useVehicles(): UseVehiclesReturn {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<VehiculoConFotos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = useCallback(async () => {
    if (!user) {
      setVehicles([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('vehiculos')
        .select(`
          *,
          fotos:vehiculo_fotos(*)
        `)
        .eq('user_id', user.id)  // Filtrar por usuario autenticado
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw new Error(`Error al cargar vehículos: ${fetchError.message}`);
      }

      setVehicles(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      toast.error('Error al cargar vehículos', {
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  const deleteVehicle = useCallback(async (vehicleId: string): Promise<boolean> => {
    try {
      // First, get vehicle photos to delete from storage
      const { data: photos } = await supabase
        .from('vehiculo_fotos')
        .select('storage_path')
        .eq('vehiculo_id', vehicleId);

      // Delete photos from storage
      if (photos && photos.length > 0) {
        const storagePaths = photos.map(photo => photo.storage_path);
        const { error: storageError } = await supabase.storage
          .from('venta-autos-images')
          .remove(storagePaths);

        if (storageError) {
          console.warn('Error al eliminar fotos del storage:', storageError);
        }
      }

      // Delete vehicle photos records
      const { error: photosError } = await supabase
        .from('vehiculo_fotos')
        .delete()
        .eq('vehiculo_id', vehicleId);

      if (photosError) {
        throw new Error(`Error al eliminar fotos: ${photosError.message}`);
      }

      // Delete vehicle record
      const { error: vehicleError } = await supabase
        .from('vehiculos')
        .delete()
        .eq('id', vehicleId);

      if (vehicleError) {
        throw new Error(`Error al eliminar vehículo: ${vehicleError.message}`);
      }

      // Update local state
      setVehicles(prev => prev.filter(vehicle => vehicle.id !== vehicleId));
      
      toast.success('Vehículo eliminado correctamente');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      toast.error('Error al eliminar vehículo', {
        description: errorMessage
      });
      return false;
    }
  }, []);

  const updateVehicle = useCallback((vehicleId: string, updatedVehicle: VehiculoConFotos) => {
    setVehicles(prev => prev.map(vehicle => 
      vehicle.id === vehicleId ? updatedVehicle : vehicle
    ));
  }, []);

  const refetch = useCallback(async () => {
    await fetchVehicles();
  }, [fetchVehicles]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return {
    vehicles,
    loading,
    error,
    refetch,
    deleteVehicle,
    updateVehicle
  };
}