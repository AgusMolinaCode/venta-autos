/**
 * Application Layer: Price Aggregator Service
 * Servicio que agrega datos de múltiples proveedores de precios
 */

import { CarValuationRequest, CarValuationResponse } from '../car-valuation';
import { MercadoLibreScraper } from '../mercadolibre-scraper';
import { AutocosmosHttpClient } from '../autocosmos/autocosmos-http-client';
import { BrandMappingServiceImpl } from '../autocosmos/brand-mapping-service';
import { VehicleCatalogCacheServiceImpl } from '../autocosmos/vehicle-catalog-cache';
import type { PriceGuide } from '@/domain/entities';

interface PriceProvider {
  name: string;
  reliability: number;
  priority: number;
  isEnabled: boolean;
}

interface AggregatedPriceResult {
  provider: string;
  success: boolean;
  data?: CarValuationResponse;
  error?: string;
  responseTime: number;
}

export interface PriceAggregatorOptions {
  enabledProviders?: string[];
  maxTimeout?: number;
  requireMinimumProviders?: number;
  includeProviderDetails?: boolean;
}

export class PriceAggregatorService {
  private readonly providers: Map<string, PriceProvider> = new Map([
    ['autocosmos', { name: 'Autocosmos', reliability: 0.85, priority: 1, isEnabled: true }],
    ['mercadolibre', { name: 'MercadoLibre', reliability: 0.75, priority: 2, isEnabled: true }]
  ]);

  private readonly autocosmosClient: AutocosmosHttpClient;
  private readonly mercadolibreClient: MercadoLibreScraper;
  private readonly brandMapping: BrandMappingServiceImpl;
  private readonly cache: VehicleCatalogCacheServiceImpl;

  constructor() {
    this.autocosmosClient = new AutocosmosHttpClient();
    this.mercadolibreClient = new MercadoLibreScraper();
    this.brandMapping = new BrandMappingServiceImpl();
    this.cache = new VehicleCatalogCacheServiceImpl();
  }

  /**
   * Obtiene datos de precios de múltiples proveedores
   */
  async getAggregatedPriceData(
    request: CarValuationRequest,
    options: PriceAggregatorOptions = {}
  ): Promise<CarValuationResponse[]> {
    const {
      enabledProviders = ['autocosmos', 'mercadolibre'],
      maxTimeout = 15000,
      requireMinimumProviders = 1,
      includeProviderDetails = false
    } = options;

    // Verificar cache primero
    const cacheKey = this.generateCacheKey(request);
    const cached = await this.getCachedResult(cacheKey);
    if (cached) {
      return cached;
    }

    // Obtener datos de proveedores en paralelo
    const providerResults = await this.fetchFromProviders(
      request,
      enabledProviders,
      maxTimeout
    );

    // Filtrar resultados exitosos
    const successfulResults = providerResults.filter(result => result.success);

    if (successfulResults.length < requireMinimumProviders) {
      throw new Error(
        `Insufficient data: only ${successfulResults.length} of ${requireMinimumProviders} required providers responded successfully`
      );
    }

    // Agregar y transformar resultados
    const aggregatedResults = await this.aggregateResults(successfulResults, includeProviderDetails);

    // Cachear resultado
    await this.cacheResult(cacheKey, aggregatedResults);

    return aggregatedResults;
  }

  /**
   * Obtiene datos de proveedores en paralelo
   */
  private async fetchFromProviders(
    request: CarValuationRequest,
    enabledProviders: string[],
    maxTimeout: number
  ): Promise<AggregatedPriceResult[]> {
    const promises: Promise<AggregatedPriceResult>[] = [];

    for (const providerName of enabledProviders) {
      const provider = this.providers.get(providerName);
      
      if (!provider || !provider.isEnabled) {
        continue;
      }

      const promise = this.fetchFromSingleProvider(providerName, request, maxTimeout);
      promises.push(promise);
    }

    return Promise.allSettled(promises).then(results =>
      results
        .filter((result): result is PromiseFulfilledResult<AggregatedPriceResult> => 
          result.status === 'fulfilled'
        )
        .map(result => result.value)
    );
  }

  /**
   * Obtiene datos de un proveedor específico
   */
  private async fetchFromSingleProvider(
    providerName: string,
    request: CarValuationRequest,
    maxTimeout: number
  ): Promise<AggregatedPriceResult> {
    const startTime = Date.now();

    try {
      let data: CarValuationResponse;

      switch (providerName) {
        case 'autocosmos':
          data = await this.fetchFromAutocosmos(request, maxTimeout);
          break;
        
        case 'mercadolibre':
          data = await this.fetchFromMercadoLibre(request, maxTimeout);
          break;
        
        default:
          throw new Error(`Unknown provider: ${providerName}`);
      }

      return {
        provider: providerName,
        success: true,
        data,
        responseTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        provider: providerName,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime: Date.now() - startTime
      };
    }
  }

