/**
 * Application Layer: Autocosmos Service with Error Handling
 * Servicio principal que integra cliente HTTP con manejo de errores y cache
 */

import { VehicleBrand, VehicleModel, VehicleYear, PriceGuide } from '@/domain/entities';
import type {
  AutocosmosPriceService,
  AutocosmosPriceServiceRequest,
  AutocosmosPriceServiceOptions,
  AutocosmosPriceServiceError
} from '@/domain/services';

import { AutocosmosHttpClient } from './autocosmos-http-client';
import { BrandMappingServiceImpl } from './brand-mapping-service';
import { VehicleCatalogCacheServiceImpl } from './vehicle-catalog-cache';
import { AutocosmosErrorHandler, ErrorContext } from './error-handler';

export interface AutocosmosServiceOptions {
  enableCache?: boolean;
  cacheTTL?: number;
  enableErrorHandling?: boolean;
  maxRetries?: number;
  timeout?: number;
}

export class AutocosmosService implements AutocosmosPriceService {
  private readonly httpClient: AutocosmosHttpClient;
  private readonly brandMapping: BrandMappingServiceImpl;
  private readonly cache: VehicleCatalogCacheServiceImpl;
  private readonly errorHandler: AutocosmosErrorHandler;
  private readonly options: AutocosmosServiceOptions;

  constructor(options: AutocosmosServiceOptions = {}) {
    this.options = {
      enableCache: true,
      cacheTTL: 3600,
      enableErrorHandling: true,
      maxRetries: 3,
      timeout: 10000,
      ...options
    };

    this.httpClient = new AutocosmosHttpClient(
      this.options.maxRetries,
      1000 // retry delay
    );
    
    this.brandMapping = new BrandMappingServiceImpl();
    this.cache = new VehicleCatalogCacheServiceImpl();
    
    this.errorHandler = new AutocosmosErrorHandler({
      maxRetries: this.options.maxRetries,
      enableFallback: this.options.enableErrorHandling,
      logErrors: true
    });
  }

  /**
   * Wrapper para ejecutar operaciones con manejo de errores
   */
  private async executeWithErrorHandling<T>(
    operation: string,
    fn: () => Promise<T>,
    data?: any
  ): Promise<T> {
    if (!this.options.enableErrorHandling) {
      return await fn();
    }

    const context: ErrorContext = {
      operation,
      provider: 'autocosmos',
      data,
      attempt: 0,
      timestamp: new Date()
    };

    try {
      return await fn();
    } catch (error) {
      return await this.errorHandler.handleError(
        error as Error,
        context,
        fn
      );
    }
  }

  /**
   * Obtiene marcas con cache y manejo de errores
   */
  async getBrands(): Promise<VehicleBrand[]> {
    return this.executeWithErrorHandling('getBrands', async () => {
      // Verificar cache primero
      if (this.options.enableCache) {
        const cached = await this.cache.getBrands('autocosmos');
        if (cached) {
          return cached;
        }
      }

      // Obtener de HTTP client
      const brands = await this.httpClient.getBrands();

      // Cachear resultado
      if (this.options.enableCache) {
        await this.cache.cacheBrands(brands, 'autocosmos');
      }

      return brands;
    });
  }

  /**
   * Obtiene modelos con cache y manejo de errores
   */
  async getModelsByBrand(brandSlug: string): Promise<VehicleModel[]> {
    return this.executeWithErrorHandling('getModelsByBrand', async () => {
      // Verificar cache primero
      if (this.options.enableCache) {
        const cached = await this.cache.getModels(brandSlug, 'autocosmos');
        if (cached) {
          return cached;
        }
      }

      // Obtener de HTTP client
      const models = await this.httpClient.getModelsByBrand(brandSlug);

      // Cachear resultado
      if (this.options.enableCache) {
        await this.cache.cacheModels(brandSlug, models, 'autocosmos');
      }

      return models;
    }, { brandSlug });
  }

  /**
   * Obtiene años con cache y manejo de errores
   */
  async getYearsByModel(brandSlug: string, modelSlug: string): Promise<VehicleYear[]> {
    return this.executeWithErrorHandling('getYearsByModel', async () => {
      // Verificar cache primero
      if (this.options.enableCache) {
        const cached = await this.cache.getYears(brandSlug, modelSlug, 'autocosmos');
        if (cached) {
          return cached;
        }
      }

      // Obtener de HTTP client
      const years = await this.httpClient.getYearsByModel(brandSlug, modelSlug);

      // Cachear resultado
      if (this.options.enableCache) {
        await this.cache.cacheYears(brandSlug, modelSlug, years, 'autocosmos');
      }

      return years;
    }, { brandSlug, modelSlug });
  }

