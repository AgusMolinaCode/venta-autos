import { FormLabel } from "@/components/ui/form";
import { Edit3, Calendar, ArrowRight } from "lucide-react";
import { FormFieldWrapperProps } from "../../types/VehicleFormTypes";

/**
 * Reusable form field wrapper component
 * Provides consistent layout for form fields with optional manual input button
 */
export function FormFieldWrapper({
  label,
  required = false,
  onManualClick,
  isManualDisabled = false,
  manualButtonTitle,
  showManualButton = true,
  children,
}: FormFieldWrapperProps) {
  const getIcon = () => {
    if (label.toLowerCase().includes("año")) {
      return <Calendar className="h-3 w-3" />;
    }
    return <Edit3 className="h-3 w-3" />;
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <FormLabel className="text-gray-700 dark:text-zinc-300">
          {label} {required && "*"}
        </FormLabel>
        
        {showManualButton && onManualClick && (
          <button
            type="button"
            onClick={onManualClick}
            disabled={isManualDisabled}
            className={`text-xs flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
              isManualDisabled
                ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                : "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            }`}
            title={manualButtonTitle || "Agregar manualmente"}
          >
            <ArrowRight className="h-4 w-4 animate-pulse" />
            {getIcon()}
            Manual
          </button>
        )}
      </div>
      
      {children}
    </div>
  );
}