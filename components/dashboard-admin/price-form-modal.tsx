"use client";

import { motion } from "framer-motion";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { PriceSchema } from "@/lib/validations";
import { z } from "zod";

type PriceFormData = z.infer<typeof PriceSchema>;

interface PriceFormModalProps {
  form: UseFormReturn<PriceFormData>;
  onSubmit: (data: PriceFormData) => void;
  vehicleData?: {
    marca: string;
    modelo: string;
    ano: number;
  } | null;
}

export function PriceFormModal({ form, onSubmit, vehicleData }: PriceFormModalProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      className="space-y-6"
    >
      {/* Step 1 Summary */}
      {vehicleData && (
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-800 dark:text-green-200 font-medium mb-2">
            ✓ Información del vehículo completada
          </p>
          <p className="text-xs text-green-600 dark:text-green-300">
            {vehicleData.marca} {vehicleData.modelo} {vehicleData.ano}
          </p>
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Precio de Venta</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-green-50 dark:bg-green-950/30 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h4 className="font-medium mb-4 text-green-800 dark:text-green-100 flex items-center gap-2">
              💰 Precio de venta
            </h4>
            
            <FormField
              control={form.control}
              name="precio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-green-800 dark:text-green-100">Precio</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="15000000"
                      className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-white"
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
                          className="text-sm font-normal text-green-800 dark:text-green-100"
                        >
                          Precio en USD
                        </FormLabel>
                      </div>
                    )}
                  />
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </motion.div>
  );
}