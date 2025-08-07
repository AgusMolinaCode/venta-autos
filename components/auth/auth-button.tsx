'use client'

import { useAuth } from './auth-provider'
import { Button } from '@/components/ui/button'
import { User, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function AuthButton() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-300 rounded h-8 w-20"></div>
    )
  }

  if (!user) {
    return (
      <Button
        onClick={() => router.push('/login')}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        Iniciar Sesión
      </Button>
    )
  }

  return (
    <div className="flex items-center space-x-3">
      <Button
        onClick={() => router.push('/dashboard')}
        variant="outline"
        className="flex items-center space-x-2"
      >
        <User className="h-4 w-4" />
        <span>Dashboard</span>
      </Button>
      <Button
        onClick={signOut}
        variant="outline"
        className="flex items-center space-x-2"
      >
        <LogOut className="h-4 w-4" />
        <span>Salir</span>
      </Button>
    </div>
  )
}