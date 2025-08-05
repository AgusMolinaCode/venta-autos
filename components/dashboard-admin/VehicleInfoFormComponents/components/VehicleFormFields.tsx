import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  COMBUSTIBLES,
  TRANSMISIONES,
  FORM_CONFIG,
} from "@/constants";
import { VehicleFormFieldsProps } from "../types/VehicleFormTypes";
import { useDescriptionGenerator } from "@/hooks/use-description-generator";
import {
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

/**
 * Vehicle form fields component with description generation
 * Handles combustible, transmision, version, color, and descripcion with POST generation
 */
export function VehicleFormFields({
  form,
}: VehicleFormFieldsProps) {
  const [
    showConfirmDialog,
    setShowConfirmDialog,
  ] = useState(false);

  // Description generation hook
  const {
    generateDescription,
    forceGenerateDescription,
    isLoading,
    canGenerate,
    getGenerateButtonTooltip,
  } = useDescriptionGenerator(form);

  // Handle generate button click
  const handleGenerateClick =
    async () => {
      const result =
        await generateDescription();

      if (result?.needsConfirmation) {
        setShowConfirmDialog(true);
      }
    };

  // Handle confirmed overwrite
  const handleConfirmedGenerate =
    async () => {
      setShowConfirmDialog(false);
      await forceGenerateDescription();
    };
  return (
    <>
      {/* Row 3: Combustible y Transmisión */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="combustible"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 dark:text-zinc-300">
                Combustible
              </FormLabel>
              <Select
                onValueChange={
                  field.onChange
                }
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-white w-full">
                    <SelectValue placeholder="Seleccionar combustible" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 w-full">
                  {COMBUSTIBLES.map(
                    (combustible) => (
                      <SelectItem
                        key={
                          combustible
                        }
                        value={
                          combustible
                        }
                        className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700"
                      >
                        {combustible}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
              <FormMessage className="text-red-500 dark:text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="transmision"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 dark:text-zinc-300">
                Transmisión
              </FormLabel>
              <Select
                onValueChange={
                  field.onChange
                }
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-white w-full">
                    <SelectValue placeholder="Seleccionar transmisión" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 w-full">
                  {TRANSMISIONES.map(
                    (transmision) => (
                      <SelectItem
                        key={
                          transmision
                        }
                        value={
                          transmision
                        }
                        className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700"
                      >
                        {transmision}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
              <FormMessage className="text-red-500 dark:text-red-400" />
            </FormItem>
          )}
        />
      </div>

      {/* Row 4: Versión y Color */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="version"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 dark:text-zinc-300">
                Versión
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={
                    FORM_CONFIG
                      .placeholders
                      .version
                  }
                  className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-white"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500 dark:text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 dark:text-zinc-300">
                Color
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={
                    FORM_CONFIG
                      .placeholders
                      .color
                  }
                  className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-white"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500 dark:text-red-400" />
            </FormItem>
          )}
        />
      </div>

      {/* Descripción con Generación */}
      <FormField
        control={form.control}
        name="descripcion"
        render={({ field }) => (
          <FormItem>
            <div className="flex justify-between items-center">
              <FormLabel className="text-gray-700 dark:text-zinc-300">
                Descripción
              </FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={
                  handleGenerateClick
                }
                disabled={true}
                className="flex items-center gap-2 text-xs"
                title={getGenerateButtonTooltip()}
              >
                {isLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : !canGenerate() ? (
                  <AlertCircle className="w-3 h-3" />
                ) : (
                  <Sparkles className="w-3 h-3" />
                )}
                {isLoading
                  ? "Generando..."
                  : "Generar Descripción con IA"}
              </Button>
            </div>
            <FormControl>
              <Textarea
                placeholder={
                  FORM_CONFIG
                    .placeholders
                    .descripcion
                }
                rows={5}
                cols={50}
                className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-white resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage className="text-red-500 dark:text-red-400" />
          </FormItem>
        )}
      />

      {/* Confirmation Dialog for Overwriting Existing Description */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 max-w-md w-full border border-gray-200 dark:border-zinc-700">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                ¿Reemplazar descripción
                existente?
              </h3>
            </div>
            <p className="text-gray-600 dark:text-zinc-400 mb-6">
              Ya hay una descripción en
              este campo. ¿Deseas
              reemplazarla con una nueva
              descripción generada?
            </p>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setShowConfirmDialog(
                    false,
                  )
                }
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={
                  handleConfirmedGenerate
                }
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {isLoading
                  ? "Generando..."
                  : "Sí, generar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
