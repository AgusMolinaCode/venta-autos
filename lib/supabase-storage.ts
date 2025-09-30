/**
 * Configuración y utilidades para Supabase Storage
 * Maneja la subida, eliminación y gestión de archivos
 */

import { supabase, STORAGE_CONFIG } from './supabase'

export interface StorageUploadResult {
  success: boolean
  data?: {
    path: string
    publicUrl: string
    fullPath: string
  }
  error?: string
}

export interface StorageDeleteResult {
  success: boolean
  error?: string
}

export class SupabaseStorageService {
  /**
   * Inicializa el bucket de fotos si no existe
   */
  static async initializeBucket(): Promise<{ success: boolean; error?: string }> {
    try {
      // Verificar si el bucket existe
      const { data: buckets, error: listError } = await supabase.storage.listBuckets()
      
      if (listError) {
        return { success: false, error: `Error al listar buckets: ${listError.message}` }
      }

      const bucketExists = buckets?.some(bucket => bucket.name === STORAGE_CONFIG.BUCKET_NAME)
      
      if (!bucketExists) {
        // Crear el bucket
        const { data, error: createError } = await supabase.storage.createBucket(
          STORAGE_CONFIG.BUCKET_NAME,
          {
            public: true,
            allowedMimeTypes: [...STORAGE_CONFIG.ALLOWED_TYPES],
            fileSizeLimit: STORAGE_CONFIG.MAX_FILE_SIZE
          }
        )

        if (createError) {
          return { success: false, error: `Error al crear bucket: ${createError.message}` }
        }

      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al inicializar bucket'
      }
    }
  }

  /**
   * Sube un archivo al storage
   */
  static async uploadFile(
    file: File,
    path: string,
    options?: {
      cacheControl?: string
      upsert?: boolean
    }
  ): Promise<StorageUploadResult> {
    try {
      // Validar archivo
      const validation = this.validateFile(file)
      if (!validation.isValid) {
        return { success: false, error: validation.error }
      }

      // Subir archivo
      const { data, error } = await supabase.storage
        .from(STORAGE_CONFIG.BUCKET_NAME)
        .upload(path, file, {
          cacheControl: options?.cacheControl || '3600',
          upsert: options?.upsert || false
        })

      if (error) {
        return { success: false, error: `Error al subir archivo: ${error.message}` }
      }

      // Obtener URL pública
      const { data: publicUrlData } = supabase.storage
        .from(STORAGE_CONFIG.BUCKET_NAME)
        .getPublicUrl(path)

      return {
        success: true,
        data: {
          path: data.path,
          publicUrl: publicUrlData.publicUrl,
          fullPath: data.fullPath
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al subir archivo'
      }
    }
  }

  /**
   * Elimina un archivo del storage
   */
  static async deleteFile(path: string): Promise<StorageDeleteResult> {
    try {
      const { error } = await supabase.storage
        .from(STORAGE_CONFIG.BUCKET_NAME)
        .remove([path])

      if (error) {
        return { success: false, error: `Error al eliminar archivo: ${error.message}` }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al eliminar archivo'
      }
    }
  }

  /**
   * Elimina múltiples archivos del storage
   */
  static async deleteFiles(paths: string[]): Promise<StorageDeleteResult> {
    try {
      const { error } = await supabase.storage
        .from(STORAGE_CONFIG.BUCKET_NAME)
        .remove(paths)

      if (error) {
        return { success: false, error: `Error al eliminar archivos: ${error.message}` }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al eliminar archivos'
      }
    }
  }

  /**
   * Obtiene la URL pública de un archivo
   */
  static getPublicUrl(path: string): string {
    const { data } = supabase.storage
      .from(STORAGE_CONFIG.BUCKET_NAME)
      .getPublicUrl(path)
    
    return data.publicUrl
  }

  /**
   * Lista archivos en una carpeta
   */
  static async listFiles(folder: string = '') {
    try {
      const { data, error } = await supabase.storage
        .from(STORAGE_CONFIG.BUCKET_NAME)
        .list(folder)

      if (error) {
        return { success: false, error: `Error al listar archivos: ${error.message}` }
      }

      return { success: true, data }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al listar archivos'
      }
    }
  }

  /**
   * Valida un archivo antes de la subida
   */
  private static validateFile(file: File): { isValid: boolean; error?: string } {
    // Validar tamaño
    if (file.size > STORAGE_CONFIG.MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `Archivo demasiado grande. Máximo ${STORAGE_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB`
      }
    }

    // Validar tipo MIME
    if (!STORAGE_CONFIG.ALLOWED_TYPES.includes(file.type as typeof STORAGE_CONFIG.ALLOWED_TYPES[number])) {
      return {
        isValid: false,
        error: `Tipo de archivo no permitido. Tipos permitidos: ${STORAGE_CONFIG.ALLOWED_TYPES.join(', ')}`
      }
    }

    return { isValid: true }
  }

  /**
   * Genera un nombre de archivo único
   */
  static generateUniqueFileName(originalName: string, prefix?: string): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg'
    
    const baseName = prefix ? `${prefix}_${timestamp}_${random}` : `${timestamp}_${random}`
    return `${baseName}.${extension}`
  }

  /**
   * Genera la ruta para un archivo de vehículo
   */
  static generarRutaVehiculo(vehiculoId: string, fileName: string): string {
    return `vehiculos/${vehiculoId}/${fileName}`
  }

  /**
   * Obtiene información del bucket
   */
  static async getBucketInfo() {
    try {
      const { data, error } = await supabase.storage.getBucket(STORAGE_CONFIG.BUCKET_NAME)
      
      if (error) {
        return { success: false, error: `Error al obtener info del bucket: ${error.message}` }
      }

      return { success: true, data }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al obtener info del bucket'
      }
    }
  }
}