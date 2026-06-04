import React from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { Compass, Sparkles, Map, ShieldCheck, ArrowRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export function Landing() {
  const { user } = useAuth()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring' as any, stiffness: 100 }
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden relative font-sans">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-500/10 blur-[150px]" />
      
      {/* Header / Navbar */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Compass className="w-6 h-6 text-white animate-pulse" />
          </div>
          <span className="text-2xl font-black tracking-wide bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Indore Explorer
          </span>
        </Link>
        <div className="flex gap-4">
          {user ? (
            <Link
              to="/dashboard"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold transition-all duration-300 shadow-md hover:shadow-indigo-500/20 hover:scale-105"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 font-bold transition-all duration-300"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold transition-all duration-300 shadow-md hover:shadow-indigo-500/20"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-semibold text-indigo-300">Cleanest City in India</span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight"
          >
            Discover the Heritage & Taste of{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              Indore
            </span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-400 max-w-lg leading-relaxed"
          >
            Explore historic palaces, mouth-watering street food hubs, holy shrines, and scenic getaways. Start planning your custom travel itinerary today.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-2">
            <Link
              to={user ? '/dashboard' : '/login'}
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 font-bold transition-all duration-300 shadow-xl shadow-indigo-600/30 hover:scale-[1.03]"
            >
              <span>Explore Portal</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to={user ? '/ai-assistant' : '/login'}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 font-bold transition-all duration-300 hover:scale-[1.03]"
            >
              <span>AI Itinerary Planner</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature Cards Showcase */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid sm:grid-cols-2 gap-6"
        >
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center mb-6">
              <Compass className="w-6 h-6 text-indigo-400" />
            </div>
            <h4 className="text-xl font-bold mb-2">Heritage Guide</h4>
            <p className="text-gray-400 text-sm">Detailed guide of Holkar monuments, palaces, and colonial buildings.</p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 bg-emerald-600/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6 text-emerald-400" />
            </div>
            <h4 className="text-xl font-bold mb-2">AI Assistant</h4>
            <p className="text-gray-400 text-sm">Smart itinerary recommendations tailored to your taste and budget.</p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 bg-purple-600/20 border border-purple-500/30 rounded-2xl flex items-center justify-center mb-6">
              <Map className="w-6 h-6 text-purple-400" />
            </div>
            <h4 className="text-xl font-bold mb-2">Interactive Map</h4>
            <p className="text-gray-400 text-sm">Plot nearby spots, calculate distances, and plan directions easily.</p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 bg-rose-600/20 border border-rose-500/30 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6 text-rose-400" />
            </div>
            <h4 className="text-xl font-bold mb-2">Secure Booking</h4>
            <p className="text-gray-400 text-sm">Confirm tour reservations and tickets directly via your private portal.</p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 py-6 border-t border-white/5 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Indore Explorer. Built for Travelers.
      </footer>
    </div>
  )
}
export default Landing