import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormControl } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { SelectWithManualProps } from "../../types/VehicleFormTypes";

/**
 * Enhanced Select component with manual input support
 * Handles loading states, placeholders, and manual value display
 */
export function SelectWithManual({
  children,
  disabled = false,
  loading = false,
  loadingText = "Cargando...",
  placeholder = "Seleccionar",
  value,
  onValueChange,
  forceUpdateKey,
  className = "bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-white w-full",
}: SelectWithManualProps) {
  return (
    <Select
      key={forceUpdateKey}
      onValueChange={onValueChange}
      value={value}
      disabled={disabled || loading}
    >
      <FormControl>
        <SelectTrigger className={className}>
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{loadingText}</span>
            </div>
          ) : (
            <SelectValue placeholder={placeholder} />
          )}
        </SelectTrigger>
      </FormControl>
      <SelectContent className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 w-full">
        {children}
      </SelectContent>
    </Select>
  );
}