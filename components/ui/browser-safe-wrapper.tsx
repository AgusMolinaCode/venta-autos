'use client'

import { useEffect, useState } from 'react'

interface BrowserSafeWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Component that prevents hydration errors caused by browser extensions
 * by only rendering children after hydration is complete
 */
export function BrowserSafeWrapper({ children, fallback = null }: BrowserSafeWrapperProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <>{fallback}</>
  }

  return <div suppressHydrationWarning>{children}</div>
}