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
import { FormSchema } from "@/lib/validations";

export type VehicleFormData = z.infer<typeof FormSchema>;

interface VehicleFormProps {
  onValidationChange?: (isValid: boolean) => void;
}

export interface VehicleFormRef {
  canProceed: () => boolean;
  generateUrl: () => void;
}

export const VehicleForm = forwardRef<VehicleFormRef, VehicleFormProps>(({ onValidationChange }, ref) => {

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

  // Watch required fields for validation
  const watchedFields = form.watch(["marca", "modelo", "ano"]);
  const [marca, modelo, ano] = watchedFields;

  // Check if required fields are complete
  const canProceed = () => {
    return !!(marca && modelo && ano);
  };

  // Generate URL and log to console
  const generateUrl = () => {
    if (canProceed()) {
      const url = `https://autos.mercadolibre.com.ar/${ano}/${normalize(marca)}-${normalize(modelo)}`;
      console.log("URL generada:", url);
    } else {
      console.log("Faltan campos requeridos para generar la URL");
    }
  };

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    canProceed,
    generateUrl,
  }));

  // Notify parent of validation changes
  useEffect(() => {
    const isValid = !!(marca && modelo && ano);
    if (onValidationChange) {
      onValidationChange(isValid);
    }
  }, [marca, modelo, ano, onValidationChange]);


  return (
    <Form {...form}>
      <form className="space-y-4">
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
                <FormMessage />
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
                    value={field.value ?? ""}
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
                    value={field.value ?? ""}
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

      </form>
    </Form>
  );
});

VehicleForm.displayName = "VehicleForm";
