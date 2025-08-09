"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Car, 
  Play, 
  Pause, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Star
} from "lucide-react";
import { useVehicles } from "@/hooks/use-vehicles";

const MainInfo = () => {
  const { vehicles } = useVehicles();

  // Calculate metrics from real vehicle data
  const published = vehicles.filter(v => v.estado === 'publicado').length;
  const paused = vehicles.filter(v => v.estado === 'pausado').length; 
  const sold = vehicles.filter(v => v.estado === 'vendido').length;
  const totalVehicles = vehicles.length;
  const brandCount = new Set(vehicles.map(v => v.marca)).size;
  const totalRevenue = vehicles
    .filter(v => v.estado === 'vendido')
    .reduce((sum, v) => sum + (v.precio || 0), 0);

  return (
    <div className="space-y-6">
      {/* Status Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
              Publicados
            </CardTitle>
            <div className="p-2 rounded-lg bg-green-500">
              <Play className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700 dark:text-green-300">
              {published}
            </div>
            <p className="text-sm text-green-600 dark:text-green-400">
              Vehículos activos en venta
            </p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/20 dark:border-yellow-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
              Pausados
            </CardTitle>
            <div className="p-2 rounded-lg bg-yellow-500">
              <Pause className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">
              {paused}
            </div>
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              Temporalmente inactivos
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Vendidos
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-500">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
              {sold}
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Ventas exitosas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Metrics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehículos</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVehicles}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +12% vs mes anterior
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalRevenue.toLocaleString('es-AR')}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +8% vs mes anterior
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marcas Listadas</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{brandCount}</div>
            <p className="text-xs text-muted-foreground">
              Diversidad en inventario
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa Conversión</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalVehicles > 0 ? ((sold / totalVehicles) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600 flex items-center gap-1">
                <TrendingDown className="h-3 w-3" />
                -2% vs mes anterior
              </span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MainInfo;
