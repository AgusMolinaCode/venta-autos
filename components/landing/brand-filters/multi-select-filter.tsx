"use client";

import { Button } from "@/components/ui/button";
import { MultiSelectFilterProps } from "./types";

export function MultiSelectFilter({
  selected,
  options,
  label,
  onFilterChange,
  variant = 'vertical',
  className
}: MultiSelectFilterProps) {
  const isCompact = variant === 'horizontal';

  const getFilterKey = () => {
    if (label.toLowerCase().includes('combustible')) return 'combustibles';
    if (label.toLowerCase().includes('transmis')) return 'transmisiones';
    return 'selected';
  };

  const toggleOption = (option: string) => {
    const filterKey = getFilterKey();
    const updated = selected.includes(option)
      ? selected.filter((item) => item !== option)
      : [...selected, option];

    onFilterChange({ [filterKey]: updated });
  };

  const getDisplayLabel = (option: string) => {
    if (!isCompact) return option;

    // Compact labels for horizontal variant
    const compactLabels: Record<string, string> = {
      "Eléctrico": "Elec",
      "Híbrido": "Híb",
      "Automática": "Auto",
      "Manual": "Man"
    };

    return compactLabels[option] || option;
  };

  return (
    <div className={`space-y-${isCompact ? '1' : '3'} ${className || ''}`}>
      <label className={`text-${isCompact ? 'xs' : 'sm'} font-medium ${isCompact ? 'text-gray-600 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
        {label}
      </label>
      <div className={`flex flex-wrap gap-${isCompact ? '1' : '2'}`}>
        {options.map((option) => (
          <Button
            key={option}
            variant={selected.includes(option) ? "default" : "outline"}
            size="sm"
            onClick={() => toggleOption(option)}
            className={`text-xs ${isCompact ? 'h-6 px-2' : ''}`}
          >
            {getDisplayLabel(option)}
          </Button>
        ))}
      </div>

      {/* Show selected count */}
      {selected.length > 0 && (
        <div className="text-xs text-gray-500">
          {selected.length} seleccionado{selected.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}