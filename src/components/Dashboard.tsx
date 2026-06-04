import React from 'react'
import { Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'
import { useAuth } from '@/hooks/useAuth'
import { motion } from 'framer-motion'
import { Calendar, Compass, Star, DollarSign, ArrowRight } from 'lucide-react'
import Card from './ui/Card'
import Loader from './ui/Loader'

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
        <div className="space-y-8 font-sans pb-12">
            {/* Hero Banner */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-indigo-800 p-8 text-white shadow-xl"
            >
                <div className="relative z-10 max-w-xl space-y-4">
                    <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
                        Welcome Back
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-extrabold">
                        Hello, {user?.fullname || 'Explorer'}!
                    </h2>
                    <p className="text-indigo-100 text-sm leading-relaxed">
                        Ready to discover new places in Indore? View your upcoming tickets, check the latest reviews, or plan a new trip using our AI assistant!
                    </p>
                    <div className="pt-2">
                        <Link
                            to="/explore"
                            className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-all duration-300 shadow-md hover:scale-105"
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card hoverable={false} className="flex items-center gap-5">
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl">
                        <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Bookings</p>
                        <h4 className="text-2xl font-black text-gray-900 dark:text-white">{bookings.length}</h4>
                    </div>
                </Card>

                <Card hoverable={false} className="flex items-center gap-5">
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl">
                        <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Spent Amount</p>
                        <h4 className="text-2xl font-black text-gray-900 dark:text-white">₹{totalSpent}</h4>
                    </div>
                </Card>

                <Card hoverable={false} className="flex items-center gap-5">
                    <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl">
                        <Star className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Explore Spots</p>
                        <h4 className="text-2xl font-black text-gray-900 dark:text-white">{destinations.length}</h4>
                    </div>
                </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Bookings List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">My Recent Bookings</h3>
                        <Link to="/bookings" className="text-sm text-indigo-650 hover:underline font-semibold">
                            View All
                        </Link>
                    </div>

                    {bookings.length === 0 ? (
                        <Card hoverable={false} className="text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400 mb-4">You have not booked any tours yet.</p>
                            <Link to="/explore" className="text-indigo-600 font-bold hover:underline">
                                Book your first destination
                            </Link>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {bookings.slice(0, 3).map((booking: any) => (
                                <Card key={booking.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                            {booking.destination?.images?.[0] ? (
                                                <img src={booking.destination.images[0]} alt={booking.destination.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-200"><Compass className="text-gray-400" /></div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white">{booking.destination?.title || 'Unknown Spot'}</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{booking.bookingDate} • {booking.numberOfPersons} Travelers</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                                        <span className="font-bold text-indigo-650">₹{booking.totalAmount}</span>
                                        <span className={`px-3 py-1 text-xs rounded-full font-semibold uppercase tracking-wider ${
                                            booking.bookingStatus === 'confirmed'
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : booking.bookingStatus === 'cancelled'
                                                ? 'bg-rose-100 text-rose-800'
                                                : 'bg-amber-100 text-amber-800'
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
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Top Recommended</h3>
                    {topRecommended ? (
                        <Card hoverable className="overflow-hidden p-0 group">
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src={topRecommended.images[0]}
                                    alt={topRecommended.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 text-amber-550 font-bold text-sm">
                                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                                    <span>{topRecommended.rating}</span>
                                </div>
                            </div>
                            <div className="p-6 space-y-3">
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white">{topRecommended.title}</h4>
                                <p className="text-sm text-gray-550 dark:text-gray-400 line-clamp-2">{topRecommended.description}</p>
                                <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{topRecommended.location}</span>
                                    <Link to={`/destination/${topRecommended._id || topRecommended.id}`} className="text-indigo-650 hover:underline font-bold text-sm flex items-center gap-1">
                                        <span>View details</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    ) : (
                        <Card hoverable={false} className="text-center py-12">
                            <p className="text-gray-500">No destinations available</p>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
export default Dashboard