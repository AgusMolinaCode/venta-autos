/**
 * Infrastructure: Vehicle Catalog Cache Service
 * Implementación del sistema de cache para el catálogo de vehículos de Autocosmos
 */

import { VehicleBrand, VehicleModel, VehicleYear, PriceGuide } from '@/domain/entities';
import type {
  VehicleCatalogCacheService,
  CacheKey,
  CacheEntry,
  CacheStats,
  CacheOptions
} from '@/domain/services';

interface CacheStorage {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<boolean>;
  clear(pattern?: string): Promise<void>;
  keys(pattern?: string): Promise<string[]>;
}

/**
 * Implementación simple de cache en memoria
 * En producción se reemplazaría por Redis o similar
 */
class MemoryCacheStorage implements CacheStorage {
  private cache = new Map<string, { value: any; expiresAt: number; createdAt: number }>();
  private hitCount = 0;
  private missCount = 0;

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.missCount++;
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.missCount++;
      return null;
    }

    this.hitCount++;
    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttl = 3600): Promise<void> {
    const expiresAt = Date.now() + (ttl * 1000);
    this.cache.set(key, {
      value,
      expiresAt,
      createdAt: Date.now()
    });
  }

  async delete(key: string): Promise<boolean> {
    return this.cache.delete(key);
  }

  async clear(pattern?: string): Promise<void> {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  async keys(pattern?: string): Promise<string[]> {
    const allKeys = Array.from(this.cache.keys());
    
    if (!pattern) {
      return allKeys;
    }

    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    return allKeys.filter(key => regex.test(key));
  }

  getStats() {
    return {
      hitCount: this.hitCount,
      missCount: this.missCount,
      totalEntries: this.cache.size
    };
  }
}

export class VehicleCatalogCacheServiceImpl implements VehicleCatalogCacheService {
  private readonly storage: CacheStorage;
  private readonly defaultTTL = {
    brands: 24 * 60 * 60,        // 24 horas
    models: 12 * 60 * 60,        // 12 horas
    years: 6 * 60 * 60,          // 6 horas
    priceGuide: 60 * 60,         // 1 hora
    popularData: 2 * 60 * 60     // 2 horas
  };

  constructor(storage?: CacheStorage) {
    this.storage = storage || new MemoryCacheStorage();
  }

  /**
   * Genera una clave de cache consistente
   */
  private generateCacheKey(namespace: string, identifier: string, version?: string): string {
    const parts = ['autocosmos', namespace, identifier];
    if (version) parts.push(version);
    return parts.join(':');
  }

  /**
   * Genera clave de cache para CacheKey interface
   */
  private generateKey(cacheKey: CacheKey): string {
    return this.generateCacheKey(cacheKey.namespace, cacheKey.identifier, cacheKey.version);
  }

  // Implementación de CacheService base

