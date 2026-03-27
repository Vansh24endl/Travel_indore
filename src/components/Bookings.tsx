import { Link } from 'react-router';
import { Calendar, MapPin, Users, ArrowRight, Clock, CheckCircle, XCircle } from 'lucide-react';

export function Bookings() {
  const bookings = [
    {
      id: 'BK001',
      destination: 'Rajwada Palace Heritage Tour',
      image: 'https://images.unsplash.com/photo-1721572321875-2610e9e83d55?w=400',
      date: 'March 30, 2026',
      time: '10:00 AM',
      guests: 2,
      price: 700,
      status: 'confirmed',
      bookingDate: 'March 25, 2026'
    },
    {
      id: 'BK002',
      destination: 'Chappan Dukan Food Tour',
      image: 'https://images.unsplash.com/photo-1772460759097-ad68b3232a4f?w=400',
      date: 'April 5, 2026',
      time: '6:00 PM',
      guests: 4,
      price: 720,
      status: 'confirmed',
      bookingDate: 'March 26, 2026'
    },
    {
      id: 'BK003',
      destination: 'Lotus Valley Nature Walk',
      image: 'https://images.unsplash.com/photo-1770615540460-3c47b7a1b10d?w=400',
      date: 'March 15, 2026',
      time: '8:00 AM',
      guests: 2,
      price: 500,
      status: 'completed',
      bookingDate: 'March 10, 2026'
    },
    {
      id: 'BK004',
      destination: 'Khajrana Temple Visit',
      image: 'https://images.unsplash.com/photo-1698153210197-5a1027c6c5e8?w=400',
      date: 'March 20, 2026',
      time: '7:00 AM',
      guests: 3,
      price: 0,
      status: 'completed',
      bookingDate: 'March 18, 2026'
    },
  ];

  const upcomingBookings = bookings.filter(b => b.status === 'confirmed');
  const pastBookings = bookings.filter(b => b.status === 'completed');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 lg:p-8 pb-24 lg:pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 mb-2">My Bookings</h1>
        <p className="text-gray-600">Manage your upcoming and past trips</p>
      </div>

      {/* Upcoming Bookings */}
      <div className="mb-12">
        <h2 className="text-2xl text-gray-900 mb-6">Upcoming Trips</h2>
        {upcomingBookings.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No upcoming bookings</p>
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all"
            >
              Explore Destinations
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {upcomingBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group"
              >
                <div className="relative h-48">
                  <img
                    src={booking.image}
                    alt={booking.destination}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/70 transition-all duration-300" />
                  <div className="absolute top-4 right-4 transform transition-all duration-300 group-hover:scale-110">
                    <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <p className="text-white text-sm">Booking #{booking.id}</p>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors duration-300">{booking.destination}</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Calendar className="w-5 h-5" />
                      <span>{booking.date} at {booking.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Users className="w-5 h-5" />
                      <span>{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <span className="font-medium text-gray-900">Total:</span>
                      <span className="text-lg font-medium text-gray-900">
                        {booking.price === 0 ? 'Free' : `₹${booking.price}`}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/booking/${booking.id}`}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 group/btn"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Bookings */}
      <div>
        <h2 className="text-2xl text-gray-900 mb-6">Past Trips</h2>
        <div className="space-y-4">
          {pastBookings.map((booking) => (
            <Link
              key={booking.id}
              to={`/booking/${booking.id}`}
              className="block bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all"
            >
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={booking.image}
                    alt={booking.destination}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg text-gray-900 mb-1">{booking.destination}</h3>
                      <p className="text-sm text-gray-500">Booking #{booking.id}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {booking.price === 0 ? 'Free' : `₹${booking.price}`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}