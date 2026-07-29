import React from 'react'
import { Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'
import { useAuth } from '@/hooks/useAuth'
import { motion } from 'framer-motion'
import { 
    Calendar, 
    Star, 
    IndianRupee, 
    ArrowRight, 
    Compass, 
    Heart, 
    Award, 
    Sparkles, 
    CheckCircle2, 
    TrendingUp, 
    MessageSquare,
    MapPin,
    Clock
} from 'lucide-react'
import Card from './ui/Card'
import Loader from './ui/Loader'
import ImageWithFallback from './ui/ImageWithFallback'
import { getCategoryVisitorLabel, getCategoryActionLabel, getCategoryBadgeStyle } from '@/lib/categoryHelpers'

function sanitizeText(text?: string): string {
    if (!text) return ''
    return text.replace(/\btesty\b/gi, 'taste')
}

export function Dashboard() {
    const { user } = useAuth()

    const hour = new Date().getHours()
    const timeGreeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening'

    // Fetch user bookings
    const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
        queryKey: ['myBookings'],
        queryFn: async () => {
            const res = await api.get('/api/bookings/my')
            return res.data.bookings || []
        }
    })

    // Fetch saved places (wishlist)
    const { data: favoritesData } = useQuery({
        queryKey: ['favoritesList'],
        queryFn: async () => {
            const res = await api.get('/api/destinations/favorites')
            return res.data.destinations || []
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
    const favorites = favoritesData || []
    const destinations = destinationsData || []

    // Calculate total amount spent on bookings
    const totalSpent = bookings
        .filter((b: any) => b.bookingStatus === 'confirmed')
        .reduce((sum: number, b: any) => sum + b.totalAmount, 0)

    const confirmedCount = bookings.filter((b: any) => b.bookingStatus === 'confirmed').length
    const rewardPoints = confirmedCount * 50 + favorites.length * 10

    // Find the highest rated destination to suggest
    const topRecommended = destinations.length > 0 
        ? [...destinations].sort((a: any, b: any) => b.rating - a.rating)[0]
        : null

    return (
        <div className="space-y-8 font-sans pb-12 text-left">
            
            {/* Hero Greeting & Travel Illustration Banner */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 p-8 lg:p-10 text-white shadow-2xl glow-indigo"
            >
                <div className="relative z-10 max-w-2xl space-y-4 text-left">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Ready for your next adventure?</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading leading-tight tracking-tight">
                        👋 {timeGreeting}, <span className="bg-gradient-to-r from-amber-200 via-white to-purple-200 bg-clip-text text-transparent">{user?.fullname || 'Explorer'}</span>!
                    </h2>

                    <p className="text-indigo-100 text-sm sm:text-base leading-relaxed max-w-lg">
                        Discover Indore’s richest heritage, street food walk hubs, scenic nature lakes, and AI-curated weekend travel itineraries.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-2">
                        <Link
                            to="/explore"
                            className="inline-flex items-center gap-2 bg-white text-indigo-700 hover:bg-amber-300 hover:text-slate-900 font-extrabold px-6 py-3 rounded-2xl transition-all duration-300 shadow-xl hover:scale-105 text-sm"
                        >
                            <span>Explore Places</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>

                        <Link
                            to="/ai-assistant"
                            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 font-bold px-6 py-3 rounded-2xl transition-all duration-300 hover:scale-105 text-sm"
                        >
                            <Sparkles className="w-4 h-4 text-amber-300" />
                            <span>Plan with AI Copilot</span>
                        </Link>
                    </div>
                </div>

                {/* Travel SVG Illustration Graphic Overlay */}
                <div className="absolute right-6 bottom-0 hidden lg:block w-80 h-full pointer-events-none opacity-20 dark:opacity-30">
                    <svg viewBox="0 0 200 200" className="w-full h-full text-white fill-current">
                        <path d="M40,-50C52,-42,62,-30,67,-15C72,-1,72,14,65,27C58,40,44,51,29,58C14,65,-2,68,-18,65C-34,62,-50,53,-60,39C-70,25,-74,6,-71,-12C-68,-30,-58,-47,-44,-55C-30,-63,-15,-62,1,-63C17,-64,34,-66,40,-50Z" transform="translate(100 100)" />
                    </svg>
                </div>

                {/* Decorative background ambient glows */}
                <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl transform translate-x-20 -translate-y-20 pointer-events-none" />
                <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
            </motion.div>

            {/* 6 Rich Modern Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {/* 1. Total Trips */}
                <Card hoverable={false} className="p-4 border border-slate-200/60 dark:border-slate-800 text-left space-y-3 bg-white dark:bg-slate-900 shadow-sm">
                    <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-2xl w-fit">
                        <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Booked Passes</span>
                        <h4 className="text-2xl font-black text-slate-900 dark:text-white font-heading mt-0.5">{bookings.length}</h4>
                    </div>
                </Card>

                {/* 2. Wishlist */}
                <Card hoverable={false} className="p-4 border border-slate-200/60 dark:border-slate-800 text-left space-y-3 bg-white dark:bg-slate-900 shadow-sm">
                    <div className="p-2.5 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-2xl w-fit">
                        <Heart className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Saved Places</span>
                        <h4 className="text-2xl font-black text-slate-900 dark:text-white font-heading mt-0.5">{favorites.length}</h4>
                    </div>
                </Card>

                {/* 3. Total Spent */}
                <Card hoverable={false} className="p-4 border border-slate-200/60 dark:border-slate-800 text-left space-y-3 bg-white dark:bg-slate-900 shadow-sm">
                    <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl w-fit">
                        <IndianRupee className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Total Spent</span>
                        <h4 className="text-2xl font-black text-slate-900 dark:text-white font-heading mt-0.5">₹{totalSpent}</h4>
                    </div>
                </Card>

                {/* 4. Confirmed */}
                <Card hoverable={false} className="p-4 border border-slate-200/60 dark:border-slate-800 text-left space-y-3 bg-white dark:bg-slate-900 shadow-sm">
                    <div className="p-2.5 bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 rounded-2xl w-fit">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Confirmed</span>
                        <h4 className="text-2xl font-black text-slate-900 dark:text-white font-heading mt-0.5">{confirmedCount}</h4>
                    </div>
                </Card>

                {/* 5. Reward Points */}
                <Card hoverable={false} className="p-4 border border-slate-200/60 dark:border-slate-800 text-left space-y-3 bg-white dark:bg-slate-900 shadow-sm">
                    <div className="p-2.5 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-2xl w-fit">
                        <Award className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Travel Points</span>
                        <h4 className="text-2xl font-black text-slate-900 dark:text-white font-heading mt-0.5">{rewardPoints} PTS</h4>
                    </div>
                </Card>

                {/* 6. Explore Spots */}
                <Card hoverable={false} className="p-4 border border-slate-200/60 dark:border-slate-800 text-left space-y-3 bg-white dark:bg-slate-900 shadow-sm">
                    <div className="p-2.5 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-2xl w-fit">
                        <Compass className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Indore Spots</span>
                        <h4 className="text-2xl font-black text-slate-900 dark:text-white font-heading mt-0.5">{destinations.length}</h4>
                    </div>
                </Card>
            </div>

            {/* Travel Analytics & Main Content Layout */}
            <div className="grid lg:grid-cols-3 gap-8 items-start">
                
                {/* Left Column: Recent Passes & Spend Trend Chart */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Visual Analytics Bar */}
                    <Card hoverable={false} className="p-6 border border-slate-200/60 dark:border-slate-800 text-left space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-150 dark:border-slate-800">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">Travel Spending & Visit Activity</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Monthly breakdown of travel pass bookings</p>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full">
                                <TrendingUp className="w-3.5 h-3.5" />
                                <span>+18% Activity</span>
                            </div>
                        </div>

                        {/* Bar visual representation */}
                        <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2">
                            {[
                                { month: 'Jan', amount: 350, height: '40%' },
                                { month: 'Feb', amount: 500, height: '65%' },
                                { month: 'Mar', amount: 200, height: '25%' },
                                { month: 'Apr', amount: 750, height: '85%' },
                                { month: 'May', amount: 450, height: '55%' },
                                { month: 'Jun', amount: 600, height: '70%' },
                                { month: 'Jul', amount: totalSpent > 0 ? totalSpent : 300, height: '90%' },
                            ].map((item, idx) => (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                                    <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        ₹{item.amount}
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-xl overflow-hidden h-32 flex items-end">
                                        <div 
                                            className="w-full bg-gradient-to-t from-indigo-600 via-indigo-500 to-purple-500 group-hover:from-indigo-500 group-hover:to-purple-400 transition-all rounded-t-xl"
                                            style={{ height: item.height }}
                                        />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">{item.month}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Bookings List */}
                    <div className="space-y-4 text-left">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white font-heading">My Active Travel Passes</h3>
                            <Link to="/bookings" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-extrabold flex items-center gap-1">
                                <span>View All</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {bookings.length === 0 ? (
                            <Card hoverable={false} className="text-center py-10 p-6 space-y-3">
                                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                                    <Compass className="w-6 h-6 animate-pulse" />
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 font-semibold text-sm">No travel passes booked yet.</p>
                                <Link to="/explore" className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all">
                                    Book Your First Pass
                                </Link>
                            </Card>
                        ) : (
                            <div className="space-y-3">
                                {bookings.slice(0, 3).map((booking: any) => (
                                    <Card key={booking.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left border border-slate-200/60 dark:border-slate-800">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                                                <ImageWithFallback
                                                    src={booking.destination?.images?.[0]}
                                                    alt={booking.destination?.title || 'Spot image'}
                                                    category={booking.destination?.category}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="text-left space-y-1">
                                                <h4 className="font-bold text-slate-900 dark:text-white text-base line-clamp-1">{booking.destination?.title || 'Unknown Spot'}</h4>
                                                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                                    <span className={`font-bold text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider ${getCategoryBadgeStyle(booking.destination?.category)}`}>
                                                        {booking.destination?.category || 'pass'}
                                                    </span>
                                                    <span>{booking.bookingDate} • {booking.numberOfPersons} {getCategoryVisitorLabel(booking.destination?.category).replace(' Count', '')}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-row sm:flex-col justify-between sm:items-end items-center gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                                            <span className="font-extrabold text-indigo-600 dark:text-indigo-400 text-base">₹{booking.totalAmount}</span>
                                            <span className={`px-2.5 py-1 text-[10px] rounded-full font-bold uppercase tracking-wider ${
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
                </div>

                {/* Right Side Column: Top Recommended Spot Card & AI Prompt Widget */}
                <div className="space-y-6 text-left">
                    <div className="space-y-4">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white font-heading">Top Recommended</h3>
                        {topRecommended ? (
                            <Card hoverable className="overflow-hidden p-0 group text-left border border-slate-200/60 dark:border-slate-800 shadow-md">
                                <div className="h-44 overflow-hidden relative">
                                    <ImageWithFallback
                                        src={topRecommended.images?.[0]}
                                        alt={topRecommended.title}
                                        category={topRecommended.category}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 text-amber-500 font-bold text-xs shadow-sm">
                                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                                        <span>{topRecommended.rating}</span>
                                    </div>
                                    <span className={`absolute bottom-3 left-3 font-bold text-[10px] px-2.5 py-1 rounded-lg uppercase tracking-wider backdrop-blur-md ${getCategoryBadgeStyle(topRecommended.category)}`}>
                                        {topRecommended.category}
                                    </span>
                                </div>
                                <div className="p-5 space-y-3 text-left">
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">{topRecommended.title}</h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                                        {sanitizeText(topRecommended.description)}
                                    </p>
                                    <div className="pt-3 border-t border-slate-150 dark:border-slate-800 flex justify-between items-center">
                                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                            <MapPin className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                                            <span className="truncate max-w-[120px] font-medium">{topRecommended.location}</span>
                                        </div>
                                        <Link to={`/destination/${topRecommended._id || topRecommended.id}`} className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold text-xs flex items-center gap-1 flex-shrink-0">
                                            <span>{getCategoryActionLabel(topRecommended.category)}</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        ) : (
                            <Card hoverable={false} className="text-center py-8 p-4">
                                <p className="text-slate-500 text-xs">No destinations available</p>
                            </Card>
                        )}
                    </div>

                    {/* AI Copilot Side Widget */}
                    <Card hoverable={false} className="p-6 bg-gradient-to-br from-indigo-900 to-slate-900 text-white space-y-4 text-left shadow-xl border border-indigo-500/20">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                                <Sparkles className="w-5 h-5 animate-pulse" />
                            </div>
                            <div>
                                <h4 className="font-black text-sm font-heading">AI Travel Copilot</h4>
                                <p className="text-[11px] text-indigo-200">Custom 1-Day Indore Itinerary</p>
                            </div>
                        </div>

                        <p className="text-xs text-indigo-100 leading-relaxed">
                            Need help choosing between Rajwada heritage, Chappan street food, or Ralamandal hiking? Ask AI Copilot for a personalized schedule!
                        </p>

                        <Link
                            to="/ai-assistant"
                            className="block w-full text-center py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 font-bold text-xs rounded-xl shadow-md transition-all"
                        >
                            Launch AI Travel Copilot
                        </Link>
                    </Card>
                </div>
            </div>
        </div>
    )
}
export default Dashboard