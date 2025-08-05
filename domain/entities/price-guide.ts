/**
 * Entidad de Dominio: Guía de Precios
 * Representa la información completa de precios para un vehículo específico
 */

import { VehicleBrand } from './vehicle-brand';
import { VehicleModel } from './vehicle-model';
import { VehicleYear } from './vehicle-year';
import { PriceRange } from '../value-objects/price-range';

export interface PriceGuideSource {
  name: string;
  url?: string;
  lastUpdated: Date;
  reliability: number; // 0-1, donde 1 es máxima confiabilidad
}

export class PriceGuide {
  constructor(
    public readonly brand: VehicleBrand,
    public readonly model: VehicleModel,
    public readonly year: VehicleYear,
    public readonly priceRangeARS: PriceRange,
    public readonly priceRangeUSD: PriceRange,
    public readonly source: PriceGuideSource,
    public readonly retrievedAt: Date = new Date(),
    public readonly notes?: string
  ) {
    this.validatePriceGuide();
  }

  private validatePriceGuide(): void {
    // Verificar que el modelo pertenece a la marca
    if (!this.model.belongsToBrand(this.brand)) {
      throw new Error('Model must belong to the specified brand');
    }

    // Verificar que el año corresponde al modelo
    if (this.year.modelSlug !== this.model.slug) {
      throw new Error('Year must correspond to the specified model');
    }

    // Verificar que tenemos al menos un rango de precios válido
    if (!this.priceRangeARS && !this.priceRangeUSD) {
      throw new Error('At least one price range (ARS or USD) must be provided');
    }

    // Verificar monedas correctas
    if (this.priceRangeARS && this.priceRangeARS.currency !== 'ARS') {
      throw new Error('ARS price range must have ARS currency');
    }

    if (this.priceRangeUSD && this.priceRangeUSD.currency !== 'USD') {
      throw new Error('USD price range must have USD currency');
    }

    // Validar source
    if (!this.source.name || this.source.name.trim().length === 0) {
      throw new Error('Source name cannot be empty');
    }

    if (this.source.reliability < 0 || this.source.reliability > 1) {
      throw new Error('Source reliability must be between 0 and 1');
    }
  }

  /**
   * Obtiene el identificador único de este vehículo
   */
  getVehicleId(): string {
    return `${this.brand.slug}-${this.model.slug}-${this.year.value}`;
  }

  /**
   * Obtiene una descripción legible del vehículo
   */
  getVehicleDescription(): string {
    return `${this.brand.getDisplayName()} ${this.model.getDisplayName()} ${this.year.value}`;
  }

  /**
   * Verifica si los datos son confiables basado en la fuente y muestras
   */
  isReliable(): boolean {
    const sourceReliable = this.source.reliability >= 0.7;
    const arsReliable = !this.priceRangeARS || this.priceRangeARS.isReliable();
    const usdReliable = !this.priceRangeUSD || this.priceRangeUSD.isReliable();
    
    return sourceReliable && arsReliable && usdReliable;
  }

  /**
   * Verifica si los datos están actualizados (menos de 7 días)
   */
  isUpToDate(): boolean {
    const weekInMs = 7 * 24 * 60 * 60 * 1000;
    const now = new Date();
    return (now.getTime() - this.source.lastUpdated.getTime()) < weekInMs;
  }

  /**
   * Obtiene la edad de los datos en días
   */
  getDataAge(): number {
    const now = new Date();
    const diffInMs = now.getTime() - this.source.lastUpdated.getTime();
    return Math.floor(diffInMs / (24 * 60 * 60 * 1000));
  }

  /**
   * Convierte precios USD a ARS usando una tasa de cambio
   */
  convertUSDToARS(exchangeRate: number): PriceRange | null {
    if (!this.priceRangeUSD) return null;
    return this.priceRangeUSD.convertToCurrency('ARS', exchangeRate);
  }

  /**
   * Convierte precios ARS a USD usando una tasa de cambio
   */
  convertARSToUSD(exchangeRate: number): PriceRange | null {
    if (!this.priceRangeARS) return null;
    return this.priceRangeARS.convertToCurrency('USD', exchangeRate);
  }

  /**
   * Compara si dos guías de precio son para el mismo vehículo
   */
  isSameVehicle(other: PriceGuide): boolean {
    return (
      this.brand.equals(other.brand) &&
      this.model.equals(other.model) &&
      this.year.equals(other.year)
    );
  }

  /**
   * Crea una instancia desde datos de API externa
   */
  static fromApiData(data: {
    brand: { name: string; slug: string; displayName?: string };
    model: { name: string; slug: string; displayName?: string };
    year: number;
    priceRangeARS?: {
      min: number;
      max: number;
      average: number;
      sampleSize?: number;
    };
    priceRangeUSD?: {
      min: number;
      max: number;
      average: number;
      sampleSize?: number;
    };
    source: {
      name: string;
      url?: string;
      lastUpdated: string | Date;
      reliability: number;
    };
    notes?: string;
  }): PriceGuide {
    const brand = VehicleBrand.fromApiData(data.brand);
    const model = VehicleModel.fromApiData({
      ...data.model,
      brandSlug: data.brand.slug
    });
    const year = VehicleYear.fromApiData({
      value: data.year,
      modelSlug: data.model.slug,
      brandSlug: data.brand.slug
    });

    const priceRangeARS = data.priceRangeARS
      ? PriceRange.fromApiData({ ...data.priceRangeARS, currency: 'ARS' })
      : null;

    const priceRangeUSD = data.priceRangeUSD
      ? PriceRange.fromApiData({ ...data.priceRangeUSD, currency: 'USD' })
      : null;

    const source: PriceGuideSource = {
      ...data.source,
      lastUpdated: typeof data.source.lastUpdated === 'string' 
        ? new Date(data.source.lastUpdated)
        : data.source.lastUpdated
    };

    return new PriceGuide(
      brand,
      model,
      year,
      priceRangeARS!,
      priceRangeUSD!,
      source,
      new Date(),
      data.notes
    );
  }

  /**
   * Serializa la entidad para persistencia
   */
  toJson(): Record<string, any> {
    return {
      brand: this.brand.toJson(),
      model: this.model.toJson(),
      year: this.year.toJson(),
      priceRangeARS: this.priceRangeARS?.toJson(),
      priceRangeUSD: this.priceRangeUSD?.toJson(),
      source: {
        ...this.source,
        lastUpdated: this.source.lastUpdated.toISOString()
      },
      retrievedAt: this.retrievedAt.toISOString(),
      notes: this.notes
    };
  }
}