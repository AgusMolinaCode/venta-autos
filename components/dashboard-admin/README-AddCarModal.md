# AddCarModal Component

Un componente modal con múltiples pasos para agregar nuevos vehículos al sistema.

## Características

- ✅ **3 Pasos de formulario**: Información básica, detalles y precio, subida de fotos
- ✅ **Validación integrada**: Validación de campos requeridos y formato de datos
- ✅ **Animaciones fluidas**: Transiciones con Framer Motion
- ✅ **Responsive design**: Adaptado para móvil y desktop
- ✅ **Dark mode support**: Compatible con el sistema de temas del proyecto
- ✅ **TypeScript**: Tipado completo para mejor seguridad
- ✅ **Integración con constantes**: Usa `marcasAutos` y otros datos del proyecto

## Uso Básico

```tsx
import { AddCarModal } from "@/components/dashboard-admin/add-car-modal";

function MyComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCarSubmit = (formData) => {
    console.log("Datos del auto:", formData);
    // Procesar datos (guardar en BD, API, etc.)
  };

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>
        Agregar Auto
      </button>
      
      <AddCarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCarSubmit}
      />
    </>
  );
}
```

## Props

| Prop | Tipo | Descripción | Requerido |
|------|------|-------------|-----------|
| `isOpen` | `boolean` | Controla la visibilidad del modal | ✅ |
| `onClose` | `() => void` | Función que se ejecuta al cerrar el modal | ✅ |
| `onSubmit` | `(data: FormData) => void` | Función que recibe los datos del formulario | ⚪ |

## Estructura de Datos

```typescript
interface FormData {
  marca: string;           // * Requerido
  modelo: string;          // * Requerido  
  ano: string;            // * Requerido (1970-2025)
  precio: string;         // * Requerido
  kilometraje: string;    // Opcional
  descripcion: string;    // Opcional
  combustible: string;    // Opcional
  transmision: string;    // Opcional
  version: string;        // Opcional
  color: string;          // Opcional
}
```

## Pasos del Formulario

### Paso 1: Información Básica
- Marca (selector con marcas argentinas)
- Modelo (texto libre)
- Año (número, 1970-2025)
- Combustible (Nafta, Diesel, GNC, Eléctrico, Híbrido)
- Transmisión (Manual, Automática, CVT)

### Paso 2: Precio
- Precio en ARS/USD (número con checkbox para moneda)

### Paso 3: Detalles Adicionales
- Kilometraje (número)
- Versión (texto libre)
- Color (texto libre)
- Descripción (textarea)

### Paso 3: Fotos
- Subida de hasta 10 archivos
- Formatos: JPG, PNG
- Vista previa con opción de eliminar
- Drag & drop support

## Validaciones

- **Campos requeridos**: Marca, modelo, año, precio
- **Año válido**: Entre 1970 y 2025
- **Precio**: Número positivo
- **Kilometraje**: Número positivo (opcional)
- **Límite de fotos**: Máximo 10 archivos

## Integración con el Proyecto

El componente está integrado con:
- ✅ `marcasAutos` de `/constants`
- ✅ UI components existentes (`Button`, `Input`, `Select`, etc.)
- ✅ Tema dark/light del proyecto
- ✅ Sistema de validación consistente
- ✅ Iconos de `lucide-react`
- ✅ Animaciones de `framer-motion`

## Personalización

### Agregar nuevas ciudades
```typescript
// En el componente, puedes modificar el array ciudades
const ciudades = [
  "Buenos Aires",
  "Córdoba",
  // ... agregar más ciudades
];
```

### Modificar validaciones
```typescript
// En la función handleSubmit
const ano = parseInt(formData.ano);
if (ano < 1970 || ano > 2030) { // Cambiar rango
  alert("Año inválido");
  return;
}
```

### Personalizar estilos
El modal usa clases de Tailwind CSS y es completamente personalizable modificando las clases en el JSX.

## Ejemplo Completo

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AddCarModal } from "@/components/dashboard-admin/add-car-modal";

export function VehicleManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehicles, setVehicles] = useState([]);

  const handleAddVehicle = (formData) => {
    // Agregar al estado local
    setVehicles(prev => [...prev, { ...formData, id: Date.now() }]);
    
    // Aquí podrías hacer una llamada a API
    // await saveVehicle(formData);
    
    console.log("Vehículo agregado:", formData);
  };

  return (
    <div>
      <Button onClick={() => setIsModalOpen(true)}>
        ➕ Agregar Vehículo
      </Button>

      <AddCarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddVehicle}
      />

      {/* Lista de vehículos */}
      <div className="mt-4">
        {vehicles.map(vehicle => (
          <div key={vehicle.id} className="p-4 border rounded">
            {vehicle.marca} {vehicle.modelo} {vehicle.ano}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Notas de Desarrollo

- El componente resetea automáticamente el formulario tras envío exitoso
- Las animaciones requieren `framer-motion` (ya incluido en el proyecto)
- Los archivos subidos se almacenan en el estado como `File[]`
- La validación es client-side; agrega validación server-side según necesites