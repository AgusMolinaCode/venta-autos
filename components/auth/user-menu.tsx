'use client'

import { useAuth } from './auth-provider'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LoginForm } from './login-form'
import { User, LogOut, Settings } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function UserMenu() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const handleDashboard = () => {
    router.push('/dashboard')
  }

  const handleLogin = () => {
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-pulse bg-muted rounded-full h-10 w-10"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="p-6 border border-border rounded-xl bg-card shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-center text-foreground">Iniciar Sesión</h3>
        <LoginForm />
        <div className="mt-4 text-center">
          <Button onClick={handleLogin} variant="outline" size="sm">
            ¿Ya tienes cuenta? Inicia sesión
          </Button>
        </div>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-accent">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-sm text-white font-semibold shadow-lg">
            {user.email?.charAt(0).toUpperCase() || "U"}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-sm text-white font-semibold">
            {user.email?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium text-foreground">{user.email}</p>
            <p className="w-[180px] truncate text-sm text-muted-foreground">
              Usuario autenticado
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDashboard} className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Dashboard</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Configuración</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}