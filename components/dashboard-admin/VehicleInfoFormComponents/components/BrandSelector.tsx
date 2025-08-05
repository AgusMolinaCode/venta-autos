import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { marcasAutos } from "@/constants";
import { BrandSelectorProps } from "../types/VehicleFormTypes";
import { FormFieldWrapper } from "./shared/FormFieldWrapper";
import { SelectWithManual } from "./shared/SelectWithManual";
import { ManualInputModal } from "./shared/ManualInputModal";

/**
 * Brand selector component with manual input capability
 * Handles brand selection from predefined list or manual entry
 */
export function BrandSelector({
  form,
  manualState,
  setManualState,
  forceUpdateMarca,
  setForceUpdateMarca,
  onBrandChange,
}: BrandSelectorProps) {
  const handleManualSubmit = (value: string) => {
    if (value.trim()) {
      form.setValue("marca", value.trim());
      setManualState(prev => ({
        ...prev,
        manualBrand: "",
        showManualBrand: false,
      }));
      setForceUpdateMarca(prev => prev + 1);
      onBrandChange?.(value.trim(), true);
    }
  };

  const handleSelectChange = (value: string) => {
    form.setValue("marca", value);
    const isManual = !marcasAutos.includes(value);
    onBrandChange?.(value, isManual);
  };

  const handleManualOpen = () => {
    setManualState(prev => ({
      ...prev,
      showManualBrand: true,
    }));
  };

  const handleManualClose = () => {
    setManualState(prev => ({
      ...prev,
      showManualBrand: false,
      manualBrand: "",
    }));
  };

  const handleManualChange = (value: string) => {
    setManualState(prev => ({
      ...prev,
      manualBrand: value,
    }));
  };

  return (
    <FormField
      control={form.control}
      name="marca"
      render={({ field }) => (
        <FormItem>
          <FormFieldWrapper
            label="Marca"
            required
            onManualClick={handleManualOpen}
            manualButtonTitle="Agregar marca manualmente"
          >
            <SelectWithManual
              forceUpdateKey={`marca-select-${forceUpdateMarca}`}
              onValueChange={handleSelectChange}
              value={field.value}
              placeholder="Seleccionar marca"
            >
              {/* Show manual value if exists and not in predefined list */}
              {field.value && !marcasAutos.includes(field.value) && (
                <>
                  <SelectItem
                    value={field.value}
                    className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700 bg-blue-50 dark:bg-blue-900/20"
                  >
                    {field.value} (Manual)
                  </SelectItem>
                  <Separator className="my-2" />
                </>
              )}

              {/* Top commercial brands */}
              {marcasAutos.slice(0, 8).map((marca) => (
                <SelectItem
                  key={marca}
                  value={marca}
                  className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700"
                >
                  {marca}
                </SelectItem>
              ))}
              
              <Separator className="my-2" />
              
              {/* Rest of brands */}
              {marcasAutos.slice(8).map((marca) => (
                <SelectItem
                  key={marca}
                  value={marca}
                  className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700"
                >
                  {marca}
                </SelectItem>
              ))}
            </SelectWithManual>

            {/* Manual input modal */}
            <ManualInputModal
              isOpen={manualState.showManualBrand}
              onClose={handleManualClose}
              onSubmit={handleManualSubmit}
              title="Agregar marca manualmente"
              placeholder="Ej: Toyota, Ford, Chevrolet..."
              value={manualState.manualBrand}
              onChange={handleManualChange}
            />
          </FormFieldWrapper>

          <FormMessage className="text-red-500 dark:text-red-400" />
        </FormItem>
      )}
    />
  );
}