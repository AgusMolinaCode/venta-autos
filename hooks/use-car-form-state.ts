/**
 * Hook personalizado para manejar el estado del formulario de auto
 * Centraliza la lógica de estado y validación
 */

import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { VehicleFormInputSchema, PriceSchema } from "@/lib/validations";
import { VehiculoService, VehiculoSubmissionData } from "@/lib/services/vehicle-service";
import { VehiculoInput, VehiculoConFotos } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/auth-provider";

// Schemas extendidos
const VehicleStep1Schema = z.object({
  marca: z.string().min(1, { message: "La marca es obligatoria." }),
  modelo: z.string().min(1, { message: "El modelo es obligatorio." }),
  ano: z.number().min(1970).max(2025),
  kilometraje: z.number().min(0).optional(),
  version: z.string().optional(),
  combustible: z.string().optional(),
  transmision: z.string().optional(),
  color: z.string().optional(),
  descripcion: z.string().optional(),
  tipo_vehiculo: z.enum(["autos/camionetas", "motos"]).default("autos/camionetas"),
});

type VehicleFormData = z.infer<typeof VehicleStep1Schema>;
type PriceFormData = z.infer<typeof PriceSchema>;
type CombinedFormData = VehicleFormData & PriceFormData;

export interface UseCarFormStateReturn {
  // Estado
  currentStep: number;
  priceData: PriceFormData | null;
  vehicleData: VehicleFormData | null;
  uploadedFiles: File[];
  isSubmitting: boolean;
  
  // Forms
  vehicleForm: ReturnType<typeof useForm<VehicleFormData>>;
  priceForm: ReturnType<typeof useForm<PriceFormData>>;
  
  // Acciones
  setCurrentStep: (step: number) => void;
  handleStep1Submit: (data: VehicleFormData) => void;
  handleStep2Submit: (data: PriceFormData) => void;
  handleFinalSubmit: () => Promise<void>;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>, maxFiles?: number) => void;
  removeFile: (index: number) => void;
  resetForm: () => void;
  
  // Validaciones
  canProceedToNextStep: (step: number) => boolean;
}

