"use client";

import React, { useState } from "react";
import { marcasAutos } from "@/constants";

const VehicleForm = () => {
  const [formData, setFormData] = useState({
    marca: "",
    modelo: "",
    ano: "",
    version: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.marca || !formData.modelo || !formData.ano) {
      alert("Por favor complete todos los campos");
      return;
    }
    
    console.log("Datos del vehículo:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="marca" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          Marca
        </label>
        <select
          id="marca"
          name="marca"
          value={formData.marca}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-200"
        >
          <option value="">Seleccionar marca</option>
          {marcasAutos.map((marca) => (
            <option key={marca} value={marca}>
              {marca}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label htmlFor="modelo" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          Modelo
        </label>
        <input
          id="modelo"
          name="modelo"
          type="text"
          value={formData.modelo}
          onChange={handleChange}
          placeholder="Ingrese el modelo"
          className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-200"
        />
      </div>
      
      <div>
        <label htmlFor="ano" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          Año
        </label>
        <input
          id="ano"
          name="ano"
          type="number"
          min="1900"
          max={new Date().getFullYear() + 1}
          value={formData.ano}
          onChange={handleChange}
          placeholder="Ingrese el año"
          className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-200"
        />
      </div>
      
      <div>
        <label htmlFor="version" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          Versión
        </label>
        <input
          id="version"
          name="version"
          type="text"
          value={formData.version}
          onChange={handleChange}
          placeholder="Ingrese la versión (opcional)"
          className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-200"
        />
      </div>
      
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        Guardar Datos
      </button>
    </form>
  );
};

export default VehicleForm;