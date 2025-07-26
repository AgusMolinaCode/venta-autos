"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/lib/supabase";

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

export type PriceFormData = z.infer<typeof PriceSchema>;

export default function VehicleFormWithPrice() {
  const form = useForm<PriceFormData>({
    resolver: zodResolver(PriceSchema),
    defaultValues: {
      precio: undefined,
      moneda: "ARS",
    },
  });

  async function onSubmit(data: PriceFormData) {
    console.log("Price data:", data);

    try {
      // Here you would typically update an existing vehicle record with price
      // For now, just show success message
      toast.success("Precio guardado correctamente", {
        description: `Precio: ${data.precio} ${data.moneda}`,
      });
      form.reset();
    } catch {
      toast.error("Error inesperado", {
        description: "Ocurrió un error al guardar el precio",
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Precio de venta</h3>
        <p className="text-sm text-muted-foreground">
          Establece el precio para tu vehículo
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            <Button type="button" variant="outline" onClick={() => {}}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-md font-medium">
              Publicar Vehículo
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}