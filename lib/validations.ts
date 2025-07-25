import { z } from "zod";

export const FormSchema = z.object({
  marca: z.string().min(1, {
    message: "La marca es obligatoria.",
  }),
  modelo: z.string().min(1, {
    message: "El modelo es obligatorio.",
  }),
  ano: z.number().min(1970, {
    message: "El año debe ser mayor a 1970.",
  }).max(new Date().getFullYear() + 2, {
    message: "El año no puede ser futuro.",
  }).optional(),
  kilometraje: z.number().min(0, {
    message: "El kilometraje debe ser mayor o igual a 0.",
  }).optional(),
  precio: z.number().min(0, {
    message: "El precio debe ser mayor o igual a 0.",
  }).optional(),
  version: z.string().optional(),
  combustible: z.string().optional(),
  transmision: z.string().optional(),
  color: z.string().optional(),
  descripcion: z.string().optional(),
});