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