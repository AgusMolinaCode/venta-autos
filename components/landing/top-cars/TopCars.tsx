"use client";

import React, { useState } from "react";
import { useAllVehicles } from "@/hooks/use-all-vehicles";
import { formatCurrency } from "@/utils/currency";
import { VehicleImage } from "@/components/dashboard-admin/ui/vehicle-image";
import { VehicleDetailsModal } from "@/modals/details-modal/vehicle-details-modal";
import { VehiculoConFotos } from "@/lib/supabase";
import Image from "next/image";

const TopCars: React.FC = () => {
  const { vehicles, loading, error } = useAllVehicles();
  const [viewingVehicle, setViewingVehicle] = useState<VehiculoConFotos | null>(
    null
  );

  // Take only the first 6 vehicles - already filtered for published status by useAllVehicles
  const topVehicles = vehicles.slice(0, 6);

  const closeViewModal = () => {
    setViewingVehicle(null);
  };

  const handleCardClick = (vehicle: VehiculoConFotos) => {
    setViewingVehicle(vehicle);
  };

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center text-blue-900 mb-12">
          Los 6 Mejores Autosss
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg shadow-xl overflow-hidden animate-pulse"
            >
              <div className="bg-gray-300 w-full h-56 m-4 mb-0 rounded-xl" />
              <div className="p-6">
                <div className="h-6 bg-gray-300 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded mb-3 w-3/4" />
                <div className="h-8 bg-gray-300 rounded mb-4 w-1/2" />
                <div className="h-12 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center text-blue-900 mb-12">
          Los 6 Mejores Autos
        </h2>
        <div className="text-center text-red-600">
          Error al cargar los vehículos: {error}
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-4xl font-bold text-center dark:text-gray-100 text-gray-900 underline mb-12">
        Ultimos Autos Agregados
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {topVehicles.map((vehicle, index) => {
          return (
            <div
              key={vehicle.id}
              onClick={() => handleCardClick(vehicle)}
              className={`bg-emerald-200 dark:bg-emerald-700 rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition duration-300 cursor-pointer`}
            >
              <div className="border-2 border-white/20 rounded-xl w-full h-56 m-4 mb-0 overflow-hidden">
                {vehicle.fotos?.length ? (
                  <VehicleImage
                    vehicle={vehicle}
                    className="w-full h-full rounded-xl"
                    showFallback={false}
                  />
                ) : (
                  <div
                    className={`bg-emerald-200 dark:bg-emerald-700 w-full h-full flex items-center justify-center`}
                  >
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
                  {vehicle.combustible} •{" "}
                  {vehicle.kilometraje
                    ? `${vehicle.kilometraje.toLocaleString()} km`
                    : "N/A"}
                </p>
                <p className="text-3xl font-bold dark:text-gray-100 text-gray-900 mb-4">
                  {vehicle.precio
                    ? formatCurrency(vehicle.precio, vehicle.moneda)
                    : "Consultar"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <VehicleDetailsModal
        vehicle={viewingVehicle}
        isOpen={!!viewingVehicle}
        onClose={closeViewModal}
      />
    </section>
  );
};

export default TopCars;
