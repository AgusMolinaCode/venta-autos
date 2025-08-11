"use client";

import React from "react";
import {
  Car,
  Play,
  Pause,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Star,
  Calculator,
  HandCoins,
  PiggyBank,
} from "lucide-react";
import { useVehicles } from "@/hooks/use-vehicles";
import { useVehicleStatusCache } from "@/hooks/use-vehicle-status-cache";
import { useCurrencyConversion } from "@/hooks/use-currency-conversion";
import { useVehicleMetrics } from "@/hooks/use-vehicle-metrics";
import { MetricCard } from "@/components/dashboard-admin/ui/metric-card";
import { CurrencyToggle } from "@/components/dashboard-admin/ui/currency-toggle";

const MainInfo = () => {
  const { vehicles } = useVehicles();
  const { getVehicleStatus } = useVehicleStatusCache();
  
  // Custom hooks for clean separation of concerns
  const {
    preferredCurrency,
    setPreferredCurrency,
    dollarRate,
    rateLoading,
    convertVehiclePrice,
    formatCurrency,
  } = useCurrencyConversion();

  const metrics = useVehicleMetrics({
    vehicles,
    getVehicleStatus,
    convertVehiclePrice,
  });

  return (
    <div className="space-y-6">
      <CurrencyToggle
        preferredCurrency={preferredCurrency}
        onCurrencyChange={setPreferredCurrency}
        className="flex justify-end"
      />

      {/* Status Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="En Preparación"
          value={metrics.statusCounts.preparation}
          subtitle="Vehículos en proceso"
          icon={Car}
          variant="orange"
        />
        <MetricCard
          title="Publicados"
          value={metrics.statusCounts.published}
          subtitle="Vehículos activos en venta"
          icon={Play}
          variant="green"
        />
        <MetricCard
          title="Pausados"
          value={metrics.statusCounts.paused}
          subtitle="Temporalmente inactivos"
          icon={Pause}
          variant="yellow"
        />
        <MetricCard
          title="Vendidos"
          value={metrics.statusCounts.sold}
          subtitle="Ventas exitosas"
          icon={CheckCircle}
          variant="blue"
        />
      </div>

      {/* Price Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Valor Total Inventario"
          value={formatCurrency(metrics.totalInventoryValue)}
          subtitle={`Total de ${metrics.totalVehicles} vehículos • Tasa Dólar Blue: $${dollarRate.toLocaleString("es-AR")} ARS${rateLoading ? " (actualizando...)" : ""}`}
          icon={Calculator}
          variant="purple"
        />
        <MetricCard
          title="Valor Publicados"
          value={formatCurrency(metrics.publishedVehiclesValue)}
          subtitle={`${metrics.statusCounts.published} vehículos en venta`}
          icon={PiggyBank}
          variant="emerald"
        />
        <MetricCard
          title="Ingresos por Ventas"
          value={formatCurrency(metrics.soldVehiclesRevenue)}
          subtitle={`${metrics.statusCounts.sold} vehículos vendidos`}
          icon={HandCoins}
          variant="amber"
        />
      </div>

      {/* Additional Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Vehículos"
          value={metrics.totalVehicles}
          icon={Car}
          variant="green"
          trend={{
            value: "Vehiculos en inventario",
            direction: "up",
            icon: TrendingUp,
          }}
        />
        <MetricCard
          title="Precio Promedio"
          value={formatCurrency(metrics.averagePrice)}
          subtitle="Por vehículo en inventario"
          icon={DollarSign}
          variant="green"
          trend={{
            value: "Promedio del inventario",
            direction: "neutral",
          }}
        />
        <MetricCard
          title="Marcas Listadas"
          value={metrics.brandCount}
          subtitle="Diversidad en inventario"
          icon={Star}
          variant="green"
        />
      </div>
    </div>
  );
};

export default MainInfo;
