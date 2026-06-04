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
    Check
} from 'lucide-react'
import { toast } from 'sonner'
import Card from './ui/Card'
import Button from './ui/Button'
import Loader from './ui/Loader'
import EmptyState from './ui/EmptyState'

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
    
    const [activeTab, setActiveTab] = useState<'settings' | 'saved' | 'stats'>('settings')

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
        },
        enabled: activeTab === 'saved' || activeTab === 'stats'
    })

    // Fetch Bookings for Stats
    const { data: bookings = [], isLoading: isLoadingBookings } = useQuery({
        queryKey: ['myBookingsList'],
        queryFn: async () => {
            const res = await api.get('/api/bookings/my')
            return res.data.bookings || []
        },
        enabled: activeTab === 'stats'
    })

    // Mutation to remove favorite
    const removeFavoriteMutation = useMutation({
        mutationFn: async (destId: string) => {
            return api.post(`/api/destinations/${destId}/favorite`)
        },
        onSuccess: () => {
            toast.success('Removed from saved places')
            queryClient.invalidateQueries({ queryKey: ['favoritesList'] })
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

    return (
        <div className="max-w-6xl mx-auto space-y-8 font-sans pb-16">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white">Account Hub</h2>
                    <p className="text-gray-550 dark:text-gray-400 text-sm">Manage profile information, saved destinations, and travel history analytics</p>
                </div>
                
                {/* Horizontal Tab Navigation */}
                <div className="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 w-fit self-start">
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all duration-300 ${
                            activeTab === 'settings'
                                ? 'bg-white dark:bg-gray-750 text-indigo-600 dark:text-white shadow-sm'
                                : 'text-gray-550 hover:text-gray-800 dark:hover:text-white'
                        }`}
                    >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                    </button>
                    
                    <button
                        onClick={() => setActiveTab('saved')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all duration-300 ${
                            activeTab === 'saved'
                                ? 'bg-white dark:bg-gray-750 text-indigo-600 dark:text-white shadow-sm'
                                : 'text-gray-550 hover:text-gray-800 dark:hover:text-white'
                        }`}
                    >
                        <Heart className="w-4 h-4" />
                        <span>Saved Places</span>
                    </button>
                    
                    <button
                        onClick={() => setActiveTab('stats')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all duration-300 ${
                            activeTab === 'stats'
                                ? 'bg-white dark:bg-gray-750 text-indigo-600 dark:text-white shadow-sm'
                                : 'text-gray-550 hover:text-gray-800 dark:hover:text-white'
                        }`}
                    >
                        <BarChart3 className="w-4 h-4" />
                        <span>Travel Stats</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Card - Quick Avatar & Role info */}
                <div className="space-y-6">
                    <Card hoverable={false} className="text-center space-y-4">
                        <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-indigo-600 bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center">
                            <img src={selectedAvatar} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">{user?.fullname}</h3>
                            <p className="text-xs text-gray-450 mb-3">{user?.email}</p>
                            <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 font-bold text-xs rounded-full uppercase tracking-wider">
                                {user?.role}
                            </span>
                        </div>
                    </Card>

                    {activeTab === 'settings' && (
                        <Card hoverable={false} className="space-y-4">
                            <h4 className="font-bold text-sm text-gray-900 dark:text-white text-center">Change Avatar Character</h4>
                            <div className="flex flex-wrap justify-center gap-3">
                                {PRESETS_AVATARS.map((avatar, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setSelectedAvatar(avatar)}
                                        className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all duration-300 ${
                                            selectedAvatar === avatar ? 'border-indigo-600 scale-105 bg-indigo-500/20' : 'border-transparent opacity-60 hover:opacity-100'
                                        }`}
                                    >
                                        <img src={avatar} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </Card>
                    )}

                    {activeTab === 'stats' && (
                        <Card hoverable={false} className="space-y-4">
                            <h4 className="font-bold text-sm text-gray-900 dark:text-white">Quick Summary</h4>
                            <div className="space-y-3 text-xs">
                                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                                    <span className="text-gray-500">Member Since</span>
                                    <span className="font-bold text-gray-800 dark:text-gray-250">
                                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                                    <span className="text-gray-500">Verification Status</span>
                                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                                        <Check className="w-3.5 h-3.5" />
                                        <span>Verified</span>
                                    </span>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>

                {/* Right Area - Dynamic Tab Content */}
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
                                {/* General Settings */}
                                <Card hoverable={false} className="space-y-6">
                                    <div className="flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-gray-800">
                                        <User className="w-5 h-5 text-indigo-500" />
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">General Information</h3>
                                    </div>

                                    <form onSubmit={handleSaveProfile} className="space-y-4">
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-gray-555 dark:text-gray-400 uppercase tracking-wider">Full Name</label>
                                                <input
                                                    type="text"
                                                    value={fullname}
                                                    onChange={e => setFullname(e.target.value)}
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm animate-focus"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-gray-555 dark:text-gray-400 uppercase tracking-wider">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    value={phone}
                                                    onChange={e => setPhone(e.target.value)}
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm animate-focus"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-gray-555 dark:text-gray-400 uppercase tracking-wider">Email Address (Read-only)</label>
                                            <input
                                                type="email"
                                                value={user?.email || ''}
                                                disabled
                                                className="w-full px-4 py-3 border border-gray-100 dark:border-gray-800 dark:bg-gray-850 text-gray-450 rounded-xl cursor-not-allowed text-sm"
                                            />
                                        </div>

                                        <div className="pt-2 flex justify-end">
                                            <Button
                                                type="submit"
                                                variant="primary"
                                                isLoading={isProfileSaving}
                                            >
                                                <Save className="w-4 h-4 mr-2" />
                                                <span>Save Profile Changes</span>
                                            </Button>
                                        </div>
                                    </form>
                                </Card>

                                {/* Change Password */}
                                <Card hoverable={false} className="space-y-6">
                                    <div className="flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-gray-800">
                                        <Lock className="w-5 h-5 text-indigo-500" />
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Change Account Password</h3>
                                    </div>

                                    <form onSubmit={handleSavePassword} className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-gray-555 dark:text-gray-400 uppercase tracking-wider">Current Password</label>
                                            <input
                                                type="password"
                                                value={oldPassword}
                                                onChange={e => setOldPassword(e.target.value)}
                                                placeholder="Enter current password"
                                                required
                                                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm animate-focus"
                                            />
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-gray-555 dark:text-gray-400 uppercase tracking-wider">New Password</label>
                                                <input
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={e => setNewPassword(e.target.value)}
                                                    placeholder="Min 6 characters"
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm animate-focus"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-gray-555 dark:text-gray-400 uppercase tracking-wider">Confirm New Password</label>
                                                <input
                                                    type="password"
                                                    value={confirmNewPassword}
                                                    onChange={e => setConfirmNewPassword(e.target.value)}
                                                    placeholder="Repeat new password"
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm animate-focus"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-2 flex justify-end">
                                            <Button
                                                type="submit"
                                                variant="outline"
                                                isLoading={isPasswordSaving}
                                                className="text-indigo-600 border-indigo-600"
                                            >
                                                <span>Update Password</span>
                                            </Button>
                                        </div>
                                    </form>
                                </Card>
                            </motion.div>
                        )}

                        {/* Tab 2: Saved Places */}
                        {activeTab === 'saved' && (
                            <motion.div
                                key="saved"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.2 }}
                            >
                                {isLoadingSaved ? (
                                    <div className="flex items-center justify-center p-12">
                                        <Loader size="md" />
                                    </div>
                                ) : savedPlaces.length === 0 ? (
                                    <EmptyState
                                        title="No Saved Attractions"
                                        description="Attractions you bookmark will show up here for easy access."
                                        action={
                                            <Link
                                                to="/explore"
                                                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all inline-block"
                                            >
                                                Explore Places
                                            </Link>
                                        }
                                    />
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {savedPlaces.map((dest: any) => (
                                            <Card key={dest._id || dest.id} className="overflow-hidden p-0 group flex flex-col justify-between border border-gray-200/50 dark:border-gray-800">
                                                <div>
                                                    <div className="h-44 overflow-hidden relative">
                                                        {dest.images?.[0] ? (
                                                            <img
                                                                src={dest.images[0]}
                                                                alt={dest.title}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                                                                <Compass className="w-8 h-8 animate-spin-slow" />
                                                            </div>
                                                        )}
                                                        <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1 text-amber-500 font-bold text-xs">
                                                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                                            <span>{dest.rating}</span>
                                                        </div>
                                                        <span className="absolute bottom-3 left-3 bg-indigo-650/90 backdrop-blur-md text-white font-bold text-[10px] px-2 py-1 rounded-lg uppercase tracking-wider">
                                                            {dest.category}
                                                        </span>
                                                    </div>

                                                    <div className="p-5 space-y-2">
                                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">{dest.title}</h4>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{dest.description}</p>
                                                    </div>
                                                </div>

                                                <div className="p-5 pt-0 border-t border-gray-150/40 dark:border-gray-800 mt-2 flex items-center justify-between">
                                                    <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                                                        <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                                                        <span className="truncate max-w-[100px]">{dest.location}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => removeFavoriteMutation.mutate(dest._id || dest.id)}
                                                            disabled={removeFavoriteMutation.isPending}
                                                            className="p-2 border border-rose-200 hover:border-transparent text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all cursor-pointer"
                                                            title="Unfavorite"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                        <Link
                                                            to={`/destination/${dest._id || dest.id}`}
                                                            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all"
                                                        >
                                                            Details
                                                        </Link>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Tab 3: Travel Stats */}
                        {activeTab === 'stats' && (
                            <motion.div
                                key="stats"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-8"
                            >
                                {isLoadingBookings || isLoadingSaved ? (
                                    <div className="flex items-center justify-center p-12">
                                        <Loader size="md" />
                                    </div>
                                ) : (
                                    <>
                                        {/* Key Stats Grid */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden">
                                                <div className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-xl w-fit">
                                                    <Ticket className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <span className="text-gray-450 dark:text-gray-400 text-xs">Bookings</span>
                                                    <h4 className="text-2xl font-black text-gray-900 dark:text-white mt-1">{bookings.length}</h4>
                                                </div>
                                            </div>

                                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden">
                                                <div className="p-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl w-fit">
                                                    <IndianRupee className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <span className="text-gray-450 dark:text-gray-400 text-xs">Total Spending</span>
                                                    <h4 className="text-2xl font-black text-gray-900 dark:text-white mt-1">₹{totalSpent}</h4>
                                                </div>
                                            </div>

                                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden">
                                                <div className="p-2 bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-xl w-fit">
                                                    <Heart className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <span className="text-gray-450 dark:text-gray-400 text-xs">Saved Places</span>
                                                    <h4 className="text-2xl font-black text-gray-900 dark:text-white mt-1">{savedPlaces.length}</h4>
                                                </div>
                                            </div>

                                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden">
                                                <div className="p-2 bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-xl w-fit">
                                                    <Activity className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <span className="text-gray-450 dark:text-gray-400 text-xs">Confirmed Tickets</span>
                                                    <h4 className="text-2xl font-black text-gray-900 dark:text-white mt-1">{activeBookingsCount}</h4>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Travel Analytics Visualization */}
                                        <Card hoverable={false} className="space-y-6">
                                            <h3 className="text-base font-bold text-gray-900 dark:text-white">Ticket Status Distribution</h3>
                                            <div className="flex flex-col sm:flex-row items-center gap-8 justify-around">
                                                
                                                {/* Left side: circular visual representation */}
                                                <div className="relative w-36 h-36 flex items-center justify-center">
                                                    {bookings.length > 0 ? (
                                                        <>
                                                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                                                {/* Background circle */}
                                                                <circle cx="18" cy="18" r="15.915" fill="none" stroke="currentColor" className="text-gray-100 dark:text-gray-850" strokeWidth="3" />
                                                                
                                                                {/* Confirmed portion */}
                                                                <circle 
                                                                    cx="18" 
                                                                    cy="18" 
                                                                    r="15.915" 
                                                                    fill="none" 
                                                                    stroke="#10b981" 
                                                                    strokeWidth="3.2" 
                                                                    strokeDasharray={`${(activeBookingsCount / bookings.length) * 100} ${100 - (activeBookingsCount / bookings.length) * 100}`} 
                                                                />
                                                                
                                                                {/* Cancelled portion offset */}
                                                                {cancelledBookingsCount > 0 && (
                                                                    <circle 
                                                                        cx="18" 
                                                                        cy="18" 
                                                                        r="15.915" 
                                                                        fill="none" 
                                                                        stroke="#ef4444" 
                                                                        strokeWidth="3.2" 
                                                                        strokeDasharray={`${(cancelledBookingsCount / bookings.length) * 100} ${100 - (cancelledBookingsCount / bookings.length) * 100}`} 
                                                                        strokeDashoffset={-((activeBookingsCount / bookings.length) * 100)}
                                                                    />
                                                                )}
                                                            </svg>
                                                            <div className="absolute text-center">
                                                                <span className="text-2xl font-black text-gray-900 dark:text-white">
                                                                    {bookings.length > 0 ? Math.round((activeBookingsCount / bookings.length) * 100) : 0}%
                                                                </span>
                                                                <p className="text-[9px] text-gray-450 dark:text-gray-400 font-bold uppercase tracking-wider">Success Rate</p>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="text-center text-xs text-gray-450 dark:text-gray-400">No Booking Data</div>
                                                    )}
                                                </div>

                                                {/* Right side: details */}
                                                <div className="space-y-4 w-full sm:w-1/2">
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between text-xs font-bold">
                                                            <span className="text-emerald-600 flex items-center gap-1.5">
                                                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                                                Confirmed ({activeBookingsCount})
                                                            </span>
                                                            <span className="text-gray-500">
                                                                {bookings.length > 0 ? Math.round((activeBookingsCount / bookings.length) * 100) : 0}%
                                                            </span>
                                                        </div>
                                                        <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                            <div className="h-full bg-emerald-500" style={{ width: `${bookings.length > 0 ? (activeBookingsCount / bookings.length) * 100 : 0}%` }} />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex justify-between text-xs font-bold">
                                                            <span className="text-rose-500 flex items-center gap-1.5">
                                                                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                                                                Cancelled ({cancelledBookingsCount})
                                                            </span>
                                                            <span className="text-gray-500">
                                                                {bookings.length > 0 ? Math.round((cancelledBookingsCount / bookings.length) * 100) : 0}%
                                                            </span>
                                                        </div>
                                                        <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                            <div className="h-full bg-rose-500" style={{ width: `${bookings.length > 0 ? (cancelledBookingsCount / bookings.length) * 100 : 0}%` }} />
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </Card>

                                        {/* Travel Timeline/Log */}
                                        <Card hoverable={false} className="space-y-4">
                                            <h3 className="text-base font-bold text-gray-900 dark:text-white">Recent Activities</h3>
                                            {bookings.length === 0 ? (
                                                <p className="text-xs text-gray-500 py-2">No bookings recorded yet.</p>
                                            ) : (
                                                <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100 dark:before:bg-gray-800">
                                                    {bookings.slice(0, 3).map((b: any, index: number) => (
                                                        <div key={b.id || index} className="flex gap-4 items-start pl-8 relative">
                                                            <div className={`absolute left-1 w-4.5 h-4.5 rounded-full border-4 border-white dark:border-gray-900 ${
                                                                b.bookingStatus === 'confirmed' ? 'bg-emerald-500' : 'bg-rose-500'
                                                            }`} />
                                                            <div className="flex-1 space-y-1">
                                                                <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                                                                    {b.bookingStatus === 'confirmed' ? 'Booked trip to' : 'Cancelled trip to'} {b.destination?.title}
                                                                </p>
                                                                <div className="flex gap-4 text-[10px] text-gray-450">
                                                                    <span className="flex items-center gap-1">
                                                                        <Calendar className="w-3 h-3" />
                                                                        {b.bookingDate}
                                                                    </span>
                                                                    <span>•</span>
                                                                    <span>₹{b.totalAmount}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </Card>
                                    </>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
export default Profile