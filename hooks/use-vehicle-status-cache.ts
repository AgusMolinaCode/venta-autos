"use client";

import { useState, useEffect, useCallback } from "react";
import { EstadoType } from "@/constants";

// Cache en memoria para los estados de vehículos
type VehicleStatusCache = Record<string, EstadoType>;

// Clave para localStorage
const CACHE_KEY = "vehicle-status-cache";

// Cache global en memoria para toda la aplicación
let globalStatusCache: VehicleStatusCache = {};

export function useVehicleStatusCache() {
  const [statusCache, setStatusCache] =
    useState<VehicleStatusCache>(globalStatusCache);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar cache desde localStorage al inicializar
  useEffect(() => {
    try {
      const savedCache = localStorage.getItem(CACHE_KEY);
      if (savedCache) {
        const parsedCache = JSON.parse(savedCache);
        globalStatusCache = parsedCache;
        setStatusCache(parsedCache);
      }
    } catch (error) {
      console.warn("⚠️ Error al cargar cache desde localStorage:", error);
    }
  }, []);

  // Guardar cache en localStorage cuando cambie
  const saveToStorage = useCallback((cache: VehicleStatusCache) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
      console.warn("⚠️ Error al guardar cache en localStorage:", error);
    }
  }, []);

  // Obtener estado de un vehículo
  const getVehicleStatus = useCallback((vehicleId: string): EstadoType => {
    return globalStatusCache[vehicleId] || "preparación";
  }, []);

  // Actualizar estado de un vehículo
  const updateVehicleStatus = useCallback(
    async (vehicleId: string, newStatus: EstadoType): Promise<boolean> => {
      setIsLoading(true);

      try {
        // Simular una pequeña demora para UX realista
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Actualizar cache global
        globalStatusCache = {
          ...globalStatusCache,
          [vehicleId]: newStatus,
        };

        // Actualizar estado local
        setStatusCache(globalStatusCache);

        // Guardar en localStorage
        saveToStorage(globalStatusCache);

        return true;
      } catch (error) {
        console.error("❌ Error al actualizar estado en cache:", error);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [saveToStorage],
  );

  // Limpiar cache
  const clearCache = useCallback(() => {
    globalStatusCache = {};
    setStatusCache({});
    localStorage.removeItem(CACHE_KEY);
  }, []);

  // Obtener estadísticas del cache
  const getCacheStats = useCallback(() => {
    const stats = Object.values(globalStatusCache).reduce(
      (acc, status) => {
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<EstadoType, number>,
    );

    return {
      total: Object.keys(globalStatusCache).length,
      byStatus: stats,
    };
  }, []);

  return {
    statusCache,
    isLoading,
    getVehicleStatus,
    updateVehicleStatus,
    clearCache,
    getCacheStats,
  };
}
