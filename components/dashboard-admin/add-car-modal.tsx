"use client";

import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VehicleFormInputSchema, PriceSchema } from "@/lib/validations";
import { z } from "zod";
import { toast } from "sonner";
import { ProgressBar } from "./progress-bar";
import { VehicleInfoForm } from "./vehicle-info-form";
import { PriceFormModal } from "./price-form-modal";
import { PhotoUpload } from "./photo-upload";
import { ModalNavigation } from "./modal-navigation";

interface AddCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: CombinedFormData) => void;
}

// Simplified schema for AddCarModal - only marca, modelo, año required
const AddCarStep1Schema = VehicleFormInputSchema.extend({
  ano: z.number().min(1970, {
    message: "El año debe ser mayor a 1970.",
  }).max(2025, {
    message: "El año no puede ser mayor a 2025.",
  }),
});

type VehicleFormData = z.infer<typeof AddCarStep1Schema>;

// Step 2: Price Information
const Step2Schema = PriceSchema;
type PriceFormData = z.infer<typeof Step2Schema>;

// Combined data type for the callback
type CombinedFormData = VehicleFormData & PriceFormData;



export function AddCarModal({ isOpen, onClose, onSubmit }: AddCarModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [step1Data, setStep1Data] = useState<VehicleFormData | null>(null);

  // Form for Step 1 - Vehicle Information
  const vehicleForm = useForm<VehicleFormData>({
    resolver: zodResolver(AddCarStep1Schema),
    defaultValues: {
      marca: "",
      modelo: "",
      ano: undefined,
      kilometraje: undefined,
      version: "",
      combustible: "",
      transmision: "",
      color: "",
      descripcion: "",
    },
  });

  // Form for Step 2 - Price Information
  const priceForm = useForm<PriceFormData>({
    resolver: zodResolver(Step2Schema),
    defaultValues: {
      precio: undefined,
      moneda: "ARS",
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (uploadedFiles.length + files.length > 10) {
      toast.error("Máximo 10 fotos permitidas");
      return;
    }
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStep1Submit = (data: VehicleFormData) => {
    // Only validate required fields: marca, modelo, año
    if (!data.marca || !data.modelo || !data.ano) {
      toast.error("Complete los campos obligatorios: marca, modelo y año");
      return;
    }
    
    const dataWithDefaults = data;
    
    console.log("Step 1 data validated:", dataWithDefaults);
    setStep1Data(dataWithDefaults);
    setCurrentStep(2);
    // toast.success("Información del vehículo guardada ✓");
  };

  const handleStep2Submit = (data: PriceFormData) => {
    if (!step1Data) {
      toast.error("Error: datos del paso 1 no encontrados");
      return;
    }

    const finalData = { ...step1Data, ...data } as CombinedFormData;
    console.log("Datos completos del formulario:", finalData);
    console.log("Archivos subidos:", uploadedFiles);
    
    if (onSubmit) {
      onSubmit(finalData);
    }
    
    // Reset forms and state
    vehicleForm.reset();
    priceForm.reset();
    setStep1Data(null);
    setUploadedFiles([]);
    setCurrentStep(1);
    
    // toast.success("Vehículo agregado exitosamente");
    onClose();
  };


  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleModalClose = () => {
    vehicleForm.reset();
    priceForm.reset();
    setStep1Data(null);
    setUploadedFiles([]);
    setCurrentStep(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700">
          <CardHeader className="flex flex-row items-center justify-between border-b border-gray-200 dark:border-zinc-700">
            <div>
              <CardTitle className="text-xl text-gray-900 dark:text-white">Agregar Nuevo Auto</CardTitle>
              <p className="text-gray-600 dark:text-zinc-400 mt-1">Paso {currentStep} de 3</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleModalClose} className="text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="p-6">
            <ProgressBar currentStep={currentStep} />

            {/* Step 1: Vehicle Information */}
            {currentStep === 1 && (
              <VehicleInfoForm 
                form={vehicleForm} 
                onSubmit={handleStep1Submit} 
              />
            )}

            {/* Step 2: Price Information */}
            {currentStep === 2 && (
              <PriceFormModal 
                form={priceForm} 
                onSubmit={handleStep2Submit}
                vehicleData={step1Data}
              />
            )}

            {/* Step 3: Fotos */}
            {currentStep === 3 && (
              <PhotoUpload 
                uploadedFiles={uploadedFiles}
                onFileUpload={handleFileUpload}
                onRemoveFile={removeFile}
              />
            )}

            <ModalNavigation
              currentStep={currentStep}
              onPrevStep={prevStep}
              onClose={handleModalClose}
              onNextStep={currentStep === 1 ? vehicleForm.handleSubmit(handleStep1Submit) : 
                        currentStep === 2 ? priceForm.handleSubmit(handleStep2Submit) : undefined}
              onSubmit={currentStep === 3 ? () => {
                if (!step1Data) {
                  toast.error("Error: datos del vehículo no encontrados");
                  setCurrentStep(1);
                  return;
                }
                
                const priceData = priceForm.getValues();
                const finalData = { ...step1Data, ...priceData } as CombinedFormData;
                console.log("Datos completos del formulario:", finalData);
                console.log("Archivos subidos:", uploadedFiles);
                
                if (onSubmit) {
                  onSubmit(finalData);
                }
                
                // Reset forms and state
                vehicleForm.reset();
                priceForm.reset();
                setStep1Data(null);
                setUploadedFiles([]);
                setCurrentStep(1);
                
                toast.success("Vehículo agregado exitosamente");
                handleModalClose();
              } : undefined}
              isValid={currentStep === 1 ? vehicleForm.formState.isValid : true}
              isLastStep={currentStep === 3}
              nextButtonText={currentStep === 2 ? "Continuar a Fotos →" : "Siguiente →"}
            />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}