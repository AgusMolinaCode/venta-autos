"use client";

import Link from "next/link";
import Image from "next/image";
import { BRANDS } from "@/constants";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { cn } from "@/lib/utils";

interface BrandsSliderProps {
  className?: string;
  speed?: number;
  gap?: number;
}

export function BrandsSlider({
  className,
  speed = 50,
  gap = 24
}: BrandsSliderProps) {
  return (
    <div className={cn("w-full", className)}>
      <InfiniteSlider
        speed={speed}
        gap={gap}
        speedOnHover={20}
        className="py-4"
      >
        {BRANDS.map((brand, index) => (
          <Link
            key={`${brand.name}-${index}`}
            href={`/brands/${brand.name.toLowerCase().replace(/\s+/g, "-")}`}
            className="group relative flex-shrink-0 block"
          >
            <div className="relative h-16 w-24 overflow-hidden rounded-lg border border-border bg-background shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md">
              <Image
                src={brand.imageUrl}
                alt={`${brand.name} logo`}
                fill
                className="object-contain p-2 transition-all duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 96px, 96px"
              />
            </div>
            <div className="mt-1 text-center">
              <span className="text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                {brand.name}
              </span>
            </div>
          </Link>
        ))}
      </InfiniteSlider>
    </div>
  );
}