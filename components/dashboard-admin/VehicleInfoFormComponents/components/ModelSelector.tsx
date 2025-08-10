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
import { ModelSelectorProps } from "../types/VehicleFormTypes";
import { EditableSelect, EditableSelectOption } from "./shared/EditableSelect";

/**
 * Model selector component with editable select
 * Allows typing directly or selecting from available options
 */
export function ModelSelector({
  form,
  isMarcaManual,
  autocosmosData,
  onModelChange,
}: ModelSelectorProps) {
  const {
    models,
    modelsLoading,
    modelsError,
    hasModels,
    retryFetchModels,
    fetchModels,
  } = autocosmosData;

  const selectedBrand = form.getValues("marca");
  const isDisabled = !selectedBrand;

  const handleRefetch = () => {
    if (selectedBrand && selectedBrand.trim()) {
      fetchModels(selectedBrand, true); // Force refetch
    } else {
      retryFetchModels();
    }
  };

  const handleChange = (value: string) => {
    form.setValue("modelo", value);
    onModelChange?.(value);
  };

  const handleSelectOption = (value: string) => {
    if (value !== "manual-brand-message") {
      handleChange(value);
    }
  };

  const getPlaceholder = () => {
    if (isDisabled) return "Selecciona una marca primero";
    if (isMarcaManual) return "Escribir modelo...";
    if (modelsError) return "Error al cargar - escribir modelo...";
    return "Escribir o seleccionar modelo...";
  };

  const getRefetchText = () => {
    if (modelsError) return "🔄 Reintentar cargar modelos";
    if (hasModels && models.length > 0) return "🔄 Buscar nuevos modelos";
    return "🔄 Buscar modelos para esta marca";
  };

  return (
    <FormField
      control={form.control}
      name="modelo"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 dark:text-zinc-300">
            Modelo *
          </FormLabel>
          
          {isDisabled ? (
            <div className="flex items-center justify-center h-10 px-3 py-2 bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-600 rounded-md text-gray-500 dark:text-zinc-400 text-sm">
              Selecciona una marca primero
            </div>
          ) : (
            <EditableSelect
              value={field.value || ""}
              onChange={handleChange}
              onRefetch={handleRefetch}
              placeholder={getPlaceholder()}
              loading={modelsLoading}
              loadingText="Cargando modelos..."
              refetchText={getRefetchText()}
            >
              {/* Show current manual value if it exists and is not in the models list */}
              {field.value && hasModels && models.length > 0 && !models.some(model => model.getDisplayName() === field.value) && (
                <EditableSelectOption
                  value={field.value}
                  onSelect={handleSelectOption}
                  className="bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100"
                >
                  {field.value} (Manual)
                </EditableSelectOption>
              )}

              {/* Show models from API */}
              {hasModels && models.length > 0 && !isMarcaManual && models.map((model, index) => (
                <EditableSelectOption
                  key={`${model.brandSlug}-${model.slug}-${index}`}
                  value={model.getDisplayName()}
                  onSelect={handleSelectOption}
                >
                  {model.getDisplayName()}
                </EditableSelectOption>
              ))}

              {/* Show manual brand message */}
              {isMarcaManual && (
                <EditableSelectOption
                  value="manual-brand-message"
                  onSelect={() => {}} // No action for disabled item
                  className="text-gray-500 dark:text-zinc-400 cursor-not-allowed"
                >
                  Marca manual - escribir modelo arriba
                </EditableSelectOption>
              )}
            </EditableSelect>
          )}

          {/* Show error message */}
          {!isMarcaManual && modelsError && (
            <div className="flex items-center justify-between mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
              <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4" />
                <span>Error al cargar modelos</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={retryFetchModels}
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