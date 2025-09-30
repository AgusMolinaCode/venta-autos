"use client";

import { useCallback, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase, VehiculoConFotos } from "@/lib/supabase";

interface UseAllVehiclesReturn {
  vehicles: VehiculoConFotos[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Query key for all vehicles
const getAllVehiclesQueryKey = () => ["all-vehicles"];

// Fetch function for React Query - gets all vehicles from all users
async function fetchAllVehicles(): Promise<VehiculoConFotos[]> {
  try {
    // First try with estado filter (if column exists)
    const { data, error: fetchError } = await supabase
      .from("vehiculos")
      .select(
        `
        *,
        fotos:vehiculo_fotos(*)
      `
      )
      .eq("estado", "publicado")
      .order("created_at", { ascending: false });

    // If column doesn't exist, fetch all vehicles without filter
    if (
      fetchError &&
      fetchError.message.includes("column vehiculos.estado does not exist")
    ) {
      console.warn(
        "Column vehiculos.estado does not exist. Fetching all vehicles without estado filter."
      );
      console.info(
        "To add estado column, run the migration script: add-estado-column-migration.sql"
      );

      const { data: allData, error: allError } = await supabase
        .from("vehiculos")
        .select(
          `
          *,
          fotos:vehiculo_fotos(*)
        `
        )
        .order("created_at", { ascending: false });

      if (allError) {
        throw new Error(`Error al cargar vehículos: ${allError.message}`);
      }
      return allData || [];
    }

    if (fetchError) {
      throw new Error(`Error al cargar vehículos: ${fetchError.message}`);
    }
    return data || [];
  } catch (error) {
    console.error("Error in fetchAllVehicles:", error);
    throw error;
  }
}

export function useAllVehicles(): UseAllVehiclesReturn {
  const queryClient = useQueryClient();

  // Page Visibility API to prevent refetch on tab changes
  const [isPageVisible, setIsPageVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const {
    data: vehicles = [],
    isLoading: loading,
    error,
    refetch: reactQueryRefetch,
  } = useQuery({
    queryKey: getAllVehiclesQueryKey(),
    queryFn: fetchAllVehicles,
    enabled: isPageVisible, // Only fetch if page is visible
    staleTime: 30 * 1000, // ✅ Reducido a 30 segundos para mayor responsividad
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false, // Prevent refetch on tab focus
    refetchOnMount: false, // Don't refetch on mount if we have data
    retry: 2,
  });

  const refetch = useCallback(async () => {
    await reactQueryRefetch();
  }, [reactQueryRefetch]);

  return {
    vehicles,
    loading,
    error: error?.message || null,
    refetch,
  };
}
