"use client";

import React, { useState, useCallback } from "react";
import { marcasAutos } from "@/constants";
import { IconX, IconUpload, IconCar } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const VehicleModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    marca: "",
    modelo: "",
    ano: "",
    version: "",
    precio: "",
    kilometraje: "",
    combustible: "",
    transmision: "",
    color: "",
    descripcion: "",
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.marca || !formData.modelo || !formData.ano || !formData.precio) {
      alert("Por favor complete todos los campos obligatorios");
      return;
    }
    
    console.log("Datos del vehículo:", formData);
    console.log("Fotos:", photos);
    
    // Reset form and close modal
    setFormData({
      marca: "",
      modelo: "",
      ano: "",
      version: "",
      precio: "",
      kilometraje: "",
      combustible: "",
      transmision: "",
      color: "",
      descripcion: "",
    });
    setPhotos([]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    setPhotos(prev => [...prev, ...imageFiles]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setPhotos(prev => [...prev, ...files]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center gap-2">
          <IconCar className="h-5 w-5" />
          Agregar Vehículo
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Vehículo</DialogTitle>
          <DialogDescription>
            Complete la información del vehículo que desea agregar al inventario.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="marca" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Marca *
              </label>
              <select
                id="marca"
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-200"
                required
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
                Modelo *
              </label>
              <input
                id="modelo"
                name="modelo"
                type="text"
                value={formData.modelo}
                onChange={handleChange}
                placeholder="Ingrese el modelo"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-200"
                required
              />
            </div>

            <div>
              <label htmlFor="ano" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Año *
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
                required
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
                placeholder="Ingrese la versión"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-200"
              />
            </div>

            <div>
              <label htmlFor="precio" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Precio *
              </label>
              <input
                id="precio"
                name="precio"
                type="number"
                value={formData.precio}
                onChange={handleChange}
                placeholder="Precio en USD"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-200"
                required
              />
            </div>

            <div>
              <label htmlFor="kilometraje" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Kilometraje
              </label>
              <input
                id="kilometraje"
                name="kilometraje"
                type="number"
                value={formData.kilometraje}
                onChange={handleChange}
                placeholder="Kilometraje"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-200"
              />
            </div>

            <div>
              <label htmlFor="combustible" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Combustible
              </label>
              <select
                id="combustible"
                name="combustible"
                value={formData.combustible}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-200"
              >
                <option value="">Seleccionar combustible</option>
                <option value="nafta">Nafta</option>
                <option value="diesel">Diesel</option>
                <option value="gnc">GNC</option>
                <option value="electrico">Eléctrico</option>
                <option value="hibrido">Híbrido</option>
              </select>
            </div>

            <div>
              <label htmlFor="transmision" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Transmisión
              </label>
              <select
                id="transmision"
                name="transmision"
                value={formData.transmision}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-200"
              >
                <option value="">Seleccionar transmisión</option>
                <option value="manual">Manual</option>
                <option value="automatica">Automática</option>
                <option value="cvt">CVT</option>
              </select>
            </div>

            <div>
              <label htmlFor="color" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Color
              </label>
              <input
                id="color"
                name="color"
                type="text"
                value={formData.color}
                onChange={handleChange}
                placeholder="Color del vehículo"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-200"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Descripción detallada del vehículo..."
              rows={4}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-200"
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Fotos del Vehículo
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragOver
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-neutral-300 dark:border-neutral-600"
              }`}
            >
              <IconUpload className="h-12 w-12 mx-auto text-neutral-400 mb-4" />
              <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                Arrastra y suelta las fotos aquí, o
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 cursor-pointer inline-block"
              >
                Seleccionar archivos
              </label>
            </div>

            {/* Photo Preview */}
            {photos.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <IconX className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-neutral-200 dark:border-neutral-700">
            <DialogTrigger asChild>
              <button
                type="button"
                className="px-6 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
            </DialogTrigger>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Guardar Vehículo
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleModal;