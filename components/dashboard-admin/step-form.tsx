"use client";
import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconCar } from "@tabler/icons-react";
import Stepper, { Step } from "@/components/ui/Stepper";
import { VehicleForm, VehicleFormRef } from "./vehicle-modal";
import VehicleFormWithPrice from "./VehicleFormWithPrice";

const StepForm = () => {
  const [open, setOpen] = useState(false);
  const [canProceedStep1, setCanProceedStep1] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const vehicleFormRef = useRef<VehicleFormRef>(null);
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <IconCar className="h-5 w-5" />
            Agregar Vehículo
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl h-[90vh] overflow-auto flex flex-col">
          <DialogTitle className="sr-only">
            Formulario para Agregar Vehículo
          </DialogTitle>
          <Stepper
            initialStep={1}
            onStepChange={(step) => {
              console.log("Step changed to:", step);
              setCurrentStep(step);
              // When advancing from step 1 to step 2, generate the URL
              if (step === 2 && vehicleFormRef.current) {
                vehicleFormRef.current.generateUrl();
              }
            }}
            onFinalStepCompleted={() => console.log("All steps completed!")}
            backButtonText="Anterior"
            nextButtonText="Siguiente"
            nextButtonProps={{
              disabled: currentStep === 1 && !canProceedStep1, // Only disable in step 1 when required fields are not complete
            }}
            className="bg-zinc-800 rounded-4xl border border-zinc-600 shadow-lg flex-1 w-full"
          >
            <Step>
              <VehicleForm 
                ref={vehicleFormRef}
                onValidationChange={setCanProceedStep1}
              />
            </Step>
            <Step>
              <VehicleFormWithPrice />
            </Step>
          </Stepper>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StepForm;
