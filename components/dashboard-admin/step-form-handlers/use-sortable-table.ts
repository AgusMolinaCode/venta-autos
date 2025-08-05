"use client";

import { useState } from 'react';
import { 
  SortingState, 
  getSortedRowModel, 
  ColumnDef, 
  useReactTable, 
  getCoreRowModel 
} from '@tanstack/react-table';
import { VehiculoConFotos } from '@/lib/supabase';

interface UseSortableTableProps {
  data: VehiculoConFotos[];
  columns: ColumnDef<VehiculoConFotos>[];
}

export function useSortableTable({ data, columns }: UseSortableTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  // Helper para obtener datos ordenados sin usar el table object
  const getSortedData = () => {
    if (sorting.length === 0) return data;
    
    const sortedData = [...data];
    
    sorting.forEach((sort) => {
      const { id, desc } = sort;
      
      sortedData.sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;
        
        switch (id) {
          case 'marca':
            aValue = a.marca.toLowerCase();
            bValue = b.marca.toLowerCase();
            break;
          case 'kilometraje':
            // Ordenar por kilometraje numérico (manejar valores null/undefined)
            aValue = a.kilometraje || 0;
            bValue = b.kilometraje || 0;
            break;
          case 'estado':
            // Ordenar estados por prioridad lógica
            aValue = getEstadoPriority(a.estado);
            bValue = getEstadoPriority(b.estado);
            break;
          default:
            // Para otros campos, usar string o number por defecto
            aValue = String((a as Record<string, unknown>)[id] || '');
            bValue = String((b as Record<string, unknown>)[id] || '');
        }
        
        if (aValue < bValue) return desc ? 1 : -1;
        if (aValue > bValue) return desc ? -1 : 1;
        return 0;
      });
    });
    
    return sortedData;
  };

  return {
    table,
    sorting,
    setSorting,
    getSortedData,
  };
}

// Helper function para obtener prioridad de estados (orden lógico del workflow)
function getEstadoPriority(estado: 'preparación' | 'publicado' | 'pausado' | 'vendido'): number {
  const priorities = {
    'preparación': 1,  // Fase inicial
    'publicado': 2,    // Activo en venta
    'pausado': 3,      // Temporalmente inactivo
    'vendido': 4       // Fase final
  };
  return priorities[estado] || 0;
}