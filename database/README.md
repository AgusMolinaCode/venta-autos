# Database Scripts

Scripts SQL organizados para el proyecto de Venta de Autos.

## 📁 Estructura

```
database/
├── migrations/     # Migraciones aplicadas a la base de datos
├── schema/         # Esquemas de referencia y documentación
└── debug/          # Scripts de debugging y diagnóstico
```

## 🔄 Migraciones (`migrations/`)

Migraciones ordenadas cronológicamente. Ejecutar en orden numérico.

### 001-initial-setup.sql
- **Propósito**: Configuración inicial de Supabase
- **Crea**: Tablas base, políticas RLS iniciales, storage buckets
- **Ejecutado**: Sí (setup inicial del proyecto)

### 002-vehiculo-fotos.sql
- **Propósito**: Sistema de fotos de vehículos
- **Crea**: Tabla `vehiculo_fotos`, relaciones, políticas RLS
- **Ejecutado**: Sí

### 003-rls-setup.sql
- **Propósito**: Configuración completa de Row Level Security
- **Modifica**: Políticas de acceso para `vehiculos` y `vehiculo_fotos`
- **Ejecutado**: Sí

### 004-fix-user-id.sql
- **Propósito**: Asignar user_id a vehículos existentes
- **Modifica**: Actualiza registros sin user_id, ajusta políticas RLS
- **Ejecutado**: Sí

### 005-fix-anonymous-access.sql
- **Propósito**: Permitir acceso anónimo a vehículos publicados
- **Modifica**: Políticas RLS para acceso público
- **Ejecutado**: Sí

### 006-add-estado-column.sql
- **Propósito**: Agregar columna `estado` para gestión de publicaciones
- **Agrega**: Columna `estado` con valores: publicado, pausado, vendido, preparación
- **Ejecutado**: Sí

## 📋 Schema (`schema/`)

### current-schema.sql
- **Propósito**: Documentación del schema actual de la base de datos
- **Contenido**: Estructura completa de tablas, índices, políticas RLS
- **Uso**: Referencia para desarrollo y onboarding de nuevos devs

## 🐛 Debug (`debug/`)

### debug-schema.sql
- **Propósito**: Script de diagnóstico para verificar schema
- **Uso**: Ejecutar cuando hay problemas con la estructura de BD
- **Output**: Información sobre tablas, columnas, políticas, índices

## 🚀 Cómo usar

### Aplicar una migración nueva
```bash
# En Supabase SQL Editor
cat database/migrations/XXX-nombre-migracion.sql
# Copiar y ejecutar en Supabase Dashboard
```

### Verificar schema actual
```bash
# Ejecutar en Supabase SQL Editor
cat database/debug/debug-schema.sql
```

### Consultar documentación
```bash
# Ver schema de referencia
cat database/schema/current-schema.sql
```

## ⚠️ Notas importantes

1. **No re-ejecutar migraciones**: Las migraciones ya ejecutadas no deben volver a aplicarse
2. **Orden de ejecución**: Respetar el orden numérico de las migraciones
3. **Testing**: Probar migraciones en ambiente de desarrollo antes de producción
4. **Backups**: Siempre hacer backup antes de ejecutar migraciones en producción
5. **Políticas RLS**: Verificar que las políticas RLS permitan acceso público a vehículos publicados

## 🔗 Conexión con el proyecto

- **Hook principal**: `hooks/use-all-vehicles.ts` - Usa estado='publicado' para filtrar
- **Páginas públicas**: `app/vehiculos/page.tsx`, `app/marcas/[id]/page.tsx`
- **Autenticación**: Los usuarios anónimos pueden ver vehículos publicados
- **Administración**: Los usuarios autenticados pueden gestionar sus propios vehículos
