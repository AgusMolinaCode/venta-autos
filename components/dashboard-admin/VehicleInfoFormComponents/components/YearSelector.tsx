import {
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { FORM_CONFIG } from "@/constants";
import { YearSelectorProps } from "../types/VehicleFormTypes";
import { EditableSelect, EditableSelectOption } from "./shared/EditableSelect";

/**
 * Year selector component with editable select
 * Allows typing directly or selecting from available options
 */
export function YearSelector({
  form,
  isMarcaManual,
  setLocalAno,
  autocosmosData,
}: YearSelectorProps) {
  const {
    years,
    yearsLoading,
    yearsError,
    hasYears,
    retryFetchYears,
    fetchYears,
  } = autocosmosData;

  const selectedBrand = form.getValues("marca");
  const selectedModel = form.getValues("modelo");
  const isDisabled = !selectedBrand;

  const handleRefetch = () => {
    if (selectedBrand && selectedModel && selectedBrand.trim() && selectedModel.trim()) {
      fetchYears(selectedBrand, selectedModel, true); // Force refetch
    } else {
      retryFetchYears();
    }
  };

  const handleChange = (value: string) => {
    if (value === "") {
      form.setValue("ano", 0);
      setLocalAno("");
    } else {
      const yearValue = parseInt(value, 10);
      if (!isNaN(yearValue) && yearValue >= FORM_CONFIG.minYear && yearValue <= FORM_CONFIG.maxYear) {
        form.setValue("ano", yearValue);
        setLocalAno(value);
      }
    }
  };

  const handleSelectOption = (value: string) => {
    if (value !== "manual-brand-message") {
      const yearValue = parseInt(value, 10);
      if (!isNaN(yearValue) && yearValue >= FORM_CONFIG.minYear && yearValue <= FORM_CONFIG.maxYear) {
        form.setValue("ano", yearValue);
        setLocalAno(value);
      }
    }
  };

  const getPlaceholder = () => {
    if (isDisabled) return "Selecciona marca y modelo primero";
    if (!selectedModel) return "Selecciona un modelo primero";
    if (isMarcaManual) return "Escribir año...";
    if (yearsError) return "Error al cargar - escribir año...";
    return "Escribir o seleccionar año...";
  };

  const getRefetchText = () => {
    if (yearsError) return "🔄 Reintentar cargar años";
    if (hasYears && years.length > 0) return "🔄 Buscar nuevos años";
    return "🔄 Buscar años para este modelo";
  };

  const currentValue = form.getValues("ano");
  const displayValue = currentValue && !isNaN(currentValue) && currentValue > 0 ? currentValue.toString() : "";

  return (
    <FormField
      control={form.control}
      name="ano"
      render={() => (
        <FormItem>
          <FormLabel className="text-gray-700 dark:text-zinc-300">
            Año *
          </FormLabel>
          
          {isDisabled ? (
            <div className="flex items-center justify-center h-10 px-3 py-2 bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-600 rounded-md text-gray-500 dark:text-zinc-400 text-sm">
              {selectedBrand ? "Selecciona un modelo primero" : "Selecciona marca y modelo primero"}
            </div>
          ) : (
            <EditableSelect
              value={displayValue}
              onChange={handleChange}
              onRefetch={selectedModel ? handleRefetch : undefined}
              placeholder={getPlaceholder()}
              loading={yearsLoading}
              loadingText="Cargando años..."
              refetchText={getRefetchText()}
            >
              {/* Show current manual value if it exists and is not in the years list */}
              {displayValue && hasYears && years.length > 0 && !years.some(year => year.year.toString() === displayValue) && (
                <EditableSelectOption
                  value={displayValue}
                  onSelect={handleSelectOption}
                  className="bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100"
                >
                  {displayValue} (Manual)
                </EditableSelectOption>
              )}

              {/* Show years from API */}
              {hasYears && years.length > 0 && !isMarcaManual && years
                .filter(year => year.year && !isNaN(year.year) && year.year > 0)
                .map((year, index) => (
                  <EditableSelectOption
                    key={`${year.brandSlug}-${year.modelSlug}-${year.year}-${index}`}
                    value={year.year.toString()}
                    onSelect={handleSelectOption}
                  >
                    {year.getDisplayText()}
                  </EditableSelectOption>
                ))}

              {/* Show manual brand message */}
              {isMarcaManual && (
                <EditableSelectOption
                  value="manual-brand-message"
                  onSelect={() => {}} // No action for disabled item
                  className="text-gray-500 dark:text-zinc-400 cursor-not-allowed"
                >
                  Marca manual - escribir año arriba
                </EditableSelectOption>
              )}
            </EditableSelect>
          )}

          {/* Show error message */}
          {!isMarcaManual && yearsError && (
            <div className="flex items-center justify-between mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
              <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4" />
                <span>Error al cargar años</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={retryFetchYears}
                className="h-7 px-2 text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Reintentar
              </Button>
            </div>
          )}

          <FormMessage className="text-red-500 dark:text-red-400" />
        </FormItem>
      )}
    />
  );
}