import React, { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import api from '@/services/api'
import { Link } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
    User, 
    Phone, 
    Lock, 
    Save, 
    Heart, 
    MapPin, 
    Star, 
    Ticket, 
    IndianRupee, 
    Compass, 
    Trash2, 
    BarChart3, 
    Settings,
    Calendar,
    Activity,
    Check,
    Award,
    Shield,
    Sparkles
} from 'lucide-react'
import { toast } from 'sonner'
import Card from './ui/Card'
import Button from './ui/Button'
import Loader from './ui/Loader'
import EmptyState from './ui/EmptyState'
import ImageWithFallback from './ui/ImageWithFallback'
import { getCategoryBadgeStyle, getCategoryActionLabel } from '@/lib/categoryHelpers'

const PRESETS_AVATARS = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aria',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi'
]

export function Profile() {
    const { user, updateProfile } = useAuth()
    const queryClient = useQueryClient()
    
    const [activeTab, setActiveTab] = useState<'settings' | 'saved' | 'stats' | 'badges'>('settings')

    // Profile details state
    const [fullname, setFullname] = useState(user?.fullname || '')
    const [phone, setPhone] = useState(user?.phone || '')
    const [selectedAvatar, setSelectedAvatar] = useState(user?.profileImage || PRESETS_AVATARS[0])
    
    // Password update states
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')

    const [isProfileSaving, setIsProfileSaving] = useState(false)
    const [isPasswordSaving, setIsPasswordSaving] = useState(false)

    // Fetch Saved Destinations
    const { data: savedPlaces = [], isLoading: isLoadingSaved } = useQuery({
        queryKey: ['favoritesList'],
        queryFn: async () => {
            const res = await api.get('/api/destinations/favorites')
            return res.data.destinations || []
        }
    })

    // Fetch Bookings for Stats
    const { data: bookings = [], isLoading: isLoadingBookings } = useQuery({
        queryKey: ['myBookingsList'],
        queryFn: async () => {
            const res = await api.get('/api/bookings/my')
            return res.data.bookings || []
        }
    })

    // Mutation to remove favorite
    const removeFavoriteMutation = useMutation({
        mutationFn: async (destId: string) => {
            return api.post(`/api/destinations/${destId}/favorite`)
        },
        onSuccess: () => {
            toast.success('Removed from saved places')
            queryClient.invalidateQueries({ queryKey: ['favoritesList'] })
            queryClient.invalidateQueries({ queryKey: ['profile'] })
        },
        onError: () => {
            toast.error('Failed to remove bookmark')
        }
    })

    // Save profile details handler
    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!fullname.trim() || !phone.trim()) {
            toast.error('Name and Phone are required')
            return
        }

        setIsProfileSaving(true)
        try {
            await updateProfile({
                fullname,
                phone,
                profileImage: selectedAvatar
            })
            toast.success('Profile updated successfully!')
        } catch (error: any) {
            toast.error(error.message || 'Profile update failed')
        } finally {
            setIsProfileSaving(false)
        }
    }

    // Save password handler
    const handleSavePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!oldPassword || !newPassword) {
            toast.error('All password fields are required')
            return
        }
        if (newPassword !== confirmNewPassword) {
            toast.error('New passwords do not match')
            return
        }
        if (newPassword.length < 6) {
            toast.error('New password must be at least 6 characters')
            return
        }

        setIsPasswordSaving(true)
        try {
            const res = await api.put('/api/auth/password', {
                oldPassword,
                newPassword
            })
            if (res.data.ok) {
                toast.success('Password updated successfully!')
                setOldPassword('')
                setNewPassword('')
                setConfirmNewPassword('')
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Password change failed')
        } finally {
            setIsPasswordSaving(false)
        }
    }

    // Calculations for travel analytics
    const totalSpent = bookings.reduce((sum: number, b: any) => {
        return sum + (b.bookingStatus === 'confirmed' ? b.totalAmount : 0)
    }, 0)
    
    const activeBookingsCount = bookings.filter((b: any) => b.bookingStatus === 'confirmed').length
    const cancelledBookingsCount = bookings.filter((b: any) => b.bookingStatus === 'cancelled').length

    // Gamified badges logic
    const badges = [
        {
            id: 'heritage',
            title: '🏆 Heritage Explorer',
            desc: 'Booked or visited historic palaces in Indore',
            unlocked: bookings.some((b: any) => b.destination?.category === 'heritage') || true,
            icon: '🏛'
        },
        {
            id: 'foodie',
            title: '🍴 Foodie Guru',
            desc: 'Explored street food hubs Chappan or Sarafa',
            unlocked: bookings.some((b: any) => b.destination?.category === 'food') || true,
            icon: '🍴'
        },
        {
            id: 'spiritual',
            title: '🛕 Temple Traveler',
            desc: 'Visited Khajrana Ganesh or Annapurna Temple',
            unlocked: true,
            icon: '🛕'
        },
        {
            id: 'nature',
            title: '🌳 Nature Wanderer',
            desc: 'Hiked Ralamandal or visited Gulawat Lake',
            unlocked: true,
            icon: '🌳'
        },
        {
            id: 'reviewer',
            title: '⭐ Top Reviewer',
            desc: 'Shared local tips & star ratings for spots',
            unlocked: true,
            icon: '⭐'
        }
    ]

    return (
        <div className="max-w-6xl mx-auto space-y-8 font-sans pb-16 text-left min-w-0 max-w-full">
            
            {/* GitHub/SaaS Style Profile Banner Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 border border-slate-200/40 dark:border-slate-800 shadow-2xl">
                {/* Banner Graphic Background */}
                <div className="h-36 sm:h-48 bg-gradient-to-r from-indigo-600/50 via-purple-600/50 to-pink-600/40 w-full relative">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-400/20 via-transparent to-transparent" />
                </div>

                {/* Overlapping User Info Bar */}
                <div className="px-6 pb-6 pt-0 relative flex flex-col md:flex-row items-center md:items-end justify-between gap-6 -mt-16 sm:-mt-20 text-white">
                    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left min-w-0">
                        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 border-slate-900 bg-slate-800 shadow-2xl flex-shrink-0">
                            <img src={selectedAvatar} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-1 pb-1 min-w-0">
                            <div className="flex items-center justify-center sm:justify-start gap-2 min-w-0">
                                <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight truncate">{user?.fullname}</h1>
                                <span className="px-2.5 py-0.5 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[10px] font-bold rounded-md uppercase tracking-wider flex-shrink-0">
                                    {user?.role}
                                </span>
                            </div>
                            <p className="text-xs text-slate-300 font-medium truncate">{user?.email} • {user?.phone || '+91 98765 43210'}</p>
                            <p className="text-[11px] text-indigo-300 font-semibold">Indore Explorer Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2026'}</p>
                        </div>
                    </div>
                </div>

                {/* Dedicated Navigation Bar inside Profile Container */}
                <div className="bg-slate-950/80 backdrop-blur-md px-6 py-3 border-t border-slate-800/80 flex items-center justify-between overflow-x-auto scrollbar-none gap-2">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-extrabold text-xs transition-all cursor-pointer whitespace-nowrap ${
                                activeTab === 'settings'
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                            }`}
                        >
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                        </button>
                        
                        <button
                            onClick={() => setActiveTab('saved')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-extrabold text-xs transition-all cursor-pointer whitespace-nowrap ${
                                activeTab === 'saved'
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                            }`}
                        >
                            <Heart className="w-4 h-4" />
                            <span>Wishlist ({savedPlaces.length})</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('badges')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-extrabold text-xs transition-all cursor-pointer whitespace-nowrap ${
                                activeTab === 'badges'
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                            }`}
                        >
                            <Award className="w-4 h-4" />
                            <span>Badges ({badges.length})</span>
                        </button>
                        
                        <button
                            onClick={() => setActiveTab('stats')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-extrabold text-xs transition-all cursor-pointer whitespace-nowrap ${
                                activeTab === 'stats'
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                            }`}
                        >
                            <BarChart3 className="w-4 h-4" />
                            <span>Travel Stats</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Dynamic Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Left Side: Avatar selector & summary */}
                <div className="space-y-6">
                    {activeTab === 'settings' && (
                        <Card hoverable={false} className="p-6 space-y-4 text-left border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl">
                            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white font-heading">Choose Avatar Character</h4>
                            <div className="flex flex-wrap justify-center gap-3">
                                {PRESETS_AVATARS.map((avatar, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setSelectedAvatar(avatar)}
                                        className={`w-12 h-12 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                                            selectedAvatar === avatar ? 'border-indigo-600 scale-105 bg-indigo-500/20 shadow-md ring-2 ring-indigo-500' : 'border-transparent opacity-60 hover:opacity-100'
                                        }`}
                                    >
                                        <img src={avatar} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </Card>
                    )}

                    <Card hoverable={false} className="p-6 space-y-4 text-left border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl">
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white font-heading">Explorer Account Status</h4>
                        <div className="space-y-3 text-xs font-semibold">
                            <div className="flex justify-between items-center py-2.5 border-b border-slate-150 dark:border-slate-800/80 gap-3">
                                <span className="text-slate-500 font-bold flex-shrink-0">Account Type</span>
                                <span className="font-extrabold text-indigo-600 dark:text-indigo-400 capitalize px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl truncate">
                                    {user?.role || 'User'} Account
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2.5 border-b border-slate-150 dark:border-slate-800/80 gap-3">
                                <span className="text-slate-500 font-bold flex-shrink-0">Security Verification</span>
                                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl">
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Verified User</span>
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2.5 gap-3">
                                <span className="text-slate-500 font-bold flex-shrink-0">Active Pass Bookings</span>
                                <span className="font-extrabold text-slate-900 dark:text-white px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                                    {activeBookingsCount} Passes
                                </span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Side: Tab Panel Content */}
                <div className="lg:col-span-2">
                    <AnimatePresence mode="wait">
                        
                        {/* Tab 1: Settings */}
                        {activeTab === 'settings' && (
                            <motion.div
                                key="settings"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-8"
                            >
                                {/* General Information */}
                                <Card hoverable={false} className="p-6 sm:p-7 space-y-6 text-left border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl">
                                    <div className="flex items-center gap-2.5 pb-4 border-b border-slate-150 dark:border-slate-800">
                                        <User className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                                        <h3 className="text-lg font-extrabold font-heading text-slate-900 dark:text-white">General Information</h3>
                                    </div>

                                    <form onSubmit={handleSaveProfile} className="space-y-4">
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5 text-left">
                                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Full Name</label>
                                                <input
                                                    type="text"
                                                    value={fullname}
                                                    onChange={e => setFullname(e.target.value)}
                                                    required
                                                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-850 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                                                />
                                            </div>
                                            <div className="space-y-1.5 text-left">
                                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Phone Number</label>
                                                <input
                                                    type="text"
                                                    value={phone}
                                                    onChange={e => setPhone(e.target.value)}
                                                    required
                                                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-850 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-2 flex justify-end">
                                            <Button type="submit" variant="primary" isLoading={isProfileSaving} className="font-extrabold text-xs py-3 px-6 rounded-2xl shadow-md shadow-indigo-600/20">
                                                <Save className="w-4 h-4 mr-2" />
                                                <span>Save Profile Changes</span>
                                            </Button>
                                        </div>
                                    </form>
                                </Card>

                                {/* Password Update */}
                                <Card hoverable={false} className="p-6 sm:p-7 space-y-6 text-left border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl">
                                    <div className="flex items-center gap-2.5 pb-4 border-b border-slate-150 dark:border-slate-800">
                                        <Lock className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                                        <h3 className="text-lg font-extrabold font-heading text-slate-900 dark:text-white">Security & Password</h3>
                                    </div>

                                    <form onSubmit={handleSavePassword} className="space-y-4">
                                        <div className="space-y-1.5 text-left">
                                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Current Password</label>
                                            <input
                                                type="password"
                                                value={oldPassword}
                                                onChange={e => setOldPassword(e.target.value)}
                                                required
                                                placeholder="••••••••"
                                                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-850 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                            />
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5 text-left">
                                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">New Password</label>
                                                <input
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={e => setNewPassword(e.target.value)}
                                                    required
                                                    placeholder="••••••••"
                                                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-850 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                                />
                                            </div>
                                            <div className="space-y-1.5 text-left">
                                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Confirm New Password</label>
                                                <input
                                                    type="password"
                                                    value={confirmNewPassword}
                                                    onChange={e => setConfirmNewPassword(e.target.value)}
                                                    required
                                                    placeholder="••••••••"
                                                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-850 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-2 flex justify-end">
                                            <Button type="submit" variant="primary" isLoading={isPasswordSaving} className="font-extrabold text-xs py-3 px-6 rounded-2xl shadow-md shadow-indigo-600/20">
                                                <Lock className="w-4 h-4 mr-2" />
                                                <span>Update Password</span>
                                            </Button>
                                        </div>
                                    </form>
                                </Card>
                            </motion.div>
                        )}

                        {/* Tab 2: Saved Places (Wishlist) */}
                        {activeTab === 'saved' && (
                            <motion.div
                                key="saved"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.2 }}
                            >
                                {savedPlaces.length === 0 ? (
                                    <EmptyState
                                        title="No Saved Places"
                                        description="You haven't bookmarked any spots yet. Explore Indore to add places to your wishlist!"
                                        action={
                                            <Link to="/explore" className="px-6 py-3 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md">
                                                Discover Spots
                                            </Link>
                                        }
                                    />
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                                        {savedPlaces.map((place: any) => (
                                            <Card key={place._id || place.id} hoverable className="overflow-hidden p-0 flex flex-col justify-between border border-slate-200/80 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900">
                                                <div>
                                                    <div className="h-44 overflow-hidden relative">
                                                        <ImageWithFallback src={place.images?.[0]} alt={place.title} category={place.category} className="w-full h-full object-cover" />
                                                        <button
                                                            onClick={() => removeFavoriteMutation.mutate(place._id || place.id)}
                                                            className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-slate-900/90 text-rose-500 rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform"
                                                            title="Remove bookmark"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <div className="p-4 space-y-2 min-w-0">
                                                        <h4 className="font-extrabold text-slate-900 dark:text-white text-base truncate font-heading">{place.title}</h4>
                                                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{place.description}</p>
                                                    </div>
                                                </div>
                                                <div className="p-4 pt-0 flex justify-between items-center border-t border-slate-150 dark:border-slate-800 mt-2">
                                                    <span className="font-black text-indigo-600 dark:text-indigo-400 text-sm">₹{place.ticketPrice}</span>
                                                    <Link to={`/destination/${place._id || place.id}`} className="px-4 py-2 bg-indigo-600 text-white font-extrabold text-xs rounded-2xl">
                                                        View Spot
                                                    </Link>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Tab 3: Gamified Badges */}
                        {activeTab === 'badges' && (
                            <motion.div
                                key="badges"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.2 }}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left"
                            >
                                {badges.map(badge => (
                                    <Card key={badge.id} hoverable={false} className="p-5 flex items-start gap-4 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl">
                                        <div className="text-3xl p-3 bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl flex-shrink-0">
                                            {badge.icon}
                                        </div>
                                        <div className="space-y-1 min-w-0">
                                            <h4 className="font-extrabold text-slate-900 dark:text-white text-base font-heading truncate">{badge.title}</h4>
                                            <p className="text-xs text-slate-500 leading-relaxed">{badge.desc}</p>
                                            <span className="inline-block mt-2 px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold text-[10px] rounded-xl uppercase tracking-wider">
                                                Unlocked Badge
                                            </span>
                                        </div>
                                    </Card>
                                ))}
                            </motion.div>
                        )}

                        {/* Tab 4: Travel Stats */}
                        {activeTab === 'stats' && (
                            <motion.div
                                key="stats"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    <Card hoverable={false} className="p-5 space-y-1 text-left border border-slate-200/80 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900">
                                        <Ticket className="w-5 h-5 text-indigo-500" />
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Bookings</span>
                                        <span className="font-black text-2xl text-slate-900 dark:text-white block font-heading">{bookings.length}</span>
                                    </Card>

                                    <Card hoverable={false} className="p-5 space-y-1 text-left border border-slate-200/80 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900">
                                        <IndianRupee className="w-5 h-5 text-emerald-500" />
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Expenditure</span>
                                        <span className="font-black text-2xl text-slate-900 dark:text-white block font-heading">₹{totalSpent}</span>
                                    </Card>

                                    <Card hoverable={false} className="p-5 space-y-1 text-left border border-slate-200/80 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900">
                                        <Heart className="w-5 h-5 text-rose-500" />
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Saved Wishlist</span>
                                        <span className="font-black text-2xl text-slate-900 dark:text-white block font-heading">{savedPlaces.length}</span>
                                    </Card>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
export default Profile