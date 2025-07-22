"use client";

import React, { useState, useEffect } from "react";
import { scrapeVehicleData } from "@/lib/actions/scape-principal.actions";
import { scrapeVehicleVersions, VehicleVersion } from "@/lib/actions/versiones-vehiculo.actions";
import { scrapeVehicleYears, VehicleYear } from "@/lib/actions/year-vehiculo.actions";

const VehicleForm = () => {
  const [formData, setFormData] = useState({
    marca: "",
    modelo: "",
    ano: "",
    version: ""
  });

  const [years, setYears] = useState<VehicleYear[]>([]);
  const [loadingYears, setLoadingYears] = useState(false);
  const [showYears, setShowYears] = useState(false);
  
  const [versions, setVersions] = useState<VehicleVersion[]>([]);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [showVersions, setShowVersions] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.marca || !formData.modelo || !formData.ano) {
      alert("Por favor complete todos los campos");
      return;
    }
    
    try {
      await scrapeVehicleData(formData.marca, formData.modelo, formData.ano);
      console.log("Scraping completado");
    } catch (error) {
      console.error("Error en scraping:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Cargar años cuando marca y modelo están completos
  useEffect(() => {
    const loadYears = async () => {
      if (formData.marca && formData.modelo) {
        setLoadingYears(true);
        try {
          const yearsData = await scrapeVehicleYears(formData.marca, formData.modelo);
          setYears(yearsData.years);
          setShowYears(true);
        } catch (error) {
          console.error("Error cargando años:", error);
          setYears([]);
        } finally {
          setLoadingYears(false);
        }
      } else {
        setShowYears(false);
        setYears([]);
        setFormData(prev => ({ ...prev, ano: "", version: "" }));
      }
    };

    const debounceTimer = setTimeout(loadYears, 500);
    return () => clearTimeout(debounceTimer);
  }, [formData.marca, formData.modelo]);

  // Cargar versiones cuando marca, modelo y año están completos
  useEffect(() => {
    const loadVersions = async () => {
      if (formData.marca && formData.modelo && formData.ano) {
        setLoadingVersions(true);
        try {
          const versionsData = await scrapeVehicleVersions(formData.marca, formData.modelo, formData.ano);
          setVersions(versionsData.versions);
          setShowVersions(true);
        } catch (error) {
          console.error("Error cargando versiones:", error);
          setVersions([]);
        } finally {
          setLoadingVersions(false);
        }
      } else {
        setShowVersions(false);
        setVersions([]);
        setFormData(prev => ({ ...prev, version: "" }));
      }
    };

    const debounceTimer = setTimeout(loadVersions, 500);
    return () => clearTimeout(debounceTimer);
  }, [formData.marca, formData.modelo, formData.ano]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="marca" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          Marca
        </label>
        <input
          type="text"
          id="marca"
          name="marca"
          value={formData.marca}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-200"
          placeholder="Ej: Peugeot"
        />
      </div>
      
      <div>
        <label htmlFor="modelo" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          Modelo
        </label>
        <input
          type="text"
          id="modelo"
          name="modelo"
          value={formData.modelo}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-200"
          placeholder="Ej: 2008"
        />
      </div>
      
      {showYears && (
        <div>
          <label htmlFor="ano" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Año
          </label>
          {loadingYears ? (
            <div className="w-full px-3 py-2 border border-neutral-300 rounded-md bg-neutral-100 dark:bg-neutral-800 dark:border-neutral-600 text-neutral-500 dark:text-neutral-400">
              Cargando años...
            </div>
          ) : (
            <select
              id="ano"
              name="ano"
              value={formData.ano}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-200"
            >
              <option value="">Seleccionar año</option>
              {years.map((yearItem, index) => (
                <option key={index} value={yearItem.year}>
                  {yearItem.year} ({yearItem.resultsCount} resultados)
                </option>
              ))}
            </select>
          )}
        </div>
      )}
      
      {showVersions && (
        <div>
          <label htmlFor="version" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Versión
          </label>
          {loadingVersions ? (
            <div className="w-full px-3 py-2 border border-neutral-300 rounded-md bg-neutral-100 dark:bg-neutral-800 dark:border-neutral-600 text-neutral-500 dark:text-neutral-400">
              Cargando versiones...
            </div>
          ) : (
            <select
              id="version"
              name="version"
              value={formData.version}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-200"
            >
              <option value="">Todos</option>
              {versions.map((version, index) => (
                <option key={index} value={version.name}>
                  {version.name} ({version.resultsCount} resultados)
                </option>
              ))}
            </select>
          )}
        </div>
      )}
      
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        Scrapear Datos
      </button>
    </form>
  );
};

export default VehicleForm;