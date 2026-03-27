import { MapPin, Calendar, Users, ChevronRight, TrendingUp } from 'lucide-react';
import heroImage from 'figma:asset/2087b419776d2f470684ce10fc5e8533ab2cee00.png';

interface HomeProps {
  onNavigate: (tab: 'home' | 'route' | 'destinations' | 'wallet') => void;
}

export function Home({ onNavigate }: HomeProps) {
  const quickStats = [
    { label: 'Places', value: '50+', icon: MapPin },
    { label: 'Tours', value: '25', icon: TrendingUp },
  ];

  const popularPlaces = [
    { name: 'Rajwada Palace', visits: '2.5k visits' },
    { name: 'Chappan Dukan', visits: '3.1k visits' },
    { name: 'Khajrana Ganesh', visits: '4.2k visits' },
  ];

  return (
    <div className="pb-24 overflow-y-auto h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 px-6 pt-12 pb-8 rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="mb-1 text-[#e9e9ea] text-[13px]">INDORE EXPLORER</p>
            <h1 className="text-white text-3xl">Your Perfect Day</h1>
            <h1 className="text-white text-3xl">in Indore.</h1>
          </div>
        </div>
        
        <p className="text-indigo-100 mb-6">
          Discover the rich heritage and vibrant culture of Indore with curated experiences
        </p>

        {/* Quick Stats */}
        <div className="flex gap-3">
          {quickStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 flex-1">
                <Icon className="w-5 h-5 text-white mb-2" />
                <p className="text-2xl text-white">{stat.value}</p>
                <p className="text-indigo-200 text-sm">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mt-8">
        <h2 className="text-xl mb-4">Quick Start</h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onNavigate('route')}
            className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white p-6 rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-xl transition-all active:scale-95"
          >
            <MapPin className="w-6 h-6 mb-3" />
            <p className="font-medium">Plan Route</p>
            <p className="text-indigo-200 text-xs mt-1">Create itinerary</p>
          </button>
          
          <button
            onClick={() => onNavigate('destinations')}
            className="bg-gradient-to-br from-purple-600 to-purple-700 text-white p-6 rounded-2xl shadow-lg shadow-purple-200 hover:shadow-xl transition-all active:scale-95"
          >
            <Calendar className="w-6 h-6 mb-3" />
            <p className="font-medium">Explore</p>
            <p className="text-purple-200 text-xs mt-1">View places</p>
          </button>
        </div>
      </div>

      {/* Popular Right Now */}
      <div className="px-6 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl">Popular Right Now</h2>
          <button className="text-indigo-600 text-sm flex items-center gap-1">
            View All
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-3">
          {popularPlaces.map((place, index) => (
            <div
              key={place.name}
              className="flex items-center gap-4 bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-100"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{place.name}</p>
                <p className="text-sm text-gray-500">{place.visits}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Featured Banner */}
      <div className="px-6 mt-8 mb-6">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-amber-100 text-sm mb-1">SPECIAL OFFER</p>
            <p className="text-xl mb-2">Weekend Package</p>
            <p className="text-amber-100 text-sm mb-4">Save up to 30% on tours</p>
            <button className="bg-white text-orange-600 px-4 py-2 rounded-xl text-sm hover:bg-amber-50 transition-colors">
              Learn More
            </button>
          </div>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
        </div>
      </div>
    </div>
  );
}
