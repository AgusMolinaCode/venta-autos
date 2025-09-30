/**
 * React Hook for Description Generation
 * Simple hook to handle POST request for vehicle description generation
 */

import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { 
  generateVehicleDescription, 
  type DescriptionResponse 
} from '@/lib/services/description-generator';
import type { VehicleFormData } from '@/components/dashboard-admin/VehicleInfoFormComponents/types/VehicleFormTypes';

interface UseDescriptionGeneratorReturn {
  // State
  isLoading: boolean;
  error: string | null;
  
  // Functions
  generateDescription: () => Promise<{ needsConfirmation?: boolean; success?: boolean; error?: string }>;
  forceGenerateDescription: () => Promise<{ success?: boolean; error?: string }>;
  
  // Utilities
  canGenerate: () => boolean;
  hasExistingDescription: () => boolean;
  getGenerateButtonTooltip: () => string;
}

/**
 * Hook for vehicle description generation
 */
export function useDescriptionGenerator(
  form: UseFormReturn<VehicleFormData>
): UseDescriptionGeneratorReturn {
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Check if we have minimum required data
   */
  const canGenerate = () => {
    const formData = form.getValues();
    return !!(formData.marca && formData.modelo);
  };

  /**
   * Check if description field has content
   */
  const hasExistingDescription = () => {
    const descripcion = form.getValues('descripcion');
    return !!(descripcion && descripcion.trim().length > 0);
  };

  /**
   * Get tooltip text for generate button
   */
  const getGenerateButtonTooltip = () => {
    if (!canGenerate()) {
      return "Completa marca y modelo para generar descripción";
    }
    
    const formData = form.getValues();
    const fieldsCount = Object.values(formData).filter(value => 
      value !== undefined && value !== null && value !== ''
    ).length;
    
    return `Generar descripción con ${fieldsCount} campos completados`;
  };

  /**
   * Internal generation function
   */
  const performGeneration = async () => {
    if (!canGenerate()) {
      const errorMsg = 'Marca y modelo son requeridos para generar descripción';
      setError(errorMsg);
      toast.error(errorMsg);
      return { error: errorMsg };
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = form.getValues();
      
      const result: DescriptionResponse = await generateVehicleDescription(formData);

      if (result.success && result.descripcion) {
        // Auto-populate the description field
        form.setValue('descripcion', result.descripcion);
        toast.success('¡Descripción generada exitosamente!');
        return { success: true };
      } else {
        const errorMsg = result.error || 'No se pudo generar la descripción';
        setError(errorMsg);
        toast.error(errorMsg);
        return { error: errorMsg };
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error inesperado';
      setError(errorMsg);
      toast.error('Error al generar descripción: ' + errorMsg);
      return { error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Generate description with confirmation check
   */
  const generateDescription = async () => {
    // Check if we need user confirmation for overwriting
    if (hasExistingDescription()) {
      return { needsConfirmation: true };
    }

    return performGeneration();
  };

  /**
   * Force generation (bypassing confirmation)
   */
  const forceGenerateDescription = async () => {
    return performGeneration();
  };

  return {
    // State
    isLoading,
    error,
    
    // Functions
    generateDescription,
    forceGenerateDescription,
    
    // Utilities
    canGenerate,
    hasExistingDescription,
    getGenerateButtonTooltip,
  };
}

// Export types
export type { UseDescriptionGeneratorReturn };