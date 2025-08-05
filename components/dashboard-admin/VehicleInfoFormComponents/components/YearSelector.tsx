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
import { FORM_CONFIG } from "@/constants";
import { YearSelectorProps } from "../types/VehicleFormTypes";
import { FormFieldWrapper } from "./shared/FormFieldWrapper";
import { SelectWithManual } from "./shared/SelectWithManual";
import { ManualInputModal } from "./shared/ManualInputModal";

/**
 * Year selector component with conditional logic for manual brands
 * Handles year selection from API or manual entry based on brand type
 */
export function YearSelector({
  form,
  manualState,
  setManualState,
  forceUpdateAno,
  setForceUpdateAno,
  isMarcaManual,
  localAno,
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

  const selectedBrand =
    form.getValues("marca");
  const selectedModel =
    form.getValues("modelo");

  const handleManualSubmit = (
    value: string,
  ) => {
    const yearValue = parseInt(
      value.trim(),
    );
    if (
      !isNaN(yearValue) &&
      yearValue >=
        FORM_CONFIG.minYear &&
      yearValue <= FORM_CONFIG.maxYear
    ) {
      form.setValue("ano", yearValue);
      setManualState((prev) => ({
        ...prev,
        manualYear: "",
        showManualYear: false,
      }));
      setForceUpdateAno(
        (prev) => prev + 1,
      );
    }
  };

  const handleSelectChange = (
    value: string,
  ) => {
    // Handle refetch action
    if (value === "__refetch_years__") {
      const currentBrand =
        form.getValues("marca");
      const currentModel =
        form.getValues("modelo");
      if (
        currentBrand &&
        currentModel &&
        currentBrand.trim() &&
        currentModel.trim()
      ) {
        fetchYears(
          currentBrand,
          currentModel,
        );
      } else {
        retryFetchYears();
      }
      return;
    }

    if (
      value !== "manual-brand-message"
    ) {
      form.setValue(
        "ano",
        parseInt(value),
      );
    }
  };

  const handleManualOpen = () => {
    setManualState((prev) => ({
      ...prev,
      showManualYear: true,
    }));
  };

  const handleManualClose = () => {
    setManualState((prev) => ({
      ...prev,
      showManualYear: false,
      manualYear: "",
    }));
  };

  const handleManualChange = (
    value: string,
  ) => {
    setManualState((prev) => ({
      ...prev,
      manualYear: value,
    }));
  };

  const getPlaceholder = () => {
    if (isMarcaManual) {
      return "Usar botón Manual para agregar año";
    }
    if (yearsError) {
      return "Error al cargar años";
    }
    if (hasYears) {
      return "Seleccionar año";
    }
    return "No hay años disponibles";
  };

  const shouldShowSelect = Boolean(
    selectedBrand &&
      (selectedModel || isMarcaManual),
  );
  const isDisabled = !selectedBrand;

  if (!shouldShowSelect) {
    return (
      <FormField
        control={form.control}
        name="ano"
        render={() => (
          <FormItem>
            <FormFieldWrapper
              label="Año"
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
                  : "Agregar año manualmente"
              }
            >
              <FormControl>
                <div className="flex items-center justify-center h-10 px-3 py-2 bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-600 rounded-md text-gray-500 dark:text-zinc-400 text-sm">
                  {selectedBrand
                    ? "Selecciona un modelo primero"
                    : "Selecciona marca y modelo primero"}
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
      name="ano"
      render={({ field }) => (
        <FormItem>
          <FormFieldWrapper
            label="Año"
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
                : "Agregar año manualmente"
            }
          >
            <SelectWithManual
              forceUpdateKey={`ano-select-${forceUpdateAno}`}
              onValueChange={
                handleSelectChange
              }
              value={
                field.value?.toString() ||
                ""
              }
              disabled={
                yearsLoading ||
                isMarcaManual
              }
              loading={yearsLoading}
              loadingText="Cargando años..."
              placeholder={getPlaceholder()}
            >
              {/* Show manual value if exists and not in years list */}
              {field.value &&
                hasYears &&
                years.length > 0 &&
                !years.some(
                  (year) =>
                    year.year ===
                    field.value,
                ) && (
                  <>
                    <SelectItem
                      value={field.value.toString()}
                      className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700 bg-blue-50 dark:bg-blue-900/20"
                    >
                      {field.value}{" "}
                      (Manual)
                    </SelectItem>
                    <Separator className="my-2" />
                  </>
                )}

              {/* Show manual value when no years loaded */}
              {field.value &&
                (!hasYears ||
                  years.length === 0) &&
                !yearsLoading && (
                  <>
                    <SelectItem
                      value={field.value.toString()}
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
                  para agregar año
                </SelectItem>
              ) : hasYears &&
                years.length > 0 ? (
                <>
                  {years.map(
                    (year, index) => (
                      <SelectItem
                        key={`${year.brandSlug}-${year.modelSlug}-${year.year}-${index}`}
                        value={year.year.toString()}
                        className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700"
                      >
                        {year.getDisplayText()}
                      </SelectItem>
                    ),
                  )}

                  {/* Refetch button */}
                  <Separator className="my-1" />
                  <SelectItem
                    value="__refetch_years__"
                    className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-t bg-gray-50 dark:bg-zinc-800"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <RefreshCw className="h-4 w-4" />
                      <span>
                        🔄 Buscar nuevos
                        años
                      </span>
                    </div>
                  </SelectItem>
                </>
              ) : !yearsLoading ? (
                <SelectItem
                  value="__refetch_years__"
                  className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 bg-gray-50 dark:bg-zinc-800"
                >
                  <div className="flex items-center gap-2 w-full">
                    <RefreshCw className="h-4 w-4" />
                    <span>
                      {yearsError
                        ? "🔄 Reintentar cargar años"
                        : "🔄 Buscar años para este modelo"}
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
                    agregar el año.
                  </span>
                </div>
              </div>
            )}*/}

            {/* Show error and retry only if brand is not manual */}
            {!isMarcaManual &&
              yearsError && (
                <div className="flex items-center justify-between mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
                  <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    <span>
                      Error al cargar
                      años
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={
                      retryFetchYears
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
              yearsError && (
                <div className="mt-2">
                  <FormControl>
                    <Input
                      type="number"
                      min={
                        FORM_CONFIG.minYear
                      }
                      max={
                        FORM_CONFIG.maxYear
                      }
                      placeholder="Escribir año manualmente"
                      className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-white"
                      value={localAno}
                      onChange={(e) =>
                        setLocalAno(
                          e.target
                            .value,
                        )
                      }
                      onBlur={() => {
                        if (
                          localAno ===
                          ""
                        ) {
                          field.onChange(
                            undefined,
                          );
                        } else {
                          const numValue =
                            parseInt(
                              localAno,
                            );
                          field.onChange(
                            isNaN(
                              numValue,
                            )
                              ? undefined
                              : numValue,
                          );
                        }
                      }}
                    />
                  </FormControl>
                </div>
              )}

            {/* Manual input modal */}
            <ManualInputModal
              isOpen={
                manualState.showManualYear
              }
              onClose={
                handleManualClose
              }
              onSubmit={
                handleManualSubmit
              }
              title="Agregar año manualmente"
              placeholder="Ej: 2020, 2018, 2015..."
              inputType="number"
              minValue={
                FORM_CONFIG.minYear
              }
              maxValue={
                FORM_CONFIG.maxYear
              }
              value={
                manualState.manualYear
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
