"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconCar } from "@tabler/icons-react";
import { VehicleForm } from "./vehicle-modal";

const StepForm = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <IconCar className="h-5 w-5" />
            Agregar Vehículo
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl overflow-auto flex flex-col">
          <DialogTitle className="sr-only">
            Formulario para Agregar Vehículo
          </DialogTitle>
          <div className="bg-zinc-800 rounded-4xl border border-zinc-600 shadow-lg flex-1 w-full p-6">
            <VehicleForm onClose={() => setOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StepForm;
