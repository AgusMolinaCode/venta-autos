/**
 * Tests: Autocosmos Models API Route
 * Tests de integración para el endpoint de modelos por marca
 */

import { NextRequest } from 'next/server';
import { GET } from '@/app/api/autocosmos/models/[brand]/route';

// Mock de AutocosmosService
jest.mock('@/lib/services/autocosmos/autocosmos-service', () => ({
  AutocosmosService: jest.fn().mockImplementation(() => ({
    getModelsByBrand: jest.fn()
  }))
}));

// Mock de BrandMappingServiceImpl
jest.mock('@/lib/services/autocosmos/brand-mapping-service', () => ({
  BrandMappingServiceImpl: jest.fn().mockImplementation(() => ({
    mapToAutocosmosBrand: jest.fn(),
    getAllMappings: jest.fn().mockResolvedValue([])
  }))
}));

describe('/api/autocosmos/models/[brand]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return models for valid brand', async () => {
      const { AutocosmosService } = require('@/lib/services/autocosmos/autocosmos-service');
      const { BrandMappingServiceImpl } = require('@/lib/services/autocosmos/brand-mapping-service');
      
      const mockService = new AutocosmosService();
      const mockMapping = new BrandMappingServiceImpl();

      // Mock brand mapping
      mockMapping.mapToAutocosmosBrand.mockResolvedValue({
        name: 'TOYOTA',
        slug: 'toyota'
      });

      // Mock models response
      const mockModels = [{
        name: 'Corolla',
        slug: 'corolla',
        brandSlug: 'toyota',
        displayName: 'Toyota Corolla',
        isActive: true,
        toJson: () => ({
          name: 'Corolla',
          slug: 'corolla',
          brandSlug: 'toyota',
          displayName: 'Toyota Corolla',
          isActive: true
        })
      }];

      mockService.getModelsByBrand.mockResolvedValue(mockModels);

      const request = new NextRequest('http://localhost:3000/api/autocosmos/models/Toyota');
      const response = await GET(request, { params: { brand: 'Toyota' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(1);
      expect(data.data[0].name).toBe('Corolla');
      expect(data.metadata.brand.local).toBe('Toyota');
    });

    it('should handle missing brand parameter', async () => {
      const request = new NextRequest('http://localhost:3000/api/autocosmos/models/');
      const response = await GET(request, { params: { brand: '' } });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('VALIDATION_ERROR');
    });

    it('should handle unmapped brand', async () => {
      const { BrandMappingServiceImpl } = require('@/lib/services/autocosmos/brand-mapping-service');
      const mockMapping = new BrandMappingServiceImpl();

      mockMapping.mapToAutocosmosBrand.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/autocosmos/models/UnknownBrand');
      const response = await GET(request, { params: { brand: 'UnknownBrand' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('BRAND_NOT_MAPPED');
    });

    it('should handle service errors', async () => {
      const { AutocosmosService } = require('@/lib/services/autocosmos/autocosmos-service');
      const { BrandMappingServiceImpl } = require('@/lib/services/autocosmos/brand-mapping-service');
      
      const mockService = new AutocosmosService();
      const mockMapping = new BrandMappingServiceImpl();

      mockMapping.mapToAutocosmosBrand.mockResolvedValue({
        name: 'TOYOTA',
        slug: 'toyota'
      });

      mockService.getModelsByBrand.mockRejectedValue(new Error('Network timeout'));

      const request = new NextRequest('http://localhost:3000/api/autocosmos/models/Toyota');
      const response = await GET(request, { params: { brand: 'Toyota' } });
      const data = await response.json();

      expect(response.status).toBe(504);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('TIMEOUT_ERROR');
    });
  });
});