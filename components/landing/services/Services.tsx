import React from 'react';

const Services: React.FC = () => {
  // Service data array
  const services = [
    {
      id: 1,
      title: "Garantía Extendida",
      description: "Todos nuestros autos vienen con garantía mecánica de 6 meses o 10,000 km.",
      gradient: "from-blue-500 to-indigo-600",
      iconPath: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    },
    {
      id: 2,
      title: "Financiamiento Flexible",
      description: "Opciones de financiamiento adaptadas a tu presupuesto con tasas competitivas.",
      gradient: "from-blue-600 to-indigo-700",
      iconPath: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    },
    {
      id: 3,
      title: "Inspección Gratuita",
      description: "Cada vehículo pasa por una inspección mecánica rigurosa antes de la venta.",
      gradient: "from-indigo-500 to-purple-600",
      iconPath: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
    }
  ];

  return (
    <section className="py-26">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center dark:text-gray-100 text-gray-900 underline mb-12">Nuestros Servicios</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="text-center p-8 bg-white dark:bg-neutral-800 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-2"
            >
              <div className={`w-20 h-20 bg-gradient-to-br ${service.gradient} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={service.iconPath} />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-blue-900 dark:text-gray-100 mb-3">{service.title}</h3>
              <p className="text-blue-700 dark:text-gray-300">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;