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
  userInfo: any;
}

export function useVehiclesDebug(): UseVehiclesReturn {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<VehiculoConFotos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Debug - Usuario actual:', user);
      
      // Primero obtener TODOS los vehículos para debug
      const { data: allVehicles, error: allError } = await supabase
        .from('vehiculos')
        .select(`
          *,
          fotos:vehiculo_fotos(*)
        `)
        .order('created_at', { ascending: false });

      console.log('🔍 Debug - Todos los vehículos en BD:', allVehicles);
      
      if (allError) {
        throw new Error(`Error al cargar todos los vehículos: ${allError.message}`);
      }

      // Si hay usuario, intentar filtrar por user_id
      if (user) {
        const { data: userVehicles, error: userError } = await supabase
          .from('vehiculos')
          .select(`
            *,
            fotos:vehiculo_fotos(*)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        console.log('🔍 Debug - Vehículos filtrados por usuario:', userVehicles);
        
        if (userError) {
          console.error('🔍 Debug - Error al filtrar por usuario:', userError);
        }
        
        setVehicles(userVehicles || []);
      } else {
        // Si no hay usuario, mostrar todos (temporal para debug)
        setVehicles(allVehicles || []);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      toast.error('Error al cargar vehículos', {
        description: errorMessage
      });
      console.error('🔍 Debug - Error:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const deleteVehicle = useCallback(async (vehicleId: string): Promise<boolean> => {
    // Lógica original de eliminación...
    return false;
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
    updateVehicle,
    userInfo: {
      user,
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email
    }
  };
}