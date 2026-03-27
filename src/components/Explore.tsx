import { Link } from 'react-router';
import { Search, Filter, MapPin, Star, Clock, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Places' },
    { id: 'heritage', label: 'Heritage' },
    { id: 'food', label: 'Food & Dining' },
    { id: 'nature', label: 'Nature' },
    { id: 'shopping', label: 'Shopping' },
  ];

  const destinations = [
    {
      id: '1',
      name: 'Rajwada Palace',
      category: 'heritage',
      description: 'Historic royal palace with stunning Indo-Saracenic architecture',
      duration: '1-2 hours',
      rating: 4.8,
      reviews: 2543,
      price: 350,
      image: 'https://images.unsplash.com/photo-1721572321875-2610e9e83d55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBwYWxhY2UlMjBhcmNoaXRlY3R1cmUlMjBoZXJpdGFnZXxlbnwxfHx8fDE3NzQ2MTg0MDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: '2',
      name: 'Chappan Dukan',
      category: 'food',
      description: 'Famous food street with 56 shops offering local delicacies',
      duration: '2-3 hours',
      rating: 4.6,
      reviews: 3142,
      price: 180,
      image: 'https://images.unsplash.com/photo-1772460759097-ad68b3232a4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBzdHJlZXQlMjBmb29kJTIwbWFya2V0JTIwY29sb3JmdWx8ZW58MXx8fHwxNzc0NjE4NDA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: '3',
      name: 'Khajrana Ganesh',
      category: 'heritage',
      description: 'Revered temple dedicated to Lord Ganesha',
      duration: '45 mins',
      rating: 4.9,
      reviews: 4287,
      price: 0,
      image: 'https://images.unsplash.com/photo-1698153210197-5a1027c6c5e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxIaW5kdSUyMHRlbXBsZSUyMGdvbGRlbiUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NzQ2MTg0MDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: '4',
      name: 'Lotus Valley',
      category: 'nature',
      description: 'Serene natural valley with beautiful lotus ponds',
      duration: '1.5 hours',
      rating: 4.7,
      reviews: 1856,
      price: 250,
      image: 'https://images.unsplash.com/photo-1770615540460-3c47b7a1b10d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWFjZWZ1bCUyMGxvdHVzJTIwcG9uZCUyMG5hdHVyZXxlbnwxfHx8fDE3NzQ2MTg0MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  const filteredDestinations = destinations.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dest.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || dest.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 lg:p-8 pb-24 lg:pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 mb-2">Explore Destinations</h1>
        <p className="text-gray-600">Discover the best places in Indore</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search destinations..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all bg-white">
          <Filter className="w-5 h-5" />
          <span className="hidden sm:inline">Filters</span>
        </button>
      </div>

      {/* Categories */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all duration-300 ${
              selectedCategory === category.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-indigo-300 hover:shadow-md hover:scale-105'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Found <span className="font-medium text-gray-900">{filteredDestinations.length}</span> destinations
        </p>
      </div>

      {/* Destinations Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDestinations.map((destination) => (
          <div
            key={destination.id}
            className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2"
          >
            {/* Image */}
            <div className="relative h-56 overflow-hidden">
              <ImageWithFallback
                src={destination.image}
                alt={destination.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 group-hover:from-black/70 transition-all duration-300" />
              
              {/* Price Badge */}
              <div className="absolute top-4 right-4 transform transition-all duration-300 group-hover:scale-110">
                <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                  <span className="font-medium text-gray-900">
                    {destination.price === 0 ? 'Free' : `₹${destination.price}`}
                  </span>
                </div>
              </div>

              {/* Rating Badge */}
              <div className="absolute bottom-4 left-4 transform transition-all duration-300 group-hover:scale-110">
                <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-gray-900">{destination.rating}</span>
                  <span className="text-gray-600 text-sm">({destination.reviews})</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-xl text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-300">{destination.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{destination.description}</p>

              {/* Duration */}
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{destination.duration}</span>
              </div>

              {/* Action Button */}
              <Link
                to={`/destination/${destination.id}`}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 group/btn"
              >
                View Details
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}