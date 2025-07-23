import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-800 text-white">
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Encuentra tu auto usado ideal
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Calidad garantizada, precios competitivos y financiamiento accesible
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg">
              Ver Inventario
            </button>
            <button className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-800 text-white font-bold py-4 px-8 rounded-lg transition duration-300 transform hover:scale-105">
              Solicitar Financiamiento
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;