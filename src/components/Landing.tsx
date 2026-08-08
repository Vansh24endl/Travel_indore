import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Compass,
  Sparkles,
  Search,
  ArrowRight,
  Landmark,
  Utensils,
  MapPin,
  Bot,
  UserCheck,
  ChevronRight,
  X,
  Menu
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Hero3DCanvas } from './ui/Hero3DCanvas'
import { DestinationHeroCard } from './ui/DestinationHeroCard'

const INDORE_SPOTS = [
  {
    id: 'rajwada',
    title: 'Rajwada Palace',
    subtitle: 'Historic 7-story Holkar kingdom palace & heritage bazaar.',
    badge: 'Holkar Legacy',
    tag: 'Royal Heritage',
    image: '/card_rajwada.png',
    icon: Landmark,
    category: 'Palaces',
  },
  {
    id: 'sarafa',
    title: 'Sarafa Night Market',
    subtitle: 'India’s famous midnight street food capital operating after 8 PM.',
    badge: 'Night Food',
    tag: 'Street Delicacies',
    image: '/card_sarafa.png',
    icon: Utensils,
    category: 'Street Food',
  },
  {
    id: 'chappan',
    title: 'Chappan Dukan',
    subtitle: '56 iconic food shops with Indore’s legendary Poha & Jalebi.',
    badge: '56 Delicacies',
    tag: 'Food Hub',
    image: '/card_chappan.png',
    icon: Sparkles,
    category: 'Street Food',
  },
  {
    id: 'patalpani',
    title: 'Patalpani & Lal Bagh',
    subtitle: 'Monsoon waterfall valley and grand Holkar royal estate grounds.',
    badge: 'Nature & Estate',
    tag: 'Scenic Escape',
    image: '/card_patalpani.png',
    icon: MapPin,
    category: 'Waterfalls',
  },
]

