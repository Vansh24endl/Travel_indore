import React from 'react'
import { Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'
import { motion } from 'framer-motion'
import { Users, Compass, Calendar, Star, DollarSign, ArrowRight, ShieldCheck, TrendingUp, Activity } from 'lucide-react'
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
        { title: 'Registered Users', value: stats?.usersCount || 0, icon: Users, color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60' },
        { title: 'Active Spots', value: stats?.destinationsCount || 0, icon: Compass, color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60' },
        { title: 'Total Booked Passes', value: stats?.bookingsCount || 0, icon: Calendar, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60' },
        { title: 'User Reviews', value: stats?.reviewsCount || 0, icon: Star, color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60' }
    ]

    return (
        <div className="space-y-8 font-sans pb-16 text-left min-w-0 max-w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                        <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 dark:text-white">Admin Operations Hub</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">Platform health analytics, user accounts, and pass reservations</p>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => {
                    const Icon = card.icon
                    return (
                        <Card key={idx} hoverable={false} className="flex items-center gap-4 p-5 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl text-left shadow-sm">
                            <div className={`p-3.5 rounded-2xl flex-shrink-0 ${card.color}`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block truncate">{card.title}</span>
                                <h3 className="text-2xl font-black font-heading text-slate-900 dark:text-white mt-0.5">{card.value}</h3>
                            </div>
                        </Card>
                    )
                })}
            </div>

            {/* Platform Visitors Interactive Chart */}
            <Card hoverable={false} className="p-6 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl text-left shadow-md">
                <ChartAreaInteractive data={stats?.chartData} />
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Card */}
                <Card hoverable={false} className="p-6 flex flex-col justify-between border border-slate-200/80 dark:border-slate-800 bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white rounded-3xl text-left shadow-xl">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-indigo-300 font-extrabold uppercase tracking-wider">Gross Booking Revenue</span>
                            <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-300">
                                <TrendingUp className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-indigo-300">₹</span>
                            <h3 className="text-4xl font-black font-heading">{stats?.totalRevenue || 0}</h3>
                        </div>
                    </div>
                    <p className="text-xs text-indigo-200/80 mt-6 leading-relaxed">
                        Calculated from all verified traveler and diner passes booked through the portal.
                    </p>
                </Card>

                {/* Management Quick Links */}
                <Card hoverable={false} className="p-6 lg:col-span-2 space-y-4 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl text-left shadow-sm">
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-150 dark:border-slate-800 pb-3 font-heading">
                        Management Controls
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link
                            to="/admin/users"
                            className="p-4 bg-slate-50 dark:bg-slate-850 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-2xl flex items-center justify-between font-extrabold text-sm text-slate-800 dark:text-slate-200 transition-all group border border-slate-200/60 dark:border-slate-800"
                        >
                            <span>Manage Users</span>
                            <ArrowRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/admin/destinations"
                            className="p-4 bg-slate-50 dark:bg-slate-850 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-2xl flex items-center justify-between font-extrabold text-sm text-slate-800 dark:text-slate-200 transition-all group border border-slate-200/60 dark:border-slate-800"
                        >
                            <span>Manage Destinations</span>
                            <ArrowRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/admin/bookings"
                            className="p-4 bg-slate-50 dark:bg-slate-850 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-2xl flex items-center justify-between font-extrabold text-sm text-slate-800 dark:text-slate-200 transition-all group border border-slate-200/60 dark:border-slate-800"
                        >
                            <span>Manage Bookings</span>
                            <ArrowRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/admin/reviews"
                            className="p-4 bg-slate-50 dark:bg-slate-850 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-2xl flex items-center justify-between font-extrabold text-sm text-slate-800 dark:text-slate-200 transition-all group border border-slate-200/60 dark:border-slate-800"
                        >
                            <span>Moderate Reviews</span>
                            <ArrowRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    )
}
export default AdminDashboard
