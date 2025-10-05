-- Script para implementar Row Level Security (RLS) en el sistema de venta de autos
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar y agregar columna user_id a la tabla vehiculos si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'vehiculos' 
        AND column_name = 'user_id'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.vehiculos ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        
        -- Crear índice para mejor performance
        CREATE INDEX IF NOT EXISTS idx_vehiculos_user_id ON public.vehiculos(user_id);
        
        RAISE NOTICE 'Columna user_id agregada a la tabla vehiculos';
    ELSE
        RAISE NOTICE 'Columna user_id ya existe en la tabla vehiculos';
    END IF;
END $$;

-- 2. Habilitar Row Level Security en las tablas
ALTER TABLE public.vehiculos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehiculo_fotos ENABLE ROW LEVEL SECURITY;

-- 3. Eliminar políticas existentes si existen (para evitar conflictos)
DROP POLICY IF EXISTS "Anyone can view published vehiculos" ON public.vehiculos;
DROP POLICY IF EXISTS "Anyone can view vehiculos" ON public.vehiculos;
DROP POLICY IF EXISTS "Authenticated users can insert vehiculos" ON public.vehiculos;
DROP POLICY IF EXISTS "Users can update own vehiculos" ON public.vehiculos;
DROP POLICY IF EXISTS "Users can delete own vehiculos" ON public.vehiculos;

-- 4. Crear políticas RLS para la tabla vehiculos

-- Cualquiera puede ver todos los vehículos (catálogo público) o el propietario puede ver los suyos
CREATE POLICY "Anyone can view vehiculos" ON public.vehiculos
    FOR SELECT USING (
        true  -- Permitir ver todos los vehículos públicamente
        OR user_id = auth.uid()  -- O el propietario puede ver los suyos
    );

-- Solo usuarios autenticados pueden insertar vehículos
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

-- 5. Crear políticas RLS para la tabla vehiculo_fotos

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Anyone can view vehiculo fotos" ON public.vehiculo_fotos;
DROP POLICY IF EXISTS "Authenticated users can insert vehiculo fotos" ON public.vehiculo_fotos;
DROP POLICY IF EXISTS "Users can update own vehiculo fotos" ON public.vehiculo_fotos;
DROP POLICY IF EXISTS "Users can delete own vehiculo fotos" ON public.vehiculo_fotos;

-- Cualquiera puede ver las fotos (para el catálogo público)
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

-- 6. Verificar que RLS está habilitado
SELECT 
    schemaname, 
    tablename, 
    rowsecurity,
    relforcerowsecurity
FROM pg_tables t
JOIN pg_class c ON c.relname = t.tablename
WHERE t.tablename = 'vehiculos' 
AND t.schemaname = 'public';

-- 7. Mostrar todas las políticas RLS creadas
SELECT 
    policyname,
    cmd,
    roles,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'vehiculos' 
AND schemaname = 'public';

-- 8. Crear función para obtener vehículos del usuario actual
CREATE OR REPLACE FUNCTION get_user_vehiculos()
RETURNS TABLE (
    id UUID,
    marca TEXT,
    modelo TEXT,
    ano INTEGER,
    kilometraje INTEGER,
    version TEXT,
    combustible TEXT,
    transmision TEXT,
    color TEXT,
    descripcion TEXT,
    tipo_vehiculo TEXT,
    precio NUMERIC,
    moneda TEXT,
    created_at TIMESTAMPTZ,
    user_id UUID
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
    SELECT 
        v.id,
        v.marca,
        v.modelo,
        v.ano,
        v.kilometraje,
        v.version,
        v.combustible,
        v.transmision,
        v.color,
        v.descripcion,
        v.tipo_vehiculo,
        v.precio,
        v.moneda,
        v.created_at,
        v.user_id
    FROM public.vehiculos v
    WHERE v.user_id = auth.uid()
    ORDER BY v.created_at DESC;
$$;

-- 9. Crear función para obtener vehículos públicos
CREATE OR REPLACE FUNCTION get_public_vehiculos(
    p_limit INTEGER DEFAULT 20,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    marca TEXT,
    modelo TEXT,
    ano INTEGER,
    kilometraje INTEGER,
    version TEXT,
    combustible TEXT,
    transmision TEXT,
    color TEXT,
    descripcion TEXT,
    tipo_vehiculo TEXT,
    precio NUMERIC,
    moneda TEXT,
    created_at TIMESTAMPTZ
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
    SELECT 
        v.id,
        v.marca,
        v.modelo,
        v.ano,
        v.kilometraje,
        v.version,
        v.combustible,
        v.transmision,
        v.color,
        v.descripcion,
        v.tipo_vehiculo,
        v.precio,
        v.moneda,
        v.created_at
    FROM public.vehiculos v
    ORDER BY v.created_at DESC
    LIMIT p_limit OFFSET p_offset;
$$;

-- 10. Comentarios para documentación
COMMENT ON COLUMN public.vehiculos.user_id IS 'ID del usuario que creó el vehículo (referencia a auth.users)';
COMMENT ON POLICY "Anyone can view vehiculos" ON public.vehiculos IS 'Permite que cualquiera vea todos los vehículos o que el propietario vea los suyos';
COMMENT ON POLICY "Authenticated users can insert vehiculos" ON public.vehiculos IS 'Solo usuarios autenticados pueden crear vehículos y deben ser propietarios';
COMMENT ON POLICY "Users can update own vehiculos" ON public.vehiculos IS 'Los usuarios solo pueden actualizar sus propios vehículos';
COMMENT ON POLICY "Users can delete own vehiculos" ON public.vehiculos IS 'Los usuarios solo pueden eliminar sus propios vehículos';

-- 11. Verificación final
SELECT 'RLS Setup completed successfully!' as status;