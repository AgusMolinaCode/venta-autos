"use client";

import { useState, useMemo } from "react";
import { VehiculoConFotos } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Filter, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { COMBUSTIBLES, TRANSMISIONES } from "@/constants";
import { SortByFilter } from "./sort-by-filter";
import { ModelFilter } from "./model-filter";
import { RangeFilter } from "./range-filter";
import { MultiSelectFilter } from "./multi-select-filter";
import { FilterState, FilterOptions } from "./types";

interface BrandFilterPanelProps {
  vehicles: VehiculoConFotos[];
  onFilterChange: (filters: FilterState) => void;
  className?: string;
  variant?: 'horizontal' | 'vertical';
  selectedCurrency?: 'ARS' | 'USD';
  blueDollarRate?: number;
  onCurrencyChange?: (currency: 'ARS' | 'USD') => void;
  onBlueDollarRateChange?: (rate: number) => void;
}

export function BrandFilterPanel({
  vehicles,
  onFilterChange,
  className,
  variant = 'horizontal',
  blueDollarRate,
}: BrandFilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Extract unique values from vehicles for filtering
  const filterOptions = useMemo((): FilterOptions => {
    if (vehicles.length === 0) {
      return {
        modelos: [],
        anoRange: [1970, 2025],
        kilometrajeRange: [0, 500000],
      };
    }

    const modelos = [...new Set(vehicles.map((v) => v.modelo))].sort();
    const anos = vehicles.map((v) => v.ano).filter(Boolean);
    const kilometrajes = vehicles.map((v) => v.kilometraje).filter(Boolean);

    const anoMin = anos.length > 0 ? Math.min(...anos) : 1970;
    const anoMax = anos.length > 0 ? Math.max(...anos) : 2025;
    const kmMax = kilometrajes.length > 0 ? Math.max(...kilometrajes as number[]) : 500000;

    return {
      modelos,
      anoRange: [anoMin, anoMax],
      kilometrajeRange: [0, kmMax],
    };
  }, [vehicles]);

  const [filters, setFilters] = useState<FilterState>({
    modelo: null,
    anoRange: filterOptions.anoRange,
    kilometrajeRange: [0, filterOptions.kilometrajeRange[1]],
    combustibles: [],
    transmisiones: [],
    sortBy: null,
  });

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  const clearFilters = () => {
    const cleared: FilterState = {
      modelo: null,
      anoRange: filterOptions.anoRange,
      kilometrajeRange: [0, filterOptions.kilometrajeRange[1] || 500000],
      combustibles: [],
      transmisiones: [],
      sortBy: null,
    };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.modelo) count++;

    // Solo contar como filtro activo si el rango difiere significativamente de los valores reales
    if (filterOptions.anoRange.length > 0) {
      if (
        filters.anoRange[0] !== filterOptions.anoRange[0] ||
        filters.anoRange[1] !== filterOptions.anoRange[1]
      ) {
        count++;
      }
    }

    if (filterOptions.kilometrajeRange.length > 0) {
      if (
        filters.kilometrajeRange[0] !== 0 ||
        filters.kilometrajeRange[1] !== filterOptions.kilometrajeRange[1]
      ) {
        count++;
      }
    }

    if (filters.combustibles.length > 0) count++;
    if (filters.transmisiones.length > 0) count++;
    if (filters.sortBy) count++;
    return count;
  }, [filters, filterOptions]);


  if (variant === 'vertical') {
    return (
      <>
        {/* Mobile Filter Toggle Button - Solo visible en mobile */}
        <Button
          variant="outline"
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden w-full mb-4 justify-start"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros de Marca
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        {/* Desktop Sidebar */}
        <div
          className={cn(
            "hidden lg:block bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700",
            className
          )}
        >
          {/* Filter Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Filtros de Marca</h3>
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {activeFilterCount}
                  </Badge>
                )}
              </div>
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-6 px-2 text-xs text-gray-600 dark:text-gray-400"
                >
                  <X className="h-3 w-3 mr-1" />
                  Limpiar
                </Button>
              )}
            </div>
          </div>

          {/* Filter Content */}
          <div className="p-4">
            <div className="space-y-6">
              <SortByFilter
                sortBy={filters.sortBy}
                vehicles={vehicles}
                blueDollarRate={blueDollarRate}
                onFilterChange={updateFilters}
                variant="vertical"
              />

              <ModelFilter
                modelo={filters.modelo}
                modelos={filterOptions.modelos}
                onFilterChange={updateFilters}
                variant="vertical"
              />

              <RangeFilter
                range={filters.anoRange}
                min={filterOptions.anoRange[0]}
                max={filterOptions.anoRange[1]}
                step={1}
                label="Año"
                onFilterChange={updateFilters}
                variant="vertical"
              />

              <RangeFilter
                range={filters.kilometrajeRange}
                min={0}
                max={filterOptions.kilometrajeRange[1]}
                step={5000}
                label="Kilometraje"
                formatValue={(value) => `${(value / 1000).toFixed(0)}k`}
                onFilterChange={updateFilters}
                variant="vertical"
              />

              <MultiSelectFilter
                selected={filters.combustibles}
                options={COMBUSTIBLES}
                label="Combustible"
                onFilterChange={updateFilters}
                variant="vertical"
              />

              <MultiSelectFilter
                selected={filters.transmisiones}
                options={TRANSMISIONES}
                label="Transmisión"
                onFilterChange={updateFilters}
                variant="vertical"
              />
            </div>
          </div>
        </div>

        {/* Mobile Overlay Filter Modal */}
        {isMobileOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
            <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white dark:bg-gray-900 shadow-xl">
              {/* Mobile Filter Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Filtros de Marca</h3>
                    {activeFilterCount > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileOpen(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="mt-2 h-8 px-3 text-xs text-gray-600 dark:text-gray-400"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Limpiar todos los filtros
                  </Button>
                )}
              </div>

              {/* Mobile Filter Content */}
              <div className="p-4 overflow-y-auto h-[calc(100vh-100px)]">
                <div className="space-y-6">
                  <SortByFilter
                    sortBy={filters.sortBy}
                    vehicles={vehicles}
                    blueDollarRate={blueDollarRate}
                    onFilterChange={updateFilters}
                    variant="vertical"
                  />

                  <ModelFilter
                    modelo={filters.modelo}
                    modelos={filterOptions.modelos}
                    onFilterChange={updateFilters}
                    variant="vertical"
                  />

                  <RangeFilter
                    range={filters.anoRange}
                    min={filterOptions.anoRange[0]}
                    max={filterOptions.anoRange[1]}
                    step={1}
                    label="Año"
                    onFilterChange={updateFilters}
                    variant="vertical"
                  />

                  <RangeFilter
                    range={filters.kilometrajeRange}
                    min={0}
                    max={filterOptions.kilometrajeRange[1]}
                    step={5000}
                    label="Kilometraje"
                    formatValue={(value) => `${(value / 1000).toFixed(0)}k`}
                    onFilterChange={updateFilters}
                    variant="vertical"
                  />

                  <MultiSelectFilter
                    selected={filters.combustibles}
                    options={COMBUSTIBLES}
                    label="Combustible"
                    onFilterChange={updateFilters}
                    variant="vertical"
                  />

                  <MultiSelectFilter
                    selected={filters.transmisiones}
                    options={TRANSMISIONES}
                    label="Transmisión"
                    onFilterChange={updateFilters}
                    variant="vertical"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Layout horizontal original para backward compatibility
  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700",
        className
      )}
    >
      {/* Compact Filter Bar */}
      <div className="p-3">
        {/* Compact Filter Content */}
        <div
          className={cn(
            "grid gap-3",
            !isExpanded && "hidden lg:grid",
            "grid-cols-1 md:grid-cols-2 lg:grid-cols-6"
          )}
        >
          <div className="flex gap-3">
            <SortByFilter
              sortBy={filters.sortBy}
              vehicles={vehicles}
              blueDollarRate={blueDollarRate}
              onFilterChange={updateFilters}
              variant="horizontal"
            />

            <ModelFilter
              modelo={filters.modelo}
              modelos={filterOptions.modelos}
              onFilterChange={updateFilters}
              variant="horizontal"
            />

            <div className="flex items-center gap-1">
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-7 px-2 text-xs text-gray-600 dark:text-gray-400"
                >
                  <X className="h-3 w-3 mr-1" />
                  Limpiar
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-7 px-2 lg:hidden"
              >
                <ChevronDown
                  className={cn(
                    "h-3 w-3 transition-transform",
                    isExpanded && "rotate-180"
                  )}
                />
              </Button>
            </div>
          </div>

          <RangeFilter
            range={filters.anoRange}
            min={filterOptions.anoRange[0]}
            max={filterOptions.anoRange[1]}
            step={1}
            label="Año"
            onFilterChange={updateFilters}
            variant="horizontal"
          />

          <RangeFilter
            range={filters.kilometrajeRange}
            min={0}
            max={filterOptions.kilometrajeRange[1]}
            step={5000}
            label="Kilometraje"
            formatValue={(value) => `${(value / 1000).toFixed(0)}k`}
            onFilterChange={updateFilters}
            variant="horizontal"
          />

          <MultiSelectFilter
            selected={filters.combustibles}
            options={COMBUSTIBLES}
            label="Combustible"
            onFilterChange={updateFilters}
            variant="horizontal"
          />

          <MultiSelectFilter
            selected={filters.transmisiones}
            options={TRANSMISIONES}
            label="Transmisión"
            onFilterChange={updateFilters}
            variant="horizontal"
          />
        </div>
      </div>
    </div>
  );
}
