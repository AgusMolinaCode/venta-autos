import type { Metadata } from "next";

interface BrandLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

/**
 * Convert URL slug to brand name
 * Example: "mercedes-benz" → "Mercedes-Benz"
 */
function slugToBrandName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Generate dynamic metadata for brand pages
 */
export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params;
  const brandName = slugToBrandName(id);

  return {
    title: `${brandName} | Ventas-Autos`,
    description: `Descubre los mejores vehículos ${brandName} en venta. Amplia variedad de modelos, precios competitivos y atención personalizada. Compra tu ${brandName} de forma rápida y segura.`,
    keywords: [
      brandName,
      `vehículos ${brandName}`,
      `autos ${brandName}`,
      `${brandName} usados`,
      `${brandName} en venta`,
      'comprar auto',
      'venta de autos',
      'concesionario'
    ],
    openGraph: {
      title: `${brandName} en Venta | Ventas-Autos`,
      description: `Encuentra tu próximo ${brandName} aquí. Amplia variedad de modelos y los mejores precios del mercado.`,
      type: 'website',
      locale: 'es_AR',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${brandName} | Ventas-Autos`,
      description: `Vehículos ${brandName} en venta con los mejores precios`,
    },
    alternates: {
      canonical: `/marcas/${id}`,
    },
  };
}

/**
 * Brand layout wrapper
 * Provides consistent structure for all brand pages
 */
export default function BrandLayout({ children }: BrandLayoutProps) {
  return children;
}
