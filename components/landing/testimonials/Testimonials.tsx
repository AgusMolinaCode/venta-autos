import React from 'react';

const Testimonials: React.FC = () => {
  // Testimonial data array
  const testimonials = [
    {
      id: 1,
      name: "Carlos Rodríguez",
      rating: 5,
      comment: "Excelente servicio, encontré el auto que buscaba a un precio justo. El proceso de financiamiento fue rápido y sin complicaciones."
    },
    {
      id: 2,
      name: "María González",
      rating: 5,
      comment: "Compré mi primer auto usado aquí y me sentiría completamente segura recomendándolos a familiares y amigos. Gran atención al cliente."
    }
  ];

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Lo que dicen nuestros clientes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
              <div className="ml-4">
                <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                <div className="flex text-yellow-400">
                  {'★ '.repeat(testimonial.rating)}
                </div>
              </div>
            </div>
            <p className="text-gray-600 italic">&ldquo;{testimonial.comment}&rdquo;</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;