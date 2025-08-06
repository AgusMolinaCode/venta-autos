/**
 * API Route: Autocosmos Price Reference
 * Endpoint que integra Autocosmos como proveedor de datos de precios
 */

import { NextRequest, NextResponse } from 'next/server';
import { CarValuationRequest } from '@/lib/services/car-valuation';
import { PriceAggregatorService } from '@/lib/services/price-reference/price-aggregator.service';

// Configuración de validación
const VALIDATION_RULES = {
  marca: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9\s\-\.]+$/
  },
  modelo: {
    required: true,
    minLength: 1,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s\-\.\/]+$/
  },
  ano: {
    required: true,
    min: 1950,
    max: new Date().getFullYear() + 1
  }
};

interface ApiError {
  error: string;
  code: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata?: {
    providers: string[];
    responseTime: number;
    cacheHit: boolean;
  };
}

/**
 * Valida los datos de entrada
 */
function validateRequest(data: Record<string, unknown>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validar marca
  if (!data.marca) {
    errors.push('Marca is required');
  } else {
    if (data.marca.length < VALIDATION_RULES.marca.minLength) {
      errors.push(`Marca must be at least ${VALIDATION_RULES.marca.minLength} characters`);
    }
    if (data.marca.length > VALIDATION_RULES.marca.maxLength) {
      errors.push(`Marca must be at most ${VALIDATION_RULES.marca.maxLength} characters`);
    }
    if (!VALIDATION_RULES.marca.pattern.test(data.marca)) {
      errors.push('Marca contains invalid characters');
    }
  }

  // Validar modelo
  if (!data.modelo) {
    errors.push('Modelo is required');
  } else {
    if (data.modelo.length < VALIDATION_RULES.modelo.minLength) {
      errors.push(`Modelo must be at least ${VALIDATION_RULES.modelo.minLength} characters`);
    }
    if (data.modelo.length > VALIDATION_RULES.modelo.maxLength) {
      errors.push(`Modelo must be at most ${VALIDATION_RULES.modelo.maxLength} characters`);
    }
    if (!VALIDATION_RULES.modelo.pattern.test(data.modelo)) {
      errors.push('Modelo contains invalid characters');
    }
  }

  // Validar año
  if (!data.ano) {
    errors.push('Ano is required');
  } else {
    const year = parseInt(data.ano);
    if (isNaN(year)) {
      errors.push('Ano must be a valid number');
    } else {
      if (year < VALIDATION_RULES.ano.min) {
        errors.push(`Ano must be at least ${VALIDATION_RULES.ano.min}`);
      }
      if (year > VALIDATION_RULES.ano.max) {
        errors.push(`Ano must be at most ${VALIDATION_RULES.ano.max}`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Maneja errores y los convierte a formato estándar
 */
function handleError(error: unknown, code: string = 'INTERNAL_ERROR'): ApiError {
  let message = 'Internal server error';
  let details: Record<string, unknown> | undefined = undefined;

  if (error instanceof Error) {
    message = error.message;
    
    // Categorizar errores comunes
    if (message.includes('timeout') || message.includes('Timeout')) {
      code = 'TIMEOUT_ERROR';
    } else if (message.includes('not found') || message.includes('Not found')) {
      code = 'NOT_FOUND';
    } else if (message.includes('network') || message.includes('fetch')) {
      code = 'NETWORK_ERROR';
    } else if (message.includes('Insufficient data')) {
      code = 'INSUFFICIENT_DATA';
    }
  }

  if (process.env.NODE_ENV === 'development') {
    details = {
      stack: error?.stack,
      originalError: error
    };
  }

  return {
    error: message,
    code,
    details,
    timestamp: new Date().toISOString()
  };
}

/**
 * Handler principal para requests POST
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let requestData: Record<string, unknown>;

  try {
    // Parsear body de la request
    try {
      requestData = await request.json();
    } catch (parseError) {
      return NextResponse.json({
        success: false,
        error: handleError(new Error('Invalid JSON in request body'), 'INVALID_REQUEST')
      } as ApiResponse<never>, { status: 400 });
    }

    // Validar datos de entrada
    const validation = validateRequest(requestData);
    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        error: {
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: { errors: validation.errors },
          timestamp: new Date().toISOString()
        }
      } as ApiResponse<never>, { status: 400 });
    }

    // Preparar request para el servicio
    const carValuationRequest: CarValuationRequest = {
      marca: requestData.marca.trim(),
      modelo: requestData.modelo.trim(),
      ano: parseInt(requestData.ano)
    };

    // Obtener parámetros de query
    const url = new URL(request.url);
    const providers = url.searchParams.get('providers')?.split(',') || ['autocosmos', 'mercadolibre'];
    const includeDetails = url.searchParams.get('includeDetails') === 'true';
    const timeoutMs = parseInt(url.searchParams.get('timeout') || '15000');

    // Crear instancia del agregador
    const aggregator = new PriceAggregatorService();

    // Obtener datos agregados
    const priceData = await aggregator.getAggregatedPriceData(carValuationRequest, {
      enabledProviders: providers,
      maxTimeout: timeoutMs,
      requireMinimumProviders: 1,
      includeProviderDetails: includeDetails
    });

    const responseTime = Date.now() - startTime;

    // Retornar respuesta exitosa
    return NextResponse.json({
      success: true,
      data: priceData,
      metadata: {
        providers: aggregator.getEnabledProviders(),
        responseTime,
        cacheHit: responseTime < 100 // Heurística simple para detectar cache hit
      }
    } as ApiResponse<typeof priceData>, { status: 200 });

  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    console.error('❌ [AUTOCOSMOS API] Error processing request:', {
      error: error instanceof Error ? error.message : error,
      requestData,
      responseTime
    });

    // Determinar código de estado HTTP basado en el tipo de error
    let statusCode = 500;
    let errorCode = 'INTERNAL_ERROR';

    if (error instanceof Error) {
      if (error.message.includes('timeout') || error.message.includes('Timeout')) {
        statusCode = 504;
        errorCode = 'TIMEOUT_ERROR';
      } else if (error.message.includes('not found') || error.message.includes('Not found')) {
        statusCode = 404;
        errorCode = 'NOT_FOUND';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        statusCode = 502;
        errorCode = 'NETWORK_ERROR';
      } else if (error.message.includes('Insufficient data')) {
        statusCode = 503;
        errorCode = 'INSUFFICIENT_DATA';
      }
    }

    return NextResponse.json({
      success: false,
      error: handleError(error, errorCode)
    } as ApiResponse<never>, { status: statusCode });
  }
}

/**
 * Handler para requests GET - información de la API
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const action = url.searchParams.get('action');

  try {
    const aggregator = new PriceAggregatorService();

    switch (action) {
      case 'providers':
        const stats = await aggregator.getProviderStats();
        return NextResponse.json({
          success: true,
          data: {
            available: aggregator.getAvailableProviders(),
            enabled: aggregator.getEnabledProviders(),
            stats
          }
        });

      case 'health':
        return NextResponse.json({
          success: true,
          data: {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            version: '1.0.0'
          }
        });

      default:
        return NextResponse.json({
          success: true,
          data: {
            name: 'Autocosmos Price Reference API',
            version: '1.0.0',
            description: 'API que integra múltiples proveedores de datos de precios de vehículos',
            endpoints: {
              'POST /': 'Obtener datos de precios',
              'GET /?action=providers': 'Información de proveedores',
              'GET /?action=health': 'Estado de salud de la API'
            },
            providers: aggregator.getAvailableProviders()
          }
        });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: handleError(error)
    } as ApiResponse<never>, { status: 500 });
  }
}

/**
 * Handler para requests OPTIONS - CORS
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}