/**
 * Entidad de Dominio: Marca de Vehículo
 * Representa una marca de vehículo con su nombre display y slug para APIs
 */

export class VehicleBrand {
  constructor(
    public readonly name: string,
    public readonly slug: string,
    public readonly displayName?: string
  ) {
    this.validateBrand();
  }

  private validateBrand(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Brand name cannot be empty');
    }
    
    if (!this.slug || this.slug.trim().length === 0) {
      throw new Error('Brand slug cannot be empty');
    }

    // Validar formato del slug (solo lowercase, guiones, números)
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(this.slug)) {
      throw new Error('Brand slug must be lowercase with hyphens only');
    }
  }

  /**
   * Obtiene el nombre para mostrar, con fallback al name original
   */
  getDisplayName(): string {
    return this.displayName || this.name;
  }

  /**
   * Compara si dos marcas son iguales basado en el slug
   */
  equals(other: VehicleBrand): boolean {
    return this.slug === other.slug;
  }

  /**
   * Crea una instancia desde datos de API externa
   */
  static fromApiData(data: { name: string; slug: string; displayName?: string }): VehicleBrand {
    return new VehicleBrand(data.name, data.slug, data.displayName);
  }

  /**
   * Serializa la entidad para persistencia
   */
  toJson(): {
    name: string;
    slug: string;
    displayName?: string;
  } {
    return {
      name: this.name,
      slug: this.slug,
      ...(this.displayName && { displayName: this.displayName })
    };
  }
}