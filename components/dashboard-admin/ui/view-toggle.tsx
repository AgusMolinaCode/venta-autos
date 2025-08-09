"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Table2, Grid3x3 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ViewMode = 'table' | 'card';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  className?: string;
}

export function ViewToggle({ 
  viewMode, 
  onViewModeChange,
  className 
}: ViewToggleProps) {
  return (
    <div className={cn("inline-flex rounded-lg border bg-background p-1", className)}>
      <Button
        variant={viewMode === 'table' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('table')}
        className={cn(
          "h-8 px-3",
          viewMode === 'table' 
            ? "bg-primary text-primary-foreground shadow-sm" 
            : "hover:bg-muted"
        )}
      >
        <Table2 className="h-4 w-4" />
        <span className="ml-2 hidden sm:inline">Tabla</span>
      </Button>
      <Button
        variant={viewMode === 'card' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('card')}
        className={cn(
          "h-8 px-3",
          viewMode === 'card' 
            ? "bg-primary text-primary-foreground shadow-sm" 
            : "hover:bg-muted"
        )}
      >
        <Grid3x3 className="h-4 w-4" />
        <span className="ml-2 hidden sm:inline">Tarjetas</span>
      </Button>
    </div>
  );
}