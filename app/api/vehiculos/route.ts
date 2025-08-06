import { NextRequest, NextResponse } from 'next/server'
import { VehiculoService } from '@/lib/services/vehicle-service'
import { VehicleFormInputSchema, PriceSchema } from '@/lib/validations'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    logger.info('API: POST /vehiculos - Request received')
    
    const formData = await request.formData()
    
    // Extract and validate vehicle data with proper sanitization
    const rawVehicleData = {
      marca: formData.get('marca')?.toString().trim(),
      modelo: formData.get('modelo')?.toString().trim(),
      ano: formData.get('ano') ? parseInt(formData.get('ano') as string) : undefined,
      kilometraje: formData.get('kilometraje') ? parseInt(formData.get('kilometraje') as string) : undefined,
      version: formData.get('version')?.toString().trim() || undefined,
      combustible: formData.get('combustible')?.toString().trim() || undefined,
      transmision: formData.get('transmision')?.toString().trim() || undefined,
      color: formData.get('color')?.toString().trim() || undefined,
      estado: formData.get('estado')?.toString().trim() || 'preparación',
      descripcion: formData.get('descripcion')?.toString().trim() || undefined,
      tipo_vehiculo: formData.get('tipo_vehiculo')?.toString().trim() || 'autos/camionetas',
    }

    const rawPriceData = {
      precio: formData.get('precio') ? parseFloat(formData.get('precio') as string) : undefined,
      moneda: formData.get('moneda')?.toString().trim() || 'ARS',
    }

    // Validate vehicle data
    const vehicleValidation = VehicleFormInputSchema.safeParse(rawVehicleData)
    if (!vehicleValidation.success) {
      logger.warn('API: POST /vehiculos - Invalid vehicle data', { 
        errors: vehicleValidation.error.errors 
      })
      return NextResponse.json({
        success: false,
        error: 'Datos del vehículo inválidos',
        details: vehicleValidation.error.errors
      }, { status: 400 })
    }

    // Validate price data
    const priceValidation = PriceSchema.safeParse(rawPriceData)
    if (!priceValidation.success) {
      logger.warn('API: POST /vehiculos - Invalid price data', { 
        errors: priceValidation.error.errors 
      })
      return NextResponse.json({
        success: false,
        error: 'Datos de precio inválidos',
        details: priceValidation.error.errors
      }, { status: 400 })
    }

    // Combine validated data (no user_id required)
    const vehiculoData = {
      ...vehicleValidation.data,
      ...priceValidation.data
    }

    // Extract and validate photo files
    const fotos: File[] = []
    const entries = Array.from(formData.entries())
    
    for (const [key, value] of entries) {
      if (key === 'fotos' && value instanceof File) {
        // Basic file validation
        if (value.size === 0) {
          logger.warn('API: POST /vehiculos - Empty file detected', { fileName: value.name })
          continue
        }
        
        if (value.size > 10 * 1024 * 1024) { // 10MB limit
          logger.warn('API: POST /vehiculos - File too large', { 
            fileName: value.name, 
            size: value.size 
          })
          return NextResponse.json({
            success: false,
            error: `El archivo ${value.name} es demasiado grande (máximo 10MB)`
          }, { status: 400 })
        }
        
        // Check file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if (!allowedTypes.includes(value.type)) {
          logger.warn('API: POST /vehiculos - Invalid file type', { 
            fileName: value.name, 
            type: value.type 
          })
          return NextResponse.json({
            success: false,
            error: `Tipo de archivo no válido: ${value.name}. Solo se permiten JPG, PNG, WEBP`
          }, { status: 400 })
        }
        
        fotos.push(value)
      }
    }

    logger.info('API: POST /vehiculos - Data processed', {
      vehiculo: vehiculoData,
      cantidad_fotos: fotos.length
    })

    // Llamar al servicio
    const result = await VehiculoService.crearVehiculoConFotos({
      vehiculoData,
      fotos
    })

    if (result.success) {
      logger.info('API: POST /vehiculos - Vehicle created successfully', { 
        vehicleId: result.data?.id 
      })
      return NextResponse.json({
        success: true,
        data: result.data,
        message: 'Vehículo creado exitosamente'
      }, { status: 201 })
    } else {
      logger.error('API: POST /vehiculos - Service error', { 
        error: result.error 
      })
      return NextResponse.json({
        success: false,
        error: 'Error al crear vehículo'
      }, { status: 400 })
    }

  } catch (error) {
    logger.error('API: POST /vehiculos - Unexpected error', { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    })
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vehiculoId = searchParams.get('id')

    // Validate vehicle ID parameter
    if (!vehiculoId) {
      logger.warn('API: GET /vehiculos - Missing vehicle ID')
      return NextResponse.json({
        success: false,
        error: 'ID de vehículo requerido'
      }, { status: 400 })
    }

    // Sanitize vehicle ID (should be UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(vehiculoId)) {
      logger.warn('API: GET /vehiculos - Invalid vehicle ID format', { vehiculoId })
      return NextResponse.json({
        success: false,
        error: 'ID de vehículo inválido'
      }, { status: 400 })
    }

    logger.info('API: GET /vehiculos - Request received', { vehiculoId })

    const result = await VehiculoService.obtenerVehiculoConFotos(vehiculoId)

    if (result.success) {
      logger.info('API: GET /vehiculos - Vehicle retrieved successfully', { vehiculoId })
      return NextResponse.json({
        success: true,
        data: result.data
      })
    } else {
      logger.warn('API: GET /vehiculos - Vehicle not found', { vehiculoId })
      return NextResponse.json({
        success: false,
        error: 'Vehículo no encontrado'
      }, { status: 404 })
    }

  } catch (error) {
    logger.error('API: GET /vehiculos - Unexpected error', { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    })
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 })
  }
}