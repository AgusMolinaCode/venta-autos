/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { POST, GET } from '@/app/api/mercadolibre-scraping/route';

// Mock the MercadoLibreScraper
jest.mock('@/lib/services/mercadolibre-scraper', () => ({
  MercadoLibreScraper: jest.fn().mockImplementation(() => ({
    scrapeVehicleData: jest.fn()
  }))
}));

import { MercadoLibreScraper } from '@/lib/services/mercadolibre-scraper';

describe('/api/mercadolibre-scraping', () => {
  let mockScraper: jest.Mocked<MercadoLibreScraper>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset the constructor mock and get the instance
    const ScraperConstructor = MercadoLibreScraper as jest.MockedClass<typeof MercadoLibreScraper>;
    mockScraper = new ScraperConstructor() as jest.Mocked<MercadoLibreScraper>;
    
    // Clear rate limit map between tests
    jest.clearAllTimers();
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    jest.useRealTimers();
  });

  describe('POST', () => {
    const createRequest = (body: any, headers: Record<string, string> = {}, testId: string = 'default') => {
      return new NextRequest('http://localhost:3000/api/mercadolibre-scraping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': `192.168.1.${Math.random().toString().substr(2, 3)}`, // Unique IP per test
          ...headers
        },
        body: JSON.stringify(body)
      });
    };

    it('should return scraped data for valid request', async () => {
      const mockData = {
        total_vehiculos: 25,
        exchange_rate_used: '1 USD = 1300 ARS',
        precios_ars_completo: { total: 500000000, min: 15000000, max: 25000000, avg: 20000000 },
        precios_usd_completo: { total: 384615, min: 11538, max: 19230, avg: 15384 },
        primeros_3_productos: [
          {
            name: 'Toyota Corolla 2020',
            image: 'http://example.com/image.jpg',
            url: 'http://example.com/listing',
            price: 18000000,
            priceCurrency: 'ARS',
            kilometers: '50.000 km',
            city: 'Buenos Aires'
          }
        ]
      };

      mockScraper.scrapeVehicleData.mockResolvedValue(mockData);

      const request = createRequest({
        ano: 2020,
        marca: 'Toyota',
        modelo: 'Corolla'
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([mockData]);
      expect(mockScraper.scrapeVehicleData).toHaveBeenCalledWith(2020, 'Toyota', 'Corolla');
    });

    it('should validate request parameters', async () => {
      const testCases = [
        { body: {}, expectedError: 'Datos de entrada inválidos' },
        { body: { ano: 1800, marca: 'Toyota', modelo: 'Corolla' }, expectedError: 'Datos de entrada inválidos' },
        { body: { ano: 2050, marca: 'Toyota', modelo: 'Corolla' }, expectedError: 'Datos de entrada inválidos' },
        { body: { ano: 2020, marca: '', modelo: 'Corolla' }, expectedError: 'Datos de entrada inválidos' },
        { body: { ano: 2020, marca: 'Toyota', modelo: '' }, expectedError: 'Datos de entrada inválidos' },
      ];

      for (const testCase of testCases) {
        const request = createRequest(testCase.body);
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe(testCase.expectedError);
        expect(data.code).toBe('VALIDATION_ERROR');
      }
    });

    it('should handle rate limiting', async () => {
      const request1 = createRequest({ ano: 2020, marca: 'Toyota', modelo: 'Corolla' }, { 'x-forwarded-for': '192.168.1.1' });
      const request2 = createRequest({ ano: 2020, marca: 'Honda', modelo: 'Civic' }, { 'x-forwarded-for': '192.168.1.1' });
      const request3 = createRequest({ ano: 2020, marca: 'Ford', modelo: 'Focus' }, { 'x-forwarded-for': '192.168.1.1' });
      const request4 = createRequest({ ano: 2020, marca: 'BMW', modelo: 'X3' }, { 'x-forwarded-for': '192.168.1.1' });
      const request5 = createRequest({ ano: 2020, marca: 'Audi', modelo: 'A3' }, { 'x-forwarded-for': '192.168.1.1' });
      const request6 = createRequest({ ano: 2020, marca: 'Mercedes', modelo: 'Clase A' }, { 'x-forwarded-for': '192.168.1.1' });

      // Mock successful responses for first 5 requests
      mockScraper.scrapeVehicleData.mockResolvedValue({
        total_vehiculos: 1,
        exchange_rate_used: '1 USD = 1300 ARS',
        precios_ars_completo: { total: 0, min: 0, max: 0, avg: 0 },
        precios_usd_completo: { total: 0, min: 0, max: 0, avg: 0 },
        primeros_3_productos: []
      });

      // First 5 requests should succeed
      await POST(request1);
      await POST(request2);
      await POST(request3);
      await POST(request4);
      await POST(request5);

      // 6th request should be rate limited
      const response = await POST(request6);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.error).toContain('Límite de solicitudes excedido');
      expect(data.code).toBe('RATE_LIMIT_EXCEEDED');
    });

    it('should handle scraping errors', async () => {
      mockScraper.scrapeVehicleData.mockRejectedValue(new Error('No vehicle listings found'));

      const request = createRequest({
        ano: 2020,
        marca: 'Toyota',
        modelo: 'Corolla'
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toContain('No se encontraron vehículos');
      expect(data.code).toBe('NO_RESULTS_FOUND');
    });

    it('should handle timeout errors', async () => {
      mockScraper.scrapeVehicleData.mockRejectedValue(new Error('timeout'));

      const request = createRequest({
        ano: 2020,
        marca: 'Toyota',
        modelo: 'Corolla'
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(504);
      expect(data.error).toContain('Tiempo de espera agotado');
      expect(data.code).toBe('TIMEOUT_ERROR');
    });

    it('should handle fetch errors', async () => {
      mockScraper.scrapeVehicleData.mockRejectedValue(new Error('Failed to fetch page content'));

      const request = createRequest({
        ano: 2020,
        marca: 'Toyota',
        modelo: 'Corolla'
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(502);
      expect(data.error).toContain('Error al acceder al sitio web');
      expect(data.code).toBe('SCRAPING_ERROR');
    });

    it('should handle generic errors', async () => {
      mockScraper.scrapeVehicleData.mockRejectedValue(new Error('Some unexpected error'));

      const request = createRequest({
        ano: 2020,
        marca: 'Toyota',
        modelo: 'Corolla'
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Error interno del servidor');
      expect(data.code).toBe('INTERNAL_ERROR');
    });

    it('should include execution time in headers', async () => {
      mockScraper.scrapeVehicleData.mockResolvedValue({
        total_vehiculos: 1,
        exchange_rate_used: '1 USD = 1300 ARS',
        precios_ars_completo: { total: 0, min: 0, max: 0, avg: 0 },
        precios_usd_completo: { total: 0, min: 0, max: 0, avg: 0 },
        primeros_3_productos: []
      });

      const request = createRequest({
        ano: 2020,
        marca: 'Toyota',
        modelo: 'Corolla'
      });

      const response = await POST(request);

      expect(response.headers.get('X-Execution-Time')).toBeTruthy();
      expect(response.headers.get('X-Data-Source')).toBe('mercadolibre-scraping');
      expect(response.headers.get('Cache-Control')).toContain('max-age=300');
    });
  });

  describe('GET', () => {
    it('should return API documentation', async () => {
      const request = new NextRequest('http://localhost:3000/api/mercadolibre-scraping');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('MercadoLibre Scraping API');
      expect(data.usage).toBeDefined();
      expect(data.rateLimit).toBeDefined();
      expect(data.caching).toBeDefined();
    });

    it('should include test example when query params provided', async () => {
      const request = new NextRequest('http://localhost:3000/api/mercadolibre-scraping?marca=Toyota&modelo=Corolla&ano=2020');
      const response = await GET(request);
      const data = await response.json();

      expect(data.testExample).toBeDefined();
      expect(data.testExample.testPayload).toEqual({
        ano: 2020,
        marca: 'Toyota',
        modelo: 'Corolla'
      });
    });
  });
});