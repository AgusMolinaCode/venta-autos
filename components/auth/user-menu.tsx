'use client'

import { useAuth } from './auth-provider'
import { Button } from '@/components/ui/button'
import { LoginForm } from './login-form'
import { User, LogOut } from 'lucide-react'

export function UserMenu() {
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-pulse bg-gray-300 rounded h-8 w-20"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="p-4 border rounded-lg bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-center">Iniciar Sesión</h3>
        <LoginForm />
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-3 p-4 border rounded-lg bg-white shadow-sm">
      <div className="flex items-center space-x-2 flex-1">
        <User className="h-5 w-5 text-gray-600" />
        <div>
          <p className="text-sm font-medium text-gray-900">{user.email}</p>
          <p className="text-xs text-gray-500">Autenticado</p>
        </div>
      </div>
      <Button
        onClick={signOut}
        variant="outline"
        size="sm"
        className="flex items-center space-x-1"
      >
        <LogOut className="h-4 w-4" />
        <span>Salir</span>
      </Button>
    </div>
  )
}