export function Landing() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpot, setSelectedSpot] = useState<typeof INDORE_SPOTS[0] | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const filteredSpots = searchQuery.trim()
    ? INDORE_SPOTS.filter(spot =>
        spot.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery)}`)
    } else {
      navigate('/explore')
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { y: 24, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 110, damping: 16 }
    }
  }

  return (
    <Hero3DCanvas>
      {/* Top Navbar - Full Width with Generous Side Padding */}
      <header className="relative z-30 w-full max-w-[90rem] mx-auto px-8 md:px-12 lg:px-16 py-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3.5 group">
          <div className="w-11 h-11 rounded-2xl bg-amber-400 p-0.5 shadow-lg shadow-amber-400/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Compass className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight text-white">
              Indore Explorer
            </span>
            <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase -mt-0.5">
              Travel & Food Guide
            </span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-9 px-7 py-2.5 rounded-full bg-slate-900/60 border border-white/10 backdrop-blur-md text-sm font-medium text-slate-300">
          <Link to="/" className="text-amber-400 font-semibold hover:text-white transition-colors">
            Home
          </Link>
          <Link to="/explore" className="hover:text-amber-300 transition-colors">
            Destinations
          </Link>
          <Link to="/ai-assistant" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
            <Bot className="w-4 h-4 text-amber-400" />
            <span>AI Assistant</span>
          </Link>
          <Link to="/explore" className="hover:text-amber-300 transition-colors">
            Food Guide
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all shadow-lg hover:scale-105"
            >
              <UserCheck className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-200 hover:text-white hover:bg-white/10 transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all shadow-lg hover:scale-105"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>  

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2.5 rounded-xl bg-white/10 text-white border border-white/15 cursor-pointer"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="md:hidden z-30 px-8 py-5 bg-slate-900/95 border-b border-white/10 backdrop-blur-2xl flex flex-col gap-4 text-slate-200"
          >
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/explore" onClick={() => setMobileMenuOpen(false)}>Destinations & Explore</Link>
            <Link to="/ai-assistant" onClick={() => setMobileMenuOpen(false)}>AI Itinerary Assistant</Link>
            <div className="pt-3 border-t border-white/10 flex gap-3">
              <Link to="/login" className="flex-1 text-center py-2.5 rounded-xl border border-white/15 font-bold">Sign In</Link>
              <Link to="/register" className="flex-1 text-center py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold">Sign Up</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Content - Expanded to Left Edge with Generous Spacing */}
      <main className="relative z-20 w-full max-w-[90rem] mx-auto px-8 md:px-12 lg:px-16 pt-10 pb-14 flex-1 flex flex-col justify-center text-left">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl space-y-8"
        >
          {/* Tagline Badge starting from left edge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Cleanest City in India • Indore Explorer
            </span>
          </motion.div>

          {/* Large Left-Aligned Hero Title */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.04] tracking-tight text-white drop-shadow-lg text-left max-w-4xl"
          >
            Discover the Heritage & Taste of{' '}
            <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-100 bg-clip-text text-transparent">
              Indore
            </span>
          </motion.h1>

          {/* Expanded Subtitle with Proper Breathing Room */}
          <motion.p
            variants={itemVariants}
            className="text-base md:text-xl text-slate-200/90 leading-relaxed font-normal max-w-2xl text-left"
          >
            Explore historic Holkar dynasty palaces, legendary midnight street food hubs, holy shrines, and scenic waterfall getaways.
          </motion.p>

          {/* Search Bar Widget aligned to left */}
          <motion.div variants={itemVariants} className="relative max-w-2xl pt-2 text-left">
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center p-2 rounded-2xl bg-slate-900/85 border border-white/20 backdrop-blur-xl shadow-2xl focus-within:border-amber-400 transition-all duration-300"
            >
              <Search className="w-5 h-5 text-amber-300 ml-4 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search destinations, food spots, palaces..."
                className="w-full bg-transparent px-4 py-2.5 text-base text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all shadow-md shrink-0 cursor-pointer"
              >
                <span>Search</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>

            {/* Quick Action Filter Chips */}
            <div className="flex flex-wrap items-center gap-2.5 pt-4">
              <button
                type="button"
                onClick={() => setSearchQuery('Sarafa')}
                className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-medium text-slate-200 backdrop-blur-md transition-colors cursor-pointer"
              >
                Sarafa Night Market
              </button>
              <button
                type="button"
                onClick={() => setSearchQuery('Rajwada')}
                className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-medium text-slate-200 backdrop-blur-md transition-colors cursor-pointer"
              >
                Rajwada Palace
              </button>
              <Link
                to="/ai-assistant"
                className="px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-xs font-semibold text-amber-300 backdrop-blur-md hover:bg-amber-400/20 transition-colors flex items-center gap-1.5"
              >
                <Bot className="w-4 h-4" />
                <span>AI Itinerary</span>
              </Link>
            </div>

            {/* Live Dropdown Suggestions */}
            <AnimatePresence>
              {filteredSpots.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-3 p-2.5 rounded-2xl bg-slate-900/95 border border-white/20 backdrop-blur-2xl shadow-2xl z-40 max-h-72 overflow-y-auto divide-y divide-white/10"
                >
                  {filteredSpots.map(spot => (
                    <div
                      key={spot.id}
                      onClick={() => {
                        setSelectedSpot(spot)
                        setSearchQuery('')
                      }}
                      className="p-3 hover:bg-white/10 rounded-xl cursor-pointer transition-colors flex items-center gap-3.5"
                    >
                      <img src={spot.image} alt={spot.title} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <h5 className="text-sm font-bold text-white">{spot.title}</h5>
                        <p className="text-xs text-slate-300">{spot.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </main>

      {/* Bottom Floating Feature Cards Container - Expanded Edge Spacing */}
      <footer className="relative z-20 w-full max-w-[90rem] mx-auto px-8 md:px-12 lg:px-16 pb-10 pt-4">
        <div className="flex items-center justify-between mb-4 text-xs font-semibold text-slate-300">
          <span className="uppercase tracking-wider text-amber-300 flex items-center gap-2 text-xs font-bold">
            <Sparkles className="w-4 h-4" />
            Top Featured Destinations
          </span>
          <Link to="/explore" className="hover:text-amber-300 transition-colors flex items-center gap-1">
            <span>Explore All Destinations</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {INDORE_SPOTS.map(spot => {
            const IconComp = spot.icon
            return (
              <DestinationHeroCard
                key={spot.id}
                id={spot.id}
                title={spot.title}
                subtitle={spot.subtitle}
                image={spot.image}
                badge={spot.badge}
                tag={spot.tag}
                icon={<IconComp className="w-4 h-4" />}
                onClick={() => setSelectedSpot(spot)}
              />
            )
          })}
        </motion.div>
      </footer>

      {/* Quick Preview Modal */}
      <AnimatePresence>
        {selectedSpot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-white/20 p-6 shadow-2xl text-white space-y-4 overflow-hidden"
            >
              <button
                onClick={() => setSelectedSpot(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-48 rounded-2xl overflow-hidden border border-white/15">
                <img src={selectedSpot.image} alt={selectedSpot.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2.5 py-1 rounded-full border border-amber-400/30">
                    {selectedSpot.badge}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">{selectedSpot.title}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{selectedSpot.subtitle}</p>
              </div>

              <div className="flex gap-3 pt-2">
                <Link
                  to="/explore"
                  className="flex-1 text-center py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all shadow-md"
                >
                  Explore Details
                </Link>
                <Link
                  to="/ai-assistant"
                  className="flex-1 text-center py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 font-bold text-sm text-white transition-all flex items-center justify-center gap-1.5"
                >
                  <Bot className="w-4 h-4 text-amber-300" />
                  <span>AI Plan Trip</span>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Hero3DCanvas>
  )
}
export default Landing