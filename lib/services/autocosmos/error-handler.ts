/**
 * Infrastructure: Error Handler for Autocosmos Services
 * Manejo centralizado de errores con estrategias de recuperación
 */

import type { AutocosmosPriceServiceError } from '@/domain/services';

export interface ErrorHandlerOptions {
  maxRetries?: number;
  retryDelay?: number;
  enableFallback?: boolean;
  logErrors?: boolean;
}

export interface ErrorContext {
  operation: string;
  provider: string;
  data?: any;
  attempt?: number;
  timestamp: Date;
}

export interface FallbackStrategy {
  name: string;
  canHandle: (error: Error, context: ErrorContext) => boolean;
  execute: (error: Error, context: ErrorContext) => Promise<any>;
  priority: number;
}

export class AutocosmosErrorHandler {
  private fallbackStrategies: FallbackStrategy[] = [];
  private errorStats = new Map<string, { count: number; lastOccurred: Date }>();

  constructor(private options: ErrorHandlerOptions = {}) {
    this.registerDefaultFallbacks();
  }

  /**
   * Registra estrategias de fallback por defecto
   */
  private registerDefaultFallbacks(): void {
    // Fallback 1: Retry con backoff exponencial
    this.registerFallback({
      name: 'exponential-backoff-retry',
      priority: 1,
      canHandle: (error, context) => {
        return (
          context.attempt! < (this.options.maxRetries || 3) &&
          this.isRetryableError(error)
        );
      },
      execute: async (error, context) => {
        const delay = this.calculateRetryDelay(context.attempt || 0);
        await this.sleep(delay);
        throw new Error(`Retry attempt ${context.attempt} after ${delay}ms`);
      }
    });

    // Fallback 2: Cache degradado
    this.registerFallback({
      name: 'degraded-cache',
      priority: 2,
      canHandle: (error, context) => {
        return context.operation.includes('get') && 
               !error.message.includes('cache');
      },
      execute: async (error, context) => {
        // Implementar búsqueda en cache degradado
        return null; // Placeholder
      }
    });

    // Fallback 3: Datos por defecto
    this.registerFallback({
      name: 'default-data',
      priority: 3,
      canHandle: (error, context) => {
        return context.operation === 'getPriceGuide';
      },
      execute: async (error, context) => {
        return this.generateDefaultPriceData(context.data);
      }
    });
  }

  /**
   * Maneja un error con estrategias de recuperación
   */
  async handleError<T>(
    error: Error,
    context: ErrorContext,
    originalOperation: () => Promise<T>
  ): Promise<T> {
    this.logError(error, context);
    this.updateErrorStats(error, context);

    // Buscar estrategia de fallback aplicable
    const strategy = this.findApplicableFallback(error, context);
    
    if (!strategy) {
      throw this.enhanceError(error, context);
    }

    try {
      const result = await strategy.execute(error, context);
      
      // Si la estrategia retorna null, significa que no pudo recuperarse
      if (result === null) {
        throw this.enhanceError(error, context);
      }

      // Si la estrategia indica retry, ejecutar operación original
      if (strategy.name.includes('retry')) {
        return await originalOperation();
      }

      return result;
    } catch (fallbackError) {
      // Si el fallback falla, intentar con siguiente estrategia
      const nextStrategy = this.findNextFallback(strategy, error, context);
      
      if (nextStrategy) {
        context.attempt = (context.attempt || 0) + 1;
        return this.handleError(fallbackError as Error, context, originalOperation);
      }

      throw this.enhanceError(error, context);
    }
  }

