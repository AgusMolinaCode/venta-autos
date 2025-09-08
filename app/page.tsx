import { lazy, Suspense } from "react";
import Header from "@/components/landing/header/Header";
import Hero from "@/components/landing/hero/Hero";
import Search from "@/components/landing/search/Search";

// Lazy load below-the-fold components
const TopCars = lazy(
  () =>
    import(
      "@/components/landing/top-cars/TopCars"
    ),
);
const TopBrands = lazy(
  () =>
    import(
      "@/components/landing/top-brands/TopBrands"
    ),
);
const Services = lazy(
  () =>
    import(
      "@/components/landing/services/Services"
    ),
);
const Testimonials = lazy(
  () =>
    import(
      "@/components/landing/testimonials/Testimonials"
    ),
);
const Cta = lazy(
  () =>
    import(
      "@/components/landing/cta/Cta"
    ),
);
const Footer = lazy(
  () =>
    import(
      "@/components/landing/footer/Footer"
    ),
);

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-gradient-to-b from-blue-50 via-blue-100 to-indigo-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 mx-auto">
      <Hero />
      {/* <Search /> */}
      <Suspense
        fallback={
          <div className="min-h-[200px] bg-white/5 animate-pulse rounded-lg" />
        }
      >
        <TopCars />
      </Suspense>
      <Suspense
        fallback={
          <div className="min-h-[200px] bg-white/5 animate-pulse rounded-lg" />
        }
      >
        <TopBrands />
      </Suspense>
      <Suspense
        fallback={
          <div className="min-h-[200px] bg-white/5 animate-pulse rounded-lg" />
        }
      >
        <Services />
      </Suspense>
      <Suspense
        fallback={
          <div className="min-h-[200px] bg-white/5 animate-pulse rounded-lg" />
        }
      >
        <Testimonials />
      </Suspense>
      <Suspense
        fallback={
          <div className="min-h-[200px] bg-white/5 animate-pulse rounded-lg" />
        }
      >
        <Cta />
      </Suspense>
      <Suspense
        fallback={
          <div className="min-h-[200px] bg-white/5 animate-pulse rounded-lg" />
        }
      >
        <Footer />
      </Suspense>
    </div>
  );
}
