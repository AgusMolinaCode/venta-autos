import { NextRequest, NextResponse } from 'next/server';

// Rate limiting storage (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10;
  
  const current = rateLimitMap.get(ip);
  
  if (!current || now > current.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }
  
  if (current.count >= maxRequests) {
    return true;
  }
  
  current.count++;
  return false;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'anonymous';
    
    // Check rate limit
    if (rateLimit(ip)) {
      return NextResponse.json(
        { error: 'Límite de solicitudes excedido. Intente nuevamente en 1 minuto.' },
        { status: 429 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    const { marca, modelo, ano } = body;
    
    // Validate input
    if (!marca || !modelo || !ano) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos: marca, modelo, ano' },
        { status: 400 }
      );
    }
    
    if (typeof ano !== 'number' || ano < 1970 || ano > 2025) {
      return NextResponse.json(
        { error: 'El año debe ser un número entre 1970 y 2025' },
        { status: 400 }
      );
    }
    
    console.log(`Fetching price reference for: ${marca} ${modelo} ${ano}`);
    
    // Fetch from external API
    const externalResponse = await fetch(
      'https://primary-production-1e497.up.railway.app/webhook/b9c2fb0f-5b6d-407b-b19a-0561b22b98c4',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ano,
          marca,
          modelo,
        }),
      }
    );
    
    if (!externalResponse.ok) {
      console.error(`External API error: ${externalResponse.status} ${externalResponse.statusText}`);
      return NextResponse.json(
        { error: 'Error al obtener datos de precios de referencia' },
        { status: 502 }
      );
    }
    
    const externalData = await externalResponse.json();
    
    // Validate external response structure
    if (!Array.isArray(externalData) || externalData.length === 0) {
      return NextResponse.json(
        { error: 'No se encontraron datos de precios' },
        { status: 404 }
      );
    }
    
    const priceData = externalData[0];
    
    // Return successful result
    return NextResponse.json({
      success: true,
      data: {
        vehicle: { marca, modelo, ano },
        totalVehicles: priceData.total_vehiculos,
        exchangeRate: priceData.exchange_rate_used,
        prices: {
          ars: {
            total: priceData.precios_ars_completo.total,
            min: priceData.precios_ars_completo.min,
            max: priceData.precios_ars_completo.max,
            avg: priceData.precios_ars_completo.avg,
          },
          usd: {
            total: priceData.precios_usd_completo.total,
            min: priceData.precios_usd_completo.min,
            max: priceData.precios_usd_completo.max,
            avg: priceData.precios_usd_completo.avg,
          },
        },
        topProducts: priceData.primeros_3_productos?.map((product: {
          name: string;
          image: string;
          url: string;
          price: number;
          priceCurrency: string;
        }) => ({
          name: product.name,
          image: product.image,
          url: product.url,
          price: product.price,
          currency: product.priceCurrency,
        })) || [],
        timestamp: new Date().toISOString(),
      },
    });
    
  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

// GET method for testing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const marca = searchParams.get('marca');
  const modelo = searchParams.get('modelo');
  const ano = searchParams.get('ano');
  
  if (!marca || !modelo || !ano) {
    return NextResponse.json(
      { error: 'Parámetros requeridos: marca, modelo, ano' },
      { status: 400 }
    );
  }
  
  // Redirect to POST with proper body
  return NextResponse.json({
    message: 'Use POST method with JSON body',
    example: {
      marca,
      modelo,
      ano: parseInt(ano)
    }
  });
}