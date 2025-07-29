# 🗄️ Configuración de Supabase para Sistema de Vehículos

## 📋 Resumen de la Implementación

Este sistema está diseñado con **Domain-Driven Design (DDD)** para manejar la carga completa de vehículos con fotos en Supabase PostgreSQL.

### 🏗️ Arquitectura de Datos

```
vehicles (tabla principal)
├── id (UUID, PK)
├── marca, modelo, ano (campos obligatorios)
├── kilometraje, version, combustible, etc. (campos opcionales)
├── precio, moneda (información de precio)
└── created_at, updated_at, user_id (metadatos)

vehicle_photos (fotos relacionadas)
├── id (UUID, PK) 
├── vehicle_id (FK → vehicles.id)
├── file_name, file_path, file_size, mime_type
├── storage_path (ruta en Supabase Storage)
├── is_primary, order_index (organización)
└── created_at

Storage Bucket: vehicle-photos
├── vehicles/[vehicle_id]/[filename]
├── Público: true
├── Límite: 5MB por archivo
└── Tipos: jpeg, jpg, png, webp
```

## 🚀 Pasos de Configuración en Supabase

### 1. Ejecutar Scripts SQL
```sql
-- Copiar y ejecutar el contenido de supabase-setup.sql
-- en el SQL Editor de tu proyecto Supabase
```

### 2. Crear Storage Bucket
En el dashboard de Supabase > Storage:
```javascript
// Crear bucket con configuración
const { data, error } = await supabase.storage.createBucket('vehicle-photos', {
  public: true,
  allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  fileSizeLimit: 5242880 // 5MB
});
```

### 3. Variables de Entorno
```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

## 🔍 Logging de Consola - Qué Verás

Cuando completes la carga de un vehículo, verás en la consola:

### 📋 Fase 1: Datos Antes del Envío
```
🚗 DATOS FINALES ANTES DE ENVIAR A SUPABASE
📋 Información del Vehículo:
  marca: "Toyota"
  modelo: "Corolla"
  ano: 2020
  kilometraje: 50000
  precio: 25000
  moneda: "USD"

📸 Archivos de Fotos:
  cantidad: 3
  archivos: [
    { index: 1, nombre: "frente.jpg", tamaño_mb: "2.1 MB", tipo: "image/jpeg" },
    { index: 2, nombre: "interior.jpg", tamaño_mb: "1.8 MB", tipo: "image/jpeg" },
    { index: 3, nombre: "motor.jpg", tamaño_mb: "2.3 MB", tipo: "image/jpeg" }
  ]
```

### 🗄️ Fase 2: Estructura para Supabase
```
🗄️ Estructura que se enviará a Supabase:
📊 Tabla "vehicles":
  marca: "Toyota"
  modelo: "Corolla" 
  ano: 2020
  precio: 25000
  moneda: "USD"

📊 Tabla "vehicle_photos" (se creará para cada foto):
  Foto 1: {
    vehicle_id: "[Se generará automáticamente]"
    file_name: "frente.jpg"
    storage_path: "vehicles/[vehicle_id]/frente.jpg"
    is_primary: true
    order_index: 0
  }
```

### 🔄 Fase 3: Procesamiento en Supabase
```
🚗 PROCESANDO DATOS PARA SUPABASE
✅ Validación exitosa
🔄 Insertando vehículo en base de datos...
✅ Vehículo creado: { id: "a1b2c3d4-...", marca: "Toyota", modelo: "Corolla" }
🔄 Subiendo fotos a Storage...
✅ Foto 1/3 subida: frente.jpg
✅ Foto 2/3 subida: interior.jpg
✅ Foto 3/3 subida: motor.jpg
```

### 📊 Fase 4: Estructura Final en la Base de Datos
```
🗄️ ESTRUCTURA FINAL PARA SUPABASE:
📊 Tabla vehicles:
  id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  marca: "Toyota"
  modelo: "Corolla"
  ano: 2020
  precio: 25000
  moneda: "USD"
  created_at: "2024-01-15T10:30:00Z"

📊 Tabla vehicle_photos:
  Foto 1: {
    id: "f1e2d3c4-b5a6-7890-cdef-123456789abc"
    vehicle_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
    file_name: "frente.jpg"
    storage_path: "vehicles/a1b2c3d4.../frente_1705316200123.jpg"
    is_primary: true
    order_index: 0
  }

📁 Storage Bucket: vehicle-photos
🔗 URLs públicas de fotos: [
  "https://tuproyecto.supabase.co/storage/v1/object/public/vehicle-photos/vehicles/a1b2c3d4.../frente_1705316200123.jpg"
]
```

## 🎯 Estructura Real en tu Base de Datos PostgreSQL

Después de ejecutar el setup, tendrás:

### Tabla `vehicles`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Clave primaria generada automáticamente |
| marca | VARCHAR(100) | Marca del vehículo (ej: Toyota) |
| modelo | VARCHAR(100) | Modelo del vehículo (ej: Corolla) |
| ano | INTEGER | Año del vehículo (1970-2025) |
| precio | DECIMAL(15,2) | Precio del vehículo |
| moneda | VARCHAR(3) | ARS o USD |
| user_id | UUID | FK a auth.users |

### Tabla `vehicle_photos`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Clave primaria |
| vehicle_id | UUID | FK a vehicles.id |
| file_name | VARCHAR(255) | Nombre original del archivo |
| storage_path | VARCHAR(500) | Ruta en Supabase Storage |
| is_primary | BOOLEAN | Si es la foto principal |
| order_index | INTEGER | Orden de visualización |

### Storage `vehicle-photos`
```
vehicle-photos/
└── vehicles/
    └── [vehicle-id]/
        ├── foto1_timestamp_random.jpg
        ├── foto2_timestamp_random.jpg
        └── foto3_timestamp_random.jpg
```

## 🔧 Funciones Auxiliares Incluidas

- **`get_vehicles_with_photos()`**: Función SQL para obtener vehículos con fotos
- **`vehicle_stats`**: Vista para estadísticas del dashboard
- **Row Level Security**: Configurado para multiusuario
- **Índices optimizados**: Para búsquedas rápidas
- **Triggers**: Para actualización automática de timestamps

## ✅ Verificación de la Instalación

Ejecuta en el SQL Editor de Supabase:
```sql
-- Verificar tablas creadas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('vehicles', 'vehicle_photos');

-- Verificar bucket de storage
SELECT name FROM storage.buckets WHERE name = 'vehicle-photos';
```

¡Listo! Tu base de datos PostgreSQL en Supabase está configurada para recibir vehículos con fotos.