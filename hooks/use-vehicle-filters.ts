"use client";

import { useState, useMemo } from 'react';
import { VehiculoConFotos } from '@/lib/supabase';

export interface VehicleFilterState {
  marca: string | null;
  modelo: string | null;
  anoRange: [number, number];
  precioRange: [number, number];
  kilometrajeRange: [number, number];
  combustibles: string[];
  transmisiones: string[];
}

interface UseVehicleFiltersProps {
  vehicles: VehiculoConFotos[];
}

export function useVehicleFilters({ vehicles }: UseVehicleFiltersProps) {
  // Get available options from all vehicles
  const availableOptions = useMemo(() => {
    const marcas = [...new Set(vehicles.map(v => v.marca))].sort();
    const modelos = [...new Set(vehicles.map(v => v.modelo))].sort();
    const anos = vehicles.map(v => v.ano).filter(Boolean);
    const precios = vehicles.map(v => v.precio).filter(Boolean);
    const kilometrajes = vehicles.map(v => v.kilometraje).filter(Boolean);
    const combustibles = [...new Set(vehicles.map(v => v.combustible).filter(Boolean))];
    const transmisiones = [...new Set(vehicles.map(v => v.transmision).filter(Boolean))];

    return {
      marcas,
      modelos,
      anoRange: anos.length > 0 ? [Math.min(...anos), Math.max(...anos)] as [number, number] : [1970, 2025] as [number, number],
      precioRange: precios.length > 0 ? [Math.min(...precios), Math.max(...precios)] as [number, number] : [0, 1000000] as [number, number],
      kilometrajeRange: kilometrajes.length > 0 ? [0, Math.max(...kilometrajes)] as [number, number] : [0, 500000] as [number, number],
      combustibles,
      transmisiones
    };
  }, [vehicles]);

  const [filters, setFilters] = useState<VehicleFilterState>({
    marca: null,
    modelo: null,
    anoRange: availableOptions.anoRange,
    precioRange: [0, availableOptions.precioRange[1] || 1000000],
    kilometrajeRange: [0, availableOptions.kilometrajeRange[1] || 500000],
    combustibles: [],
    transmisiones: []
  });

  // Filter vehicles based on current filter state
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      // Marca filter
      if (filters.marca && vehicle.marca !== filters.marca) {
        return false;
      }

      // Modelo filter
      if (filters.modelo && vehicle.modelo !== filters.modelo) {
        return false;
      }

      // Año range filter
      if (vehicle.ano < filters.anoRange[0] || vehicle.ano > filters.anoRange[1]) {
        return false;
      }

      // Precio range filter
      if (vehicle.precio !== undefined && vehicle.precio !== null && typeof vehicle.precio === 'number') {
        if (vehicle.precio < filters.precioRange[0] || vehicle.precio > filters.precioRange[1]) {
          return false;
        }
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

  // Get available modelos for selected marca
  const availableModelos = useMemo(() => {
    if (!filters.marca) {
      return availableOptions.modelos;
    }
    return [...new Set(vehicles
      .filter(v => v.marca === filters.marca)
      .map(v => v.modelo)
    )].sort();
  }, [vehicles, filters.marca, availableOptions.modelos]);

  // Calculate filter counts for display
  const filterCounts = useMemo(() => {
    return {
      total: vehicles.length,
      filtered: filteredVehicles.length,
      marcas: availableOptions.marcas.length,
      modelos: availableModelos.length,
      combustibles: availableOptions.combustibles.length,
      transmisiones: availableOptions.transmisiones.length
    };
  }, [vehicles, filteredVehicles, availableOptions, availableModelos]);

  const updateFilters = (newFilters: VehicleFilterState) => {
    // If marca changes, reset modelo
    if (newFilters.marca !== filters.marca) {
      newFilters.modelo = null;
    }
    setFilters(newFilters);
  };

  const clearFilters = () => {
    const cleared: VehicleFilterState = {
      marca: null,
      modelo: null,
      anoRange: availableOptions.anoRange,
      precioRange: [0, availableOptions.precioRange[1] || 1000000],
      kilometrajeRange: [0, availableOptions.kilometrajeRange[1] || 500000],
      combustibles: [],
      transmisiones: []
    };
    setFilters(cleared);
  };

  const hasActiveFilters = useMemo(() => {
    return (
      filters.marca !== null ||
      filters.modelo !== null ||
      filters.anoRange[0] !== availableOptions.anoRange[0] ||
      filters.anoRange[1] !== availableOptions.anoRange[1] ||
      filters.precioRange[0] !== 0 ||
      filters.precioRange[1] !== (availableOptions.precioRange[1] || 1000000) ||
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
    availableModelos,
    updateFilters,
    clearFilters,
    hasActiveFilters
  };
}