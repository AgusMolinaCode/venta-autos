/**
 * URL normalization utilities for MercadoLibre search URLs
 * Converts text to URL-friendly format following MercadoLibre conventions
 */

/**
 * Normalizes text for MercadoLibre URL format
 * Rules:
 * - Convert to lowercase
 * - Replace spaces with hyphens
 * - Remove accents and special characters
 * - Remove multiple consecutive hyphens
 * - Trim leading/trailing hyphens
 */
export function normalize(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text
    .toLowerCase()
    .trim()
    // Replace accented characters
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Replace special characters and spaces with hyphens
    .replace(/[^a-z0-9]+/g, '-')
    // Remove multiple consecutive hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
}

/**
 * Generates MercadoLibre search URL
 * Format: https://autos.mercadolibre.com.ar/{brand}/{year}/{model}
 */
export function generateMercadoLibreURL(year: number, brand: string, model: string): string {
  const normalizedBrand = normalize(brand);
  const normalizedModel = normalize(model);
  
  if (!normalizedBrand || !normalizedModel) {
    throw new Error('Brand and model are required and must be valid strings');
  }
  
  if (!year || year < 1900 || year > 2030) {
    throw new Error('Year must be between 1900 and 2030');
  }

  // Use real MercadoLibre URL format: /brand/year/model
  return `https://autos.mercadolibre.com.ar/${normalizedBrand}/${year}/${normalizedModel}`;
}

/**
 * Validates if a string is a valid MercadoLibre auto URL
 */
export function isValidMercadoLibreURL(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const pathRegex = /^\/[a-z0-9-]+\/\d{4}\/[a-z0-9-]+$/;
    return urlObj.hostname === 'autos.mercadolibre.com.ar' && 
           pathRegex.test(urlObj.pathname);
  } catch {
    return false;
  }
}