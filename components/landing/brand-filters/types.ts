import { VehiculoConFotos } from "@/lib/supabase";

export interface FilterState {
  modelo: string | null;
  anoRange: [number, number];
  kilometrajeRange: [number, number];
  combustibles: string[];
  transmisiones: string[];
  sortBy: 'price-asc' | 'price-desc' | 'year-desc' | 'year-asc' | 'km-asc' | null;
}

export interface FilterOptions {
  modelos: string[];
  anoRange: [number, number];
  kilometrajeRange: [number, number];
}

export interface BaseFilterProps {
  variant?: 'horizontal' | 'vertical';
  className?: string;
}

export interface FilterComponentProps extends BaseFilterProps {
  onFilterChange: (filters: Partial<FilterState>) => void;
}

export interface SortByFilterProps extends FilterComponentProps {
  sortBy: FilterState['sortBy'];
  vehicles: VehiculoConFotos[];
  blueDollarRate?: number;
}

export interface ModelFilterProps extends FilterComponentProps {
  modelo: string | null;
  modelos: string[];
}

export interface RangeFilterProps extends FilterComponentProps {
  range: [number, number];
  min: number;
  max: number;
  step: number;
  label: string;
  formatValue?: (value: number) => string;
}

export interface MultiSelectFilterProps extends FilterComponentProps {
  selected: string[];
  options: readonly string[];
  label: string;
}