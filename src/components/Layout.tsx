import { Outlet, Link, useLocation, useNavigate } from 'react-router'
import { Home, Compass, Calendar, User, Menu, X, LogOut, ShieldAlert, Sparkles } from 'lucide-react'
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
    { to: '/ai-assistant', label: 'AI Assistant', icon: Sparkles },
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 px-6 pb-4">
          <div className="flex h-20 shrink-0 items-center">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Indore Explorer</h1>
                <p className="text-xs text-gray-550 dark:text-gray-400">Discover the heritage</p>
              </div>
            </Link>
          </div>
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
                        className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/50 rounded-xl"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Link
                      to={link.to}
                      className={`relative z-10 group flex gap-x-3 rounded-xl p-3 transition-all duration-300 ease-out ${
                        isActive
                          ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 hover:translate-x-1'
                      }`}
                    >
                      <Icon className={`h-6 w-6 shrink-0 transition-all duration-300 ${isActive ? 'text-indigo-600 dark:text-indigo-400 scale-110' : 'text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:scale-105'}`} />
                      <span className="font-semibold">{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex flex-col gap-2">
            <Link
              to="/profile"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300"
            >
              {user?.profileImage ? (
                <img src={user.profileImage} alt={user.fullname} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold transition-transform duration-300 hover:scale-110">
                  {userInitials}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.fullname}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all duration-300 font-medium"
            >
              <LogOut className="w-5 h-5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="sticky top-0 z-40 lg:hidden">
        <div className="flex h-16 items-center gap-x-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 shadow-sm">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-750 dark:text-gray-300 lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 text-sm font-semibold text-gray-900 dark:text-white">Indore Explorer</div>
          <Link to="/profile">
            {user?.profileImage ? (
              <img src={user.profileImage} alt={user.fullname} className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {userInitials}
              </div>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white dark:bg-gray-800 px-6 py-6 sm:max-w-sm shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <Compass className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">Indore Explorer</span>
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-200 dark:divide-gray-700">
                  <div className="space-y-2 py-6">
                    {navLinks.map((link) => {
                      const Icon = link.icon;
                      const isActive = location.pathname === link.to;
                      return (
                        <Link
                          key={link.to}
                          to={link.to}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-300 ${
                            isActive ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:translate-x-2'
                          }`}
                        >
                          <Icon className={`h-6 w-6 transition-all duration-300 ${isActive ? 'scale-110' : ''}`} />
                          <span className="font-semibold">{link.label}</span>
                        </Link>
                      );
                    })}
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false)
                        handleLogout()
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-red-650 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-300 font-medium"
                    >
                      <LogOut className="h-6 w-6" />
                      <span>Log out</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="lg:pl-72 min-h-screen flex flex-col">
        <div className="flex-1 p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-lg">
        <nav className="flex justify-around py-2">
          {navLinks.filter(l => l.to !== '/admin').map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className="relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 text-gray-500 dark:text-gray-400"
              >
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveNav"
                    className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/50 rounded-xl"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`relative z-10 h-5 w-5 transition-all duration-300 ${isActive ? 'text-indigo-600 dark:text-indigo-400 scale-110' : 'hover:scale-105 hover:text-indigo-600 dark:hover:text-indigo-400'}`} />
                <span className={`relative z-10 text-[10px] font-semibold transition-colors duration-300 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'hover:text-indigo-600 dark:hover:text-indigo-400'}`}>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
export default Layout