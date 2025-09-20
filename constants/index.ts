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

export const TESTIMONIALS = [
  {
    name: "María González",
    rating: 5,
    review: "Excelente servicio, encontré el auto perfecto para mi familia. El proceso fue muy transparente y profesional."
  },
  {
    name: "Carlos Rodríguez",
    rating: 5,
    review: "Compré mi primer auto aquí y la experiencia fue increíble. El equipo me ayudó en cada paso del proceso."
  },
  {
    name: "Ana Martínez",
    rating: 4,
    review: "Gran variedad de vehículos y precios competitivos. Recomiendo totalmente este concesionario."
  },
  {
    name: "Roberto Silva",
    rating: 5,
    review: "Vendí mi auto y compré uno nuevo en el mismo lugar. Proceso rápido y sin complicaciones."
  },
  {
    name: "Lucía Fernández",
    rating: 5,
    review: "Atención al cliente excepcional. Me asesoraron perfectamente para elegir el vehículo ideal."
  },
  {
    name: "Diego Morales",
    rating: 4,
    review: "Muy buena experiencia de compra. Los vendedores son honestos y conocen bien los productos."
  },
  {
    name: "Patricia López",
    rating: 5,
    review: "Encontré exactamente lo que buscaba a un precio justo. El servicio post-venta también es excelente."
  },
  {
    name: "Andrés Castro",
    rating: 5,
    review: "Proceso de financiamiento muy ágil. Me ayudaron con todas las opciones disponibles."
  },
  {
    name: "Valeria Ruiz",
    rating: 4,
    review: "Personal muy capacitado y amable. Me sentí cómoda durante toda la negociación."
  },
  {
    name: "Sebastián Torres",
    rating: 5,
    review: "Compré mi BMW aquí y estoy completamente satisfecho con la compra y el servicio recibido."
  },
  {
    name: "Carmen Jiménez",
    rating: 5,
    review: "Excelente relación calidad-precio. El auto que compré superó mis expectativas."
  },
  {
    name: "Fernando Vega",
    rating: 4,
    review: "Muy profesionales en el manejo de la documentación. Todo en orden y sin sorpresas."
  }
] as const;

export const TESTIMONIALS_2 = [
  {
    name: "Gabriela Herrera",
    rating: 5,
    review: "Increíble atención desde el primer contacto. Me ayudaron a conseguir el mejor precio para mi vehículo usado."
  },
  {
    name: "Martín Espinoza",
    rating: 4,
    review: "El showroom tiene una excelente selección de autos. Encontré justo lo que necesitaba para mi trabajo."
  },
  {
    name: "Sofía Mendoza",
    rating: 5,
    review: "Servicio postventa excepcional. Siempre están disponibles para resolver cualquier consulta."
  },
  {
    name: "Ricardo Peña",
    rating: 5,
    review: "Compré mi segundo auto aquí y la experiencia fue aún mejor que la primera vez. Muy recomendable."
  },
  {
    name: "Alejandra Rojas",
    rating: 4,
    review: "Excelente asesoramiento técnico. Me explicaron todas las características del vehículo en detalle."
  },
  {
    name: "Miguel Contreras",
    rating: 5,
    review: "Proceso de entrega muy eficiente. El auto estaba impecable y listo en la fecha acordada."
  },
  {
    name: "Isabella Vargas",
    rating: 5,
    review: "Personal altamente profesional. Me dieron todas las facilidades para concretar la operación."
  },
  {
    name: "Joaquín Ramírez",
    rating: 4,
    review: "Buena relación precio-calidad. El vehículo llegó con todos los accesorios prometidos."
  },
  {
    name: "Camila Ortega",
    rating: 5,
    review: "Ambiente muy acogedor y sin presión de venta. Pude evaluar todas las opciones con tranquilidad."
  },
  {
    name: "Nicolás Guerrero",
    rating: 5,
    review: "Excelente seguimiento durante todo el proceso. Siempre mantuvieron comunicación conmigo."
  },
  {
    name: "Valentina Cruz",
    rating: 4,
    review: "Muy satisfecha con mi compra. El auto tiene todo lo que necesitaba para mi día a día."
  },
  {
    name: "Emilio Delgado",
    rating: 5,
    review: "Superaron mis expectativas. El servicio integral hace la diferencia con otros concesionarios."
  }
] as const;

// Tipos derivados
export type CombustibleType = (typeof COMBUSTIBLES)[number];
export type TransmisionType = (typeof TRANSMISIONES)[number];
export type MonedaType = (typeof MONEDAS)[number];
export type EstadoType = (typeof ESTADOS)[number];
export type StepKey = (typeof MODAL_STEPS)[number]["key"];
