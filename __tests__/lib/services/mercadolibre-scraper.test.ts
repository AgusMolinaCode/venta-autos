import { MercadoLibreScraper } from '@/lib/services/mercadolibre-scraper';

// Mock cheerio
jest.mock('cheerio', () => ({
  load: jest.fn()
}));

// Mock playwright
jest.mock('playwright', () => ({
  chromium: {
    launch: jest.fn()
  }
}));

describe('MercadoLibreScraper', () => {
  let scraper: MercadoLibreScraper;

  beforeEach(() => {
    scraper = new MercadoLibreScraper();
    jest.clearAllMocks();
  });

  describe('parsePrice', () => {
    it('should extract numeric price from ARS format', () => {
      expect(scraper.parsePrice('$ 15.000.000')).toBe(15000000);
      expect(scraper.parsePrice('$15.000.000')).toBe(15000000);
      expect(scraper.parsePrice('ARS 15.000.000')).toBe(15000000);
    });

    it('should extract numeric price from USD format', () => {
      expect(scraper.parsePrice('US$ 12.000')).toBe(12000);
      expect(scraper.parsePrice('USD 12.000')).toBe(12000);
      expect(scraper.parsePrice('U$S 12.000')).toBe(12000);
    });

    it('should handle prices with commas', () => {
      expect(scraper.parsePrice('$ 1,500,000')).toBe(1500000);
      expect(scraper.parsePrice('US$ 12,500')).toBe(12500);
    });

    it('should return 0 for invalid prices', () => {
      expect(scraper.parsePrice('')).toBe(0);
      expect(scraper.parsePrice('No price')).toBe(0);
      expect(scraper.parsePrice('abc')).toBe(0);
    });
  });

  describe('detectCurrency', () => {
    it('should detect ARS currency', () => {
      expect(scraper.detectCurrency('$ 15.000.000')).toBe('ARS');
      expect(scraper.detectCurrency('ARS 15.000.000')).toBe('ARS');
      expect(scraper.detectCurrency('$15.000.000')).toBe('ARS');
    });

    it('should detect USD currency', () => {
      expect(scraper.detectCurrency('US$ 12.000')).toBe('USD');
      expect(scraper.detectCurrency('USD 12.000')).toBe('USD');
      expect(scraper.detectCurrency('U$S 12.000')).toBe('USD');
    });

    it('should default to ARS for unknown formats', () => {
      expect(scraper.detectCurrency('15.000.000')).toBe('ARS');
      expect(scraper.detectCurrency('')).toBe('ARS');
    });
  });

  describe('calculatePriceStats', () => {
    it('should calculate min, max, avg for prices', () => {
      const prices = [10000, 15000, 20000, 25000, 30000];
      const stats = scraper.calculatePriceStats(prices);
      
      expect(stats.min).toBe(10000);
      expect(stats.max).toBe(30000);
      expect(stats.avg).toBe(20000);
      expect(stats.total).toBe(100000);
    });

    it('should handle single price', () => {
      const prices = [15000];
      const stats = scraper.calculatePriceStats(prices);
      
      expect(stats.min).toBe(15000);
      expect(stats.max).toBe(15000);
      expect(stats.avg).toBe(15000);
      expect(stats.total).toBe(15000);
    });

    it('should handle empty array', () => {
      const prices: number[] = [];
      const stats = scraper.calculatePriceStats(prices);
      
      expect(stats.min).toBe(0);
      expect(stats.max).toBe(0);
      expect(stats.avg).toBe(0);
      expect(stats.total).toBe(0);
    });

    it('should round average to nearest integer', () => {
      const prices = [10000, 10000, 10001];
      const stats = scraper.calculatePriceStats(prices);
      
      expect(stats.avg).toBe(10000); // 10000.33 rounded to 10000
    });
  });

  describe('convertCurrency', () => {
    it('should convert ARS to USD using exchange rate', () => {
      const result = scraper.convertCurrency(1300000, 'ARS', 1300);
      expect(result).toBe(1000);
    });

    it('should convert USD to ARS using exchange rate', () => {
      const result = scraper.convertCurrency(1000, 'USD', 1300);
      expect(result).toBe(1300000);
    });

    it('should return same amount for same currency', () => {
      expect(scraper.convertCurrency(1000, 'USD', 1300)).toBe(1300000);
      expect(scraper.convertCurrency(1300000, 'ARS', 1300)).toBe(1000);
    });

    it('should handle zero amounts', () => {
      expect(scraper.convertCurrency(0, 'ARS', 1300)).toBe(0);
      expect(scraper.convertCurrency(0, 'USD', 1300)).toBe(0);
    });
  });

  describe('extractKilometers', () => {
    it('should extract kilometers from text', () => {
      expect(scraper.extractKilometers('123.456 km')).toBe('123.456 km');
      expect(scraper.extractKilometers('50.000 kilómetros')).toBe('50.000 km');
      expect(scraper.extractKilometers('75000 Km')).toBe('75000 km');
    });

    it('should return "No especificado" for missing kilometers', () => {
      expect(scraper.extractKilometers('')).toBe('No especificado');
      expect(scraper.extractKilometers('Sin kilometraje')).toBe('No especificado');
      expect(scraper.extractKilometers('0 km')).toBe('No especificado');
    });
  });

  describe('extractCity', () => {
    it('should extract city from location text', () => {
      expect(scraper.extractCity('Buenos Aires, Capital Federal')).toBe('Buenos Aires');
      expect(scraper.extractCity('Córdoba, Córdoba')).toBe('Córdoba');
      expect(scraper.extractCity('La Plata')).toBe('La Plata');
    });

    it('should return "No especificado" for missing city', () => {
      expect(scraper.extractCity('')).toBe('No especificado');
      expect(scraper.extractCity('   ')).toBe('No especificado');
    });
  });

  describe('input validation', () => {
    it('should validate scraping parameters', () => {
      expect(() => scraper.validateInput(2020, 'Toyota', 'Corolla')).not.toThrow();
    });

    it('should throw error for invalid year', () => {
      expect(() => scraper.validateInput(1800, 'Toyota', 'Corolla')).toThrow();
      expect(() => scraper.validateInput(2050, 'Toyota', 'Corolla')).toThrow();
    });

    it('should throw error for invalid brand', () => {
      expect(() => scraper.validateInput(2020, '', 'Corolla')).toThrow();
      expect(() => scraper.validateInput(2020, '   ', 'Corolla')).toThrow();
    });

    it('should throw error for invalid model', () => {
      expect(() => scraper.validateInput(2020, 'Toyota', '')).toThrow();
      expect(() => scraper.validateInput(2020, 'Toyota', '   ')).toThrow();
    });
  });
});