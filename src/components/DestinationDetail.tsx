import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/services/api'
import { useAuth } from '@/hooks/useAuth'
import { motion } from 'framer-motion'
import { Star, MapPin, Clock, Ticket, Users, Calendar, CloudSun, Send, Trash2, ArrowLeft, Heart, Navigation, Edit, Check, X, ThumbsUp } from 'lucide-react'
import { toast } from 'sonner'
import Card from './ui/Card'
import Loader from './ui/Loader'
import Button from './ui/Button'

export function DestinationDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const queryClient = useQueryClient()

    const [activeImageIdx, setActiveImageIdx] = useState(0)
    const [bookingDate, setBookingDate] = useState('')
    const [travelersCount, setTravelersCount] = useState(1)
    const [isBookingLoading, setIsBookingLoading] = useState(false)

    // Review form states
    const [reviewRating, setReviewRating] = useState(5)
    const [reviewComment, setReviewComment] = useState('')
    const [isReviewLoading, setIsReviewLoading] = useState(false)

    // Inline review edit states
    const [editingReviewId, setEditingReviewId] = useState<string | null>(null)
    const [editRating, setEditRating] = useState(5)
    const [editComment, setEditComment] = useState('')
    const [isEditSaving, setIsEditSaving] = useState(false)

    // Fetch destination details
    const { data: destination, isLoading: isDestLoading } = useQuery({
        queryKey: ['destination', id],
        queryFn: async () => {
            const res = await api.get(`/api/destinations/${id}`)
            return res.data.destination
        }
    })

    // Fetch reviews for destination
    const { data: reviews = [], isLoading: isReviewsLoading } = useQuery({
        queryKey: ['reviews', id],
        queryFn: async () => {
            const res = await api.get(`/api/destinations/${id}/reviews`)
            return res.data.reviews || []
        }
    })

    // Fetch user details for savedDestinations
    const { data: profile } = useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            if (!user) return null
            const res = await api.get('/api/auth/me')
            return res.data.user
        },
        enabled: !!user
    })

    // Bookmark Favorite Toggle Mutation
    const favoriteMutation = useMutation({
        mutationFn: async () => {
            const res = await api.post(`/api/destinations/${destination?._id || destination?.id}/favorite`)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] })
            toast.success(isFavorited ? 'Removed from favorites' : 'Saved to favorites')
        },
        onError: () => {
            toast.error('Failed to update favorites')
        }
    })

    if (isDestLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader size="lg" />
            </div>
        )
    }

    if (!destination) {
        return (
            <div className="text-center py-12">
                <h3 className="text-xl font-bold">Destination not found</h3>
                <Link to="/explore" className="text-indigo-600 hover:underline mt-4 inline-block">Back to explore</Link>
            </div>
        )
    }

    const isFavorited = profile?.savedDestinations?.includes(destination._id || destination.id) || false
    const calculatedTotal = travelersCount * destination.ticketPrice

    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) {
            toast.error('Please login to book tours!')
            navigate('/login')
            return
        }

        if (!bookingDate) {
            toast.error('Please choose a booking date!')
            return
        }

        setIsBookingLoading(true)
        try {
            const res = await api.post('/api/bookings', {
                destinationId: destination._id || destination.id,
                bookingDate,
                numberOfPersons: travelersCount,
                totalAmount: calculatedTotal
            })

            if (res.data.ok) {
                toast.success('Tour booked successfully!')
                navigate('/bookings')
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Booking failed. Try again.')
        } finally {
            setIsBookingLoading(false)
        }
    }

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) {
            toast.error('Please login to leave a review')
            return
        }

        if (!reviewComment.trim()) {
            toast.error('Please enter a review comment')
            return
        }

        setIsReviewLoading(true)
        try {
            const res = await api.post(`/api/destinations/${destination._id || destination.id}/reviews`, {
                rating: reviewRating,
                comment: reviewComment
            })

            if (res.data.ok) {
                toast.success('Review posted successfully!')
                setReviewComment('')
                setReviewRating(5)
                queryClient.invalidateQueries({ queryKey: ['reviews', id] })
                queryClient.invalidateQueries({ queryKey: ['destination', id] })
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to post review.')
        } finally {
            setIsReviewLoading(false)
        }
    }

    const handleEditSave = async (reviewId: string) => {
        if (!editComment.trim()) return

        setIsEditSaving(true)
        try {
            const res = await api.put(`/api/reviews/${reviewId}`, {
                rating: editRating,
                comment: editComment
            })
            if (res.data.ok) {
                toast.success('Review updated successfully!')
                setEditingReviewId(null)
                queryClient.invalidateQueries({ queryKey: ['reviews', id] })
                queryClient.invalidateQueries({ queryKey: ['destination', id] })
            }
        } catch (err) {
            toast.error('Failed to update review')
        } finally {
            setIsEditSaving(false)
        }
    }

    const handleDeleteReview = async (reviewId: string) => {
        try {
            const res = await api.delete(`/api/admin/reviews/${reviewId}`)
            if (res.data.ok) {
                toast.success('Review deleted')
                queryClient.invalidateQueries({ queryKey: ['reviews', id] })
                queryClient.invalidateQueries({ queryKey: ['destination', id] })
            }
        } catch (error) {
            toast.error('Failed to delete review')
        }
    }

    const toggleLikeMutation = useMutation({
        mutationFn: async (reviewId: string) => {
            const res = await api.post(`/api/reviews/${reviewId}/like`)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reviews', id] })
        },
        onError: () => {
            toast.error('Failed to update like status')
        }
    })

    const handleToggleLike = (reviewId: string) => {
        if (!user) {
            toast.error('Please login to like reviews!')
            navigate('/login')
            return
        }
        toggleLikeMutation.mutate(reviewId)
    }

    return (
        <div className="space-y-8 font-sans pb-20">
            {/* Top Navigation Row */}
            <div className="flex justify-between items-center">
                <Link to="/explore" className="inline-flex items-center gap-2 text-sm font-bold text-gray-650 hover:text-indigo-650 dark:text-gray-400 dark:hover:text-indigo-400">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Explore</span>
                </Link>
                <button
                    onClick={() => {
                        if (!user) {
                            toast.error('Please login to bookmark spots')
                            navigate('/login')
                            return
                        }
                        favoriteMutation.mutate()
                    }}
                    className={`p-2.5 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-350 cursor-pointer ${
                        isFavorited ? 'bg-rose-50 border-rose-200 text-rose-500' : 'bg-white dark:bg-gray-800 hover:text-rose-500 text-gray-400'
                    }`}
                >
                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500' : ''}`} />
                </button>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Left Column - Destination Media, Description, Map & Reviews */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="h-96 md:h-[480px] rounded-3xl overflow-hidden relative shadow-xl">
                            <img
                                src={destination.images[activeImageIdx] || 'https://images.unsplash.com/photo-1721572321875-2610e9e83d55?w=1080'}
                                alt={destination.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-6 left-6 bg-indigo-600/90 backdrop-blur-md text-white font-bold text-xs px-4 py-2 rounded-xl uppercase tracking-wider">
                                {destination.category}
                            </div>
                        </div>

                        {/* Thumbnail Selectors */}
                        {destination.images && destination.images.length > 1 && (
                            <div className="flex gap-4">
                                {destination.images.map((img: string, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImageIdx(idx)}
                                        className={`w-24 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                                            activeImageIdx === idx ? 'border-indigo-600 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                                        }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Description Details Card */}
                    <Card hoverable={false} className="space-y-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{destination.title}</h1>
                                <div className="flex items-center gap-1.5 text-gray-550 dark:text-gray-400 mt-1">
                                    <MapPin className="w-4 h-4 text-indigo-500" />
                                    <span>{destination.location}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <div className="flex items-center gap-1 text-amber-500 font-extrabold text-lg justify-center">
                                        <Star className="w-5 h-5 fill-amber-500" />
                                        <span>{destination.rating}</span>
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">{destination.reviewsCount} reviews</span>
                                </div>

                                <div className="text-center bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-2xl border border-gray-100 dark:border-gray-700">
                                    <div className="font-extrabold text-indigo-650 dark:text-indigo-400 text-lg">
                                        {destination.ticketPrice === 0 ? 'Free' : `₹${destination.ticketPrice}`}
                                    </div>
                                    <span className="text-xs text-gray-550 dark:text-gray-400">Entry fee</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 border-t border-gray-100 dark:border-gray-800 pt-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">About the Destination</h3>
                            <p className="text-gray-650 dark:text-gray-300 leading-relaxed text-sm">{destination.description}</p>
                        </div>

                        {destination.imageDescription && (
                            <div className="space-y-2 border-t border-gray-100 dark:border-gray-800 pt-4">
                                <h4 className="text-xs font-bold text-gray-550 dark:text-gray-400 uppercase tracking-wider">Image Context & Highlights</h4>
                                <p className="text-xs text-gray-600 dark:text-gray-350 italic leading-relaxed">{destination.imageDescription}</p>
                            </div>
                        )}

                        {/* Quick details (Hours, Duration, Season) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 border-t border-gray-100 dark:border-gray-800 pt-6">
                            <div className="flex gap-3 items-start">
                                <Clock className="w-5 h-5 text-indigo-500 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-550 dark:text-gray-400 font-bold uppercase tracking-wider">Timings</p>
                                    <p className="text-xs font-semibold text-gray-850 dark:text-white">{destination.openingHours}</p>
                                </div>
                            </div>

                            <div className="flex gap-3 items-start">
                                <CloudSun className="w-5 h-5 text-emerald-500 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-550 dark:text-gray-400 font-bold uppercase tracking-wider">Best Season</p>
                                    <p className="text-xs font-semibold text-gray-850 dark:text-white">{destination.bestTimeToVisit || 'October to March'}</p>
                                </div>
                            </div>

                            <div className="flex gap-3 items-start">
                                <Navigation className="w-5 h-5 text-purple-500 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-550 dark:text-gray-400 font-bold uppercase tracking-wider">Duration</p>
                                    <p className="text-xs font-semibold text-gray-850 dark:text-white">{destination.estimatedVisitDuration || '2 hours'}</p>
                                </div>
                            </div>

                            <div className="flex gap-3 items-start">
                                <Navigation className="w-5 h-5 text-indigo-500 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-550 dark:text-gray-400 font-bold uppercase tracking-wider">Coordinates</p>
                                    <p className="text-xs font-semibold text-gray-850 dark:text-white">{destination.latitude}° N, {destination.longitude}° E</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Google Maps / Location Section */}
                    <Card hoverable={false} className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Interactive Location Map</h3>
                            <span className="text-xs text-indigo-650 dark:text-indigo-400 font-bold">Zoom Enabled</span>
                        </div>
                        <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-2xl relative flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700">
                            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]"></div>
                            <div className="relative z-10 text-center space-y-2 max-w-sm px-6">
                                <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-2 text-indigo-600">
                                    <MapPin className="w-6 h-6 animate-bounce" />
                                </div>
                                <h4 className="font-bold text-gray-850 dark:text-white">{destination.title} Location Info</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Latitude: {destination.latitude} | Longitude: {destination.longitude}. Located in the tourist hub of Indore.
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Reviews section panel relocated here to avoid sidebar overlap */}
                    <div className="space-y-6 pt-6 border-t border-gray-150 dark:border-gray-800">
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white">Visitor Reviews ({reviews.length})</h3>

                        {/* Review Input Box */}
                        {user ? (
                            <Card hoverable={false} className="p-6 space-y-4">
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Leave a Review</h4>
                                <form onSubmit={handleReviewSubmit} className="space-y-3">
                                    {/* Star selection */}
                                    <div className="flex gap-1.5">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setReviewRating(star)}
                                                className="focus:outline-none cursor-pointer"
                                            >
                                                <Star className={`w-6 h-6 ${star <= reviewRating ? 'fill-amber-500 text-amber-500 animate-pulse' : 'text-gray-300'}`} />
                                            </button>
                                        ))}
                                    </div>
                                    <div className="relative">
                                        <textarea
                                            placeholder="Write your travel experience here..."
                                            value={reviewComment}
                                            onChange={e => setReviewComment(e.target.value)}
                                            rows={3}
                                            required
                                            className="w-full p-4 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            className="px-6 py-2.5 text-xs font-bold"
                                            isLoading={isReviewLoading}
                                        >
                                            <Send className="w-3.5 h-3.5 mr-2" />
                                            <span>Submit Review</span>
                                        </Button>
                                    </div>
                                </form>
                            </Card>
                        ) : (
                            <Card hoverable={false} className="text-center py-6 bg-gray-50/50 dark:bg-gray-800/20 border border-dashed border-gray-200 dark:border-gray-750">
                                <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline text-sm">
                                    Sign in to leave a review
                                </Link>
                            </Card>
                        )}

                        {/* Reviews list */}
                        {isReviewsLoading ? (
                            <Loader className="py-6" />
                        ) : reviews.length === 0 ? (
                            <div className="text-center py-8 border border-dashed border-gray-200 dark:border-gray-800 rounded-3xl">
                                <p className="text-gray-500 text-sm">No reviews yet. Be the first to review this historic Indore landmark!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {reviews.map((rev: any) => (
                                    <Card key={rev.id} hoverable={false} className="p-6 space-y-4 border border-gray-150 dark:border-gray-800">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                {rev.user?.profileImage ? (
                                                    <img src={rev.user.profileImage} alt="" className="w-9 h-9 rounded-full object-cover" />
                                                ) : (
                                                    <div className="w-9 h-9 bg-indigo-50 dark:bg-indigo-950/40 rounded-full flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
                                                        {rev.user?.fullname?.substring(0, 2).toUpperCase() || 'U'}
                                                    </div>
                                                )}
                                                <div>
                                                    <h5 className="text-sm font-bold text-gray-900 dark:text-white">{rev.user?.fullname || 'Anonymous'}</h5>
                                                    
                                                    {editingReviewId === rev.id ? (
                                                        <div className="flex gap-1 mt-1">
                                                            {[1, 2, 3, 4, 5].map(s => (
                                                                <button key={s} type="button" onClick={() => setEditRating(s)} className="cursor-pointer">
                                                                    <Star className={`w-4 h-4 ${s <= editRating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`} />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="flex gap-0.5 mt-0.5">
                                                            {[1, 2, 3, 4, 5].map(s => (
                                                                <Star key={s} className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`} />
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Edit & Delete Actions */}
                                            {user && (user.role === 'admin' || user.id === rev.userId) && (
                                                <div className="flex items-center gap-1.5">
                                                    {editingReviewId === rev.id ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleEditSave(rev.id)}
                                                                disabled={isEditSaving}
                                                                className="text-emerald-500 hover:text-emerald-700 p-1 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded cursor-pointer"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => setEditingReviewId(null)}
                                                                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-150 rounded cursor-pointer"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {user.id === rev.userId && (
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingReviewId(rev.id)
                                                                        setEditRating(rev.rating)
                                                                        setEditComment(rev.comment)
                                                                    }}
                                                                    className="text-indigo-500 hover:text-indigo-700 p-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 rounded cursor-pointer"
                                                                >
                                                                    <Edit className="w-3.5 h-3.5" />
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => handleDeleteReview(rev.id)}
                                                                className="text-red-500 hover:text-red-750 p-1.5 hover:bg-red-50 dark:hover:bg-red-950/25 rounded-lg transition-colors cursor-pointer"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Comment Body */}
                                        {editingReviewId === rev.id ? (
                                            <textarea
                                                value={editComment}
                                                onChange={e => setEditComment(e.target.value)}
                                                rows={2}
                                                className="w-full mt-2 p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none text-xs"
                                            />
                                        ) : (
                                            <p className="text-gray-650 dark:text-gray-300 text-xs leading-relaxed">{rev.comment}</p>
                                        )}

                                        {/* Likes Footer Row */}
                                        <div className="flex items-center gap-4 pt-1 text-xs">
                                            <button
                                                type="button"
                                                onClick={() => handleToggleLike(rev.id)}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                                                    rev.likes?.includes(user?.id || '')
                                                        ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/40 dark:border-indigo-900 dark:text-indigo-400 font-bold'
                                                        : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 text-gray-500 hover:text-gray-750 dark:hover:text-white'
                                                }`}
                                            >
                                                <ThumbsUp className={`w-3.5 h-3.5 ${rev.likes?.includes(user?.id || '') ? 'fill-indigo-500' : ''}`} />
                                                <span>{rev.likes?.length || 0} Likes</span>
                                            </button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Booking Form Only (Kept sticky) */}
                <div>
                    <Card hoverable={false} className="space-y-6 sticky top-8 border-2 border-indigo-500/10 shadow-lg">
                        <div>
                            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">Book Tour Ticket</h3>
                            <p className="text-gray-550 dark:text-gray-400 text-xs">Instantly reserve tickets and bypass queues</p>
                        </div>

                        <form onSubmit={handleBookingSubmit} className="space-y-4">
                            
                            {/* Date select */}
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Choose Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                    <input
                                        type="date"
                                        value={bookingDate}
                                        onChange={e => setBookingDate(e.target.value)}
                                        required
                                        className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                    />
                                </div>
                            </div>

                            {/* Travelers count */}
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-550 dark:text-gray-400 uppercase tracking-wider">Travelers count</label>
                                <div className="relative">
                                    <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={travelersCount}
                                        onChange={e => setTravelersCount(Number(e.target.value))}
                                        required
                                        className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                    />
                                </div>
                            </div>

                            {/* Total calculations */}
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl space-y-2 border border-gray-100 dark:border-gray-700">
                                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                                    <span>₹{destination.ticketPrice} × {travelersCount} Person</span>
                                    <span>₹{calculatedTotal}</span>
                                </div>
                                <div className="flex justify-between font-bold text-base text-gray-900 dark:text-white border-t border-gray-200/50 dark:border-gray-750 pt-2">
                                    <span>Total Price</span>
                                    <span>₹{calculatedTotal}</span>
                                </div>
                            </div>

                            {/* Submit booking button */}
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full font-bold"
                                isLoading={isBookingLoading}
                            >
                                Book Now
                            </Button>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    )
}
export default DestinationDetail