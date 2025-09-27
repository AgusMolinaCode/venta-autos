"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ModelFilterProps } from "./types";

export function ModelFilter({
  modelo,
  modelos,
  onFilterChange,
  variant = 'vertical',
  className
}: ModelFilterProps) {
  const isCompact = variant === 'horizontal';

  return (
    <div className={`space-y-${isCompact ? '1' : '3'} ${className || ''}`}>
      <label className={`text-${isCompact ? 'xs' : 'sm'} font-medium ${isCompact ? 'text-gray-600 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
        Modelo
      </label>
      <Select
        value={modelo || "all"}
        onValueChange={(value) =>
          onFilterChange({ modelo: value === "all" ? null : value })
        }
      >
        <SelectTrigger className={`w-full ${isCompact ? 'h-6 text-xs' : ''}`}>
          <SelectValue placeholder={isCompact ? "Todos" : "Todos los modelos"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            {isCompact ? "Todos" : "Todos los modelos"}
          </SelectItem>
          {modelos.map((modeloOption) => (
            <SelectItem key={modeloOption} value={modeloOption}>
              {modeloOption}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Show count of models available */}
      {modelos.length > 0 && (
        <div className="text-xs text-gray-500">
          {modelos.length} modelo{modelos.length !== 1 ? 's' : ''} disponible{modelos.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}