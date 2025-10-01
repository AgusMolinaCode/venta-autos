import { WhatsApp } from "@/public/whatsapp";
import Link from "next/link";
import React from "react";

const Cta: React.FC = () => {
  return (
    <section className="bg-gray-100 dark:bg-gradient-to-b dark:from-neutral-800 dark:to-neutral-900 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          ¿Listo para encontrar tu próximo auto?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-800 dark:text-gray-100">
          Explora nuestro inventario de autos certificados y encuentra la mejor
          opción para ti
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/vehiculos">
            <button className="bg-emerald-300 dark:bg-emerald-700 hover:shadow-xl cursor-pointer dark:text-white text-gray-900 font-bold py-3 px-8 rounded-lg transition duration-200">
              Ver Todos los Autos
            </button>
          </Link>
          <Link href="https://wa.link/fxozkh" target="_blank" rel="noopener noreferrer">
            <button className="bg-gray-200 dark:bg-gray-800 border-2 dark:border-white border-gray-700 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 dark:text-white text-gray-800 font-bold py-3 px-8 rounded-lg">
              Whatsapp
              <WhatsApp className="inline-block w-6 h-6 ml-2 -mt-1" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Cta;
