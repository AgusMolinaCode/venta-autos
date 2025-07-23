import React from 'react';

const Search: React.FC = () => {
  return (
    <section className="bg-white shadow-md -mt-10 mx-4 md:mx-20 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Busca tu auto perfecto</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-gray-700 mb-2">Marca</label>
          <select className="w-full p-3 border border-gray-300 rounded-lg">
            <option>Todas las marcas</option>
            <option>Toyota</option>
            <option>Honda</option>
            <option>Ford</option>
            <option>Chevrolet</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Modelo</label>
          <select className="w-full p-3 border border-gray-300 rounded-lg">
            <option>Todos los modelos</option>
            <option>Camry</option>
            <option>Civic</option>
            <option>F-150</option>
            <option>Malibu</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Precio Máximo</label>
          <select className="w-full p-3 border border-gray-300 rounded-lg">
            <option>Cualquier precio</option>
            <option>$10,000</option>
            <option>$15,000</option>
            <option>$20,000</option>
            <option>$25,000</option>
          </select>
        </div>
        <div className="flex items-end">
          <button className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg transition duration-300">
            Buscar
          </button>
        </div>
      </div>
    </section>
  );
};

export default Search;