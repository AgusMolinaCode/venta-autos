/**
 * Utility functions for formatting data in the dashboard-admin
 */

/**
 * Formats a price according to currency requirements
 * USD: shows "USD 1,000" format
 * ARS: shows "$1.000" format
 */
export function formatPrice(price: number, currency: string): string {
  if (currency === "USD") {
    return 'USD ' + new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  } else {
    return '$' + new Intl.NumberFormat("es-AR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }
}

/**
 * Formats kilometraje with proper locale
 */
export function formatKilometraje(km?: number): string {
  if (!km) return "No especificado";
  return `${km.toLocaleString()} km`;
}

/**
 * Formats a date according to Argentine locale
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("es-AR");
}

/**
 * Formats vehicle display name
 */
export function formatVehicleName(marca: string, modelo: string, ano: number): string {
  return `${marca} ${modelo} ${ano}`;
}

/**
 * Formats file size in MB
 */
export function formatFileSize(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return mb < 0.1 ? '< 0.1 MB' : `${mb.toFixed(1)} MB`;
}

/**
 * Gets file extension in uppercase
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toUpperCase() || 'DESCONOCIDO';
}

/**
 * Pluralizes a word based on count
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  const pluralForm = plural || `${singular}s`;
  return count === 1 ? singular : pluralForm;
}