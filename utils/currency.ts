/**
 * Currency formatting utilities for price display
 */

/**
 * Formats ARS currency for display
 */
export function formatARS(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats USD currency for display
 */
export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
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
 */
export function formatCurrency(amount: number, currency: 'ARS' | 'USD'): string {
  return currency === 'USD' ? formatUSD(amount) : formatARS(amount);
}