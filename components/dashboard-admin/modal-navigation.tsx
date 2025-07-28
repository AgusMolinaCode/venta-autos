"use client";

import { Button } from "@/components/ui/button";

interface ModalNavigationProps {
  currentStep: number;
  onPrevStep: () => void;
  onClose: () => void;
  onNextStep?: () => void;
  onSubmit?: () => void;
  isValid?: boolean;
  isLastStep?: boolean;
  nextButtonText?: string;
  submitButtonText?: string;
}

export function ModalNavigation({
  currentStep,
  onPrevStep,
  onClose,
  onNextStep,
  onSubmit,
  isValid = true,
  isLastStep = false,
  nextButtonText = "Siguiente →",
  submitButtonText = "Guardar Auto"
}: ModalNavigationProps) {
  return (
    <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-zinc-700">
      <Button
        variant="outline"
        onClick={onPrevStep}
        disabled={currentStep === 1}
        className="border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 bg-transparent"
      >
        Anterior
      </Button>

      <div className="flex gap-3">
        {/* <Button
          variant="outline"
          onClick={onClose}
          className="border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 bg-transparent"
        >
          Cancelar
        </Button> */}

        {!isLastStep && onNextStep && (
          <Button
            onClick={onNextStep}
            disabled={!isValid}
            className={`transition-all duration-300 ${
              isValid
                ? "bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white shadow-lg"
                : "bg-gray-400 dark:bg-zinc-600 text-gray-300 dark:text-zinc-400 cursor-not-allowed"
            }`}
          >
{isValid ? nextButtonText : "Complete los campos obligatorios *"}
          </Button>
        )}

        {isLastStep && onSubmit && (
          <Button
            onClick={onSubmit}
            className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white"
          >
            {submitButtonText}
          </Button>
        )}
      </div>
    </div>
  );
}