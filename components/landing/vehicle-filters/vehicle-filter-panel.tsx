"use client";

import { useState, useMemo } from "react";
import { VehiculoConFotos } from "@/lib/supabase";
import { VehicleFilterState } from "@/hooks/use-vehicle-filters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Filter, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { COMBUSTIBLES, TRANSMISIONES } from "@/constants";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
// Import modular filter components
import { BrandFilter } from "../brand-filters/brand-filter";
import { SortByFilter } from "../brand-filters/sort-by-filter";
import { ModelFilter } from "../brand-filters/model-filter";
import { RangeFilter } from "../brand-filters/range-filter";
import { MultiSelectFilter } from "../brand-filters/multi-select-filter";
import { FilterState } from "../brand-filters/types";

interface VehicleFilterPanelProps {
  vehicles: VehiculoConFotos[];
  onFilterChange: (filters: VehicleFilterState) => void;
  className?: string;
  variant?: "horizontal" | "vertical";
  blueDollarRate?: number;
}

export function VehicleFilterPanel({
  vehicles,
  onFilterChange,
  className,
  variant = "horizontal",
  blueDollarRate,
}: VehicleFilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Extract unique values from vehicles
  const filterOptions = useMemo(() => {
    const marcas = [...new Set(vehicles.map((v) => v.marca))].sort();
    const modelos = [...new Set(vehicles.map((v) => v.modelo))].sort();
    const anos = vehicles.map((v) => v.ano).filter(Boolean);
    const kilometrajes = vehicles.map((v) => v.kilometraje).filter(Boolean);

    // Handle empty arrays with fallback values
    const anoMin = anos.length > 0 ? Math.min(...anos) : 1970;
    const anoMax = anos.length > 0 ? Math.max(...anos) : 2025;
    const kmMax =
      kilometrajes.length > 0
        ? Math.max(...(kilometrajes as number[]))
        : 500000;

    return {
      marcas,
      modelos,
      anoRange: [anoMin, anoMax] as [number, number],
      kilometrajeRange: [0, kmMax] as [number, number],
    };
  }, [vehicles]);

  const [filters, setFilters] = useState<VehicleFilterState>({
    marca: null,
    modelo: null,
    anoRange: filterOptions.anoRange,
    kilometrajeRange: [0, filterOptions.kilometrajeRange[1] || 500000],
    combustibles: [],
    transmisiones: [],
    sortBy: null,
  });

  // Get available modelos for selected marca
  const availableModelos = useMemo(() => {
    if (!filters.marca) {
      return filterOptions.modelos;
    }
    return [
      ...new Set(
        vehicles.filter((v) => v.marca === filters.marca).map((v) => v.modelo)
      ),
    ].sort();
  }, [vehicles, filters.marca, filterOptions.modelos]);

  const updateFilters = (newFilters: Partial<VehicleFilterState>) => {
    const updated = { ...filters, ...newFilters };

    // If marca changes, reset modelo
    if (newFilters.marca !== undefined && newFilters.marca !== filters.marca) {
      updated.modelo = null;
    }

    setFilters(updated);
    onFilterChange(updated);
  };

  // Handler for modular filter components
  const handleModularFilterChange = (filterUpdates: Partial<FilterState>) => {
    updateFilters(filterUpdates);
  };

  const clearFilters = () => {
    const cleared: VehicleFilterState = {
      marca: null,
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
    if (filters.marca) count++;
    if (filters.modelo) count++;
    if (
      filters.anoRange[0] !== filterOptions.anoRange[0] ||
      filters.anoRange[1] !== filterOptions.anoRange[1]
    )
      count++;
    if (
      filters.kilometrajeRange[0] !== 0 ||
      filters.kilometrajeRange[1] !==
        (filterOptions.kilometrajeRange[1] || 500000)
    )
      count++;
    if (filters.combustibles.length > 0) count++;
    if (filters.transmisiones.length > 0) count++;
    if (filters.sortBy) count++;
    return count;
  }, [filters, filterOptions]);

  if (variant === "vertical") {
    return (
      <>
        {/* Mobile Filter Toggle Button - Solo visible en mobile */}
        <Button
          variant="outline"
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden w-full mb-4 justify-start"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        {/* Desktop Sidebar */}
        <div
          className={cn(
            "hidden lg:block bg-background rounded-lg shadow-sm border border-gray-200 dark:border-gray-700",
            className
          )}
        >
          {/* Filter Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  Filtros
                </h3>
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
                onFilterChange={handleModularFilterChange}
                variant="vertical"
              />

              <BrandFilter
                marca={filters.marca}
                marcas={filterOptions.marcas}
                onFilterChange={updateFilters}
                variant="vertical"
              />

              <ModelFilter
                modelo={filters.modelo}
                modelos={availableModelos}
                onFilterChange={handleModularFilterChange}
                variant="vertical"
              />

              <RangeFilter
                range={filters.anoRange}
                min={filterOptions.anoRange[0]}
                max={filterOptions.anoRange[1]}
                step={1}
                label="Año"
                onFilterChange={handleModularFilterChange}
                variant="vertical"
              />

              <RangeFilter
                range={filters.kilometrajeRange}
                min={0}
                max={filterOptions.kilometrajeRange[1]}
                step={5000}
                label="Kilometraje"
                formatValue={(value) => `${(value / 1000).toFixed(0)}k`}
                onFilterChange={handleModularFilterChange}
                variant="vertical"
              />

              <MultiSelectFilter
                selected={filters.combustibles}
                options={COMBUSTIBLES}
                label="Combustible"
                onFilterChange={handleModularFilterChange}
                variant="vertical"
              />

              <MultiSelectFilter
                selected={filters.transmisiones}
                options={TRANSMISIONES}
                label="Transmisión"
                onFilterChange={handleModularFilterChange}
                variant="vertical"
              />
            </div>
          </div>
        </div>

        {/* Mobile Sheet Filter */}
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetContent side="left" className="w-full sm:max-w-sm p-0">
            <SheetHeader className="p-4 border-b border-gray-200 dark:border-gray-700">
              <SheetTitle className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                Filtros
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {activeFilterCount}
                  </Badge>
                )}
              </SheetTitle>
              <SheetDescription>
                Personaliza tu búsqueda de vehículos
              </SheetDescription>
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="mt-2 h-8 px-3 text-xs text-gray-600 dark:text-gray-400 w-fit"
                >
                  <X className="h-3 w-3 mr-1" />
                  Limpiar todos los filtros
                </Button>
              )}
            </SheetHeader>

            {/* Mobile Filter Content */}
            <div className="p-4 overflow-y-auto h-[calc(100vh-180px)]">
              <div className="space-y-6">
                <SortByFilter
                  sortBy={filters.sortBy}
                  vehicles={vehicles}
                  blueDollarRate={blueDollarRate}
                  onFilterChange={handleModularFilterChange}
                  variant="vertical"
                />

                <BrandFilter
                  marca={filters.marca}
                  marcas={filterOptions.marcas}
                  onFilterChange={updateFilters}
                  variant="vertical"
                />

                <ModelFilter
                  modelo={filters.modelo}
                  modelos={availableModelos}
                  onFilterChange={handleModularFilterChange}
                  variant="vertical"
                />

                <RangeFilter
                  range={filters.anoRange}
                  min={filterOptions.anoRange[0]}
                  max={filterOptions.anoRange[1]}
                  step={1}
                  label="Año"
                  onFilterChange={handleModularFilterChange}
                  variant="vertical"
                />

                <RangeFilter
                  range={filters.kilometrajeRange}
                  min={0}
                  max={filterOptions.kilometrajeRange[1]}
                  step={5000}
                  label="Kilometraje"
                  formatValue={(value) => `${(value / 1000).toFixed(0)}k`}
                  onFilterChange={handleModularFilterChange}
                  variant="vertical"
                />

                <MultiSelectFilter
                  selected={filters.combustibles}
                  options={COMBUSTIBLES}
                  label="Combustible"
                  onFilterChange={handleModularFilterChange}
                  variant="vertical"
                />

                <MultiSelectFilter
                  selected={filters.transmisiones}
                  options={TRANSMISIONES}
                  label="Transmisión"
                  onFilterChange={handleModularFilterChange}
                  variant="vertical"
                />
              </div>
            </div>

            {/* Footer with Apply Button */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-background ">
              <Button
                onClick={() => setIsMobileOpen(false)}
                className="w-full"
              >
                Aplicar Filtros ({vehicles.length} {vehicles.length === 1 ? 'vehículo' : 'vehículos'})
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  // Layout horizontal original para backward compatibility
  return (
    <div
      className={cn(
        "bg-background rounded-lg shadow-sm border border-gray-200 dark:border-gray-700",
        className
      )}
    >
      {/* Filter Header */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              Filtros
            </h3>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 px-2 lg:hidden"
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
      </div>

      {/* Filter Content */}
      <div className="p-3">
        <div className={cn("grid gap-4", !isExpanded && "hidden lg:grid")}>
          <SortByFilter
            sortBy={filters.sortBy}
            vehicles={vehicles}
            blueDollarRate={blueDollarRate}
            onFilterChange={handleModularFilterChange}
            variant="horizontal"
          />

          <BrandFilter
            marca={filters.marca}
            marcas={filterOptions.marcas}
            onFilterChange={updateFilters}
            variant="horizontal"
          />

          <ModelFilter
            modelo={filters.modelo}
            modelos={availableModelos}
            onFilterChange={handleModularFilterChange}
            variant="horizontal"
          />

          <RangeFilter
            range={filters.anoRange}
            min={filterOptions.anoRange[0]}
            max={filterOptions.anoRange[1]}
            step={1}
            label="Año"
            onFilterChange={handleModularFilterChange}
            variant="horizontal"
          />

          <RangeFilter
            range={filters.kilometrajeRange}
            min={0}
            max={filterOptions.kilometrajeRange[1]}
            step={5000}
            label="Kilometraje"
            formatValue={(value) => `${(value / 1000).toFixed(0)}k`}
            onFilterChange={handleModularFilterChange}
            variant="horizontal"
          />

          {/* Combustible & Transmisión */}
          <div
            className={cn(
              "space-y-4",
              variant === "horizontal" ? "xl:col-span-1" : ""
            )}
          >
            <MultiSelectFilter
              selected={filters.combustibles}
              options={COMBUSTIBLES}
              label="Combustible"
              onFilterChange={handleModularFilterChange}
              variant="horizontal"
            />

            <MultiSelectFilter
              selected={filters.transmisiones}
              options={TRANSMISIONES}
              label="Transmisión"
              onFilterChange={handleModularFilterChange}
              variant="horizontal"
            />
          </div>
        </div>

        {/* Mobile Expanded State */}
        <div className={cn("mt-4 lg:hidden", !isExpanded && "hidden")}>
          <div className="grid gap-4">
            {/* Mobile filters would go here if needed */}
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Use los filtros de arriba para refinar su búsqueda
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
