/**
 * Validation utilities for the dashboard-admin
 */

import { VehiculoConFotos } from "@/lib/supabase";

/**
 * Validates if a vehicle has all required fields
 */
export function isVehicleValid(vehicle: Partial<VehiculoConFotos>): boolean {
  return !!(
    vehicle.marca &&
    vehicle.modelo &&
    vehicle.ano &&
    vehicle.precio &&
    vehicle.moneda
  );
}

/**
 * Validates if files are valid images
 */
export function validateImageFiles(files: File[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  for (const file of files) {
    if (!allowedTypes.includes(file.type)) {
      errors.push(`${file.name}: Formato no válido. Use JPG, PNG o WebP.`);
    }
    
    if (file.size > maxSize) {
      errors.push(`${file.name}: Archivo muy grande. Máximo 10MB.`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates if a year is within acceptable range
 */
export function isValidYear(year: number): boolean {
  const currentYear = new Date().getFullYear();
  return year >= 1900 && year <= currentYear + 1;
}

/**
 * Validates if kilometraje is reasonable
 */
export function isValidKilometraje(km: number): boolean {
  return km >= 0 && km <= 1000000; // 1 million km max
}

/**
 * Validates if price is reasonable
 */
export function isValidPrice(price: number): boolean {
  return price > 0 && price <= 10000000; // 10 million max
}