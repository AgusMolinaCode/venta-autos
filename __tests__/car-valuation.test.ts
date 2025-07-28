import { CarValuationService } from '@/lib/services/car-valuation';

// Mock fetch
global.fetch = jest.fn();

describe('CarValuationService', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  const mockResponse = [
    {
      total_vehiculos: 48,
      exchange_rate_used: "1 USD = 1300 ARS",
      precios_ars_completo: {
        total: 728776000,
        min: 11750000,
        max: 20670000,
        avg: 15182833
      },
      precios_usd_completo: {
        total: 560597,
        min: 9038,
        max: 15900,
        avg: 11679
      },
      primeros_3_productos: [
        {
          name: "Peugeot 208 Allure Touchscreen 2015 1.6 Vti Smart Garage",
          image: "http://example.com/image1.jpg",
          url: "https://example.com/car1",
          price: 10800,
          priceCurrency: "USD"
        }
      ]
    }
  ];

  describe('getCarValuation', () => {
    it('should successfully fetch car valuation data', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const request = {
        ano: 2015,
        marca: "Peugeot",
        modelo: "208"
      };

      const result = await CarValuationService.getCarValuation(request);

      expect(fetch).toHaveBeenCalledWith(
        'https://primary-production-1e497.up.railway.app/webhook/b9c2fb0f-5b6d-407b-b19a-0561b22b98c4',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it('should throw error when API returns error status', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
      });

      const request = {
        ano: 2015,
        marca: "Peugeot",
        modelo: "208"
      };

      await expect(CarValuationService.getCarValuation(request))
        .rejects
        .toThrow('HTTP error! status: 400');
    });

    it('should throw error when fetch fails', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const request = {
        ano: 2015,
        marca: "Peugeot",
        modelo: "208"
      };

      await expect(CarValuationService.getCarValuation(request))
        .rejects
        .toThrow('Failed to fetch car valuation data');
    });
  });

  describe('formatPrice', () => {
    it('should format ARS prices correctly', () => {
      const result = CarValuationService.formatPrice(15182833, 'ARS');
      expect(result).toMatch(/\$\s?15\.182\.833/);
    });

    it('should format USD prices correctly', () => {
      const result = CarValuationService.formatPrice(11679, 'USD');
      expect(result).toMatch(/US\$\s?11\.679/);
    });
  });

  describe('formatExchangeRate', () => {
    it('should format exchange rate correctly', () => {
      const result = CarValuationService.formatExchangeRate("1 USD = 1300 ARS");
      expect(result).toBe("1 US$ = 1300 $");
    });
  });
});