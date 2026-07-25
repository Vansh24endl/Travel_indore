import React from 'react'
import { Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'
import { useAuth } from '@/hooks/useAuth'
import { motion } from 'framer-motion'
import { Calendar, Star, DollarSign, ArrowRight } from 'lucide-react'
import Card from './ui/Card'
import Loader from './ui/Loader'
import ImageWithFallback from './ui/ImageWithFallback'

// Helper function to sanitize copywriting typos in descriptions
function sanitizeText(text?: string): string {
    if (!text) return ''
    return text.replace(/\btesty\b/gi, 'taste')
}

export function Dashboard() {
    const { user } = useAuth()

    // Fetch user bookings
    const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
        queryKey: ['myBookings'],
        queryFn: async () => {
            const res = await api.get('/api/bookings/my')
            return res.data.bookings || []
        }
    })

    // Fetch all destinations to recommend the highest rated one
    const { data: destinationsData, isLoading: destinationsLoading } = useQuery({
        queryKey: ['destinations'],
        queryFn: async () => {
            const res = await api.get('/api/destinations')
            return res.data.destinations || []
        }
    })

    const isLoading = bookingsLoading || destinationsLoading

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader size="lg" />
            </div>
        )
    }

    const bookings = bookingsData || []
    const destinations = destinationsData || []

    // Calculate total amount spent on bookings
    const totalSpent = bookings
        .filter((b: any) => b.bookingStatus === 'confirmed')
        .reduce((sum: number, b: any) => sum + b.totalAmount, 0)

    // Find the highest rated destination to suggest
    const topRecommended = destinations.length > 0 
        ? [...destinations].sort((a: any, b: any) => b.rating - a.rating)[0]
        : null

    return (
        <div className="space-y-6 font-sans pb-8">
            {/* Hero Banner */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 lg:p-7 text-white shadow-xl"
            >
                <div className="relative z-10 max-w-xl space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
                        Welcome Back
                    </span>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold">
                        Hello, {user?.fullname || 'Explorer'}!
                    </h2>
                    <p className="text-indigo-100 text-sm leading-relaxed">
                        Ready to discover new places in Indore? View your upcoming tickets, check the latest reviews, or plan a new trip using our AI assistant!
                    </p>
                    <div className="pt-1">
                        <Link
                            to="/explore"
                            className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-5 py-2.5 rounded-xl hover:bg-indigo-50 transition-all duration-300 shadow-md hover:scale-105 text-sm"
                        >
                            <span>Explore Places</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
                {/* Decorative Shapes */}
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-2xl transform translate-x-12 -translate-y-12" />
                <div className="absolute right-12 bottom-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-xl" />
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <Card hoverable={false} className="flex items-center gap-4 p-4 sm:p-5">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl flex-shrink-0">
                        <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Total Bookings</p>
                        <h4 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">{bookings.length}</h4>
                    </div>
                </Card>

                <Card hoverable={false} className="flex items-center gap-4 p-4 sm:p-5">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl flex-shrink-0">
                        <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Spent Amount</p>
                        <h4 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">₹{totalSpent}</h4>
                    </div>
                </Card>

                <Card hoverable={false} className="flex items-center gap-4 p-4 sm:p-5">
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl flex-shrink-0">
                        <Star className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Explore Spots</p>
                        <h4 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">{destinations.length}</h4>
                    </div>
                </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-start">
                {/* Bookings List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">My Recent Bookings</h3>
                        <Link to="/bookings" className="text-sm text-indigo-600 hover:underline font-semibold">
                            View All
                        </Link>
                    </div>

                    {bookings.length === 0 ? (
                        <Card hoverable={false} className="text-center py-8 p-6">
                            <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">You have not booked any tours yet.</p>
                            <Link to="/explore" className="text-indigo-600 font-bold hover:underline text-sm">
                                Book your first destination
                            </Link>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {bookings.slice(0, 3).map((booking: any) => (
                                <Card key={booking.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                            <ImageWithFallback
                                                src={booking.destination?.images?.[0]}
                                                alt={booking.destination?.title || 'Spot image'}
                                                category={booking.destination?.category}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white text-base">{booking.destination?.title || 'Unknown Spot'}</h4>
                                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{booking.bookingDate} • {booking.numberOfPersons} Travelers</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row sm:flex-col justify-between sm:items-end items-center gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-gray-800">
                                        <span className="font-bold text-indigo-600 text-sm sm:text-base">₹{booking.totalAmount}</span>
                                        <span className={`px-2.5 py-1 text-[10px] sm:text-xs rounded-full font-semibold uppercase tracking-wider ${
                                            booking.bookingStatus === 'confirmed'
                                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                                : booking.bookingStatus === 'cancelled'
                                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                        }`}>
                                            {booking.bookingStatus}
                                        </span>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recommendation Side Card */}
                <div className="space-y-4">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Top Recommended</h3>
                    {topRecommended ? (
                        <Card hoverable className="overflow-hidden p-0 group">
                            <div className="h-36 sm:h-40 overflow-hidden relative">
                                <ImageWithFallback
                                    src={topRecommended.images?.[0]}
                                    alt={topRecommended.title}
                                    category={topRecommended.category}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-3 right-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 text-amber-500 font-bold text-xs shadow-sm">
                                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                    <span>{topRecommended.rating}</span>
                                </div>
                            </div>
                            <div className="p-4 sm:p-5 space-y-2.5">
                                <h4 className="text-base font-bold text-gray-900 dark:text-white line-clamp-1">{topRecommended.title}</h4>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-snug">
                                    {sanitizeText(topRecommended.description)}
                                </p>
                                <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[140px]">{topRecommended.location}</span>
                                    <Link to={`/destination/${topRecommended._id || topRecommended.id}`} className="text-indigo-600 hover:underline font-bold text-xs sm:text-sm flex items-center gap-1 flex-shrink-0">
                                        <span>View details</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    ) : (
                        <Card hoverable={false} className="text-center py-8 p-4">
                            <p className="text-gray-500 text-sm">No destinations available</p>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
export default Dashboard