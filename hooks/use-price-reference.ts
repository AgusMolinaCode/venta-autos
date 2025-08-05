/**
 * React hook for price reference fetching with React Query
 */
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

interface VehicleData {
  marca: string;
  modelo: string;
  ano: number;
}

interface PriceStats {
  total: number;
  min: number;
  max: number;
  avg: number;
}

interface TopProduct {
  name: string;
  image: string;
  url: string;
  price: number;
  currency: 'USD' | 'ARS';
}

interface PriceReferenceData {
  vehicle: VehicleData;
  totalVehicles: number;
  exchangeRate: string;
  prices: {
    ars: PriceStats;
    usd: PriceStats;
  };
  topProducts: TopProduct[];
  timestamp: string;
}

interface PriceReferenceResponse {
  success: boolean;
  data?: PriceReferenceData;
  error?: string;
}

/**
 * Hook to fetch price reference data from external API
 */
export function usePriceReference(vehicle: VehicleData | null) {
  const [lastSearched, setLastSearched] = useState<string | null>(null);
  
  const queryKey = vehicle 
    ? ['price-reference', vehicle.marca, vehicle.modelo, vehicle.ano]
    : ['price-reference', 'disabled'];
  
  const query = useQuery({
    queryKey,
    queryFn: async (): Promise<PriceReferenceData> => {
      if (!vehicle || !vehicle.marca || !vehicle.modelo || !vehicle.ano) {
        throw new Error('Datos incompletos del vehículo');
      }
      
      const searchKey = `${vehicle.marca}-${vehicle.modelo}-${vehicle.ano}`;
      setLastSearched(searchKey);
      
      
      const response = await fetch('/api/price-reference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicle),
      });
      
      const result: PriceReferenceResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}`);
      }
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'No se encontraron datos de precios');
      }
      
      return result.data;
    },
    enabled: Boolean(
      vehicle && 
      vehicle.marca && 
      vehicle.modelo && 
      vehicle.ano && 
      vehicle.ano >= 1970 && 
      vehicle.ano <= 2025
    ),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
  
  // Manual refetch function
  const refetch = () => {
    if (vehicle) {
      setLastSearched(`${vehicle.marca}-${vehicle.modelo}-${vehicle.ano}`);
    }
    return query.refetch();
  };
  
  // Check if data is available
  const hasData = Boolean(query.data && query.data.totalVehicles > 0);
  
  // Check if current vehicle matches last searched
  const isCurrentVehicle = vehicle 
    ? `${vehicle.marca}-${vehicle.modelo}-${vehicle.ano}` === lastSearched
    : false;
  
  return {
    // Data
    data: query.data,
    
    // Loading states
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isRefetching: query.isRefetching,
    
    // Success/Error states
    isSuccess: query.isSuccess,
    isError: query.isError,
    error: query.error,
    
    // Data availability
    hasData,
    isEmpty: hasData && query.data?.totalVehicles === 0,
    
    // Vehicle tracking
    isCurrentVehicle,
    lastSearched,
    
    // Actions
    refetch,
    
    // Query status
    status: query.status,
    fetchStatus: query.fetchStatus,
    
    // Timing
    dataUpdatedAt: query.dataUpdatedAt,
    lastErrorAt: query.errorUpdatedAt,
    
    // Data staleness
    isStale: query.isStale,
  };
}

/**
 * Hook for checking if price reference is available for a vehicle
 */
export function useCanFetchPriceReference(vehicle: Partial<VehicleData>) {
  const canFetch = Boolean(
    vehicle.marca && 
    vehicle.modelo && 
    vehicle.ano && 
    vehicle.ano >= 1970 && 
    vehicle.ano <= 2025
  );
  
  const missingFields = [];
  if (!vehicle.marca) missingFields.push('marca');
  if (!vehicle.modelo) missingFields.push('modelo');
  if (!vehicle.ano) missingFields.push('año');
  else if (vehicle.ano < 1970 || vehicle.ano > 2025) missingFields.push('año válido');
  
  return {
    canFetch,
    missingFields,
    isReady: canFetch,
  };
}

/**
 * Debounced version of the price reference hook
 */
export function useDebouncedPriceReference(
  vehicle: VehicleData | null,
  delay: number = 1000
) {
  const [debouncedVehicle, setDebouncedVehicle] = useState<VehicleData | null>(null);
  
  // Debounce vehicle changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedVehicle(vehicle);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [vehicle, delay]);
  
  return usePriceReference(debouncedVehicle);
}