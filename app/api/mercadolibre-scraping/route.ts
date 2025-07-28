import { NextRequest, NextResponse } from 'next/server';
import { MercadoLibreScraper } from '@/lib/services/mercadolibre-scraper';
import { z } from 'zod';

// Request validation schema
const RequestSchema = z.object({
  ano: z.number().int().min(1900).max(2030),
  marca: z.string().min(1).max(50),
  modelo: z.string().min(1).max(100),
});

// Rate limiting storage (in production, use Redis or database)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 5; // Reduced for scraping operations
  
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

function generateMockScrapingResult(marca: string, modelo: string, ano: number) {
  const basePrice = 15000000; // Base price in ARS
  const variation = 0.3; // 30% variation
  const exchangeRate = 1300;
  
  // Generate random prices with variation
  const prices = Array.from({ length: 25 }, () => {
    const randomFactor = 1 + (Math.random() - 0.5) * variation;
    return Math.round(basePrice * randomFactor);
  });
  
  const pricesUSD = prices.map(price => Math.round(price / exchangeRate));
  
  const calculateStats = (priceArray: number[]) => ({
    total: priceArray.reduce((sum, p) => sum + p, 0),
    min: Math.min(...priceArray),
    max: Math.max(...priceArray),
    avg: Math.round(priceArray.reduce((sum, p) => sum + p, 0) / priceArray.length)
  });

  return {
    total_vehiculos: prices.length,
    exchange_rate_used: `1 USD = ${exchangeRate} ARS`,
    search_url: `https://autos.mercadolibre.com.ar/${marca.toLowerCase()}/${ano}/${modelo.toLowerCase()}`,
    precios_ars_completo: calculateStats(prices),
    precios_usd_completo: calculateStats(pricesUSD),
    primeros_3_productos: [
      {
        name: `${marca} ${modelo} ${ano} - Automático`,
        image: "https://http2.mlstatic.com/D_NQ_NP_2X_620002-MLA86974701456_072025-F.webp",
        url: "https://auto.mercadolibre.com.ar/MLA-mock-listing-1",
        price: prices[0],
        priceCurrency: "ARS",
        kilometers: "50.000 km",
        city: "Buenos Aires"
      },
      {
        name: `${marca} ${modelo} ${ano} - Manual`,
        image: "https://http2.mlstatic.com/D_NQ_NP_2X_999871-MLA83154288918_032025-F.webp",
        url: "https://auto.mercadolibre.com.ar/MLA-mock-listing-2",
        price: Math.round(pricesUSD[1]),
        priceCurrency: "USD",
        kilometers: "75.000 km",
        city: "Córdoba"
      },
      {
        name: `${marca} ${modelo} ${ano} - Full`,
        image: "https://http2.mlstatic.com/D_NQ_NP_2X_985615-MLA86282586199_062025-F.webp",
        url: "https://auto.mercadolibre.com.ar/MLA-mock-listing-3",
        price: prices[2],
        priceCurrency: "ARS",
        kilometers: "30.000 km",
        city: "Rosario"
      }
    ]
  };
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'anonymous';
    
    // Check rate limit
    if (rateLimit(ip)) {
      return NextResponse.json(
        { 
          error: 'Límite de solicitudes excedido. Intente nuevamente en 1 minuto.',
          code: 'RATE_LIMIT_EXCEEDED'
        },
        { status: 429 }
      );
    }
    
    // Parse and validate request body
    const body = await request.json();
    const validation = RequestSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Datos de entrada inválidos',
          details: validation.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
          })),
          code: 'VALIDATION_ERROR'
        },
        { status: 400 }
      );
    }
    
    const { ano, marca, modelo } = validation.data;
    
    console.log(`[SCRAPER] Starting scraping for: ${marca} ${modelo} ${ano}`);
    console.log(`[SCRAPER] Generated URL will be tested...`);
    
    // Check if we should use mock data (only when explicitly enabled)
    const useMockData = process.env.USE_MOCK_SCRAPING === 'true';
    
    let result;
    if (useMockData) {
      console.log(`[SCRAPER] Using mock data (USE_MOCK_SCRAPING=true)`);
      // Generate realistic mock data
      result = generateMockScrapingResult(marca, modelo, ano);
    } else {
      console.log(`[SCRAPER] Using real scraping for: ${marca} ${modelo} ${ano}`);
      // Initialize scraper and perform scraping
      const scraper = new MercadoLibreScraper();
      result = await scraper.scrapeVehicleData(ano, marca, modelo);
    }
    
    const executionTime = Date.now() - startTime;
    console.log(`[SCRAPER] Scraping completed in ${executionTime}ms`);
    
    // Return results in the same format as the original webhook
    return NextResponse.json([result], {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=600', // Cache for 5-10 minutes
        'X-Execution-Time': executionTime.toString(),
        'X-Data-Source': 'mercadolibre-scraping'
      }
    });
    
  } catch (error) {
    const executionTime = Date.now() - startTime;
    console.error('[SCRAPER] Error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      // Scraping specific errors
      if (error.message.includes('No vehicle listings found')) {
        return NextResponse.json(
          { 
            error: 'No se encontraron vehículos para los criterios especificados',
            code: 'NO_RESULTS_FOUND',
            suggestion: 'Intente con otros criterios de búsqueda'
          },
          { status: 404 }
        );
      }
      
      if (error.message.includes('Failed to fetch page content')) {
        return NextResponse.json(
          { 
            error: 'Error al acceder al sitio web de MercadoLibre',
            code: 'SCRAPING_ERROR',
            suggestion: 'Intente nuevamente en unos momentos'
          },
          { status: 502 }
        );
      }
      
      if (error.message.includes('timeout')) {
        return NextResponse.json(
          { 
            error: 'Tiempo de espera agotado al obtener datos',
            code: 'TIMEOUT_ERROR',
            suggestion: 'Intente nuevamente'
          },
          { status: 504 }
        );
      }
    }
    
    // Generic server error
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        code: 'INTERNAL_ERROR',
        details: process.env.NODE_ENV === 'development' ? 
          (error instanceof Error ? error.message : 'Unknown error') : 
          undefined
      },
      { 
        status: 500,
        headers: {
          'X-Execution-Time': executionTime.toString()
        }
      }
    );
  }
}

// GET method for testing and documentation
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const marca = searchParams.get('marca');
  const modelo = searchParams.get('modelo');
  const ano = searchParams.get('ano');
  
  return NextResponse.json({
    message: 'MercadoLibre Scraping API',
    description: 'Este endpoint realiza scraping directo de MercadoLibre para obtener precios de vehículos',
    usage: {
      method: 'POST',
      endpoint: '/api/mercadolibre-scraping',
      contentType: 'application/json',
      body: {
        ano: 'number (1900-2030)',
        marca: 'string (1-50 chars)',
        modelo: 'string (1-100 chars)'
      },
      example: {
        ano: 2020,
        marca: 'Toyota',
        modelo: 'Corolla'
      }
    },
    rateLimit: {
      requests: 5,
      window: '1 minute'
    },
    caching: {
      duration: '5-10 minutes',
      description: 'Los resultados se cachean para optimizar el rendimiento'
    },
    testExample: marca && modelo && ano ? {
      testUrl: `/api/mercadolibre-scraping`,
      testPayload: {
        ano: parseInt(ano),
        marca,
        modelo
      }
    } : undefined
  });
}