import React from 'react'
import { Link } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/services/api'
import { Star, Trash2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import Card from '../ui/Card'
import Loader from '../ui/Loader'

export function AdminReviews() {
    const queryClient = useQueryClient()

    // Fetch all reviews
    const { data: reviews = [], isLoading } = useQuery({
        queryKey: ['adminReviewsList'],
        queryFn: async () => {
            const res = await api.get('/api/admin/reviews')
            return res.data.reviews || []
        }
    })

    // Delete review mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await api.delete(`/api/admin/reviews/${id}`)
            return res.data
        },
        onSuccess: () => {
            toast.success('Review deleted successfully')
            queryClient.invalidateQueries({ queryKey: ['adminReviewsList'] })
        },
        onError: () => {
            toast.error('Failed to delete review')
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
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white">Moderate Reviews</h2>
                    <p className="text-gray-550 dark:text-gray-400 text-sm">Monitor public visitor feedback, edit ratings, or moderate comments</p>
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
                                <th className="px-6 py-4">Comment</th>
                                <th className="px-6 py-4">Rating</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                            {reviews.map((rev: any) => (
                                <tr key={rev.id} className="hover:bg-gray-55/50 dark:hover:bg-gray-800/10">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-900 dark:text-white">{rev.user?.fullname || 'Unknown'}</p>
                                        <p className="text-xs text-gray-400">{rev.user?.email}</p>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-800 dark:text-gray-300">
                                        {rev.destination?.title || 'Unknown Spot'}
                                    </td>
                                    <td className="px-6 py-4 max-w-xs truncate text-gray-650 dark:text-gray-400">
                                        {rev.comment}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <Star key={s} className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`} />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => {
                                                if (window.confirm('Are you sure you want to delete this review?')) {
                                                    deleteMutation.mutate(rev.id)
                                                }
                                            }}
                                            className="p-2 border border-rose-100 rounded-xl text-rose-500 hover:bg-rose-55"
                                            title="Delete Review"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
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
export default AdminReviews
