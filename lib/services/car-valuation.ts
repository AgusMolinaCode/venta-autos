export interface CarValuationRequest {
  ano: number;
  marca: string;
  modelo: string;
}

export interface Vehicle {
  name: string;
  image: string;
  url: string;
  price: number;
  priceCurrency: string;
  kilometers?: string;
  city?: string;
}

export interface PriceData {
  total: number;
  min: number;
  max: number;
  avg: number;
}

export interface CarValuationResponse {
  total_vehiculos: number;
  exchange_rate_used: string;
  search_url?: string;
  precios_ars_completo: PriceData;
  precios_usd_completo: PriceData;
  primeros_3_productos: Vehicle[];
}

const SCRAPING_API_URL = '/api/mercadolibre-scraping';

export class CarValuationService {
  static async getCarValuation(data: CarValuationRequest): Promise<CarValuationResponse[]> {
    try {
      // Try scraping API first
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const scrapingUrl = `${baseUrl}${SCRAPING_API_URL}`;
      
      const scrapingResponse = await fetch(scrapingUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (scrapingResponse.ok) {
        const result = await scrapingResponse.json();
        if (Array.isArray(result) && result.length > 0) {
          return result;
        }
      }

      // If scraping fails, throw error
      throw new Error('No data available from scraping API');

    } catch (error) {
      console.error('❌ [CAR VALUATION] Error fetching car valuation:', error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Failed to fetch car valuation data');
    }
  }

  static formatPrice(price: number, currency: 'ARS' | 'USD'): string {
    const formatter = new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    
    return formatter.format(price);
  }

  static formatExchangeRate(exchangeRate: string): string {
    return exchangeRate.replace('USD', 'US$').replace('ARS', '$');
  }
}