export function useCarFormState(
  onSubmit?: (data: CombinedFormData) => void,
  onSuccess?: (updatedVehicle?: VehiculoConFotos) => void,
  editingVehicle?: VehiculoConFotos
): UseCarFormStateReturn {
  const { user } = useAuth();
  // Estado local
  const [currentStep, setCurrentStep] = useState(1);
  const [priceData, setPriceData] = useState<PriceFormData | null>(null);
  const [vehicleData, setVehicleData] = useState<VehicleFormData | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forms with conditional default values
  const vehicleForm = useForm<VehicleFormData>({
    resolver: zodResolver(VehicleStep1Schema),
    defaultValues: {
      marca: editingVehicle?.marca || "",
      modelo: editingVehicle?.modelo || "",
      ano: editingVehicle?.ano || undefined,
      kilometraje: editingVehicle?.kilometraje || undefined,
      version: editingVehicle?.version || "",
      combustible: editingVehicle?.combustible || "",
      transmision: editingVehicle?.transmision || "",
      color: editingVehicle?.color || "",
      descripcion: editingVehicle?.descripcion || "",
      tipo_vehiculo: (editingVehicle?.tipo_vehiculo as "autos/camionetas" | "motos") || "autos/camionetas",
    },
  });

  const priceForm = useForm<PriceFormData>({
    resolver: zodResolver(PriceSchema),
    defaultValues: {
      precio: editingVehicle?.precio || undefined,
      moneda: editingVehicle?.moneda || "ARS",
    },
  });

  // Reset form values when editingVehicle changes
  useEffect(() => {
    if (editingVehicle) {
      vehicleForm.reset({
        marca: editingVehicle.marca,
        modelo: editingVehicle.modelo,
        ano: editingVehicle.ano,
        kilometraje: editingVehicle.kilometraje || undefined,
        version: editingVehicle.version || "",
        combustible: editingVehicle.combustible || "",
        transmision: editingVehicle.transmision || "",
        color: editingVehicle.color || "",
        descripcion: editingVehicle.descripcion || "",
        tipo_vehiculo: (editingVehicle.tipo_vehiculo as "autos/camionetas" | "motos") || "autos/camionetas",
      });
      
      priceForm.reset({
        precio: editingVehicle.precio,
        moneda: editingVehicle.moneda,
      });
      
      // Pre-populate data for editing flow
      setPriceData({
        precio: editingVehicle.precio,
        moneda: editingVehicle.moneda,
      });
      
      setVehicleData({
        marca: editingVehicle.marca,
        modelo: editingVehicle.modelo,
        ano: editingVehicle.ano,
        kilometraje: editingVehicle.kilometraje || undefined,
        version: editingVehicle.version || "",
        combustible: editingVehicle.combustible || "",
        transmision: editingVehicle.transmision || "",
        color: editingVehicle.color || "",
        descripcion: editingVehicle.descripcion || "",
        tipo_vehiculo: (editingVehicle.tipo_vehiculo as "autos/camionetas" | "motos") || "autos/camionetas",
      });
    }
  }, [editingVehicle, vehicleForm, priceForm]);

  // Handlers
  const handleStep1Submit = useCallback((data: VehicleFormData) => {
    if (!data.marca || !data.modelo || !data.ano) {
      toast.error("Complete los campos obligatorios: marca, modelo y año");
      return;
    }

    setVehicleData(data);
    setCurrentStep(2);
  }, []);

  const handleStep2Submit = useCallback((data: PriceFormData) => {
    if (!data.precio) {
      toast.error("Complete el precio de venta");
      return;
    }
    
    setPriceData(data);
    setCurrentStep(3);
  }, []);

  const resetForm = useCallback(() => {
    vehicleForm.reset();
    priceForm.reset();
    setPriceData(null);
    setVehicleData(null);
    setUploadedFiles([]);
    setCurrentStep(1);
    setIsSubmitting(false);
  }, [vehicleForm, priceForm]);

  const handleFinalSubmit = useCallback(async () => {
    if (!priceData || !vehicleData) {
      toast.error("Error: datos del vehículo no encontrados");
      setCurrentStep(1);
      return;
    }
    
    // Validar que el usuario esté autenticado
    if (!user) {
      toast.error("Debe estar autenticado para crear un vehículo");
      return;
    }
    
    // Validar fotos: diferentes reglas para creación vs edición
    const isEditMode = !!editingVehicle?.id;
    const hasExistingPhotos = editingVehicle?.fotos && Array.isArray(editingVehicle.fotos) && editingVehicle.fotos.length > 0;
    const hasNewPhotos = uploadedFiles.length > 0;
    
    if (isEditMode) {
      // Modo edición: OK si tiene fotos existentes O nuevas fotos
      if (!hasExistingPhotos && !hasNewPhotos) {
        toast.error("Debe subir al menos 1 imagen del vehículo");
        return;
      }
    } else {
      // Modo creación: siempre requiere nuevas fotos
      if (!hasNewPhotos) {
        toast.error("Debe subir al menos 1 imagen del vehículo");
        return;
      }
    }
    
    setIsSubmitting(true);
    
    const finalData = { ...vehicleData, ...priceData } as CombinedFormData;
    
    // Preparar datos para el servicio
    const datosSubmision: VehiculoSubmissionData = {
      vehiculoData: finalData as VehiculoInput,
      fotos: uploadedFiles,
      userId: user.id
    };

    try {
      let result;
      
      // Determinar si es creación o actualización
      if (editingVehicle?.id) {
        // Modo edición: actualizar vehículo existente
        result = await VehiculoService.actualizarVehiculoConFotos(editingVehicle.id, datosSubmision);
      } else {
        // Modo creación: crear nuevo vehículo
        result = await VehiculoService.crearVehiculoConFotos(datosSubmision);
      }
      
      if (result.success) {
        if (onSubmit) {
          onSubmit(finalData);
        }
        
        resetForm();
        
        const successMessage = editingVehicle 
          ? 'Vehículo actualizado exitosamente'
          : 'Vehículo agregado exitosamente';
        
        toast.success(
          `${successMessage}${result.details?.fotosSubidas ? 
            ` con ${result.details.fotosSubidas} foto(s)` : ''}`
        );
        
        if (result.details?.fotosFallidas && result.details.fotosFallidas.length > 0) {
          toast.warning(`Algunas fotos no se pudieron subir: ${result.details.fotosFallidas.join(', ')}`);
        }
        
        // Llamar al callback de success con el vehículo actualizado
        if (onSuccess && result.data) {
          onSuccess(result.data);
        }
        
        // Cerrar modal después de un breve delay para mostrar el toast
        setTimeout(() => {
          if (onSuccess && !result.data) {
            onSuccess();
          }
        }, 1500);
      } else {
        const errorMessage = editingVehicle 
          ? 'Error al actualizar vehículo'
          : 'Error al crear vehículo';
        toast.error(`${errorMessage}: ${result.error}`);
      }
    } catch (error) {
      console.error('Error en handleFinalSubmit:', error);
      toast.error('Error inesperado al procesar el vehículo');
    } finally {
      setIsSubmitting(false);
    }
  }, [priceData, vehicleData, uploadedFiles, onSubmit, onSuccess, resetForm, editingVehicle, user]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>, maxFiles: number = 10) => {
    const files = Array.from(event.target.files || []);
    if (uploadedFiles.length + files.length > maxFiles) {
      toast.error(`Máximo ${maxFiles} fotos permitidas`);
      return;
    }
    setUploadedFiles(prev => [...prev, ...files]);
  }, [uploadedFiles.length]);

  const removeFile = useCallback((index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const canProceedToNextStep = useCallback((step: number) => {
    switch (step) {
      case 1:
        return vehicleForm.formState.isValid;
      case 2:
        return priceForm.formState.isValid && !!priceForm.watch("precio");
      case 3:
        const isEditing = !!editingVehicle?.id;
        const hasNewPhotos = uploadedFiles.length > 0;
        
        if (isEditing) {
          // Modo edición: válido si hay fotos existentes O nuevas (máximo 3 nuevas)
          const editHasExistingPhotos = editingVehicle?.fotos && Array.isArray(editingVehicle.fotos) && editingVehicle.fotos.length > 0;
          return (editHasExistingPhotos || hasNewPhotos) && uploadedFiles.length <= 3;
        } else {
          // Modo creación: requiere al menos 1 nueva foto, máximo 3
          return hasNewPhotos && uploadedFiles.length <= 3;
        }
      default:
        return true;
    }
  }, [vehicleForm.formState.isValid, priceForm.formState.isValid, priceForm, uploadedFiles.length, editingVehicle?.fotos, editingVehicle?.id]);

  return {
    // Estado
    currentStep,
    priceData,
    vehicleData,
    uploadedFiles,
    isSubmitting,
    
    // Forms
    vehicleForm,
    priceForm,
    
    // Acciones
    setCurrentStep,
    handleStep1Submit,
    handleStep2Submit,
    handleFinalSubmit,
    handleFileUpload,
    removeFile,
    resetForm,
    
    // Validaciones
    canProceedToNextStep,
  };
}