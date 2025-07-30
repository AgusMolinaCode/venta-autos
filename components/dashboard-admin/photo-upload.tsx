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
}

export function PhotoUpload({ 
  uploadedFiles, 
  onFileUpload, 
  onRemoveFile, 
  maxFiles = 3 
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
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subir Fotos</h3>

      <div className="border-2 border-dashed border-gray-300 dark:border-zinc-600 rounded-lg p-8 text-center hover:border-blue-400 dark:hover:border-blue-400 transition-colors">
        <Upload className="h-12 w-12 text-gray-400 dark:text-zinc-400 mx-auto mb-4" />
        <p className="text-gray-700 dark:text-zinc-300 mb-2">Arrastra las fotos aquí o haz clic para seleccionar</p>
        <p className="text-gray-500 dark:text-zinc-500 text-sm mb-4">
          <span className="text-red-500 font-medium">*</span> Mínimo 1 foto requerida, máximo {maxFiles} fotos • Formato JPG o PNG
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
          Seleccionar Fotos
        </Button>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-gray-700 dark:text-zinc-300 font-medium">
            Fotos seleccionadas ({uploadedFiles.length}/{maxFiles}):
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