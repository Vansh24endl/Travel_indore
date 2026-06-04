import React from 'react'
import { Navigate, Outlet } from 'react-router'
import { useAuth } from '@/hooks/useAuth'

export const AdminRoute: React.FC = () => {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    if (!user || user.role !== 'admin') {
        return <Navigate to="/dashboard" replace />
    }

    return <Outlet />
}
