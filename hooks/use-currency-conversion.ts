import { useState, useEffect, useCallback } from 'react';
import { DolarService } from '@/lib/services/dolar-service';
import { VehiculoConFotos } from '@/lib/supabase';

export interface UseCurrencyConversionReturn {
  preferredCurrency: 'ARS' | 'USD';
  setPreferredCurrency: (currency: 'ARS' | 'USD') => void;
  dollarRate: number;
  rateLoading: boolean;
  convertCurrency: (precio: number, fromCurrency: 'ARS' | 'USD', toCurrency: 'ARS' | 'USD') => number;
  convertVehiclePrice: (vehicle: VehiculoConFotos) => number;
  formatCurrency: (amount: number) => string;
}

export function useCurrencyConversion(): UseCurrencyConversionReturn {
  const [preferredCurrency, setPreferredCurrency] = useState<'ARS' | 'USD'>('ARS');
  const [dollarRate, setDollarRate] = useState<number>(1000);
  const [rateLoading, setRateLoading] = useState(false);

  // Fetch dollar rate on mount
  useEffect(() => {
    const fetchDollarRate = async () => {
      setRateLoading(true);
      try {
        const dolarService = DolarService.getInstance();
        const rate = await dolarService.getBlueDollarRate();
        setDollarRate(rate);
      } catch (error) {
        console.error('❌ API fetch failed, using manual rate:', error);
        const manualRate = 1400; // Fallback rate
        setDollarRate(manualRate);
      } finally {
        setRateLoading(false);
      }
    };

    fetchDollarRate();
  }, []);

  // Currency conversion logic
  const convertCurrency = useCallback((
    precio: number,
    fromCurrency: 'ARS' | 'USD',
    toCurrency: 'ARS' | 'USD'
  ): number => {
    if (fromCurrency === toCurrency) return precio;

    if (fromCurrency === 'USD' && toCurrency === 'ARS') {
      return precio * dollarRate;
    } else if (fromCurrency === 'ARS' && toCurrency === 'USD') {
      return precio / dollarRate;
    }
    return precio;
  }, [dollarRate]);

  // Convert vehicle price to preferred currency
  const convertVehiclePrice = useCallback((vehicle: VehiculoConFotos): number => {
    return convertCurrency(vehicle.precio || 0, vehicle.moneda, preferredCurrency);
  }, [convertCurrency, preferredCurrency]);

  // Format currency with proper locale
  const formatCurrency = useCallback((amount: number): string => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: preferredCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }, [preferredCurrency]);

  return {
    preferredCurrency,
    setPreferredCurrency,
    dollarRate,
    rateLoading,
    convertCurrency,
    convertVehiclePrice,
    formatCurrency,
  };
}