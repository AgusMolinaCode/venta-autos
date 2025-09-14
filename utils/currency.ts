/**
 * Currency formatting utilities for price display
 */

/**
 * Formats ARS currency for display - shows only $ symbol
 */
export function formatARS(amount: number): string {
  return '$' + new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats USD currency for display - shows USD prefix
 */
export function formatUSD(amount: number): string {
  return 'USD ' + new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats numbers with thousands separators
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('es-AR').format(num);
}

/**
 * Formats currency based on currency code
 * USD: shows "USD 1,000" format
 * ARS: shows "$1.000" format
 */
export function formatCurrency(amount: number, currency: 'ARS' | 'USD'): string {
  return currency === 'USD' ? formatUSD(amount) : formatARS(amount);
}