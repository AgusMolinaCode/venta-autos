/**
 * Infrastructure: Autocosmos HTTP Client
 * Cliente HTTP para interactuar con las APIs de Autocosmos
 */

import { VehicleBrand, VehicleModel, VehicleYear, PriceGuide } from '@/domain/entities';
import { PriceRange } from '@/domain/value-objects';
import type {
  AutocosmosPriceService,
  AutocosmosPriceServiceRequest,
  AutocosmosPriceServiceOptions,
  AutocosmosPriceServiceError
} from '@/domain/services';

interface AutocosmosApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

interface AutocosmosModelResponse {
  value: string;
  text: string;
  disabled?: boolean;
}

interface AutocosmosYearResponse {
  value: string;
  text: string;
  disabled?: boolean;
}

interface AutocosmosPriceResponse {
  precio_minimo: number;
  precio_maximo: number;
  precio_promedio: number;
  cantidad_muestras: number;
  moneda: 'ARS' | 'USD';
  fecha_actualizacion: string;
  url_fuente?: string;
}

export class AutocosmosHttpClient implements AutocosmosPriceService {
  private readonly baseUrl = 'https://www.autocosmos.com.ar';
  private readonly timeout = 10000; // 10 segundos
  private readonly userAgent = 'VentaAutosApp/1.0';

  constructor(
    private readonly maxRetries: number = 3,
    private readonly retryDelay: number = 1000
  ) {}

