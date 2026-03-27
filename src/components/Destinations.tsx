import { ArrowLeft, MapPin, Clock, Star, Heart, Share2 } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface DestinationsProps {
  onNavigate: (tab: 'home' | 'route' | 'destinations' | 'wallet') => void;
}

export function Destinations({ onNavigate }: DestinationsProps) {
  const [likedPlaces, setLikedPlaces] = useState<Set<string>>(new Set());

  const destinations = [
    {
      id: '1',
      name: 'Rajwada Palace',
      description: 'Historic royal palace with stunning Indo-Saracenic architecture',
      duration: '1-2 hours',
      rating: 4.8,
      reviews: 2543,
      image: 'https://images.unsplash.com/photo-1721572321875-2610e9e83d55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBwYWxhY2UlMjBhcmNoaXRlY3R1cmUlMjBoZXJpdGFnZXxlbnwxfHx8fDE3NzQ2MTg0MDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      distance: '2.5 km'
    },
    {
      id: '2',
      name: 'Chappan Dukan',
      description: 'Famous food street with 56 shops offering local delicacies',
      duration: '2-3 hours',
      rating: 4.6,
      reviews: 3142,
      image: 'https://images.unsplash.com/photo-1772460759097-ad68b3232a4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBzdHJlZXQlMjBmb29kJTIwbWFya2V0JTIwY29sb3JmdWx8ZW58MXx8fHwxNzc0NjE4NDA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      distance: '4.1 km'
    },
    {
      id: '3',
      name: 'Khajrana Ganesh',
      description: 'Revered temple dedicated to Lord Ganesha',
      duration: '45 mins',
      rating: 4.9,
      reviews: 4287,
      image: 'https://images.unsplash.com/photo-1698153210197-5a1027c6c5e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxIaW5kdSUyMHRlbXBsZSUyMGdvbGRlbiUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NzQ2MTg0MDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      distance: '5.8 km'
    },
    {
      id: '4',
      name: 'Lotus Valley',
      description: 'Serene natural valley with beautiful lotus ponds',
      duration: '1.5 hours',
      rating: 4.7,
      reviews: 1856,
      image: 'https://images.unsplash.com/photo-1770615540460-3c47b7a1b10d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWFjZWZ1bCUyMGxvdHVzJTIwcG9uZCUyMG5hdHVyZXxlbnwxfHx8fDE3NzQ2MTg0MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      distance: '8.2 km'
    },
  ];

  const toggleLike = (id: string) => {
    setLikedPlaces((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="pb-24 overflow-y-auto h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 px-6 pt-12 pb-8 rounded-b-[2rem]">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        
        <h1 className="text-white text-3xl mb-2">Select Destinations</h1>
        <p className="text-indigo-200">Choose places you'd like to visit</p>
      </div>

      {/* Filters */}
      <div className="px-6 mt-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm whitespace-nowrap shadow-lg shadow-indigo-200">
          All Places
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 rounded-full text-sm whitespace-nowrap border border-gray-200">
          Heritage
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 rounded-full text-sm whitespace-nowrap border border-gray-200">
          Food
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 rounded-full text-sm whitespace-nowrap border border-gray-200">
          Nature
        </button>
      </div>

      {/* Destinations Grid */}
      <div className="px-6 mt-6 space-y-5">
        {destinations.map((destination) => (
          <div
            key={destination.id}
            className="bg-white rounded-3xl shadow-lg shadow-gray-200 overflow-hidden hover:shadow-xl transition-all"
          >
            {/* Image */}
            <div className="relative h-56 overflow-hidden">
              <ImageWithFallback
                src={destination.image}
                alt={destination.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
              
              {/* Actions */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => toggleLike(destination.id)}
                  className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all active:scale-95"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      likedPlaces.has(destination.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-600'
                    }`}
                  />
                </button>
                <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all active:scale-95">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Distance Badge */}
              <div className="absolute bottom-4 left-4">
                <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm">{destination.distance}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-xl mb-1">{destination.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{destination.description}</p>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm">
                    {destination.rating} <span className="text-gray-500">({destination.reviews})</span>
                  </span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{destination.duration}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onNavigate('wallet')}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95"
              >
                Add to Itinerary
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="h-6" />
    </div>
  );
}