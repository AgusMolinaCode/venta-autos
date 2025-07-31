"use client";

import React from "react";
import { motion } from "framer-motion";
import { Upload, Plus, X, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FORM_CONFIG } from "@/constants";

interface PhotoUploadProps {
  uploadedFiles: File[];
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>, maxFiles?: number) => void;
  onRemoveFile: (index: number) => void;
  maxFiles?: number;
  existingPhotos?: Array<{
    id?: string;
    file_name: string;
    storage_path: string;
    is_primary?: boolean;
  }>;
  isEditMode?: boolean;
}

export function PhotoUpload({ 
  uploadedFiles, 
  onFileUpload, 
  onRemoveFile, 
  maxFiles = 3,
  existingPhotos = [],
  isEditMode = false
}: PhotoUploadProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFileUpload(event, maxFiles);
  };

  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return mb < 0.1 ? '< 0.1 MB' : `${mb.toFixed(1)} MB`;
  };

  const getFileExtension = (filename: string): string => {
    return filename.split('.').pop()?.toUpperCase() || 'DESCONOCIDO';
  };
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      className="space-y-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {isEditMode ? 'Gestionar Fotos' : 'Subir Fotos'}
      </h3>

      {/* Mensaje informativo para modo edición */}
      {isEditMode && existingPhotos.length > 0 && uploadedFiles.length === 0 && (
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <FileImage className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                📸 Fotos Actuales
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Este vehículo tiene <strong>{existingPhotos.length} foto(s)</strong> actualmente. 
                {' '}Si no subes nuevas fotos, se mantendrán las existentes.
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                💡 <strong>Tip:</strong> Si subes nuevas fotos, reemplazarán completamente a las actuales.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mostrar fotos existentes cuando no hay archivos nuevos */}
      {isEditMode && existingPhotos.length > 0 && uploadedFiles.length === 0 && (
        <div className="space-y-3">
          <h4 className="text-gray-700 dark:text-zinc-300 font-medium">
            Fotos actuales ({existingPhotos.length}):
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {existingPhotos.map((photo, index) => (
              <div 
                key={photo.id || `existing-${index}`} 
                className="relative bg-gray-50 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 p-3"
              >
                <div className="flex items-center space-x-2">
                  <FileImage className="h-4 w-4 text-green-500 dark:text-green-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate" 
                       title={photo.file_name}>
                      {photo.file_name}
                    </p>
                    {photo.is_primary && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 mt-1">
                        Principal
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-2 border-dashed border-gray-300 dark:border-zinc-600 rounded-lg p-8 text-center hover:border-blue-400 dark:hover:border-blue-400 transition-colors">
        <Upload className="h-12 w-12 text-gray-400 dark:text-zinc-400 mx-auto mb-4" />
        <p className="text-gray-700 dark:text-zinc-300 mb-2">
          {isEditMode && existingPhotos.length > 0 && uploadedFiles.length === 0
            ? 'Subir nuevas fotos (opcional - reemplazará las actuales)'
            : 'Arrastra las fotos aquí o haz clic para seleccionar'
          }
        </p>
        <p className="text-gray-500 dark:text-zinc-500 text-sm mb-4">
          {isEditMode && existingPhotos.length > 0 && uploadedFiles.length === 0 ? (
            <>Opcional • Si subes fotos, reemplazarán las {existingPhotos.length} actuales • Máximo {maxFiles} fotos • Formato JPG o PNG</>
          ) : (
            <><span className="text-red-500 font-medium">*</span> Mínimo 1 foto requerida, máximo {maxFiles} fotos • Formato JPG o PNG</>
          )}
        </p>
        <input
          type="file"
          multiple
          max={maxFiles}
          accept={FORM_CONFIG.imageFormats}
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById("file-upload")?.click()}
          className="border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
        >
          <Plus className="h-4 w-4 mr-2" />
          {isEditMode && existingPhotos.length > 0 && uploadedFiles.length === 0 
            ? 'Cambiar Fotos' 
            : 'Seleccionar Fotos'
          }
        </Button>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          {isEditMode && existingPhotos.length > 0 && (
            <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 mb-4">
              <p className="text-sm text-orange-800 dark:text-orange-200">
                ⚠️ <strong>Atención:</strong> Las nuevas fotos reemplazarán completamente a las {existingPhotos.length} fotos actuales.
              </p>
            </div>
          )}
          <h4 className="text-gray-700 dark:text-zinc-300 font-medium">
            {isEditMode && existingPhotos.length > 0 
              ? `Nuevas fotos (${uploadedFiles.length}/${maxFiles}) - Reemplazarán las actuales:`
              : `Fotos seleccionadas (${uploadedFiles.length}/${maxFiles}):`
            }
          </h4>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <FileImage className="h-5 w-5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate" title={file.name}>
                      {file.name}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-zinc-400 mt-1">
                      <span className="flex items-center">
                        <span className="font-medium">Formato:</span>
                        <span className="ml-1 px-2 py-0.5 bg-gray-200 dark:bg-zinc-600 rounded text-xs font-medium">
                          {getFileExtension(file.name)}
                        </span>
                      </span>
                      <span className="flex items-center">
                        <span className="font-medium">Tamaño:</span>
                        <span className="ml-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">
                          {formatFileSize(file.size)}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-8 w-8 p-0 flex-shrink-0 ml-3"
                  onClick={() => onRemoveFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}