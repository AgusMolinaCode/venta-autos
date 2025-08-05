"use client";

import { useVehicleStatusCache } from "@/hooks/use-vehicle-status-cache";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, BarChart3 } from "lucide-react";

interface StatusCacheStatsProps {
  className?: string;
}

const STATUS_CONFIG_FOR_STATS = {
  "preparación": {
    label: "Preparación",
    color: "bg-yellow-500"
  },
  "publicado": {
    label: "Publicado", 
    color: "bg-green-500"
  },
  "pausado": {
    label: "Pausado",
    color: "bg-gray-500"
  },
  "vendido": {
    label: "Vendido",
    color: "bg-blue-500"
  }
} as const;

export function StatusCacheStats({ className }: StatusCacheStatsProps) {
  const { getCacheStats, clearCache } = useVehicleStatusCache();
  
  const stats = getCacheStats();

  if (stats.total === 0) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Estados de Vehículos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            No hay estados personalizados guardados
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Estados de Vehículos
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearCache}
          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
          title="Limpiar cache de estados"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats.total}</div>
        <p className="text-xs text-muted-foreground mb-3">
          vehículos con estado personalizado
        </p>
        <div className="space-y-2">
          {Object.entries(stats.byStatus).map(([status, count]) => {
            const config = STATUS_CONFIG_FOR_STATS[status as keyof typeof STATUS_CONFIG_FOR_STATS];
            if (!config) return null;
            
            return (
              <div key={status} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${config.color}`} />
                  {config.label}
                </div>
                <span className="font-medium">{count}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}