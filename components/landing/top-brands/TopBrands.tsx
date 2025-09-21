import { InfiniteSlider } from "@/components/motion-primitives/infinite-slider";
import Image from "next/image";
import Link from "next/link";
import { BRANDS } from "@/constants";

function TopBrands() {
  return (
    <div className="container mx-auto py-26">
      <InfiniteSlider speedOnHover={10} speed={50} gap={24} className="py-2">
        {BRANDS.map((brand, index) => (
          <Link
            key={`${brand.name}-${index}`}
            href={`/marcas/${brand.name.toLowerCase().replace(/\s+/g, "-")}`}
            className="group relative flex-shrink-0 block p-1"
          >
            <div className="relative h-30 w-30 overflow-hidden rounded-full border border-border bg-white  shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md">
              <Image
                src={brand.imageUrl}
                alt={`${brand.name} logo`}
                fill
                className="object-contain p-2 transition-all duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 112px, 112px"
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

export default TopBrands;
