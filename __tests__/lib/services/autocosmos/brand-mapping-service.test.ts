/**
 * Tests: Brand Mapping Service
 * Tests unitarios para el servicio de mapeo de marcas
 */

import { BrandMappingServiceImpl } from '@/lib/services/autocosmos/brand-mapping-service';
import { VehicleBrand } from '@/domain/entities/vehicle-brand';

describe('BrandMappingServiceImpl', () => {
  let service: BrandMappingServiceImpl;

  beforeEach(() => {
    service = new BrandMappingServiceImpl();
  });

  describe('mapToAutocosmosBrand', () => {
    it('should map Toyota correctly', async () => {
      const result = await service.mapToAutocosmosBrand('Toyota');
      
      expect(result).not.toBeNull();
      expect(result?.name).toBe('TOYOTA');
      expect(result?.slug).toBe('toyota');
    });

    it('should map Mercedes-Benz correctly', async () => {
      const result = await service.mapToAutocosmosBrand('Mercedes-Benz');
      
      expect(result).not.toBeNull();
      expect(result?.name).toBe('MERCEDES BENZ');
      expect(result?.slug).toBe('mercedes-benz');
    });

    it('should return null for unmapped brand', async () => {
      const result = await service.mapToAutocosmosBrand('UnknownBrand');
      
      expect(result).toBeNull();
    });

    it('should be case insensitive', async () => {
      const result = await service.mapToAutocosmosBrand('TOYOTA');
      
      expect(result).not.toBeNull();
      expect(result?.slug).toBe('toyota');
    });
  });

  describe('mapToLocalBrand', () => {
    it('should map by Autocosmos slug', async () => {
      const result = await service.mapToLocalBrand('toyota');
      
      expect(result).toBe('Toyota');
    });

    it('should map by Autocosmos brand name', async () => {
      const result = await service.mapToLocalBrand('TOYOTA');
      
      expect(result).toBe('Toyota');
    });

    it('should return null for unmapped brand', async () => {
      const result = await service.mapToLocalBrand('unknown-brand');
      
      expect(result).toBeNull();
    });
  });

  describe('searchSimilarMappings', () => {
    it('should find exact matches with highest similarity', async () => {
      const results = await service.searchSimilarMappings('Toyota');
      
      expect(results).toHaveLength(1);
      expect(results[0].similarity).toBe(1.0);
      expect(results[0].source).toBe('exact');
      expect(results[0].mapping.localBrand).toBe('Toyota');
    });

    it('should find fuzzy matches', async () => {
      const results = await service.searchSimilarMappings('Toyot', 0.8);
      
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].similarity).toBeGreaterThan(0.8);
      expect(results[0].source).toBe('fuzzy');
    });

    it('should respect similarity threshold', async () => {
      const results = await service.searchSimilarMappings('XYZ', 0.9);
      
      expect(results).toHaveLength(0);
    });

    it('should sort results by similarity descending', async () => {
      const results = await service.searchSimilarMappings('Toy', 0.3);
      
      for (let i = 1; i < results.length; i++) {
        expect(results[i].similarity).toBeLessThanOrEqual(results[i - 1].similarity);
      }
    });
  });

  describe('getAllMappings', () => {
    it('should return all predefined mappings', async () => {
      const mappings = await service.getAllMappings();
      
      expect(mappings.length).toBeGreaterThan(20); // Tenemos muchos mapeos predefinidos
      
      const toyotaMapping = mappings.find(m => m.localBrand === 'Toyota');
      expect(toyotaMapping).toBeDefined();
      expect(toyotaMapping?.autocosmosSlug).toBe('toyota');
    });

    it('should include confidence scores', async () => {
      const mappings = await service.getAllMappings();
      
      for (const mapping of mappings) {
        expect(mapping.confidence).toBeGreaterThan(0);
        expect(mapping.confidence).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('upsertMapping', () => {
    it('should add new mapping', async () => {
      const newMapping = {
        localBrand: 'TestBrand',
        autocosmosBrand: 'TEST BRAND',
        autocosmosSlug: 'test-brand',
        confidence: 0.9,
        isActive: true,
        notes: 'Test mapping'
      };

      const result = await service.upsertMapping(newMapping);
      
      expect(result.localBrand).toBe('TestBrand');
      expect(result.lastVerified).toBeInstanceOf(Date);
      
      // Verificar que se puede encontrar
      const found = await service.mapToAutocosmosBrand('TestBrand');
      expect(found?.slug).toBe('test-brand');
    });

    it('should update existing mapping', async () => {
      const updatedMapping = {
        localBrand: 'Toyota',
        autocosmosBrand: 'TOYOTA UPDATED',
        autocosmosSlug: 'toyota',
        confidence: 0.95,
        isActive: true,
        notes: 'Updated mapping'
      };

      await service.upsertMapping(updatedMapping);
      
      const result = await service.mapToAutocosmosBrand('Toyota');
      expect(result?.name).toBe('TOYOTA UPDATED');
    });
  });

  describe('deleteMapping', () => {
    it('should delete existing mapping', async () => {
      const result = await service.deleteMapping('Toyota');
      
      expect(result).toBe(true);
      
      const found = await service.mapToAutocosmosBrand('Toyota');
      expect(found).toBeNull();
    });

    it('should return false for non-existent mapping', async () => {
      const result = await service.deleteMapping('NonExistentBrand');
      
      expect(result).toBe(false);
    });
  });

  describe('getMappingStats', () => {
    it('should return correct statistics', async () => {
      const stats = await service.getMappingStats();
      
      expect(stats.totalMappings).toBeGreaterThan(0);
      expect(stats.activeMappings).toBeLessThanOrEqual(stats.totalMappings);
      expect(stats.highConfidenceMappings).toBeLessThanOrEqual(stats.totalMappings);
      expect(stats.needsReview).toBeLessThanOrEqual(stats.totalMappings);
    });
  });

  describe('validateMapping', () => {
    it('should validate correct mapping', async () => {
      const validMapping = {
        localBrand: 'Toyota',
        autocosmosBrand: 'TOYOTA',
        autocosmosSlug: 'toyota',
        confidence: 0.9,
        isActive: true,
        notes: 'Valid mapping',
        lastVerified: new Date()
      };

      const result = await service.validateMapping(validMapping);
      
      expect(result.isValid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it('should detect invalid mapping', async () => {
      const invalidMapping = {
        localBrand: '',
        autocosmosBrand: 'TOYOTA',
        autocosmosSlug: 'toyota',
        confidence: 1.5, // Invalid confidence
        isActive: true,
        notes: '',
        lastVerified: new Date()
      };

      const result = await service.validateMapping(invalidMapping);
      
      expect(result.isValid).toBe(false);
      expect(result.issues.length).toBeGreaterThan(0);
      expect(result.issues).toContain('Local brand cannot be empty');
      expect(result.issues).toContain('Confidence must be between 0 and 1');
    });

    it('should provide suggestions for low confidence', async () => {
      const lowConfidenceMapping = {
        localBrand: 'Toyota',
        autocosmosBrand: 'TOYOTA',
        autocosmosSlug: 'toyota',
        confidence: 0.5, // Low confidence
        isActive: true,
        notes: '',
        lastVerified: new Date()
      };

      const result = await service.validateMapping(lowConfidenceMapping);
      
      expect(result.suggestions.length).toBeGreaterThan(0);
      expect(result.suggestions).toContain('Consider reviewing this mapping - low confidence score');
    });
  });

  describe('syncWithAutocosmos', () => {
    it('should sync with Autocosmos brands', async () => {
      const autocosmosBrands = [
        new VehicleBrand('TOYOTA', 'toyota'),
        new VehicleBrand('NEW BRAND', 'new-brand')
      ];

      const result = await service.syncWithAutocosmos(autocosmosBrands);
      
      expect(result.unmappedAutocosmos).toContain(
        expect.objectContaining({ slug: 'new-brand' })
      );
    });
  });
});