  /**
   * Realiza una petición HTTP con retry automático
   */
  private async makeRequest<T>(
    url: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'application/json, text/html, */*',
          'Accept-Language': 'es-AR,es;q=0.9',
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return await response.json();
      } else {
        // Para HTML responses, retornamos el texto
        return await response.text() as T;
      }
    } catch (error) {
      clearTimeout(timeoutId);

      if (retryCount < this.maxRetries) {
        await this.delay(this.retryDelay * Math.pow(2, retryCount));
        return this.makeRequest<T>(url, options, retryCount + 1);
      }

      throw this.mapError(error);
    }
  }

  /**
   * Delay helper para retry
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Mapea errores a formato estándar
   */
  private mapError(error: any): AutocosmosPriceServiceError {
    if (error.name === 'AbortError') {
      return {
        code: 'TIMEOUT',
        message: 'Request timeout exceeded',
        details: { timeout: this.timeout }
      };
    }

    if (error.message?.includes('fetch')) {
      return {
        code: 'NETWORK_ERROR',
        message: 'Network connection failed',
        details: error.message
      };
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: error.message || 'Unknown error occurred',
      details: error
    };
  }

  /**
   * Extrae marcas del HTML de la página principal
   */
  async getBrands(): Promise<VehicleBrand[]> {
    try {
      const html = await this.makeRequest<string>(`${this.baseUrl}/guiadeprecios`);
      
      const brands: VehicleBrand[] = [];
      const optionRegex = /<option value="([^"]*)"[^>]*>([^<]+)<\/option>/g;
      let match;

      while ((match = optionRegex.exec(html)) !== null) {
        const [, value, text] = match;
        
        // Omitir opción vacía
        if (!value || value.trim() === '') continue;
        
        brands.push(new VehicleBrand(
          text.trim(),
          value.trim(),
          text.trim() // displayName igual al text
        ));
      }

      return brands.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      throw this.mapError(error);
    }
  }

  /**
   * Obtiene modelos para una marca específica
   */
  async getModelsByBrand(brandSlug: string): Promise<VehicleModel[]> {
    try {
      const url = `${this.baseUrl}/guiadeprecios/modelos?marca=${encodeURIComponent(brandSlug)}`;
      const response = await this.makeRequest<AutocosmosModelResponse[]>(url);

      const models: VehicleModel[] = [];
      
      for (const item of response) {
        if (!item.value || item.value.trim() === '' || item.disabled) continue;
        
        models.push(new VehicleModel(
          item.text.trim(),
          item.value.trim(),
          brandSlug,
          item.text.trim(),
          !item.disabled
        ));
      }

      return models.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      throw this.mapError(error);
    }
  }

  /**
   * Obtiene años para un modelo específico
   */
  async getYearsByModel(brandSlug: string, modelSlug: string): Promise<VehicleYear[]> {
    try {
      const url = `${this.baseUrl}/guiadeprecios/anios?marca=${encodeURIComponent(brandSlug)}&modelo=${encodeURIComponent(modelSlug)}`;
      const response = await this.makeRequest<AutocosmosYearResponse[]>(url);

      const years: VehicleYear[] = [];
      
      for (const item of response) {
        if (!item.value || item.value.trim() === '' || item.disabled) continue;
        
        const yearValue = parseInt(item.value);
        if (isNaN(yearValue)) continue;
        
        years.push(new VehicleYear(
          yearValue,
          modelSlug,
          brandSlug,
          !item.disabled
        ));
      }

      return years.sort((a, b) => b.value - a.value); // Más recientes primero
    } catch (error) {
      throw this.mapError(error);
    }
  }

  /**
   * Obtiene guía de precios para un vehículo específico
   */
  async getPriceGuide(
    request: AutocosmosPriceServiceRequest,
    options: AutocosmosPriceServiceOptions = {}
  ): Promise<PriceGuide> {
    try {
      // Primero obtenemos las marcas para mapear nombre a slug
      const brands = await this.getBrands();
      const brand = this.findBrandByName(brands, request.brand);
      
      if (!brand) {
        throw {
          code: 'INVALID_VEHICLE',
          message: `Brand not found: ${request.brand}`,
          details: { availableBrands: brands.map(b => b.name) }
        } as AutocosmosPriceServiceError;
      }

      // Obtenemos modelos para verificar que existe
      const models = await this.getModelsByBrand(brand.slug);
      const model = this.findModelByName(models, request.model);
      
      if (!model) {
        throw {
          code: 'INVALID_VEHICLE',
          message: `Model not found: ${request.model}`,
          details: { availableModels: models.map(m => m.name) }
        } as AutocosmosPriceServiceError;
      }

      // Obtenemos años para verificar que existe
      const years = await this.getYearsByModel(brand.slug, model.slug);
      const year = years.find(y => y.value === request.year);
      
      if (!year) {
        throw {
          code: 'INVALID_VEHICLE',
          message: `Year not found: ${request.year}`,
          details: { availableYears: years.map(y => y.value) }
        } as AutocosmosPriceServiceError;
      }

      // Hacemos submit del formulario para obtener precios
      const priceData = await this.fetchPriceData(brand.slug, model.slug, request.year);
      
      if (!priceData) {
        throw {
          code: 'NO_DATA_FOUND',
          message: `No price data found for ${request.brand} ${request.model} ${request.year}`,
          details: request
        } as AutocosmosPriceServiceError;
      }

      // Construimos el PriceGuide
      const priceRangeARS = new PriceRange(
        priceData.precio_minimo,
        priceData.precio_maximo,
        priceData.precio_promedio,
        'ARS',
        priceData.cantidad_muestras
      );

      const source = {
        name: 'Autocosmos',
        url: priceData.url_fuente || `${this.baseUrl}/guiadeprecios`,
        lastUpdated: new Date(priceData.fecha_actualizacion),
        reliability: 0.85 // Alta confiabilidad para Autocosmos
      };

      return new PriceGuide(
        brand,
        model,
        year,
        priceRangeARS,
        priceRangeARS, // TODO: Implementar conversión USD
        source
      );

    } catch (error) {
      throw this.mapError(error);
    }
  }

  /**
   * Busca una marca por nombre (fuzzy matching)
   */
  private findBrandByName(brands: VehicleBrand[], name: string): VehicleBrand | null {
    const normalizedName = name.toLowerCase().trim();
    
    // Búsqueda exacta
    let found = brands.find(b => b.name.toLowerCase() === normalizedName);
    if (found) return found;
    
    // Búsqueda por display name
    found = brands.find(b => b.getDisplayName().toLowerCase() === normalizedName);
    if (found) return found;
    
    // Búsqueda parcial
    found = brands.find(b => 
      b.name.toLowerCase().includes(normalizedName) ||
      normalizedName.includes(b.name.toLowerCase())
    );
    
    return found || null;
  }

  /**
   * Busca un modelo por nombre (fuzzy matching)
   */
  private findModelByName(models: VehicleModel[], name: string): VehicleModel | null {
    const normalizedName = name.toLowerCase().trim();
    
    // Búsqueda exacta
    let found = models.find(m => m.name.toLowerCase() === normalizedName);
    if (found) return found;
    
    // Búsqueda parcial
    found = models.find(m => 
      m.name.toLowerCase().includes(normalizedName) ||
      normalizedName.includes(m.name.toLowerCase())
    );
    
    return found || null;
  }

  /**
   * Obtiene datos de precios haciendo submit del formulario
   */
  private async fetchPriceData(
    brandSlug: string,
    modelSlug: string,
    year: number
  ): Promise<AutocosmosPriceResponse | null> {
    try {
      const formData = new URLSearchParams({
        'Marca': brandSlug,
        'Modelo': modelSlug,
        'A': year.toString()
      });

      const url = `${this.baseUrl}/guiadeprecios`;
      const response = await this.makeRequest<string>(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Referer': `${this.baseUrl}/guiadeprecios`
        },
        body: formData.toString()
      });

      // Parsear HTML response para extraer datos de precios
      return this.parsePriceDataFromHtml(response);
    } catch (error) {
      console.warn('Failed to fetch price data:', error);
      return null;
    }
  }

  /**
   * Parsea datos de precios desde HTML response
   */
  private parsePriceDataFromHtml(html: string): AutocosmosPriceResponse | null {
    try {
      // Implementar parsing del HTML de respuesta
      // Este es un placeholder - necesitaría implementación específica
      // basada en la estructura HTML real de Autocosmos
      
      const priceRegex = /precio.*?(\d+(?:\.\d+)?)/gi;
      const matches = html.match(priceRegex);
      
      if (!matches || matches.length < 2) return null;
      
      // Extraer números de los matches
      const prices = matches
        .map(match => {
          const num = match.match(/(\d+(?:\.\d+)?)/);
          return num ? parseFloat(num[1]) : 0;
        })
        .filter(p => p > 0)
        .sort((a, b) => a - b);
      
      if (prices.length < 2) return null;
      
      const min = prices[0];
      const max = prices[prices.length - 1];
      const avg = prices.reduce((sum, p) => sum + p, 0) / prices.length;
      
      return {
        precio_minimo: min,
        precio_maximo: max,
        precio_promedio: Math.round(avg),
        cantidad_muestras: prices.length,
        moneda: 'ARS',
        fecha_actualizacion: new Date().toISOString(),
        url_fuente: `${this.baseUrl}/guiadeprecios`
      };
    } catch (error) {
      console.warn('Failed to parse price data from HTML:', error);
      return null;
    }
  }

  // Métodos adicionales requeridos por la interfaz

  async getBulkPriceGuides(
    requests: AutocosmosPriceServiceRequest[],
    options?: AutocosmosPriceServiceOptions
  ): Promise<(PriceGuide | AutocosmosPriceServiceError)[]> {
    const results: (PriceGuide | AutocosmosPriceServiceError)[] = [];
    
    for (const request of requests) {
      try {
        const priceGuide = await this.getPriceGuide(request, options);
        results.push(priceGuide);
      } catch (error) {
        results.push(error as AutocosmosPriceServiceError);
      }
    }
    
    return results;
  }

  async isVehicleAvailable(request: AutocosmosPriceServiceRequest): Promise<boolean> {
    try {
      await this.getPriceGuide(request);
      return true;
    } catch {
      return false;
    }
  }

  async getDataAvailabilityStats(): Promise<{
    totalBrands: number;
    totalModels: number;
    totalYears: number;
    lastUpdated: Date;
  }> {
    const brands = await this.getBrands();
    
    // Para obtener estadísticas completas necesitaríamos hacer muchas requests
    // Por ahora retornamos estimaciones básicas
    return {
      totalBrands: brands.length,
      totalModels: brands.length * 15, // Estimación promedio
      totalYears: brands.length * 15 * 20, // Estimación promedio
      lastUpdated: new Date()
    };
  }
}