# 🔐 Configuración de Autenticación Supabase

Este documento describe la implementación completa del sistema de autenticación con Supabase y Row Level Security (RLS) para la aplicación Venta-Autos.

## ✅ Lo que se ha implementado

### 1. **Middleware de Supabase** ✅
- ✅ `middleware.ts` - Intercepta todas las rutas y mantiene la sesión
- ✅ `utils/supabase/middleware.ts` - Lógica de actualización de sesión

### 2. **Componentes de Autenticación** ✅
- ✅ `components/auth/auth-provider.tsx` - Contexto global de autenticación
- ✅ `components/auth/login-form.tsx` - Formulario de login con email/password
- ✅ `components/auth/user-menu.tsx` - Menú de usuario en el header
- ✅ `app/login/page.tsx` - Página dedicada de login

### 3. **Layout Actualizado** ✅
- ✅ Header con autenticación integrada
- ✅ AuthProvider envolviendo toda la aplicación
- ✅ UserMenu mostrando estado de autenticación

### 4. **Row Level Security (RLS)** ✅
- ✅ `rls-setup.sql` - Script completo para configurar RLS

## 🚀 Pasos para completar la configuración

### Paso 1: Ejecutar el script RLS en Supabase

1. **Abrir Supabase Dashboard**
   - Ve a tu proyecto en [supabase.com](https://supabase.com)
   - Navega a SQL Editor

2. **Ejecutar el script RLS**
   ```sql
   -- Copia y pega el contenido completo de rls-setup.sql
   -- Esto agregará:
   -- - Columna user_id a la tabla vehiculos
   -- - Políticas RLS para proteger los datos
   -- - Funciones auxiliares para consultas seguras
   ```

### Paso 2: Verificar configuración de autenticación

1. **Variables de entorno** (verificar que existan en `.env.local`):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
   ```

2. **Verificar usuario de prueba**:
   - Email: `am.motos@hotmail.com`
   - Password: `123456`

### Paso 3: Probar la aplicación

1. **Iniciar el servidor**:
   ```bash
   npm run dev
   ```

2. **Probar flujo de autenticación**:
   - Ir a `http://localhost:3001`
   - El middleware te redirigirá a `/login`
   - Usar las credenciales: `am.motos@hotmail.com` / `123456`
   - Después del login exitoso, serás redirigido a la página principal

## 📋 Funcionalidades implementadas

### 🔒 Seguridad
- **Row Level Security (RLS)** habilitado en todas las tablas
- **Middleware de autenticación** protege todas las rutas
- **Políticas granulares** para CRUD de vehículos y fotos

### 🎯 User Experience
- **Login automático** al acceder a la aplicación
- **Estado de autenticación** visible en el header
- **Logout seguro** con limpieza de sesión
- **Formulario responsive** con validación

### 🏗️ Arquitectura
- **Context API** para estado global de autenticación
- **Server-side rendering** compatible con Next.js 15
- **TypeScript** completo con tipos de Supabase
- **Componentes reutilizables** para auth

## 🛠️ Políticas RLS implementadas

### Tabla `vehiculos`:
- ✅ **SELECT**: Ver vehículos publicados + propios vehículos
- ✅ **INSERT**: Solo usuarios autenticados, con user_id
- ✅ **UPDATE**: Solo propios vehículos
- ✅ **DELETE**: Solo propios vehículos

### Tabla `vehiculo_fotos`:
- ✅ **SELECT**: Cualquiera puede ver fotos (catálogo público)
- ✅ **INSERT**: Solo fotos de vehículos propios
- ✅ **UPDATE**: Solo fotos de vehículos propios
- ✅ **DELETE**: Solo fotos de vehículos propios

## 🔧 Funciones SQL creadas

1. **`get_user_vehiculos()`** - Obtiene vehículos del usuario actual
2. **`get_public_vehiculos()`** - Obtiene vehículos publicados para catálogo
3. **`get_vehiculos_con_fotos()`** - Obtiene vehículos con sus fotos asociadas

## ⚡ Próximos pasos

1. **Ejecutar `rls-setup.sql`** en Supabase SQL Editor
2. **Probar login** con las credenciales proporcionadas
3. **Verificar redirecciones** y flujo de autenticación
4. **Testear creación** de nuevos vehículos con user_id

## 📞 Soporte

Si encuentras algún problema:

1. Verifica que las variables de entorno estén configuradas
2. Confirma que el usuario `am.motos@hotmail.com` existe en Auth > Users
3. Ejecuta el script `rls-setup.sql` si hay errores de permisos
4. Revisa la consola del navegador para errores de JavaScript

---

**Estado**: ✅ Implementación completa - Listo para pruebas
**Usuario de prueba**: `am.motos@hotmail.com` / `123456`