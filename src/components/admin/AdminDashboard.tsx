import React from 'react'
import { Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'
import { motion } from 'framer-motion'
import { Users, Compass, Calendar, Star, DollarSign, ArrowRight, ShieldCheck } from 'lucide-react'
import Card from '../ui/Card'
import Loader from '../ui/Loader'
import { ChartAreaInteractive } from './ChartAreaInteractive'

export function AdminDashboard() {
    // Fetch stats
    const { data: stats, isLoading } = useQuery({
        queryKey: ['adminStats'],
        queryFn: async () => {
            const res = await api.get('/api/admin/stats')
            return res.data.stats
        }
    })

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader size="lg" />
            </div>
        )
    }

    const cards = [
        { title: 'Registered Users', value: stats?.usersCount || 0, icon: Users, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20' },
        { title: 'Active Destinations', value: stats?.destinationsCount || 0, icon: Compass, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20' },
        { title: 'Total Bookings', value: stats?.bookingsCount || 0, icon: Calendar, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' },
        { title: 'User Reviews', value: stats?.reviewsCount || 0, icon: Star, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20' }
    ]

    return (
        <div className="space-y-8 font-sans pb-16">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white">Admin Management</h2>
                        <p className="text-gray-550 dark:text-gray-400 text-sm">Monitor platform metrics, user access, and travel bookings</p>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => {
                    const Icon = card.icon
                    return (
                        <Card key={idx} hoverable={false} className="flex items-center gap-4">
                            <div className={`p-4 rounded-xl ${card.color}`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{card.title}</span>
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white">{card.value}</h3>
                            </div>
                        </Card>
                    )
                })}
            </div>

            <ChartAreaInteractive data={stats?.chartData} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card hoverable={false} className="flex flex-col justify-between border border-indigo-500/10">
                    <div className="space-y-2">
                        <span className="text-xs text-gray-550 dark:text-gray-400 font-bold uppercase tracking-wider">Gross Booking Revenue</span>
                        <div className="flex items-center gap-1.5 text-indigo-650 dark:text-indigo-400">
                            <span className="text-2xl font-black">₹</span>
                            <h3 className="text-3xl font-black">{stats?.totalRevenue || 0}</h3>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 leading-relaxed">
                        Calculated from all confirmed traveler tickets booked through the portal.
                    </p>
                </Card>

                <Card hoverable={false} className="lg:col-span-2 space-y-4">
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 pb-2">
                        Management Links
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                        <Link
                            to="/admin/users"
                            className="p-4 bg-gray-50 dark:bg-gray-850 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 rounded-2xl flex items-center justify-between font-bold text-sm text-gray-700 dark:text-gray-300 transition-all group"
                        >
                            <span>Manage Users</span>
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/admin/destinations"
                            className="p-4 bg-gray-50 dark:bg-gray-850 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 rounded-2xl flex items-center justify-between font-bold text-sm text-gray-700 dark:text-gray-300 transition-all group"
                        >
                            <span>Manage Destinations</span>
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/admin/bookings"
                            className="p-4 bg-gray-50 dark:bg-gray-850 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 rounded-2xl flex items-center justify-between font-bold text-sm text-gray-700 dark:text-gray-300 transition-all group"
                        >
                            <span>Manage Bookings</span>
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/admin/reviews"
                            className="p-4 bg-gray-50 dark:bg-gray-850 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 rounded-2xl flex items-center justify-between font-bold text-sm text-gray-700 dark:text-gray-300 transition-all group"
                        >
                            <span>Moderate Reviews</span>
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    )
}
export default AdminDashboard

