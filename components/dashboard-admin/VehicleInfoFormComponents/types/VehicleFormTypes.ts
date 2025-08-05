import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { VehicleFormInputSchema } from "@/lib/validations";

/**
 * Main vehicle form data type
 */
export type VehicleFormData = z.infer<typeof VehicleFormInputSchema> & {
  ano: number;
};

/**
 * Main form props interface
 */
export interface VehicleInfoFormProps {
  form: UseFormReturn<VehicleFormData>;
  onSubmit: (data: VehicleFormData) => void;
}

/**
 * Manual input state interface
 */
export interface ManualInputState {
  showManualBrand: boolean;
  showManualModel: boolean;
  showManualYear: boolean;
  manualBrand: string;
  manualModel: string;
  manualYear: string;
}

/**
 * Force update state interface
 */
export interface ForceUpdateState {
  forceUpdateMarca: number;
  forceUpdateModelo: number;
  forceUpdateAno: number;
}

/**
 * Form state management interface
 */
export interface VehicleFormState extends ManualInputState, ForceUpdateState {
  localAno: string;
  localKilometraje: string;
  isMarcaManual: boolean;
}

/**
 * Manual input modal props
 */
export interface ManualInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
  title: string;
  placeholder: string;
  inputType?: "text" | "number";
  minValue?: number;
  maxValue?: number;
  value: string;
  onChange: (value: string) => void;
}

/**
 * Form field wrapper props
 */
export interface FormFieldWrapperProps {
  label: string;
  required?: boolean;
  onManualClick?: () => void;
  isManualDisabled?: boolean;
  manualButtonTitle?: string;
  showManualButton?: boolean;
  children: React.ReactNode;
}

/**
 * Select with manual props
 */
export interface SelectWithManualProps {
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  forceUpdateKey?: string | number;
  className?: string;
}

/**
 * Manual state setter type
 */
export type ManualStateSetter = (updater: React.SetStateAction<{
  showManualBrand: boolean;
  showManualModel: boolean;
  showManualYear: boolean;
  manualBrand: string;
  manualModel: string;
  manualYear: string;
}>) => void;

/**
 * Brand selector props
 */
export interface BrandSelectorProps {
  form: UseFormReturn<VehicleFormData>;
  manualState: ManualInputState;
  setManualState: ManualStateSetter;
  forceUpdateMarca: number;
  setForceUpdateMarca: React.Dispatch<React.SetStateAction<number>>;
  onBrandChange?: (brand: string, isManual: boolean) => void;
}

/**
 * Model selector props
 */
export interface ModelSelectorProps {
  form: UseFormReturn<VehicleFormData>;
  manualState: ManualInputState;
  setManualState: ManualStateSetter;
  forceUpdateModelo: number;
  setForceUpdateModelo: React.Dispatch<React.SetStateAction<number>>;
  isMarcaManual: boolean;
  autocosmosData: UseAutocosmosDataReturn;
  onModelChange?: (model: string) => void;
}

/**
 * Year selector props
 */
export interface YearSelectorProps {
  form: UseFormReturn<VehicleFormData>;
  manualState: ManualInputState;
  setManualState: ManualStateSetter;
  forceUpdateAno: number;
  setForceUpdateAno: React.Dispatch<React.SetStateAction<number>>;
  isMarcaManual: boolean;
  localAno: string;
  setLocalAno: React.Dispatch<React.SetStateAction<string>>;
  autocosmosData: UseAutocosmosDataReturn;
}

/**
 * Vehicle form fields props
 */
export interface VehicleFormFieldsProps {
  form: UseFormReturn<VehicleFormData>;
}

/**
 * Utility type for manual input handlers
 */
export interface ManualInputHandlers {
  openManualBrand: () => void;
  openManualModel: () => void;
  openManualYear: () => void;
  closeManualBrand: () => void;
  closeManualModel: () => void;
  closeManualYear: () => void;
  submitManualBrand: (value: string) => void;
  submitManualModel: (value: string) => void;
  submitManualYear: (value: string) => void;
}

/**
 * Autocosmos data hook return type
 */
export interface UseAutocosmosDataReturn {
  // Models
  models: Array<{
    brandSlug: string;
    slug: string;
    getDisplayName: () => string;
  }>;
  modelsLoading: boolean;
  modelsError: string | null;
  hasModels: boolean;
  fetchModels: (brand: string) => Promise<void>;
  resetModels: () => void;
  retryFetchModels: () => void;
  
  // Years
  years: Array<{
    brandSlug: string;
    modelSlug: string;
    year: number;
    getDisplayText: () => string;
  }>;
  yearsLoading: boolean;
  yearsError: string | null;
  hasYears: boolean;
  fetchYears: (brand: string, model: string) => Promise<void>;
  resetYears: () => void;
  retryFetchYears: () => void;
  
  // Utilities
  isManualBrand: (brand: string) => boolean;
}