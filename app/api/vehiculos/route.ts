import { NextRequest, NextResponse } from 'next/server'
import { VehiculoService } from '@/lib/services/vehicle-service'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extraer datos del vehículo
    const vehiculoData = {
      marca: formData.get('marca') as string,
      modelo: formData.get('modelo') as string,
      ano: parseInt(formData.get('ano') as string),
      kilometraje: formData.get('kilometraje') ? parseInt(formData.get('kilometraje') as string) : undefined,
      version: formData.get('version') as string || undefined,
      combustible: formData.get('combustible') as string || undefined,
      transmision: formData.get('transmision') as string || undefined,
      color: formData.get('color') as string || undefined,
      descripcion: formData.get('descripcion') as string || undefined,
      precio: parseFloat(formData.get('precio') as string),
      moneda: formData.get('moneda') as 'ARS' | 'USD',
    }

    // Extraer archivos de fotos
    const fotos: File[] = []
    const entries = Array.from(formData.entries())
    
    for (const [key, value] of entries) {
      if (key === 'fotos' && value instanceof File) {
        fotos.push(value)
      }
    }

    console.log('📝 API: Datos recibidos:', {
      vehiculo: vehiculoData,
      cantidad_fotos: fotos.length
    })

    // Llamar al servicio
    const result = await VehiculoService.crearVehiculoConFotos({
      vehiculoData,
      fotos
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
        message: 'Vehículo creado exitosamente'
      }, { status: 201 })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 400 })
    }

  } catch (error) {
    console.error('❌ Error en API /vehiculos:', error)
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

    if (!vehiculoId) {
      return NextResponse.json({
        success: false,
        error: 'ID de vehículo requerido'
      }, { status: 400 })
    }

    const result = await VehiculoService.obtenerVehiculoConFotos(vehiculoId)

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 404 })
    }

  } catch (error) {
    console.error('❌ Error en API GET /vehiculos:', error)
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 })
  }
}