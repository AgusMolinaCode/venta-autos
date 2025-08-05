/**
 * Entidad de Dominio: Año de Vehículo
 * Representa un año específico disponible para un modelo
 */

export class VehicleYear {
  constructor(
    public readonly year: number,
    public readonly value: string,
    public readonly displayText: string,
    public readonly brandSlug: string,
    public readonly modelSlug: string,
    public readonly isActive: boolean = true
  ) {
    this.validateYear();
  }

  private validateYear(): void {
    const currentYear = new Date().getFullYear();
    const minYear = 1950; // Año mínimo razonable
    const maxYear = currentYear + 1; // Permitir año siguiente para modelos nuevos

    if (!Number.isInteger(this.year)) {
      throw new Error('Year must be an integer');
    }

    if (this.year < minYear || this.year > maxYear) {
      throw new Error(`Year must be between ${minYear} and ${maxYear}`);
    }

    if (!this.value || this.value.trim().length === 0) {
      throw new Error('Year value cannot be empty');
    }

    if (!this.displayText || this.displayText.trim().length === 0) {
      throw new Error('Year display text cannot be empty');
    }

    if (!this.modelSlug || this.modelSlug.trim().length === 0) {
      throw new Error('Model slug cannot be empty');
    }

    if (!this.brandSlug || this.brandSlug.trim().length === 0) {
      throw new Error('Brand slug cannot be empty');
    }
  }

  /**
   * Obtiene el texto para mostrar
   */
  getDisplayText(): string {
    return this.displayText;
  }

  /**
   * Verifica si el año está dentro de un rango específico
   */
  isInRange(minYear: number, maxYear: number): boolean {
    return this.year >= minYear && this.year <= maxYear;
  }

  /**
   * Obtiene la antigüedad del vehículo en años
   */
  getAge(): number {
    const currentYear = new Date().getFullYear();
    return Math.max(0, currentYear - this.year);
  }

  /**
   * Determina si es un vehículo nuevo (0-2 años)
   */
  isNew(): boolean {
    return this.getAge() <= 2;
  }

  /**
   * Determina si es un vehículo usado (3+ años)
   */
  isUsed(): boolean {
    return this.getAge() > 2;
  }

  /**
   * Verifica si el año es actual o reciente (últimos 3 años)
   */
  isRecent(): boolean {
    const currentYear = new Date().getFullYear();
    return this.year >= currentYear - 2;
  }

  /**
   * Verifica si el año pertenece a una marca y modelo específico
   */
  belongsTo(brandSlug: string, modelSlug: string): boolean {
    return this.brandSlug === brandSlug && this.modelSlug === modelSlug;
  }

  /**
   * Compara si dos años son iguales
   */
  equals(other: VehicleYear): boolean {
    return (
      this.year === other.year &&
      this.modelSlug === other.modelSlug &&
      this.brandSlug === other.brandSlug
    );
  }

  /**
   * Crea una instancia desde datos de API externa
   */
  static fromApiData(data: {
    year: number;
    value: string;
    displayText: string;
    brandSlug: string;
    modelSlug: string;
    isActive?: boolean;
  }): VehicleYear {
    return new VehicleYear(
      data.year,
      data.value,
      data.displayText,
      data.brandSlug,
      data.modelSlug,
      data.isActive
    );
  }

  /**
   * Serializa la entidad para persistencia
   */
  toJson(): {
    year: number;
    value: string;
    displayText: string;
    brandSlug: string;
    modelSlug: string;
    isActive: boolean;
  } {
    return {
      year: this.year,
      value: this.value,
      displayText: this.displayText,
      brandSlug: this.brandSlug,
      modelSlug: this.modelSlug,
      isActive: this.isActive
    };
  }
}