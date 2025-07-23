import React from 'react';

const TopCars: React.FC = () => {
  // Car data array
  const cars = [
    {
      id: 1,
      title: "Toyota Camry 2022",
      details: "Automática • 25,000 km",
      price: "$22,500",
      gradient: "from-blue-500 to-indigo-600",
      gradientInner: "from-blue-400 to-blue-600"
    },
    {
      id: 2,
      title: "BMW Serie 3 2021",
      details: "Automática • 18,000 km",
      price: "$32,900",
      gradient: "from-blue-600 to-indigo-600",
      gradientInner: "from-blue-500 to-blue-700"
    },
    {
      id: 3,
      title: "Honda Accord 2022",
      details: "Automática • 22,000 km",
      price: "$27,800",
      gradient: "from-sky-500 to-blue-600",
      gradientInner: "from-sky-400 to-blue-500"
    },
    {
      id: 4,
      title: "Audi A4 2021",
      details: "Automática • 20,000 km",
      price: "$29,500",
      gradient: "from-indigo-500 to-purple-600",
      gradientInner: "from-indigo-400 to-purple-500"
    },
    {
      id: 5,
      title: "Mercedes C300 2021",
      details: "Automática • 15,000 km",
      price: "$35,900",
      gradient: "from-blue-700 to-indigo-800",
      gradientInner: "from-blue-600 to-indigo-700"
    },
    {
      id: 6,
      title: "Lexus ES 2022",
      details: "Automática • 12,000 km",
      price: "$38,500",
      gradient: "from-sky-600 to-blue-700",
      gradientInner: "from-sky-500 to-blue-600"
    }
  ];

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-4xl font-bold text-center text-blue-900 mb-12">
        Los 6 Mejores Autos
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {cars.map((car) => (
          <div 
            key={car.id} 
            className={`bg-gradient-to-br ${car.gradient} rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition duration-300`}
          >
            <div className={`bg-gradient-to-br ${car.gradientInner} border-2 border-white/20 rounded-xl w-full h-56 m-4 mb-0`} />
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">{car.title}</h3>
              <p className="text-blue-100 mb-3">{car.details}</p>
              <p className="text-3xl font-bold text-white mb-4">{car.price}</p>
              <button className="w-full bg-white text-blue-800 font-bold py-3 px-4 rounded-lg hover:bg-blue-50 transition duration-300">
                Ver Auto
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopCars;