export interface DolarRate {
  price: number;
  variation: number;
  timestamp: number;
}

export interface CryptoRate {
  ask: number;
  bid: number;
  variation: number;
  timestamp: number;
}

export interface MEPData {
  '24hs': {
    price: number;
    variation: number;
    timestamp: number;
  };
  ci: {
    price: number;
    variation: number;
    timestamp: number;
  };
}

export interface CCLData {
  '24hs': {
    price: number;
    variation: number;
    timestamp: number;
  };
  ci: {
    price: number;
    variation: number;
    timestamp: number;
  };
}

export interface MEP {
  al30: MEPData;
  gd30: MEPData;
  letras: {
    name: string;
    '24hs': {
      price: number;
      variation: number;
      timestamp: number;
    };
    ci: {
      price: number;
      variation: number;
      timestamp: number;
    };
  };
  bpo27: MEPData;
}

export interface CCL {
  al30: CCLData;
  gd30: CCLData;
  letras: {
    name: string;
    '24hs': {
      price: number;
      variation: number;
      timestamp: number;
    };
    ci: {
      price: number;
      variation: number;
      timestamp: number;
    };
  };
  bpo27: CCLData;
}

export interface CryptoData {
  ccb: CryptoRate;
  usdt: CryptoRate;
  usdc: CryptoRate;
}

export interface DolarAPIResponse {
  mayorista: DolarRate;
  oficial: DolarRate;
  ahorro: {
    ask: number;
    bid: number;
    variation: number;
    timestamp: number;
  };
  tarjeta: DolarRate;
  blue: {
    ask: number;
    bid: number;
    variation: number;
    timestamp: number;
  };
  cripto: CryptoData;
  mep: MEP;
  ccl: CCL;
}