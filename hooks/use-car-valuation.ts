"use client";
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CarValuationService, type CarValuationRequest, type CarValuationResponse } from '@/lib/services/car-valuation';

interface UseCarValuationOptions {
  onSuccess?: (data: CarValuationResponse[]) => void;
  onError?: (error: Error) => void;
}

export const useCarValuation = (options?: UseCarValuationOptions) => {
  const queryClient = useQueryClient();
  const [lastRequest, setLastRequest] = useState<CarValuationRequest | null>(null);

  const mutation = useMutation({
    mutationFn: CarValuationService.getCarValuation,
    onMutate: (variables) => {
    },
    onSuccess: (data, variables) => {
      
      setLastRequest(variables);
      // Cache the result for potential reuse
      queryClient.setQueryData(['car-valuation', variables], data);
      
      
      options?.onSuccess?.(data);
    },
    onError: (error: Error) => {
      console.error('❌ [HOOK] Car valuation mutation failed:', error);
      options?.onError?.(error);
    },
  });

  const getCachedResult = useCallback((request: CarValuationRequest) => {
    return queryClient.getQueryData<CarValuationResponse[]>(['car-valuation', request]);
  }, [queryClient]);

  const invalidateCache = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['car-valuation'] });
  }, [queryClient]);

  return {
    // State
    isLoading: mutation.isPending,
    error: mutation.error,
    data: mutation.data,
    lastRequest,

    // Actions
    getValuation: mutation.mutate,
    getCachedResult,
    invalidateCache,
    reset: mutation.reset,

    // Computed
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
};

// Hook for querying cached valuations
export const useCachedCarValuation = (request: CarValuationRequest | null) => {
  return useQuery({
    queryKey: ['car-valuation', request],
    queryFn: () => CarValuationService.getCarValuation(request!),
    enabled: !!request,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};