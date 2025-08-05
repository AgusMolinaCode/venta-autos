import { useCallback } from "react";
import { useAutocosmosModels } from "@/hooks/use-autocosmos-models";
import { useAutocosmosYears } from "@/hooks/use-autocosmos-years";
import { marcasAutos } from "@/constants";
import { UseAutocosmosDataReturn } from "../types/VehicleFormTypes";

/**
 * Custom hook that combines Autocosmos models and years data fetching
 * Provides unified interface for data management and manual brand detection
 */
export const useAutocosmosData = (): UseAutocosmosDataReturn => {
  // Models hook
  const {
    models,
    loading: modelsLoading,
    error: modelsError,
    hasModels,
    fetchModels,
    resetModels,
    retryFetch: retryFetchModels,
  } = useAutocosmosModels();

  // Years hook
  const {
    years,
    loading: yearsLoading,
    error: yearsError,
    hasYears,
    fetchYears,
    resetYears,
    retryFetch: retryFetchYears,
  } = useAutocosmosYears();

  /**
   * Determines if a brand is manually entered (not in predefined list)
   */
  const isManualBrand = useCallback((brand: string): boolean => {
    return brand && brand.trim() !== "" && !marcasAutos.includes(brand);
  }, []);

  return {
    // Models data
    models,
    modelsLoading,
    modelsError,
    hasModels,
    fetchModels,
    resetModels,
    retryFetchModels,

    // Years data
    years,
    yearsLoading,
    yearsError,
    hasYears,
    fetchYears,
    resetYears,
    retryFetchYears,

    // Utilities
    isManualBrand,
  };
};