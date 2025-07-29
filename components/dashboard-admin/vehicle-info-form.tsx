"use client";

import { motion } from "framer-motion";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { marcasAutos } from "@/constants";
import { z } from "zod";
import { VehicleFormInputSchema } from "@/lib/validations";
import { COMBUSTIBLES, TRANSMISIONES, FORM_CONFIG } from "@/constants";

type VehicleFormData = z.infer<typeof VehicleFormInputSchema> & {
  ano: number;
};

interface VehicleInfoFormProps {
  form: UseFormReturn<VehicleFormData>;
  onSubmit: (data: VehicleFormData) => void;
}


export function VehicleInfoForm({ form, onSubmit }: VehicleInfoFormProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Información del Vehículo</h3>
        <div className="flex flex-col items-end gap-1">
          <div className="text-xs text-gray-600 dark:text-zinc-400 bg-gray-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
            * Obligatorios
          </div>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Row 1: Marca y Modelo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="marca"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-zinc-300">Marca *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-white w-full">
                        <SelectValue placeholder="Seleccionar marca" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 w-full">
                      {marcasAutos.map((marca) => (
                        <SelectItem key={marca} value={marca} className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700">
                          {marca}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="modelo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-zinc-300">Modelo *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={FORM_CONFIG.placeholders.modelo}
                      className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />
          </div>

          {/* Row 2: Año y Kilometraje */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="ano"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-zinc-300">Año *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={FORM_CONFIG.minYear}
                      max={FORM_CONFIG.maxYear}
                      placeholder={FORM_CONFIG.placeholders.ano}
                      className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-white"
                      {...field}
                      value={field.value?.toString() ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kilometraje"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-zinc-300">Kilometraje</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder={FORM_CONFIG.placeholders.kilometraje}
                      className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-white"
                      {...field}
                      value={field.value?.toString() ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />
          </div>

          {/* Row 3: Combustible y Transmisión */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="combustible"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-zinc-300">Combustible</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-white w-full">
                        <SelectValue placeholder="Seleccionar combustible" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 w-full">
                      {COMBUSTIBLES.map((combustible) => (
                        <SelectItem key={combustible} value={combustible} className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700">
                          {combustible}
                        </SelectItem>
                      ))}
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
                  <FormLabel className="text-gray-700 dark:text-zinc-300">Transmisión</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-white w-full">
                        <SelectValue placeholder="Seleccionar transmisión" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 w-full">
                      {TRANSMISIONES.map((transmision) => (
                        <SelectItem key={transmision} value={transmision} className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700">
                          {transmision}
                        </SelectItem>
                      ))}
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
                  <FormLabel className="text-gray-700 dark:text-zinc-300">Versión</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={FORM_CONFIG.placeholders.version}
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
                  <FormLabel className="text-gray-700 dark:text-zinc-300">Color</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={FORM_CONFIG.placeholders.color}
                      className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />
          </div>

          {/* Descripción */}
          <FormField
            control={form.control}
            name="descripcion"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-zinc-300">Descripción</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={FORM_CONFIG.placeholders.descripcion}
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
        </form>
      </Form>
    </motion.div>
  );
}