  /**
   * Obtiene datos de Autocosmos
   */
  private async fetchFromAutocosmos(
    request: CarValuationRequest,
    maxTimeout: number
  ): Promise<CarValuationResponse> {
    // Mapear marca local a Autocosmos
    const autocosmoBrand = await this.brandMapping.mapToAutocosmosBrand(request.marca);
    
    if (!autocosmoBrand) {
      throw new Error(`Brand not found in Autocosmos: ${request.marca}`);
    }

    // Obtener guía de precios
    const priceGuide = await Promise.race([
      this.autocosmosClient.getPriceGuide({
        brand: request.marca,
        model: request.modelo,
        year: request.ano
      }),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), maxTimeout)
      )
    ]);

    // Convertir PriceGuide a CarValuationResponse
    return this.convertPriceGuideToResponse(priceGuide);
  }

  /**
   * Obtiene datos de MercadoLibre
   */
  private async fetchFromMercadoLibre(
    request: CarValuationRequest,
    maxTimeout: number
  ): Promise<CarValuationResponse> {
    const result = await Promise.race([
      this.mercadolibreClient.scrapeVehicleData(request.ano, request.marca, request.modelo),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), maxTimeout)
      )
    ]);

    // Convertir resultado de scraping a CarValuationResponse
    return {
      total_vehiculos: result.total_vehiculos,
      exchange_rate_used: result.exchange_rate_used,
      search_url: result.search_url,
      precios_ars_completo: result.precios_ars_completo,
      precios_usd_completo: result.precios_usd_completo,
      primeros_3_productos: result.primeros_3_productos
    };
  }

  /**
   * Convierte PriceGuide de Autocosmos a formato CarValuationResponse
   */
  private convertPriceGuideToResponse(priceGuide: PriceGuide): CarValuationResponse {
    const arsRange = priceGuide.priceRangeARS;
    const usdRange = priceGuide.priceRangeUSD;

    return {
      total_vehiculos: arsRange.sampleSize,
      exchange_rate_used: '1 USD = 1000 ARS', // Placeholder
      search_url: priceGuide.source.url,
      precios_ars_completo: {
        total: arsRange.sampleSize * arsRange.average,
        min: arsRange.min,
        max: arsRange.max,
        avg: arsRange.average
      },
      precios_usd_completo: {
        total: usdRange.sampleSize * usdRange.average,
        min: usdRange.min,
        max: usdRange.max,
        avg: usdRange.average
      },
      primeros_3_productos: [] // Autocosmos no proporciona productos individuales
    };
  }

  /**
   * Agrega resultados de múltiples proveedores
   */
  private async aggregateResults(
    results: AggregatedPriceResult[],
    includeProviderDetails: boolean
  ): Promise<CarValuationResponse[]> {
    if (results.length === 0) {
      return [];
    }

    // Por ahora, retornamos todos los resultados
    // En el futuro podríamos implementar agregación inteligente
    const responses: CarValuationResponse[] = [];

    for (const result of results) {
      if (result.data) {
        let response = { ...result.data };
        
        if (includeProviderDetails) {
          response = {
            ...response,
            _provider: result.provider,
            _responseTime: result.responseTime,
            _reliability: this.providers.get(result.provider)?.reliability
          } as any;
        }
        
        responses.push(response);
      }
    }

    return responses;
  }

  /**
   * Genera clave de cache para una request
   */
  private generateCacheKey(request: CarValuationRequest): string {
    return `price-aggregator:${request.marca}:${request.modelo}:${request.ano}`;
  }

  /**
   * Obtiene resultado del cache
   */
  private async getCachedResult(cacheKey: string): Promise<CarValuationResponse[] | null> {
    try {
      const cached = await this.cache.get({
        namespace: 'aggregated-prices',
        identifier: cacheKey
      });
      return cached;
    } catch {
      return null;
    }
  }

  /**
   * Cachea resultado
   */
  private async cacheResult(cacheKey: string, result: CarValuationResponse[]): Promise<void> {
    try {
      await this.cache.set(
        {
          namespace: 'aggregated-prices',
          identifier: cacheKey
        },
        result,
        { ttl: 3600 } // 1 hora
      );
    } catch (error) {
      console.warn('Failed to cache aggregated price result:', error);
    }
  }

  /**
   * Obtiene estadísticas de proveedores
   */
  async getProviderStats(): Promise<{
    [providerName: string]: {
      reliability: number;
      priority: number;
      isEnabled: boolean;
      successRate?: number;
      avgResponseTime?: number;
    };
  }> {
    interface ProviderStats {
      reliability: number;
      priority: number;
      isEnabled: boolean;
      runtime: {
        requests: number;
        errors: number;
        lastUsed: Date | null;
        averageResponseTime: number;
      };
    }
    
    const stats: Record<string, ProviderStats> = {};
    
    for (const [name, provider] of this.providers) {
      stats[name] = {
        reliability: provider.reliability,
        priority: provider.priority,
        isEnabled: provider.isEnabled,
        runtime: {
          requests: provider.requestCount || 0,
          errors: provider.errorCount || 0,
          lastUsed: provider.lastUsed || null,
          averageResponseTime: provider.averageResponseTime || 0
        }
      };
    }
    
    return stats;
  }

  /**
   * Habilita/deshabilita un proveedor
   */
  setProviderEnabled(providerName: string, enabled: boolean): void {
    const provider = this.providers.get(providerName);
    if (provider) {
      provider.isEnabled = enabled;
    }
  }

  /**
   * Obtiene lista de proveedores disponibles
   */
  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  /**
   * Obtiene proveedores habilitados ordenados por prioridad
   */
  getEnabledProviders(): string[] {
    return Array.from(this.providers.entries())
      .filter(([, provider]) => provider.isEnabled)
      .sort(([, a], [, b]) => a.priority - b.priority)
      .map(([name]) => name);
  }
}