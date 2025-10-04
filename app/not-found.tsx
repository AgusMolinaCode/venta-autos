import type { Metadata } from "next";
import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "404 - Página No Encontrada | Ventas-Autos",
  description: "La página que estás buscando no existe.",
};

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 Number */}
        <div className="relative mb-8">
          <h1 className="text-9xl md:text-[12rem] font-bold text-gray-300 dark:text-gray-800 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-emerald-500/20 dark:bg-emerald-500/30 animate-pulse flex items-center justify-center">
              <Search className="w-16 h-16 md:w-20 md:h-20 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
            ¡Ups! Página no encontrada
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            La página que estás buscando no existe o ha sido movida a otra ubicación.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Volver al Inicio
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="/vehiculos" className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Ver Vehículos
            </Link>
          </Button>
        </div>

        {/* Decorative Elements */}
        <div className="mt-16 grid grid-cols-3 gap-4 max-w-md mx-auto opacity-50">
          <div className="h-2 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
          <div className="h-2 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="h-2 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>

        {/* Help Text */}
        <p className="mt-12 text-sm text-gray-500 dark:text-gray-500">
          ¿Necesitas ayuda? Intenta buscar lo que necesitas desde la página principal.
        </p>
      </div>
    </div>
  );
}
