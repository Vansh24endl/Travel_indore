import { Outlet, Link, useLocation, useNavigate } from 'react-router'
import { Home, Compass, Calendar, User, Menu, X, LogOut, ShieldAlert, Sparkles, Sun, Search, Bell } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { motion, AnimatePresence } from 'framer-motion'

export function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const isLandingPage = location.pathname === '/'
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
    { to: '/explore', label: 'Explore', icon: Compass },
    { to: '/bookings', label: 'My Bookings', icon: Calendar },
    { to: '/ai-assistant', label: 'AI Copilot', icon: Sparkles },
    { to: '/profile', label: 'Profile', icon: User },
  ]

  // Add Admin Panel link if user is admin
  if (user && user.role === 'admin') {
    navLinks.push({ to: '/admin', label: 'Admin Panel', icon: ShieldAlert })
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (isLandingPage || isAuthPage) {
    return <Outlet />
  }

  const userInitials = user?.fullname ? user.fullname.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U'

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans relative overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[30rem] h-[30rem] bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Floating Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:top-6 lg:bottom-6 lg:left-6 lg:z-40 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-6 overflow-y-auto glass-sidebar rounded-3xl p-6 shadow-2xl transition-all duration-300">
          
          {/* Logo Brand Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
            <Link to="/" className="flex items-center gap-3.5 group">
              <div className="w-11 h-11 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
                <Compass className="w-6 h-6 text-white animate-spin-slow" />
              </div>
              <div className="text-left">
                <h1 className="text-lg font-black tracking-tight font-heading text-slate-900 dark:text-white leading-tight">
                  Indore Explorer
                </h1>
                <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">Smart Travel MVP</p>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <li key={link.to} className="relative">
                    {isActive && (
                      <motion.div
                        layoutId="desktopActiveNav"
                        className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg shadow-indigo-600/25"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Link
                      to={link.to}
                      className={`relative z-10 group flex items-center gap-x-3.5 rounded-2xl px-4 py-3 text-sm font-bold transition-all duration-300 ${
                        isActive
                          ? 'text-white'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white hover:translate-x-1'
                      }`}
                    >
                      <Icon className={`h-5 w-5 shrink-0 transition-transform duration-300 ${isActive ? 'text-white scale-110' : 'text-slate-400 group-hover:text-indigo-500 group-hover:scale-110'}`} />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Account Quick Panel Footer */}
          <div className="border-t border-slate-200/60 dark:border-slate-800 pt-4 flex flex-col gap-2">
            <Link
              to="/profile"
              className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-all duration-300 text-left group"
            >
              {user?.profileImage ? (
                <img src={user.profileImage} alt={user.fullname} className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500/30 group-hover:scale-105 transition-transform" />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md group-hover:scale-105 transition-transform">
                  {userInitials}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.fullname}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all duration-300 text-xs font-bold cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Top Header Bar */}
      <div className="lg:pl-84 pt-6 px-6 lg:px-8">
        <header className="glass-panel rounded-3xl px-6 py-3.5 shadow-md flex items-center justify-between gap-4 border border-white/40 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Weather status widget */}
            <div className="hidden sm:flex items-center gap-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3.5 py-1.5 rounded-full border border-amber-500/20 text-xs font-bold">
              <Sun className="w-4 h-4 text-amber-500 animate-spin-slow" />
              <span>Indore 28°C • Sunny</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/explore"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-xs font-medium border border-slate-200/50 dark:border-slate-700 hover:border-indigo-500 transition-all"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search destinations...</span>
              <kbd className="bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded text-[10px] font-mono border">⌘K</kbd>
            </Link>

            <Link
              to="/ai-assistant"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow-md shadow-indigo-600/20 hover:scale-105 transition-all"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>AI Copilot</span>
            </Link>

            <Link to="/profile" className="lg:hidden">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {userInitials}
                </div>
              )}
            </Link>
          </div>
        </header>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 z-50 w-80 glass-sidebar px-6 py-6 shadow-2xl flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
                      <Compass className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-base font-extrabold text-slate-900 dark:text-white font-heading">Indore Explorer</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.to;
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    handleLogout()
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-sm font-bold transition-all"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Body */}
      <main className="lg:pl-84 min-h-[calc(100vh-100px)] flex flex-col pb-24 lg:pb-12">
        <div className="flex-1 p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Floating Bottom Bar */}
      <div className="fixed bottom-4 left-4 right-4 z-40 lg:hidden glass-panel rounded-3xl p-2 shadow-2xl border border-white/40 dark:border-slate-800">
        <nav className="flex justify-around items-center">
          {navLinks.filter(l => l.to !== '/admin').map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all text-slate-500 dark:text-slate-400"
              >
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveNav"
                    className="absolute inset-0 bg-indigo-600 text-white rounded-2xl shadow-md"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`relative z-10 h-5 w-5 transition-transform ${isActive ? 'text-white scale-110' : ''}`} />
                <span className={`relative z-10 text-[9px] font-bold ${isActive ? 'text-white' : ''}`}>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
export default Layout