import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight } from "lucide-react";

interface CurrencyToggleProps {
  preferredCurrency: "ARS" | "USD";
  onCurrencyChange: (currency: "ARS" | "USD") => void;
  className?: string;
}

export function CurrencyToggle({
  preferredCurrency,
  onCurrencyChange,
  className,
}: CurrencyToggleProps) {
  return (
    <div className={className}>
      <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
        <Button
          variant={preferredCurrency === "ARS" ? "default" : "ghost"}
          size="sm"
          onClick={() => onCurrencyChange("ARS")}
          className="text-xs font-medium px-3 py-1 h-7"
        >
          ARS $
        </Button>
        <ArrowLeftRight className="h-3 w-3 text-muted-foreground" />
        <Button
          variant={preferredCurrency === "USD" ? "default" : "ghost"}
          size="sm"
          onClick={() => onCurrencyChange("USD")}
          className="text-xs font-medium px-3 py-1 h-7"
        >
          USD $
        </Button>
      </div>
    </div>
  );
}