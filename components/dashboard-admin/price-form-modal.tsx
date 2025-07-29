"use client";

import { motion } from "framer-motion";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { PriceSchema } from "@/lib/validations";
import { z } from "zod";
import { useEffect } from "react";
import { useCarValuation } from "@/lib/hooks/use-car-valuation";
import { IconLoader2 } from "@tabler/icons-react";

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

export function PriceFormModal({
  form,
  onSubmit,
  vehicleData,
}: PriceFormModalProps) {
  const { getValuation, isLoading, data, error } = useCarValuation();

  // Handle price selection from valuation results
  const handlePriceSelect = (price: number, currency: "ARS" | "USD") => {
    form.setValue("precio", price);
    form.setValue("moneda", currency);
    form.trigger(); // Force form validation after programmatic value setting
  };

  useEffect(() => {
    if (vehicleData?.marca && vehicleData?.modelo && vehicleData?.ano) {
      const valuationRequest = {
        ano: vehicleData.ano,
        marca: vehicleData.marca,
        modelo: vehicleData.modelo,
      };

      getValuation(valuationRequest);
    }
  }, [vehicleData, getValuation]);

  // Show valuation results if available
  if (data && data[0]) {
    const results = data[0];

    
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Valoración de Mercado
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Resultados para {vehicleData?.marca} {vehicleData?.modelo}{" "}
            {vehicleData?.ano}
          </p>
        </div>

        {/* Scraping Results Display */}
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ARS Prices */}
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                  💰 Precios en Pesos (ARS)
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Mínimo:</span>
                    <span className="font-mono font-medium text-blue-700 dark:text-blue-300">
                      ${results.precios_ars_completo.min.toLocaleString('es-AR')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Máximo:</span>
                    <span className="font-mono font-medium text-blue-700 dark:text-blue-300">
                      ${results.precios_ars_completo.max.toLocaleString('es-AR')}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Promedio:</span>
                    <span className="font-mono font-bold text-blue-800 dark:text-blue-200">
                      ${results.precios_ars_completo.avg.toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>
              </div>

              {/* USD Prices */}
              <div>
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">
                  💵 Precios en Dólares (USD)
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Mínimo:</span>
                    <span className="font-mono font-medium text-green-700 dark:text-green-300">
                      US$ {results.precios_usd_completo.min.toLocaleString('en-US')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Máximo:</span>
                    <span className="font-mono font-medium text-green-700 dark:text-green-300">
                      US$ {results.precios_usd_completo.max.toLocaleString('en-US')}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Promedio:</span>
                    <span className="font-mono font-bold text-green-800 dark:text-green-200">
                      US$ {results.precios_usd_completo.avg.toLocaleString('en-US')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Info */}
            <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700 flex justify-between items-center text-sm text-blue-700 dark:text-blue-300">
              <span>📊 {results.total_vehiculos} vehículos analizados</span>
              <span>💱 {results.exchange_rate_used}</span>
            </div>

            {/* Link to MercadoLibre Search */}
            {results.search_url && (
              <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
                <a
                  href={results.search_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
                >
                  🔗 Ver todos los resultados en MercadoLibre
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </div>

          {/* Top 3 Listings */}
          {results.primeros_3_productos && results.primeros_3_productos.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                🚗 Principales Publicaciones
              </h4>
              <div className="grid gap-4">
                {results.primeros_3_productos.map((vehicle, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {vehicle.image && vehicle.image.trim() && !vehicle.image.includes('data:image/gif') ? (
                          <img
                            src={vehicle.image}
                            alt={vehicle.name}
                            className="w-20 h-16 object-cover rounded-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA4MCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAzMkgzNlYzNkgyNFYzMlpNNDQgMzJINTZWMzZINDRWMzJaTTI0IDQwSDU2VjQ0SDI0VjQwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                              target.alt = 'Imagen no disponible';
                            }}
                          />
                        ) : (
                          <div className="w-20 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-gray-900 dark:text-white text-sm mb-2 line-clamp-2">
                          {vehicle.url ? (
                            <a 
                              href={vehicle.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline"
                            >
                              {vehicle.name}
                            </a>
                          ) : (
                            vehicle.name
                          )}
                        </h5>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-400">
                          {vehicle.kilometers && (
                            <span className="flex items-center gap-1">
                              🛣️ {vehicle.kilometers}
                            </span>
                          )}
                          {vehicle.city && (
                            <span className="flex items-center gap-1">
                              📍 {vehicle.city}
                            </span>
                          )}
                          {vehicle.url && (
                            <a
                              href={vehicle.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
                            >
                              🔗 Ver publicación
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="font-mono font-bold text-gray-900 dark:text-white">
                          {vehicle.priceCurrency === 'USD' ? 'US$ ' : '$ '}
                          {vehicle.price.toLocaleString(
                            vehicle.priceCurrency === 'USD' ? 'en-US' : 'es-AR'
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handlePriceSelect(vehicle.price, vehicle.priceCurrency as "ARS" | "USD")}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mt-1"
                        >
                          Usar este precio
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Price Suggestions */}
          <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-3">
              💡 Sugerencias de Precio
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handlePriceSelect(results.precios_ars_completo.avg, "ARS")}
                className="text-left p-3 bg-white dark:bg-zinc-800 border border-yellow-300 dark:border-yellow-700 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-950/40 transition-colors"
              >
                <div className="text-sm font-medium text-gray-900 dark:text-white">Promedio ARS</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                  ${results.precios_ars_completo.avg.toLocaleString('es-AR')}
                </div>
              </button>
              <button
                type="button"
                onClick={() => handlePriceSelect(results.precios_usd_completo.avg, "USD")}
                className="text-left p-3 bg-white dark:bg-zinc-800 border border-yellow-300 dark:border-yellow-700 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-950/40 transition-colors"
              >
                <div className="text-sm font-medium text-gray-900 dark:text-white">Promedio USD</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                  US$ {results.precios_usd_completo.avg.toLocaleString('en-US')}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Price form below the results */}
        <div className="border-t pt-6">
          <h4 className="font-medium mb-4 text-gray-900 dark:text-white">
            💰 Establecer Precio de Venta
          </h4>
          <PriceFormContent form={form} onSubmit={onSubmit} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      {/* Loading State with Price Form */}
      {isLoading && (
        <div className="space-y-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <IconLoader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Obteniendo valoración de mercado...
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {vehicleData?.marca} {vehicleData?.modelo} {vehicleData?.ano}
              </p>
            </div>
          </div>
          
          {/* Price Form available during loading */}
          <div className="border-t pt-6">
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                💡 <strong>Consejo</strong>: Puedes establecer el precio ahora mientras esperamos los datos de mercado
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-300">
                Los datos del scraping aparecerán automáticamente cuando estén listos
              </p>
            </div>
            <h4 className="font-medium mb-4 text-gray-900 dark:text-white">
              💰 Establecer Precio de Venta
            </h4>
            <PriceFormContent form={form} onSubmit={onSubmit} />
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-800 dark:text-red-200 font-medium mb-2">
            ❌ Error al obtener valoración
          </p>
          <p className="text-xs text-red-600 dark:text-red-300">
            {error.message}
          </p>
          <p className="text-xs text-red-500 dark:text-red-400 mt-2">
            Puedes continuar con el precio manual
          </p>
        </div>
      )}

      {/* Step 1 Summary - only show when not loading */}
      {vehicleData && !isLoading && (
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-800 dark:text-green-200 font-medium mb-2">
            ✓ Información del vehículo completada
          </p>
          <p className="text-xs text-green-600 dark:text-green-300">
            {vehicleData.marca} {vehicleData.modelo} {vehicleData.ano}
          </p>
        </div>
      )}

      {/* Price Form - only show when not loading */}
      {!isLoading && (
        <>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Precio de Venta
          </h3>
          <PriceFormContent form={form} onSubmit={onSubmit} />
        </>
      )}
    </motion.div>
  );
}

// Extracted price form content component
function PriceFormContent({
  form,
  onSubmit,
}: {
  form: UseFormReturn<PriceFormData>;
  onSubmit: (data: PriceFormData) => void;
}) {
  return (
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
                <FormLabel className="text-green-800 dark:text-green-100">
                  Precio *
                </FormLabel>
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
  );
}
