"use client";

import { Slider } from "@/components/ui/slider";
import { RangeFilterProps } from "./types";

export function RangeFilter({
  range,
  min,
  max,
  step,
  label,
  formatValue,
  onFilterChange,
  variant = 'vertical',
  className
}: RangeFilterProps) {
  const isCompact = variant === 'horizontal';

  const formatLabel = (value: number) => {
    return formatValue ? formatValue(value) : value.toString();
  };

  const getFilterKey = () => {
    if (label.toLowerCase().includes('año')) return 'anoRange';
    if (label.toLowerCase().includes('km') || label.toLowerCase().includes('kilometraje')) return 'kilometrajeRange';
    return 'range';
  };

  const displayValue = `${formatLabel(range[0])} - ${formatLabel(range[1])}`;

  return (
    <div className={`space-y-${isCompact ? '1' : '3'} ${className || ''}`}>
      <label className={`text-${isCompact ? 'xs' : 'sm'} font-medium ${isCompact ? 'text-gray-600 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
        {isCompact ? label.replace(': ', ': ').replace('Kilometraje', 'KM') : label}: {displayValue}
      </label>
      <div className="pt-2">
        <Slider
          value={range}
          onValueChange={(value) => {
            const filterKey = getFilterKey();
            onFilterChange({ [filterKey]: value as [number, number] });
          }}
          min={min}
          max={max}
          step={step}
          className="w-full"
        />
      </div>

      {/* Show range info */}
      {min !== max && (
        <div className="text-xs text-gray-500">
          Rango: {formatLabel(min)} - {formatLabel(max)}
        </div>
      )}
    </div>
  );
}