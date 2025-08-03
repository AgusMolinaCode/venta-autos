import { chromium, Browser } from 'playwright';
import * as cheerio from 'cheerio';
import { generateMercadoLibreURL } from '@/utils/url-normalizer';
import { DolarService } from './dolar-service';

export interface ScrapingResult {
  total_vehiculos: number;
  exchange_rate_used: string;
  search_url: string;
  precios_ars_completo: {
    total: number;
    min: number;
    max: number;
    avg: number;
  };
  precios_usd_completo: {
    total: number;
    min: number;
    max: number;
    avg: number;
  };
  primeros_3_productos: Array<{
    name: string;
    image: string;
    url: string;
    price: number;
    priceCurrency: string;
    kilometers?: string;
    city?: string;
  }>;
}

export interface PriceStats {
  total: number;
  min: number;
  max: number;
  avg: number;
}

export class MercadoLibreScraper {
  private browser: Browser | null = null;
  private readonly defaultExchangeRate = DolarService.getInstance().getBlueDollarRate(); // Default ARS/USD rate

  constructor() {}

  /**
   * Main scraping method
   */
  async scrapeVehicleData(year: number, brand: string, model: string): Promise<ScrapingResult> {
    this.validateInput(year, brand, model);
    
    const url = generateMercadoLibreURL(year, brand, model);
    
    try {
      await this.initBrowser();
      const html = await this.fetchPageContent(url);
      return await this.parseHtml(html, url);
    } finally {
      await this.closeBrowser();
    }
  }

  /**
   * Initialize browser instance
   */
  private async initBrowser(): Promise<void> {
    if (!this.browser) {
      this.browser = await chromium.launch({
        headless: true,
        timeout: 30000,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });
    }
  }

