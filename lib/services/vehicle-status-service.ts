import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'
import { EstadoType } from '@/constants'

export interface VehicleStatusResult {
  success: boolean
  data?: EstadoType | EstadoType[]
  error?: string
}

export interface VehicleStatusStats {
  total: number
  byStatus: Record<EstadoType, number>
}

/**
 * Service for managing vehicle status in database instead of localStorage
 * Replaces the localStorage-based vehicle status cache system
 */
export class VehicleStatusService {

  /**
   * Get status of a specific vehicle from database
   */
  static async getVehicleStatus(vehicleId: string): Promise<VehicleStatusResult> {
    try {
      logger.info('Getting vehicle status from database', { vehicleId }, 'VEHICLE_STATUS_SERVICE')

      const { data, error } = await supabase
        .from('vehiculos')
        .select('estado')
        .eq('id', vehicleId)
        .single()

      if (error) {
        logger.error('Failed to get vehicle status', { vehicleId, error: error.message }, 'VEHICLE_STATUS_SERVICE')
        return {
          success: false,
          error: `Error al obtener estado del vehículo: ${error.message}`
        }
      }

      if (!data) {
        logger.warn('Vehicle not found', { vehicleId }, 'VEHICLE_STATUS_SERVICE')
        return {
          success: false,
          error: 'Vehículo no encontrado'
        }
      }

      const estado = data.estado as EstadoType || 'preparación'
      logger.info('Vehicle status retrieved successfully', { vehicleId, estado }, 'VEHICLE_STATUS_SERVICE')

      return {
        success: true,
        data: estado
      }
    } catch (error) {
      logger.error('Unexpected error getting vehicle status', {
        vehicleId,
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 'VEHICLE_STATUS_SERVICE')

      return {
        success: false,
        error: 'Error interno del servidor'
      }
    }
  }

  /**
   * Update status of a specific vehicle in database
   */
  static async updateVehicleStatus(vehicleId: string, newStatus: EstadoType): Promise<VehicleStatusResult> {
    try {
      logger.info('Updating vehicle status in database', { vehicleId, newStatus }, 'VEHICLE_STATUS_SERVICE')

      // Validate status value
      const validStatuses: EstadoType[] = ['preparación', 'publicado', 'pausado', 'vendido']
      if (!validStatuses.includes(newStatus)) {
        logger.warn('Invalid status value', { vehicleId, newStatus }, 'VEHICLE_STATUS_SERVICE')
        return {
          success: false,
          error: `Estado inválido: ${newStatus}. Valores válidos: ${validStatuses.join(', ')}`
        }
      }

      const { data, error } = await supabase
        .from('vehiculos')
        .update({ estado: newStatus })
        .eq('id', vehicleId)
        .select('estado')
        .single()

      if (error) {
        logger.error('Failed to update vehicle status', {
          vehicleId,
          newStatus,
          error: error.message
        }, 'VEHICLE_STATUS_SERVICE')

        return {
          success: false,
          error: `Error al actualizar estado del vehículo: ${error.message}`
        }
      }

      if (!data) {
        logger.warn('Vehicle not found for update', { vehicleId, newStatus }, 'VEHICLE_STATUS_SERVICE')
        return {
          success: false,
          error: 'Vehículo no encontrado'
        }
      }

      logger.info('Vehicle status updated successfully', {
        vehicleId,
        oldStatus: 'unknown',
        newStatus: data.estado
      }, 'VEHICLE_STATUS_SERVICE')

      return {
        success: true,
        data: data.estado as EstadoType
      }
    } catch (error) {
      logger.error('Unexpected error updating vehicle status', {
        vehicleId,
        newStatus,
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 'VEHICLE_STATUS_SERVICE')

      return {
        success: false,
        error: 'Error interno del servidor'
      }
    }
  }

  /**
   * Get status statistics from database
   */
  static async getStatusStats(userId?: string): Promise<VehicleStatusResult & { data?: VehicleStatusStats }> {
    try {
      logger.info('Getting vehicle status statistics', { userId }, 'VEHICLE_STATUS_SERVICE')

      let query = supabase
        .from('vehiculos')
        .select('estado')

      // Filter by user if specified
      if (userId) {
        query = query.eq('user_id', userId)
      }

      const { data, error } = await query

      if (error) {
        logger.error('Failed to get status statistics', {
          userId,
          error: error.message
        }, 'VEHICLE_STATUS_SERVICE')

        return {
          success: false,
          error: `Error al obtener estadísticas: ${error.message}`
        }
      }

      // Calculate statistics
      const stats = data.reduce(
        (acc, vehicle) => {
          const estado = (vehicle.estado as EstadoType) || 'preparación'
          acc.byStatus[estado] = (acc.byStatus[estado] || 0) + 1
          acc.total++
          return acc
        },
        {
          total: 0,
          byStatus: {} as Record<EstadoType, number>
        } as VehicleStatusStats
      )

      logger.info('Status statistics calculated', {
        userId,
        total: stats.total,
        breakdown: stats.byStatus
      }, 'VEHICLE_STATUS_SERVICE')

      return {
        success: true,
        data: stats
      }
    } catch (error) {
      logger.error('Unexpected error getting status statistics', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 'VEHICLE_STATUS_SERVICE')

      return {
        success: false,
        error: 'Error interno del servidor'
      }
    }
  }

  /**
   * Get vehicles by status from database
   */
  static async getVehiclesByStatus(status: EstadoType, userId?: string): Promise<VehicleStatusResult> {
    try {
      logger.info('Getting vehicles by status', { status, userId }, 'VEHICLE_STATUS_SERVICE')

      let query = supabase
        .from('vehiculos')
        .select('id, marca, modelo, ano, estado, created_at')
        .eq('estado', status)
        .order('created_at', { ascending: false })

      // Filter by user if specified
      if (userId) {
        query = query.eq('user_id', userId)
      }

      const { data, error } = await query

      if (error) {
        logger.error('Failed to get vehicles by status', {
          status,
          userId,
          error: error.message
        }, 'VEHICLE_STATUS_SERVICE')

        return {
          success: false,
          error: `Error al obtener vehículos: ${error.message}`
        }
      }

      logger.info('Vehicles retrieved by status', {
        status,
        userId,
        count: data.length
      }, 'VEHICLE_STATUS_SERVICE')

      return {
        success: true,
        data: data
      }
    } catch (error) {
      logger.error('Unexpected error getting vehicles by status', {
        status,
        userId,
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 'VEHICLE_STATUS_SERVICE')

      return {
        success: false,
        error: 'Error interno del servidor'
      }
    }
  }

  /**
   * Bulk update vehicle statuses
   */
  static async bulkUpdateStatus(vehicleIds: string[], newStatus: EstadoType): Promise<VehicleStatusResult> {
    try {
      logger.info('Bulk updating vehicle statuses', {
        vehicleCount: vehicleIds.length,
        newStatus
      }, 'VEHICLE_STATUS_SERVICE')

      // Validate status value
      const validStatuses: EstadoType[] = ['preparación', 'publicado', 'pausado', 'vendido']
      if (!validStatuses.includes(newStatus)) {
        return {
          success: false,
          error: `Estado inválido: ${newStatus}. Valores válidos: ${validStatuses.join(', ')}`
        }
      }

      const { data, error } = await supabase
        .from('vehiculos')
        .update({ estado: newStatus })
        .in('id', vehicleIds)
        .select('id, estado')

      if (error) {
        logger.error('Failed to bulk update vehicle statuses', {
          vehicleIds,
          newStatus,
          error: error.message
        }, 'VEHICLE_STATUS_SERVICE')

        return {
          success: false,
          error: `Error al actualizar estados: ${error.message}`
        }
      }

      logger.info('Bulk status update completed', {
        requested: vehicleIds.length,
        updated: data.length,
        newStatus
      }, 'VEHICLE_STATUS_SERVICE')

      return {
        success: true,
        data: data
      }
    } catch (error) {
      logger.error('Unexpected error in bulk status update', {
        vehicleIds,
        newStatus,
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 'VEHICLE_STATUS_SERVICE')

      return {
        success: false,
        error: 'Error interno del servidor'
      }
    }
  }
}