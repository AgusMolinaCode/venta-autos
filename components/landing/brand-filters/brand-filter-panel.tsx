"use client";

import { useState, useMemo } from "react";
import { VehiculoConFotos } from "@/lib/supabase";
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

export function BrandFilterPanel({
  vehicles,
  onFilterChange,
  className,
}: BrandFilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Extract unique values from vehicles
  const filterOptions = useMemo(() => {
    const modelos = [...new Set(vehicles.map((v) => v.modelo))].sort();
    const anos = vehicles.map((v) => v.ano).filter(Boolean);
    const kilometrajes = vehicles.map((v) => v.kilometraje).filter(Boolean);

    // Handle empty arrays with fallback values
    const anoMin = anos.length > 0 ? Math.min(...anos) : 1970;
    const anoMax = anos.length > 0 ? Math.max(...anos) : 2025;
    const kmMax = kilometrajes.length > 0 ? Math.max(...kilometrajes) : 500000;

    return {
      modelos,
      anoRange: [anoMin, anoMax] as [number, number],
      kilometrajeRange: [0, kmMax] as [number, number],
    };
  }, [vehicles]);

  const [filters, setFilters] = useState<FilterState>({
    modelo: null,
    anoRange: filterOptions.anoRange,
    kilometrajeRange: [0, filterOptions.kilometrajeRange[1] || 500000],
    combustibles: [],
    transmisiones: [],
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
    };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.modelo) count++;
    if (
      filters.anoRange[0] !== filterOptions.anoRange[0] ||
      filters.anoRange[1] !== filterOptions.anoRange[1]
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
            "grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
          )}
        >
          {/* Modelo Filter - Compact */}
          <div className="space-y-1 flex gap-3">
            <div className="grid gap-2">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Modelo
              </label>
              <Select
                value={filters.modelo || "all"}
                onValueChange={(value) =>
                  updateFilters({ modelo: value === "all" ? null : value })
                }
              >
                <SelectTrigger className="h-6
                 text-xs">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los modelos</SelectItem>
                  {filterOptions.modelos.map((modelo) => (
                    <SelectItem key={modelo} value={modelo}>
                      {modelo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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

          {/* Año Range - Compact */}
          <div className="space-y-1">
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

          {/* Kilometraje Range - Compact */}
          <div className="space-y-1">
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

          {/* Combustible Filter - Compact */}
          <div className="space-y-1">
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

          {/* Transmisión Filter - Compact */}
          <div className="space-y-1">
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
    </div>
  );
}
