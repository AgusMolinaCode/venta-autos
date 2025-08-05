"use client";

import React from "react";
import {
  Search,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { VehiculoConFotos } from "@/lib/supabase";

interface BuscadorProps {
  onSearch: (
    filteredVehicles: VehiculoConFotos[],
  ) => void;
  placeholder?: string;
  vehicles: VehiculoConFotos[];
  className?: string;
  searchValue?: string;
  onSearchChange?: (
    value: string,
  ) => void;
}

export default function Buscador({
  onSearch,
  placeholder = "Buscar por marca, modelo o año...",
  vehicles,
  className = "",
  searchValue: externalSearchValue,
  onSearchChange,
}: BuscadorProps) {
  const [
    internalSearchValue,
    setInternalSearchValue,
  ] = React.useState("");
  const [isSearching, setIsSearching] =
    React.useState(false);

  // Use external search value if provided, otherwise use internal state
  const searchValue =
    externalSearchValue !== undefined
      ? externalSearchValue
      : internalSearchValue;
  const setSearchValue =
    onSearchChange ||
    setInternalSearchValue;

  // Debounced search effect
  React.useEffect(() => {
    if (!searchValue.trim()) {
      onSearch(vehicles);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(() => {
      performSearch(searchValue);
      setIsSearching(false);
    }, 300);

    return () =>
      clearTimeout(timeoutId);
  }, [searchValue, vehicles, onSearch]);

  const performSearch = (
    query: string,
  ) => {
    const searchTerm = query
      .toLowerCase()
      .trim();

    if (!searchTerm) {
      onSearch(vehicles);
      return;
    }

    const filtered = vehicles.filter(
      (vehicle) => {
        const marca =
          vehicle.marca?.toLowerCase() ||
          "";
        const modelo =
          vehicle.modelo?.toLowerCase() ||
          "";
        const ano =
          vehicle.ano?.toString() || "";
        const version =
          vehicle.version?.toLowerCase() ||
          "";
        const color =
          vehicle.color?.toLowerCase() ||
          "";

        return (
          marca.includes(searchTerm) ||
          modelo.includes(searchTerm) ||
          ano.includes(searchTerm) ||
          version.includes(
            searchTerm,
          ) ||
          color.includes(searchTerm)
        );
      },
    );

    onSearch(filtered);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchValue(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    onSearch(vehicles);
  };

  const hasSearchValue =
    searchValue.trim().length > 0;

  return (
    <div
      className={`relative flex items-center ${className}`}
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={handleInputChange}
          className="pl-10 pr-10 w-64 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
        />
        {hasSearchValue && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {isSearching && (
        <div className="ml-2 absolute right-7">
          <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full" />
        </div>
      )}
    </div>
  );
}
