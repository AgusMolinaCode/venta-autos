import { normalize, generateMercadoLibreURL, isValidMercadoLibreURL } from '@/lib/utils/url-normalizer';

describe('URL Normalizer', () => {
  describe('normalize', () => {
    it('should convert text to lowercase', () => {
      expect(normalize('TOYOTA')).toBe('toyota');
      expect(normalize('Ford')).toBe('ford');
    });

    it('should replace spaces with hyphens', () => {
      expect(normalize('Corolla Cross')).toBe('corolla-cross');
      expect(normalize('Focus SE')).toBe('focus-se');
    });

    it('should remove accents', () => {
      expect(normalize('Citroën')).toBe('citroen');
      expect(normalize('Peugeot 208')).toBe('peugeot-208');
    });

    it('should remove special characters', () => {
      expect(normalize('BMW X3 2.0i')).toBe('bmw-x3-2-0i');
      expect(normalize('C4 Lounge@')).toBe('c4-lounge');
    });

    it('should remove multiple consecutive hyphens', () => {
      expect(normalize('Honda  Civic')).toBe('honda-civic');
      expect(normalize('Toyota---Corolla')).toBe('toyota-corolla');
    });

    it('should trim leading and trailing hyphens', () => {
      expect(normalize(' Toyota ')).toBe('toyota');
      expect(normalize('-Ford-')).toBe('ford');
    });

    it('should handle empty strings', () => {
      expect(normalize('')).toBe('');
      expect(normalize('   ')).toBe('');
    });

    it('should handle complex brand/model names', () => {
      expect(normalize('Mercedes-Benz Clase A')).toBe('mercedes-benz-clase-a');
      expect(normalize('Volkswagen Gol 1.6 Power')).toBe('volkswagen-gol-1-6-power');
    });
  });

  describe('generateMercadoLibreURL', () => {
    it('should generate correct URL format', () => {
      const url = generateMercadoLibreURL(2020, 'Toyota', 'Corolla');
      expect(url).toBe('https://autos.mercadolibre.com.ar/2020/toyota-corolla');
    });

    it('should handle complex brand and model names', () => {
      const url = generateMercadoLibreURL(2021, 'Mercedes-Benz', 'Clase A');
      expect(url).toBe('https://autos.mercadolibre.com.ar/2021/mercedes-benz-clase-a');
    });

    it('should handle numbers in model names', () => {
      const url = generateMercadoLibreURL(2019, 'BMW', 'X3 2.0i');
      expect(url).toBe('https://autos.mercadolibre.com.ar/2019/bmw-x3-2-0i');
    });

    it('should throw error for invalid year', () => {
      expect(() => generateMercadoLibreURL(1800, 'Toyota', 'Corolla')).toThrow('Year must be between 1900 and 2030');
      expect(() => generateMercadoLibreURL(2050, 'Toyota', 'Corolla')).toThrow('Year must be between 1900 and 2030');
    });

    it('should throw error for empty brand', () => {
      expect(() => generateMercadoLibreURL(2020, '', 'Corolla')).toThrow('Brand and model are required and must be valid strings');
      expect(() => generateMercadoLibreURL(2020, '   ', 'Corolla')).toThrow('Brand and model are required and must be valid strings');
    });

    it('should throw error for empty model', () => {
      expect(() => generateMercadoLibreURL(2020, 'Toyota', '')).toThrow('Brand and model are required and must be valid strings');
      expect(() => generateMercadoLibreURL(2020, 'Toyota', '   ')).toThrow('Brand and model are required and must be valid strings');
    });
  });

  describe('isValidMercadoLibreURL', () => {
    it('should validate correct MercadoLibre URLs', () => {
      expect(isValidMercadoLibreURL('https://autos.mercadolibre.com.ar/2020/toyota-corolla')).toBe(true);
      expect(isValidMercadoLibreURL('https://autos.mercadolibre.com.ar/2021/mercedes-benz-clase-a')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidMercadoLibreURL('https://google.com')).toBe(false);
      expect(isValidMercadoLibreURL('https://mercadolibre.com.ar/toyota')).toBe(false);
      expect(isValidMercadoLibreURL('invalid-url')).toBe(false);
    });

    it('should reject URLs with wrong hostname', () => {
      expect(isValidMercadoLibreURL('https://cars.mercadolibre.com.ar/2020/toyota-corolla')).toBe(false);
      expect(isValidMercadoLibreURL('https://autos.mercadolibre.com/2020/toyota-corolla')).toBe(false);
    });

    it('should reject URLs with wrong path format', () => {
      expect(isValidMercadoLibreURL('https://autos.mercadolibre.com.ar/toyota-corolla')).toBe(false);
      expect(isValidMercadoLibreURL('https://autos.mercadolibre.com.ar/abc/toyota-corolla')).toBe(false);
    });
  });
});