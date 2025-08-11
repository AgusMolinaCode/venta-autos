import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "default" | "purple" | "emerald" | "amber" | "orange" | "green" | "yellow" | "blue" | "indigo";
  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
    icon?: LucideIcon;
  };
  loading?: boolean;
  className?: string;
}

const variantStyles = {
  default: "border-muted bg-background",
  purple: "border-purple-200 bg-purple-50/50 dark:bg-purple-950/20 dark:border-purple-800",
  emerald: "border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-800", 
  amber: "border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800",
  orange: "border-orange-200 bg-orange-50/50 dark:bg-orange-950/20 dark:border-orange-800",
  green: "border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-800",
  yellow: "border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/20 dark:border-yellow-800",
  blue: "border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800",
  indigo: "border-indigo-200 bg-indigo-50/50 dark:bg-indigo-950/20 dark:border-indigo-800",
} as const;

const variantTextStyles = {
  default: "text-foreground",
  purple: "text-purple-700 dark:text-purple-300",
  emerald: "text-emerald-700 dark:text-emerald-300",
  amber: "text-amber-700 dark:text-amber-300", 
  orange: "text-orange-700 dark:text-orange-300",
  green: "text-green-700 dark:text-green-300",
  yellow: "text-yellow-700 dark:text-yellow-300",
  blue: "text-blue-700 dark:text-blue-300",
  indigo: "text-indigo-700 dark:text-indigo-300",
} as const;

const variantSubtitleStyles = {
  default: "text-muted-foreground",
  purple: "text-purple-600 dark:text-purple-400",
  emerald: "text-emerald-600 dark:text-emerald-400",
  amber: "text-amber-600 dark:text-amber-400",
  orange: "text-orange-600 dark:text-orange-400", 
  green: "text-green-600 dark:text-green-400",
  yellow: "text-yellow-600 dark:text-yellow-400",
  blue: "text-blue-600 dark:text-blue-400",
  indigo: "text-indigo-600 dark:text-indigo-400",
} as const;

const variantIconBg = {
  default: "bg-muted",
  purple: "bg-purple-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  orange: "bg-orange-500",
  green: "bg-green-500", 
  yellow: "bg-yellow-500",
  blue: "bg-blue-500",
  indigo: "bg-indigo-500",
} as const;

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "default",
  trend,
  loading = false,
  className,
}: MetricCardProps) {
  return (
    <Card className={cn(variantStyles[variant], className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={cn("text-sm font-medium", variantTextStyles[variant])}>
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-lg", variantIconBg[variant])}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", variantTextStyles[variant])}>
          {loading ? "..." : value}
        </div>
        {subtitle && (
          <p className={cn("text-sm", variantSubtitleStyles[variant])}>
            {subtitle}
          </p>
        )}
        {trend && (
          <p className="text-xs text-muted-foreground mt-1">
            <span className={cn(
              "flex items-center gap-1",
              trend.direction === "up" ? "text-green-600" : 
              trend.direction === "down" ? "text-red-600" : 
              "text-muted-foreground"
            )}>
              {trend.icon && <trend.icon className="h-3 w-3" />}
              {trend.value}
            </span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}