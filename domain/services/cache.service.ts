/**
 * Interfaz del Servicio de Dominio: Cache Service
 * Define el contrato para el sistema de cache multinivel
 */

import { VehicleBrand, VehicleModel, VehicleYear, PriceGuide } from '../entities';

export interface CacheKey {
  namespace: string;
  identifier: string;
  version?: string;
}

export interface CacheEntry<T> {
  key: CacheKey;
  value: T;
  createdAt: Date;
  expiresAt: Date;
  accessCount: number;
  lastAccessed: Date;
  tags?: string[];
}

export interface CacheStats {
  hitRate: number;
  missRate: number;
  totalRequests: number;
  totalHits: number;
  totalMisses: number;
  totalEntries: number;
  memoryUsage?: number;
  diskUsage?: number;
}

export interface CacheOptions {
  ttl?: number;          // Time to live en segundos
  level?: 'memory' | 'disk' | 'both'; // Nivel de cache
  tags?: string[];       // Tags para invalidación selectiva
  priority?: 'low' | 'normal' | 'high'; // Prioridad para eviction
}

/**
 * Servicio de dominio para cache multinivel
 */
export interface CacheService {
  /**
   * Almacena un valor en el cache
   */
  set<T>(key: CacheKey, value: T, options?: CacheOptions): Promise<void>;

  /**
   * Obtiene un valor del cache
   */
  get<T>(key: CacheKey): Promise<T | null>;

  /**
   * Verifica si existe una clave en el cache
   */
  has(key: CacheKey): Promise<boolean>;

  /**
   * Elimina una clave específica del cache
   */
  delete(key: CacheKey): Promise<boolean>;

  /**
   * Elimina múltiples claves del cache
   */
  deleteMany(keys: CacheKey[]): Promise<number>;

  /**
   * Limpia todo el cache o un namespace específico
   */
  clear(namespace?: string): Promise<void>;

  /**
   * Invalida cache por tags
   */
  invalidateByTags(tags: string[]): Promise<number>;

  /**
   * Obtiene estadísticas del cache
   */
  getStats(): Promise<CacheStats>;

  /**
   * Optimiza el cache (limpieza, compactación, etc.)
   */
  optimize(): Promise<void>;
}

/**
 * Servicio especializado para cache de catálogo de vehículos
 */
export interface VehicleCatalogCacheService extends CacheService {
  /**
   * Cache de marcas
   */
  cacheBrands(brands: VehicleBrand[], source: string): Promise<void>;
  getBrands(source: string): Promise<VehicleBrand[] | null>;

  /**
   * Cache de modelos por marca
   */
  cacheModels(brandSlug: string, models: VehicleModel[], source: string): Promise<void>;
  getModels(brandSlug: string, source: string): Promise<VehicleModel[] | null>;

  /**
   * Cache de años por modelo
   */
  cacheYears(brandSlug: string, modelSlug: string, years: VehicleYear[], source: string): Promise<void>;
  getYears(brandSlug: string, modelSlug: string, source: string): Promise<VehicleYear[] | null>;

  /**
   * Cache de guías de precios
   */
  cachePriceGuide(priceGuide: PriceGuide): Promise<void>;
  getPriceGuide(brand: string, model: string, year: number, source: string): Promise<PriceGuide | null>;

  /**
   * Invalidación selectiva por vehículo
   */
  invalidateVehicle(brand: string, model?: string, year?: number): Promise<void>;

  /**
   * Precarga datos populares
   */
  preloadPopularData(brands: string[]): Promise<void>;

  /**
   * Limpieza de datos obsoletos
   */
  cleanupExpiredData(): Promise<{
    removedEntries: number;
    freedSpace: number;
  }>;
}