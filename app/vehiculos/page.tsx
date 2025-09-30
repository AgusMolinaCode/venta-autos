'use client'
import { useState, useMemo } from "react";
import { useAllVehicles } from "@/hooks/use-all-vehicles";
import { useVehicleStatusCache } from "@/hooks/use-vehicle-status-cache";
import { useVehicleFilters } from "@/hooks/use-vehicle-filters";
import { useCurrencyConversion } from "@/hooks/use-currency-conversion";
import { formatCurrency } from "@/utils/currency";
import { VehicleImage } from "@/components/dashboard-admin/ui/vehicle-image";
import { VehicleDetailsModal } from "@/modals/details-modal/vehicle-details-modal";
import { VehicleFilterPanel } from "@/components/landing/vehicle-filters/vehicle-filter-panel";
import { VehiculoConFotos } from "@/lib/supabase";
import Image from "next/image";

export default function VehiculosPage() {
  const { vehicles, loading, error } = useAllVehicles();
  const { getVehicleStatus } = useVehicleStatusCache();
  const { dollarRate } = useCurrencyConversion();
  const [viewingVehicle, setViewingVehicle] = useState<VehiculoConFotos | null>(null);

  // Filter vehicles by published status only
  const publishedVehicles = useMemo(() => vehicles.filter(vehicle =>
    vehicle.id && getVehicleStatus(vehicle.id) === 'publicado'
  ), [vehicles, getVehicleStatus]);

  // Use vehicle filters for comprehensive filtering including brands
  const {
    filteredVehicles,
    filterCounts,
    updateFilters,
    hasActiveFilters
  } = useVehicleFilters({
    vehicles: publishedVehicles,
    blueDollarRate: dollarRate
  });

  const closeViewModal = () => {
    setViewingVehicle(null);
  };

  const handleCardClick = (vehicle: VehiculoConFotos) => {
    setViewingVehicle(vehicle);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 dark:bg-neutral-900 bg-gray-50">
        <h1 className="text-4xl font-bold text-center mb-12 dark:text-gray-100 text-gray-900">
          Cargando vehículos...
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg shadow-xl overflow-hidden animate-pulse">
              <div className="bg-gray-300 w-full h-56 m-4 mb-0 rounded-xl" />
              <div className="p-6">
                <div className="h-6 bg-gray-300 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded mb-3 w-3/4" />
                <div className="h-8 bg-gray-300 rounded mb-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12 dark:text-gray-100 text-gray-900">
          Todos los Vehículos
        </h1>
        <div className="text-center text-red-600">
          Error al cargar los vehículos: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="dark:bg-neutral-900 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center dark:text-gray-100 text-gray-900 mb-8">
          Todos los Vehículos
        </h1>

            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                {hasActiveFilters ? (
                  <>
                    Mostrando {filteredVehicles.length} de {publishedVehicles.length} vehículo{publishedVehicles.length !== 1 ? 's' : ''}
                  </>
                ) : (
                  <>
                    {publishedVehicles.length} vehículo{publishedVehicles.length !== 1 ? 's' : ''} disponible{publishedVehicles.length !== 1 ? 's' : ''}
                  </>
                )}
              </p>
            </div>
        {/* Layout con sidebar izquierda y contenido principal */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar de filtros - Solo visible si hay vehículos */}
          {publishedVehicles.length > 0 && (
            <div className="w-full lg:w-80 flex-shrink-0">
              <VehicleFilterPanel
                vehicles={publishedVehicles}
                onFilterChange={updateFilters}
                variant="vertical"
                className="sticky top-4"
              />
            </div>
          )}

          {/* Contenido principal */}
          <div className="flex-1">
            {/* Contador de resultados */}

            {/* Grid de vehículos */}
            {filteredVehicles.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-2xl text-gray-500 dark:text-gray-400">
                  {hasActiveFilters ?
                    "No hay vehículos que coincidan con los filtros seleccionados." :
                    "No hay vehículos disponibles en este momento."
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                {filteredVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    onClick={() => handleCardClick(vehicle)}
                    className="bg-emerald-200 dark:bg-emerald-700 rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition duration-300 cursor-pointer"
                  >
                    <div className="border-2 border-white/20 rounded-xl w-full h-56 m-4 mb-0 overflow-hidden">
                      {vehicle.fotos?.length ? (
                        <VehicleImage
                          vehicle={vehicle}
                          className="w-full h-full rounded-xl"
                          showFallback={false}
                        />
                      ) : (
                        <div className="bg-emerald-200 dark:bg-emerald-700 w-full h-full flex items-center justify-center">
                          <Image
                            src="/image-not-found-icon.png"
                            alt="No image available"
                            className="w-32 h-32 object-contain opacity-80"
                            width={128}
                            height={128}
                          />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold dark:text-gray-100 text-gray-900 mb-2">
                        {vehicle.marca} {vehicle.modelo} {vehicle.ano}
                      </h3>
                      <p className="dark:text-gray-100 text-gray-900 mb-3">
                        {vehicle.combustible} • {vehicle.kilometraje ? `${vehicle.kilometraje.toLocaleString()} km` : 'N/A'}
                      </p>
                      <p className="text-3xl font-bold dark:text-gray-100 text-gray-900 mb-4">
                        {vehicle.precio ? formatCurrency(vehicle.precio, vehicle.moneda) : 'Consultar'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <VehicleDetailsModal
          vehicle={viewingVehicle}
          isOpen={!!viewingVehicle}
          onClose={closeViewModal}
        />
      </div>
    </div>
  )
}