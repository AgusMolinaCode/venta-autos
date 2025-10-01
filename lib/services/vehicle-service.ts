import { supabase, Vehiculo, VehiculoFoto, VehiculoInput, PhotoUploadInput, VehiculoConFotos, STORAGE_CONFIG } from '@/lib/supabase'
import { logger } from '@/lib/logger'

export interface VehiculoSubmissionData {
  vehiculoData: VehiculoInput
  fotos: File[]
  userId: string  // ID del usuario autenticado
}

export interface VehiculoServiceResult {
  success: boolean
  data?: VehiculoConFotos
  error?: string
  details?: {
    vehiculoId?: string
    fotosSubidas?: number
    fotosFallidas?: string[]
  }
}

export class VehiculoService {
  /**
   * Crea un nuevo vehículo con sus fotos en Supabase
   */
  static async crearVehiculoConFotos(
    datosSubmision: VehiculoSubmissionData
  ): Promise<VehiculoServiceResult> {
    logger.info('Processing vehicle data for Supabase', { vehicleCount: 1, photosCount: datosSubmision.fotos.length }, 'VEHICLE_SERVICE');
    
    try {
      const { vehiculoData, fotos, userId } = datosSubmision;
      
      // Log vehicle and photo data
      logger.debug('Vehicle data received', {
        ...vehiculoData,
        precio_formateado: `${vehiculoData.moneda} ${vehiculoData.precio.toLocaleString()}`
      }, 'VEHICLE_SERVICE');
      
      logger.debug('Photo files received', {
        cantidad: fotos.length,
        archivos: fotos.map((file, index) => ({
          index,
          nombre: file.name,
          tamaño: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          tipo: file.type
        }))
      }, 'VEHICLE_SERVICE');

      // Validaciones
      const validationResult = this.validarSubmision(vehiculoData, fotos);
      if (!validationResult.isValid) {
        return {
          success: false,
          error: `Errores de validación: ${validationResult.errors.join(', ')}`
        };
      }

      // Crear objeto con userId para insertar en Supabase
      const vehiculoConUserId = {
        ...vehiculoData,
        user_id: userId
      };

      const { data: vehiculo, error: vehiculoError } = await supabase
        .from('vehiculos')
        .insert([vehiculoConUserId])
        .select()
        .single();

      if (vehiculoError) {
        return {
          success: false,
          error: `Error al crear vehículo: ${vehiculoError.message}`
        };
      }

      // 2. Subir fotos si existen
      const fotosSubidas: VehiculoFoto[] = [];
      const fotosFallidas: string[] = [];

      if (fotos.length > 0) {
        for (let i = 0; i < fotos.length; i++) {
          const file = fotos[i];
          const fotoResult = await this.subirFoto(vehiculo.id, file, i === 0, i);

          if (fotoResult.success && fotoResult.data) {
            fotosSubidas.push(fotoResult.data);
          } else {
            fotosFallidas.push(file.name);
          }
        }
      }

      // Resultado final
      const resultadoFinal: VehiculoConFotos = {
        ...vehiculo,
        fotos: fotosSubidas
      };

      return {
        success: true,
        data: resultadoFinal,
        details: {
          vehiculoId: vehiculo.id,
          fotosSubidas: fotosSubidas.length,
          fotosFallidas: fotosFallidas.length > 0 ? fotosFallidas : undefined
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Sube una foto individual al storage y crea el registro en la base de datos
   */
  private static async subirFoto(
    vehiculoId: string,
    file: File,
    isPrimary: boolean = false,
    orderIndex: number = 0
  ): Promise<{ success: boolean; data?: VehiculoFoto; error?: string }> {
    try {
      // Generar nombre único para el archivo
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${vehiculoId}_${orderIndex}_${Date.now()}.${fileExtension}`;
      const storagePath = `vehiculos/${vehiculoId}/${fileName}`;

      // Subir archivo a Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(STORAGE_CONFIG.BUCKET_NAME)
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        return {
          success: false,
          error: `Error al subir archivo: ${uploadError.message}`
        };
      }

      // Crear registro en la base de datos
      const fotoData: Omit<VehiculoFoto, 'id' | 'created_at'> = {
        vehiculo_id: vehiculoId,
        file_name: file.name,
        file_path: uploadData.path,
        file_size: file.size,
        mime_type: file.type,
        storage_path: storagePath,
        is_primary: isPrimary,
        order_index: orderIndex
      };

      const { data: foto, error: fotoError } = await supabase
        .from('vehiculo_fotos')
        .insert([fotoData])
        .select()
        .single();

      if (fotoError) {
        // Si falla la base de datos, intentar limpiar el archivo subido
        await supabase.storage
          .from(STORAGE_CONFIG.BUCKET_NAME)
          .remove([storagePath]);
        
        return {
          success: false,
          error: `Error al guardar registro de foto: ${fotoError.message}`
        };
      }

      return {
        success: true,
        data: foto
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al subir foto'
      };
    }
  }

  /**
   * Valida los datos antes de la creación
   */
  private static validarSubmision(
    vehiculoData: VehiculoInput,
    fotos: File[]
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validar datos del vehículo
    if (!vehiculoData.marca?.trim()) errors.push('Marca es requerida');
    if (!vehiculoData.modelo?.trim()) errors.push('Modelo es requerido');
    if (!vehiculoData.ano || vehiculoData.ano < 1970 || vehiculoData.ano > 2025) {
      errors.push('Año debe estar entre 1970 y 2025');
    }
    if (!vehiculoData.precio || vehiculoData.precio <= 0) {
      errors.push('Precio debe ser mayor a 0');
    }
    if (!['ARS', 'USD'].includes(vehiculoData.moneda)) {
      errors.push('Moneda debe ser ARS o USD');
    }

    // Validar fotos
    if (fotos.length > STORAGE_CONFIG.MAX_FILES_PER_VEHICULO) {
      errors.push(`Máximo ${STORAGE_CONFIG.MAX_FILES_PER_VEHICULO} fotos permitidas`);
    }

    for (let i = 0; i < fotos.length; i++) {
      const file = fotos[i];
      
      if (file.size > STORAGE_CONFIG.MAX_FILE_SIZE) {
        errors.push(`Foto "${file.name}" excede el tamaño máximo de 5MB`);
      }
      
      if (!STORAGE_CONFIG.ALLOWED_TYPES.includes(file.type as typeof STORAGE_CONFIG.ALLOWED_TYPES[number])) {
        errors.push(`Tipo de archivo "${file.type}" no permitido para "${file.name}"`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Actualiza un vehículo existente con sus fotos en Supabase
   */
  static async actualizarVehiculoConFotos(
    vehiculoId: string,
    datosSubmision: VehiculoSubmissionData
  ): Promise<VehiculoServiceResult> {
    try {
      const { vehiculoData, fotos } = datosSubmision;

      // Validaciones
      const validationResult = this.validarSubmision(vehiculoData, fotos);
      if (!validationResult.isValid) {
        return {
          success: false,
          error: `Errores de validación: ${validationResult.errors.join(', ')}`
        };
      }

      // 1. Verificar que el vehículo existe
      const { data: existingVehicle, error: checkError } = await supabase
        .from('vehiculos')
        .select('id')
        .eq('id', vehiculoId)
        .single();

      if (checkError || !existingVehicle) {
        return {
          success: false,
          error: `Vehículo no encontrado con ID: ${vehiculoId}`
        };
      }

      // 2. Actualizar registro del vehículo
      const { data: vehiculo, error: vehiculoError } = await supabase
        .from('vehiculos')
        .update(vehiculoData)
        .eq('id', vehiculoId)
        .select()
        .single();

      if (vehiculoError) {
        return {
          success: false,
          error: `Error al actualizar vehículo: ${vehiculoError.message}`
        };
      }

      // 2. Gestionar fotos si se proporcionaron nuevas
      let fotosActuales: VehiculoFoto[] = [];

      if (fotos.length > 0) {
        // Obtener fotos actuales
        const { data: fotosExistentes } = await supabase
          .from('vehiculo_fotos')
          .select('*')
          .eq('vehiculo_id', vehiculoId);

        // Eliminar fotos existentes del storage si hay nuevas fotos
        if (fotosExistentes && fotosExistentes.length > 0) {
          const storagePaths = fotosExistentes.map(foto => foto.storage_path);
          await supabase.storage
            .from(STORAGE_CONFIG.BUCKET_NAME)
            .remove(storagePaths);

          // Eliminar registros de fotos existentes
          await supabase
            .from('vehiculo_fotos')
            .delete()
            .eq('vehiculo_id', vehiculoId);
        }

        // Subir nuevas fotos
        const fotosSubidas: VehiculoFoto[] = [];

        for (let i = 0; i < fotos.length; i++) {
          const file = fotos[i];
          const fotoResult = await this.subirFoto(vehiculo.id, file, i === 0, i);

          if (fotoResult.success && fotoResult.data) {
            fotosSubidas.push(fotoResult.data);
          }
        }

        fotosActuales = fotosSubidas;
      } else {
        // Si no se proporcionaron nuevas fotos, obtener las existentes
        const { data: fotosExistentes } = await supabase
          .from('vehiculo_fotos')
          .select('*')
          .eq('vehiculo_id', vehiculoId);
        
        fotosActuales = fotosExistentes || [];
      }

      // Resultado final
      const resultadoFinal: VehiculoConFotos = {
        ...vehiculo,
        fotos: fotosActuales
      };

      return {
        success: true,
        data: resultadoFinal,
        details: {
          vehiculoId: vehiculo.id,
          fotosSubidas: fotos.length > 0 ? fotosActuales.length : undefined,
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Obtiene un vehículo con sus fotos
   */
  static async obtenerVehiculoConFotos(vehiculoId: string): Promise<VehiculoServiceResult> {
    try {
      const { data: vehiculo, error: vehiculoError } = await supabase
        .from('vehiculos')
        .select(`
          *,
          fotos:vehiculo_fotos(*)
        `)
        .eq('id', vehiculoId)
        .single();

      if (vehiculoError) {
        return {
          success: false,
          error: `Error al obtener vehículo: ${vehiculoError.message}`
        };
      }

      return {
        success: true,
        data: vehiculo
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  
}