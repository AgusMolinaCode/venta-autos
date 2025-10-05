-- Crear tabla vehiculo_fotos para almacenar referencias de imágenes
-- Ejecutar en Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.vehiculo_fotos (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    vehiculo_id uuid NOT NULL,
    file_name text NOT NULL,
    file_path text NOT NULL,
    file_size integer NOT NULL CHECK (file_size > 0),
    mime_type text NOT NULL,
    storage_path text NOT NULL,
    is_primary boolean DEFAULT false,
    order_index integer DEFAULT 0 CHECK (order_index >= 0),
    created_at timestamp with time zone DEFAULT now(),
    
    CONSTRAINT vehiculo_fotos_pkey PRIMARY KEY (id),
    CONSTRAINT vehiculo_fotos_vehiculo_id_fkey FOREIGN KEY (vehiculo_id) 
        REFERENCES public.vehiculos(id) ON DELETE CASCADE
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_vehiculo_fotos_vehiculo_id ON public.vehiculo_fotos(vehiculo_id);
CREATE INDEX IF NOT EXISTS idx_vehiculo_fotos_order_index ON public.vehiculo_fotos(vehiculo_id, order_index);

-- Constraint para una sola foto principal por vehículo
CREATE UNIQUE INDEX IF NOT EXISTS idx_vehiculo_primary_foto 
ON public.vehiculo_fotos(vehiculo_id) 
WHERE is_primary = true;

-- Habilitar Row Level Security
ALTER TABLE public.vehiculo_fotos ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso
CREATE POLICY "Anyone can view vehiculo fotos" ON public.vehiculo_fotos
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert vehiculo fotos" ON public.vehiculo_fotos
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update vehiculo fotos" ON public.vehiculo_fotos
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete vehiculo fotos" ON public.vehiculo_fotos
    FOR DELETE USING (auth.role() = 'authenticated');

-- Verificar que se creó correctamente
SELECT 
    'vehiculo_fotos' as tabla_creada,
    COUNT(*) as registros_iniciales
FROM public.vehiculo_fotos;