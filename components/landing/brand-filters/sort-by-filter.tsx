"use client";

import { useState, useEffect, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DolarService } from "@/lib/services/dolar-service";
import { SortByFilterProps } from "./types";

export function SortByFilter({
  sortBy,
  vehicles,
  blueDollarRate,
  onFilterChange,
  variant = 'vertical',
  className
}: SortByFilterProps) {
  const [localBlueDollarRate, setLocalBlueDollarRate] = useState<number>(1500);

  // Fetch blue dollar rate on component mount
  useEffect(() => {
    const fetchDollarRate = async () => {
      try {
        const dolarService = DolarService.getInstance();
        const rate = await dolarService.getBlueDollarRate();
        setLocalBlueDollarRate(rate);
      } catch (error) {
        console.warn('[SortByFilter] Could not fetch dollar rate, using fallback');
      }
    };

    if (!blueDollarRate) {
      fetchDollarRate();
    }
  }, [blueDollarRate]);

  const currentRate = blueDollarRate || localBlueDollarRate;

  // Calculate price range for better sort options
  const priceInfo = useMemo(() => {
    if (vehicles.length === 0) return null;

    const prices = vehicles
      .map(v => {
        if (!v.precio) return 0;
        return v.moneda === 'USD' ? v.precio * currentRate : v.precio;
      })
      .filter(p => p > 0);

    if (prices.length === 0) return null;

    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      hasVariation: Math.max(...prices) > Math.min(...prices)
    };
  }, [vehicles, currentRate]);

  const isCompact = variant === 'horizontal';

  const sortOptions = [
    { value: "none", label: isCompact ? "Sin orden" : "Sin ordenar" },
    { value: "price-asc", label: isCompact ? "$ ↑" : "Precio: Menor a Mayor" },
    { value: "price-desc", label: isCompact ? "$ ↓" : "Precio: Mayor a Menor" },
    { value: "year-desc", label: isCompact ? "Año ↓" : "Año: Más Nuevo" },
    { value: "year-asc", label: isCompact ? "Año ↑" : "Año: Más Antiguo" },
    { value: "km-asc", label: isCompact ? "KM ↑" : "Kilometraje: Menor" },
  ];

  return (
    <div className={`space-y-${isCompact ? '1' : '3'} ${className || ''}`}>
      <label className={`text-${isCompact ? 'xs' : 'sm'} font-medium ${isCompact ? 'text-gray-600 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
        {isCompact ? "Ordenar" : "Ordenar por"}
      </label>
      <Select
        value={sortBy || "none"}
        onValueChange={(value) =>
          onFilterChange({ sortBy: value === "none" ? null : value as NonNullable<typeof sortBy> })
        }
      >
        <SelectTrigger className={`w-full ${isCompact ? 'h-6 text-xs' : ''}`}>
          <SelectValue placeholder={isCompact ? "Sin orden" : "Sin ordenar"} />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Debug info for development (remove in production) */}
      {process.env.NODE_ENV === 'development' && priceInfo && (
        <div className="text-xs text-gray-500">
          Rate: ${currentRate.toFixed(0)} | Prices: ${(priceInfo.min/1000).toFixed(0)}K - ${(priceInfo.max/1000).toFixed(0)}K
        </div>
      )}
    </div>
  );
}