import React from 'react';

const TopBrands: React.FC = () => {
  // Brand data array
  const brands = [
    {
      id: 1,
      name: "Toyota",
      letter: "T",
      gradient: "from-blue-500 to-blue-700"
    },
    {
      id: 2,
      name: "BMW",
      letter: "B",
      gradient: "from-blue-600 to-indigo-700"
    },
    {
      id: 3,
      name: "Honda",
      letter: "H",
      gradient: "from-sky-500 to-blue-600"
    },
    {
      id: 4,
      name: "Audi",
      letter: "A",
      gradient: "from-indigo-500 to-purple-600"
    },
    {
      id: 5,
      name: "Mercedes",
      letter: "M",
      gradient: "from-blue-700 to-indigo-800"
    },
    {
      id: 6,
      name: "Lexus",
      letter: "L",
      gradient: "from-sky-600 to-blue-700"
    }
  ];

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-4xl font-bold text-center text-blue-900 mb-12">
        Las 6 Mejores Marcas
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
        {brands.map((brand) => (
          <div key={brand.id} className="flex flex-col items-center group cursor-pointer">
            <div className={`w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br ${brand.gradient} rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transform group-hover:scale-110 transition duration-300`}>
              <span className="text-white text-2xl md:text-3xl font-bold">{brand.letter}</span>
            </div>
            <h3 className="text-lg font-bold text-blue-800 mt-4 group-hover:text-blue-600 transition duration-300">{brand.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopBrands;