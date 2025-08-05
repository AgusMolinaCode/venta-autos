/**
 * Infrastructure: Brand Mapping Service Implementation
 * Implementación del servicio para mapear marcas entre sistema local y Autocosmos
 */

import { VehicleBrand } from '@/domain/entities';
import type {
  BrandMappingService,
  BrandMapping,
  BrandMappingSearchResult
} from '@/domain/services';

/**
 * Mapeos predefinidos entre marcas locales y Autocosmos
 * Basado en el análisis del sitio web de Autocosmos
 */
const PREDEFINED_MAPPINGS: Omit<BrandMapping, 'lastVerified'>[] = [
  // Top 5 marcas más comerciales
  {
    localBrand: 'Toyota',
    autocosmosBrand: 'TOYOTA',
    autocosmosSlug: 'toyota',
    confidence: 1.0,
    isActive: true,
    notes: 'Mapeo exacto'
  },
  {
    localBrand: 'Volkswagen',
    autocosmosBrand: 'VOLKSWAGEN',
    autocosmosSlug: 'volkswagen',
    confidence: 1.0,
    isActive: true,
    notes: 'Mapeo exacto'
  },
  {
    localBrand: 'Ford',
    autocosmosBrand: 'FORD',
    autocosmosSlug: 'ford',
    confidence: 1.0,
    isActive: true,
    notes: 'Mapeo exacto'
  },
  {
    localBrand: 'Chevrolet',
    autocosmosBrand: 'CHEVROLET',
    autocosmosSlug: 'chevrolet',
    confidence: 1.0,
    isActive: true,
    notes: 'Mapeo exacto'
  },
  {
    localBrand: 'Fiat',
    autocosmosBrand: 'FIAT',
    autocosmosSlug: 'fiat',
    confidence: 1.0,
    isActive: true,
    notes: 'Mapeo exacto'
  },
  // Otras marcas populares
  {
    localBrand: 'Mercedes-Benz',
    autocosmosBrand: 'MERCEDES BENZ',
    autocosmosSlug: 'mercedes-benz',
    confidence: 1.0,
    isActive: true,
    notes: 'Mapeo con diferencia en guión'
  },
  {
    localBrand: 'BMW',
    autocosmosBrand: 'BMW',
    autocosmosSlug: 'bmw',
    confidence: 1.0,
    isActive: true,
    notes: 'Mapeo exacto'
  },
  {
    localBrand: 'Audi',
    autocosmosBrand: 'AUDI',
    autocosmosSlug: 'audi',
    confidence: 1.0,
    isActive: true,
    notes: 'Mapeo exacto'
  },
  {
    localBrand: 'Honda',
    autocosmosBrand: 'HONDA',
    autocosmosSlug: 'honda',
    confidence: 1.0,
    isActive: true,
    notes: 'Mapeo exacto'
  },
  {
    localBrand: 'Hyundai',
    autocosmosBrand: 'HYUNDAI',
    autocosmosSlug: 'hyundai',
    confidence: 1.0,
    isActive: true,
    notes: 'Mapeo exacto'
  },
  {
    localBrand: 'Kia',
    autocosmosBrand: 'KIA',
    autocosmosSlug: 'kia',
    confidence: 1.0,
    isActive: true,
    notes: 'Mapeo exacto'
  },
  {
    localBrand: 'Nissan',
    autocosmosBrand: 'NISSAN',
    autocosmosSlug: 'nissan',
    confidence: 1.0,
    isActive: true,
    notes: 'Mapeo exacto'
  },
  {
    localBrand: 'Peugeot',
    autocosmosBrand: 'PEUGEOT',
    autocosmosSlug: 'peugeot',
    confidence: 1.0,
    isActive: true,
    notes: 'Mapeo exacto'
  },
  {
    localBrand: 'Renault',
    autocosmosBrand: 'RENAULT',
    autocosmosSlug: 'renault',
    confidence: 1.0,
    isActive: true,
    notes: 'Mapeo exacto'
  },
  {
    localBrand: 'Citroën',
    autocosmosBrand: 'CITROEN',
    autocosmosSlug: 'citroen',
    confidence: 0.95,
    isActive: true,
    notes: 'Mapeo sin acento'
  },
  // Marcas con diferencias notables
  {
    localBrand: 'Jeep',
    autocosmosBrand: 'JEEP',
    autocosmosSlug: 'jeep',
    confidence: 1.0,
    isActive: true,
    notes: 'Mapeo exacto'
  },
  {
    localBrand: 'Land Rover',
    autocosmosBrand: 'LAND ROVER',
    autocosmosSlug: 'land-rover',
    confidence: 1.0,
    isActive: true,
    notes: 'Mapeo exacto'
  },
  {
    localBrand: 'Mini',
    autocosmosBrand: 'MINI COOPER',
    autocosmosSlug: 'mini-cooper',
    confidence: 0.9,
    isActive: true,
    notes: 'Autocosmos usa "MINI COOPER"'
  },
  {
    localBrand: 'D.S.',
    autocosmosBrand: 'DS AUTOMOBILES',
    autocosmosSlug: 'ds-automobiles',
    confidence: 0.85,
    isActive: true,
    notes: 'Diferencia en denominación'
  },
  {
    localBrand: 'GWM',
    autocosmosBrand: 'GREAT WALL',
    autocosmosSlug: 'great-wall',
    confidence: 0.8,
    isActive: true,
    notes: 'GWM es Great Wall Motors'
  },
  // Marcas adicionales
  {
    localBrand: 'Alfa Romeo',
    autocosmosBrand: 'ALFA ROMEO',
    autocosmosSlug: 'alfa-romeo',
    confidence: 1.0,
    isActive: true,
    notes: 'Mapeo exacto'
  },
  {
    localBrand: 'Chery',
    autocosmosBrand: 'CHERY',
    autocosmosSlug: 'chery',
    confidence: 1.0,
    isActive: true,
    notes: 'Mapeo exacto'
  },
  {
    localBrand: 'DFSK',
    autocosmosBrand: 'DFSK',
    autocosmosSlug: 'dfsk',
    confidence: 1.0,
    isActive: true,
    notes: 'Mapeo exacto'
  },
  {
    localBrand: 'JAC',
    autocosmosBrand: 'JAC',
    autocosmosSlug: 'jac',
    confidence: 1.0,
    isActive: true,
    notes: 'Mapeo exacto'
  },
  {
    localBrand: 'Jetour',
    autocosmosBrand: 'JETOUR',
    autocosmosSlug: 'jetour',
    confidence: 1.0,
    isActive: true,
    notes: 'Mapeo exacto'
  },
  {
    localBrand: 'Lifan',
    autocosmosBrand: 'LIFAN',
    autocosmosSlug: 'lifan',
    confidence: 1.0,
    isActive: true,
    notes: 'Mapeo exacto'
  },
  {
    localBrand: 'RAM',
    autocosmosBrand: 'RAM',
    autocosmosSlug: 'ram',
    confidence: 1.0,
    isActive: true,
    notes: 'Mapeo exacto'
  },
  {
    localBrand: 'SsangYong',
    autocosmosBrand: 'SSANGYONG',
    autocosmosSlug: 'ssangyong',
    confidence: 1.0,
    isActive: true,
    notes: 'Mapeo exacto'
  },
  {
    localBrand: 'Subaru',
    autocosmosBrand: 'SUBARU',
    autocosmosSlug: 'subaru',
    confidence: 1.0,
    isActive: true,
    notes: 'Mapeo exacto'
  },
  {
    localBrand: 'Suzuki',
    autocosmosBrand: 'SUZUKI',
    autocosmosSlug: 'suzuki',
    confidence: 1.0,
    isActive: true,
    notes: 'Mapeo exacto'
  }
];

