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

export const BRANDS = [
  {
    name: "Volkswagen",
    imageUrl:
      "https://http2.mlstatic.com/D_Q_NP_2X_828631-MLA50482308405_062022-G.webp",
  },
  {
    name: "Citroën",
    imageUrl:
      "https://http2.mlstatic.com/D_Q_NP_2X_729208-MLA50528042499_062022-G.webp",
  },
  {
    name: "Renault",
    imageUrl:
      "https://http2.mlstatic.com/D_Q_NP_2X_952155-MLA50528061329_062022-G.webp",
  },
  {
    name: "Ford",
    imageUrl:
      "https://http2.mlstatic.com/D_Q_NP_2X_745888-MLA50528199418_062022-G.webp",
  },
  {
    name: "Jeep",
    imageUrl:
      "	https://http2.mlstatic.com/D_Q_NP_2X_729208-MLA50528042499_062022-G.webp",
  },
  {
    name: "Peugeot",
    imageUrl:
      "https://http2.mlstatic.com/D_Q_NP_2X_604355-MLA50528199819_062022-G.webp",
  },
  {
    name: "Chevrolet",
    imageUrl:
      "https://http2.mlstatic.com/D_Q_NP_2X_880563-MLA46221729208_052021-G.webp",
  },
  {
    name: "Fiat",
    imageUrl:
      "https://http2.mlstatic.com/D_Q_NP_2X_630120-MLA45389263559_032021-G.webp",
  },
  {
    name: "Toyota",
    imageUrl:
      "https://http2.mlstatic.com/D_Q_NP_2X_632536-MLA50528042431_062022-G.webp",
  },
  {
    name: "Honda",
    imageUrl:
      "https://http2.mlstatic.com/D_Q_NP_2X_647740-MLA50528042449_062022-G.webp",
  },
  {
    name: "Nissan",
    imageUrl:
      "https://http2.mlstatic.com/D_Q_NP_2X_992811-MLA50528042565_062022-G.webp",
  },
  {
    name: "suzuki",
    imageUrl:
      "https://http2.mlstatic.com/D_Q_NP_2X_904981-MLA50528703122_062022-G.webp",
  },
  {
    name: "BMW",
    imageUrl:
      "https://http2.mlstatic.com/D_Q_NP_2X_791329-MLA50528199064_062022-G.webp",
  },
  {
    name: "Mercedes-Benz",
    imageUrl:
      "	https://http2.mlstatic.com/D_Q_NP_2X_623177-MLA45389263710_032021-G.webp",
  },
  {
    name: "Audi",
    imageUrl:
      "	https://http2.mlstatic.com/D_Q_NP_2X_800125-MLA50528042489_062022-G.webp",
  },
  {
    name: "Hyundai",
    imageUrl:
      "https://http2.mlstatic.com/D_Q_NP_2X_705469-MLA50528061586_062022-G.webp",
  },
  {
    name: "Cherry",
    imageUrl:
      "	https://http2.mlstatic.com/D_Q_NP_2X_719388-MLA84077325897_042025-G.webp",
  },
  {
    name: "Kia",
    imageUrl:
      "	https://http2.mlstatic.com/D_Q_NP_2X_909386-MLA45389954189_032021-G.webp",
  },
] as const;

// Tipos derivados
export type CombustibleType = (typeof COMBUSTIBLES)[number];
export type TransmisionType = (typeof TRANSMISIONES)[number];
export type MonedaType = (typeof MONEDAS)[number];
export type EstadoType = (typeof ESTADOS)[number];
export type StepKey = (typeof MODAL_STEPS)[number]["key"];
