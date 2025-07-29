/**
 * Hook personalizado para manejar el estado del formulario de auto
 * Centraliza la lógica de estado y validación
 */

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { VehicleFormInputSchema, PriceSchema } from "@/lib/validations";
import { VehiculoService, VehiculoSubmissionData } from "@/lib/services/vehicle-service";
import { VehiculoInput } from "@/lib/supabase";
import { toast } from "sonner";

// Schemas extendidos
const VehicleStep1Schema = VehicleFormInputSchema.extend({
  ano: z.number().min(1970).max(2025),
});

type VehicleFormData = z.infer<typeof VehicleStep1Schema>;
type PriceFormData = z.infer<typeof PriceSchema>;
type CombinedFormData = VehicleFormData & PriceFormData;

export interface UseCarFormStateReturn {
  // Estado
  currentStep: number;
  step1Data: VehicleFormData | null;
  uploadedFiles: File[];
  
  // Forms
  vehicleForm: ReturnType<typeof useForm<VehicleFormData>>;
  priceForm: ReturnType<typeof useForm<PriceFormData>>;
  
  // Acciones
  setCurrentStep: (step: number) => void;
  handleStep1Submit: (data: VehicleFormData) => Promise<void>;
  handleStep2Submit: (data: PriceFormData) => void;
  handleFinalSubmit: () => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (index: number) => void;
  resetForm: () => void;
  
  // Validaciones
  canProceedToNextStep: (step: number) => boolean;
}

export function useCarFormState(
  onSubmit?: (data: CombinedFormData) => void,
  onClose?: () => void
): UseCarFormStateReturn {
  // Estado local
  const [currentStep, setCurrentStep] = useState(1);
  const [step1Data, setStep1Data] = useState<VehicleFormData | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Forms
  const vehicleForm = useForm<VehicleFormData>({
    resolver: zodResolver(VehicleStep1Schema),
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

  const priceForm = useForm<PriceFormData>({
    resolver: zodResolver(PriceSchema),
    defaultValues: {
      precio: undefined,
      moneda: "ARS",
    },
  });

  // Handlers
  const handleStep1Submit = useCallback(async (data: VehicleFormData) => {
    if (!data.marca || !data.modelo || !data.ano) {
      toast.error("Complete los campos obligatorios: marca, modelo y año");
      return;
    }
    
    setStep1Data(data);
    setCurrentStep(2);
  }, []);

  const handleStep2Submit = useCallback((data: PriceFormData) => {
    if (!step1Data) {
      toast.error("Error: datos del paso 1 no encontrados");
      return;
    }

    const updatedStep1Data = { ...step1Data, ...data };
    setStep1Data(updatedStep1Data);
    setCurrentStep(3);
  }, [step1Data]);

  const resetForm = useCallback(() => {
    vehicleForm.reset();
    priceForm.reset();
    setStep1Data(null);
    setUploadedFiles([]);
    setCurrentStep(1);
  }, [vehicleForm, priceForm]);

  const handleFinalSubmit = useCallback(async () => {
    if (!step1Data) {
      toast.error("Error: datos del vehículo no encontrados");
      setCurrentStep(1);
      return;
    }
    
    const finalData = step1Data as CombinedFormData;
    
    // Preparar datos para el servicio
    const datosSubmision: VehiculoSubmissionData = {
      vehiculoData: finalData as VehiculoInput,
      fotos: uploadedFiles
    };

    console.group('🚗 DATOS FINALES ANTES DE ENVIAR A SUPABASE');
    console.log('📋 Información del Vehículo:', {
      marca: finalData.marca,
      modelo: finalData.modelo,
      ano: finalData.ano,
      kilometraje: finalData.kilometraje,
      version: finalData.version,
      combustible: finalData.combustible,
      transmision: finalData.transmision,
      color: finalData.color,
      descripcion: finalData.descripcion,
      precio: finalData.precio,
      moneda: finalData.moneda
    });
    
    console.log('📸 Archivos de Fotos:', {
      cantidad: uploadedFiles.length,
      archivos: uploadedFiles.map((file, index) => ({
        index: index + 1,
        nombre: file.name,
        tamaño_mb: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        tipo: file.type,
        ultima_modificacion: new Date(file.lastModified).toLocaleString()
      }))
    });

    console.log('🗄️ Estructura que se enviará a Supabase:');
    console.log('  📊 Tabla "vehiculos":', {
      marca: finalData.marca,
      modelo: finalData.modelo,
      ano: finalData.ano,
      kilometraje: finalData.kilometraje || null,
      version: finalData.version || null,
      combustible: finalData.combustible || null,
      transmision: finalData.transmision || null,
      color: finalData.color || null,
      descripcion: finalData.descripcion || null,
      precio: finalData.precio,
      moneda: finalData.moneda
    });

    console.log('  📊 Tabla "vehiculo_fotos" (se creará para cada foto):');
    uploadedFiles.forEach((file, index) => {
      console.log(`    Foto ${index + 1}:`, {
        vehicle_id: '[Se generará automáticamente]',
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        storage_path: `vehiculos/[vehiculo_id]/${file.name}`,
        is_primary: index === 0,
        order_index: index
      });
    });

    console.log('📁 Configuración de Storage:', {
      bucket: 'vehiculo-fotos',
      ruta_base: 'vehiculos/[vehiculo_id]/',
      tamaño_máximo_por_archivo: '5MB',
      tipos_permitidos: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      máximo_archivos: 10
    });
    console.groupEnd();

    try {
      // Llamar al servicio para crear el vehículo
      const result = await VehiculoService.crearVehiculoConFotos(datosSubmision);
      
      if (result.success) {
        if (onSubmit) {
          onSubmit(finalData);
        }
        
        resetForm();
        toast.success(
          `Vehículo agregado exitosamente${result.details?.fotosSubidas ? 
            ` con ${result.details.fotosSubidas} foto(s)` : ''}`
        );
        
        if (result.details?.fotosFallidas && result.details.fotosFallidas.length > 0) {
          toast.warning(`Algunas fotos no se pudieron subir: ${result.details.fotosFallidas.join(', ')}`);
        }
        
        if (onClose) {
          onClose();
        }
      } else {
        toast.error(`Error al crear vehículo: ${result.error}`);
      }
    } catch (error) {
      console.error('Error en handleFinalSubmit:', error);
      toast.error('Error inesperado al procesar el vehículo');
    }
  }, [step1Data, uploadedFiles, onSubmit, onClose, resetForm]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (uploadedFiles.length + files.length > 10) {
      toast.error("Máximo 10 fotos permitidas");
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
      default:
        return true;
    }
  }, [vehicleForm.formState.isValid, priceForm.formState.isValid, priceForm]);

  return {
    // Estado
    currentStep,
    step1Data,
    uploadedFiles,
    
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