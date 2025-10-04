import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  canGoPrev,
  canGoNext
}: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <nav
      className="flex items-center justify-center gap-2 mt-6 h-10"
      aria-label="Navegación de paginación"
    >
      {/* Previous Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrev}
        aria-label="Página anterior"
        className="h-8 w-8"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-gray-500 dark:text-gray-400"
              >
                ...
              </span>
            );
          }

          const pageNumber = page as number;
          const isActive = pageNumber === currentPage;

          return (
            <Button
              key={pageNumber}
              variant={isActive ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange(pageNumber)}
              aria-label={`Página ${pageNumber}`}
              aria-current={isActive ? 'page' : undefined}
              className="h-8 w-8"
            >
              {pageNumber}
            </Button>
          );
        })}
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        aria-label="Página siguiente"
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
