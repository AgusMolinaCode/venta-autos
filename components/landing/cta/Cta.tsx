import React from 'react';

const Cta: React.FC = () => {
  return (
    <section className="bg-gray-100 dark:bg-gradient-to-b dark:from-neutral-800 dark:to-neutral-900 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">¿Listo para encontrar tu próximo auto?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-800 dark:text-gray-100">Explora nuestro inventario de autos certificados y encuentra la mejor opción para ti</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition duration-300">
            Ver Todo el Inventario
          </button>
          <button className="bg-transparent border-2 border-white cursor-pointer hover:bg-gray-900 text-white font-bold py-3 px-8 rounded-lg">
            Agenda una Cita
          </button>
        </div>
      </div>
    </section>
  );
};

export default Cta;