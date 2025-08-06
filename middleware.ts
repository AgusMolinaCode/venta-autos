import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Simplified middleware - All routes are now public
 * Only applies basic security headers
 */

/**
 * Main middleware function - No authentication, all routes open
 */
export async function middleware(_request: NextRequest) {
  // Add basic security headers to all responses
  const response = NextResponse.next()
  
  // Basic security headers (without authentication)
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  return response
}

/**
 * Configure which paths the middleware runs on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}