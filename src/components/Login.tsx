import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { Compass, Mail, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

// Zod Login Validation Schema
const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters')
})

export function Login() {
    const { login } = useAuth()
    const navigate = useNavigate()
    
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})

        // Form Validation with Zod
        const result = loginSchema.safeParse(formData)
        if (!result.success) {
            const fieldErrors: any = {}
            result.error.issues.forEach((err: any) => {
                if (err.path[0]) {
                    fieldErrors[err.path[0]] = err.message
                }
            })
            setErrors(fieldErrors)
            return
        }

        setIsLoading(true)
        try {
            await login(formData)
            toast.success('Successfully logged in!')
            navigate('/dashboard')
        } catch (error: any) {
            toast.error(error.message || 'Login failed. Please check credentials.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 px-6 py-12 relative overflow-hidden font-sans">
            {/* Background Blurs */}
            <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                {/* Brand */}
                <div className="flex flex-col items-center mb-8">
                    <Link to="/" className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
                            <Compass className="w-6 h-6 text-white animate-spin-slow" />
                        </div>
                        <span className="text-3xl font-black text-white">Indore Explorer</span>
                    </Link>
                    <p className="text-gray-400 text-sm">Sign in to manage your travel experiences</p>
                </div>

                {/* Form Container */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl text-white">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="name@example.com"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                                />
                            </div>
                            {errors.email && <p className="text-rose-450 text-xs mt-1">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                                />
                            </div>
                            {errors.password && <p className="text-rose-450 text-xs mt-1">{errors.password}</p>}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Bottom link */}
                    <div className="mt-6 text-center text-sm text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
export default Login