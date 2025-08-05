import { useState, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { 
  VehicleFormData, 
  VehicleFormState, 
  ManualInputHandlers 
} from "../types/VehicleFormTypes";

/**
 * Custom hook for managing vehicle form state
 * Centralizes all state management logic for the vehicle form
 */
export const useVehicleFormState = (
  form: UseFormReturn<VehicleFormData>
) => {
  // Local state for ano and kilometraje input values
  const [localAno, setLocalAno] = useState(
    form.getValues("ano")?.toString() ?? ""
  );
  const [localKilometraje, setLocalKilometraje] = useState(
    form.getValues("kilometraje")?.toString() ?? ""
  );

  // Manual input visibility states
  const [showManualBrand, setShowManualBrand] = useState(false);
  const [showManualModel, setShowManualModel] = useState(false);
  const [showManualYear, setShowManualYear] = useState(false);

  // Manual input values
  const [manualBrand, setManualBrand] = useState("");
  const [manualModel, setManualModel] = useState("");
  const [manualYear, setManualYear] = useState("");

  // Force update counters for select components
  const [forceUpdateMarca, setForceUpdateMarca] = useState(0);
  const [forceUpdateModelo, setForceUpdateModelo] = useState(0);
  const [forceUpdateAno, setForceUpdateAno] = useState(0);

  // Manual brand state
  const [isMarcaManual, setIsMarcaManual] = useState(false);

  const isEditMode = !!form.formState.defaultValues?.marca;

  // Manual input handlers
  const openManualBrand = useCallback(() => setShowManualBrand(true), []);
  const openManualModel = useCallback(() => setShowManualModel(true), []);
  const openManualYear = useCallback(() => setShowManualYear(true), []);

  const closeManualBrand = useCallback(() => {
    setShowManualBrand(false);
    setManualBrand("");
  }, []);

  const closeManualModel = useCallback(() => {
    setShowManualModel(false);
    setManualModel("");
  }, []);

  const closeManualYear = useCallback(() => {
    setShowManualYear(false);
    setManualYear("");
  }, []);

  const submitManualBrand = useCallback((value: string) => {
    if (value.trim()) {
      form.setValue("marca", value.trim());
      setManualBrand("");
      setShowManualBrand(false);
      setForceUpdateMarca(prev => prev + 1);
    }
  }, [form]);

  const submitManualModel = useCallback((value: string) => {
    if (value.trim()) {
      form.setValue("modelo", value.trim());
      setManualModel("");
      setShowManualModel(false);
      setForceUpdateModelo(prev => prev + 1);
    }
  }, [form]);

  const submitManualYear = useCallback((value: string) => {
    const yearValue = parseInt(value.trim());
    if (!isNaN(yearValue) && yearValue >= 1970 && yearValue <= 2025) {
      form.setValue("ano", yearValue);
      setManualYear("");
      setShowManualYear(false);
      setForceUpdateAno(prev => prev + 1);
    }
  }, [form]);

  // Unified manual state setter
  const setManualState = useCallback((updater: React.SetStateAction<{
    showManualBrand: boolean;
    showManualModel: boolean;
    showManualYear: boolean;
    manualBrand: string;
    manualModel: string;
    manualYear: string;
  }>) => {
    if (typeof updater === 'function') {
      const currentState = {
        showManualBrand,
        showManualModel,
        showManualYear,
        manualBrand,
        manualModel,
        manualYear,
      };
      const newState = updater(currentState);
      
      setShowManualBrand(newState.showManualBrand);
      setShowManualModel(newState.showManualModel);
      setShowManualYear(newState.showManualYear);
      setManualBrand(newState.manualBrand);
      setManualModel(newState.manualModel);
      setManualYear(newState.manualYear);
    } else {
      setShowManualBrand(updater.showManualBrand);
      setShowManualModel(updater.showManualModel);
      setShowManualYear(updater.showManualYear);
      setManualBrand(updater.manualBrand);
      setManualModel(updater.manualModel);
      setManualYear(updater.manualYear);
    }
  }, [showManualBrand, showManualModel, showManualYear, manualBrand, manualModel, manualYear]);

  const resetAllManualStates = useCallback((isEdit?: boolean) => {
    if (isEdit) return;

    setShowManualBrand(false);
    setShowManualModel(false);
    setShowManualYear(false);
    setManualBrand("");
    setManualModel("");
    setManualYear("");
  }, []);

  // Combined state object
  const formState: VehicleFormState = {
    localAno,
    localKilometraje,
    showManualBrand,
    showManualModel,
    showManualYear,
    manualBrand,
    manualModel,
    manualYear,
    forceUpdateMarca,
    forceUpdateModelo,
    forceUpdateAno,
    isMarcaManual,
  };

  // No-op function when in edit mode
  const noOp = () => {};

  // Combined handlers object
  const handlers: ManualInputHandlers = {
    openManualBrand: isEditMode ? noOp : openManualBrand,
    openManualModel: isEditMode ? noOp : openManualModel,
    openManualYear: isEditMode ? noOp : openManualYear,
    closeManualBrand,
    closeManualModel,
    closeManualYear,
    submitManualBrand,
    submitManualModel,
    submitManualYear,
  };

  return {
    formState,
    setLocalAno,
    setLocalKilometraje,
    setManualBrand,
    setManualModel,
    setManualYear,
    setForceUpdateMarca,
    setForceUpdateModelo,
    setForceUpdateAno,
    setIsMarcaManual,
    setManualState,
    handlers,
    resetAllManualStates,
  };
};