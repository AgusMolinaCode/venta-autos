import { VehiculoConFotos, VehiculoFoto } from "@/lib/supabase";

/**
 * TypeScript interfaces for Criptoya API response
 * Source: https://criptoya.com/api/dolar
 */

export interface Dolar {
  mayorista: Mayorista;
  oficial: Mayorista;
  ahorro: Ahorro;
  tarjeta: Mayorista;
  blue: Ahorro;
  cripto: { [key: string]: Ahorro };
  mep: Ccl;
  ccl: Ccl;
}

export interface Ahorro {
  ask: number;
  bid: number;
  variation: number;
  timestamp: number;
}

export interface Ccl {
  al30: Al30;
  gd30: Al30;
  letras: Letras;
  bpo27: Al30;
}

export interface Al30 {
  the24Hs: Mayorista;
  ci: Mayorista;
}

export interface Mayorista {
  price: number;
  variation: number;
  timestamp: number;
}

export interface Letras {
  name: string;
  the24Hs: Mayorista;
  ci: Mayorista;
}

/**
 * Response interface for USD rate API
 */
export interface USDRateResponse {
  success: boolean;
  rate: number;
  source: 'blue' | 'official' | 'cached';
  timestamp: number;
  error?: string;
}

/**
 * Vehicle Details Modal interfaces
 */

// Vehicle Details Modal Interfaces
export interface VehicleDetailsModalProps {
  vehicle: VehiculoConFotos | null;
  isOpen: boolean;
  onClose: () => void;
}

// Fullscreen Image Viewer Interfaces
export interface FullscreenImageViewerProps {
  images: VehiculoFoto[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  vehicleTitle: string;
}

// Vehicle Details Grid Interfaces
export interface VehicleDetailsGridProps {
  vehicle: VehiculoConFotos;
}

// Helper function types
export interface DescriptionHelpers {
  truncateDescription: (text: string, maxLength?: number) => string;
  shouldShowReadMore: (text: string, maxLength?: number) => boolean;
}

// Icon field mapping type
export type VehicleFieldLabel = 
  | "Marca" 
  | "Modelo" 
  | "Año" 
  | "Kilometraje" 
  | "Versión" 
  | "Combustible" 
  | "Transmisión" 
  | "Color";

// Vehicle field definition
export interface VehicleField {
  label: VehicleFieldLabel;
  value: string;
}