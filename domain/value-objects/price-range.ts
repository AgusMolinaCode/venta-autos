/**
 * Value Object: Rango de Precios
 * Representa un rango de precios con moneda y estadísticas
 */

export type Currency = 'ARS' | 'USD';

export class PriceRange {
  constructor(
    public readonly min: number,
    public readonly max: number,
    public readonly average: number,
    public readonly currency: Currency,
    public readonly sampleSize: number = 0
  ) {
    this.validatePriceRange();
  }

  private validatePriceRange(): void {
    if (this.min < 0) {
      throw new Error('Minimum price cannot be negative');
    }

    if (this.max < 0) {
      throw new Error('Maximum price cannot be negative');
    }

    if (this.min > this.max) {
      throw new Error('Minimum price cannot be greater than maximum price');
    }

    if (this.average < this.min || this.average > this.max) {
      throw new Error('Average price must be within min and max range');
    }

    if (this.sampleSize < 0) {
      throw new Error('Sample size cannot be negative');
    }

    if (!['ARS', 'USD'].includes(this.currency)) {
      throw new Error('Currency must be ARS or USD');
    }
  }

  /**
   * Calcula el spread del rango de precios
   */
  getSpread(): number {
    return this.max - this.min;
  }

  /**
   * Calcula el spread como porcentaje del precio promedio
   */
  getSpreadPercentage(): number {
    if (this.average === 0) return 0;
    return (this.getSpread() / this.average) * 100;
  }

  /**
   * Verifica si un precio está dentro del rango
   */
  contains(price: number): boolean {
    return price >= this.min && price <= this.max;
  }

  /**
   * Verifica si el rango tiene datos suficientes para ser confiable
   */
  isReliable(): boolean {
    return this.sampleSize >= 3; // Mínimo 3 muestras para ser confiable
  }

  /**
   * Convierte el precio a otra moneda usando una tasa de cambio
   */
  convertToCurrency(targetCurrency: Currency, exchangeRate: number): PriceRange {
    if (this.currency === targetCurrency) {
      return this;
    }

    const factor = this.currency === 'USD' ? exchangeRate : 1 / exchangeRate;

    return new PriceRange(
      Math.round(this.min * factor),
      Math.round(this.max * factor),
      Math.round(this.average * factor),
      targetCurrency,
      this.sampleSize
    );
  }

  /**
   * Formatea el precio con la moneda correspondiente
   */
  formatPrice(price: number): string {
    const formatter = new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: this.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    
    return formatter.format(price);
  }

  /**
   * Obtiene una representación legible del rango
   */
  toString(): string {
    return `${this.formatPrice(this.min)} - ${this.formatPrice(this.max)} (Promedio: ${this.formatPrice(this.average)})`;
  }

  /**
   * Compara si dos rangos de precio son iguales
   */
  equals(other: PriceRange): boolean {
    return (
      this.min === other.min &&
      this.max === other.max &&
      this.average === other.average &&
      this.currency === other.currency &&
      this.sampleSize === other.sampleSize
    );
  }

  /**
   * Crea una instancia desde datos de API externa
   */
  static fromApiData(data: {
    min: number;
    max: number;
    average: number;
    currency: Currency;
    sampleSize?: number;
  }): PriceRange {
    return new PriceRange(
      data.min,
      data.max,
      data.average,
      data.currency,
      data.sampleSize || 0
    );
  }

  /**
   * Serializa el value object para persistencia
   */
  toJson(): {
    min: number;
    max: number;
    average: number;
    currency: Currency;
    sampleSize: number;
  } {
    return {
      min: this.min,
      max: this.max,
      average: this.average,
      currency: this.currency,
      sampleSize: this.sampleSize
    };
  }
}