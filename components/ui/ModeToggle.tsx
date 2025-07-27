"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="relative overflow-hidden">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Cambiar tema</span>
      </Button>
    )
  }

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={toggleTheme}
      className="relative overflow-hidden"
      title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all duration-300 dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all duration-300 dark:scale-100 dark:rotate-0" />
      <span className="sr-only">
        {theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      </span>
    </Button>
  )
}