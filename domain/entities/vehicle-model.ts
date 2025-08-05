/**
 * Entidad de Dominio: Modelo de Vehículo
 * Representa un modelo específico de vehículo asociado a una marca
 */

import { VehicleBrand } from './vehicle-brand';

export class VehicleModel {
  constructor(
    public readonly name: string,
    public readonly slug: string,
    public readonly brandSlug: string,
    public readonly displayName?: string,
    public readonly isActive: boolean = true
  ) {
    this.validateModel();
  }

  private validateModel(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Model name cannot be empty');
    }
    
    if (!this.slug || this.slug.trim().length === 0) {
      throw new Error('Model slug cannot be empty');
    }

    if (!this.brandSlug || this.brandSlug.trim().length === 0) {
      throw new Error('Brand slug cannot be empty');
    }

    // Validar formato del slug
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(this.slug)) {
      throw new Error('Model slug must be lowercase with hyphens only');
    }
  }

  /**
   * Obtiene el nombre para mostrar
   */
  getDisplayName(): string {
    return this.displayName || this.name;
  }

  /**
   * Verifica si el modelo pertenece a una marca específica
   */
  belongsToBrand(brand: VehicleBrand): boolean {
    return this.brandSlug === brand.slug;
  }

  /**
   * Compara si dos modelos son iguales
   */
  equals(other: VehicleModel): boolean {
    return this.slug === other.slug && this.brandSlug === other.brandSlug;
  }

  /**
   * Crea una instancia desde datos de API externa
   */
  static fromApiData(data: {
    name: string;
    slug: string;
    brandSlug: string;
    displayName?: string;
    isActive?: boolean;
  }): VehicleModel {
    return new VehicleModel(
      data.name,
      data.slug,
      data.brandSlug,
      data.displayName,
      data.isActive
    );
  }

  /**
   * Serializa la entidad para persistencia
   */
  toJson(): {
    name: string;
    slug: string;
    brandSlug: string;
    displayName?: string;
    isActive: boolean;
  } {
    return {
      name: this.name,
      slug: this.slug,
      brandSlug: this.brandSlug,
      isActive: this.isActive,
      ...(this.displayName && { displayName: this.displayName })
    };
  }
}