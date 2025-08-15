"use client";

import React, { createContext, useContext, useState } from "react";

type DashboardView = "dashboard" | "vehicles";

interface DashboardNavigationContextType {
  activeView: DashboardView;
  setActiveView: (view: DashboardView) => void;
  navigateToDashboard: () => void;
  navigateToVehicles: () => void;
}

const DashboardNavigationContext = createContext<DashboardNavigationContextType | undefined>(undefined);

export const useDashboardNavigation = () => {
  const context = useContext(DashboardNavigationContext);
  if (!context) {
    throw new Error("useDashboardNavigation must be used within a DashboardNavigationProvider");
  }
  return context;
};

// Hook seguro que no lanza error si no está en el provider
export const useDashboardNavigationSafe = () => {
  const context = useContext(DashboardNavigationContext);
  return context; // Retorna null si no está en el provider
};

export const DashboardNavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<DashboardView>("dashboard");

  const navigateToDashboard = () => {
    setActiveView("dashboard");
  };

  const navigateToVehicles = () => {
    setActiveView("vehicles");
  };

  return (
    <DashboardNavigationContext.Provider
      value={{
        activeView,
        setActiveView,
        navigateToDashboard,
        navigateToVehicles,
      }}
    >
      {children}
    </DashboardNavigationContext.Provider>
  );
};