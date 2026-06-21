import { useState, useEffect, useCallback } from 'react'
import api from '@/services/api'

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine)
  const [isChecking, setIsChecking] = useState<boolean>(false)

  // Handlers for actual window network events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
    }
    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Function to actively check if the network is reachable by calling the backend
  const checkConnection = useCallback(async (): Promise<boolean> => {
    setIsChecking(true)
    // Wait for at least 800ms to show the beautiful loader transition
    const minWait = new Promise((resolve) => setTimeout(resolve, 800))
    
    try {
      // Ping api /api/destinations or a light backend endpoint
      const pingPromise = api.get('/api/destinations', { timeout: 3000 })
      await Promise.all([pingPromise, minWait])
      
      setIsOnline(true)
      setIsChecking(false)
      return true
    } catch (error) {
      await minWait
      // If error is just an API failure (like 401 Unauthorized), it means we ARE online.
      // If error is a network error (no response or network timeout), we are offline.
      const isNetworkError = !(error as any).response
      
      if (isNetworkError) {
        setIsOnline(false)
        setIsChecking(false)
        return false
      } else {
        // API responded but with error status, meaning internet is up
        setIsOnline(true)
        setIsChecking(false)
        return true
      }
    }
  }, [])

  return {
    isOnline,
    isChecking,
    checkConnection,
  }
}
