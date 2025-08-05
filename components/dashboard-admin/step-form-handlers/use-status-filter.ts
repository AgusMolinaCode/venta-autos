"use client";

import { useState, useMemo } from 'react';
import { VehiculoConFotos } from '@/lib/supabase';
import { EstadoType } from '@/constants';
import { useVehicleStatusCache } from '@/hooks/use-vehicle-status-cache';

interface UseStatusFilterProps {
  vehicles: VehiculoConFotos[];
}

export function useStatusFilter({ vehicles }: UseStatusFilterProps) {
  const [activeFilter, setActiveFilter] = useState<EstadoType | 'all'>('all');
  const { getVehicleStatus } = useVehicleStatusCache();

  // Obtener vehículos filtrados con estados del cache
  const filteredVehicles = useMemo(() => {
    if (activeFilter === 'all') return vehicles;
    
    return vehicles.filter((vehicle) => {
      // Obtener estado del cache o usar estado por defecto
      const vehicleStatus = getVehicleStatus(vehicle.id!) || 'preparación';
      return vehicleStatus === activeFilter;
    });
  }, [vehicles, activeFilter, getVehicleStatus]);

  // Calcular conteos por estado
  const vehicleCounts = useMemo(() => {
    const counts = {
      'preparación': 0,
      'publicado': 0,
      'pausado': 0,
      'vendido': 0,
      'all': vehicles.length
    } as Record<EstadoType, number> & { all: number };

    vehicles.forEach((vehicle) => {
      const vehicleStatus = getVehicleStatus(vehicle.id!) || 'preparación';
      counts[vehicleStatus]++;
    });

    return counts;
  }, [vehicles, getVehicleStatus]);

  return {
    activeFilter,
    setActiveFilter,
    filteredVehicles,
    vehicleCounts,
  };
}