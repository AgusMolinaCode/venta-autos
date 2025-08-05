/**
 * Tests: Autocosmos Price Reference API Route
 * Tests de integración para el endpoint de referencia de precios
 */

import { NextRequest } from 'next/server';
import { POST, GET } from '@/app/api/autocosmos-price-reference/route';

// Mock del PriceAggregatorService
jest.mock('@/lib/services/price-reference/price-aggregator.service', () => ({
  PriceAggregatorService: jest.fn().mockImplementation(() => ({
    getAggregatedPriceData: jest.fn(),
    getEnabledProviders: jest.fn().mockReturnValue(['autocosmos', 'mercadolibre']),
    getAvailableProviders: jest.fn().mockReturnValue(['autocosmos', 'mercadolibre']),
    getProviderStats: jest.fn().mockReturnValue({
      autocosmos: { reliability: 0.85, priority: 1, isEnabled: true },
      mercadolibre: { reliability: 0.75, priority: 2, isEnabled: true }
    })
  }))
}));

describe('/api/autocosmos-price-reference', () => {
  describe('POST', () => {
    it('should return price data for valid request', async () => {
      const { PriceAggregatorService } = require('@/lib/services/price-reference/price-aggregator.service');
      const mockAggregator = new PriceAggregatorService();
      
      const mockPriceData = [{
        total_vehiculos: 25,
        exchange_rate_used: '1 USD = 1000 ARS',
        search_url: 'https://autocosmos.com.ar/test',
        precios_ars_completo: {
          total: 500000000,
          min: 15000000,
          max: 25000000,
          avg: 20000000
        },
        precios_usd_completo: {
          total: 500000,
          min: 15000,
          max: 25000,
          avg: 20000
        },
        primeros_3_productos: []
      }];
      
      mockAggregator.getAggregatedPriceData.mockResolvedValue(mockPriceData);

      const request = new NextRequest('http://localhost:3000/api/autocosmos-price-reference', {
        method: 'POST',
        body: JSON.stringify({
          marca: 'Toyota',
          modelo: 'Corolla',
          ano: 2020
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(mockPriceData);
      expect(data.metadata).toBeDefined();
      expect(data.metadata.providers).toEqual(['autocosmos', 'mercadolibre']);
    });

    it('should validate required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/autocosmos-price-reference', {
        method: 'POST',
        body: JSON.stringify({
          modelo: 'Corolla',
          ano: 2020
          // marca missing
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('VALIDATION_ERROR');
      expect(data.error.details.errors).toContain('Marca is required');
    });

    it('should validate field formats', async () => {
      const request = new NextRequest('http://localhost:3000/api/autocosmos-price-reference', {
        method: 'POST',
        body: JSON.stringify({
          marca: 'Toyota',
          modelo: 'Corolla',
          ano: 'invalid-year'
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error.details.errors).toContain('Ano must be a valid number');
    });

    it('should validate year range', async () => {
      const request = new NextRequest('http://localhost:3000/api/autocosmos-price-reference', {
        method: 'POST',
        body: JSON.stringify({
          marca: 'Toyota',
          modelo: 'Corolla',
          ano: 1900 // Too old
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error.details.errors).toContain('Ano must be at least 1950');
    });

    it('should handle invalid JSON', async () => {
      const request = new NextRequest('http://localhost:3000/api/autocosmos-price-reference', {
        method: 'POST',
        body: 'invalid json',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('INVALID_REQUEST');
    });

    it('should handle service errors', async () => {
      const { PriceAggregatorService } = require('@/lib/services/price-reference/price-aggregator.service');
      const mockAggregator = new PriceAggregatorService();
      
      mockAggregator.getAggregatedPriceData.mockRejectedValue(
        new Error('Network timeout')
      );

      const request = new NextRequest('http://localhost:3000/api/autocosmos-price-reference', {
        method: 'POST',
        body: JSON.stringify({
          marca: 'Toyota',
          modelo: 'Corolla',
          ano: 2020
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(504); // Timeout error
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('TIMEOUT_ERROR');
    });

    it('should handle insufficient data error', async () => {
      const { PriceAggregatorService } = require('@/lib/services/price-reference/price-aggregator.service');
      const mockAggregator = new PriceAggregatorService();
      
      mockAggregator.getAggregatedPriceData.mockRejectedValue(
        new Error('Insufficient data: only 0 of 1 required providers responded successfully')
      );

      const request = new NextRequest('http://localhost:3000/api/autocosmos-price-reference', {
        method: 'POST',
        body: JSON.stringify({
          marca: 'Toyota',
          modelo: 'Corolla',
          ano: 2020
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data.error.code).toBe('INSUFFICIENT_DATA');
    });

    it('should respect query parameters', async () => {
      const { PriceAggregatorService } = require('@/lib/services/price-reference/price-aggregator.service');
      const mockAggregator = new PriceAggregatorService();
      
      mockAggregator.getAggregatedPriceData.mockResolvedValue([]);

      const request = new NextRequest(
        'http://localhost:3000/api/autocosmos-price-reference?providers=autocosmos&includeDetails=true&timeout=5000',
        {
          method: 'POST',
          body: JSON.stringify({
            marca: 'Toyota',
            modelo: 'Corolla',
            ano: 2020
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      await POST(request);

      expect(mockAggregator.getAggregatedPriceData).toHaveBeenCalledWith(
        { marca: 'Toyota', modelo: 'Corolla', ano: 2020 },
        {
          enabledProviders: ['autocosmos'],
          maxTimeout: 5000,
          requireMinimumProviders: 1,
          includeProviderDetails: true
        }
      );
    });
  });

  describe('GET', () => {
    it('should return API information by default', async () => {
      const request = new NextRequest('http://localhost:3000/api/autocosmos-price-reference');

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.name).toBe('Autocosmos Price Reference API');
      expect(data.data.version).toBe('1.0.0');
      expect(data.data.endpoints).toBeDefined();
      expect(data.data.providers).toEqual(['autocosmos', 'mercadolibre']);
    });

    it('should return provider information', async () => {
      const request = new NextRequest('http://localhost:3000/api/autocosmos-price-reference?action=providers');

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.available).toEqual(['autocosmos', 'mercadolibre']);
      expect(data.data.enabled).toEqual(['autocosmos', 'mercadolibre']);
      expect(data.data.stats).toBeDefined();
    });

    it('should return health status', async () => {
      const request = new NextRequest('http://localhost:3000/api/autocosmos-price-reference?action=health');

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.status).toBe('healthy');
      expect(data.data.timestamp).toBeDefined();
      expect(data.data.version).toBe('1.0.0');
    });
  });
});