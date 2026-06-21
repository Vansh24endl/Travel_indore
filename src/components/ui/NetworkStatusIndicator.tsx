import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wifi, WifiOff, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'

export const NetworkStatusIndicator: React.FC = () => {
  const { isOnline, isChecking, checkConnection } = useNetworkStatus()
  const [showIndicator, setShowIndicator] = useState<boolean>(false)
  const [lastState, setLastState] = useState<boolean>(true) // Track last connection state to trigger transition
  const [showStatusRestored, setShowStatusRestored] = useState<boolean>(false)
  const [reconnectFailed, setReconnectFailed] = useState<boolean>(false)

  useEffect(() => {
    // Show indicator if the user is offline
    if (!isOnline) {
      setShowIndicator(true)
      setShowStatusRestored(false)
      setLastState(false)
    } else {
      // If we were offline and now we are online, trigger the "Connection Restored" flash
      if (!lastState) {
        setShowStatusRestored(true)
        setShowIndicator(true)
        setLastState(true)

        // Dismiss the online notification after 3 seconds
        const timer = setTimeout(() => {
          setShowIndicator(false)
          setShowStatusRestored(false)
        }, 3200)

        return () => clearTimeout(timer)
      } else {
        // If it was already online from the start, do not show anything
        setShowIndicator(false)
      }
    }
  }, [isOnline, lastState])

  const handleReconnect = async () => {
    setReconnectFailed(false)
    const success = await checkConnection()
    if (!success) {
      // Trigger a temporary failed shake/state feedback
      setReconnectFailed(true)
      setTimeout(() => setReconnectFailed(false), 800)
    }
  }

  // Animation variants
  const toastVariants = {
    initial: { opacity: 0, y: 50, scale: 0.95 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: 'spring', damping: 25, stiffness: 200 }
    },
    exit: { 
      opacity: 0, 
      y: 30, 
      scale: 0.95,
      transition: { duration: 0.25, ease: 'easeOut' }
    }
  }

  const shakeVariants = {
    shake: {
      x: [0, -10, 10, -10, 10, -5, 5, 0],
      transition: { duration: 0.5 }
    },
    idle: { x: 0 }
  }

  return (
    <AnimatePresence>
      {showIndicator && (
        <motion.div
          variants={toastVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-[100] max-w-sm w-[calc(100vw-2rem)] sm:w-96"
        >
          <motion.div
            variants={shakeVariants}
            animate={reconnectFailed ? "shake" : "idle"}
            className={`relative overflow-hidden rounded-2xl border backdrop-blur-xl shadow-2xl p-5 flex flex-col gap-4 transition-colors duration-500 ${
              showStatusRestored
                ? 'bg-emerald-500/10 dark:bg-emerald-950/20 border-emerald-500/30 dark:border-emerald-500/20 text-emerald-900 dark:text-emerald-100'
                : 'bg-rose-500/10 dark:bg-rose-950/20 border-rose-500/30 dark:border-rose-500/20 text-rose-900 dark:text-rose-100'
            }`}
          >
            {/* Ambient Background Glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl transform translate-x-10 -translate-y-10 opacity-30 ${
              showStatusRestored ? 'bg-emerald-500' : 'bg-rose-500'
            }`} />

            <div className="flex gap-4 items-start relative z-10">
              {/* Animated Icon Container */}
              <div className={`p-3.5 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${
                showStatusRestored 
                  ? 'bg-emerald-500/20 dark:bg-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
                  : 'bg-rose-500/20 dark:bg-rose-500/30 text-rose-600 dark:text-rose-400'
              }`}>
                {showStatusRestored ? (
                  <motion.div
                    initial={{ scale: 0.5, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 10 }}
                  >
                    <CheckCircle2 className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [1, 0.8, 1]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2.5,
                      ease: "easeInOut"
                    }}
                  >
                    <WifiOff className="w-6 h-6" />
                  </motion.div>
                )}
              </div>

              {/* Status Details */}
              <div className="flex-1 space-y-1">
                <h4 className="font-extrabold text-[15px] tracking-tight">
                  {showStatusRestored ? 'Connection Restored' : 'Connection Interrupted'}
                </h4>
                <p className="text-xs leading-relaxed opacity-85">
                  {showStatusRestored 
                    ? "You are back online. Accessing live Indore travels database."
                    : "You are currently offline. Check your internet connection."}
                </p>
              </div>
            </div>

            {/* Offline Action Controls */}
            {!showStatusRestored && (
              <div className="flex flex-col gap-2 relative z-10 pt-2 border-t border-rose-500/10">
                <button
                  onClick={handleReconnect}
                  disabled={isChecking}
                  className="w-full inline-flex items-center justify-center gap-2 bg-rose-600 dark:bg-rose-700/80 hover:bg-rose-700 hover:dark:bg-rose-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all duration-300 shadow-md hover:scale-[1.02] disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isChecking ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5" />
                  )}
                  <span>{isChecking ? 'Checking Connection...' : 'Try Reconnecting'}</span>
                </button>

                {reconnectFailed && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[10px] text-center text-rose-500 font-semibold"
                  >
                    Still offline. Please check your network and try again.
                  </motion.p>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default NetworkStatusIndicator
