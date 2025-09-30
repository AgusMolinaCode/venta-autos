import { Dolar } from '@/utils/interfaces';

// Use our internal API route to avoid CORS issues
const DOLAR_API_URL = '/api/dolar';

export class DolarService {
  private static instance: DolarService;
  private cache: { data: Dolar; timestamp: number } | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): DolarService {
    if (!DolarService.instance) {
      DolarService.instance = new DolarService();
    }
    return DolarService.instance;
  }

  private async fetchDolarRates(): Promise<Dolar> {
    try {
      const response = await fetch(DOLAR_API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // Disable browser caching
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Dolar = await response.json();
      return data;
    } catch (error) {
      console.error('[DOLAR_SERVICE] Error fetching dolar rates:', error);
      throw new Error('Failed to fetch dolar rates');
    }
  }

  public async getDolarRates(): Promise<Dolar> {
    const now = Date.now();

    // Check if we have valid cached data
    if (this.cache && (now - this.cache.timestamp) < this.CACHE_DURATION) {
      return this.cache.data;
    }

    // Fetch fresh data
    const data = await this.fetchDolarRates();
    
    // Update cache
    this.cache = {
      data,
      timestamp: now,
    };

    return data;
  }

  public async getBlueDollarRate(): Promise<number> {
    try {
      const rates = await this.getDolarRates();
      return rates.blue.ask;
    } catch (error) {
      console.error('[DOLAR_SERVICE] Error getting blue dollar rate:', error);
      throw error;
    }
  }

  public async getOfficialDollarRate(): Promise<number> {
    try {
      const rates = await this.getDolarRates();
      return rates.oficial.price;
    } catch (error) {
      console.error('[DOLAR_SERVICE] Error getting official dollar rate:', error);
      throw error;
    }
  }

  public clearCache(): void {
    this.cache = null;
  }

  /**
   * Convert vehicle price to ARS for comparison purposes
   * ALWAYS converts USD prices to ARS to ensure proper sorting
   * @param vehicle - Vehicle with price and optional moneda field
   * @param blueDollarRate - Blue dollar rate for conversion (required for USD vehicles)
   * @returns Price in ARS
   */
  public static getConvertedPrice(vehicle: any, blueDollarRate?: number): number {
    // If vehicle has no price, return 0
    if (!vehicle.precio) return 0;

    // If price is in USD, ALWAYS convert to ARS
    if (vehicle.moneda === 'USD') {
      // Use provided rate or fallback to default
      const rate = blueDollarRate || 1000; // Fallback rate if not provided
      return vehicle.precio * rate;
    }

    // If price is already in ARS or no moneda specified, return as-is
    return vehicle.precio;
  }
}