"use client"

import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { marcasAutos } from "@/constants"

const FormSchema = z.object({
  marca: z.string().min(1, {
    message: "La marca es obligatoria.",
  }),
  modelo: z.string().min(1, {
    message: "El modelo es obligatorio.",
  }),
  ano: z.number().min(1900, {
    message: "El año debe ser mayor a 1900.",
  }).max(new Date().getFullYear() + 2, {
    message: "El año no puede ser futuro.",
  }),
  kilometraje: z.number().min(0, {
    message: "El kilometraje debe ser mayor o igual a 0.",
  }),
  precio: z.number().min(0, {
    message: "El precio debe ser mayor a 0.",
  }).optional(),
  version: z.string().optional(),
  combustible: z.string().optional(),
  transmision: z.string().optional(),
  color: z.string().optional(),
  descripcion: z.string().optional(),
})

export type VehicleFormData = z.infer<typeof FormSchema>

interface VehicleFormProps {
  onSubmit: (data: VehicleFormData) => void
  onCancel?: () => void
}

export function VehicleForm({ onSubmit, onCancel }: VehicleFormProps) {
  const form = useForm<VehicleFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      marca: "",
      modelo: "",
      ano: new Date().getFullYear(),
      kilometraje: 0,
      precio: undefined,
      version: "",
      combustible: "",
      transmision: "",
      color: "",
      descripcion: "",
    },
  })

  function handleSubmit(data: VehicleFormData) {
    onSubmit(data)
    toast.success("Vehículo agregado correctamente", {
      description: `${data.marca} ${data.modelo} ${data.ano}`,
    })
    form.reset()
  }

  // URL generation when marca, modelo, año are selected
  const watchedValues = form.watch(["marca", "modelo", "ano"])
  const [marca, modelo, ano] = watchedValues

  // Generate URL when all three required fields are filled
  React.useEffect(() => {
    if (marca && modelo && ano) {
      const url = `/vehicles/${encodeURIComponent(marca.toLowerCase())}-${encodeURIComponent(modelo.toLowerCase().replace(/\s+/g, '-'))}-${ano}`
      console.log('Generated URL:', url)
    }
  }, [marca, modelo, ano])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Required Fields Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="marca"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marca *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
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
                  <Input placeholder="Ingrese el modelo" {...field} />
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
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
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
                <FormLabel>Kilometraje *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={0}
                    placeholder="Kilometraje"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Optional Fields Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    placeholder="Precio en USD"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormDescription>Precio en dólares americanos</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="version"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Versión</FormLabel>
                <FormControl>
                  <Input placeholder="Ingrese la versión" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Optional Fields Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="combustible"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Combustible</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
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

        {/* Color Field */}
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <Input placeholder="Color del vehículo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Agregue detalles adicionales sobre el vehículo
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
        </div>

      </form>
    </Form>
  )
}