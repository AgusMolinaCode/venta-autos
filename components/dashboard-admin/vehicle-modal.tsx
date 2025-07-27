"use client";

import React, { useEffect, forwardRef, useImperativeHandle } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { marcasAutos } from "@/constants";
import { FormSchema, ProcessedFormSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export type VehicleFormData = z.infer<typeof FormSchema>;

interface VehicleFormProps {
  onValidationChange?: (isValid: boolean) => void;
  onClose?: () => void;
}

export interface VehicleFormRef {
  canProceed: () => boolean;
  generateUrl: () => void;
  showValidationErrors: () => void;
}

export const VehicleForm = forwardRef<VehicleFormRef, VehicleFormProps>(({ onValidationChange, onClose }, ref) => {

  const form = useForm<VehicleFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      marca: "",
      modelo: "",
      ano: undefined,
      kilometraje: undefined,
      version: "",
      combustible: "",
      transmision: "",
      color: "",
      descripcion: "",
      precio: undefined,
      moneda: "ARS",
    },
  });

  function normalize(str: string) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // elimina tildes
      .replace(/\s+/g, "-") // reemplaza espacios por guiones
      .replace(/[^a-z0-9-]/g, ""); // elimina caracteres especiales
  }

  async function onSubmit(data: VehicleFormData) {
    // Process the data with defaults applied
    const processedData = ProcessedFormSchema.parse({
      ...data,
      ano: data.ano ?? new Date().getFullYear()
    });
    
    console.log("Vehicle data:", processedData);

    try {
      // Here you would typically save to database
      toast.success("Vehículo guardado correctamente", {
        description: `${processedData.marca} ${processedData.modelo} ${processedData.ano}`,
      });
      form.reset();
      onClose?.();
    } catch {
      toast.error("Error inesperado", {
        description: "Ocurrió un error al guardar el vehículo",
      });
    }
  }

  // Watch required fields for validation
  const watchedFields = form.watch(["marca", "modelo", "ano"]);
  const [marca, modelo, ano] = watchedFields;

  // Check if required fields are complete
  const canProceed = () => {
    return !!(marca && modelo && ano); // año is now required
  };

  // Generate URL and log to console
  const generateUrl = () => {
    if (canProceed()) {
      const finalYear = ano ?? new Date().getFullYear();
      const url = `https://autos.mercadolibre.com.ar/${finalYear}/${normalize(marca)}-${normalize(modelo)}`;
      console.log("URL generada:", url);
    } else {
      console.log("Faltan campos requeridos para generar la URL");
    }
  };

  // Show validation errors for required fields
  const showValidationErrors = () => {
    const errors: Record<string, string> = {};
    
    if (!marca) errors.marca = "La marca es obligatoria";
    if (!modelo) errors.modelo = "El modelo es obligatorio";
    if (!ano) errors.ano = "Colocar un año entre 1970 y 2025";

    // Set errors using react-hook-form
    Object.entries(errors).forEach(([field, message]) => {
      form.setError(field as keyof VehicleFormData, { message });
    });
  };

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    canProceed,
    generateUrl,
    showValidationErrors,
  }));

  // Notify parent of validation changes
  useEffect(() => {
    const isValid = !!(marca && modelo && ano); // año is now required
    if (onValidationChange) {
      onValidationChange(isValid);
    }
  }, [marca, modelo, ano, onValidationChange]);


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Required Fields Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="marca"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marca *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar marca" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {marcasAutos.map((marca) => (
                      <SelectItem key={marca} value={marca}>
                        {marca}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage>
                  {form.formState.errors.marca?.message}
                </FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="modelo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modelo *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ingrese el modelo"
                    className="w-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Required Fields Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="ano"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Año *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1900}
                    max={new Date().getFullYear() + 2}
                    placeholder="Ingrese el año"
                    className="w-full"
                    {...field}
                    value={field.value?.toString() ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseInt(e.target.value) : undefined
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="kilometraje"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kilometraje</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder="Kilometraje"
                    className="w-full"
                    {...field}
                    value={field.value?.toString() ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseInt(e.target.value) : undefined
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Optional Fields Row 1 - Combustible y Transmisión */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="combustible"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Combustible</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar combustible" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="nafta">Nafta</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="gnc">GNC</SelectItem>
                    <SelectItem value="electrico">Eléctrico</SelectItem>
                    <SelectItem value="hibrido">Híbrido</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="transmision"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transmisión</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar transmisión" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="automatica">Automática</SelectItem>
                    <SelectItem value="cvt">CVT</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Optional Fields Row 2 - Versión y Color */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="version"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Versión</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ingrese la versión"
                    className="w-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Color del vehículo"
                    className="w-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description Field */}
        <FormField
          control={form.control}
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descripción detallada del vehículo..."
                  rows={3}
                  className="w-full resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-xs">
                Agregue detalles adicionales sobre el vehículo
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price Section */}
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h4 className="font-medium mb-4 text-green-900 flex items-center gap-2">
            💰 Precio de venta
          </h4>
          <FormField
            control={form.control}
            name="precio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder="Ingrese el precio"
                    className="w-full"
                    {...field}
                    value={field.value?.toString() ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                  />
                </FormControl>
                <FormField
                  control={form.control}
                  name="moneda"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2 mt-2">
                      <Checkbox
                        id="usd-currency-price"
                        checked={field.value === "USD"}
                        onCheckedChange={(checked: boolean) => {
                          field.onChange(checked ? "USD" : "ARS");
                        }}
                      />
                      <FormLabel
                        htmlFor="usd-currency-price"
                        className="text-sm font-normal"
                      >
                        Precio en USD
                      </FormLabel>
                    </div>
                  )}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-md font-medium">
            Publicar Vehículo
          </Button>
        </div>

      </form>
    </Form>
  );
});

VehicleForm.displayName = "VehicleForm";
