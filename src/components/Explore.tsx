import React, { useState } from 'react'
import { Link } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/services/api'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Star, MapPin, SlidersHorizontal, Compass, Plus, Heart, Clock, Sun, Sparkles, Filter, Check, Image as ImageIcon, Upload, FolderPlus } from 'lucide-react'
import { toast } from 'sonner'
import Card from './ui/Card'
import Loader from './ui/Loader'
import EmptyState from './ui/EmptyState'
import Modal from './ui/Modal'
import Button from './ui/Button'
import Skeleton from './ui/Skeleton'
import ImageWithFallback from './ui/ImageWithFallback'
import { 
    getCategoryFormattedPrice, 
    getCategoryPriceLabel, 
    getCategoryActionLabel, 
    getCategoryBadgeStyle 
} from '@/lib/categoryHelpers'
import { useAuth } from '@/hooks/useAuth'

function sanitizeText(text?: string): string {
    if (!text) return ''
    return text.replace(/\btesty\b/gi, 'taste')
}

// Preset gallery images for quick spot creation
const PRESET_GALLERY_IMAGES = [
    { title: 'Rajwada Palace', category: 'heritage', url: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80' },
    { title: 'Chappan Dukan Street', category: 'food', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80' },
    { title: 'Sarafa Bazaar Night', category: 'food', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80' },
    { title: 'Ralamandal Sanctuary', category: 'nature', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
    { title: 'Khajrana Temple', category: 'spiritual', url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80' },
    { title: 'Phoenix Citadel', category: 'shopping', url: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80' },
    { title: 'Gulawat Lotus Lake', category: 'nature', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' }
]

export function Explore() {
    const queryClient = useQueryClient()
    const { user } = useAuth()
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [maxPrice, setMaxPrice] = useState<number>(500)
    const [minRating, setMinRating] = useState<number>(0)
    const [sortBy, setSortBy] = useState<string>('default')
    const [showFilters, setShowFilters] = useState(false)

    // Location Post Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState<'heritage' | 'food' | 'nature' | 'spiritual' | 'shopping' | 'other'>('heritage')
    const [imagesStr, setImagesStr] = useState('')
    const [imageDescription, setImageDescription] = useState('')
    const [location, setLocation] = useState('')
    const [latitude, setLatitude] = useState<number | ''>(22.7187)
    const [longitude, setLongitude] = useState<number | ''>(75.8578)
    const [openingHours, setOpeningHours] = useState('')
    const [ticketPrice, setTicketPrice] = useState<number | ''>(0)
    const [bestTimeToVisit, setBestTimeToVisit] = useState('')
    const [estimatedVisitDuration, setEstimatedVisitDuration] = useState('')

    // System File Gallery Access Handler
    const handleDeviceGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        const file = files[0]
        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file from gallery')
            return
        }

        const reader = new FileReader()
        reader.onload = (uploadEvent) => {
            const base64Url = uploadEvent.target?.result as string
            if (base64Url) {
                setImagesStr(base64Url)
                setImageDescription(file.name)
                toast.success(`Loaded image "${file.name}" from device gallery!`)
            }
        }
        reader.readAsDataURL(file)
    }

    // Fetch destinations
    const { data: destinations = [], isLoading } = useQuery({
        queryKey: ['destinationsList'],
        queryFn: async () => {
            const res = await api.get('/api/destinations')
            return res.data.destinations || []
        }
    })

    // Fetch profile for saved favorites
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
        mutationFn: async (destId: string) => {
            const res = await api.post(`/api/destinations/${destId}/favorite`)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] })
            queryClient.invalidateQueries({ queryKey: ['favoritesList'] })
            toast.success('Updated saved places!')
        },
        onError: () => {
            toast.error('Failed to update bookmark')
        }
    })

    // Post location mutation
    const addLocationMutation = useMutation({
        mutationFn: async (payload: any) => {
            const res = await api.post('/api/destinations', payload)
            return res.data
        },
        onSuccess: () => {
            toast.success('New location posted successfully!')
            setIsAddModalOpen(false)
            queryClient.invalidateQueries({ queryKey: ['destinationsList'] })
            // Reset form fields
            setTitle('')
            setDescription('')
            setCategory('heritage')
            setImagesStr('')
            setImageDescription('')
            setLocation('')
            setLatitude(22.7187)
            setLongitude(75.8578)
            setOpeningHours('')
            setTicketPrice(0)
            setBestTimeToVisit('')
            setEstimatedVisitDuration('')
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to post new location')
        }
    })

    const handlePostSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        // Strict Validation Checks
        if (!title.trim() || title.trim().length < 3) {
            toast.error('Spot Title must be at least 3 characters long')
            return
        }
        if (!description.trim() || description.trim().length < 10) {
            toast.error('Description must be at least 10 characters long')
            return
        }
        if (!location.trim()) {
            toast.error('Please enter street / location area')
            return
        }
        if (!openingHours.trim()) {
            toast.error('Please enter opening hours / timings')
            return
        }
        if (ticketPrice === '' || Number(ticketPrice) < 0) {
            toast.error('Please enter a valid ticket price (0 or greater)')
            return
        }

        const imagesArray = imagesStr.split(',').map(s => s.trim()).filter(Boolean)
        if (imagesArray.length === 0) {
            toast.error('Please select a photo from your device gallery, presets, or URL')
            return
        }

        // Validate URL / Base64 syntax
        const invalidUrls = imagesArray.filter(url => !url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('data:image/'))
        if (invalidUrls.length > 0) {
            toast.error('Image must be uploaded from gallery or be a valid http/https URL')
            return
        }

        addLocationMutation.mutate({
            title: title.trim(),
            description: description.trim(),
            category,
            images: imagesArray,
            imageDescription: imageDescription.trim() || title.trim(),
            location: location.trim(),
            latitude: Number(latitude) || 22.7187,
            longitude: Number(longitude) || 75.8578,
            openingHours: openingHours.trim(),
            ticketPrice: Number(ticketPrice),
            bestTimeToVisit: bestTimeToVisit.trim() || 'October to March',
            estimatedVisitDuration: estimatedVisitDuration.trim() || '2 hours'
        })
    }

    // Categories list with emojis
    const categories = [
        { id: 'all', label: '🎉 All Spots', category: 'all' },
        { id: 'heritage', label: '🏛 Heritage', category: 'heritage' },
        { id: 'food', label: '🍴 Food Street', category: 'food' },
        { id: 'spiritual', label: '🛕 Spiritual', category: 'spiritual' },
        { id: 'nature', label: '🌳 Nature/Parks', category: 'nature' },
        { id: 'shopping', label: '🛍 Shopping', category: 'shopping' }
    ]

    // Filtering logic
    const filteredDestinations = destinations
        .filter((dest: any) => {
            const matchesSearch = dest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 dest.location.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesCategory = selectedCategory === 'all' || dest.category === selectedCategory
            const matchesPrice = dest.ticketPrice <= maxPrice
            const matchesRating = dest.rating >= minRating
            return matchesSearch && matchesCategory && matchesPrice && matchesRating
        })
        .sort((a: any, b: any) => {
            if (sortBy === 'rating') return b.rating - a.rating
            if (sortBy === 'priceLow') return a.ticketPrice - b.ticketPrice
            if (sortBy === 'priceHigh') return b.ticketPrice - a.ticketPrice
            if (sortBy === 'reviews') return b.reviewsCount - a.reviewsCount
            return 0
        })

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    }

    return (
        <div className="space-y-8 font-sans pb-16 text-left max-w-full overflow-hidden">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 min-w-0 max-w-full">
                <div className="space-y-1 min-w-0">
                    <h2 className="text-3xl sm:text-4xl font-black font-heading text-slate-900 dark:text-white truncate">Explore Indore</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm break-words">Discover iconic palaces, street food markets, holy shrines & nature parks</p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <Button 
                        onClick={() => setIsAddModalOpen(true)}
                        variant="primary"
                        className="font-bold flex items-center justify-center gap-2 whitespace-nowrap text-xs py-3 shadow-md shadow-indigo-600/20"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Post Spot</span>
                    </Button>

                    {/* Search Bar */}
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search by name or street..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white shadow-sm text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Category Emojis Selector Bar */}
            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none max-w-full">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                            selectedCategory === cat.id
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/25 scale-105'
                                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-102'
                        }`}
                    >
                        <span>{cat.label}</span>
                    </button>
                ))}
            </div>

            {/* Filters Toggler & Sorter */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-b border-slate-200/80 dark:border-slate-800/80 py-4 max-w-full">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer bg-slate-100 dark:bg-slate-850 px-4 py-2 rounded-xl transition-all"
                >
                    <Filter className="w-4 h-4" />
                    <span>{showFilters ? 'Hide Filters' : 'Filter Options'}</span>
                </button>

                <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Sort By:</span>
                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl text-slate-700 dark:text-slate-300 font-semibold focus:outline-none cursor-pointer"
                    >
                        <option value="default">Recommended</option>
                        <option value="rating">Top Rated</option>
                        <option value="priceLow">Price: Low to High</option>
                        <option value="priceHigh">Price: High to Low</option>
                        <option value="reviews">Most Reviewed</option>
                    </select>
                </div>
            </div>

            {/* Filter controls expandable */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <Card hoverable={false} className="p-6 space-y-4 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
                                        <span>Max Price / Budget</span>
                                        <span className="text-indigo-600 font-extrabold">₹{maxPrice}</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1000"
                                        step="50"
                                        value={maxPrice}
                                        onChange={e => setMaxPrice(Number(e.target.value))}
                                        className="w-full accent-indigo-600 cursor-pointer"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
                                        <span>Minimum Rating</span>
                                        <span className="text-amber-500 font-extrabold">{minRating} ★ & above</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="5"
                                        step="0.5"
                                        value={minRating}
                                        onChange={e => setMinRating(Number(e.target.value))}
                                        className="w-full accent-amber-500 cursor-pointer"
                                    />
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Grid Container */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map(n => (
                        <div key={n} className="space-y-4 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 bg-white dark:bg-slate-900">
                            <Skeleton className="h-56 w-full rounded-2xl" />
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-10 w-full rounded-xl" />
                        </div>
                    ))}
                </div>
            ) : filteredDestinations.length === 0 ? (
                <EmptyState
                    title="No spots found"
                    description="Try modifying your filters, search terms, or category selection."
                    action={
                        <button
                            onClick={() => {
                                setSearchTerm('')
                                setSelectedCategory('all')
                                setMaxPrice(500)
                                setMinRating(0)
                                setSortBy('default')
                            }}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors cursor-pointer text-xs"
                        >
                            Reset Filters
                        </button>
                    }
                />
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {filteredDestinations.map((dest: any) => {
                        const isFavorited = profile?.savedDestinations?.includes(dest._id || dest.id) || false
                        
                        return (
                            <motion.div variants={itemVariants} key={dest._id || dest.id} className="min-w-0 max-w-full">
                                <Card hoverable className="overflow-hidden p-0 group flex flex-col justify-between border border-slate-200/70 dark:border-slate-800/80 text-left shadow-md hover:shadow-2xl transition-all duration-300 bg-white dark:bg-slate-900 rounded-3xl min-w-0 max-w-full">
                                    <div className="min-w-0 max-w-full">
                                        {/* Image Header Container */}
                                        <div className="h-60 overflow-hidden relative w-full">
                                            <ImageWithFallback
                                                src={dest.images?.[0]}
                                                alt={dest.title}
                                                category={dest.category}
                                                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                                            />
                                            
                                            {/* Rating Pill */}
                                            <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 text-amber-500 font-extrabold text-xs shadow-md">
                                                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                                <span>{dest.rating}</span>
                                            </div>

                                            {/* Bookmark Wishlist Button Overlay */}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    if (!user) {
                                                        toast.error('Please login to bookmark spots')
                                                        return
                                                    }
                                                    favoriteMutation.mutate(dest._id || dest.id)
                                                }}
                                                className={`absolute top-4 left-4 p-2.5 rounded-full backdrop-blur-md shadow-md transition-all duration-300 cursor-pointer ${
                                                    isFavorited 
                                                        ? 'bg-rose-500 text-white' 
                                                        : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-rose-500'
                                                }`}
                                            >
                                                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-white' : ''}`} />
                                            </button>

                                            {/* Category Badge Overlay */}
                                            <span className={`absolute bottom-4 left-4 font-extrabold text-[10px] px-3 py-1 rounded-xl uppercase tracking-wider backdrop-blur-md shadow-md ${getCategoryBadgeStyle(dest.category)}`}>
                                                {dest.category}
                                            </span>

                                            {/* Open Today Status */}
                                            <span className="absolute bottom-4 right-4 bg-emerald-500/90 text-white font-extrabold text-[9px] px-2.5 py-1 rounded-lg uppercase tracking-wider backdrop-blur-md">
                                                Open Today
                                            </span>
                                        </div>

                                        {/* Card Text Content with strict overflow containment */}
                                        <div className="p-6 space-y-3 text-left min-w-0 max-w-full overflow-hidden break-words">
                                            <h4 className="text-xl font-bold font-heading text-slate-900 dark:text-white truncate min-w-0 max-w-full group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                {dest.title}
                                            </h4>
                                            
                                            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-normal break-words overflow-hidden">
                                                {sanitizeText(dest.description)}
                                            </p>

                                            {/* Meta specifications (Hours, Location) */}
                                            <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 pt-1 font-semibold min-w-0 max-w-full overflow-hidden">
                                                <span className="flex items-center gap-1 flex-shrink-0">
                                                    <Clock className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                                                    <span className="truncate max-w-[100px]">{dest.openingHours || '10 AM - 8 PM'}</span>
                                                </span>
                                                <span className="flex-shrink-0">•</span>
                                                <span className="flex items-center gap-1 truncate min-w-0 max-w-full">
                                                    <MapPin className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                                                    <span className="truncate">{dest.location}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer Price & CTA Button */}
                                    <div className="p-6 pt-0 border-t border-slate-150 dark:border-slate-800/80 mt-2 flex items-center justify-between gap-2 min-w-0">
                                        <div className="flex flex-col text-left min-w-0 flex-1">
                                            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-400 truncate">
                                                {getCategoryPriceLabel(dest.category, dest.ticketPrice)}
                                            </span>
                                            <span className="font-black text-indigo-600 dark:text-indigo-400 text-sm sm:text-base font-heading truncate">
                                                {dest.ticketPrice === 0 ? 'Free Entry' : `₹${dest.ticketPrice}`}
                                            </span>
                                        </div>

                                        <Link
                                            to={`/destination/${dest._id || dest.id}`}
                                            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs rounded-2xl shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/40 transition-all duration-300 whitespace-nowrap flex-shrink-0"
                                        >
                                            {getCategoryActionLabel(dest.category)}
                                        </Link>
                                    </div>
                                </Card>
                            </motion.div>
                        )
                    })}
                </motion.div>
            )}

            {/* Post Location Modal with System Gallery & Presets */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Post New Location / Attraction Details"
                size="lg"
            >
                <form onSubmit={handlePostSubmit} className="space-y-5 font-sans max-h-[75vh] overflow-y-auto px-1 scrollbar-none text-left">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5 text-left">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Spot Title *</label>
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                required
                                placeholder="e.g. Rajwada Palace"
                                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                        <div className="space-y-1.5 text-left">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Category *</label>
                            <select
                                value={category}
                                onChange={e => setCategory(e.target.value as any)}
                                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm cursor-pointer"
                            >
                                <option value="heritage">Heritage</option>
                                <option value="food">Food Street</option>
                                <option value="nature">Nature/Parks</option>
                                <option value="spiritual">Spiritual</option>
                                <option value="shopping">Shopping</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1.5 text-left">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Spot Description *</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                            rows={3}
                            placeholder="Provide a brief history or description about the destination..."
                            className="w-full p-3.5 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                    </div>

                    {/* System Device Gallery File Picker Button */}
                    <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/60 space-y-3 text-left">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs">
                                <FolderPlus className="w-4 h-4" />
                                <span>Upload Photo from System / Device Gallery</span>
                            </div>

                            <input
                                id="deviceGalleryInput"
                                type="file"
                                accept="image/*"
                                onChange={handleDeviceGalleryUpload}
                                className="hidden"
                            />

                            <button
                                type="button"
                                onClick={() => document.getElementById('deviceGalleryInput')?.click()}
                                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-xs rounded-xl shadow-md hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5"
                            >
                                <Upload className="w-3.5 h-3.5" />
                                <span>Choose Local Gallery File</span>
                            </button>
                        </div>

                        {imagesStr && imagesStr.startsWith('data:image/') && (
                            <div className="flex items-center gap-3 pt-2">
                                <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-indigo-600 shadow-md flex-shrink-0">
                                    <img src={imagesStr} alt="Uploaded preview" className="w-full h-full object-cover" />
                                </div>
                                <div className="text-xs space-y-0.5">
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                        <Check className="w-3.5 h-3.5" />
                                        <span>Image loaded from system gallery</span>
                                    </span>
                                    <p className="text-slate-500 text-[10px]">Ready to post with your spot!</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Interactive Gallery Preset Picker */}
                    <div className="space-y-2 text-left bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200 dark:border-slate-750">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                            <ImageIcon className="w-4 h-4 text-indigo-500" />
                            <span>Or Choose from Curated Indore Presets</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                            {PRESET_GALLERY_IMAGES.map((preset, pIdx) => {
                                const isSelected = imagesStr === preset.url
                                return (
                                    <button
                                        type="button"
                                        key={pIdx}
                                        onClick={() => {
                                            setImagesStr(preset.url)
                                            setImageDescription(preset.title)
                                            toast.success(`Selected image: ${preset.title}`)
                                        }}
                                        className={`relative h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                                            isSelected ? 'border-indigo-600 scale-105 shadow-md ring-2 ring-indigo-500' : 'border-transparent opacity-75 hover:opacity-100'
                                        }`}
                                    >
                                        <img src={preset.url} alt={preset.title} className="w-full h-full object-cover" />
                                        <span className="absolute bottom-0 inset-x-0 bg-slate-950/70 text-white text-[9px] font-bold p-1 truncate text-center">
                                            {preset.title}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5 text-left">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Image URL / Data *</label>
                            <input
                                type="text"
                                value={imagesStr}
                                onChange={e => setImagesStr(e.target.value)}
                                required
                                placeholder="Uploaded file or image URL..."
                                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm truncate"
                            />
                        </div>
                        <div className="space-y-1.5 text-left">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Image Caption / Details</label>
                            <input
                                type="text"
                                value={imageDescription}
                                onChange={e => setImageDescription(e.target.value)}
                                placeholder="e.g. Front view of spot"
                                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5 text-left">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Location Street / Area *</label>
                            <input
                                type="text"
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                                required
                                placeholder="e.g. Rajwada Chowk, Indore"
                                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                        <div className="space-y-1.5 text-left">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Timings / Hours *</label>
                            <input
                                type="text"
                                value={openingHours}
                                onChange={e => setOpeningHours(e.target.value)}
                                required
                                placeholder="e.g. 10:00 AM - 05:00 PM"
                                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5 text-left">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Starting Price (₹) *</label>
                            <input
                                type="number"
                                min="0"
                                value={ticketPrice}
                                onChange={e => setTicketPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                required
                                placeholder="0 for Free"
                                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                        <div className="space-y-1.5 text-left">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Best Season</label>
                            <input
                                type="text"
                                value={bestTimeToVisit}
                                onChange={e => setBestTimeToVisit(e.target.value)}
                                placeholder="e.g. October to March"
                                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                        <div className="space-y-1.5 text-left">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Estimated Duration</label>
                            <input
                                type="text"
                                value={estimatedVisitDuration}
                                onChange={e => setEstimatedVisitDuration(e.target.value)}
                                placeholder="e.g. 2 hours"
                                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" isLoading={addLocationMutation.isPending}>
                            Submit Spot
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
export default Explore