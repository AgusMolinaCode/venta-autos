/**
 * Domain Services - Barrel Export
 * Centraliza las exportaciones de todas las interfaces de servicios de dominio
 */

export type {
  AutocosmosPriceService,
  AutocosmosPriceServiceRequest,
  AutocosmosPriceServiceOptions,
  AutocosmosPriceServiceError
} from './autocosmos-price.service';

export type {
  BrandMappingService,
  BrandMapping,
  BrandMappingSearchResult
} from './brand-mapping.service';

export type {
  CacheService,
  VehicleCatalogCacheService,
  CacheKey,
  CacheEntry,
  CacheStats,
  CacheOptions
} from './cache.service';