import { supabase } from './supabase';

/**
 * Genera la URL pública para una imagen almacenada en Supabase Storage
 * @param storagePath - El path de la imagen en el storage
 * @returns La URL pública de la imagen
 */
export function getImageUrl(storagePath: string): string {
  const { data } = supabase.storage
    .from('venta-autos-images')
    .getPublicUrl(storagePath);
  
  return data.publicUrl;
}

/**
 * Genera la URL para el componente Image de Next.js
 * Usa el endpoint local que maneja la redirección
 * @param storagePath - El path de la imagen en el storage
 * @returns La URL para usar con Next.js Image
 */
export function getNextImageUrl(storagePath: string): string {
  return `/api/storage/image?path=${encodeURIComponent(storagePath)}`;
}