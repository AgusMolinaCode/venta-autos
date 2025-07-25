import React from 'react';

const Cta: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">¿Listo para encontrar tu próximo auto?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">Explora nuestro inventario de más de 200 autos certificados y encuentra la mejor opción para ti</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition duration-300">
            Ver Todo el Inventario
          </button>
          <button className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-800 text-white font-bold py-3 px-8 rounded-lg transition duration-300">
            Agenda una Cita
          </button>
        </div>
      </div>
    </section>
  );
};

export default Cta;