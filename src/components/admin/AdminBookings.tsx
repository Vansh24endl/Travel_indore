import React from 'react'
import { Link } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/services/api'
import { motion } from 'framer-motion'
import { Calendar, Trash2, ArrowLeft, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import Card from '../ui/Card'
import Loader from '../ui/Loader'

export function AdminBookings() {
    const queryClient = useQueryClient()

    // Fetch all bookings
    const { data: bookings = [], isLoading } = useQuery({
        queryKey: ['adminBookingsList'],
        queryFn: async () => {
            const res = await api.get('/api/admin/bookings')
            return res.data.bookings || []
        }
    })

    // Update booking status mutation
    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: 'pending' | 'confirmed' | 'cancelled' }) => {
            const res = await api.put(`/api/admin/bookings/${id}/status`, { status })
            return res.data
        },
        onSuccess: () => {
            toast.success('Booking status updated')
            queryClient.invalidateQueries({ queryKey: ['adminBookingsList'] })
        },
        onError: () => {
            toast.error('Failed to update status')
        }
    })

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
            <div className="flex items-center gap-4">
                <Link to="/admin" className="p-2.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-55 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white">Manage Bookings</h2>
                    <p className="text-gray-550 dark:text-gray-400 text-sm">Review travel bookings, verify payments, and change ticket statuses</p>
                </div>
            </div>

            {/* List */}
            <Card hoverable={false} className="overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <th className="px-6 py-4">User Details</th>
                                <th className="px-6 py-4">Destination</th>
                                <th className="px-6 py-4">Booking Info</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                            {bookings.map((booking: any) => (
                                <tr key={booking.id} className="hover:bg-gray-55/50 dark:hover:bg-gray-800/10">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-900 dark:text-white">{booking.user?.fullname || 'Unknown'}</p>
                                        <p className="text-xs text-gray-400">{booking.user?.email}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-800 dark:text-gray-300">{booking.destination?.title || 'Unknown Spot'}</p>
                                        <p className="text-xs text-gray-500">{booking.destination?.location}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-gray-750 dark:text-gray-200">{booking.bookingDate}</p>
                                        <p className="text-xs text-gray-500">{booking.numberOfPersons} Traveler(s)</p>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-indigo-650 dark:text-indigo-400">
                                        ₹{booking.totalAmount}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 text-xs font-bold rounded-lg uppercase tracking-wider ${
                                            booking.bookingStatus === 'confirmed'
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : booking.bookingStatus === 'cancelled'
                                                ? 'bg-rose-100 text-rose-800'
                                                : 'bg-amber-100 text-amber-800'
                                        }`}>
                                            {booking.bookingStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {booking.bookingStatus !== 'confirmed' && (
                                                <button
                                                    onClick={() => updateStatusMutation.mutate({ id: booking.id, status: 'confirmed' })}
                                                    className="p-1.5 border border-emerald-250 rounded-lg text-emerald-600 hover:bg-emerald-50"
                                                    title="Confirm Booking"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                            )}
                                            {booking.bookingStatus !== 'cancelled' && (
                                                <button
                                                    onClick={() => updateStatusMutation.mutate({ id: booking.id, status: 'cancelled' })}
                                                    className="p-1.5 border border-rose-205 rounded-lg text-rose-600 hover:bg-rose-50"
                                                    title="Cancel Booking"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}
export default AdminBookings
