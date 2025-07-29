import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export type Vehiculo = {
  id?: string
  marca: string
  modelo: string
  ano: number
  kilometraje?: number
  version?: string
  combustible?: string
  transmision?: string
  color?: string
  descripcion?: string
  precio: number
  moneda: 'ARS' | 'USD'
  created_at?: string
  updated_at?: string
  user_id?: string
}

export type VehiculoFoto = {
  id?: string
  vehiculo_id: string
  file_name: string
  file_path: string
  file_size: number
  mime_type: string
  storage_path: string
  is_primary?: boolean
  order_index?: number
  created_at?: string
}

// Input Types (from forms)
export type VehiculoInput = Omit<Vehiculo, 'id' | 'created_at' | 'updated_at' | 'user_id'>

export type PhotoUploadInput = {
  file: File
  is_primary?: boolean
  order_index?: number
}

// Response Types
export type VehiculoConFotos = Vehiculo & {
  fotos?: VehiculoFoto[]
}

// Storage Configuration
export const STORAGE_CONFIG = {
  BUCKET_NAME: 'venta-autos-images',
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  MAX_FILES_PER_VEHICULO: 15
} as const