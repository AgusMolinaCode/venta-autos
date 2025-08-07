-- Script para asignar user_id a vehículos existentes y configurar RLS
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar el usuario existente
SELECT 
    id,
    email,
    created_at
FROM auth.users 
WHERE email = 'am.motos@hotmail.com';

-- 2. Mostrar vehículos sin user_id
SELECT 
    id,
    marca,
    modelo,
    ano,
    user_id,
    created_at
FROM public.vehiculos 
WHERE user_id IS NULL
ORDER BY created_at DESC;

-- 3. Asignar todos los vehículos existentes al usuario am.motos@hotmail.com
UPDATE public.vehiculos 
SET user_id = (
    SELECT id 
    FROM auth.users 
    WHERE email = 'am.motos@hotmail.com' 
    LIMIT 1
)
WHERE user_id IS NULL;

-- 4. Verificar la actualización
SELECT 
    v.id,
    v.marca,
    v.modelo,
    v.ano,
    v.user_id,
    u.email
FROM public.vehiculos v
LEFT JOIN auth.users u ON v.user_id = u.id
ORDER BY v.created_at DESC;

-- 5. Habilitar Row Level Security si no está habilitado
ALTER TABLE public.vehiculos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehiculo_fotos ENABLE ROW LEVEL SECURITY;

-- 6. Eliminar políticas existentes si existen (para recrear)
DROP POLICY IF EXISTS "Anyone can view vehiculos" ON public.vehiculos;
DROP POLICY IF EXISTS "Authenticated users can insert vehiculos" ON public.vehiculos;
DROP POLICY IF EXISTS "Users can update own vehiculos" ON public.vehiculos;
DROP POLICY IF EXISTS "Users can delete own vehiculos" ON public.vehiculos;

-- 7. Crear políticas RLS para vehiculos
-- Cualquiera puede ver todos los vehículos (catálogo público)
CREATE POLICY "Anyone can view vehiculos" ON public.vehiculos
    FOR SELECT USING (true);

-- Solo usuarios autenticados pueden insertar vehículos y deben ser propietarios
CREATE POLICY "Authenticated users can insert vehiculos" ON public.vehiculos
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' 
        AND user_id = auth.uid()
    );

-- Los usuarios pueden actualizar solo sus propios vehículos
CREATE POLICY "Users can update own vehiculos" ON public.vehiculos
    FOR UPDATE USING (
        user_id = auth.uid()
    );

-- Los usuarios pueden eliminar solo sus propios vehículos
CREATE POLICY "Users can delete own vehiculos" ON public.vehiculos
    FOR DELETE USING (
        user_id = auth.uid()
    );

-- 8. Políticas para vehiculo_fotos
DROP POLICY IF EXISTS "Anyone can view vehiculo fotos" ON public.vehiculo_fotos;
DROP POLICY IF EXISTS "Authenticated users can insert vehiculo fotos" ON public.vehiculo_fotos;
DROP POLICY IF EXISTS "Users can update own vehiculo fotos" ON public.vehiculo_fotos;
DROP POLICY IF EXISTS "Users can delete own vehiculo fotos" ON public.vehiculo_fotos;

-- Cualquiera puede ver las fotos (catálogo público)
CREATE POLICY "Anyone can view vehiculo fotos" ON public.vehiculo_fotos
    FOR SELECT USING (true);

-- Solo usuarios autenticados pueden insertar fotos de sus vehículos
CREATE POLICY "Authenticated users can insert vehiculo fotos" ON public.vehiculo_fotos
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' 
        AND EXISTS (
            SELECT 1 FROM public.vehiculos 
            WHERE id = vehiculo_id 
            AND user_id = auth.uid()
        )
    );

-- Los usuarios pueden actualizar fotos de sus vehículos
CREATE POLICY "Users can update own vehiculo fotos" ON public.vehiculo_fotos
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.vehiculos 
            WHERE id = vehiculo_id 
            AND user_id = auth.uid()
        )
    );

-- Los usuarios pueden eliminar fotos de sus vehículos
CREATE POLICY "Users can delete own vehiculo fotos" ON public.vehiculo_fotos
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.vehiculos 
            WHERE id = vehiculo_id 
            AND user_id = auth.uid()
        )
    );

-- 9. Verificar que RLS está habilitado
SELECT 
    schemaname, 
    tablename, 
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('vehiculos', 'vehiculo_fotos');

-- 10. Mostrar todas las políticas creadas
SELECT 
    policyname,
    tablename,
    cmd,
    roles,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('vehiculos', 'vehiculo_fotos');

-- 11. Verificación final - Contar vehículos por usuario
SELECT 
    u.email,
    COUNT(v.id) as vehiculos_count
FROM auth.users u
LEFT JOIN public.vehiculos v ON v.user_id = u.id
GROUP BY u.id, u.email
ORDER BY vehiculos_count DESC;

-- Mensaje de éxito
SELECT 'RLS configurado y vehículos asignados al usuario correctamente!' as status;