export class BrandMappingServiceImpl implements BrandMappingService {
  private mappings: Map<string, BrandMapping> = new Map();
  private reverseMappings: Map<string, BrandMapping> = new Map();

  constructor() {
    this.initializePredefinedMappings();
  }

  /**
   * Inicializa los mapeos predefinidos
   */
  private initializePredefinedMappings(): void {
    const now = new Date();
    
    for (const mapping of PREDEFINED_MAPPINGS) {
      const fullMapping: BrandMapping = {
        ...mapping,
        lastVerified: now
      };
      
      this.mappings.set(mapping.localBrand.toLowerCase(), fullMapping);
      this.reverseMappings.set(mapping.autocosmosSlug.toLowerCase(), fullMapping);
    }
  }

  async mapToAutocosmosBrand(localBrand: string): Promise<VehicleBrand | null> {
    const mapping = this.mappings.get(localBrand.toLowerCase());
    
    if (!mapping || !mapping.isActive) {
      return null;
    }

    return new VehicleBrand(
      mapping.autocosmosBrand,
      mapping.autocosmosSlug,
      mapping.autocosmosBrand
    );
  }

  async mapToLocalBrand(autocosmosBrand: string): Promise<string | null> {
    // Buscar por slug de Autocosmos
    const slugMapping = this.reverseMappings.get(autocosmosBrand.toLowerCase());
    if (slugMapping?.isActive) {
      return slugMapping.localBrand;
    }

    // Buscar por nombre de Autocosmos
    for (const mapping of this.mappings.values()) {
      if (mapping.isActive && mapping.autocosmosBrand.toLowerCase() === autocosmosBrand.toLowerCase()) {
        return mapping.localBrand;
      }
    }

    return null;
  }

