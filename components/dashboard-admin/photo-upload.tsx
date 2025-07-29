"use client";

import React from "react";
import { motion } from "framer-motion";
import { Upload, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FORM_CONFIG } from "@/constants";

interface PhotoUploadProps {
  uploadedFiles: File[];
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  maxFiles?: number;
}

export function PhotoUpload({ 
  uploadedFiles, 
  onFileUpload, 
  onRemoveFile, 
  maxFiles = FORM_CONFIG.maxFiles 
}: PhotoUploadProps) {
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
        <p className="text-gray-500 dark:text-zinc-500 text-sm mb-4">Máximo {maxFiles} fotos, formato JPG o PNG</p>
        <input
          type="file"
          multiple
          accept={FORM_CONFIG.imageFormats}
          onChange={onFileUpload}
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-video bg-gray-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
                  <span className="text-gray-600 dark:text-zinc-400 text-xs text-center p-2 truncate">
                    {file.name}
                  </span>
                </div>
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onRemoveFile(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}