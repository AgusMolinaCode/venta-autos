"use client"

import * as React from "react"
import { LogOut, User } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface UserMenuSidebarProps {
  className?: string
}

export function UserMenuSidebar({ className }: UserMenuSidebarProps) {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (!user) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className={cn(
          "flex cursor-pointer select-none items-center rounded-md p-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
          className
        )}>
          <div className="flex items-center gap-2 w-full">
            <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-xs text-white font-bold">
              {user.email?.charAt(0).toUpperCase() || "U"}
            </div>
            {/* <div className="flex flex-col items-start min-w-0 flex-1">
              <span className="truncate text-sm font-medium">
                {user.email}
              </span>
              <span className="text-xs text-muted-foreground">
                Usuario
              </span>
            </div> */}
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem disabled className="flex flex-col items-start">
          <div className="font-medium">{user.email}</div>
          <div className="text-xs text-muted-foreground">Usuario autenticado</div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="flex items-center cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}