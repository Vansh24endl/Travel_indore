import { Outlet, Link, useLocation } from 'react-router';
import { Home, Compass, Calendar, User, Menu, X, LogIn } from 'lucide-react';
import { useState } from 'react';

export function Layout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  const isLandingPage = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
    { to: '/explore', label: 'Explore', icon: Compass },
    { to: '/bookings', label: 'My Bookings', icon: Calendar },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  if (isLandingPage || isAuthPage) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 pb-4">
          <div className="flex h-20 shrink-0 items-center">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl text-gray-900">Indore Explorer</h1>
                <p className="text-xs text-gray-500">Discover the heritage</p>
              </div>
            </Link>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className={`group flex gap-x-3 rounded-xl p-3 transition-all duration-300 ease-out ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                          : 'text-gray-700 hover:bg-gray-50 hover:translate-x-1'
                      }`}
                    >
                      <Icon className={`h-6 w-6 shrink-0 transition-all duration-300 ${isActive ? 'text-indigo-600 scale-110' : 'text-gray-400 group-hover:text-indigo-600 group-hover:scale-105'}`} />
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          
          <div className="border-t border-gray-200 pt-4">
            <Link
              to="/profile"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:shadow-md"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white transition-transform duration-300 hover:scale-110">
                JD
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">john@example.com</p>
              </div>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="sticky top-0 z-40 lg:hidden">
        <div className="flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 text-sm font-semibold text-gray-900">Indore Explorer</div>
          <Link to="/profile">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm">
              JD
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="relative z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm transition-opacity duration-300" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm transform transition-transform duration-300 ease-out shadow-2xl">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center transition-transform duration-300 hover:scale-110">
                  <Compass className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold">Indore Explorer</span>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700 hover:bg-gray-100 transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-200">
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
                          isActive ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-gray-700 hover:bg-gray-50 hover:translate-x-2'
                        }`}
                      >
                        <Icon className={`h-6 w-6 transition-all duration-300 ${isActive ? 'scale-110' : ''}`} />
                        <span className="font-medium">{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="lg:pl-72">
        <div className="min-h-screen">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md shadow-lg">
        <nav className="flex justify-around py-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex flex-col items-center gap-1 px-3 py-2 transition-all duration-300 ${
                  isActive ? 'text-indigo-600 scale-105' : 'text-gray-500 hover:text-indigo-600'
                }`}
              >
                <Icon className={`h-6 w-6 transition-all duration-300 ${isActive ? 'scale-110' : 'hover:scale-105'}`} />
                <span className="text-xs font-medium">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}