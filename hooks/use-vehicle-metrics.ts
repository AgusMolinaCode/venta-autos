import { useMemo } from 'react';
import { VehiculoConFotos } from '@/lib/supabase';
import { EstadoType } from '@/constants';

export interface VehicleMetrics {
  statusCounts: {
    preparation: number;
    published: number;
    paused: number;
    sold: number;
  };
  totalVehicles: number;
  brandCount: number;
  totalInventoryValue: number;
  publishedVehiclesValue: number;
  soldVehiclesRevenue: number;
  averagePrice: number;
}

export interface UseVehicleMetricsParams {
  vehicles: VehiculoConFotos[];
  getVehicleStatus: (vehicleId: string) => EstadoType;
  convertVehiclePrice: (vehicle: VehiculoConFotos) => number;
}

export function useVehicleMetrics({
  vehicles,
  getVehicleStatus,
  convertVehiclePrice,
}: UseVehicleMetricsParams): VehicleMetrics {
  return useMemo(() => {
    // Status counting logic
    const userVehicleIds = vehicles.map(v => v.id!);
    const userVehicleStates = userVehicleIds.map(id => getVehicleStatus(id));

    const statusCounts = {
      preparation: userVehicleStates.filter(status => status === 'preparación').length,
      published: userVehicleStates.filter(status => status === 'publicado').length,
      paused: userVehicleStates.filter(status => status === 'pausado').length,
      sold: userVehicleStates.filter(status => status === 'vendido').length,
    };

    // Basic metrics
    const totalVehicles = vehicles.length;
    const brandCount = new Set(vehicles.map(v => v.marca)).size;

    // Price calculations with currency conversion
    const totalInventoryValue = vehicles.reduce(
      (sum, v) => sum + convertVehiclePrice(v),
      0
    );

    const publishedVehiclesValue = vehicles
      .filter(v => getVehicleStatus(v.id!) === 'publicado')
      .reduce((sum, v) => sum + convertVehiclePrice(v), 0);

    const soldVehiclesRevenue = vehicles
      .filter(v => getVehicleStatus(v.id!) === 'vendido')
      .reduce((sum, v) => sum + convertVehiclePrice(v), 0);

    const averagePrice = totalVehicles > 0 ? totalInventoryValue / totalVehicles : 0;

    return {
      statusCounts,
      totalVehicles,
      brandCount,
      totalInventoryValue,
      publishedVehiclesValue,
      soldVehiclesRevenue,
      averagePrice,
    };
  }, [vehicles, getVehicleStatus, convertVehiclePrice]);
}