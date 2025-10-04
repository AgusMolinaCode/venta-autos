import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vehículos | Ventas-Autos",
  description: "Explora nuestra completa selección de vehículos en venta. Encuentra autos de todas las marcas, modelos y precios. Filtra por año, kilometraje, combustible y más. Compra tu auto ideal de forma rápida y segura.",
  keywords: [
    'vehículos en venta',
    'autos usados',
    'comprar auto',
    'venta de autos',
    'concesionario',
    'autos seminuevos',
    'catálogo de vehículos',
    'todos los autos',
    'marketplace autos',
    'buscar auto'
  ],
  openGraph: {
    title: "Todos los Vehículos en Venta | Ventas-Autos",
    description: "Descubre nuestra amplia selección de vehículos. Filtra por marca, modelo, precio y más. Encuentra tu auto ideal hoy.",
    type: 'website',
    locale: 'es_AR',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Vehículos en Venta | Ventas-Autos",
    description: "Amplia selección de autos con los mejores precios del mercado",
  },
  alternates: {
    canonical: '/vehiculos',
  },
};

interface VehiculosLayoutProps {
  children: React.ReactNode;
}

/**
 * Vehicles catalog layout
 * Provides SEO-optimized metadata for the main vehicles listing page
 */
export default function VehiculosLayout({ children }: VehiculosLayoutProps) {
  return children;
}
