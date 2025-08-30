"use client";

import { Button } from "@/components/ui/button";
import { Loader2, RotateCcw } from "lucide-react";

interface ModalNavigationProps {
  currentStep: number;
  onPrevStep: () => void;
  onClose: () => void;
  onNextStep?: () => void;
  onSubmit?: () => void;
  onReset?: () => void;
  isValid?: boolean;
  isLastStep?: boolean;
  isSubmitting?: boolean;
  nextButtonText?: string;
  submitButtonText?: string;
}

export function ModalNavigation({
  currentStep,
  onPrevStep,
  onNextStep,
  onSubmit,
  onReset,
  isValid = true,
  isLastStep = false,
  isSubmitting = false,
  nextButtonText = "Siguiente →",
  submitButtonText = "Guardar Auto",
}: ModalNavigationProps) {
  return (
    <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-zinc-700">
      {currentStep === 1 ? (
        <Button
          variant="outline"
          onClick={onReset}
          className="border-orange-300 dark:border-orange-600 text-orange-700 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 bg-transparent"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      ) : (
        <Button
          variant="outline"
          onClick={onPrevStep}
          className="border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 bg-transparent"
        >
          Anterio
        </Button>
      )}

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
            {isValid
              ? nextButtonText
              : "Complete los campos obligatorios *"}
          </Button>
        )}

        {isLastStep && onSubmit && (
          <Button
            onClick={onSubmit}
            disabled={
              !isValid || isSubmitting
            }
            className={`transition-all duration-300 ${
              isValid && !isSubmitting
                ? "bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white shadow-lg"
                : "bg-gray-400 dark:bg-zinc-600 text-gray-300 dark:text-zinc-400 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Guardando...
              </>
            ) : !isValid ? (
              "Suba al menos 1 imagen *"
            ) : (
              submitButtonText
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
