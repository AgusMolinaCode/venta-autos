"use client";

import { useState, useCallback, useMemo } from "react";
import { VehiculoConFotos } from "@/lib/supabase";

interface UseVehicleSearchReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredVehicles: VehiculoConFotos[];
  isSearching: boolean;
  searchResultsCount: number;
  clearSearch: () => void;
  hasActiveSearch: boolean;
}

interface UseVehicleSearchOptions {
  vehicles: VehiculoConFotos[];
  debounceMs?: number;
}

export function useVehicleSearch({
  vehicles,
  debounceMs = 300,
}: UseVehicleSearchOptions): UseVehicleSearchReturn {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Memoized filtered vehicles based on search query
  const filteredVehicles = useMemo(() => {
    if (!searchQuery.trim()) {
      return vehicles;
    }

    const searchTerm = searchQuery.toLowerCase().trim();
    
    return vehicles.filter((vehicle) => {
      // Search in marca
      const marca = vehicle.marca?.toLowerCase() || "";
      if (marca.includes(searchTerm)) return true;

      // Search in modelo
      const modelo = vehicle.modelo?.toLowerCase() || "";
      if (modelo.includes(searchTerm)) return true;

      // Search in año (as string)
      const ano = vehicle.ano?.toString() || "";
      if (ano.includes(searchTerm)) return true;

      // Search in version (optional field)
      const version = vehicle.version?.toLowerCase() || "";
      if (version.includes(searchTerm)) return true;

      // Search in color (optional field)
      const color = vehicle.color?.toLowerCase() || "";
      if (color.includes(searchTerm)) return true;

      return false;
    });
  }, [vehicles, searchQuery]);

  // Clear search function
  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setIsSearching(false);
  }, []);

  // Computed values
  const searchResultsCount = filteredVehicles.length;
  const hasActiveSearch = searchQuery.trim().length > 0;

  // Debounced search query setter
  const debouncedSetSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
    
    if (query.trim()) {
      setIsSearching(true);
      // Simulate search delay for better UX
      const timeoutId = setTimeout(() => {
        setIsSearching(false);
      }, debounceMs);
      
      return () => clearTimeout(timeoutId);
    } else {
      setIsSearching(false);
    }
  }, [debounceMs]);

  return {
    searchQuery,
    setSearchQuery: debouncedSetSearchQuery,
    filteredVehicles,
    isSearching,
    searchResultsCount,
    clearSearch,
    hasActiveSearch,
  };
}