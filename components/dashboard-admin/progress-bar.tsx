"use client";

import { motion } from "framer-motion";
import { MODAL_STEPS } from "./constants";

interface ProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}

export function ProgressBar({ currentStep, totalSteps = 3 }: ProgressBarProps) {
  return (
    <div className="flex items-center justify-center mb-8 max-w-2xl mx-auto">
      {MODAL_STEPS.map((item, index) => (
        <div key={item.step} className="flex items-center">
          <div className="flex flex-col items-center">
            <motion.div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                item.step <= currentStep
                  ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg transform scale-110"
                  : "bg-gray-300 dark:bg-zinc-700 text-gray-600 dark:text-zinc-400"
              } ${item.step === currentStep ? "ring-2 ring-blue-300 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900" : ""}`}
              animate={{
                scale: item.step === currentStep ? 1.1 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              {item.step < currentStep ? "✓" : item.step}
            </motion.div>
            <div className="mt-2 text-center">
              <p className={`text-xs font-medium ${
                item.step <= currentStep ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-zinc-400"
              }`}>
                {item.title}
              </p>
              <p className={`text-xs ${
                item.step <= currentStep ? "text-gray-600 dark:text-zinc-300" : "text-gray-400 dark:text-zinc-500"
              }`}>
                {item.subtitle}
              </p>
            </div>
          </div>
          {index < MODAL_STEPS.length - 1 && (
            <div className="w-16 sm:w-24 mx-3">
              <motion.div
                className={`h-1 rounded-full transition-all duration-500 ${
                  item.step < currentStep 
                    ? "bg-gradient-to-r from-blue-500 to-cyan-400" 
                    : "bg-gray-300 dark:bg-zinc-700"
                }`}
                animate={{
                  backgroundColor: item.step < currentStep 
                    ? "linear-gradient(to right, #3B82F6, #06B6D4)" 
                    : "#334155"
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}