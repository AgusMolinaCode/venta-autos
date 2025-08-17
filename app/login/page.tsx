import { LoginForm } from '@/components/auth/login-form'
import { ModeToggle } from '@/components/ui/ModeToggle'
import { Car } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header con toggle de tema */}
      <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header con logo y título */}
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6">
              <Car className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Bienvenido de vuelta
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Inicia sesión en tu cuenta para continuar
            </p>
          </div>

          {/* Formulario de login */}
          <div className="bg-card border border-border rounded-xl shadow-lg p-8">
            <LoginForm />
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              © 2025 Venta Autos. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}