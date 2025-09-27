"use client";

import { useState, useMemo, useEffect } from 'react';
import { VehiculoConFotos } from '@/lib/supabase';
import { FilterState } from '@/components/landing/brand-filters/brand-filter-panel';

interface UseBrandFiltersProps {
  vehicles: VehiculoConFotos[];
  selectedCurrency?: 'ARS' | 'USD';
  blueDollarRate?: number;
}

export function useBrandFilters({ vehicles, selectedCurrency = 'ARS', blueDollarRate = 1000 }: UseBrandFiltersProps) {
  // Helper function to get vehicle price in ARS for consistent sorting
  const getVehiclePriceInARS = (vehicle: VehiculoConFotos): number => {
    if (!vehicle.precio) return 0;
    if (vehicle.moneda === 'ARS') return vehicle.precio;
    if (vehicle.moneda === 'USD') return vehicle.precio * blueDollarRate;
    return 0;
  };
  // Get available options based on current vehicles
  const availableOptions = useMemo(() => {
    if (vehicles.length === 0) {
      return {
        modelos: [],
        anoRange: [1970, 2025] as [number, number],
        kilometrajeRange: [0, 500000] as [number, number],
        combustibles: [],
        transmisiones: []
      };
    }

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

  const [filters, setFilters] = useState<FilterState>({
    modelo: null,
    anoRange: availableOptions.anoRange,
    kilometrajeRange: [0, availableOptions.kilometrajeRange[1]],
    combustibles: [],
    transmisiones: [],
    sortBy: null
  });

  // Filter and sort vehicles based on current filter state
  const filteredVehicles = useMemo(() => {
    // First, filter vehicles
    const filtered = vehicles.filter((vehicle) => {
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

    // Then, sort the filtered results
    if (!filters.sortBy) {
      return filtered;
    }

    return [...filtered].sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return getVehiclePriceInARS(a) - getVehiclePriceInARS(b);
        case 'price-desc':
          return getVehiclePriceInARS(b) - getVehiclePriceInARS(a);
        case 'year-desc':
          return (b.ano || 0) - (a.ano || 0);
        case 'year-asc':
          return (a.ano || 0) - (b.ano || 0);
        case 'km-asc':
          return (a.kilometraje || 0) - (b.kilometraje || 0);
        default:
          return 0;
      }
    });
  }, [vehicles, filters, blueDollarRate]);

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

  const updateFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      modelo: null,
      anoRange: availableOptions.anoRange,
      kilometrajeRange: [0, availableOptions.kilometrajeRange[1]],
      combustibles: [],
      transmisiones: [],
      sortBy: null
    });
  };

  const hasActiveFilters = useMemo(() => {
    // Solo considerar filtros activos si realmente restringen los resultados
    return (
      filters.modelo !== null ||
      (availableOptions.anoRange.length > 0 && (
        filters.anoRange[0] !== availableOptions.anoRange[0] ||
        filters.anoRange[1] !== availableOptions.anoRange[1]
      )) ||
      (availableOptions.kilometrajeRange.length > 0 && (
        filters.kilometrajeRange[0] !== 0 ||
        filters.kilometrajeRange[1] !== availableOptions.kilometrajeRange[1]
      )) ||
      filters.combustibles.length > 0 ||
      filters.transmisiones.length > 0 ||
      filters.sortBy !== null
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