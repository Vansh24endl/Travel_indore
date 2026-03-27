import { Link } from 'react-router';
import { TrendingUp, MapPin, Calendar, ArrowRight, Clock, Users } from 'lucide-react';

export function Dashboard() {
  const upcomingBooking = {
    id: 'BK001',
    destination: 'Rajwada Palace Heritage Tour',
    date: 'March 30, 2026',
    time: '10:00 AM',
    guests: 2,
    status: 'confirmed'
  };

  const recentDestinations = [
    { id: 1, name: 'Rajwada Palace', rating: 4.8, image: 'https://images.unsplash.com/photo-1721572321875-2610e9e83d55?w=400' },
    { id: 2, name: 'Chappan Dukan', rating: 4.6, image: 'https://images.unsplash.com/photo-1772460759097-ad68b3232a4f?w=400' },
    { id: 3, name: 'Khajrana Ganesh', rating: 4.9, image: 'https://images.unsplash.com/photo-1698153210197-5a1027c6c5e8?w=400' },
  ];

  const quickStats = [
    { label: 'Total Bookings', value: '12', icon: Calendar, color: 'indigo' },
    { label: 'Places Visited', value: '8', icon: MapPin, color: 'purple' },
    { label: 'Hours Traveled', value: '24', icon: Clock, color: 'pink' },
    { label: 'Travel Points', value: '850', icon: TrendingUp, color: 'amber' },
  ];

  return (
    <div className="p-4 lg:p-8 pb-24 lg:pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 mb-2">Welcome back, John!</h1>
        <p className="text-gray-600">Here's your travel overview</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
            >
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <p className="text-2xl text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors duration-300">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Booking */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl text-gray-900">Upcoming Trip</h2>
            <Link to="/bookings" className="text-indigo-600 text-sm flex items-center gap-1 hover:text-indigo-700">
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-6 lg:p-8 text-white">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="inline-flex px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm mb-3">
                  Booking #{upcomingBooking.id}
                </div>
                <h3 className="text-2xl mb-2">{upcomingBooking.destination}</h3>
                <p className="text-indigo-100">Experience the royal heritage</p>
              </div>
              <div className="px-4 py-2 bg-green-500 rounded-lg text-sm font-medium">
                Confirmed
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <Calendar className="w-5 h-5 text-indigo-200 mb-2" />
                <p className="text-sm text-indigo-200">Date & Time</p>
                <p className="font-medium">{upcomingBooking.date}</p>
                <p className="text-sm">{upcomingBooking.time}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <Users className="w-5 h-5 text-indigo-200 mb-2" />
                <p className="text-sm text-indigo-200">Guests</p>
                <p className="font-medium">{upcomingBooking.guests} People</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                to={`/booking/${upcomingBooking.id}`}
                className="flex-1 bg-white text-indigo-600 py-3 rounded-xl text-center font-medium hover:bg-gray-50 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
              >
                View Details
              </Link>
              <button className="flex-1 bg-white/20 backdrop-blur-sm text-white py-3 rounded-xl font-medium hover:bg-white/30 transition-all duration-300 hover:scale-105 active:scale-95">
                Get Directions
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/explore"
              className="block bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 transition-all duration-300 group-hover:scale-110">
                  <MapPin className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Explore Places</p>
                  <p className="text-sm text-gray-600">Discover new destinations</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </Link>

            <Link
              to="/bookings"
              className="block bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-xl hover:border-purple-200 transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-600 transition-all duration-300 group-hover:scale-110">
                  <Calendar className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">My Bookings</p>
                  <p className="text-sm text-gray-600">View all trips</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </Link>

            <Link
              to="/profile"
              className="block bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-xl hover:border-pink-200 transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center group-hover:bg-pink-600 transition-all duration-300 group-hover:scale-110">
                  <Users className="w-6 h-6 text-pink-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">My Profile</p>
                  <p className="text-sm text-gray-600">Account settings</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-pink-600 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl text-gray-900">Popular Destinations</h2>
          <Link to="/explore" className="text-indigo-600 text-sm flex items-center gap-1 hover:text-indigo-700">
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {recentDestinations.map((dest) => (
            <Link
              key={dest.id}
              to={`/destination/${dest.id}`}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all group"
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white font-medium">{dest.name}</p>
                  <div className="flex items-center gap-1 text-white text-sm">
                    <span>⭐</span>
                    <span>{dest.rating}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}