/**
 * Hook: useAutocosmosModels
 * Maneja la carga dinámica de modelos de vehículos desde Autocosmos con cache localStorage
 */

import { useState, useEffect, useCallback } from 'react';
import { VehicleModel } from '@/domain/entities/vehicle-model';
import { vehicleModelsCache, useAutoCleanup } from '@/utils/browser-cache';

interface UseAutocosmosModelsState {
  models: VehicleModel[];
  loading: boolean;
  error: string | null;
  hasModels: boolean;
  fromCache: boolean;
}

interface UseAutocosmosModelsReturn extends UseAutocosmosModelsState {
  fetchModels: (brand: string, force?: boolean) => Promise<void>;
  resetModels: () => void;
  retryFetch: () => void;
  clearCache: (brand?: string) => void;
  getCacheInfo: (brand: string) => { exists: boolean; remainingTTL: number } | null;
}

export function useAutocosmosModels(): UseAutocosmosModelsReturn {
  const [state, setState] = useState<UseAutocosmosModelsState>({
    models: [],
    loading: false,
    error: null,
    hasModels: false,
    fromCache: false
  });

  const [lastBrand, setLastBrand] = useState<string>('');

  // Auto-cleanup del cache cada 30 minutos
  useAutoCleanup(vehicleModelsCache, 30);

  const resetModels = useCallback(() => {
    setState({
      models: [],
      loading: false,
      error: null,
      hasModels: false,
      fromCache: false
    });
    setLastBrand('');
  }, []);

  const fetchModels = useCallback(async (brand: string, force: boolean = false) => {
    if (!brand || brand.trim() === '') {
      resetModels();
      return;
    }

    // Evitar fetch repetido para la misma marca (a menos que sea forzado)
    if (!force && lastBrand === brand && state.models.length > 0) {
      return;
    }

    const cacheKey = `models_${brand.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

    // Si es forzado, limpiar cache primero
    if (force) {
      vehicleModelsCache.remove(cacheKey);
    }

    // 1. Intentar cargar desde cache primero (solo si no es forzado)
    const cachedModels = !force ? vehicleModelsCache.get<Array<{
      name: string;
      slug: string;
      brandSlug: string;
      displayName?: string;
      isActive?: boolean;
    }>>(cacheKey) : null;

    if (cachedModels) {
      try {
        const models = cachedModels
          .filter(modelData => modelData.isActive !== false)
          .map(modelData => VehicleModel.fromApiData(modelData));

        setState({
          models,
          loading: false,
          error: null,
          hasModels: models.length > 0,
          fromCache: true
        });

        setLastBrand(brand);
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
      const response = await fetch(`/api/autocosmos/models/${encodeURIComponent(brand)}`, {
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
        throw new Error(data.error?.message || 'Error al cargar modelos');
      }

      if (!Array.isArray(data.data)) {
        throw new Error('Invalid response format: data.data is not an array');
      }

      const rawModels = data.data
        .filter((modelData: { isActive?: boolean }) => modelData.isActive !== false);

      const models = rawModels.map((modelData: {
        name: string;
        slug: string;
        brandSlug: string;
        displayName?: string;
        isActive?: boolean;
      }) => VehicleModel.fromApiData(modelData));

      // 3. Guardar en cache (TTL: 5 días = 432000 segundos)
      vehicleModelsCache.set(cacheKey, rawModels, 432000);

      setState({
        models,
        loading: false,
        error: null,
        hasModels: models.length > 0,
        fromCache: false
      });

      setLastBrand(brand);

    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error desconocido al cargar modelos';

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        models: [],
        hasModels: false,
        fromCache: false
      }));
    }
  }, [lastBrand, state.models.length, resetModels]);

  const retryFetch = useCallback(() => {
    if (lastBrand) {
      fetchModels(lastBrand, true); // Force refetch
    }
  }, [lastBrand, fetchModels]);

  // Función para limpiar cache
  const clearCache = useCallback((brand?: string) => {
    if (brand) {
      const cacheKey = `models_${brand.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      vehicleModelsCache.remove(cacheKey);
    } else {
      vehicleModelsCache.clear();
    }
  }, []);

  // Función para obtener información del cache
  const getCacheInfo = useCallback((brand: string) => {
    const cacheKey = `models_${brand.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
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
      resetModels();
    };
  }, [resetModels]);

  return {
    ...state,
    fetchModels,
    resetModels,
    retryFetch,
    clearCache,
    getCacheInfo
  };
}