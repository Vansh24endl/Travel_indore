import React, { useState } from 'react'
import { Link } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/services/api'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Star, MapPin, SlidersHorizontal, Compass, Plus } from 'lucide-react'
import { toast } from 'sonner'
import Card from './ui/Card'
import Loader from './ui/Loader'
import EmptyState from './ui/EmptyState'
import Modal from './ui/Modal'
import Button from './ui/Button'

export function Explore() {
    const queryClient = useQueryClient()
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
    const [latitude, setLatitude] = useState<number | ''>(22.7187) // Default Indore Coordinates
    const [longitude, setLongitude] = useState<number | ''>(75.8578)
    const [openingHours, setOpeningHours] = useState('')
    const [ticketPrice, setTicketPrice] = useState<number | ''>(0)
    const [bestTimeToVisit, setBestTimeToVisit] = useState('')
    const [estimatedVisitDuration, setEstimatedVisitDuration] = useState('')

    // Fetch destinations
    const { data: destinations = [], isLoading } = useQuery({
        queryKey: ['destinationsList'],
        queryFn: async () => {
            const res = await api.get('/api/destinations')
            return res.data.destinations || []
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
            setStartingPrice('₹0')
            setBestTimeToVisit('')
            setEstimatedVisitDuration('')
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to post new location')
        }
    })

    const handlePostSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim() || !description.trim() || !location.trim() || !openingHours.trim() || ticketPrice === '' || startingPrice === '' || latitude === '' || longitude === '') {
            toast.error('Please fill out all required fields')
            return
        }

        const imagesArray = imagesStr.split(',').map(s => s.trim()).filter(Boolean)
        if (imagesArray.length === 0) {
            toast.error('Please provide at least one valid image URL')
            return
        }

        addLocationMutation.mutate({
            title,
            description,
            category,
            images: imagesArray,
            imageDescription,
            location,
            latitude: Number(latitude),
            longitude: Number(longitude),
            openingHours,
            ticketPrice: Number(ticketPrice),
            startingPrice: startingPrice.trim() || '₹0',
            bestTimeToVisit: bestTimeToVisit.trim() || 'October to March',
            estimatedVisitDuration: estimatedVisitDuration.trim() || '2 hours'
        })
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader size="lg" />
            </div>
        )
    }

    // Categories list
    const categories = [
        { id: 'all', label: 'All Places' },
        { id: 'heritage', label: 'Heritage' },
        { id: 'food', label: 'Food Street' },
        { id: 'spiritual', label: 'Spiritual' },
        { id: 'nature', label: 'Nature/Parks' },
        { id: 'shopping', label: 'Shopping' }
    ]

    // Filtering logic
    const filteredDestinations = destinations
        .filter((dest: any) => {
            const matchesSearch = dest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 dest.location.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesCategory = selectedCategory === 'all' || dest.category === selectedCategory
            const matchesPrice = dest.ticketPrice <= maxPrice
            const matchesStartingPrice = dest.startingPrice <= maxPrice
            const matchesRating = dest.rating >= minRating
            return matchesSearch && matchesCategory && matchesPrice && matchesRating
        })
        .sort((a: any, b: any) => {
            if (sortBy === 'rating') return b.rating - a.rating
            if(sortBy === 'startingPriceLow') return a.startingPrice - b.startingPrice
            if(sortBy === 'startingPriceHigh') return b.startingPrice - a.startingPrice
            if (sortBy === 'priceLow') return a.ticketPrice - b.ticketPrice
            if (sortBy === 'priceHigh') return b.ticketPrice - a.ticketPrice
            if (sortBy === 'reviews') return b.reviewsCount - a.reviewsCount
            return 0 // default
        })

    return (
        <div className="space-y-8 font-sans pb-16">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white">Explore Indore</h2>
                    <p className="text-gray-550 dark:text-gray-400 text-sm">Find historic monuments, delicious street food, and holy temples</p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <Button 
                        onClick={() => setIsAddModalOpen(true)}
                        variant="primary"
                        className="font-bold flex items-center justify-center gap-2 whitespace-nowrap text-xs py-2.5"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Post Location</span>
                    </Button>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search attractions..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white shadow-sm text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Category horizontal bar */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all duration-300 ${
                            selectedCategory === cat.id
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Filters Toggler & Sorter */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-b border-gray-200/60 dark:border-gray-800 py-4">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 font-bold text-sm text-gray-750 dark:text-gray-355 hover:bg-gray-50"
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>Filters</span>
                </button>

                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Sort By</span>
                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                        className="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 bg-white dark:bg-gray-800 text-sm font-semibold text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="default">Default</option>
                        <option value="rating">Top Rated</option>
                        <option value="priceLow">Price: Low to High</option>
                        <option value="priceHigh">Price: High to Low</option>
                        <option value="reviews">Popularity</option>
                    </select>
                </div>
            </div>

            {/* Expandable Advanced Filters */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-white/40 dark:bg-gray-855/50 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-800 p-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Price range */}
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm font-bold text-gray-800 dark:text-gray-300">
                                    <span>Max Entry Fee</span>
                                    <span>{maxPrice === 0 ? 'Free' : `₹${maxPrice}`}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="500"
                                    step="10"
                                    value={maxPrice}
                                    onChange={e => setMaxPrice(Number(e.target.value))}
                                    className="w-full accent-indigo-600 h-2 bg-gray-200 rounded-lg cursor-pointer"
                                />
                                <div className="flex justify-between text-xs text-gray-550">
                                    <span>₹0</span>
                                    <span>₹500</span>
                                </div>
                            </div>

                            {/* Min Rating */}
                            <div className="space-y-3">
                                <label className="block text-sm font-bold text-gray-800 dark:text-gray-300">Minimum Rating</label>
                                <div className="flex gap-2">
                                    {[0, 3, 4, 4.5].map(rating => (
                                        <button
                                            key={rating}
                                            onClick={() => setMinRating(rating)}
                                            className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all duration-300 ${
                                                minRating === rating
                                                    ? 'bg-indigo-600 text-white border-transparent'
                                                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            {rating === 0 ? 'Any' : `${rating}★ & Above`}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Destinations Grid */}
            {filteredDestinations.length === 0 ? (
                <EmptyState
                    title="No destinations found"
                    description="Try modifying your filters, search term, or select another category."
                    action={
                        <button
                            onClick={() => {
                                setSearchTerm('')
                                setSelectedCategory('all')
                                setMaxPrice(500)
                                setMinRating(0)
                                setSortBy('default')
                            }}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors"
                        >
                            Reset All Filters
                        </button>
                    }
                />
            ) : (
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {filteredDestinations.map((dest: any) => (
                        <Card key={dest._id || dest.id} className="overflow-hidden p-0 group flex flex-col justify-between border border-gray-200/40 dark:border-gray-800/80">
                            <div>
                                <div className="h-56 overflow-hidden relative">
                                    {dest.images?.[0] ? (
                                        <img
                                            src={dest.images[0]}
                                            alt={dest.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                                            <Compass className="w-10 h-10 animate-spin-slow" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 text-amber-500 font-bold text-sm">
                                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                                        <span>{dest.rating}</span>
                                    </div>
                                    <span className="absolute bottom-4 left-4 bg-indigo-600/90 backdrop-blur-md text-white font-bold text-xs px-3 py-1.5 rounded-xl uppercase tracking-wider">
                                        {dest.category}
                                    </span>
                                </div>

                                <div className="p-6 space-y-3">
                                    <h4 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1">{dest.title}</h4>
                                    <p className="text-sm text-gray-550 dark:text-gray-400 line-clamp-2">{dest.description}</p>
                                </div>
                            </div>

                            <div className="p-6 pt-0 border-t border-gray-150/40 dark:border-gray-800 mt-4 flex items-center justify-between">
                                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                    <MapPin className="w-4 h-4 text-indigo-500" />
                                    <span className="truncate max-w-[120px]">{dest.location}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-extrabold text-indigo-650 dark:text-indigo-400 text-base">
                                        {dest.ticketPrice === 0 ? 'Free' : `₹${dest.ticketPrice}`}
                                    </span>
                                    <Link
                                        to={`/destination/${dest._id || dest.id}`}
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-indigo-500/20 transition-all duration-300"
                                    >
                                        Details
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    ))}
                </motion.div>
            )}

            {/* Post Location Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Post New Location / Attraction Details"
                size="lg"
            >
                <form onSubmit={handlePostSubmit} className="space-y-4 font-sans max-h-[75vh] overflow-y-auto px-1 scrollbar-none">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-550 dark:text-gray-400 uppercase tracking-wider">Spot Title *</label>
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                required
                                placeholder="e.g. Rajwada Palace"
                                className="w-full px-4 py-2.5 border border-gray-250 dark:border-gray-700 dark:bg-gray-850 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-550 dark:text-gray-400 uppercase tracking-wider">Category *</label>
                            <select
                                value={category}
                                onChange={e => setCategory(e.target.value as any)}
                                className="w-full px-4 py-2.5 border border-gray-250 dark:border-gray-700 dark:bg-gray-850 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm cursor-pointer"
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

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-550 dark:text-gray-400 uppercase tracking-wider">Spot Description *</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                            rows={3}
                            placeholder="Provide a brief history or description about the destination..."
                            className="w-full p-3.5 border border-gray-250 dark:border-gray-700 dark:bg-gray-850 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-550 dark:text-gray-400 uppercase tracking-wider">Image URLs (comma separated) *</label>
                            <input
                                type="text"
                                value={imagesStr}
                                onChange={e => setImagesStr(e.target.value)}
                                required
                                placeholder="https://example.com/image.jpg"
                                className="w-full px-4 py-2.5 border border-gray-250 dark:border-gray-700 dark:bg-gray-855 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-550 dark:text-gray-400 uppercase tracking-wider">Image Details / Description</label>
                            <input
                                type="text"
                                value={imageDescription}
                                onChange={e => setImageDescription(e.target.value)}
                                placeholder="e.g. Front elevation of the palace illuminated at night"
                                className="w-full px-4 py-2.5 border border-gray-250 dark:border-gray-700 dark:bg-gray-855 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-550 dark:text-gray-400 uppercase tracking-wider">Location / Area *</label>
                            <input
                                type="text"
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                                required
                                placeholder="e.g. MG Road, Indore"
                                className="w-full px-4 py-2.5 border border-gray-250 dark:border-gray-700 dark:bg-gray-855 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-550 dark:text-gray-400 uppercase tracking-wider">Latitude *</label>
                            <input
                                type="number"
                                step="0.0001"
                                value={latitude}
                                onChange={e => setLatitude(e.target.value !== '' ? Number(e.target.value) : '')}
                                required
                                placeholder="22.7187"
                                className="w-full px-4 py-2.5 border border-gray-250 dark:border-gray-700 dark:bg-gray-855 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-550 dark:text-gray-400 uppercase tracking-wider">Longitude *</label>
                            <input
                                type="number"
                                step="0.0001"
                                value={longitude}
                                onChange={e => setLongitude(e.target.value !== '' ? Number(e.target.value) : '')}
                                required
                                placeholder="75.8578"
                                className="w-full px-4 py-2.5 border border-gray-250 dark:border-gray-700 dark:bg-gray-855 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-550 dark:text-gray-400 uppercase tracking-wider">Opening Hours *</label>
                            <input
                                type="text"
                                value={openingHours}
                                onChange={e => setOpeningHours(e.target.value)}
                                required
                                placeholder="e.g. 10:00 AM - 05:00 PM"
                                className="w-full px-4 py-2.5 border border-gray-250 dark:border-gray-700 dark:bg-gray-855 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-550 dark:text-gray-400 uppercase tracking-wider">Entry Ticket Price (INR) *</label>
                            <input
                                type="number"
                                value={ticketPrice}
                                onChange={e => setTicketPrice(e.target.value !== '' ? Number(e.target.value) : '')}
                                required
                                placeholder="0 for Free entry"
                                className="w-full px-4 py-2.5 border border-gray-250 dark:border-gray-700 dark:bg-gray-855 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-550 dark:text-gray-400 uppercase tracking-wider">Best Season to Visit</label>
                            <input
                                type="text"
                                value={bestTimeToVisit}
                                onChange={e => setBestTimeToVisit(e.target.value)}
                                placeholder="e.g. October to March"
                                className="w-full px-4 py-2.5 border border-gray-250 dark:border-gray-700 dark:bg-gray-855 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-550 dark:text-gray-400 uppercase tracking-wider">Estimated Tour Duration</label>
                            <input
                                type="text"
                                value={estimatedVisitDuration}
                                onChange={e => setEstimatedVisitDuration(e.target.value)}
                                placeholder="e.g. 2 hours"
                                className="w-full px-4 py-2.5 border border-gray-250 dark:border-gray-700 dark:bg-gray-855 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsAddModalOpen(false)}
                            className="text-xs"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={addLocationMutation.isPending}
                            className="text-xs"
                        >
                            Post Location Details
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
export default Explore