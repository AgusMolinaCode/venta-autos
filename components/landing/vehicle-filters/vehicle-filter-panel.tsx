"use client";

import { useState, useMemo } from "react";
import { VehiculoConFotos } from "@/lib/supabase";
import { VehicleFilterState } from "@/hooks/use-vehicle-filters";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { X, Filter, ChevronDown, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { COMBUSTIBLES, TRANSMISIONES } from "@/constants";
import { formatCurrency } from "@/utils/currency";

interface VehicleFilterPanelProps {
  vehicles: VehiculoConFotos[];
  onFilterChange: (filters: VehicleFilterState) => void;
  className?: string;
  variant?: 'horizontal' | 'vertical';
}

export function VehicleFilterPanel({
  vehicles,
  onFilterChange,
  className,
  variant = 'horizontal',
}: VehicleFilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Extract unique values from vehicles
  const filterOptions = useMemo(() => {
    const marcas = [...new Set(vehicles.map((v) => v.marca))].sort();
    const modelos = [...new Set(vehicles.map((v) => v.modelo))].sort();
    const anos = vehicles.map((v) => v.ano).filter(Boolean);
    const precios = vehicles.map((v) => v.precio).filter(Boolean);
    const kilometrajes = vehicles.map((v) => v.kilometraje).filter(Boolean);

    // Handle empty arrays with fallback values
    const anoMin = anos.length > 0 ? Math.min(...anos) : 1970;
    const anoMax = anos.length > 0 ? Math.max(...anos) : 2025;
    const precioMin = precios.length > 0 ? Math.min(...precios) : 0;
    const precioMax = precios.length > 0 ? Math.max(...precios) : 1000000;
    const kmMax = kilometrajes.length > 0 ? Math.max(...kilometrajes) : 500000;

    return {
      marcas,
      modelos,
      anoRange: [anoMin, anoMax] as [number, number],
      precioRange: [precioMin, precioMax] as [number, number],
      kilometrajeRange: [0, kmMax] as [number, number],
    };
  }, [vehicles]);

  const [filters, setFilters] = useState<VehicleFilterState>({
    marca: null,
    modelo: null,
    anoRange: filterOptions.anoRange,
    precioRange: [0, filterOptions.precioRange[1] || 1000000],
    kilometrajeRange: [0, filterOptions.kilometrajeRange[1] || 500000],
    combustibles: [],
    transmisiones: [],
  });

  // Get available modelos for selected marca
  const availableModelos = useMemo(() => {
    if (!filters.marca) {
      return filterOptions.modelos;
    }
    return [...new Set(vehicles
      .filter(v => v.marca === filters.marca)
      .map(v => v.modelo)
    )].sort();
  }, [vehicles, filters.marca, filterOptions.modelos]);

  const updateFilters = (newFilters: Partial<VehicleFilterState>) => {
    let updated = { ...filters, ...newFilters };

    // If marca changes, reset modelo
    if (newFilters.marca !== undefined && newFilters.marca !== filters.marca) {
      updated.modelo = null;
    }

    setFilters(updated);
    onFilterChange(updated);
  };

  const clearFilters = () => {
    const cleared: VehicleFilterState = {
      marca: null,
      modelo: null,
      anoRange: filterOptions.anoRange,
      precioRange: [0, filterOptions.precioRange[1] || 1000000],
      kilometrajeRange: [0, filterOptions.kilometrajeRange[1] || 500000],
      combustibles: [],
      transmisiones: [],
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
      filters.precioRange[0] !== 0 ||
      filters.precioRange[1] !== (filterOptions.precioRange[1] || 1000000)
    )
      count++;
    if (
      filters.kilometrajeRange[0] !== 0 ||
      filters.kilometrajeRange[1] !== (filterOptions.kilometrajeRange[1] || 500000)
    )
      count++;
    if (filters.combustibles.length > 0) count++;
    if (filters.transmisiones.length > 0) count++;
    return count;
  }, [filters, filterOptions]);

  const toggleCombustible = (combustible: string) => {
    const updated = filters.combustibles.includes(combustible)
      ? filters.combustibles.filter((c) => c !== combustible)
      : [...filters.combustibles, combustible];
    updateFilters({ combustibles: updated });
  };

  const toggleTransmision = (transmision: string) => {
    const updated = filters.transmisiones.includes(transmision)
      ? filters.transmisiones.filter((t) => t !== transmision)
      : [...filters.transmisiones, transmision];
    updateFilters({ transmisiones: updated });
  };

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
            "hidden lg:block bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700",
            className
          )}
        >
          {/* Filter Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Filtros</h3>
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
              {/* Marca Filter */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Marca
                </label>
                <Select
                  value={filters.marca || "all"}
                  onValueChange={(value) =>
                    updateFilters({ marca: value === "all" ? null : value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todas las marcas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las marcas</SelectItem>
                    {filterOptions.marcas.map((marca) => (
                      <SelectItem key={marca} value={marca}>
                        {marca}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Modelo Filter */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Modelo
                </label>
                <Select
                  value={filters.modelo || "all"}
                  onValueChange={(value) =>
                    updateFilters({ modelo: value === "all" ? null : value })
                  }
                  disabled={!filters.marca}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todos los modelos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los modelos</SelectItem>
                    {availableModelos.map((modelo) => (
                      <SelectItem key={modelo} value={modelo}>
                        {modelo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Año Range */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Año: {filters.anoRange[0]} - {filters.anoRange[1]}
                </label>
                <div className="pt-2">
                  <Slider
                    value={filters.anoRange}
                    onValueChange={(value) =>
                      updateFilters({ anoRange: value as [number, number] })
                    }
                    min={filterOptions.anoRange[0]}
                    max={filterOptions.anoRange[1]}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Precio Range */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Precio: {formatCurrency(filters.precioRange[0], 'USD')} - {formatCurrency(filters.precioRange[1], 'USD')}
                </label>
                <div className="pt-2">
                  <Slider
                    value={filters.precioRange}
                    onValueChange={(value) =>
                      updateFilters({ precioRange: value as [number, number] })
                    }
                    min={filterOptions.precioRange[0]}
                    max={filterOptions.precioRange[1]}
                    step={1000}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Kilometraje Range */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Kilometraje: {(filters.kilometrajeRange[0] / 1000).toFixed(0)}k - {(filters.kilometrajeRange[1] / 1000).toFixed(0)}k
                </label>
                <div className="pt-2">
                  <Slider
                    value={filters.kilometrajeRange}
                    onValueChange={(value) =>
                      updateFilters({ kilometrajeRange: value as [number, number] })
                    }
                    min={0}
                    max={filterOptions.kilometrajeRange[1]}
                    step={5000}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Combustible Filter */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Combustible
                </label>
                <div className="flex flex-wrap gap-2">
                  {COMBUSTIBLES.map((combustible) => (
                    <Button
                      key={combustible}
                      variant={
                        filters.combustibles.includes(combustible)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => toggleCombustible(combustible)}
                      className="text-xs"
                    >
                      {combustible === "Eléctrico"
                        ? "Eléctrico"
                        : combustible === "Híbrido"
                        ? "Híbrido"
                        : combustible}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Transmisión Filter */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Transmisión
                </label>
                <div className="flex flex-wrap gap-2">
                  {TRANSMISIONES.map((transmision) => (
                    <Button
                      key={transmision}
                      variant={
                        filters.transmisiones.includes(transmision)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => toggleTransmision(transmision)}
                      className="text-xs"
                    >
                      {transmision === "Automática"
                        ? "Automática"
                        : transmision === "Manual"
                        ? "Manual"
                        : transmision}
                    </Button>
                  ))}
                </div>
              </div>
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
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Filtros</h3>
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
                  {/* Marca Filter */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Marca
                    </label>
                    <Select
                      value={filters.marca || "all"}
                      onValueChange={(value) =>
                        updateFilters({ marca: value === "all" ? null : value })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Todas las marcas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las marcas</SelectItem>
                        {filterOptions.marcas.map((marca) => (
                          <SelectItem key={marca} value={marca}>
                            {marca}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Modelo Filter */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Modelo
                    </label>
                    <Select
                      value={filters.modelo || "all"}
                      onValueChange={(value) =>
                        updateFilters({ modelo: value === "all" ? null : value })
                      }
                      disabled={!filters.marca}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Todos los modelos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los modelos</SelectItem>
                        {availableModelos.map((modelo) => (
                          <SelectItem key={modelo} value={modelo}>
                            {modelo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Año Range */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Año: {filters.anoRange[0]} - {filters.anoRange[1]}
                    </label>
                    <div className="pt-2">
                      <Slider
                        value={filters.anoRange}
                        onValueChange={(value) =>
                          updateFilters({ anoRange: value as [number, number] })
                        }
                        min={filterOptions.anoRange[0]}
                        max={filterOptions.anoRange[1]}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Precio Range */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Precio: {formatCurrency(filters.precioRange[0], 'USD')} - {formatCurrency(filters.precioRange[1], 'USD')}
                    </label>
                    <div className="pt-2">
                      <Slider
                        value={filters.precioRange}
                        onValueChange={(value) =>
                          updateFilters({ precioRange: value as [number, number] })
                        }
                        min={filterOptions.precioRange[0]}
                        max={filterOptions.precioRange[1]}
                        step={1000}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Kilometraje Range */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Kilometraje: {(filters.kilometrajeRange[0] / 1000).toFixed(0)}k - {(filters.kilometrajeRange[1] / 1000).toFixed(0)}k
                    </label>
                    <div className="pt-2">
                      <Slider
                        value={filters.kilometrajeRange}
                        onValueChange={(value) =>
                          updateFilters({ kilometrajeRange: value as [number, number] })
                        }
                        min={0}
                        max={filterOptions.kilometrajeRange[1]}
                        step={5000}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Combustible Filter */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Combustible
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {COMBUSTIBLES.map((combustible) => (
                        <Button
                          key={combustible}
                          variant={
                            filters.combustibles.includes(combustible)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => toggleCombustible(combustible)}
                          className="text-xs"
                        >
                          {combustible}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Transmisión Filter */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Transmisión
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {TRANSMISIONES.map((transmision) => (
                        <Button
                          key={transmision}
                          variant={
                            filters.transmisiones.includes(transmision)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => toggleTransmision(transmision)}
                          className="text-xs"
                        >
                          {transmision}
                        </Button>
                      ))}
                    </div>
                  </div>
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
      {/* Filter Header */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Filtros</h3>
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
        <div
          className={cn(
            "grid gap-4",
            !isExpanded && "hidden lg:grid",
            variant === 'vertical'
              ? "grid-cols-1 gap-6"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
          )}
        >
          {/* Marca Filter */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Marca
            </label>
            <Select
              value={filters.marca || "all"}
              onValueChange={(value) =>
                updateFilters({ marca: value === "all" ? null : value })
              }
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las marcas</SelectItem>
                {filterOptions.marcas.map((marca) => (
                  <SelectItem key={marca} value={marca}>
                    {marca}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Modelo Filter */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Modelo
            </label>
            <Select
              value={filters.modelo || "all"}
              onValueChange={(value) =>
                updateFilters({ modelo: value === "all" ? null : value })
              }
              disabled={!filters.marca}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los modelos</SelectItem>
                {availableModelos.map((modelo) => (
                  <SelectItem key={modelo} value={modelo}>
                    {modelo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Año Range */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Año: {filters.anoRange[0]}-{filters.anoRange[1]}
            </label>
            <div className="pt-2">
              <Slider
                value={filters.anoRange}
                onValueChange={(value) =>
                  updateFilters({ anoRange: value as [number, number] })
                }
                min={filterOptions.anoRange[0]}
                max={filterOptions.anoRange[1]}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Precio Range */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Precio: {formatCurrency(filters.precioRange[0], 'USD')} - {formatCurrency(filters.precioRange[1], 'USD')}
            </label>
            <div className="pt-2">
              <Slider
                value={filters.precioRange}
                onValueChange={(value) =>
                  updateFilters({ precioRange: value as [number, number] })
                }
                min={filterOptions.precioRange[0]}
                max={filterOptions.precioRange[1]}
                step={1000}
                className="w-full"
              />
            </div>
          </div>

          {/* Kilometraje Range */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
              KM: {(filters.kilometrajeRange[0] / 1000).toFixed(0)}k-
              {(filters.kilometrajeRange[1] / 1000).toFixed(0)}k
            </label>
            <div className="pt-2">
              <Slider
                value={filters.kilometrajeRange}
                onValueChange={(value) =>
                  updateFilters({ kilometrajeRange: value as [number, number] })
                }
                min={0}
                max={filterOptions.kilometrajeRange[1]}
                step={5000}
                className="w-full"
              />
            </div>
          </div>

          {/* Combustible & Transmisión */}
          <div className={cn(
            "space-y-4",
            variant === 'horizontal' ? "xl:col-span-1" : ""
          )}>
            {/* Combustible Filter */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Combustible
              </label>
              <div className="flex flex-wrap gap-1">
                {COMBUSTIBLES.map((combustible) => (
                  <Button
                    key={combustible}
                    variant={
                      filters.combustibles.includes(combustible)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => toggleCombustible(combustible)}
                    className="h-6 px-2 text-xs"
                  >
                    {combustible === "Eléctrico"
                      ? "Elec"
                      : combustible === "Híbrido"
                      ? "Híb"
                      : combustible}
                  </Button>
                ))}
              </div>
            </div>

            {/* Transmisión Filter */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Transmisión
              </label>
              <div className="flex flex-wrap gap-1">
                {TRANSMISIONES.map((transmision) => (
                  <Button
                    key={transmision}
                    variant={
                      filters.transmisiones.includes(transmision)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => toggleTransmision(transmision)}
                    className="h-6 px-2 text-xs"
                  >
                    {transmision === "Automática"
                      ? "Auto"
                      : transmision === "Manual"
                      ? "Man"
                      : transmision}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Expanded State */}
        <div
          className={cn(
            "mt-4 lg:hidden",
            !isExpanded && "hidden"
          )}
        >
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