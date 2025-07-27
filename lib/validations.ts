import { z } from "zod";

// Form input schema (what the form accepts)
export const VehicleFormInputSchema = z.object({
  marca: z.string().min(1, {
    message: "La marca es obligatoria.",
  }),
  modelo: z.string().min(1, {
    message: "El modelo es obligatorio.",
  }),
  ano: z.union([
    z.number().min(1970, {
      message: "El año debe ser mayor a 1970.",
    }).max(2025, {
      message: "El año no puede ser mayor a 2025.",
    }),
    z.undefined()
  ]).optional(),
  kilometraje: z.number().min(0, {
    message: "El kilometraje debe ser mayor o igual a 0.",
  }).optional(),
  version: z.string().optional(),
  combustible: z.string().optional(),
  transmision: z.string().optional(),
  color: z.string().optional(),
  descripcion: z.string().optional(),
});

// Processed data schema (what gets saved/validated)
export const VehicleDataSchema = VehicleFormInputSchema.extend({
  ano: z.number().min(1970, {
    message: "El año debe ser mayor a 1970.",
  }).max(2025, {
    message: "El año no puede ser mayor a 2025.",
  }),
});

export const PriceSchema = z.object({
  precio: z.number().min(0, {
    message: "El precio debe ser mayor o igual a 0.",
  }).optional(),
  moneda: z.enum(["ARS", "USD"]).default("ARS").optional(),
});

export const FormSchema = VehicleFormInputSchema.and(PriceSchema);
export const ProcessedFormSchema = VehicleDataSchema.and(PriceSchema);

export const UrlFetchSchema = z.object({
  url: z.string().url({
    message: "Debe ser una URL válida",
  }),
});

export const FetchedVehicleDataSchema = z.object({
  precio: z.number().optional(),
  marca: z.string().optional(),
  modelo: z.string().optional(),
  kilometraje: z.number().optional(),
});