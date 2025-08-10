/**
 * Hook: useAutocosmosYears
 * Maneja la carga dinámica de años de vehículos desde Autocosmos con cache localStorage
 */

import { useState, useEffect, useCallback } from 'react';
import { VehicleYear } from '@/domain/entities/vehicle-year';
import { vehicleModelsCache, useAutoCleanup } from '@/utils/browser-cache';

interface UseAutocosmosYearsState {
  years: VehicleYear[];
  loading: boolean;
  error: string | null;
  hasYears: boolean;
  fromCache: boolean;
}

interface UseAutocosmosYearsReturn extends UseAutocosmosYearsState {
  fetchYears: (brand: string, model: string, force?: boolean) => Promise<void>;
  resetYears: () => void;
  retryFetch: () => void;
  clearCache: (brand?: string, model?: string) => void;
  getCacheInfo: (brand: string, model: string) => { exists: boolean; remainingTTL: number } | null;
}

export function useAutocosmosYears(): UseAutocosmosYearsReturn {
  const [state, setState] = useState<UseAutocosmosYearsState>({
    years: [],
    loading: false,
    error: null,
    hasYears: false,
    fromCache: false
  });

  const [lastBrandModel, setLastBrandModel] = useState<string>('');

  // Auto-cleanup del cache cada 30 minutos
  useAutoCleanup(vehicleModelsCache, 30);

  const resetYears = useCallback(() => {
    setState({
      years: [],
      loading: false,
      error: null,
      hasYears: false,
      fromCache: false
    });
    setLastBrandModel('');
  }, []);

  const fetchYears = useCallback(async (brand: string, model: string, force: boolean = false) => {
    if (!brand || brand.trim() === '' || !model || model.trim() === '') {
      resetYears();
      return;
    }

    const brandModelKey = `${brand}-${model}`;

    // Evitar fetch repetido para la misma marca y modelo (a menos que sea forzado)
    if (!force && lastBrandModel === brandModelKey && state.years.length > 0) {
      return;
    }

    const cacheKey = `years_${brand.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${model.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

    // Si es forzado, limpiar cache primero
    if (force) {
      vehicleModelsCache.remove(cacheKey);
    }

    // 1. Intentar cargar desde cache primero (solo si no es forzado)
    const cachedYears = !force ? vehicleModelsCache.get<Array<{
      year: number;
      value: string;
      displayText: string;
      brandSlug: string;
      modelSlug: string;
      isActive?: boolean;
    }>>(cacheKey) : null;

    if (cachedYears) {
      try {
        const years = cachedYears
          .filter(yearData => yearData.isActive !== false)
          .map(yearData => VehicleYear.fromApiData(yearData));

        setState({
          years,
          loading: false,
          error: null,
          hasYears: years.length > 0,
          fromCache: true
        });

        setLastBrandModel(brandModelKey);
        return;
      } catch (error) {
        // Si hay error deserializando del cache, lo limpiamos
        vehicleModelsCache.remove(cacheKey);
      }
    }

    // 2. Si no hay cache, mostrar loading y fetch desde API
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      fromCache: false
    }));

    try {
      const response = await fetch(`/api/autocosmos/years/${encodeURIComponent(brand)}/${encodeURIComponent(model)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || 'Error al cargar años');
      }

      if (!Array.isArray(data.data)) {
        throw new Error('Invalid response format: data.data is not an array');
      }

      const rawYears = data.data
        .filter((yearData: { isActive?: boolean }) => yearData.isActive !== false)
        .map((yearData: {
          year: number;
          value: string;
          displayText: string;
        }) => ({
          ...yearData,
          brandSlug: brand.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
          modelSlug: model.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
          isActive: true
        }));

      const years = rawYears.map((yearData: {
        year: number;
        value: string;
        displayText: string;
        brandSlug: string;
        modelSlug: string;
        isActive?: boolean;
      }) => VehicleYear.fromApiData(yearData));

      // 3. Guardar en cache (TTL: 5 días = 432000 segundos)
      vehicleModelsCache.set(cacheKey, rawYears, 432000);

      setState({
        years,
        loading: false,
        error: null,
        hasYears: years.length > 0,
        fromCache: false
      });

      setLastBrandModel(brandModelKey);

    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error desconocido al cargar años';

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        years: [],
        hasYears: false,
        fromCache: false
      }));
    }
  }, [lastBrandModel, state.years.length, resetYears]);

  const retryFetch = useCallback(() => {
    const [brand, model] = lastBrandModel.split('-', 2);
    if (brand && model) {
      fetchYears(brand, model, true); // Force refetch
    }
  }, [lastBrandModel, fetchYears]);

  // Función para limpiar cache
  const clearCache = useCallback((brand?: string, model?: string) => {
    if (brand && model) {
      const cacheKey = `years_${brand.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${model.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      vehicleModelsCache.remove(cacheKey);
    } else {
      // Limpiar todos los caches de años
      const keys = Object.keys(localStorage).filter(key => key.startsWith('vehicle_models_years_'));
      keys.forEach(key => localStorage.removeItem(key));
    }
  }, []);

  // Función para obtener información del cache
  const getCacheInfo = useCallback((brand: string, model: string) => {
    const cacheKey = `years_${brand.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${model.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const info = vehicleModelsCache.getInfo(cacheKey);
    
    if (!info) return null;
    
    return {
      exists: info.exists && !info.expired,
      remainingTTL: info.remainingTTL
    };
  }, []);

  // Limpiar cuando se desmonta el componente
  useEffect(() => {
    return () => {
      resetYears();
    };
  }, [resetYears]);

  return {
    ...state,
    fetchYears,
    resetYears,
    retryFetch,
    clearCache,
    getCacheInfo
  };
}