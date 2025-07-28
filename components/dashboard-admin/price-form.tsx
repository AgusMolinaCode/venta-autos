"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { PriceSchema } from "@/lib/validations";
import { FORM_CONFIG } from "./constants";

export type PriceFormData = z.infer<typeof PriceSchema>;

interface PriceFormProps {
  onSubmit: (data: PriceFormData) => void;
  onCancel?: () => void;
  defaultValues?: Partial<PriceFormData>;
}

export function PriceForm({ onSubmit, onCancel, defaultValues }: PriceFormProps) {
  const form = useForm<PriceFormData>({
    resolver: zodResolver(PriceSchema),
    defaultValues: {
      precio: undefined,
      moneda: "ARS",
      ...defaultValues,
    },
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Precio del Vehículo</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    placeholder={FORM_CONFIG.placeholders.precio}
                    className="w-full"
                    {...field}
                    value={field.value ?? ""}
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
                        id="usd-currency"
                        checked={field.value === "USD"}
                        onCheckedChange={(checked: boolean) => {
                          field.onChange(checked ? "USD" : "ARS");
                        }}
                      />
                      <FormLabel
                        htmlFor="usd-currency"
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

          <div className="flex justify-end gap-3 pt-6 border-t border-border">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="submit">Guardar Precio</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}