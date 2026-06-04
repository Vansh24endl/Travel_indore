import React, { useState } from 'react'
import { Link } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/services/api'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, ArrowLeft, Image } from 'lucide-react'
import { toast } from 'sonner'
import Card from '../ui/Card'
import Loader from '../ui/Loader'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import type { Destination, LocationCategory } from '@/Data/types'

export function AdminDestinations() {
    const queryClient = useQueryClient()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingDest, setEditingDest] = useState<any | null>(null)

    // Form fields
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState<LocationCategory>('heritage')
    const [imagesStr, setImagesStr] = useState('')
    const [location, setLocation] = useState('')
    const [latitude, setLatitude] = useState(22.7187)
    const [longitude, setLongitude] = useState(75.8578)
    const [openingHours, setOpeningHours] = useState('')
    const [ticketPrice, setTicketPrice] = useState(0)

    const [isSaving, setIsSaving] = useState(false)

    // Fetch destinations
    const { data: destinations = [], isLoading } = useQuery({
        queryKey: ['adminDestinationsList'],
        queryFn: async () => {
            const res = await api.get('/api/destinations')
            return res.data.destinations || []
        }
    })

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await api.delete(`/api/destinations/${id}`)
            return res.data
        },
        onSuccess: () => {
            toast.success('Destination deleted successfully')
            queryClient.invalidateQueries({ queryKey: ['adminDestinationsList'] })
        },
        onError: () => {
            toast.error('Failed to delete destination')
        }
    })

    const openAddModal = () => {
        setEditingDest(null)
        setTitle('')
        setDescription('')
        setCategory('heritage')
        setImagesStr('')
        setLocation('')
        setLatitude(22.7187)
        setLongitude(75.8578)
        setOpeningHours('')
        setTicketPrice(0)
        setIsModalOpen(true)
    }

    const openEditModal = (dest: any) => {
        setEditingDest(dest)
        setTitle(dest.title)
        setDescription(dest.description)
        setCategory(dest.category)
        setImagesStr(dest.images.join(', '))
        setLocation(dest.location)
        setLatitude(dest.latitude)
        setLongitude(dest.longitude)
        setOpeningHours(dest.openingHours)
        setTicketPrice(dest.ticketPrice)
        setIsModalOpen(true)
    }

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim() || !description.trim() || !location.trim() || !openingHours.trim()) {
            toast.error('Please fill out all mandatory fields')
            return
        }

        const imagesArray = imagesStr.split(',').map(s => s.trim()).filter(Boolean)
        if (imagesArray.length === 0) {
            toast.error('Please provide at least one image URL')
            return
        }

        const payload = {
            title,
            description,
            category,
            images: imagesArray,
            location,
            latitude,
            longitude,
            openingHours,
            ticketPrice
        }

        setIsSaving(true)
        try {
            if (editingDest) {
                // Update
                const res = await api.put(`/api/destinations/${editingDest._id || editingDest.id}`, payload)
                if (res.data.ok) {
                    toast.success('Destination updated')
                }
            } else {
                // Add
                const res = await api.post('/api/destinations', payload)
                if (res.data.ok) {
                    toast.success('New destination created')
                }
            }
            setIsModalOpen(false)
            queryClient.invalidateQueries({ queryKey: ['adminDestinationsList'] })
        } catch (error) {
            toast.error('Failed to save destination')
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader size="lg" />
            </div>
        )
    }

    return (
        <div className="space-y-8 font-sans pb-16">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Link to="/admin" className="p-2.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-55 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </Link>
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white">Manage Destinations</h2>
                        <p className="text-gray-550 dark:text-gray-400 text-sm">Add tourist spots, update ticket details, or toggle location maps</p>
                    </div>
                </div>

                <Button onClick={openAddModal} variant="primary" className="text-sm font-bold">
                    <Plus className="w-5 h-5 mr-1.5" />
                    <span>Add Spot</span>
                </Button>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {destinations.map((dest: any) => (
                    <Card key={dest._id || dest.id} className="overflow-hidden p-0 group flex flex-col justify-between">
                        <div>
                            <div className="h-44 overflow-hidden relative">
                                {dest.images?.[0] ? (
                                    <img src={dest.images[0]} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gray-150 flex items-center justify-center text-gray-400"><Image /></div>
                                )}
                                <span className="absolute top-4 left-4 bg-indigo-600/90 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg uppercase tracking-wider">
                                    {dest.category}
                                </span>
                            </div>
                            <div className="p-5 space-y-2">
                                <h4 className="font-extrabold text-lg text-gray-900 dark:text-white line-clamp-1">{dest.title}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{dest.description}</p>
                            </div>
                        </div>

                        <div className="p-5 pt-0 border-t border-gray-100 dark:border-gray-800 mt-4 flex justify-between items-center">
                            <span className="font-extrabold text-sm text-indigo-650 dark:text-indigo-400">
                                {dest.ticketPrice === 0 ? 'Free' : `₹${dest.ticketPrice}`}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEditModal(dest)}
                                    className="p-2 border border-gray-250 dark:border-gray-700 rounded-xl text-gray-650 dark:text-gray-300 hover:bg-gray-50"
                                    title="Edit Spot"
                                >
                                    <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => {
                                        if (window.confirm(`Are you sure you want to delete ${dest.title}?`)) {
                                            deleteMutation.mutate(dest._id || dest.id)
                                        }
                                    }}
                                    className="p-2 border border-rose-100 rounded-xl text-rose-500 hover:bg-rose-55"
                                    title="Delete Spot"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Creation / Editing Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingDest ? 'Edit Destination' : 'Add New Destination'}
                size="lg"
            >
                <form onSubmit={handleFormSubmit} className="space-y-4 font-sans">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-550 dark:text-gray-400 uppercase tracking-wider">Spot Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-550 dark:text-gray-400 uppercase tracking-wider">Category</label>
                            <select
                                value={category}
                                onChange={e => setCategory(e.target.value as LocationCategory)}
                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            >
                                <option value="heritage">Heritage</option>
                                <option value="food">Food</option>
                                <option value="nature">Nature</option>
                                <option value="spiritual">Spiritual</option>
                                <option value="shopping">Shopping</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-550 dark:text-gray-400 uppercase tracking-wider">Description</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                            rows={3}
                            className="w-full p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-550 dark:text-gray-400 uppercase tracking-wider">Image URLs (comma separated)</label>
                        <input
                            type="text"
                            value={imagesStr}
                            onChange={e => setImagesStr(e.target.value)}
                            placeholder="https://image1.jpg, https://image2.jpg"
                            required
                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-550 dark:text-gray-400 uppercase tracking-wider">Location / Area</label>
                            <input
                                type="text"
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-550 dark:text-gray-400 uppercase tracking-wider">Latitude</label>
                            <input
                                type="number"
                                step="0.0001"
                                value={latitude}
                                onChange={e => setLatitude(Number(e.target.value))}
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-550 dark:text-gray-400 uppercase tracking-wider">Longitude</label>
                            <input
                                type="number"
                                step="0.0001"
                                value={longitude}
                                onChange={e => setLongitude(Number(e.target.value))}
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-550 dark:text-gray-400 uppercase tracking-wider">Opening Hours</label>
                            <input
                                type="text"
                                value={openingHours}
                                onChange={e => setOpeningHours(e.target.value)}
                                placeholder="10:00 AM - 05:00 PM"
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-550 dark:text-gray-400 uppercase tracking-wider">Ticket Price (INR)</label>
                            <input
                                type="number"
                                value={ticketPrice}
                                onChange={e => setTicketPrice(Number(e.target.value))}
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={isSaving}
                        >
                            Save Spot
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
export default AdminDestinations
