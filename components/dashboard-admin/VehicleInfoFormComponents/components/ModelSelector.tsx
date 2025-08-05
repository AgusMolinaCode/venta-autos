import {
  FormField,
  FormItem,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { ModelSelectorProps } from "../types/VehicleFormTypes";
import { FormFieldWrapper } from "./shared/FormFieldWrapper";
import { SelectWithManual } from "./shared/SelectWithManual";
import { ManualInputModal } from "./shared/ManualInputModal";

/**
 * Model selector component with conditional logic for manual brands
 * Handles model selection from API or manual entry based on brand type
 */
export function ModelSelector({
  form,
  manualState,
  setManualState,
  forceUpdateModelo,
  setForceUpdateModelo,
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

  const selectedBrand =
    form.getValues("marca");

  const handleManualSubmit = (
    value: string,
  ) => {
    if (value.trim()) {
      form.setValue(
        "modelo",
        value.trim(),
      );
      setManualState((prev) => ({
        ...prev,
        manualModel: "",
        showManualModel: false,
      }));
      setForceUpdateModelo(
        (prev) => prev + 1,
      );
      onModelChange?.(value.trim());
    }
  };

  const handleSelectChange = (
    value: string,
  ) => {
    // Handle refetch action
    if (
      value === "__refetch_models__"
    ) {
      const currentBrand =
        form.getValues("marca");
      if (
        currentBrand &&
        currentBrand.trim()
      ) {
        fetchModels(currentBrand);
      } else {
        retryFetchModels();
      }
      return;
    }

    // Don't allow selecting disabled items
    if (
      value !== "manual-brand-message"
    ) {
      form.setValue("modelo", value);
      onModelChange?.(value);
    }
  };

  const handleManualOpen = () => {
    setManualState((prev) => ({
      ...prev,
      showManualModel: true,
    }));
  };

  const handleManualClose = () => {
    setManualState((prev) => ({
      ...prev,
      showManualModel: false,
      manualModel: "",
    }));
  };

  const handleManualChange = (
    value: string,
  ) => {
    setManualState((prev) => ({
      ...prev,
      manualModel: value,
    }));
  };

  const getPlaceholder = () => {
    if (isMarcaManual) {
      return "Usar botón Manual para agregar modelo";
    }
    if (modelsError) {
      return "Error al cargar modelos";
    }
    if (hasModels) {
      return "Seleccionar modelo";
    }
    return "No hay modelos disponibles";
  };

  const shouldShowSelect = Boolean(
    selectedBrand,
  );
  const isDisabled = !selectedBrand;

  if (!shouldShowSelect) {
    return (
      <FormField
        control={form.control}
        name="modelo"
        render={() => (
          <FormItem>
            <FormFieldWrapper
              label="Modelo"
              required
              onManualClick={
                handleManualOpen
              }
              isManualDisabled={
                isDisabled
              }
              manualButtonTitle={
                isDisabled
                  ? "Selecciona una marca primero"
                  : "Agregar modelo manualmente"
              }
            >
              <FormControl>
                <div className="flex items-center justify-center h-10 px-3 py-2 bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-600 rounded-md text-gray-500 dark:text-zinc-400 text-sm">
                  Selecciona una marca
                  primero
                </div>
              </FormControl>
            </FormFieldWrapper>
            <FormMessage className="text-red-500 dark:text-red-400" />
          </FormItem>
        )}
      />
    );
  }

  return (
    <FormField
      control={form.control}
      name="modelo"
      render={({ field }) => (
        <FormItem>
          <FormFieldWrapper
            label="Modelo"
            required
            onManualClick={
              handleManualOpen
            }
            isManualDisabled={
              isDisabled
            }
            manualButtonTitle={
              isDisabled
                ? "Selecciona una marca primero"
                : "Agregar modelo manualmente"
            }
          >
            <SelectWithManual
              forceUpdateKey={`modelo-select-${forceUpdateModelo}`}
              onValueChange={
                handleSelectChange
              }
              value={field.value || ""}
              disabled={
                modelsLoading ||
                isMarcaManual
              }
              loading={modelsLoading}
              loadingText="Cargando modelos..."
              placeholder={getPlaceholder()}
            >
              {/* Show manual value if exists and not in models list */}
              {field.value &&
                hasModels &&
                models.length > 0 &&
                !models.some(
                  (model) =>
                    model.getDisplayName() ===
                    field.value,
                ) && (
                  <>
                    <SelectItem
                      value={
                        field.value
                      }
                      className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700 bg-blue-50 dark:bg-blue-900/20"
                    >
                      {field.value}{" "}
                      (Manual)
                    </SelectItem>
                    <Separator className="my-2" />
                  </>
                )}

              {/* Show manual value when no models loaded */}
              {field.value &&
                (!hasModels ||
                  models.length ===
                    0) &&
                !modelsLoading && (
                  <>
                    <SelectItem
                      value={
                        field.value
                      }
                      className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700 bg-blue-50 dark:bg-blue-900/20"
                    >
                      {field.value}{" "}
                      (Manual)
                    </SelectItem>
                    <Separator className="my-2" />
                  </>
                )}

              {isMarcaManual ? (
                <SelectItem
                  value="manual-brand-message"
                  disabled
                  className="text-gray-500 dark:text-zinc-400"
                >
                  Marca manual - usa el
                  botón
                  &quot;Manual&quot;
                  para agregar modelo
                </SelectItem>
              ) : hasModels &&
                models.length > 0 ? (
                <>
                  {models.map(
                    (model, index) => (
                      <SelectItem
                        key={`${model.brandSlug}-${model.modelSlug}-${index}`}
                        value={model.getDisplayName()}
                        className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700"
                      >
                        {model.getDisplayName()}
                      </SelectItem>
                    ),
                  )}

                  {/* Refetch button */}
                  <Separator className="my-1" />
                  <SelectItem
                    value="__refetch_models__"
                    className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-t bg-gray-50 dark:bg-zinc-800"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <RefreshCw className="h-4 w-4" />
                      <span>
                        🔄 Buscar nuevos
                        modelos
                      </span>
                    </div>
                  </SelectItem>
                </>
              ) : !modelsLoading ? (
                <SelectItem
                  value="__refetch_models__"
                  className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 bg-gray-50 dark:bg-zinc-800"
                >
                  <div className="flex items-center gap-2 w-full">
                    <RefreshCw className="h-4 w-4" />
                    <span>
                      {modelsError
                        ? "🔄 Reintentar cargar modelos"
                        : "🔄 Buscar modelos para esta marca"}
                    </span>
                  </div>
                </SelectItem>
              ) : null}
            </SelectWithManual>

            {/* Show informative message when brand is manual */}
            {/*{isMarcaManual && (
              <div className="flex items-center gap-2 mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                  <AlertCircle className="h-4 w-4" />
                  <span>
                    Marca manual seleccionada. Usa el botón &quot;Manual&quot; para
                    agregar el modelo.
                  </span>
                </div>
              </div>
            )}*/}

            {/* Show error and retry only if brand is not manual */}
            {!isMarcaManual &&
              modelsError && (
                <div className="flex items-center justify-between mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
                  <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    <span>
                      Error al cargar
                      modelos
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={
                      retryFetchModels
                    }
                    className="h-7 px-2 text-xs"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Reintentar
                  </Button>
                </div>
              )}

            {/* Fallback input if error and brand is not manual */}
            {!isMarcaManual &&
              modelsError && (
                <div className="mt-2">
                  <FormControl>
                    <Input
                      placeholder="Escribir modelo manualmente"
                      className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-white"
                      value={
                        field.value ||
                        ""
                      }
                      onChange={
                        field.onChange
                      }
                    />
                  </FormControl>
                </div>
              )}

            {/* Manual input modal */}
            <ManualInputModal
              isOpen={
                manualState.showManualModel
              }
              onClose={
                handleManualClose
              }
              onSubmit={
                handleManualSubmit
              }
              title="Agregar modelo manualmente"
              placeholder="Ej: KA, Corolla, Focus, Civic..."
              value={
                manualState.manualModel
              }
              onChange={
                handleManualChange
              }
            />
          </FormFieldWrapper>

          <FormMessage className="text-red-500 dark:text-red-400" />
        </FormItem>
      )}
    />
  );
}
