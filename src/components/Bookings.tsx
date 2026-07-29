import React from 'react'
import { Link } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/services/api'
import { motion } from 'framer-motion'
import { Compass, Calendar, Users, MapPin, XCircle, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import Card from './ui/Card'
import Loader from './ui/Loader'
import EmptyState from './ui/EmptyState'
import Button from './ui/Button'
import { getCategoryReceiptTitle, getCategoryBadgeStyle, getCategoryVisitorLabel } from '@/lib/categoryHelpers'

export function Bookings() {
    const queryClient = useQueryClient()

    // Fetch user bookings
    const { data: bookings = [], isLoading } = useQuery({
        queryKey: ['myBookingsList'],
        queryFn: async () => {
            const res = await api.get('/api/bookings/my')
            return res.data.bookings || []
        }
    })

    // Cancel booking mutation
    const cancelMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await api.post(`/api/bookings/${id}/cancel`)
            return res.data
        },
        onSuccess: () => {
            toast.success('Booking cancelled successfully')
            queryClient.invalidateQueries({ queryKey: ['myBookingsList'] })
        },
        onError: () => {
            toast.error('Failed to cancel booking')
        }
    })

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader size="lg" />
            </div>
        )
    }

    return (
        <div className="space-y-8 font-sans pb-16">
            <div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white">My Travel Bookings</h2>
                <p className="text-gray-550 dark:text-gray-400 text-sm">Manage your upcoming destinations tickets and receipts</p>
            </div>

            {bookings.length === 0 ? (
                <EmptyState
                    title="No bookings yet"
                    description="You don't have any travel passes active. Start exploring food streets, heritage spots, and markets in Indore now!"
                    action={
                        <Link
                            to="/explore"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all"
                        >
                            <span>Find Places to Visit</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    }
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    {bookings.map((booking: any) => (
                        <Card key={booking.id} className="flex flex-col justify-between h-full relative overflow-hidden border border-gray-200/60 dark:border-gray-800 text-left p-6 space-y-4">
                            
                            {/* Card Header & Badge */}
                            <div className="flex justify-between items-start border-b border-gray-150 dark:border-gray-800 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-150 flex-shrink-0">
                                        {booking.destination?.images?.[0] ? (
                                            <img src={booking.destination.images[0]} alt={booking.destination.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-200"><Compass className="text-gray-400" /></div>
                                        )}
                                    </div>
                                    <div className="space-y-1 text-left min-w-0 flex-1 overflow-hidden">
                                        <h4 className="font-extrabold text-base sm:text-lg text-gray-900 dark:text-white truncate">
                                            {booking.destination?.title || 'Attraction Visit'}
                                        </h4>
                                        <div className="flex items-center gap-2 text-xs min-w-0">
                                            <span className={`font-bold text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider flex-shrink-0 ${getCategoryBadgeStyle(booking.destination?.category)}`}>
                                                {booking.destination?.category || 'visit'}
                                            </span>
                                            <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400 truncate min-w-0">
                                                <MapPin className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                                                <span className="truncate">{booking.destination?.location || 'Indore'}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <span className={`px-2.5 py-1 text-[10px] font-bold rounded-xl uppercase tracking-wider flex-shrink-0 ${
                                    booking.bookingStatus === 'confirmed'
                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                        : booking.bookingStatus === 'cancelled'
                                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                }`}>
                                    {booking.bookingStatus}
                                </span>
                            </div>

                            <div className="space-y-3 text-left">
                                <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/60 p-3.5 rounded-2xl border border-gray-150 dark:border-gray-800 text-xs font-semibold">
                                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                        <Calendar className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                                        <span>{booking.bookingDate}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                        <Users className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                                        <span>{booking.numberOfPersons} {getCategoryVisitorLabel(booking.destination?.category).replace(' Count', '')}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2 border-t border-gray-150 dark:border-gray-800 flex items-center justify-between gap-4">
                                <div className="flex flex-col text-left">
                                    <span className="text-[10px] uppercase font-bold text-gray-450 dark:text-gray-400">Total Paid</span>
                                    <span className="font-black text-xl text-indigo-600 dark:text-indigo-400">₹{booking.totalAmount}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Link
                                        to={`/booking/${booking.id}`}
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                                    >
                                        View Receipt
                                    </Link>
                                    {booking.bookingStatus === 'confirmed' && (
                                        <button
                                            onClick={() => cancelMutation.mutate(booking.id)}
                                            className="p-2 border border-rose-200 hover:border-transparent text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all cursor-pointer"
                                            title="Cancel Pass"
                                        >
                                            <XCircle className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
export default Bookings