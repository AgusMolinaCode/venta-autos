/**
 * Interfaz del Servicio de Dominio: Autocosmos Price Service
 * Define el contrato para obtener datos de precios desde Autocosmos
 */

import { VehicleBrand, VehicleModel, VehicleYear, PriceGuide } from '../entities';

export interface AutocosmosPriceServiceRequest {
  brand: string;
  model: string;
  year: number;
}

export interface AutocosmosPriceServiceOptions {
  includeUSD?: boolean;
  includeARS?: boolean;
  maxAge?: number; // Máxima edad de los datos en días
  timeout?: number; // Timeout en ms
}

export interface AutocosmosPriceServiceError {
  code: 'NETWORK_ERROR' | 'INVALID_VEHICLE' | 'NO_DATA_FOUND' | 'RATE_LIMITED' | 'TIMEOUT' | 'UNKNOWN_ERROR';
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Servicio de dominio para obtener guías de precios desde Autocosmos
 */
export interface AutocosmosPriceService {
  /**
   * Obtiene todas las marcas disponibles en Autocosmos
   */
  getBrands(): Promise<VehicleBrand[]>;

  /**
   * Obtiene todos los modelos disponibles para una marca específica
   */
  getModelsByBrand(brandSlug: string): Promise<VehicleModel[]>;

  /**
   * Obtiene todos los años disponibles para un modelo específico
   */
  getYearsByModel(brandSlug: string, modelSlug: string): Promise<VehicleYear[]>;

  /**
   * Obtiene la guía de precios para un vehículo específico
   */
  getPriceGuide(
    request: AutocosmosPriceServiceRequest,
    options?: AutocosmosPriceServiceOptions
  ): Promise<PriceGuide>;

  /**
   * Obtiene múltiples guías de precios en una sola operación
   */
  getBulkPriceGuides(
    requests: AutocosmosPriceServiceRequest[],
    options?: AutocosmosPriceServiceOptions
  ): Promise<(PriceGuide | AutocosmosPriceServiceError)[]>;

  /**
   * Verifica si un vehículo específico está disponible en Autocosmos
   */
  isVehicleAvailable(request: AutocosmosPriceServiceRequest): Promise<boolean>;

  /**
   * Obtiene estadísticas de disponibilidad de datos
   */
  getDataAvailabilityStats(): Promise<{
    totalBrands: number;
    totalModels: number;
    totalYears: number;
    lastUpdated: Date;
  }>;
}