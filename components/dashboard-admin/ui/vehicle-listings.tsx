"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { VehicleCard } from "./vehicle-card";
import { VehiculoConFotos } from "@/lib/supabase";

interface VehicleListingsProps {
  vehicles: VehiculoConFotos[];
  onEdit: (vehicle: VehiculoConFotos) => void;
  onDelete: (vehicleId: string) => void;
  onViewDetails: (vehicle: VehiculoConFotos) => void;
}

export function VehicleListings({
  vehicles,
  onEdit,
  onDelete,
  onViewDetails
}: VehicleListingsProps) {
  // Calculate metrics from real vehicle data
  const published = vehicles.filter(v => v.estado === 'publicado').length;
  const paused = vehicles.filter(v => v.estado === 'pausado').length;
  const sold = vehicles.filter(v => v.estado === 'vendido').length;
  const totalVehicles = vehicles.length;

  const getFilteredVehicles = (status?: string) => {
    if (!status || status === 'all') return vehicles;
    return vehicles.filter(v => v.estado === status);
  };

  const VehicleGrid = ({ filteredVehicles }: { filteredVehicles: VehiculoConFotos[] }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6">
      {filteredVehicles.map((vehicle) => (
        <VehicleCard 
          key={vehicle.id} 
          vehicle={vehicle}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Listado de Vehículos</CardTitle>
        <CardDescription>Gestiona y rastrea tu inventario de vehículos</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">
              Todos ({totalVehicles})
            </TabsTrigger>
            <TabsTrigger value="publicado">
              Publicados ({published})
            </TabsTrigger>
            <TabsTrigger value="pausado">
              Pausados ({paused})
            </TabsTrigger>
            <TabsTrigger value="vendido">
              Vendidos ({sold})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <VehicleGrid filteredVehicles={getFilteredVehicles()} />
          </TabsContent>
          
          <TabsContent value="publicado" className="mt-6">
            <VehicleGrid filteredVehicles={getFilteredVehicles('publicado')} />
          </TabsContent>
          
          <TabsContent value="pausado" className="mt-6">
            <VehicleGrid filteredVehicles={getFilteredVehicles('pausado')} />
          </TabsContent>
          
          <TabsContent value="vendido" className="mt-6">
            <VehicleGrid filteredVehicles={getFilteredVehicles('vendido')} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}