  /**
   * Obtiene guía de precios con mapeo, cache y manejo de errores
   */
  async getPriceGuide(
    request: AutocosmosPriceServiceRequest,
    options: AutocosmosPriceServiceOptions = {}
  ): Promise<PriceGuide> {
    return this.executeWithErrorHandling('getPriceGuide', async () => {
      // Verificar cache primero
      if (this.options.enableCache) {
        const cached = await this.cache.getPriceGuide(
          request.brand,
          request.model,
          request.year,
          'autocosmos'
        );
        if (cached && this.isCacheValid(cached, options.maxAge)) {
          return cached;
        }
      }

      // Mapear marca local a Autocosmos
      const autocosmoBrand = await this.brandMapping.mapToAutocosmosBrand(request.brand);
      if (!autocosmoBrand) {
        throw new Error(`Brand mapping not found: ${request.brand}`);
      }

      // Crear request con marca mapeada
      const mappedRequest: AutocosmosPriceServiceRequest = {
        ...request,
        brand: autocosmoBrand.name
      };

      // Obtener guía de precios
      const priceGuide = await this.httpClient.getPriceGuide(mappedRequest, options);

      // Cachear resultado
      if (this.options.enableCache) {
        await this.cache.cachePriceGuide(priceGuide);
      }

      return priceGuide;
    }, request);
  }

  /**
   * Verifica si un resultado cacheado sigue siendo válido
   */
  private isCacheValid(priceGuide: PriceGuide, maxAge?: number): boolean {
    if (!maxAge) return true;

    const ageInSeconds = (Date.now() - priceGuide.retrievedAt.getTime()) / 1000;
    return ageInSeconds < maxAge;
  }

  /**
   * Obtiene múltiples guías de precios con procesamiento paralelo
   */
  async getBulkPriceGuides(
    requests: AutocosmosPriceServiceRequest[],
    options: AutocosmosPriceServiceOptions = {}
  ): Promise<(PriceGuide | AutocosmosPriceServiceError)[]> {
    const results: (PriceGuide | AutocosmosPriceServiceError)[] = [];

    // Procesar en lotes para evitar sobrecargar el servidor
    const batchSize = 5;
    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (request) => {
        try {
          const priceGuide = await this.getPriceGuide(request, options);
          return priceGuide;
        } catch (error) {
          return error as AutocosmosPriceServiceError;
        }
      });

      const batchResults = await Promise.allSettled(batchPromises);
      
      for (const result of batchResults) {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          results.push({
            code: 'UNKNOWN_ERROR',
            message: result.reason?.message || 'Unknown error',
            details: result.reason
          });
        }
      }

      // Pequeña pausa entre lotes para ser respetuosos con el servidor
      if (i + batchSize < requests.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  /**
   * Verifica disponibilidad de vehículo
   */
  async isVehicleAvailable(request: AutocosmosPriceServiceRequest): Promise<boolean> {
    try {
      await this.getPriceGuide(request);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Obtiene estadísticas de disponibilidad de datos
   */
  async getDataAvailabilityStats(): Promise<{
    totalBrands: number;
    totalModels: number;
    totalYears: number;
    lastUpdated: Date;
  }> {
    return this.executeWithErrorHandling('getDataAvailabilityStats', async () => {
      return await this.httpClient.getDataAvailabilityStats();
    });
  }

  /**
   * Invalida cache para un vehículo específico
   */
  async invalidateVehicleCache(brand: string, model?: string, year?: number): Promise<void> {
    if (this.options.enableCache) {
      await this.cache.invalidateVehicle(brand, model, year);
    }
  }

  /**
   * Obtiene estadísticas del servicio
   */
  async getServiceStats(): Promise<{
    cache: {
      hitRate: number;
      totalEntries: number;
    };
    errors: {
      isHealthy: boolean;
      errorCount: number;
    };
    mapping: {
      totalMappings: number;
      activeMappings: number;
    };
  }> {
    const [cacheStats, mappingStats] = await Promise.all([
      this.cache.getStats(),
      this.brandMapping.getMappingStats()
    ]);

    return {
      cache: {
        hitRate: cacheStats.hitRate,
        totalEntries: cacheStats.totalEntries
      },
      errors: {
        isHealthy: this.errorHandler.isServiceHealthy('getPriceGuide'),
        errorCount: this.errorHandler.getErrorStatistics().size
      },
      mapping: {
        totalMappings: mappingStats.totalMappings,
        activeMappings: mappingStats.activeMappings
      }
    };
  }

  /**
   * Limpia datos obsoletos y optimiza el servicio
   */
  async optimize(): Promise<{
    cacheOptimized: boolean;
    errorsCleared: number;
  }> {
    const errorStatsBefore = this.errorHandler.getErrorStatistics().size;

    await Promise.all([
      this.cache.optimize(),
      this.cache.cleanupExpiredData(),
      this.errorHandler.cleanupOldStats()
    ]);

    const errorStatsAfter = this.errorHandler.getErrorStatistics().size;

    return {
      cacheOptimized: true,
      errorsCleared: errorStatsBefore - errorStatsAfter
    };
  }

  /**
   * Precarga datos populares para mejorar performance
   */
  async preloadPopularData(brands: string[]): Promise<void> {
    if (!this.options.enableCache) return;

    await this.cache.preloadPopularData(brands);

    // Precargar marcas si no están en cache
    try {
      await this.getBrands();
    } catch (error) {
      console.warn('Failed to preload brands:', error);
    }
  }
}