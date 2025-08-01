"use client";

import { TableCell, TableRow } from "@/components/ui/table";

export function VehicleTableRowSkeleton() {
  return (
    <TableRow className="animate-pulse">
      <TableCell>
        <div className="w-12 h-12 bg-muted rounded-md" />
      </TableCell>
      <TableCell>
        <div className="h-4 bg-muted rounded-md w-20" />
      </TableCell>
      <TableCell>
        <div className="h-4 bg-muted rounded-md w-24" />
      </TableCell>
      <TableCell>
        <div className="h-4 bg-muted rounded-md w-20" />
      </TableCell>
      <TableCell>
        <div className="h-4 bg-muted rounded-md w-12 mx-auto" />
      </TableCell>
      <TableCell>
        <div className="h-4 bg-muted rounded-md w-20 ml-auto" />
      </TableCell>
      <TableCell>
        <div className="h-4 bg-muted rounded-md w-16 ml-auto" />
      </TableCell>
      <TableCell>
        <div className="h-6 bg-muted rounded-full w-16 mx-auto" />
      </TableCell>
      <TableCell>
        <div className="w-8 h-8 bg-muted rounded-md" />
      </TableCell>
    </TableRow>
  );
}