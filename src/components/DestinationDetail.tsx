import React, { useState } from 'react'
import { useParams, Link } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/services/api'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    Star, 
    MapPin, 
    Calendar, 
    Users, 
    ArrowLeft, 
    Share2, 
    Heart, 
    Clock, 
    Sun, 
    Compass, 
    CheckCircle2, 
    MessageCircle, 
    HelpCircle, 
    Layers, 
    Navigation,
    Info,
    BookOpen
} from 'lucide-react'
import { toast } from 'sonner'
import Card from './ui/Card'
import Loader from './ui/Loader'
import Button from './ui/Button'
import ImageWithFallback from './ui/ImageWithFallback'
import { 
    getCategoryPriceLabel, 
    getCategoryFormattedPrice, 
    getCategoryActionLabel, 
    getCategoryBadgeStyle,
    getCategoryVisitorLabel,
    getCategorySubmitLabel,
    getCategoryBookingTitle,
    getCategoryBookingSubtitle
} from '@/lib/categoryHelpers'
import { useAuth } from '@/hooks/useAuth'

function sanitizeText(text?: string): string {
    if (!text) return ''
    return text.replace(/\btesty\b/gi, 'taste')
}

export function DestinationDetail() {
    const { id } = useParams<{ id: string }>()
    const queryClient = useQueryClient()
    const { user } = useAuth()

    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'faqs'>('overview')
    const [bookingDate, setBookingDate] = useState('')
    const [numberOfPersons, setNumberOfPersons] = useState(1)

    // Review Form state
    const [reviewRating, setReviewRating] = useState(5)
    const [reviewComment, setReviewComment] = useState('')

    // Fetch Destination Details
    const { data: destination, isLoading, isError } = useQuery({
        queryKey: ['destination', id],
        queryFn: async () => {
            const res = await api.get(`/api/destinations/${id}`)
            return res.data.destination
        },
        enabled: !!id
    })

    // Fetch User profile to check if destination is favorited
    const { data: profile } = useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            if (!user) return null
            const res = await api.get('/api/auth/me')
            return res.data.user
        },
        enabled: !!user
    })

    // Bookmark Toggle Mutation
    const favoriteMutation = useMutation({
        mutationFn: async () => {
            const res = await api.post(`/api/destinations/${id}/favorite`)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] })
            toast.success('Updated saved places!')
        }
    })

    // Create Booking Mutation
    const bookingMutation = useMutation({
        mutationFn: async (payload: any) => {
            const res = await api.post('/api/bookings', payload)
            return res.data
        },
        onSuccess: () => {
            toast.success('Pass booked successfully!')
            queryClient.invalidateQueries({ queryKey: ['myBookings'] })
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to book pass')
        }
    })

    // Add Review Mutation
    const reviewMutation = useMutation({
        mutationFn: async (payload: any) => {
            const res = await api.post(`/api/destinations/${id}/reviews`, payload)
            return res.data
        },
        onSuccess: () => {
            toast.success('Review posted successfully!')
            setReviewComment('')
            queryClient.invalidateQueries({ queryKey: ['destination', id] })
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to post review')
        }
    })

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader size="lg" />
            </div>
        )
    }

    if (isError || !destination) {
        return (
            <div className="text-center py-16 space-y-4">
                <p className="text-rose-500 font-bold">Failed to load destination details.</p>
                <Link to="/explore" className="text-indigo-600 font-bold underline">Return to Explore</Link>
            </div>
        )
    }

    const isFavorited = profile?.savedDestinations?.includes(destination._id || destination.id) || false
    const images = destination.images && destination.images.length > 0 ? destination.images : []
    const currentImage = images[selectedImageIndex] || images[0]
    const unitPrice = destination.ticketPrice || 0
    const totalPrice = unitPrice * numberOfPersons

    const handleBookingSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) {
            toast.error('Please login to book a pass')
            return
        }
        if (!bookingDate) {
            toast.error('Please select a visit date')
            return
        }
        bookingMutation.mutate({
            destinationId: destination._id || destination.id,
            bookingDate,
            numberOfPersons
        })
    }

    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) {
            toast.error('Please login to submit a review')
            return
        }
        if (!reviewComment.trim()) {
            toast.error('Please write a review comment')
            return
        }
        reviewMutation.mutate({
            rating: reviewRating,
            comment: reviewComment
        })
    }

    return (
        <div className="space-y-8 font-sans pb-16 text-left">
            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between">
                <Link
                    to="/explore"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Explore</span>
                </Link>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({
                                    title: destination.title,
                                    text: destination.description,
                                    url: window.location.href
                                })
                            } else {
                                navigator.clipboard.writeText(window.location.href)
                                toast.success('Link copied to clipboard!')
                            }
                        }}
                        className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors shadow-sm cursor-pointer"
                        title="Share Destination"
                    >
                        <Share2 className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => {
                            if (!user) {
                                toast.error('Please login to bookmark spots')
                                return
                            }
                            favoriteMutation.mutate()
                        }}
                        className={`p-2.5 border rounded-2xl transition-all shadow-sm cursor-pointer ${
                            isFavorited 
                                ? 'bg-rose-500 text-white border-rose-500' 
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-rose-500'
                        }`}
                        title="Bookmark Destination"
                    >
                        <Heart className={`w-4 h-4 ${isFavorited ? 'fill-white' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Multi-Image Hero Gallery */}
            <div className="space-y-4">
                <div className="relative h-[22rem] sm:h-[28rem] lg:h-[34rem] rounded-3xl overflow-hidden shadow-2xl border border-slate-200/60 dark:border-slate-800">
                    <ImageWithFallback
                        src={currentImage}
                        alt={destination.title}
                        category={destination.category}
                        className="w-full h-full object-cover"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                    {/* Overlay Text Details */}
                    <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4 text-white text-left">
                        <div className="space-y-2 max-w-xl">
                            <div className="flex items-center gap-2">
                                <span className={`font-extrabold text-[10px] px-3 py-1 rounded-xl uppercase tracking-wider backdrop-blur-md shadow-md ${getCategoryBadgeStyle(destination.category)}`}>
                                    {destination.category}
                                </span>
                                <span className="bg-emerald-500/90 text-white font-extrabold text-[10px] px-3 py-1 rounded-xl uppercase tracking-wider backdrop-blur-md">
                                    Open Today
                                </span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading leading-tight tracking-tight drop-shadow-md break-words min-w-0 max-w-full">
                                {destination.title}
                            </h1>
                            <div className="flex items-center gap-2 text-xs text-slate-200 font-semibold min-w-0 max-w-full truncate">
                                <MapPin className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                                <span className="truncate">{destination.location}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 shadow-lg">
                            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                            <span className="font-black text-xl">{destination.rating || 4.8}</span>
                            <span className="text-xs text-slate-200 font-bold">({destination.reviewsCount || 0} reviews)</span>
                        </div>
                    </div>
                </div>

                {/* Thumbnails Carousel */}
                {images.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                        {images.map((imgUrl: string, idx: number) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedImageIndex(idx)}
                                className={`relative w-24 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                                    selectedImageIndex === idx 
                                        ? 'border-indigo-600 scale-105 shadow-md' 
                                        : 'border-transparent opacity-60 hover:opacity-100'
                                }`}
                            >
                                <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Content & Sticky Booking Grid */}
            <div className="grid lg:grid-cols-3 gap-8 items-start">
                
                {/* Left Column: Quick Details & Interactive Tabs */}
                <div className="lg:col-span-2 space-y-8 text-left">
                    
                    {/* Key Info Specs Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <Card hoverable={false} className="p-4 space-y-1 text-left border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900">
                            <Clock className="w-5 h-5 text-indigo-500" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Timings</span>
                            <span className="font-extrabold text-xs text-slate-900 dark:text-white block">{destination.openingHours || '10 AM - 8 PM'}</span>
                        </Card>

                        <Card hoverable={false} className="p-4 space-y-1 text-left border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900">
                            <Sun className="w-5 h-5 text-amber-500" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Best Season</span>
                            <span className="font-extrabold text-xs text-slate-900 dark:text-white block">{destination.bestTimeToVisit || 'Oct to Mar'}</span>
                        </Card>

                        <Card hoverable={false} className="p-4 space-y-1 text-left border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900">
                            <Compass className="w-5 h-5 text-purple-500" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Visit Duration</span>
                            <span className="font-extrabold text-xs text-slate-900 dark:text-white block">{destination.estimatedVisitDuration || '2 hours'}</span>
                        </Card>

                        <Card hoverable={false} className="p-4 space-y-1 text-left border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900">
                            <Navigation className="w-5 h-5 text-sky-500" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Coordinates</span>
                            <span className="font-extrabold text-[11px] text-slate-900 dark:text-white block font-mono">
                                {destination.latitude?.toFixed(2)}, {destination.longitude?.toFixed(2)}
                            </span>
                        </Card>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="space-y-4">
                        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-sm font-extrabold font-heading">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`pb-3 border-b-2 transition-all cursor-pointer ${
                                    activeTab === 'overview'
                                        ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                                        : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                Overview & Highlights
                            </button>
                            <button
                                onClick={() => setActiveTab('history')}
                                className={`pb-3 border-b-2 transition-all cursor-pointer ${
                                    activeTab === 'history'
                                        ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                                        : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                History & Architecture
                            </button>
                            <button
                                onClick={() => setActiveTab('faqs')}
                                className={`pb-3 border-b-2 transition-all cursor-pointer ${
                                    activeTab === 'faqs'
                                        ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                                        : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                Visitor FAQs & Guidelines
                            </button>
                        </div>

                        {/* Tab Content Cards */}
                        <div className="pt-2">
                            {activeTab === 'overview' && (
                                <Card hoverable={false} className="p-6 space-y-4 text-left border border-slate-200/60 dark:border-slate-800 break-words min-w-0 max-w-full overflow-hidden">
                                    <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white truncate">About {destination.title}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal break-words overflow-hidden">
                                        {sanitizeText(destination.description)}
                                    </p>
                                    
                                    <div className="pt-4 border-t border-slate-150 dark:border-slate-800 space-y-3">
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Spot Highlights</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {['Iconic Indore Landmark', 'Cleanliness Standard', 'Photographer Friendly', 'Family Friendly', 'Accessible Location'].map((h, i) => (
                                                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200/50 dark:border-indigo-800">
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    <span>{h}</span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                            )}

                            {activeTab === 'history' && (
                                <Card hoverable={false} className="p-6 space-y-4 text-left border border-slate-200/60 dark:border-slate-800">
                                    <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">Heritage & Cultural Context</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {destination.title} holds deep cultural significance in Indore’s rich history dating back to the Holkar dynasty era. The location showcases classical Maratha and Indo-Saracenic architectural elements with grand wooden gateways, stone masonry, and vibrant local bazaars surrounding the premises.
                                    </p>
                                </Card>
                            )}

                            {activeTab === 'faqs' && (
                                <Card hoverable={false} className="p-6 space-y-4 text-left border border-slate-200/60 dark:border-slate-800">
                                    <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">Traveler Guidelines</h3>
                                    <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                                        <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl space-y-1">
                                            <span className="font-bold text-slate-900 dark:text-white block">Q: Is parking available near the entrance?</span>
                                            <p>Yes, paid & public two-wheeler and four-wheeler parking is available nearby.</p>
                                        </div>
                                        <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl space-y-1">
                                            <span className="font-bold text-slate-900 dark:text-white block">Q: Are digital passes accepted on smartphone?</span>
                                            <p>Yes! Show the QR code on your Indore Explorer pass at the entry counter.</p>
                                        </div>
                                    </div>
                                </Card>
                            )}
                        </div>
                    </div>

                    {/* Interactive Map Embed */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">Location Map</h3>
                        <Card hoverable={false} className="p-0 overflow-hidden border border-slate-200/60 dark:border-slate-800 h-72 relative">
                            <iframe
                                title="Destination Location Map"
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                loading="lazy"
                                src={`https://maps.google.com/maps?q=${destination.latitude || 22.7187},${destination.longitude || 75.8578}&z=15&output=embed`}
                                className="w-full h-full"
                            />
                        </Card>
                    </div>

                    {/* Reviews List & Submission */}
                    <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">Visitor Reviews ({destination.reviews?.length || 0})</h3>
                        </div>

                        {/* Submit Review Card */}
                        <Card hoverable={false} className="p-6 space-y-4 text-left border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Leave a Review</h4>
                            <form onSubmit={handleReviewSubmit} className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500 font-bold">Rating:</span>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                                type="button"
                                                key={star}
                                                onClick={() => setReviewRating(star)}
                                                className="p-1 cursor-pointer"
                                            >
                                                <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <textarea
                                    value={reviewComment}
                                    onChange={e => setReviewComment(e.target.value)}
                                    rows={3}
                                    placeholder="Share your experience, tips, and food recommendations..."
                                    className="w-full p-3.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                                />

                                <Button type="submit" variant="primary" isLoading={reviewMutation.isPending} className="font-bold text-xs py-2.5">
                                    Post Review
                                </Button>
                            </form>
                        </Card>

                        {/* Reviews Grid */}
                        <div className="space-y-3">
                            {(!destination.reviews || destination.reviews.length === 0) ? (
                                <p className="text-slate-500 text-xs italic">No reviews yet. Be the first explorer to review!</p>
                            ) : (
                                destination.reviews.map((rev: any, idx: number) => (
                                    <Card key={idx} hoverable={false} className="p-4 space-y-2 text-left border border-slate-150 dark:border-slate-800">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs">
                                                    {rev.user?.fullname ? rev.user.fullname[0] : 'U'}
                                                </div>
                                                <div>
                                                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">{rev.user?.fullname || 'Explorer'}</h5>
                                                    <span className="text-[10px] text-slate-400">{new Date(rev.createdAt || Date.now()).toLocaleDateString()}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                                <span>{rev.rating}</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">{rev.comment}</p>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Sticky Glass Booking Card Panel */}
                <div className="lg:sticky lg:top-24 space-y-6">
                    <Card hoverable={false} className="p-6 space-y-6 border border-slate-200/80 dark:border-slate-800 shadow-2xl glass-panel text-left rounded-3xl">
                        
                        {/* Header Price Info */}
                        <div className="space-y-1 pb-4 border-b border-slate-150 dark:border-slate-800">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                                {getCategoryBookingTitle(destination.category)}
                            </span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black font-heading text-slate-900 dark:text-white">
                                    {unitPrice === 0 ? 'Free Entry' : `₹${unitPrice}`}
                                </span>
                                {unitPrice > 0 && <span className="text-xs text-slate-500 font-semibold">/ person</span>}
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                {getCategoryBookingSubtitle(destination.category)}
                            </p>
                        </div>

                        {/* Booking Form */}
                        <form onSubmit={handleBookingSubmit} className="space-y-4">
                            <div className="space-y-1.5 text-left">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                                    <span>Select Scheduled Date *</span>
                                </label>
                                <input
                                    type="date"
                                    value={bookingDate}
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={e => setBookingDate(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                            </div>

                            <div className="space-y-1.5 text-left">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                    <Users className="w-3.5 h-3.5 text-indigo-500" />
                                    <span>{getCategoryVisitorLabel(destination.category)}</span>
                                </label>
                                <div className="flex items-center border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-2xl overflow-hidden p-1">
                                    <button
                                        type="button"
                                        onClick={() => setNumberOfPersons(Math.max(1, numberOfPersons - 1))}
                                        className="w-10 h-10 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
                                    >
                                        -
                                    </button>
                                    <span className="flex-1 text-center font-extrabold text-sm text-slate-900 dark:text-white">
                                        {numberOfPersons}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setNumberOfPersons(numberOfPersons + 1)}
                                        className="w-10 h-10 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Total Breakdown */}
                            <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl space-y-2 text-xs border border-slate-150 dark:border-slate-800">
                                <div className="flex justify-between text-slate-500">
                                    <span>{getCategoryPriceLabel(destination.category, unitPrice)} ({numberOfPersons}x)</span>
                                    <span>₹{totalPrice}</span>
                                </div>
                                <div className="flex justify-between text-slate-500">
                                    <span>Digital Pass Generation Fee</span>
                                    <span className="text-emerald-600 font-bold">FREE</span>
                                </div>
                                <div className="flex justify-between font-black text-sm text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-700 pt-2">
                                    <span>Total Amount</span>
                                    <span className="text-indigo-600 dark:text-indigo-400">₹{totalPrice}</span>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                isLoading={bookingMutation.isPending}
                                className="w-full font-black py-3.5 text-xs rounded-2xl shadow-lg shadow-indigo-600/30 uppercase tracking-wider"
                            >
                                {getCategorySubmitLabel(destination.category)}
                            </Button>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    )
}
export default DestinationDetail