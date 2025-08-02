"use client";

import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  price: number;
  currency: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "text-sm font-medium",
  md: "text-lg font-semibold",
  lg: "text-2xl font-bold",
};

export function PriceDisplay({
  price,
  currency,
  size = "md",
  className,
}: PriceDisplayProps) {
  const formatPrice = (
    price: number,
    currency: string,
  ) => {
    return new Intl.NumberFormat(
      "es-AR",
      {
        style: "currency",
        currency:
          currency === "USD"
            ? "USD"
            : "ARS",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      },
    ).format(price);
  };

  return (
    <span
      className={cn(
        sizeClasses[size],
        "font-bold text-md",
        className,
      )}
    >
      {formatPrice(price, currency)}
    </span>
  );
}
