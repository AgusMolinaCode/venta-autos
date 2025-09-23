import { NextRequest, NextResponse } from 'next/server'
import { VehicleStatusService } from '@/lib/services/vehicle-status-service'
import { logger } from '@/lib/logger'
import { EstadoType } from '@/constants'

// GET /api/vehiculos/status?vehicleId=xxx - Get vehicle status
// GET /api/vehiculos/status?stats=true&userId=xxx - Get status statistics
// GET /api/vehiculos/status?status=xxx&userId=xxx - Get vehicles by status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vehicleId = searchParams.get('vehicleId')
    const statsParam = searchParams.get('stats')
    const statusParam = searchParams.get('status')
    const userId = searchParams.get('userId')

    logger.info('API: GET /vehiculos/status - Request received', {
      vehicleId,
      stats: statsParam,
      status: statusParam,
      userId
    })

    // Get specific vehicle status
    if (vehicleId) {
      const result = await VehicleStatusService.getVehicleStatus(vehicleId)

      if (result.success) {
        return NextResponse.json({
          success: true,
          data: { vehicleId, status: result.data }
        })
      } else {
        return NextResponse.json({
          success: false,
          error: result.error
        }, { status: 404 })
      }
    }

    // Get status statistics
    if (statsParam === 'true') {
      const result = await VehicleStatusService.getStatusStats(userId || undefined)

      if (result.success) {
        return NextResponse.json({
          success: true,
          data: result.data
        })
      } else {
        return NextResponse.json({
          success: false,
          error: result.error
        }, { status: 400 })
      }
    }

    // Get vehicles by status
    if (statusParam) {
      const validStatuses: EstadoType[] = ['preparación', 'publicado', 'pausado', 'vendido']

      if (!validStatuses.includes(statusParam as EstadoType)) {
        return NextResponse.json({
          success: false,
          error: `Estado inválido: ${statusParam}. Valores válidos: ${validStatuses.join(', ')}`
        }, { status: 400 })
      }

      const result = await VehicleStatusService.getVehiclesByStatus(
        statusParam as EstadoType,
        userId || undefined
      )

      if (result.success) {
        return NextResponse.json({
          success: true,
          data: result.data
        })
      } else {
        return NextResponse.json({
          success: false,
          error: result.error
        }, { status: 400 })
      }
    }

    // No valid parameters provided
    return NextResponse.json({
      success: false,
      error: 'Parámetros requeridos: vehicleId, stats=true, o status=xxx'
    }, { status: 400 })

  } catch (error) {
    logger.error('API: GET /vehiculos/status - Unexpected error', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 })
  }
}

// PUT /api/vehiculos/status - Update vehicle status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { vehicleId, status, vehicleIds } = body

    logger.info('API: PUT /vehiculos/status - Request received', {
      vehicleId,
      status,
      vehicleIds: vehicleIds?.length
    })

    // Validate status
    const validStatuses: EstadoType[] = ['preparación', 'publicado', 'pausado', 'vendido']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({
        success: false,
        error: `Estado inválido: ${status}. Valores válidos: ${validStatuses.join(', ')}`
      }, { status: 400 })
    }

    // Bulk update
    if (vehicleIds && Array.isArray(vehicleIds)) {
      if (vehicleIds.length === 0) {
        return NextResponse.json({
          success: false,
          error: 'Lista de IDs de vehículos vacía'
        }, { status: 400 })
      }

      const result = await VehicleStatusService.bulkUpdateStatus(vehicleIds, status)

      if (result.success) {
        return NextResponse.json({
          success: true,
          data: result.data,
          message: `${vehicleIds.length} vehículos actualizados a estado: ${status}`
        })
      } else {
        return NextResponse.json({
          success: false,
          error: result.error
        }, { status: 400 })
      }
    }

    // Single vehicle update
    if (vehicleId) {
      const result = await VehicleStatusService.updateVehicleStatus(vehicleId, status)

      if (result.success) {
        return NextResponse.json({
          success: true,
          data: { vehicleId, status: result.data },
          message: `Vehículo actualizado a estado: ${status}`
        })
      } else {
        return NextResponse.json({
          success: false,
          error: result.error
        }, { status: 400 })
      }
    }

    // No valid parameters provided
    return NextResponse.json({
      success: false,
      error: 'Requerido: vehicleId o vehicleIds con status'
    }, { status: 400 })

  } catch (error) {
    logger.error('API: PUT /vehiculos/status - Unexpected error', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 })
  }
}