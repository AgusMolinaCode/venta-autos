"use client";

import { useState, useMemo } from 'react';
import { VehiculoConFotos } from '@/lib/supabase';
import { FilterState } from '@/components/landing/brand-filters/brand-filter-panel';

interface UseBrandFiltersProps {
  vehicles: VehiculoConFotos[];
}

export function useBrandFilters({ vehicles }: UseBrandFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    modelo: null,
    anoRange: [1970, 2025],
    kilometrajeRange: [0, 500000],
    combustibles: [],
    transmisiones: []
  });

  // Filter vehicles based on current filter state
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      // Modelo filter
      if (filters.modelo && vehicle.modelo !== filters.modelo) {
        return false;
      }

      // Año range filter
      if (vehicle.ano < filters.anoRange[0] || vehicle.ano > filters.anoRange[1]) {
        return false;
      }

      // Kilometraje range filter
      if (vehicle.kilometraje !== undefined) {
        if (vehicle.kilometraje < filters.kilometrajeRange[0] || vehicle.kilometraje > filters.kilometrajeRange[1]) {
          return false;
        }
      }

      // Combustible filter
      if (filters.combustibles.length > 0 && vehicle.combustible) {
        if (!filters.combustibles.includes(vehicle.combustible)) {
          return false;
        }
      }

      // Transmisión filter
      if (filters.transmisiones.length > 0 && vehicle.transmision) {
        if (!filters.transmisiones.includes(vehicle.transmision)) {
          return false;
        }
      }

      return true;
    });
  }, [vehicles, filters]);

  // Calculate filter counts for display
  const filterCounts = useMemo(() => {
    return {
      total: vehicles.length,
      filtered: filteredVehicles.length,
      modelos: [...new Set(vehicles.map(v => v.modelo))].length,
      combustibles: [...new Set(vehicles.map(v => v.combustible).filter(Boolean))].length,
      transmisiones: [...new Set(vehicles.map(v => v.transmision).filter(Boolean))].length
    };
  }, [vehicles, filteredVehicles]);

  // Get available options based on current vehicles
  const availableOptions = useMemo(() => {
    const modelos = [...new Set(vehicles.map(v => v.modelo))].sort();
    const anos = vehicles.map(v => v.ano).filter(Boolean);
    const kilometrajes = vehicles.map(v => v.kilometraje).filter(Boolean);
    const combustibles = [...new Set(vehicles.map(v => v.combustible).filter(Boolean))];
    const transmisiones = [...new Set(vehicles.map(v => v.transmision).filter(Boolean))];

    return {
      modelos,
      anoRange: anos.length > 0 ? [Math.min(...anos), Math.max(...anos)] as [number, number] : [1970, 2025] as [number, number],
      kilometrajeRange: kilometrajes.length > 0 ? [0, Math.max(...kilometrajes)] as [number, number] : [0, 500000] as [number, number],
      combustibles,
      transmisiones
    };
  }, [vehicles]);

  const updateFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      modelo: null,
      anoRange: availableOptions.anoRange,
      kilometrajeRange: [0, availableOptions.kilometrajeRange[1]],
      combustibles: [],
      transmisiones: []
    });
  };

  const hasActiveFilters = useMemo(() => {
    return (
      filters.modelo !== null ||
      filters.anoRange[0] !== availableOptions.anoRange[0] ||
      filters.anoRange[1] !== availableOptions.anoRange[1] ||
      filters.kilometrajeRange[0] !== 0 ||
      filters.kilometrajeRange[1] !== availableOptions.kilometrajeRange[1] ||
      filters.combustibles.length > 0 ||
      filters.transmisiones.length > 0
    );
  }, [filters, availableOptions]);

  return {
    filters,
    filteredVehicles,
    filterCounts,
    availableOptions,
    updateFilters,
    clearFilters,
    hasActiveFilters
  };
}