  async set<T>(key: CacheKey, value: T, options: CacheOptions = {}): Promise<void> {
    const cacheKey = this.generateKey(key);
    const ttl = options.ttl || this.defaultTTL.priceGuide;
    
    await this.storage.set(cacheKey, {
      key,
      value,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + ttl * 1000),
      accessCount: 0,
      lastAccessed: new Date(),
      tags: options.tags
    } as CacheEntry<T>, ttl);
  }

  async get<T>(key: CacheKey): Promise<T | null> {
    const cacheKey = this.generateKey(key);
    const entry = await this.storage.get<CacheEntry<T>>(cacheKey);
    
    if (!entry) return null;

    // Actualizar estadísticas de acceso
    entry.accessCount++;
    entry.lastAccessed = new Date();
    await this.storage.set(cacheKey, entry, this.defaultTTL.priceGuide);

    return entry.value;
  }

  async has(key: CacheKey): Promise<boolean> {
    const value = await this.get(key);
    return value !== null;
  }

  async delete(key: CacheKey): Promise<boolean> {
    const cacheKey = this.generateKey(key);
    return await this.storage.delete(cacheKey);
  }

  async deleteMany(keys: CacheKey[]): Promise<number> {
    let deletedCount = 0;
    
    for (const key of keys) {
      const deleted = await this.delete(key);
      if (deleted) deletedCount++;
    }
    
    return deletedCount;
  }

  async clear(namespace?: string): Promise<void> {
    const pattern = namespace ? `autocosmos:${namespace}:*` : 'autocosmos:*';
    await this.storage.clear(pattern);
  }

  async invalidateByTags(tags: string[]): Promise<number> {
    // Para implementación simple, buscamos todas las claves y verificamos tags
    const allKeys = await this.storage.keys('autocosmos:*');
    let invalidatedCount = 0;

    for (const cacheKey of allKeys) {
      const entry = await this.storage.get<CacheEntry<any>>(cacheKey);
      if (entry?.tags && entry.tags.some(tag => tags.includes(tag))) {
        await this.storage.delete(cacheKey);
        invalidatedCount++;
      }
    }

    return invalidatedCount;
  }

  async getStats(): Promise<CacheStats> {
    const memoryStats = (this.storage as MemoryCacheStorage).getStats?.();
    
    return {
      hitRate: memoryStats ? memoryStats.hitCount / (memoryStats.hitCount + memoryStats.missCount) : 0,
      missRate: memoryStats ? memoryStats.missCount / (memoryStats.hitCount + memoryStats.missCount) : 0,
      totalRequests: memoryStats ? memoryStats.hitCount + memoryStats.missCount : 0,
      totalHits: memoryStats?.hitCount || 0,
      totalMisses: memoryStats?.missCount || 0,
      totalEntries: memoryStats?.totalEntries || 0
    };
  }

  async optimize(): Promise<void> {
    // Limpiar entradas expiradas
    const allKeys = await this.storage.keys('autocosmos:*');
    
    for (const cacheKey of allKeys) {
      const entry = await this.storage.get<CacheEntry<any>>(cacheKey);
      if (entry && new Date() > entry.expiresAt) {
        await this.storage.delete(cacheKey);
      }
    }
  }

  // Implementación específica para catálogo de vehículos

  async cacheBrands(brands: VehicleBrand[], source: string): Promise<void> {
    const key = { namespace: 'brands', identifier: source };
    await this.set(key, brands, { 
      ttl: this.defaultTTL.brands,
      tags: ['brands', source]
    });
  }

  async getBrands(source: string): Promise<VehicleBrand[] | null> {
    const key = { namespace: 'brands', identifier: source };
    const brands = await this.get<VehicleBrand[]>(key);
    
    if (!brands) return null;
    
    // Reconstruir entidades desde JSON
    return brands.map(brandData => 
      VehicleBrand.fromApiData(brandData)
    );
  }

  async cacheModels(brandSlug: string, models: VehicleModel[], source: string): Promise<void> {
    const key = { namespace: 'models', identifier: `${source}:${brandSlug}` };
    await this.set(key, models, { 
      ttl: this.defaultTTL.models,
      tags: ['models', source, brandSlug]
    });
  }

  async getModels(brandSlug: string, source: string): Promise<VehicleModel[] | null> {
    const key = { namespace: 'models', identifier: `${source}:${brandSlug}` };
    const models = await this.get<VehicleModel[]>(key);
    
    if (!models) return null;
    
    return models.map(modelData => 
      VehicleModel.fromApiData(modelData)
    );
  }

  async cacheYears(brandSlug: string, modelSlug: string, years: VehicleYear[], source: string): Promise<void> {
    const key = { namespace: 'years', identifier: `${source}:${brandSlug}:${modelSlug}` };
    await this.set(key, years, { 
      ttl: this.defaultTTL.years,
      tags: ['years', source, brandSlug, modelSlug]
    });
  }

  async getYears(brandSlug: string, modelSlug: string, source: string): Promise<VehicleYear[] | null> {
    const key = { namespace: 'years', identifier: `${source}:${brandSlug}:${modelSlug}` };
    const years = await this.get<VehicleYear[]>(key);
    
    if (!years) return null;
    
    return years.map(yearData => 
      VehicleYear.fromApiData(yearData)
    );
  }

  async cachePriceGuide(priceGuide: PriceGuide): Promise<void> {
    const identifier = `${priceGuide.source.name}:${priceGuide.getVehicleId()}`;
    const key = { namespace: 'priceGuide', identifier };
    
    await this.set(key, priceGuide.toJson(), { 
      ttl: this.defaultTTL.priceGuide,
      tags: [
        'priceGuide', 
        priceGuide.source.name,
        priceGuide.brand.slug,
        priceGuide.model.slug,
        priceGuide.year.value.toString()
      ]
    });
  }

  async getPriceGuide(brand: string, model: string, year: number, source: string): Promise<PriceGuide | null> {
    const vehicleId = `${brand}-${model}-${year}`;
    const identifier = `${source}:${vehicleId}`;
    const key = { namespace: 'priceGuide', identifier };
    
    const priceGuideData = await this.get<any>(key);
    
    if (!priceGuideData) return null;
    
    // Reconstruir entidad desde JSON
    return PriceGuide.fromApiData(priceGuideData);
  }

  async invalidateVehicle(brand: string, model?: string, year?: number): Promise<void> {
    const tags = [brand];
    if (model) tags.push(model);
    if (year) tags.push(year.toString());
    
    await this.invalidateByTags(tags);
  }

  async preloadPopularData(brands: string[]): Promise<void> {
    // Implementar precarga de datos populares
    // Por ahora solo marcamos las marcas como populares
    for (const brand of brands) {
      const key = { namespace: 'popular', identifier: brand };
      await this.set(key, { brand, preloadedAt: new Date() }, {
        ttl: this.defaultTTL.popularData,
        tags: ['popular', brand]
      });
    }
  }

  async cleanupExpiredData(): Promise<{ removedEntries: number; freedSpace: number }> {
    const allKeys = await this.storage.keys('autocosmos:*');
    let removedEntries = 0;
    let freedSpace = 0;

    for (const cacheKey of allKeys) {
      const entry = await this.storage.get<CacheEntry<any>>(cacheKey);
      
      if (entry && new Date() > entry.expiresAt) {
        await this.storage.delete(cacheKey);
        removedEntries++;
        
        // Estimar espacio liberado (muy aproximado)
        freedSpace += JSON.stringify(entry).length;
      }
    }

    return { removedEntries, freedSpace };
  }

  /**
   * Método de conveniencia para invalidar cache de una marca completa
   */
  async invalidateBrand(brandSlug: string): Promise<void> {
    await this.clear(`brands:*:${brandSlug}`);
    await this.clear(`models:*:${brandSlug}`);
    await this.clear(`years:*:${brandSlug}:*`);
    await this.invalidateByTags([brandSlug]);
  }

  /**
   * Método de conveniencia para obtener estadísticas por namespace
   */
  async getNamespaceStats(namespace: string): Promise<{
    totalEntries: number;
    avgAge: number;
    hitRate: number;
  }> {
    const keys = await this.storage.keys(`autocosmos:${namespace}:*`);
    let totalAge = 0;
    let hitCount = 0;
    let totalRequests = 0;

    for (const cacheKey of keys) {
      const entry = await this.storage.get<CacheEntry<any>>(cacheKey);
      if (entry) {
        const age = Date.now() - entry.createdAt.getTime();
        totalAge += age;
        hitCount += entry.accessCount;
        totalRequests += entry.accessCount + 1; // +1 para request inicial
      }
    }

    return {
      totalEntries: keys.length,
      avgAge: keys.length > 0 ? totalAge / keys.length : 0,
      hitRate: totalRequests > 0 ? hitCount / totalRequests : 0
    };
  }
}