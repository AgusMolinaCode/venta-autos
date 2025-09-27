"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BaseFilterProps } from "./types";

interface BrandFilterProps extends BaseFilterProps {
  marca: string | null;
  marcas: string[];
  onFilterChange: (filters: { marca: string | null }) => void;
}

export function BrandFilter({
  marca,
  marcas,
  onFilterChange,
  variant = 'vertical',
  className
}: BrandFilterProps) {
  const isCompact = variant === 'horizontal';

  return (
    <div className={`space-y-${isCompact ? '1' : '3'} ${className || ''}`}>
      <label className={`text-${isCompact ? 'xs' : 'sm'} font-medium ${isCompact ? 'text-gray-600 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
        Marca
      </label>
      <Select
        value={marca || "all"}
        onValueChange={(value) =>
          onFilterChange({ marca: value === "all" ? null : value })
        }
      >
        <SelectTrigger className={`w-full ${isCompact ? 'h-6 text-xs' : ''}`}>
          <SelectValue placeholder={isCompact ? "Todas" : "Todas las marcas"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            {isCompact ? "Todas" : "Todas las marcas"}
          </SelectItem>
          {marcas.map((marcaOption) => (
            <SelectItem key={marcaOption} value={marcaOption}>
              {marcaOption}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Show count of brands available */}
      {marcas.length > 0 && (
        <div className="text-xs text-gray-500">
          {marcas.length} marca{marcas.length !== 1 ? 's' : ''} disponible{marcas.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}