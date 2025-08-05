import { Input } from "@/components/ui/input";
import { ManualInputModalProps } from "../../types/VehicleFormTypes";

/**
 * Reusable manual input modal component
 * Used for brand, model, and year manual input functionality
 */
export function ManualInputModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  placeholder,
  inputType = "text",
  minValue,
  maxValue,
  value,
  onChange,
}: ManualInputModalProps) {
  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim()) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!value.trim()) return;

    // Validate number inputs
    if (inputType === "number") {
      const numValue = parseInt(value.trim());
      if (
        isNaN(numValue) ||
        (minValue !== undefined && numValue < minValue) ||
        (maxValue !== undefined && numValue > maxValue)
      ) {
        return;
      }
    }

    onSubmit(value.trim());
  };

  const isValidNumber = () => {
    if (inputType !== "number") return true;
    const numValue = parseInt(value.trim());
    return (
      !isNaN(numValue) &&
      (minValue === undefined || numValue >= minValue) &&
      (maxValue === undefined || numValue <= maxValue)
    );
  };

  return (
    <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
          {title}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          ✕
        </button>
      </div>
      
      <Input
        type={inputType}
        min={minValue}
        max={maxValue}
        placeholder={placeholder}
        className="mb-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
      
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!value.trim() || !isValidNumber()}
          className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Agregar
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1 text-xs bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}