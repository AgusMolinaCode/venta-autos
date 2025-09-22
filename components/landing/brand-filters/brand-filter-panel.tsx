"use client";

import { useState, useMemo } from "react";
import { VehiculoConFotos } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { X, Filter, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { COMBUSTIBLES, TRANSMISIONES } from "@/constants";

interface BrandFilterPanelProps {
  vehicles: VehiculoConFotos[];
  onFilterChange: (filters: FilterState) => void;
  className?: string;
}

export interface FilterState {
  modelo: string | null;
  anoRange: [number, number];
  kilometrajeRange: [number, number];
  combustibles: string[];
  transmisiones: string[];
}

export function BrandFilterPanel({ vehicles, onFilterChange, className }: BrandFilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Extract unique values from vehicles
  const filterOptions = useMemo(() => {
    const modelos = [...new Set(vehicles.map(v => v.modelo))].sort();
    const anos = vehicles.map(v => v.ano).filter(Boolean);
    const kilometrajes = vehicles.map(v => v.kilometraje).filter(Boolean);

    // Handle empty arrays with fallback values
    const anoMin = anos.length > 0 ? Math.min(...anos) : 1970;
    const anoMax = anos.length > 0 ? Math.max(...anos) : 2025;
    const kmMax = kilometrajes.length > 0 ? Math.max(...kilometrajes) : 500000;

    return {
      modelos,
      anoRange: [anoMin, anoMax] as [number, number],
      kilometrajeRange: [0, kmMax] as [number, number]
    };
  }, [vehicles]);

  const [filters, setFilters] = useState<FilterState>({
    modelo: null,
    anoRange: filterOptions.anoRange,
    kilometrajeRange: [0, filterOptions.kilometrajeRange[1]],
    combustibles: [],
    transmisiones: []
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
      kilometrajeRange: [0, filterOptions.kilometrajeRange[1]],
      combustibles: [],
      transmisiones: []
    };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.modelo) count++;
    if (filters.anoRange[0] !== filterOptions.anoRange[0] || filters.anoRange[1] !== filterOptions.anoRange[1]) count++;
    if (filters.kilometrajeRange[0] !== 0 || filters.kilometrajeRange[1] !== filterOptions.kilometrajeRange[1]) count++;
    if (filters.combustibles.length > 0) count++;
    if (filters.transmisiones.length > 0) count++;
    return count;
  }, [filters, filterOptions]);

  const toggleCombustible = (combustible: string) => {
    const updated = filters.combustibles.includes(combustible)
      ? filters.combustibles.filter(c => c !== combustible)
      : [...filters.combustibles, combustible];
    updateFilters({ combustibles: updated });
  };

  const toggleTransmision = (transmision: string) => {
    const updated = filters.transmisiones.includes(transmision)
      ? filters.transmisiones.filter(t => t !== transmision)
      : [...filters.transmisiones, transmision];
    updateFilters({ transmisiones: updated });
  };

  return (
    <div className={cn("bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700", className)}>
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <span className="font-semibold text-gray-900 dark:text-gray-100">Filtros</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-600 dark:text-gray-400">
              <X className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden"
          >
            <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")} />
          </Button>
        </div>
      </div>

      {/* Filter Content */}
      <div className={cn("space-y-6 p-4", !isExpanded && "hidden lg:block")}>
        {/* Modelo Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Modelo</label>
          <Select value={filters.modelo || "all"} onValueChange={(value) => updateFilters({ modelo: value === "all" ? null : value })}>
            <SelectTrigger>
              <SelectValue placeholder="Todos los modelos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los modelos</SelectItem>
              {filterOptions.modelos.map((modelo) => (
                <SelectItem key={modelo} value={modelo}>{modelo}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Año Range */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Año: {filters.anoRange[0]} - {filters.anoRange[1]}
          </label>
          <Slider
            value={filters.anoRange}
            onValueChange={(value) => updateFilters({ anoRange: value as [number, number] })}
            min={filterOptions.anoRange[0]}
            max={filterOptions.anoRange[1]}
            step={1}
            className="w-full"
          />
        </div>

        {/* Kilometraje Range */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Kilometraje: {filters.kilometrajeRange[0].toLocaleString()} - {filters.kilometrajeRange[1].toLocaleString()} km
          </label>
          <Slider
            value={filters.kilometrajeRange}
            onValueChange={(value) => updateFilters({ kilometrajeRange: value as [number, number] })}
            min={0}
            max={filterOptions.kilometrajeRange[1]}
            step={5000}
            className="w-full"
          />
        </div>

        {/* Combustible Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Combustible</label>
          <div className="flex flex-wrap gap-2">
            {COMBUSTIBLES.map((combustible) => (
              <Button
                key={combustible}
                variant={filters.combustibles.includes(combustible) ? "default" : "outline"}
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
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Transmisión</label>
          <div className="flex flex-wrap gap-2">
            {TRANSMISIONES.map((transmision) => (
              <Button
                key={transmision}
                variant={filters.transmisiones.includes(transmision) ? "default" : "outline"}
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
  );
}