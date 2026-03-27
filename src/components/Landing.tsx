import { Link } from 'react-router';
import { ArrowRight, MapPin, Star, Shield, Clock } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Landing() {
  const features = [
    {
      icon: MapPin,
      title: 'Curated Routes',
      description: 'Expertly designed itineraries for the perfect day'
    },
    {
      icon: Star,
      title: 'Top Rated',
      description: 'Visit only the best destinations in Indore'
    },
    {
      icon: Shield,
      title: 'Secure Booking',
      description: 'Safe and encrypted payment processing'
    },
    {
      icon: Clock,
      title: 'Flexible Schedule',
      description: 'Book tours that fit your timeline'
    }
  ];

  const stats = [
    { value: '50+', label: 'Destinations' },
    { value: '10K+', label: 'Happy Travelers' },
    { value: '4.9/5', label: 'Rating' },
    { value: '24/7', label: 'Support' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl text-gray-900">Indore Explorer</h1>
                <p className="text-xs text-gray-500">Heritage & Culture</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full text-indigo-600 text-sm mb-6">
                <Star className="w-4 h-4 fill-indigo-600" />
                <span>Trusted by 10,000+ travelers</span>
              </div>
              <h1 className="text-5xl lg:text-6xl text-gray-900 mb-6">
                Discover the
                <span className="block text-indigo-600">Soul of Indore</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Experience the rich heritage, vibrant culture, and authentic flavors of Indore with our curated travel experiences.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-8 py-4 rounded-xl hover:bg-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-200 flex items-center gap-2 hover:shadow-xl hover:scale-105 active:scale-95"
                >
                  Start Exploring
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/explore"
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:border-gray-400 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
                >
                  View Destinations
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1672744067790-c3bc58999009?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRvcmUlMjBJbmRpYSUyMGNpdHlzY2FwZSUyMHNreWxpbmV8ZW58MXx8fHwxNzc0NjE5MDgwfDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Indore Cityscape"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              {/* Floating Card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Rajwada Palace</p>
                    <p className="text-sm text-gray-600">Historic Heritage Site</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium">4.8</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl text-indigo-600 mb-2">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-xl text-gray-600">Everything you need for the perfect journey</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 hover:-translate-y-2 group cursor-pointer"
                >
                  <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Icon className="w-7 h-7 text-indigo-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl text-white mb-4">Ready to Start Your Adventure?</h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of travelers exploring Indore's hidden gems
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all shadow-xl"
          >
            Create Free Account
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600">
            <p>© 2026 Indore Explorer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}