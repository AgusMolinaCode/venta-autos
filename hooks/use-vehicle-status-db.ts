"use client";

import { useState, useCallback } from "react";
import { EstadoType } from "@/constants";
import { VehicleStatusService, VehicleStatusStats } from "@/lib/services/vehicle-status-service";

/**
 * Hook for managing vehicle status using database operations
 * Replaces localStorage-based vehicle status cache
 */
export function useVehicleStatusDB() {
  const [isLoading, setIsLoading] = useState(false);

  // Get status of a specific vehicle from database
  const getVehicleStatus = useCallback(async (vehicleId: string): Promise<EstadoType> => {
    try {
      const result = await VehicleStatusService.getVehicleStatus(vehicleId);

      if (result.success && result.data) {
        return result.data as EstadoType;
      }

      // Return default status if vehicle not found or error
      console.warn(`⚠️ Could not get status for vehicle ${vehicleId}, using default`);
      return "preparación";
    } catch (error) {
      console.error("❌ Error getting vehicle status:", error);
      return "preparación";
    }
  }, []);

  // Update status of a specific vehicle in database
  const updateVehicleStatus = useCallback(
    async (vehicleId: string, newStatus: EstadoType): Promise<boolean> => {
      setIsLoading(true);

      try {
        const result = await VehicleStatusService.updateVehicleStatus(vehicleId, newStatus);

        if (result.success) {
          return true;
        } else {
          console.error(`❌ Failed to update vehicle status:`, result.error);
          return false;
        }
      } catch (error) {
        console.error("❌ Error updating vehicle status:", error);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Get status statistics from database
  const getStatusStats = useCallback(async (userId?: string): Promise<VehicleStatusStats | null> => {
    try {
      const result = await VehicleStatusService.getStatusStats(userId);

      if (result.success && result.data) {
        return result.data as VehicleStatusStats;
      }

      console.warn("⚠️ Could not get status statistics");
      return null;
    } catch (error) {
      console.error("❌ Error getting status statistics:", error);
      return null;
    }
  }, []);

  // Get vehicles by status from database
  const getVehiclesByStatus = useCallback(
    async (status: EstadoType, userId?: string) => {
      try {
        const result = await VehicleStatusService.getVehiclesByStatus(status, userId);

        if (result.success && result.data) {
          return result.data;
        }

        console.warn(`⚠️ Could not get vehicles with status: ${status}`);
        return [];
      } catch (error) {
        console.error("❌ Error getting vehicles by status:", error);
        return [];
      }
    },
    []
  );

  // Bulk update vehicle statuses
  const bulkUpdateStatus = useCallback(
    async (vehicleIds: string[], newStatus: EstadoType): Promise<boolean> => {
      setIsLoading(true);

      try {
        const result = await VehicleStatusService.bulkUpdateStatus(vehicleIds, newStatus);

        if (result.success) {
          return true;
        } else {
          console.error(`❌ Failed to bulk update statuses:`, result.error);
          return false;
        }
      } catch (error) {
        console.error("❌ Error in bulk status update:", error);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    isLoading,
    getVehicleStatus,
    updateVehicleStatus,
    getStatusStats,
    getVehiclesByStatus,
    bulkUpdateStatus,
  };
}