import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Calendar, MapPin, Users, Clock, Download, Phone, Mail, CheckCircle, Navigation as NavigationIcon } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock booking data
  const booking = {
    id: id,
    destination: 'Rajwada Palace Heritage Tour',
    description: 'Explore the historic royal palace with a professional guide',
    image: 'https://images.unsplash.com/photo-1721572321875-2610e9e83d55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBwYWxhY2UlMjBhcmNoaXRlY3R1cmUlMjBoZXJpdGFnZXxlbnwxfHx8fDE3NzQ2MTg0MDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    date: 'March 30, 2026',
    time: '10:00 AM',
    duration: '2 hours',
    guests: 2,
    price: 350,
    totalPrice: 700,
    status: 'confirmed',
    bookingDate: 'March 25, 2026',
    confirmationCode: id?.toUpperCase() || 'BK001',
    location: {
      address: 'Rajwada, Indore, MP 452002',
      coordinates: { lat: 22.7196, lng: 75.8577 }
    },
    guide: {
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      email: 'rajesh@indoreexplorer.com',
      photo: null
    },
    includes: [
      'Entry tickets to palace',
      'Professional guide service',
      'Historical insights and stories',
      'Photo opportunities',
      'Complimentary refreshments'
    ],
    meetingPoint: 'Main entrance of Rajwada Palace',
    instructions: [
      'Please arrive 15 minutes before scheduled time',
      'Wear comfortable walking shoes',
      'Photography allowed in designated areas',
      'Modest dress code required'
    ]
  };

  return (
    <div className="pb-24 lg:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto p-4 lg:p-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white mb-6 hover:text-indigo-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Bookings</span>
          </button>

          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-indigo-200 text-sm mb-1">BOOKING CONFIRMATION</p>
              <h1 className="text-3xl mb-2">#{booking.confirmationCode}</h1>
            </div>
            <div className="px-4 py-2 bg-green-500 rounded-xl font-medium flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </div>
          </div>

          <p className="text-indigo-100">Booked on {booking.bookingDate}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 lg:p-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Destination Info */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="relative h-64">
                <ImageWithFallback
                  src={booking.image}
                  alt={booking.destination}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h2 className="text-2xl text-white mb-1">{booking.destination}</h2>
                  <p className="text-white/90">{booking.description}</p>
                </div>
              </div>

              <div className="p-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date & Time</p>
                      <p className="font-medium text-gray-900">{booking.date}</p>
                      <p className="text-sm text-gray-600">{booking.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium text-gray-900">{booking.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Guests</p>
                      <p className="font-medium text-gray-900">{booking.guests} {booking.guests === 1 ? 'Person' : 'People'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Meeting Point</p>
                      <p className="font-medium text-gray-900">{booking.meetingPoint}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-xl text-gray-900 mb-4">What's Included</h3>
              <div className="space-y-3">
                {booking.includes.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Instructions */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <h3 className="text-xl text-gray-900 mb-4">Important Instructions</h3>
              <ul className="space-y-2">
                {booking.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-700">
                    <span className="text-amber-600 flex-shrink-0">•</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Location */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-xl text-gray-900 mb-4">Location</h3>
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">{booking.location.address}</p>
              </div>
              <button className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium">
                <NavigationIcon className="w-5 h-5" />
                Get Directions
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Guide Info */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-lg text-gray-900 mb-4">Your Guide</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                  {booking.guide.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{booking.guide.name}</p>
                  <p className="text-sm text-gray-600">Tour Guide</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <a
                  href={`tel:${booking.guide.phone}`}
                  className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span className="text-sm">{booking.guide.phone}</span>
                </a>
                <a
                  href={`mailto:${booking.guide.email}`}
                  className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span className="text-sm">{booking.guide.email}</span>
                </a>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-lg text-gray-900 mb-4">Payment Summary</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>₹{booking.price} × {booking.guests} guests</span>
                  <span>₹{booking.totalPrice}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">Total Paid</span>
                    <span className="font-medium text-gray-900">₹{booking.totalPrice}</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
                ✓ Payment completed
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 group">
                <Download className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                Download Ticket
              </button>
              
              <button className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:border-gray-400 transition-all duration-300 hover:shadow-md hover:scale-105 active:scale-95">
                Contact Support
              </button>

              {booking.status === 'confirmed' && (
                <button className="w-full border-2 border-red-300 text-red-600 py-3 rounded-xl font-medium hover:border-red-400 transition-all duration-300 hover:bg-red-50 hover:scale-105 active:scale-95">
                  Cancel Booking
                </button>
              )}
            </div>

            {/* Cancellation Policy */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Cancellation Policy</h3>
              <p className="text-sm text-gray-600">
                Free cancellation up to 24 hours before the scheduled time. 
                After that, 50% refund available up to 12 hours before.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}