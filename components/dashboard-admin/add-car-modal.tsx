"use client";

import type React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { z } from "zod";
import {
  VehicleFormInputSchema,
  PriceSchema,
} from "@/lib/validations";
import { ProgressBar } from "./progress-bar";
import { VehicleInfoForm } from "./vehicle-info-form";
import { PhotoUpload } from "./photo-upload";
import { ModalNavigation } from "./modal-navigation";
import { PriceFormModal } from "./price-form-modal";
import { useCarFormState } from "./hooks/use-car-form-state";
import { VehiculoConFotos } from "@/lib/supabase";

interface AddCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (
    data: CombinedFormData,
  ) => void;
  onSuccess?: () => void;
  editingVehicle?: VehiculoConFotos;
}

// Types
type VehicleFormData = z.infer<
  typeof VehicleFormInputSchema
> & { ano: number };
type PriceFormData = z.infer<
  typeof PriceSchema
>;
type CombinedFormData =
  VehicleFormData & PriceFormData;

function AddCarModal({
  isOpen,
  onClose,
  onSubmit,
  onSuccess,
  editingVehicle,
}: AddCarModalProps) {
  const {
    // Estado
    currentStep,

    vehicleData,
    uploadedFiles,
    isSubmitting,
    // Forms
    vehicleForm,
    priceForm,
    setCurrentStep,
    handleStep1Submit,
    handleStep2Submit,
    handleFinalSubmit,
    handleFileUpload,
    removeFile,
    resetForm,
    // Validaciones
    canProceedToNextStep,
  } = useCarFormState(
    onSubmit,
    onSuccess || onClose,
    editingVehicle,
  );

  const prevStep = () => {
    if (currentStep > 1)
      setCurrentStep(currentStep - 1);
  };

  const handleModalClose = () => {
    resetForm();
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
        initial={{
          scale: 0.9,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        exit={{
          scale: 0.9,
          opacity: 0,
        }}
        transition={{
          type: "spring",
          duration: 0.5,
        }}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <Card className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700">
          <CardHeader className="flex flex-row items-center justify-between border-b border-gray-200 dark:border-zinc-700">
            <div>
              <CardTitle className="text-xl text-gray-900 dark:text-white">
                {editingVehicle
                  ? "Editar Vehículo"
                  : "Agregar Nuevo Auto"}
              </CardTitle>
              <p className="text-gray-600 dark:text-zinc-400 mt-1">
                Paso {currentStep} de 3
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleModalClose}
              className="text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="p-6">
            <ProgressBar
              currentStep={currentStep}
            />

            {/* Step 1: Vehicle Information */}
            {currentStep === 1 && (
              <VehicleInfoForm
                form={vehicleForm}
                onSubmit={
                  handleStep1Submit
                }
              />
            )}

            {/* Step 2: Price Information */}
            {currentStep === 2 && (
              <PriceFormModal
                form={priceForm}
                onSubmit={
                  handleStep2Submit
                }
                vehicleData={
                  vehicleData
                }
              />
            )}

            {/* Step 3: Fotos */}
            {currentStep === 3 && (
              <PhotoUpload
                uploadedFiles={
                  uploadedFiles
                }
                onFileUpload={
                  handleFileUpload
                }
                onRemoveFile={
                  removeFile
                }
                maxFiles={3}
                existingPhotos={
                  editingVehicle?.fotos
                }
                isEditMode={
                  !!editingVehicle
                }
              />
            )}

            <ModalNavigation
              currentStep={currentStep}
              onPrevStep={prevStep}
              onClose={handleModalClose}
              onNextStep={
                currentStep === 1
                  ? vehicleForm.handleSubmit(
                      handleStep1Submit,
                    )
                  : currentStep === 2
                    ? priceForm.handleSubmit(
                        handleStep2Submit,
                      )
                    : undefined
              }
              onSubmit={
                currentStep === 3
                  ? handleFinalSubmit
                  : undefined
              }
              isValid={canProceedToNextStep(
                currentStep,
              )}
              isLastStep={
                currentStep === 3
              }
              isSubmitting={
                isSubmitting
              }
              nextButtonText={
                currentStep === 2
                  ? "Continuar a Fotos →"
                  : "Siguiente →"
              }
            />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export default AddCarModal;
