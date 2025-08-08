"use client";

import { useCallback, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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

// Query key generator
const getVehiclesQueryKey = (userId: string | undefined) => ['vehicles', userId];

// Fetch function for React Query
async function fetchVehicles(userId: string): Promise<VehiculoConFotos[]> {
  const { data, error: fetchError } = await supabase
    .from('vehiculos')
    .select(`
      *,
      fotos:vehiculo_fotos(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (fetchError) {
    throw new Error(`Error al cargar vehículos: ${fetchError.message}`);
  }

  return data || [];
}

export function useVehicles(): UseVehiclesReturn {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Page Visibility API to prevent refetch on tab changes
  const [isPageVisible, setIsPageVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const {
    data: vehicles = [],
    isLoading: loading,
    error,
    refetch: reactQueryRefetch,
  } = useQuery({
    queryKey: getVehiclesQueryKey(user?.id),
    queryFn: () => fetchVehicles(user!.id),
    enabled: !!user && isPageVisible, // Only fetch if user exists and page is visible
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes  
    refetchOnWindowFocus: false, // Prevent refetch on tab focus
    refetchOnMount: false, // Don't refetch on mount if we have data
    retry: 2,
  });

  const refetch = useCallback(async () => {
    if (user) {
      await reactQueryRefetch();
    }
  }, [user, reactQueryRefetch]);

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

      // Invalidate React Query cache to refetch data
      await queryClient.invalidateQueries({
        queryKey: getVehiclesQueryKey(user?.id)
      });
      
      toast.success('Vehículo eliminado correctamente');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      toast.error('Error al eliminar vehículo', {
        description: errorMessage
      });
      return false;
    }
  }, [queryClient, user?.id]);

  const updateVehicle = useCallback((vehicleId: string, updatedVehicle: VehiculoConFotos) => {
    // Update cache optimistically
    queryClient.setQueryData(
      getVehiclesQueryKey(user?.id),
      (oldVehicles: VehiculoConFotos[] | undefined) => {
        if (!oldVehicles) return [];
        return oldVehicles.map(vehicle => 
          vehicle.id === vehicleId ? updatedVehicle : vehicle
        );
      }
    );
  }, [queryClient, user?.id]);

  return {
    vehicles,
    loading,
    error: error?.message || null,
    refetch,
    deleteVehicle,
    updateVehicle
  };
}