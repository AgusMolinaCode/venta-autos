-- Script para diagnosticar problemas con la tabla vehiculo_fotos
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar si existe la tabla vehiculo_fotos
SELECT 
    table_name,
    table_schema,
    table_type
FROM information_schema.tables 
WHERE table_name = 'vehiculo_fotos' 
AND table_schema = 'public';

-- 2. Si existe, mostrar su estructura
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'vehiculo_fotos' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Verificar restricciones y foreign keys
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'public.vehiculo_fotos'::regclass;

-- 4. Verificar políticas RLS
SELECT 
    policyname,
    cmd,
    roles,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'vehiculo_fotos';

-- 5. Intentar crear la tabla si no existe
CREATE TABLE IF NOT EXISTS public.vehiculo_fotos (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    vehiculo_id uuid NOT NULL,
    file_name text NOT NULL,
    file_path text NOT NULL,
    file_size integer NOT NULL,
    mime_type text NOT NULL,
    storage_path text NOT NULL,
    is_primary boolean DEFAULT false,
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT vehiculo_fotos_pkey PRIMARY KEY (id),
    CONSTRAINT vehiculo_fotos_vehiculo_id_fkey FOREIGN KEY (vehiculo_id) 
        REFERENCES public.vehiculos(id) ON DELETE CASCADE
);

-- 6. Verificar bucket de storage
SELECT 
    name,
    id,
    created_at,
    updated_at,
    public
FROM storage.buckets 
WHERE name = 'venta-autos-images';

-- 7. Verificar políticas de storage
SELECT 
    policyname,
    cmd,
    roles,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%venta-autos%';

-- 8. Mostrar contenido actual de vehiculos
SELECT 
    id,
    marca,
    modelo,
    ano,
    created_at
FROM public.vehiculos 
ORDER BY created_at DESC 
LIMIT 5;

-- 9. Mostrar contenido actual de vehiculo_fotos (si existe)
SELECT 
    vf.id,
    vf.vehiculo_id,
    vf.file_name,
    vf.storage_path,
    vf.is_primary,
    v.marca,
    v.modelo
FROM public.vehiculo_fotos vf
JOIN public.vehiculos v ON vf.vehiculo_id = v.id
ORDER BY vf.created_at DESC 
LIMIT 10;