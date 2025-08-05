"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Column } from "@tanstack/react-table";
import { cn } from "@/lib/utils";

interface SortableHeaderProps<TData> {
  column: Column<TData, unknown>;
  children: React.ReactNode;
  className?: string;
}

export function SortableHeader<TData>({ 
  column, 
  children, 
  className 
}: SortableHeaderProps<TData>) {
  const sortDirection = column.getIsSorted();

  const getSortIcon = () => {
    if (sortDirection === "asc") {
      return <ArrowUp className="ml-2 h-4 w-4" />;
    }
    if (sortDirection === "desc") {
      return <ArrowDown className="ml-2 h-4 w-4" />;
    }
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };

  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(sortDirection === "asc")}
      className={cn(
        "h-auto p-0 font-medium hover:bg-transparent hover:text-accent-foreground",
        "justify-start",
        className
      )}
    >
      {children}
      {getSortIcon()}
    </Button>
  );
}