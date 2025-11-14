'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AutoRefresh() {
  const router = useRouter()
  
  useEffect(() => {
    // Refresh every 5 seconds
    const interval = setInterval(() => {
      router.refresh()
    }, 5000)
    
    return () => clearInterval(interval)
  }, [router])
  
  return null
}
