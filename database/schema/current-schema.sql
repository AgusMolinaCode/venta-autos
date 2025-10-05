-- Schema SQL actualizado para tabla "vehiculos" existente
-- Este script crea las tablas y configuraciones necesarias usando el esquema actual

-- 1. Crear tabla de fotos de vehículos (nueva tabla para el esquema actual)
CREATE TABLE IF NOT EXISTS vehiculo_fotos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehiculo_id UUID REFERENCES vehiculos(id) ON DELETE CASCADE NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INTEGER NOT NULL CHECK (file_size > 0),
  mime_type VARCHAR(100) NOT NULL,
  storage_path VARCHAR(500) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0 CHECK (order_index >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_vehiculo_fotos_vehiculo_id ON vehiculo_fotos(vehiculo_id);
CREATE INDEX IF NOT EXISTS idx_vehiculo_fotos_order_index ON vehiculo_fotos(vehiculo_id, order_index);

-- 3. Constraint para una sola foto principal por vehículo
CREATE UNIQUE INDEX IF NOT EXISTS idx_vehiculo_primary_foto 
ON vehiculo_fotos(vehiculo_id) 
WHERE is_primary = true;

-- 4. Configurar Row Level Security (RLS) para la nueva tabla
ALTER TABLE vehiculo_fotos ENABLE ROW LEVEL SECURITY;

-- Políticas para la tabla vehiculo_fotos
-- Cualquiera puede ver las fotos (para el catálogo público)
CREATE POLICY "Anyone can view vehiculo fotos" ON vehiculo_fotos
    FOR SELECT USING (true);

-- Solo usuarios autenticados pueden insertar fotos
CREATE POLICY "Authenticated users can insert vehiculo fotos" ON vehiculo_fotos
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' 
        AND EXISTS (
            SELECT 1 FROM vehiculos 
            WHERE id = vehiculo_id 
            AND user_id = auth.uid()
        )
    );

-- Los usuarios pueden actualizar fotos de sus vehículos
CREATE POLICY "Users can update own vehiculo fotos" ON vehiculo_fotos
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM vehiculos 
            WHERE id = vehiculo_id 
            AND user_id = auth.uid()
        )
    );

-- Los usuarios pueden eliminar fotos de sus vehículos
CREATE POLICY "Users can delete own vehiculo fotos" ON vehiculo_fotos
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM vehiculos 
            WHERE id = vehiculo_id 
            AND user_id = auth.uid()
        )
    );

-- 5. Función para obtener vehículos con sus fotos (adaptada al esquema actual)
CREATE OR REPLACE FUNCTION get_vehiculos_con_fotos(
    p_limit INTEGER DEFAULT 20,
    p_offset INTEGER DEFAULT 0,
    p_marca VARCHAR DEFAULT NULL,
    p_modelo VARCHAR DEFAULT NULL,
    p_ano_min INTEGER DEFAULT NULL,
    p_ano_max INTEGER DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    marca VARCHAR,
    modelo VARCHAR,
    ano INTEGER,
    kilometraje INTEGER,
    version VARCHAR,
    combustible VARCHAR,
    transmision VARCHAR,
    color VARCHAR,
    descripcion TEXT,
    precio DECIMAL,
    moneda VARCHAR,
    created_at TIMESTAMPTZ,
    fotos JSON
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
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
        v.precio,
        v.moneda,
        v.created_at,
        COALESCE(
            json_agg(
                json_build_object(
                    'id', vf.id,
                    'file_name', vf.file_name,
                    'file_path', vf.file_path,
                    'storage_path', vf.storage_path,
                    'is_primary', vf.is_primary,
                    'order_index', vf.order_index
                ) ORDER BY vf.order_index
            ) FILTER (WHERE vf.id IS NOT NULL),
            '[]'::json
        ) as fotos
    FROM vehiculos v
    LEFT JOIN vehiculo_fotos vf ON v.id = vf.vehiculo_id
    WHERE 
        (p_marca IS NULL OR v.marca ILIKE '%' || p_marca || '%')
        AND (p_modelo IS NULL OR v.modelo ILIKE '%' || p_modelo || '%')
        AND (p_ano_min IS NULL OR v.ano >= p_ano_min)
        AND (p_ano_max IS NULL OR v.ano <= p_ano_max)
    GROUP BY v.id, v.marca, v.modelo, v.ano, v.kilometraje, v.version, v.combustible, v.transmision, v.color, v.descripcion, v.precio, v.moneda, v.created_at
    ORDER BY v.created_at DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$;

-- 6. Comentarios para documentación
COMMENT ON TABLE vehiculo_fotos IS 'Fotos asociadas a cada vehículo en tabla vehiculos existente';
COMMENT ON COLUMN vehiculo_fotos.vehiculo_id IS 'Referencia a la tabla vehiculos existente';
COMMENT ON COLUMN vehiculo_fotos.is_primary IS 'Indica si es la foto principal del vehículo';
COMMENT ON COLUMN vehiculo_fotos.order_index IS 'Orden de visualización de la foto';
COMMENT ON COLUMN vehiculo_fotos.storage_path IS 'Ruta completa en Supabase Storage bucket vehiculo-fotos';

-- 7. Crear bucket de storage para las fotos
-- IMPORTANTE: Ejecutar este código en JavaScript en el dashboard de Supabase:
/*
const { data, error } = await supabase.storage.createBucket('vehiculo-fotos', {
  public: true,
  allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  fileSizeLimit: 5242880 // 5MB
});

// Configurar políticas de bucket
CREATE POLICY "Anyone can view vehiculo fotos in storage" ON storage.objects FOR SELECT USING (bucket_id = 'vehiculo-fotos');
CREATE POLICY "Authenticated users can upload vehiculo fotos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'vehiculo-fotos' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own vehiculo fotos in storage" ON storage.objects FOR UPDATE USING (bucket_id = 'vehiculo-fotos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own vehiculo fotos in storage" ON storage.objects FOR DELETE USING (bucket_id = 'vehiculo-fotos' AND auth.uid()::text = (storage.foldername(name))[1]);
*/

-- Verificar que la tabla vehiculo_fotos se creó correctamente
SELECT 
    'vehiculo_fotos' as table_name,
    COUNT(*) as row_count  
FROM vehiculo_fotos;

-- Verificar que la tabla vehiculos existe
SELECT 
    'vehiculos' as table_name,
    COUNT(*) as row_count
FROM vehiculos;