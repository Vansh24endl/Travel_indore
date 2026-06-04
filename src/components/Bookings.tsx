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
                    description="You don't have any bookings active. Start exploring the heritage and culture of Indore now!"
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bookings.map((booking: any) => (
                        <Card key={booking.id} className="flex flex-col justify-between h-full relative overflow-hidden border border-gray-200/50 dark:border-gray-800">
                            {/* Status strip top corner */}
                            <div className="absolute top-0 right-0 w-24 h-6 text-center text-[10px] font-bold uppercase tracking-wider leading-6 flex items-center justify-center rounded-bl-xl text-white bg-indigo-600">
                                Ticket Ref
                            </div>

                            <div className="space-y-4">
                                <div className="flex gap-4 items-start">
                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-150 flex-shrink-0">
                                        {booking.destination?.images?.[0] ? (
                                            <img src={booking.destination.images[0]} alt={booking.destination.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-200"><Compass className="text-gray-400" /></div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-lg text-gray-900 dark:text-white">{booking.destination?.title || 'Unknown Destination'}</h4>
                                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs mt-1">
                                            <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                                            <span>{booking.destination?.location || 'Indore'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-100 dark:border-gray-800 py-3 text-sm">
                                    <div className="flex items-center gap-2 text-gray-650 dark:text-gray-300">
                                        <Calendar className="w-4 h-4 text-indigo-500" />
                                        <span>{booking.bookingDate}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-650 dark:text-gray-300">
                                        <Users className="w-4 h-4 text-indigo-500" />
                                        <span>{booking.numberOfPersons} Travelers</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-between gap-4">
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Total Paid</span>
                                    <span className="font-black text-xl text-indigo-650 dark:text-indigo-400">₹{booking.totalAmount}</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1.5 text-xs font-bold rounded-xl uppercase tracking-wider ${
                                        booking.bookingStatus === 'confirmed'
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : booking.bookingStatus === 'cancelled'
                                            ? 'bg-rose-100 text-rose-800'
                                            : 'bg-amber-100 text-amber-800'
                                    }`}>
                                        {booking.bookingStatus}
                                    </span>

                                    {booking.bookingStatus === 'confirmed' && (
                                        <button
                                            onClick={() => cancelMutation.mutate(booking.id)}
                                            className="p-2 border border-rose-200 hover:border-transparent text-rose-500 hover:bg-rose-55 rounded-xl transition-all"
                                            title="Cancel Ticket"
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