  /**
   * Registra una nueva estrategia de fallback
   */
  registerFallback(strategy: FallbackStrategy): void {
    this.fallbackStrategies.push(strategy);
    this.fallbackStrategies.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Encuentra la estrategia de fallback más apropiada
   */
  private findApplicableFallback(error: Error, context: ErrorContext): FallbackStrategy | null {
    return this.fallbackStrategies.find(strategy => 
      strategy.canHandle(error, context)
    ) || null;
  }

  /**
   * Encuentra la siguiente estrategia de fallback
   */
  private findNextFallback(
    currentStrategy: FallbackStrategy, 
    error: Error, 
    context: ErrorContext
  ): FallbackStrategy | null {
    const currentIndex = this.fallbackStrategies.indexOf(currentStrategy);
    
    return this.fallbackStrategies
      .slice(currentIndex + 1)
      .find(strategy => strategy.canHandle(error, context)) || null;
  }

  /**
   * Determina si un error es reintentalbe
   */
  private isRetryableError(error: Error): boolean {
    const retryableKeywords = [
      'timeout',
      'network',
      'connection',
      'temporarily unavailable',
      'rate limit',
      '503',
      '504',
      'ECONNRESET',
      'ENOTFOUND'
    ];

    const errorMessage = error.message.toLowerCase();
    return retryableKeywords.some(keyword => errorMessage.includes(keyword));
  }

  /**
   * Calcula el delay para retry con backoff exponencial
   */
  private calculateRetryDelay(attempt: number): number {
    const baseDelay = this.options.retryDelay || 1000;
    const jitter = Math.random() * 0.3; // 30% jitter
    return Math.floor(baseDelay * Math.pow(2, attempt) * (1 + jitter));
  }

  /**
   * Genera datos de precio por defecto como último recurso
   */
  private generateDefaultPriceData(vehicleData: any): any {
    // Generar estimaciones básicas basadas en año y marca
    const currentYear = new Date().getFullYear();
    const vehicleAge = currentYear - (vehicleData?.ano || currentYear);
    
    // Precios base por tipo de vehículo (muy simplificado)
    const basePrice = this.estimateBasePrice(vehicleData?.marca);
    const depreciationFactor = Math.max(0.3, 1 - (vehicleAge * 0.15));
    
    const estimatedPrice = Math.round(basePrice * depreciationFactor);
    const variance = estimatedPrice * 0.3; // 30% de varianza
    
    return {
      precio_minimo: Math.round(estimatedPrice - variance),
      precio_maximo: Math.round(estimatedPrice + variance),
      precio_promedio: estimatedPrice,
      cantidad_muestras: 0,
      moneda: 'ARS',
      fecha_actualizacion: new Date().toISOString(),
      url_fuente: 'estimation',
      _isEstimated: true,
      _confidence: 0.3
    };
  }

  /**
   * Estima precio base por marca
   */
  private estimateBasePrice(marca?: string): number {
    const brandPrices: { [key: string]: number } = {
      'toyota': 25000000,
      'volkswagen': 23000000,
      'ford': 22000000,
      'chevrolet': 20000000,
      'fiat': 18000000,
      'mercedes-benz': 45000000,
      'bmw': 40000000,
      'audi': 42000000,
      'honda': 24000000,
      'hyundai': 21000000,
      'kia': 20000000,
      'nissan': 22000000,
      'peugeot': 19000000,
      'renault': 18000000
    };

    const brandKey = marca?.toLowerCase().replace(/[^a-z]/g, '');
    return brandPrices[brandKey || ''] || 20000000; // Default 20M ARS
  }

  /**
   * Mejora un error con contexto adicional
   */
  private enhanceError(error: Error, context: ErrorContext): AutocosmosPriceServiceError {
    let code: AutocosmosPriceServiceError['code'] = 'UNKNOWN_ERROR';

    if (error.message.includes('timeout')) {
      code = 'TIMEOUT';
    } else if (error.message.includes('network') || error.message.includes('fetch')) {
      code = 'NETWORK_ERROR';
    } else if (error.message.includes('not found')) {
      code = 'INVALID_VEHICLE';
    } else if (error.message.includes('rate limit')) {
      code = 'RATE_LIMITED';
    }

    return {
      code,
      message: error.message,
      details: {
        originalError: error,
        context,
        errorStats: this.getErrorStats(error.message),
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Registra errores para análisis
   */
  private logError(error: Error, context: ErrorContext): void {
    if (!this.options.logErrors) return;

    console.error('🔥 [AUTOCOSMOS ERROR]', {
      message: error.message,
      operation: context.operation,
      provider: context.provider,
      attempt: context.attempt,
      timestamp: context.timestamp,
      stack: error.stack
    });
  }

  /**
   * Actualiza estadísticas de errores
   */
  private updateErrorStats(error: Error, context: ErrorContext): void {
    const key = `${context.operation}:${error.constructor.name}`;
    const current = this.errorStats.get(key) || { count: 0, lastOccurred: new Date() };
    
    this.errorStats.set(key, {
      count: current.count + 1,
      lastOccurred: new Date()
    });
  }

  /**
   * Obtiene estadísticas de un error específico
   */
  private getErrorStats(errorMessage: string): { count: number; lastOccurred: Date } | null {
    for (const [key, stats] of this.errorStats.entries()) {
      if (key.includes(errorMessage.substring(0, 20))) {
        return stats;
      }
    }
    return null;
  }

  /**
   * Obtiene todas las estadísticas de errores
   */
  getErrorStatistics(): Map<string, { count: number; lastOccurred: Date }> {
    return new Map(this.errorStats);
  }

  /**
   * Limpia estadísticas de errores antiguas
   */
  cleanupOldStats(maxAge: number = 7 * 24 * 60 * 60 * 1000): void {
    const cutoffDate = new Date(Date.now() - maxAge);
    
    for (const [key, stats] of this.errorStats.entries()) {
      if (stats.lastOccurred < cutoffDate) {
        this.errorStats.delete(key);
      }
    }
  }

  /**
   * Helper para sleep/delay
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Verifica si un servicio está saludable basado en estadísticas de errores
   */
  isServiceHealthy(operation: string, errorThreshold: number = 0.1): boolean {
    const relevantStats = Array.from(this.errorStats.entries())
      .filter(([key]) => key.startsWith(operation))
      .reduce((total, [, stats]) => total + stats.count, 0);

    // Consideramos que el servicio no está saludable si hay muchos errores recientes
    const recentErrors = Array.from(this.errorStats.entries())
      .filter(([key, stats]) => {
        const isRecent = Date.now() - stats.lastOccurred.getTime() < 60 * 60 * 1000; // 1 hora
        return key.startsWith(operation) && isRecent;
      })
      .length;

    return recentErrors < errorThreshold * 10; // Umbral ajustable
  }
}