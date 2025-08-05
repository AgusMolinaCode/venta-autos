/**
 * API Route: Get Vehicle Years by Brand and Model
 * Obtiene años disponibles para una marca y modelo específico desde Autocosmos
 */

import { NextRequest, NextResponse } from 'next/server';
import { BrandMappingServiceImpl } from '@/lib/services/autocosmos/brand-mapping-service';

const brandMapping = new BrandMappingServiceImpl();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ brand: string; model: string }> }
) {
  try {
    // Await params first (Next.js 15 requirement)
    const resolvedParams = await params;
    const { brand, model } = resolvedParams;

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

    if (!model || model.trim() === '') {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Model parameter is required',
          details: {
            field: 'model',
            received: model
          }
        }
      }, { status: 400 });
    }

    // Decodificar parámetros
    const decodedBrand = decodeURIComponent(brand);
    const decodedModel = decodeURIComponent(model);

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
            model: decodedModel,
            availableMappings: await brandMapping.getAllMappings()
              .then(mappings => mappings.slice(0, 5).map(m => m.localBrand))
          }
        }
      }, { status: 404 });
    }

    // Normalizar modelo para URL (similar al slug)
    const normalizedModel = decodedModel
      .toLowerCase()
      .replace(/\+/g, 'plus')
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Construir URL de Autocosmos con marca y modelo
    const autocosmosBrandName = autocosmoBrand.name.toLowerCase();
    const autocosnosUrl = `https://www.autocosmos.com.ar/guiadeprecios?Marca=${encodeURIComponent(autocosmosBrandName)}&Modelo=${encodeURIComponent(normalizedModel)}`;
    
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
    
    // Buscar el select de años con data-role="year-select" e id="A"
    let selectContent = '';
    let selectFound = false;
    
    const selectRegex = /<select[^>]*data-role="year-select"[^>]*id="A"[^>]*>([\s\S]*?)<\/select>/;
    let selectMatch = html.match(selectRegex);
    
    if (selectMatch) {
      selectContent = selectMatch[1];
      selectFound = true;
    } else {
      // Fallback: buscar solo por id="A"
      const selectRegexFallback = /<select[^>]*id="A"[^>]*>([\s\S]*?)<\/select>/;
      selectMatch = html.match(selectRegexFallback);
      
      if (selectMatch) {
        selectContent = selectMatch[1];
        selectFound = true;
      }
    }
    
    if (!selectFound) {
      throw new Error('No se encontró el select de años en la página');
    }

    // Extraer opciones del select de años
    const optionsRegex = /<option value="([^"]*)"[^>]*>([^<]+)<\/option>/g;
    const years = [];
    let optionMatch;
    let optionCount = 0;
    
    while ((optionMatch = optionsRegex.exec(selectContent)) !== null) {
      const [, value, text] = optionMatch;
      optionCount++;
      
      // Saltar opción vacía "Elegir año..."
      if (value && value.trim() !== '' && text.trim() !== 'Elegir año...') {
        const yearNumber = parseInt(value.trim());
        if (!isNaN(yearNumber) && yearNumber >= 1990 && yearNumber <= new Date().getFullYear() + 1) {
          years.push({
            year: yearNumber,
            value: value.trim(),
            displayText: text.trim()
          });
        }
      }
    }

    // Ordenar años de más reciente a más antiguo
    years.sort((a, b) => b.year - a.year);

    return NextResponse.json({
      success: true,
      data: years,
      metadata: {
        brand: {
          local: decodedBrand,
          autocosmos: autocosmoBrand.name,
          slug: autocosmoBrand.slug
        },
        model: {
          local: decodedModel,
          normalized: normalizedModel
        },
        count: years.length,
        timestamp: new Date().toISOString(),
        source: 'autocosmos_scraping',
        url: autocosnosUrl
      }
    }, { status: 200 });

  } catch (error) {
    // Get params from resolved params or fallback
    const brandForLog = (await params.catch(() => ({ brand: 'unknown', model: 'unknown' }))).brand;
    const modelForLog = (await params.catch(() => ({ brand: 'unknown', model: 'unknown' }))).model;
    
    console.error('🔥 [AUTOCOSMOS YEARS API ERROR]', {
      brand: brandForLog,
      model: modelForLog,
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
        errorMessage = 'Request timeout while fetching years';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        statusCode = 503;
        errorCode = 'SERVICE_UNAVAILABLE';
        errorMessage = 'Autocosmos service temporarily unavailable';
      } else if (error.message.includes('not found')) {
        statusCode = 404;
        errorCode = 'YEARS_NOT_FOUND';
        errorMessage = `No years found for brand: ${brandForLog}, model: ${modelForLog}`;
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
          model: modelForLog,
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