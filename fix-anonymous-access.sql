-- Fix Anonymous Access to Published Vehicles
-- Execute this in Supabase SQL Editor

-- 1. Drop existing restrictive policy
DROP POLICY IF EXISTS "Anyone can view published vehiculos" ON vehiculos;
DROP POLICY IF EXISTS "Public access to published vehiculos" ON vehiculos;

-- 2. Create new policy that allows anonymous access to published vehicles
CREATE POLICY "Anonymous access to published vehiculos" ON vehiculos
    FOR SELECT USING (
        estado = 'publicado' AND (
            auth.role() = 'anon' OR
            auth.role() = 'authenticated'
        )
    );

-- 3. Ensure vehiculo_fotos table has proper anonymous access
DROP POLICY IF EXISTS "Anyone can view vehiculo_fotos" ON vehiculo_fotos;
DROP POLICY IF EXISTS "Public access to published vehicle photos" ON vehiculo_fotos;

-- 4. Create policy for anonymous access to photos of published vehicles
CREATE POLICY "Anonymous access to published vehicle photos" ON vehiculo_fotos
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM vehiculos
            WHERE vehiculos.id = vehiculo_fotos.vehiculo_id
            AND vehiculos.estado = 'publicado'
        ) AND (
            auth.role() = 'anon' OR
            auth.role() = 'authenticated'
        )
    );

-- 5. Verify RLS is enabled on both tables
ALTER TABLE vehiculos ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehiculo_fotos ENABLE ROW LEVEL SECURITY;

-- 6. Test the policies work
SELECT
    'vehiculos' as table_name,
    COUNT(*) as total_visible_to_anon
FROM vehiculos
WHERE estado = 'publicado';

-- 7. Verify policies exist
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE tablename IN ('vehiculos', 'vehiculo_fotos')
ORDER BY tablename, policyname;

-- 8. Show current RLS status
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename IN ('vehiculos', 'vehiculo_fotos');