  async getAllMappings(): Promise<BrandMapping[]> {
    return Array.from(this.mappings.values());
  }

  async searchSimilarMappings(brand: string, threshold = 0.7): Promise<BrandMappingSearchResult[]> {
    const results: BrandMappingSearchResult[] = [];
    const normalizedBrand = brand.toLowerCase().trim();

    for (const mapping of this.mappings.values()) {
      // Búsqueda exacta
      if (mapping.localBrand.toLowerCase() === normalizedBrand) {
        results.push({
          mapping,
          similarity: 1.0,
          source: 'exact'
        });
        continue;
      }

      if (mapping.autocosmosBrand.toLowerCase() === normalizedBrand) {
        results.push({
          mapping,
          similarity: 1.0,
          source: 'exact'
        });
        continue;
      }

      // Búsqueda fuzzy
      const localSimilarity = this.calculateSimilarity(normalizedBrand, mapping.localBrand.toLowerCase());
      const autocosmosSimilarity = this.calculateSimilarity(normalizedBrand, mapping.autocosmosBrand.toLowerCase());
      
      const maxSimilarity = Math.max(localSimilarity, autocosmosSimilarity);
      
      if (maxSimilarity >= threshold) {
        results.push({
          mapping,
          similarity: maxSimilarity,
          source: 'fuzzy'
        });
      }
    }

    return results.sort((a, b) => b.similarity - a.similarity);
  }

