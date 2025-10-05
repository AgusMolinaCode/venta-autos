-- Scripts SQL para configurar la base de datos en Supabase
-- Ejecutar estos comandos en el SQL Editor de Supabase

-- 1. Crear tabla de vehículos
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  marca VARCHAR(100) NOT NULL,
  modelo VARCHAR(100) NOT NULL,
  ano INTEGER NOT NULL CHECK (ano >= 1970 AND ano <= 2025),
  kilometraje INTEGER CHECK (kilometraje >= 0),
  version VARCHAR(100),
  combustible VARCHAR(50),
  transmision VARCHAR(50),
  color VARCHAR(50),
  descripcion TEXT,
  precio DECIMAL(15,2) NOT NULL CHECK (precio > 0),
  moneda VARCHAR(3) NOT NULL DEFAULT 'ARS' CHECK (moneda IN ('ARS', 'USD')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 2. Crear tabla de fotos de vehículos
CREATE TABLE IF NOT EXISTS vehicle_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INTEGER NOT NULL CHECK (file_size > 0),
  mime_type VARCHAR(100) NOT NULL,
  storage_path VARCHAR(500) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0 CHECK (order_index >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_vehicles_marca_modelo ON vehicles(marca, modelo);
CREATE INDEX IF NOT EXISTS idx_vehicles_ano ON vehicles(ano);
CREATE INDEX IF NOT EXISTS idx_vehicles_created_at ON vehicles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vehicles_user_id ON vehicles(user_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_photos_vehicle_id ON vehicle_photos(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_photos_order_index ON vehicle_photos(vehicle_id, order_index);

-- 4. Constraint para una sola foto principal por vehículo
CREATE UNIQUE INDEX IF NOT EXISTS idx_vehicle_primary_photo 
ON vehicle_photos(vehicle_id) 
WHERE is_primary = true;

-- 5. Trigger para actualizar updated_at en vehicles
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER IF NOT EXISTS update_vehicles_updated_at 
    BEFORE UPDATE ON vehicles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 6. Configurar Row Level Security (RLS)
-- Habilitar RLS en ambas tablas
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_photos ENABLE ROW LEVEL SECURITY;

-- Políticas para la tabla vehicles
-- Los usuarios pueden ver todos los vehículos (para el catálogo público)
CREATE POLICY "Anyone can view vehicles" ON vehicles
    FOR SELECT USING (true);

-- Solo usuarios autenticados pueden insertar vehículos
CREATE POLICY "Authenticated users can insert vehicles" ON vehicles
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Los usuarios solo pueden actualizar sus propios vehículos
CREATE POLICY "Users can update own vehicles" ON vehicles
    FOR UPDATE USING (auth.uid() = user_id);

-- Los usuarios solo pueden eliminar sus propios vehículos
CREATE POLICY "Users can delete own vehicles" ON vehicles
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para la tabla vehicle_photos
-- Cualquiera puede ver las fotos (para el catálogo público)
CREATE POLICY "Anyone can view vehicle photos" ON vehicle_photos
    FOR SELECT USING (true);

-- Solo usuarios autenticados pueden insertar fotos
CREATE POLICY "Authenticated users can insert photos" ON vehicle_photos
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' 
        AND EXISTS (
            SELECT 1 FROM vehicles 
            WHERE id = vehicle_id 
            AND user_id = auth.uid()
        )
    );

-- Los usuarios pueden actualizar fotos de sus vehículos
CREATE POLICY "Users can update own vehicle photos" ON vehicle_photos
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM vehicles 
            WHERE id = vehicle_id 
            AND user_id = auth.uid()
        )
    );

-- Los usuarios pueden eliminar fotos de sus vehículos
CREATE POLICY "Users can delete own vehicle photos" ON vehicle_photos
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM vehicles 
            WHERE id = vehicle_id 
            AND user_id = auth.uid()
        )
    );

-- 7. Crear bucket de storage para las fotos (ejecutar en JavaScript)
/*
-- Ejecutar este código en el dashboard de Supabase o mediante JavaScript:

// Crear bucket
const { data, error } = await supabase.storage.createBucket('vehicle-photos', {
  public: true,
  allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  fileSizeLimit: 5242880 // 5MB
});

// Configurar política de bucket
CREATE POLICY "Anyone can view vehicle photos" ON storage.objects FOR SELECT USING (bucket_id = 'vehicle-photos');
CREATE POLICY "Authenticated users can upload vehicle photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'vehicle-photos' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own vehicle photos" ON storage.objects FOR UPDATE USING (bucket_id = 'vehicle-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own vehicle photos" ON storage.objects FOR DELETE USING (bucket_id = 'vehicle-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
*/

-- 8. Función para obtener vehículos con sus fotos
CREATE OR REPLACE FUNCTION get_vehicles_with_photos(
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
    photos JSON
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
                    'id', vp.id,
                    'file_name', vp.file_name,
                    'file_path', vp.file_path,
                    'storage_path', vp.storage_path,
                    'is_primary', vp.is_primary,
                    'order_index', vp.order_index
                ) ORDER BY vp.order_index
            ) FILTER (WHERE vp.id IS NOT NULL),
            '[]'::json
        ) as photos
    FROM vehicles v
    LEFT JOIN vehicle_photos vp ON v.id = vp.vehicle_id
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

-- 9. Vista para estadísticas del dashboard
CREATE OR REPLACE VIEW vehicle_stats AS
SELECT 
    COUNT(*) as total_vehicles,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as vehicles_this_month,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as vehicles_this_week,
    AVG(precio) as average_price,
    COUNT(DISTINCT marca) as unique_brands,
    COUNT(DISTINCT modelo) as unique_models
FROM vehicles;

-- 10. Comentarios para documentación
COMMENT ON TABLE vehicles IS 'Tabla principal de vehículos en venta';
COMMENT ON TABLE vehicle_photos IS 'Fotos asociadas a cada vehículo';
COMMENT ON COLUMN vehicles.precio IS 'Precio en la moneda especificada';
COMMENT ON COLUMN vehicles.moneda IS 'Moneda del precio: ARS (Pesos Argentinos) o USD (Dólares)';
COMMENT ON COLUMN vehicle_photos.is_primary IS 'Indica si es la foto principal del vehículo';
COMMENT ON COLUMN vehicle_photos.order_index IS 'Orden de visualización de la foto';
COMMENT ON COLUMN vehicle_photos.storage_path IS 'Ruta completa en Supabase Storage';

-- Verificar que todo se creó correctamente
SELECT 
    'vehicles' as table_name,
    COUNT(*) as row_count
FROM vehicles
UNION ALL
SELECT 
    'vehicle_photos' as table_name,
    COUNT(*) as row_count  
FROM vehicle_photos;