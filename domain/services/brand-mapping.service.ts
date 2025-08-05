/**
 * Interfaz del Servicio de Dominio: Brand Mapping Service
 * Define el contrato para mapear marcas entre sistema local y Autocosmos
 */

import { VehicleBrand } from '../entities';

export interface BrandMapping {
  localBrand: string;        // Marca como aparece en nuestro sistema
  autocosmosBrand: string;   // Marca como aparece en Autocosmos
  autocosmosSlug: string;    // Slug de la marca en Autocosmos
  confidence: number;        // Nivel de confianza del mapeo (0-1)
  isActive: boolean;         // Si el mapeo está activo
  lastVerified: Date;        // Última vez que se verificó el mapeo
  notes?: string;            // Notas adicionales sobre el mapeo
}

export interface BrandMappingSearchResult {
  mapping: BrandMapping;
  similarity: number;        // Similaridad del match (0-1)
  source: 'exact' | 'fuzzy' | 'manual'; // Tipo de match encontrado
}

/**
 * Servicio de dominio para mapear marcas entre diferentes sistemas
 */
export interface BrandMappingService {
  /**
   * Mapea una marca local a su equivalente en Autocosmos
   */
  mapToAutocosmosBrand(localBrand: string): Promise<VehicleBrand | null>;

  /**
   * Mapea una marca de Autocosmos a su equivalente local
   */
  mapToLocalBrand(autocosmosBrand: string): Promise<string | null>;

  /**
   * Obtiene todos los mapeos disponibles
   */
  getAllMappings(): Promise<BrandMapping[]>;

  /**
   * Busca mapeos similares para una marca
   */
  searchSimilarMappings(brand: string, threshold?: number): Promise<BrandMappingSearchResult[]>;

  /**
   * Crea o actualiza un mapeo de marca
   */
  upsertMapping(mapping: Omit<BrandMapping, 'lastVerified'>): Promise<BrandMapping>;

  /**
   * Elimina un mapeo de marca
   */
  deleteMapping(localBrand: string): Promise<boolean>;

  /**
   * Verifica y actualiza todos los mapeos existentes
   */
  verifyAllMappings(): Promise<{
    verified: number;
    failed: number;
    updated: number;
  }>;

  /**
   * Sincroniza marcas locales con Autocosmos
   */
  syncWithAutocosmos(autocosmosBrands: VehicleBrand[]): Promise<{
    newMappings: BrandMapping[];
    updatedMappings: BrandMapping[];
    unmappedLocal: string[];
    unmappedAutocosmos: VehicleBrand[];
  }>;

  /**
   * Obtiene estadísticas de mapeo
   */
  getMappingStats(): Promise<{
    totalMappings: number;
    activeMappings: number;
    highConfidenceMappings: number;
    needsReview: number;
    lastSync: Date | null;
  }>;

  /**
   * Valida un mapeo específico
   */
  validateMapping(mapping: BrandMapping): Promise<{
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  }>;
}