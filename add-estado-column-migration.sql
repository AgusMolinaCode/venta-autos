-- Migration script to add estado column to vehiculos table
-- Execute this in Supabase SQL Editor

-- 1. Add the estado column with enum constraint
ALTER TABLE vehiculos
ADD COLUMN IF NOT EXISTS estado VARCHAR(20) DEFAULT 'publicado'
CHECK (estado IN ('publicado', 'pausado', 'vendido', 'preparación'));

-- 2. Update existing records to have 'publicado' status
UPDATE vehiculos
SET estado = 'publicado'
WHERE estado IS NULL;

-- 3. Make the column NOT NULL after setting default values
ALTER TABLE vehiculos
ALTER COLUMN estado SET NOT NULL;

-- 4. Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_vehiculos_estado ON vehiculos(estado);

-- 5. Update RLS policies for public access to only published vehicles
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Anyone can view vehiculos" ON vehiculos;

-- Create new policy that allows public access only to published vehicles
CREATE POLICY "Anyone can view published vehiculos" ON vehiculos
    FOR SELECT USING (estado = 'publicado');

-- 6. Verify the migration worked
SELECT
    'vehiculos' as table_name,
    COUNT(*) as total_count,
    COUNT(*) FILTER (WHERE estado = 'publicado') as publicado_count,
    COUNT(*) FILTER (WHERE estado = 'pausado') as pausado_count,
    COUNT(*) FILTER (WHERE estado = 'vendido') as vendido_count,
    COUNT(*) FILTER (WHERE estado = 'preparación') as preparacion_count
FROM vehiculos;

-- 7. Show table structure to confirm estado column exists
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'vehiculos'
ORDER BY ordinal_position;