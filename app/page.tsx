import Header from "@/components/landing/header/Header";
import Hero from "@/components/landing/hero/Hero";
import Search from "@/components/landing/search/Search";
import TopCars from "@/components/landing/top-cars/TopCars";
import TopBrands from "@/components/landing/top-brands/TopBrands";
import Services from "@/components/landing/services/Services";
import Testimonials from "@/components/landing/testimonials/Testimonials";
import Cta from "@/components/landing/cta/Cta";
import Footer from "@/components/landing/footer/Footer";

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-gradient-to-b from-blue-50 via-blue-100 to-indigo-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      <Header />
      <Hero />
      <Search />
      <TopCars />
      <TopBrands />
      <Services />
      <Testimonials />
      <Cta />
      <Footer />
    </div>
  );
}