  /**
   * Calcula similaridad entre dos strings usando Levenshtein distance
   */
  private calculateSimilarity(a: string, b: string): number {
    const matrix = [];
    const aLen = a.length;
    const bLen = b.length;

    for (let i = 0; i <= bLen; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= aLen; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= bLen; i++) {
      for (let j = 1; j <= aLen; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    const distance = matrix[bLen][aLen];
    const maxLength = Math.max(aLen, bLen);
    
    return maxLength === 0 ? 1 : (maxLength - distance) / maxLength;
  }

  async upsertMapping(mapping: Omit<BrandMapping, 'lastVerified'>): Promise<BrandMapping> {
    const fullMapping: BrandMapping = {
      ...mapping,
      lastVerified: new Date()
    };

    this.mappings.set(mapping.localBrand.toLowerCase(), fullMapping);
    this.reverseMappings.set(mapping.autocosmosSlug.toLowerCase(), fullMapping);

    return fullMapping;
  }

  async deleteMapping(localBrand: string): Promise<boolean> {
    const mapping = this.mappings.get(localBrand.toLowerCase());
    if (!mapping) return false;

    this.mappings.delete(localBrand.toLowerCase());
    this.reverseMappings.delete(mapping.autocosmosSlug.toLowerCase());

    return true;
  }

  async verifyAllMappings(): Promise<{ verified: number; failed: number; updated: number }> {
    let verified = 0;
    let failed = 0;
    let updated = 0;

    // En una implementación real, aquí verificaríamos cada mapeo
    // contra las APIs de Autocosmos para validar que siguen siendo válidos
    
    for (const mapping of this.mappings.values()) {
      if (mapping.isActive) {
        verified++;
        // Actualizar fecha de verificación
        mapping.lastVerified = new Date();
        updated++;
      }
    }

    return { verified, failed, updated };
  }

  async syncWithAutocosmos(autocosmosBrands: VehicleBrand[]): Promise<{
    newMappings: BrandMapping[];
    updatedMappings: BrandMapping[];
    unmappedLocal: string[];
    unmappedAutocosmos: VehicleBrand[];
  }> {
    const newMappings: BrandMapping[] = [];
    const updatedMappings: BrandMapping[] = [];
    const unmappedAutocosmos: VehicleBrand[] = [];

    // Buscar marcas de Autocosmos que no tienen mapeo
    for (const autocosmoBrand of autocosmosBrands) {
      const existing = this.reverseMappings.get(autocosmoBrand.slug.toLowerCase());
      
      if (!existing) {
        // Intentar crear mapeo automático
        const autoMapping = this.createAutomaticMapping(autocosmoBrand);
        if (autoMapping) {
          newMappings.push(autoMapping);
          await this.upsertMapping(autoMapping);
        } else {
          unmappedAutocosmos.push(autocosmoBrand);
        }
      } else {
        // Actualizar mapeo existente si es necesario
        if (existing.autocosmosBrand !== autocosmoBrand.name) {
          const updated = {
            ...existing,
            autocosmosBrand: autocosmoBrand.name,
            lastVerified: new Date()
          };
          updatedMappings.push(updated);
          await this.upsertMapping(updated);
        }
      }
    }

    // Buscar marcas locales sin mapeo
    const localBrands = await this.getLocalBrands();
    const unmappedLocal = localBrands.filter(brand => 
      !this.mappings.has(brand.toLowerCase())
    );

    return {
      newMappings,
      updatedMappings,
      unmappedLocal,
      unmappedAutocosmos
    };
  }

  /**
   * Crea un mapeo automático basado en similaridad
   */
  private createAutomaticMapping(autocosmoBrand: VehicleBrand): BrandMapping | null {
    // Implementar lógica para crear mapeos automáticos
    // Por ahora retornamos null para ser conservadores
    return null;
  }

  /**
   * Obtiene lista de marcas locales desde constants
   */
  private async getLocalBrands(): Promise<string[]> {
    // En una implementación real, importaríamos desde constants
    // Por ahora usamos una lista simplificada
    return [
      'Toyota', 'Volkswagen', 'Ford', 'Chevrolet', 'Fiat',
      'Mercedes-Benz', 'BMW', 'Audi', 'Honda', 'Hyundai'
    ];
  }

  async getMappingStats(): Promise<{
    totalMappings: number;
    activeMappings: number;
    highConfidenceMappings: number;
    needsReview: number;
    lastSync: Date | null;
  }> {
    const allMappings = await this.getAllMappings();
    
    return {
      totalMappings: allMappings.length,
      activeMappings: allMappings.filter(m => m.isActive).length,
      highConfidenceMappings: allMappings.filter(m => m.confidence >= 0.9).length,
      needsReview: allMappings.filter(m => m.confidence < 0.8).length,
      lastSync: null // Implementar tracking de última sincronización
    };
  }

  async validateMapping(mapping: BrandMapping): Promise<{
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  }> {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Validar estructura básica
    if (!mapping.localBrand || mapping.localBrand.trim().length === 0) {
      issues.push('Local brand cannot be empty');
    }

    if (!mapping.autocosmosBrand || mapping.autocosmosBrand.trim().length === 0) {
      issues.push('Autocosmos brand cannot be empty');
    }

    if (!mapping.autocosmosSlug || mapping.autocosmosSlug.trim().length === 0) {
      issues.push('Autocosmos slug cannot be empty');
    }

    if (mapping.confidence < 0 || mapping.confidence > 1) {
      issues.push('Confidence must be between 0 and 1');
    }

    // Sugerencias
    if (mapping.confidence < 0.8) {
      suggestions.push('Consider reviewing this mapping - low confidence score');
    }

    if (!mapping.notes) {
      suggestions.push('Consider adding notes explaining the mapping rationale');
    }

    return {
      isValid: issues.length === 0,
      issues,
      suggestions
    };
  }
}