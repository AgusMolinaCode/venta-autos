/**
 * API Route: Get Vehicle Models by Brand
 * Obtiene modelos de vehículos para una marca específica desde Autocosmos
 */

import { NextRequest, NextResponse } from 'next/server';
import { BrandMappingServiceImpl } from '@/lib/services/autocosmos/brand-mapping-service';

const brandMapping = new BrandMappingServiceImpl();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ brand: string }> }
) {
  try {
    // Await params first (Next.js 15 requirement)
    const resolvedParams = await params;
    const { brand } = resolvedParams;

    if (!brand || brand.trim() === '') {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Brand parameter is required',
          details: {
            field: 'brand',
            received: brand
          }
        }
      }, { status: 400 });
    }

    // Decodificar el parámetro de marca
    const decodedBrand = decodeURIComponent(brand);

    // Mapear marca local a Autocosmos slug
    const autocosmoBrand = await brandMapping.mapToAutocosmosBrand(decodedBrand);
    
    if (!autocosmoBrand) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'BRAND_NOT_MAPPED',
          message: `No mapping found for brand: ${decodedBrand}`,
          details: {
            brand: decodedBrand,
            availableMappings: await brandMapping.getAllMappings()
              .then(mappings => mappings.slice(0, 5).map(m => m.localBrand))
          }
        }
      }, { status: 404 });
    }

    // Hacer scraping directo a la página de Autocosmos
    const autocosmosBrandName = autocosmoBrand.name.toLowerCase();
    const autocosnosUrl = `https://www.autocosmos.com.ar/guiadeprecios?Marca=${encodeURIComponent(autocosmosBrandName)}`;
    
    const response = await fetch(autocosnosUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Autocosmos page: ${response.status}`);
    }

    const html = await response.text();
    
    // Buscar el select de modelos con múltiples patrones
    let selectContent = '';
    let selectFound = false;
    
    // Buscar el select de modelos - sabemos que tiene data-role="modelo-select" e id="Modelo"
    const selectRegex = /<select[^>]*data-role="modelo-select"[^>]*id="Modelo"[^>]*>(.*?)<\/select>/s;
    let selectMatch = html.match(selectRegex);
    
    if (selectMatch) {
      selectContent = selectMatch[1];
      selectFound = true;
    } else {
      // Fallback: buscar solo por id="Modelo"
      const selectRegexFallback = /<select[^>]*id="Modelo"[^>]*>(.*?)<\/select>/s;
      selectMatch = html.match(selectRegexFallback);
      
      if (selectMatch) {
        selectContent = selectMatch[1];
        selectFound = true;
      }
    }
    
    if (!selectFound) {
      throw new Error('No se encontró el select de modelos en la página');
    }
    
    // Extraer opciones del select
    const optionsRegex = /<option value="([^"]*)"[^>]*>([^<]+)<\/option>/g;
    const models = [];
    const slugCounts = new Map(); // Para rastrear slugs duplicados
    let optionMatch;
    let optionCount = 0;
    
    while ((optionMatch = optionsRegex.exec(selectContent)) !== null) {
      const [, value, text] = optionMatch;
      optionCount++;
      
      // Saltar opción vacía "Elegir modelo..."
      if (value && value.trim() !== '' && text.trim() !== 'Elegir modelo...') {
        // Normalizar slug para que cumpla con la validación de VehicleModel
        let normalizedSlug = value.trim()
          .toLowerCase()
          .replace(/\+/g, 'plus')       // + → plus (ej: "KA +" → "ka-plus")
          .replace(/&/g, 'and')         // & → and  
          .replace(/[^a-z0-9-]/g, '-')  // Reemplazar caracteres no válidos con guiones
          .replace(/-+/g, '-')          // Reemplazar múltiples guiones con uno solo
          .replace(/^-|-$/g, '');       // Remover guiones al inicio y final

        // Manejar slugs duplicados agregando sufijo numérico
        const baseSlug = normalizedSlug;
        const currentCount = slugCounts.get(baseSlug) || 0;
        slugCounts.set(baseSlug, currentCount + 1);
        
        if (currentCount > 0) {
          normalizedSlug = `${baseSlug}-${currentCount + 1}`;
        }

        // Decodificar HTML entities en el nombre para display correcto
        const decodedName = text.trim()
          .replace(/&#x([0-9A-Fa-f]+);/g, (match, code) => String.fromCharCode(parseInt(code, 16)))
          .replace(/&#(\d+);/g, (match, code) => String.fromCharCode(parseInt(code, 10)))
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&apos;/g, "'");

        models.push({
          name: decodedName,
          slug: normalizedSlug,
          brandSlug: autocosmoBrand.slug,
          displayName: decodedName,
          isActive: true
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: models,
      metadata: {
        brand: {
          local: decodedBrand,
          autocosmos: autocosmoBrand.name,
          slug: autocosmoBrand.slug
        },
        count: models.length,
        timestamp: new Date().toISOString(),
        source: 'autocosmos_scraping',
        url: autocosnosUrl
      }
    }, { status: 200 });

  } catch (error) {
    // Get brand from resolved params or fallback
    const brandForLog = (await params.catch(() => ({ brand: 'unknown' }))).brand;
    
    console.error('🔥 [AUTOCOSMOS MODELS API ERROR]', {
      brand: brandForLog,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });

    // Determinar tipo de error y código de respuesta
    let statusCode = 500;
    let errorCode = 'INTERNAL_ERROR';
    let errorMessage = 'Internal server error';

    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        statusCode = 504;
        errorCode = 'TIMEOUT_ERROR';
        errorMessage = 'Request timeout while fetching models';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        statusCode = 503;
        errorCode = 'SERVICE_UNAVAILABLE';
        errorMessage = 'Autocosmos service temporarily unavailable';
      } else if (error.message.includes('not found')) {
        statusCode = 404;
        errorCode = 'MODELS_NOT_FOUND';
        errorMessage = `No models found for brand: ${brandForLog}`;
      } else if (error.message.includes('rate limit')) {
        statusCode = 429;
        errorCode = 'RATE_LIMITED';
        errorMessage = 'Too many requests to Autocosmos service';
      }
    }

    return NextResponse.json({
      success: false,
      error: {
        code: errorCode,
        message: errorMessage,
        details: {
          originalError: error instanceof Error ? error.message : 'Unknown error',
          brand: brandForLog,
          timestamp: new Date().toISOString(),
          retryable: ['TIMEOUT_ERROR', 'SERVICE_UNAVAILABLE', 'RATE_LIMITED'].includes(errorCode)
        }
      }
    }, { status: statusCode });
  }
}

/**
 * Maneja peticiones OPTIONS para CORS
 */
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}