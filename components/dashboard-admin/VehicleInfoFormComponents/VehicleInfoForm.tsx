"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { VehicleInfoFormProps } from "./types/VehicleFormTypes";
import { useVehicleFormState } from "./hooks/useVehicleFormState";
import { useAutocosmosData } from "./hooks/useAutocosmosData";
import { BrandSelector } from "./components/BrandSelector";
import { ModelSelector } from "./components/ModelSelector";
import { YearSelector } from "./components/YearSelector";
import { VehicleFormFields } from "./components/VehicleFormFields";

/**
 * Refactored vehicle information form component
 * Now composed of smaller, reusable components for better maintainability
 */
export function VehicleInfoForm({
  form,
  onSubmit,
}: VehicleInfoFormProps) {
  // Custom hooks for state and data management
  const {
    formState,
    setLocalAno,
    setLocalKilometraje,
    setManualState,
    setForceUpdateMarca,
    setForceUpdateModelo,
    setForceUpdateAno,
    setIsMarcaManual,
    resetAllManualStates,
  } = useVehicleFormState(form);

  // Shared autocosmos data hook for all child components
  const autocosmosData =
    useAutocosmosData();

  useEffect(() => {
    const isEditMode =
      !!form.formState.defaultValues
        ?.marca;

    // Si es modo edición, establece el estado local inicial y sal.
    if (isEditMode) {
      setLocalAno(
        form
          .getValues("ano")
          ?.toString() ?? "",
      );
      setLocalKilometraje(
        form
          .getValues("kilometraje")
          ?.toString() ?? "",
      );
      return;
    }

    const subscription = form.watch(
      (value, { name }) => {
        // Update local ano when form ano changes
        if (name === "ano" || !name) {
          setLocalAno(
            value.ano?.toString() ?? "",
          );
        }

        // Update local kilometraje when form kilometraje changes
        if (
          name === "kilometraje" ||
          !name
        ) {
          setLocalKilometraje(
            value.kilometraje?.toString() ??
              "",
          );
        }

        // Handle brand changes
        if (name === "marca" || !name) {
          const selectedBrand =
            value.marca;

          if (
            selectedBrand &&
            selectedBrand.trim() !== ""
          ) {
            // Detect if brand is manual
            const marcaEsManual =
              autocosmosData.isManualBrand(
                selectedBrand,
              );
            setIsMarcaManual(
              marcaEsManual,
            );

            // Reset model and year fields
            form.setValue("modelo", "");
            form.setValue(
              "ano",
              null as unknown as number,
            );
            resetAllManualStates();

            // Only fetch models if brand is not manual
            if (!marcaEsManual) {
              autocosmosData.fetchModels(
                selectedBrand,
              );
              autocosmosData.resetYears();
            } else {
              // If brand is manual, clear models and years
              autocosmosData.resetModels();
              autocosmosData.resetYears();
            }
          } else {
            // No brand selected
            setIsMarcaManual(false);
            autocosmosData.resetModels();
            autocosmosData.resetYears();
            resetAllManualStates();
          }
        }

        // Handle model changes
        if (
          name === "modelo" ||
          !name
        ) {
          const selectedBrand =
            value.marca;
          const selectedModel =
            value.modelo;

          if (
            selectedBrand &&
            selectedBrand.trim() !==
              "" &&
            selectedModel &&
            selectedModel.trim() !== ""
          ) {
            // Reset year field
            form.setValue(
              "ano",
              null as unknown as number,
            );
            setManualState((prev) => ({
              ...prev,
              showManualYear: false,
              manualYear: "",
            }));

            // Only fetch years if brand is not manual
            const marcaEsManual =
              autocosmosData.isManualBrand(
                selectedBrand,
              );
            if (!marcaEsManual) {
              autocosmosData.fetchYears(
                selectedBrand,
                selectedModel,
              );
            } else {
              // If brand is manual, no scraping for years
              autocosmosData.resetYears();
            }
          } else {
            autocosmosData.resetYears();
            setManualState((prev) => ({
              ...prev,
              showManualYear: false,
              manualYear: "",
            }));
          }
        }
      },
    );

    return () =>
      subscription.unsubscribe();
  }, [
    form,
    autocosmosData.fetchModels,
    autocosmosData.resetModels,
    autocosmosData.fetchYears,
    autocosmosData.resetYears,
    autocosmosData.isManualBrand,
    setLocalAno,
    setLocalKilometraje,
    setIsMarcaManual,
    setManualState,
    resetAllManualStates,
    autocosmosData,
  ]);

  // Brand change handler
  const handleBrandChange = (
    brand: string,
    isManual: boolean,
  ) => {
    setIsMarcaManual(isManual);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Información del Vehículo
        </h3>
        <div className="flex flex-col items-end gap-2">
          <div className="text-xs text-gray-600 dark:text-zinc-400 bg-gray-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
            * Obligatorios
          </div>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(
            onSubmit,
          )}
          className="space-y-6"
        >
          {/* Vehicle Type Switch */}
          <div className="flex justify-start">
            <FormField
              control={form.control}
              name="tipo_vehiculo"
              render={({ field }) => (
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-zinc-800 p-2 rounded-lg">
                  <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                    Autos/Camionetas
                  </span>
                  <Switch
                    checked={
                      field.value ===
                      "motos"
                    }
                    onCheckedChange={(
                      checked,
                    ) => {
                      field.onChange(
                        checked
                          ? "motos"
                          : "autos/camionetas",
                      );
                    }}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                    Motos
                  </span>
                </div>
              )}
            />
          </div>
          {/* Row 1: Marca y Modelo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BrandSelector
              form={form}
              manualState={formState}
              setManualState={
                setManualState
              }
              forceUpdateMarca={
                formState.forceUpdateMarca
              }
              setForceUpdateMarca={
                setForceUpdateMarca
              }
              onBrandChange={
                handleBrandChange
              }
            />

            <ModelSelector
              form={form}
              manualState={formState}
              setManualState={
                setManualState
              }
              forceUpdateModelo={
                formState.forceUpdateModelo
              }
              setForceUpdateModelo={
                setForceUpdateModelo
              }
              isMarcaManual={
                formState.isMarcaManual
              }
              autocosmosData={
                autocosmosData
              }
              // onModelChange={handleModelChange}
            />
          </div>

          {/* Row 2: Año y Kilometraje */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <YearSelector
              form={form}
              manualState={formState}
              setManualState={
                setManualState
              }
              forceUpdateAno={
                formState.forceUpdateAno
              }
              setForceUpdateAno={
                setForceUpdateAno
              }
              isMarcaManual={
                formState.isMarcaManual
              }
              localAno={
                formState.localAno
              }
              setLocalAno={setLocalAno}
              autocosmosData={
                autocosmosData
              }
            />

            {/* Kilometraje field */}
            <FormField
              control={form.control}
              name="kilometraje"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-zinc-300">
                    Kilometraje
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="Ej: 50000, 100000..."
                      className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-white"
                      value={
                        formState.localKilometraje
                      }
                      onChange={(e) =>
                        setLocalKilometraje(
                          e.target
                            .value,
                        )
                      }
                      onBlur={() => {
                        if (
                          formState.localKilometraje ===
                          ""
                        ) {
                          field.onChange(
                            undefined,
                          );
                        } else {
                          const numValue =
                            parseInt(
                              formState.localKilometraje,
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
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />
          </div>

          {/* Additional form fields */}
          <VehicleFormFields
            form={form}
          />
        </form>
      </Form>
    </motion.div>
  );
}
