import React, { createContext, useState, useEffect } from 'react'
import api from '@/services/api'
import type { User, LoginInput, RegisterUserInput } from '@/Data/types'

interface AuthContextType {
    user: User | null
    token: string | null
    loading: boolean
    login: (credentials: LoginInput) => Promise<void>
    register: (payload: RegisterUserInput) => Promise<void>
    logout: () => void
    updateProfile: (data: { fullname: string; phone: string; profileImage?: string }) => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem('token')
            if (storedToken) {
                try {
                    const response = await api.get('/api/auth/me')
                    if (response.data.ok) {
                        setUser(response.data.user)
                    } else {
                        logout()
                    }
                } catch (error) {
                    logout()
                }
            }
            setLoading(false)
        }

        initializeAuth()
    }, [token])

    const login = async (credentials: LoginInput) => {
        setLoading(true)
        try {
            const response = await api.post('/api/auth/login', credentials)
            if (response.data.ok) {
                const { user, token } = response.data
                localStorage.setItem('token', token)
                setToken(token)
                setUser(user)
            } else {
                throw new Error(response.data.message || 'Login failed')
            }
        } catch (error: any) {
            setLoading(false)
            throw new Error(error.response?.data?.message || error.message || 'Login failed')
        }
    }

    const register = async (payload: RegisterUserInput) => {
        setLoading(true)
        try {
            const response = await api.post('/api/auth/register', payload)
            if (response.data.ok) {
                const { user, token } = response.data
                localStorage.setItem('token', token)
                setToken(token)
                setUser(user)
            } else {
                throw new Error(response.data.message || 'Registration failed')
            }
        } catch (error: any) {
            setLoading(false)
            throw new Error(error.response?.data?.message || error.message || 'Registration failed')
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
        setLoading(false)
    }

    const updateProfile = async (data: { fullname: string; phone: string; profileImage?: string }) => {
        try {
            const response = await api.put('/api/auth/profile', data)
            if (response.data.ok) {
                setUser(response.data.user)
            } else {
                throw new Error(response.data.message || 'Profile update failed')
            }
        } catch (error: any) {
            throw new Error(error.response?.data?.message || error.message || 'Profile update failed')
        }
    }

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    )
}
