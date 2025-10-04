"use client";

import { useState, useMemo, useEffect } from 'react';

interface UsePaginationProps<T> {
  items: T[];
  itemsPerPage?: number;
}

interface UsePaginationReturn<T> {
  paginatedItems: T[];
  currentPage: number;
  totalPages: number;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}

export function usePagination<T>({
  items,
  itemsPerPage = 6
}: UsePaginationProps<T>): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(items.length / itemsPerPage);
  }, [items.length, itemsPerPage]);

  // Reset to page 1 when items change
  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);

  // Get items for current page
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  // Navigation functions
  const nextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToPage = (page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return {
    paginatedItems,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    canGoPrev,
    canGoNext
  };
}
