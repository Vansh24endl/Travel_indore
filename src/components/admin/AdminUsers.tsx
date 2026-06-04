import React from 'react'
import { Link } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/services/api'
import { motion } from 'framer-motion'
import { Users, Trash2, ShieldAlert, ArrowLeft, ToggleLeft, ToggleRight } from 'lucide-react'
import { toast } from 'sonner'
import Card from '../ui/Card'
import Loader from '../ui/Loader'

export function AdminUsers() {
    const queryClient = useQueryClient()

    // Fetch users
    const { data: users = [], isLoading } = useQuery({
        queryKey: ['adminUsersList'],
        queryFn: async () => {
            const res = await api.get('/api/admin/users')
            return res.data.users || []
        }
    })

    // Update role mutation
    const updateRoleMutation = useMutation({
        mutationFn: async ({ id, role }: { id: string; role: 'user' | 'admin' }) => {
            const res = await api.put(`/api/admin/users/${id}/role`, { role })
            return res.data
        },
        onSuccess: () => {
            toast.success('User role updated')
            queryClient.invalidateQueries({ queryKey: ['adminUsersList'] })
        },
        onError: () => {
            toast.error('Failed to update role')
        }
    })

    // Delete user mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await api.delete(`/api/admin/users/${id}`)
            return res.data
        },
        onSuccess: () => {
            toast.success('User deleted successfully')
            queryClient.invalidateQueries({ queryKey: ['adminUsersList'] })
        },
        onError: () => {
            toast.error('Failed to delete user')
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
                <Link to="/admin" className="p-2.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white">Manage Users</h2>
                    <p className="text-gray-550 dark:text-gray-400 text-sm">Grant admin access, monitor active credentials, or suspend accounts</p>
                </div>
            </div>

            {/* Users List Card */}
            <Card hoverable={false} className="overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <th className="px-6 py-4">User Details</th>
                                <th className="px-6 py-4">Contact Info</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                            {users.map((usr: any) => (
                                <tr key={usr.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/10">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {usr.profileImage ? (
                                                <img src={usr.profileImage} alt="" className="w-10 h-10 rounded-full" />
                                            ) : (
                                                <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center font-bold text-indigo-600">
                                                    {usr.fullname.substring(0, 2).toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white">{usr.fullname}</p>
                                                <p className="text-xs text-gray-400">ID: #{usr.id.substring(18)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-gray-800 dark:text-gray-300 font-medium">{usr.email}</p>
                                        <p className="text-xs text-gray-500">{usr.phone}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 text-xs font-bold rounded-lg uppercase tracking-wider ${
                                            usr.role === 'admin'
                                                ? 'bg-amber-100 text-amber-800'
                                                : 'bg-indigo-100 text-indigo-800'
                                        }`}>
                                            {usr.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            {/* Role Toggle Button */}
                                            <button
                                                onClick={() => updateRoleMutation.mutate({
                                                    id: usr.id,
                                                    role: usr.role === 'admin' ? 'user' : 'admin'
                                                })}
                                                className="p-2 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 text-gray-500 dark:text-gray-300"
                                                title="Toggle User Role"
                                            >
                                                {usr.role === 'admin' ? <ToggleRight className="w-5 h-5 text-indigo-600" /> : <ToggleLeft className="w-5 h-5" />}
                                            </button>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => {
                                                    if (window.confirm(`Are you sure you want to delete ${usr.fullname}?`)) {
                                                        deleteMutation.mutate(usr.id)
                                                    }
                                                }}
                                                className="p-2 border border-rose-100 rounded-xl text-rose-500 hover:bg-rose-55"
                                                title="Delete Account"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
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
export default AdminUsers
