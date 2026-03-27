import { Home, MapPin, Compass, Wallet } from 'lucide-react';

interface NavigationProps {
  activeTab: 'home' | 'route' | 'destinations' | 'wallet';
  onNavigate: (tab: 'home' | 'route' | 'destinations' | 'wallet') => void;
}

export function Navigation({ activeTab, onNavigate }: NavigationProps) {
  const tabs = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'route' as const, label: 'Route', icon: MapPin },
    { id: 'destinations' as const, label: 'Explore', icon: Compass },
    { id: 'wallet' as const, label: 'Wallet', icon: Wallet },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto px-6 py-4 bg-[#1c1818e6]">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className="flex flex-col items-center gap-1 transition-all active:scale-95"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-200'
                      : 'bg-gray-100'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? 'text-white' : 'text-gray-600'
                    }`}
                  />
                </div>
                <span
                  className={`text-xs ${
                    isActive ? 'text-indigo-600' : 'text-gray-600'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
