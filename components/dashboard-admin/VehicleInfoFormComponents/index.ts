/**
 * Vehicle Info Form Components
 * Barrel export file for all components, hooks, and types
 */

// Main component
export { VehicleInfoForm } from "./VehicleInfoForm";

// Individual components
export { BrandSelector } from "./components/BrandSelector";
export { ModelSelector } from "./components/ModelSelector";
export { YearSelector } from "./components/YearSelector";
export { VehicleFormFields } from "./components/VehicleFormFields";

// Shared components
export { ManualInputModal } from "./components/shared/ManualInputModal";
export { FormFieldWrapper } from "./components/shared/FormFieldWrapper";
export { SelectWithManual } from "./components/shared/SelectWithManual";

// Hooks
export { useVehicleFormState } from "./hooks/useVehicleFormState";
export { useAutocosmosData } from "./hooks/useAutocosmosData";

// Types
export type {
  VehicleFormData,
  VehicleInfoFormProps,
  ManualInputState,
  ForceUpdateState,
  VehicleFormState,
  ManualInputModalProps,
  FormFieldWrapperProps,
  SelectWithManualProps,
  ManualStateSetter,
  BrandSelectorProps,
  ModelSelectorProps,
  YearSelectorProps,
  VehicleFormFieldsProps,
  ManualInputHandlers,
  UseAutocosmosDataReturn,
} from "./types/VehicleFormTypes";