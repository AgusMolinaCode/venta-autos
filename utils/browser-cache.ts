/**
 * Browser Cache Utility with TTL
 * Utilidad de cache en localStorage con Time To Live
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // TTL en segundos
}

export class BrowserCache {
  private keyPrefix: string;

  constructor(keyPrefix: string = 'app_cache') {
    this.keyPrefix = keyPrefix;
  }

  /**
   * Guarda datos en cache con TTL
   */
  set<T>(key: string, data: T, ttlSeconds: number = 300): boolean {
    try {
      const item: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        ttl: ttlSeconds
      };

      const cacheKey = `${this.keyPrefix}_${key}`;
      localStorage.setItem(cacheKey, JSON.stringify(item));
      return true;
    } catch (error) {
      console.warn('[BrowserCache] Failed to save to localStorage:', error);
      return false;
    }
  }

  /**
   * Obtiene datos del cache si no han expirado
   */
  get<T>(key: string): T | null {
    try {
      const cacheKey = `${this.keyPrefix}_${key}`;
      const itemStr = localStorage.getItem(cacheKey);
      
      if (!itemStr) {
        return null;
      }

      const item: CacheItem<T> = JSON.parse(itemStr);
      const now = Date.now();
      const expirationTime = item.timestamp + (item.ttl * 1000);

      // Verificar si ha expirado
      if (now > expirationTime) {
        this.remove(key);
        return null;
      }

      return item.data;
    } catch (error) {
      console.warn('[BrowserCache] Failed to read from localStorage:', error);
      this.remove(key); // Limpiar datos corruptos
      return null;
    }
  }

  /**
   * Elimina una entrada específica del cache
   */
  remove(key: string): boolean {
    try {
      const cacheKey = `${this.keyPrefix}_${key}`;
      localStorage.removeItem(cacheKey);
      return true;
    } catch (error) {
      console.warn('[BrowserCache] Failed to remove from localStorage:', error);
      return false;
    }
  }

  /**
   * Verifica si una entrada existe y no ha expirado
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Obtiene información sobre una entrada del cache
   */
  getInfo(key: string): {
    exists: boolean;
    expired: boolean;
    remainingTTL: number; // segundos restantes
    size: number; // tamaño aproximado en bytes
  } | null {
    try {
      const cacheKey = `${this.keyPrefix}_${key}`;
      const itemStr = localStorage.getItem(cacheKey);
      
      if (!itemStr) {
        return {
          exists: false,
          expired: false,
          remainingTTL: 0,
          size: 0
        };
      }

      const item: CacheItem<unknown> = JSON.parse(itemStr);
      const now = Date.now();
      const expirationTime = item.timestamp + (item.ttl * 1000);
      const isExpired = now > expirationTime;
      const remainingTTL = isExpired ? 0 : Math.max(0, Math.floor((expirationTime - now) / 1000));

      return {
        exists: true,
        expired: isExpired,
        remainingTTL,
        size: new Blob([itemStr]).size
      };
    } catch (error) {
      console.warn('[BrowserCache] Failed to get cache info:', error);
      return null;
    }
  }

  /**
   * Limpia entradas expiradas del cache
   */
  cleanup(): number {
    let cleanedCount = 0;
    
    try {
      const keys = Object.keys(localStorage);
      const prefixedKeys = keys.filter(key => key.startsWith(`${this.keyPrefix}_`));
      
      for (const fullKey of prefixedKeys) {
        const key = fullKey.replace(`${this.keyPrefix}_`, '');
        if (!this.has(key)) {
          cleanedCount++;
        }
      }
    } catch (error) {
      console.warn('[BrowserCache] Failed to cleanup cache:', error);
    }

    return cleanedCount;
  }

  /**
   * Limpia todo el cache de esta instancia
   */
  clear(): number {
    let removedCount = 0;
    
    try {
      const keys = Object.keys(localStorage);
      const prefixedKeys = keys.filter(key => key.startsWith(`${this.keyPrefix}_`));
      
      for (const key of prefixedKeys) {
        localStorage.removeItem(key);
        removedCount++;
      }
    } catch (error) {
      console.warn('[BrowserCache] Failed to clear cache:', error);
    }

    return removedCount;
  }

  /**
   * Obtiene estadísticas del cache
   */
  getStats(): {
    totalEntries: number;
    totalSize: number; // bytes aproximados
    expiredEntries: number;
  } {
    let totalEntries = 0;
    let totalSize = 0;
    let expiredEntries = 0;

    try {
      const keys = Object.keys(localStorage);
      const prefixedKeys = keys.filter(key => key.startsWith(`${this.keyPrefix}_`));
      
      for (const fullKey of prefixedKeys) {
        const itemStr = localStorage.getItem(fullKey);
        if (itemStr) {
          totalEntries++;
          totalSize += new Blob([itemStr]).size;
          
          const key = fullKey.replace(`${this.keyPrefix}_`, '');
          const info = this.getInfo(key);
          if (info?.expired) {
            expiredEntries++;
          }
        }
      }
    } catch (error) {
      console.warn('[BrowserCache] Failed to get cache stats:', error);
    }

    return {
      totalEntries,
      totalSize,
      expiredEntries
    };
  }
}

// Instancia global para modelos de vehículos
export const vehicleModelsCache = new BrowserCache('vehicle_models');

// Hook para limpiar cache automáticamente en mount
export function useAutoCleanup(cache: BrowserCache, intervalMinutes: number = 30) {
  if (typeof window !== 'undefined') {
    // Cleanup inicial
    setTimeout(() => cache.cleanup(), 1000);
    
    // Cleanup periódico
    const interval = setInterval(() => {
      cache.cleanup();
    }, intervalMinutes * 60 * 1000);

    // Cleanup al cerrar la ventana
    const handleBeforeUnload = () => {
      cache.cleanup();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }
}