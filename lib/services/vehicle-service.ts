import { supabase, Vehiculo, VehiculoFoto, VehiculoInput, PhotoUploadInput, VehiculoConFotos, STORAGE_CONFIG } from '@/lib/supabase'
import { logger } from '@/lib/logger'

export interface VehiculoSubmissionData {
  vehiculoData: VehiculoInput
  fotos: File[]
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
      const { vehiculoData, fotos } = datosSubmision;
      
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
        console.error('❌ Validación fallida:', validationResult.errors);
        console.groupEnd();
        return {
          success: false,
          error: `Errores de validación: ${validationResult.errors.join(', ')}`
        };
      }

      console.log('✅ Validación exitosa');

      // 1. Crear registro del vehículo
      console.log('🔄 Insertando vehículo en base de datos...');
      const { data: vehiculo, error: vehiculoError } = await supabase
        .from('vehiculos')
        .insert([vehiculoData])
        .select()
        .single();

      if (vehiculoError) {
        console.error('❌ Error al insertar vehículo:', vehiculoError);
        console.groupEnd();
        return {
          success: false,
          error: `Error al crear vehículo: ${vehiculoError.message}`
        };
      }

      console.log('✅ Vehículo creado:', {
        id: vehiculo.id,
        marca: vehiculo.marca,
        modelo: vehiculo.modelo,
        ano: vehiculo.ano
      });

      // 2. Subir fotos si existen
      const fotosSubidas: VehiculoFoto[] = [];
      const fotosFallidas: string[] = [];

      if (fotos.length > 0) {
        console.log('🔄 Subiendo fotos a Storage...');
        
        for (let i = 0; i < fotos.length; i++) {
          const file = fotos[i];
          const fotoResult = await this.subirFoto(vehiculo.id, file, i === 0, i);
          
          if (fotoResult.success && fotoResult.data) {
            fotosSubidas.push(fotoResult.data);
            console.log(`✅ Foto ${i + 1}/${fotos.length} subida:`, fotoResult.data.file_name);
          } else {
            fotosFallidas.push(file.name);
            console.error(`❌ Error foto ${i + 1}:`, fotoResult.error);
          }
        }
      }

      // Resultado final
      const resultadoFinal: VehiculoConFotos = {
        ...vehiculo,
        fotos: fotosSubidas
      };

      // Log del resultado final estructurado para Supabase
      console.log('🗄️ ESTRUCTURA FINAL PARA SUPABASE:');
      console.log('📊 Tabla vehiculos:', {
        id: vehiculo.id,
        marca: vehiculo.marca,
        modelo: vehiculo.modelo,
        ano: vehiculo.ano,
        kilometraje: vehiculo.kilometraje,
        version: vehiculo.version,
        combustible: vehiculo.combustible,
        transmision: vehiculo.transmision,
        color: vehiculo.color,
        descripcion: vehiculo.descripcion,
        precio: vehiculo.precio,
        moneda: vehiculo.moneda,
        created_at: vehiculo.created_at
      });

      if (fotosSubidas.length > 0) {
        console.log('📊 Tabla vehiculo_fotos:');
        fotosSubidas.forEach((foto, index) => {
          console.log(`  Foto ${index + 1}:`, {
            id: foto.id,
            vehiculo_id: foto.vehiculo_id,
            file_name: foto.file_name,
            file_path: foto.file_path,
            file_size: foto.file_size,
            mime_type: foto.mime_type,
            storage_path: foto.storage_path,
            is_primary: foto.is_primary,
            order_index: foto.order_index
          });
        });
      }

      console.log('📁 Storage Bucket:', STORAGE_CONFIG.BUCKET_NAME);
      console.log('🔗 URLs públicas de fotos:', fotosSubidas.map(foto => {
        const { data } = supabase.storage
          .from(STORAGE_CONFIG.BUCKET_NAME)
          .getPublicUrl(foto.storage_path);
        return data.publicUrl;
      }));

      console.log('📈 Resumen de la operación:', {
        vehiculo_creado: true,
        fotos_subidas: fotosSubidas.length,
        fotos_fallidas: fotosFallidas.length,
        total_fotos_procesadas: fotos.length
      });

      console.groupEnd();

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
      console.error('❌ Error general en crearVehiculoConFotos:', error);
      console.groupEnd();
      
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
    console.group('🔄 ACTUALIZANDO VEHÍCULO EN SUPABASE');
    
    try {
      const { vehiculoData, fotos } = datosSubmision;
      
      // Log de datos de entrada
      console.log('📋 Datos del Vehículo a actualizar:', {
        id: vehiculoId,
        id_type: typeof vehiculoId,
        id_length: vehiculoId?.length,
        ...vehiculoData,
        precio_formateado: `${vehiculoData.moneda} ${vehiculoData.precio.toLocaleString()}`
      });
      
      console.log('📸 Nuevas Fotos:', {
        cantidad: fotos.length,
        archivos: fotos.map((file, index) => ({
          index,
          nombre: file.name,
          tamaño: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          tipo: file.type
        }))
      });

      // Validaciones
      const validationResult = this.validarSubmision(vehiculoData, fotos);
      if (!validationResult.isValid) {
        console.error('❌ Validación fallida:', validationResult.errors);
        console.groupEnd();
        return {
          success: false,
          error: `Errores de validación: ${validationResult.errors.join(', ')}`
        };
      }

      console.log('✅ Validación exitosa');

      // 1. Verificar que el vehículo existe
      console.log('🔍 Verificando que el vehículo existe...');
      const { data: existingVehicle, error: checkError } = await supabase
        .from('vehiculos')
        .select('id')
        .eq('id', vehiculoId)
        .single();

      if (checkError || !existingVehicle) {
        console.error('❌ Vehículo no encontrado:', checkError);
        console.groupEnd();
        return {
          success: false,
          error: `Vehículo no encontrado con ID: ${vehiculoId}`
        };
      }

      // 2. Actualizar registro del vehículo
      console.log('🔄 Actualizando vehículo en base de datos...');
      const { data: vehiculo, error: vehiculoError } = await supabase
        .from('vehiculos')
        .update(vehiculoData)
        .eq('id', vehiculoId)
        .select()
        .single();

      if (vehiculoError) {
        console.error('❌ Error al actualizar vehículo:', vehiculoError);
        console.groupEnd();
        return {
          success: false,
          error: `Error al actualizar vehículo: ${vehiculoError.message}`
        };
      }

      console.log('✅ Vehículo actualizado:', {
        id: vehiculo.id,
        marca: vehiculo.marca,
        modelo: vehiculo.modelo,
        ano: vehiculo.ano
      });

      // 2. Gestionar fotos si se proporcionaron nuevas
      let fotosActuales: VehiculoFoto[] = [];
      
      if (fotos.length > 0) {
        console.log('🔄 Gestionando fotos...');
        
        // Obtener fotos actuales
        const { data: fotosExistentes, error: fotosError } = await supabase
          .from('vehiculo_fotos')
          .select('*')
          .eq('vehiculo_id', vehiculoId);

        if (fotosError) {
          console.warn('⚠️ No se pudieron obtener fotos existentes:', fotosError);
        }

        // Eliminar fotos existentes del storage si hay nuevas fotos
        if (fotosExistentes && fotosExistentes.length > 0) {
          console.log('🗑️ Eliminando fotos existentes...');
          
          const storagePaths = fotosExistentes.map(foto => foto.storage_path);
          const { error: storageError } = await supabase.storage
            .from(STORAGE_CONFIG.BUCKET_NAME)
            .remove(storagePaths);

          if (storageError) {
            console.warn('⚠️ Error al eliminar fotos del storage:', storageError);
          }

          // Eliminar registros de fotos existentes
          const { error: deletePhotosError } = await supabase
            .from('vehiculo_fotos')
            .delete()
            .eq('vehiculo_id', vehiculoId);

          if (deletePhotosError) {
            console.warn('⚠️ Error al eliminar registros de fotos:', deletePhotosError);
          }
        }

        // Subir nuevas fotos
        const fotosSubidas: VehiculoFoto[] = [];
        const fotosFallidas: string[] = [];
        
        for (let i = 0; i < fotos.length; i++) {
          const file = fotos[i];
          const fotoResult = await this.subirFoto(vehiculo.id, file, i === 0, i);
          
          if (fotoResult.success && fotoResult.data) {
            fotosSubidas.push(fotoResult.data);
            console.log(`✅ Foto ${i + 1}/${fotos.length} subida:`, fotoResult.data.file_name);
          } else {
            fotosFallidas.push(file.name);
            console.error(`❌ Error foto ${i + 1}:`, fotoResult.error);
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

      console.log('📈 Resumen de la actualización:', {
        vehiculo_actualizado: true,
        fotos_actuales: fotosActuales.length,
        total_fotos_procesadas: fotos.length
      });

      console.groupEnd();

      return {
        success: true,
        data: resultadoFinal,
        details: {
          vehiculoId: vehiculo.id,
          fotosSubidas: fotos.length > 0 ? fotosActuales.length : undefined,
        }
      };

    } catch (error) {
      console.error('❌ Error general en actualizarVehiculoConFotos:', error);
      console.groupEnd();
      
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

  /**
   * DISABLED: Estado is managed via localStorage, not database
   * Actualiza solo el estado de un vehículo
   */
  /*
  static async actualizarEstadoVehiculo(
    vehiculoId: string,
    nuevoEstado: 'preparación' | 'publicado' | 'pausado' | 'vendido'
  ): Promise<VehiculoServiceResult> {
    try {
      console.log(`🔄 Actualizando estado del vehículo ${vehiculoId} a: ${nuevoEstado}`);

      // 1. Verificar que el vehículo existe
      const { data: existingVehicle, error: checkError } = await supabase
        .from('vehiculos')
        .select('id, marca, modelo, ano')
        .eq('id', vehiculoId)
        .single();

      if (checkError || !existingVehicle) {
        console.error('❌ Vehículo no encontrado:', checkError);
        return {
          success: false,
          error: `Vehículo no encontrado con ID: ${vehiculoId}`
        };
      }

      // 2. Actualizar solo el estado
      const { data: vehiculo, error: updateError } = await supabase
        .from('vehiculos')
        .update({ estado: nuevoEstado })
        .eq('id', vehiculoId)
        .select(`
          *,
          fotos:vehiculo_fotos(*)
        `)
        .single();

      if (updateError) {
        console.error('❌ Error al actualizar estado:', {
          error: updateError,
          message: updateError.message,
          details: updateError.details,
          hint: updateError.hint,
          code: updateError.code
        });
        return {
          success: false,
          error: `Error al actualizar estado: ${updateError.message || updateError.code || 'Error desconocido'}`
        };
      }

      console.log('✅ Estado actualizado exitosamente:', {
        id: vehiculo.id,
        vehiculo: `${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.ano}`,
        nuevoEstado: vehiculo.estado
      });

      return {
        success: true,
        data: vehiculo
      };

    } catch (error) {
      console.error('❌ Error inesperado al actualizar estado:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al actualizar estado'
      };
    }
  }
  */
}