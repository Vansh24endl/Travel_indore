import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, Star, Clock, MapPin, Users, Calendar, Heart, Share2, Check } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function DestinationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('');
  const [guests, setGuests] = useState(2);
  const [liked, setLiked] = useState(false);

  // Mock data - in real app would fetch by ID
  const destination = {
    id: id,
    name: 'Rajwada Palace',
    description: 'The Rajwada Palace is a historical palace located in the heart of Indore. Built in the 18th century by the Holkar dynasty, this magnificent structure showcases Indo-Saracenic architecture with its blend of Maratha, Mughal, and French styles.',
    fullDescription: 'Experience the grandeur of Indore\'s royal heritage at Rajwada Palace. This seven-story palace stands as a testament to the city\'s glorious past. Explore the intricate architecture, learn about the Holkar dynasty, and immerse yourself in the rich history that shaped modern Indore.',
    duration: '1-2 hours',
    rating: 4.8,
    reviews: 2543,
    price: 350,
    image: 'https://images.unsplash.com/photo-1721572321875-2610e9e83d55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBwYWxhY2UlMjBhcmNoaXRlY3R1cmUlMjBoZXJpdGFnZXxlbnwxfHx8fDE3NzQ2MTg0MDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    highlights: [
      'Indo-Saracenic architecture',
      'Historical museum',
      'Evening light & sound show',
      'Royal artifacts display',
      'Guided tours available'
    ],
    includes: [
      'Entry tickets',
      'Professional guide',
      'Historical insights',
      'Photo opportunities'
    ],
    timings: '9:00 AM - 6:00 PM',
    location: 'Rajwada, Indore, MP 452002'
  };

  const handleBooking = () => {
    // Create mock booking
    const bookingId = 'BK' + Math.random().toString(36).substr(2, 9).toUpperCase();
    navigate(`/booking/${bookingId}`);
  };

  return (
    <div className="pb-24 lg:pb-8">
      {/* Hero Image */}
      <div className="relative h-[400px] lg:h-[500px]">
        <ImageWithFallback
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <ArrowLeft className="w-5 h-5 text-gray-900" />
        </button>

        {/* Actions */}
        <div className="absolute top-6 right-6 flex gap-2">
          <button
            onClick={() => setLiked(!liked)}
            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <Heart className={`w-5 h-5 transition-all duration-300 ${liked ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-900'}`} />
          </button>
          <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 hover:scale-110 active:scale-95">
            <Share2 className="w-5 h-5 text-gray-900" />
          </button>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-3xl lg:text-4xl text-white mb-2">{destination.name}</h1>
          <div className="flex items-center gap-4 text-white">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span>{destination.rating}</span>
              <span className="text-white/80">({destination.reviews} reviews)</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-5 h-5" />
              <span>{destination.duration}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 lg:p-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-2xl text-gray-900 mb-4">About This Place</h2>
              <p className="text-gray-700 mb-4">{destination.description}</p>
              <p className="text-gray-600">{destination.fullDescription}</p>
            </div>

            {/* Highlights */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-2xl text-gray-900 mb-4">Highlights</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {destination.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-indigo-600" />
                    </div>
                    <span className="text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What's Included */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-2xl text-gray-900 mb-4">What's Included</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {destination.includes.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-2xl text-gray-900 mb-4">Details</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Timings</p>
                    <p className="text-gray-600">{destination.timings}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Location</p>
                    <p className="text-gray-600">{destination.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-8">
              <div className="mb-6">
                <p className="text-gray-600 mb-2">Price per person</p>
                <p className="text-3xl text-gray-900">₹{destination.price}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Guests
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">₹{destination.price} × {guests} guests</span>
                  <span className="font-medium text-gray-900">₹{destination.price * guests}</span>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <span className="font-medium text-gray-900">Total</span>
                  <span className="font-medium text-gray-900">₹{destination.price * guests}</span>
                </div>
              </div>

              <button
                onClick={handleBooking}
                disabled={!selectedDate}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-105 active:scale-95 disabled:hover:scale-100"
              >
                Book Now
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                Free cancellation up to 24 hours before
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}