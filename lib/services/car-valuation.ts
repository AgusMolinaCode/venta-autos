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
const FALLBACK_WEBHOOK_URL = 'https://primary-production-1e497.up.railway.app/webhook/b9c2fb0f-5b6d-407b-b19a-0561b22b98c4';

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
          console.log('✅ [CAR VALUATION] Success with scraping API');
          return result;
        }
      }

      // Fallback to webhook API if scraping fails
      console.log('⚠️ [CAR VALUATION] Scraping failed, falling back to webhook...');
      
      const webhookResponse = await fetch(FALLBACK_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!webhookResponse.ok) {
        throw new Error(`Webhook API error! status: ${webhookResponse.status}`);
      }

      const webhookResult = await webhookResponse.json();
      
      if (!Array.isArray(webhookResult) || webhookResult.length === 0) {
        throw new Error('No data available from both scraping and webhook APIs');
      }

      console.log('✅ [CAR VALUATION] Success with fallback webhook');
      return webhookResult;

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