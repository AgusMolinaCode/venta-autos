export const marcasAutos = [
  // Top 5 marcas más comerciales en Argentina
  "Toyota",
  "Volkswagen",
  "Ford",
  "Chevrolet",
  "Fiat",
  "Citroën",
  "Peugeot",
  "Renault",
  // Resto en orden alfabético
  "Acura",
  "Alfa Romeo",
  "Audi",
  "BAIC",
  "BMW",
  "Chery",
  "Chrysler",
  "D.S.",
  "DFSK",
  "Daewoo",
  "Daihatsu",
  "Dodge",
  "Ferrari",
  "Foton",
  "GWM",
  "Honda",
  "Hyundai",
  "Isuzu",
  "Iveco",
  "JAC",
  "Jaguar",
  "Jeep",
  "Jetour",
  "Kia",
  "Land Rover",
  "Lexus",
  "Lifan",
  "Lincoln",
  "Mercedes-Benz",
  "Mini",
  "Mitsubishi",
  "Nissan",
  "Porsche",
  "RAM",
  "Rover",
  "Seat",
  "Shineray",
  "Smart",
  "SsangYong",
  "Subaru",
  "Suzuki",
  "Volvo",
];

/**
 * Constantes centralizadas para dashboard-admin
 * Centraliza opciones de formularios y configuraciones
 */

// Opciones de formularios
export const COMBUSTIBLES = [
  "Nafta",
  "Diesel",
  "GNC",
  "Eléctrico",
  "Híbrido",
] as const;

export const TRANSMISIONES = ["Manual", "Automática", "CVT"] as const;

export const MONEDAS = ["ARS", "USD"] as const;

export const ESTADOS = [
  "preparación",
  "publicado",
  "pausado",
  "vendido",
] as const;

// Configuraciones de formulario
export const FORM_CONFIG = {
  maxFiles: 3,
  minYear: 1970,
  maxYear: 2025,
  minPrice: 1,
  imageFormats: "image/*",
  placeholders: {
    marca: "Seleccionar marca",
    modelo: "Ej: Corolla, Civic, Focus",
    ano: "2020",
    kilometraje: "50000",
    version: "Ej: LT, EX, Sport",
    color: "Ej: Blanco, Negro, Gris",
    combustible: "Seleccionar combustible",
    transmision: "Seleccionar transmisión",
    estado: "Seleccionar estado",
    precio: "15000000",
    descripcion:
      "Describe las características, estado y detalles importantes del vehículo...",
  },
} as const;

// Configuración de pasos del modal
export const MODAL_STEPS = [
  {
    step: 1,
    title: "Información",
    subtitle: "Datos del vehículo",
    key: "vehicle-info",
  },
  {
    step: 2,
    title: "Precio",
    subtitle: "Valor de venta",
    key: "price",
  },
  {
    step: 3,
    title: "Fotos",
    subtitle: "Imágenes",
    key: "photos",
  },
] as const;

// Tipos derivados
export type CombustibleType = (typeof COMBUSTIBLES)[number];
export type TransmisionType = (typeof TRANSMISIONES)[number];
export type MonedaType = (typeof MONEDAS)[number];
export type EstadoType = (typeof ESTADOS)[number];
export type StepKey = (typeof MODAL_STEPS)[number]["key"];