  /**
   * Close browser instance
   */
  private async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  /**
   * Fetch page content using Playwright
   */
  private async fetchPageContent(url: string): Promise<string> {
    if (!this.browser) {
      throw new Error('Browser not initialized');
    }

    const page = await this.browser.newPage({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });

    try {
      // Set additional headers to appear more like a real browser
      await page.setExtraHTTPHeaders({
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'es-AR,es;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      });

      // Set viewport to a common resolution
      await page.setViewportSize({ width: 1366, height: 768 });

      // Navigate to the page
      await page.goto(url, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      
      // Add small delay to simulate human behavior
      await page.waitForTimeout(2000);
      
      // Try multiple selectors to find listings
      try {
        await page.waitForSelector('.ui-search-results__element, .ui-search-result, .andes-card', { timeout: 15000 });
      } catch {
        // If no listings found, still continue to get content for analysis
      }
      
      return await page.content();
    } catch (error) {
      throw new Error(`Failed to fetch page content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      await page.close();
    }
  }

  /**
   * Parse HTML content using Cheerio
   */
  private async parseHtml(html: string, searchUrl: string): Promise<ScrapingResult> {
    const $ = cheerio.load(html);
    
    // Extract all vehicle listings
    const listings: Array<{
      name: string;
      image: string;
      url: string;
      price: number;
      currency: string;
      kilometers?: string;
      city?: string;
    }> = [];

    // Use real MercadoLibre selectors based on current structure
    const listingSelectors = [
      'li.ui-search-layout__item',
      '.andes-card.poly-card',
      '.ui-search-result'
    ];
    
    let $listings = $([]);
    for (const selector of listingSelectors) {
      $listings = $(selector);
      if ($listings.length > 0) break;
    }

    $listings.each((_index, element) => {
      try {
        const $element = $(element);
        
        // Extract title from poly-component__title
        const name = $element.find('.poly-component__title, .poly-component__title a').text().trim();
        
        // Extract price and currency from andes-money-amount
        const currencySymbol = $element.find('.andes-money-amount__currency-symbol').text().trim();
        const priceText = $element.find('.andes-money-amount__fraction').text().trim();
        
        // Extract image from multiple possible locations
        let imageUrl = '';
        
        // Try different selectors for the vehicle image (ordered by priority)
        const imageSelectors = [
          '.poly-component__picture img',       // Main component image with img tag
          '.poly-component__picture',           // Main component image
          'img[src*="mlstatic"]',              // Any MercadoLibre static image  
          '.andes-carousel-snapped img',        // Carousel images
          '.poly-card__portada img',           // Card cover image
          '.ui-search-result-image__element img', // Search result image
          'img[alt*="auto"], img[alt*="coche"], img[alt*="vehiculo"]', // Generic vehicle alt text
          'img[alt*="Ford"], img[alt*="Toyota"], img[alt*="Chevrolet"]', // Vehicle brand images
          'img[width="150"]',                  // Standard vehicle image size
          'img[width="160"]'                   // Alternative image size
        ];
        
        for (const selector of imageSelectors) {
          const $img = $element.find(selector).first();
          imageUrl = $img.attr('src') || '';
          
          // Skip lazy loading placeholders and invalid images
          if (imageUrl && 
              !imageUrl.includes('data:image/gif') && 
              !imageUrl.includes('data:image/svg') &&
              !imageUrl.includes('base64') && 
              (imageUrl.includes('mlstatic') || imageUrl.startsWith('http') || imageUrl.startsWith('//'))) {
            break;
          }
        }
        
        // Extract URL from multiple possible locations based on real MercadoLibre structure
        let listingUrl = '';
        
        // Try different selectors for the vehicle URL
        const urlSelectors = [
          '.poly-component__title-wrapper a',  // Most common
          '.poly-component__title a',          // Alternative
          'a[href*="/MLA-"]',                  // Any link with MLA ID
          '.poly-component__link',             // Image link fallback
          'a[href*="auto.mercadolibre"]'       // Any auto.mercadolibre link
        ];
        
        for (const selector of urlSelectors) {
          listingUrl = $element.find(selector).first().attr('href') || '';
          if (listingUrl && listingUrl.includes('MLA-')) {
            break;
          }
        }
        
        // Clean the URL - remove tracking parameters but keep the main URL
        if (listingUrl) {
          // Remove hash and tracking parameters but keep the main URL
          listingUrl = listingUrl.split('#')[0].split('?')[0];
        }
        
        // Extract attributes (year and kilometers) from poly-attributes_list
        const attributeItems = $element.find('.poly-attributes_list__item');
        let yearText = '';
        let kilometersText = '';
        
        attributeItems.each((_i, attr) => {
          const text = $(attr).text().trim();
          if (/^\d{4}$/.test(text)) {
            yearText = text;
          } else if (text.toLowerCase().includes('km')) {
            kilometersText = text;
          }
        });
        
        // Extract location from poly-component__location
        const locationText = $element.find('.poly-component__location').text().trim();
        
        if (name && priceText) {
          const price = this.parsePrice(priceText);
          const currency = this.detectCurrency(currencySymbol || priceText);
          const kilometers = kilometersText || 'No especificado';
          const city = this.extractCity(locationText);
          
          if (price > 0) {
            // Ensure URL is properly formatted
            let finalUrl = '';
            if (listingUrl) {
              if (listingUrl.startsWith('http')) {
                finalUrl = listingUrl;
              } else if (listingUrl.startsWith('/MLA-')) {
                finalUrl = `https://auto.mercadolibre.com.ar${listingUrl}`;
              } else if (listingUrl.includes('MLA-')) {
                // Handle cases where URL might be malformed
                finalUrl = `https://auto.mercadolibre.com.ar/${listingUrl}`;
              } else {
                // Fallback to search URL if no valid listing URL found
                finalUrl = searchUrl;
              }
            } else {
              // No URL found, use search URL as fallback
              finalUrl = searchUrl;
            }
            
            
            listings.push({
              name,
              image: imageUrl,
              url: finalUrl,
              price,
              currency,
              kilometers,
              city
            });
          }
        }
      } catch (error) {
        // Skip failed listings but continue processing
        console.warn('Failed to parse listing:', error);
      }
    });

    if (listings.length === 0) {
      throw new Error('No vehicle listings found. The search may have returned no results.');
    }

    // Separate prices by currency
    const arsPrices = listings.filter(l => l.currency === 'ARS').map(l => l.price);
    const usdPrices = listings.filter(l => l.currency === 'USD').map(l => l.price);
    
    // Convert all prices to both currencies for comparison
    const exchangeRate = await this.getExchangeRate();
    const allPricesARS = [...arsPrices, ...usdPrices.map(p => p * exchangeRate)];
    const allPricesUSD = [...usdPrices, ...arsPrices.map(p => p / exchangeRate)];

    return {
      total_vehiculos: listings.length,
      exchange_rate_used: `1 USD = ${exchangeRate} ARS`,
      search_url: searchUrl,
      precios_ars_completo: this.calculatePriceStats(allPricesARS),
      precios_usd_completo: this.calculatePriceStats(allPricesUSD),
      primeros_3_productos: listings.slice(0, 3).map(listing => ({
        name: listing.name,
        image: listing.image,
        url: listing.url,
        price: listing.price,
        priceCurrency: listing.currency,
        kilometers: listing.kilometers,
        city: listing.city
      }))
    };
  }

  /**
   * Extract numeric price from text
   */
  parsePrice(priceText: string): number {
    if (!priceText) return 0;
    
    // Remove currency symbols and extract numbers
    const numericText = priceText
      .replace(/[^\d.,]/g, '')
      .replace(/\./g, '')  // Remove thousands separators (dots)
      .replace(/,/g, '');  // Remove commas
    
    const price = parseInt(numericText, 10);
    return isNaN(price) ? 0 : price;
  }

  /**
   * Detect currency from price text
   */
  detectCurrency(priceText: string): 'ARS' | 'USD' {
    const text = priceText.toUpperCase();
    
    if (text.includes('US$') || text.includes('USD') || text.includes('U$S')) {
      return 'USD';
    }
    
    return 'ARS'; // Default to ARS
  }

  /**
   * Calculate price statistics
   */
  calculatePriceStats(prices: number[]): PriceStats {
    if (prices.length === 0) {
      return { total: 0, min: 0, max: 0, avg: 0 };
    }

    const total = prices.reduce((sum, price) => sum + price, 0);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const avg = Math.round(total / prices.length);

    return { total, min, max, avg };
  }

  /**
   * Convert between currencies
   */
  convertCurrency(amount: number, fromCurrency: 'ARS' | 'USD', exchangeRate: number): number {
    if (fromCurrency === 'USD') {
      return Math.round(amount * exchangeRate); // USD to ARS
    } else {
      return Math.round(amount / exchangeRate); // ARS to USD
    }
  }

  /**
   * Extract kilometers from text
   */
  extractKilometers(text: string): string {
    if (!text) return 'No especificado';
    
    // Look for patterns like "123.456 km", "50000 Km", "kilómetros"
    const kmMatch = text.match(/(\d+(?:[.,]\d{3})*|\d+)\s*(?:km|kilómetros)/i);
    
    if (kmMatch && kmMatch[1]) {
      const kmValue = kmMatch[1];
      if (parseInt(kmValue.replace(/[.,]/g, '')) > 0) {
        return `${kmValue} km`;
      }
    }
    
    return 'No especificado';
  }

  /**
   * Extract city from location text
   */
  extractCity(locationText: string): string {
    if (!locationText || !locationText.trim()) {
      return 'No especificado';
    }
    
    // Extract city (usually the first part before comma)
    const city = locationText.split(',')[0].trim();
    return city || 'No especificado';
  }

  /**
   * Get current exchange rate from API
   */
  private async getExchangeRate(): Promise<number> {
    return await DolarService.getInstance().getBlueDollarRate();  
  }

  /**
   * Validate input parameters
   */
  validateInput(year: number, brand: string, model: string): void {
    if (!year || year < 1900 || year > 2030) {
      throw new Error('Year must be between 1900 and 2030');
    }
    
    if (!brand || !brand.trim()) {
      throw new Error('Brand is required');
    }
    
    if (!model || !model.trim()) {
      throw new Error('Model is required');
    }
  }
}