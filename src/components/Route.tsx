import { MapPin, Calendar, Users, ArrowLeft, Navigation as NavigationIcon } from 'lucide-react';
import { useState } from 'react';

interface RouteProps {
  onNavigate: (tab: 'home' | 'route' | 'destinations' | 'wallet') => void;
}

export function Route({ onNavigate }: RouteProps) {
  const [startingPoint, setStartingPoint] = useState('');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState('');

  const handlePlanRoute = () => {
    if (startingPoint && date && guests) {
      onNavigate('destinations');
    }
  };

  return (
    <div className="pb-24 overflow-y-auto h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 px-6 pt-12 pb-24 rounded-b-[3rem]">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-white mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        
        <h1 className="text-white text-3xl mb-2">Plan Your Route</h1>
        <p className="text-indigo-200">Create your perfect itinerary</p>
      </div>

      {/* Form Card */}
      <div className="px-6 -mt-16">
        <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-200/50 p-6 space-y-6">
          {/* Starting Point */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 mb-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-indigo-600" />
              </div>
              <span>Starting Point</span>
            </label>
            <input
              type="text"
              value={startingPoint}
              onChange={(e) => setStartingPoint(e.target.value)}
              placeholder="Enter your location"
              className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <p className="text-xs text-gray-500 mt-2">We'll plan your route from here</p>
          </div>

          {/* Date */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 mb-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
              <span>Select Date</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Guests */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 mb-3">
              <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-pink-600" />
              </div>
              <span>Number of Guests</span>
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all appearance-none cursor-pointer"
            >
              <option value="">Select guests</option>
              <option value="1">1 Guest</option>
              <option value="2">2 Guests</option>
              <option value="3">3 Guests</option>
              <option value="4">4 Guests</option>
              <option value="5+">5+ Guests</option>
            </select>
          </div>

          {/* Action Button */}
          <button
            onClick={handlePlanRoute}
            disabled={!startingPoint || !date || !guests}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-medium shadow-lg shadow-indigo-200 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none active:scale-95 flex items-center justify-center gap-2"
          >
            <NavigationIcon className="w-5 h-5" />
            Generate Route
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="px-6 mt-8">
        <h3 className="text-sm text-gray-500 mb-3">PLANNING TIPS</h3>
        <div className="space-y-3">
          <div className="flex gap-3 items-start">
            <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 bg-indigo-600 rounded-full" />
            </div>
            <p className="text-sm text-gray-600">Best time to visit is early morning or late afternoon</p>
          </div>
          <div className="flex gap-3 items-start">
            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 bg-purple-600 rounded-full" />
            </div>
            <p className="text-sm text-gray-600">Most popular spots can get crowded on weekends</p>
          </div>
          <div className="flex gap-3 items-start">
            <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 bg-pink-600 rounded-full" />
            </div>
            <p className="text-sm text-gray-600">Book tickets in advance for heritage sites</p>
          </div>
        </div>
      </div>
    </div>
  );
}
