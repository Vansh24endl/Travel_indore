import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { motion } from 'framer-motion'
import api from '@/services/api'
import { Compass, Lock, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

const resetSchema = z.object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
})

export function ResetPassword() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const token = searchParams.get('token') || ''

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({})

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})

        if (!token) {
            toast.error('Invalid reset token. Request a new reset link.')
            return
        }

        const result = resetSchema.safeParse({ password, confirmPassword })
        if (!result.success) {
            const fieldErrors: any = {}
            result.error.issues.forEach(err => {
                if (err.path[0]) {
                    fieldErrors[err.path[0]] = err.message
                }
            })
            setErrors(fieldErrors)
            return
        }

        setIsLoading(true)
        try {
            const res = await api.post('/api/auth/reset-password', {
                token,
                password
            })
            if (res.data.ok) {
                toast.success('Password reset successfully! Log in to proceed.')
                navigate('/login')
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to reset password')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 px-6 py-12 relative overflow-hidden font-sans">
            <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="flex flex-col items-center mb-8">
                    <Link to="/" className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
                            <Compass className="w-6 h-6 text-white animate-spin-slow" />
                        </div>
                        <span className="text-3xl font-black text-white">Indore Explorer</span>
                    </Link>
                    <p className="text-gray-400 text-sm">Choose your new secure account password</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl text-white space-y-6">
                    {!token ? (
                        <div className="text-center space-y-4">
                            <p className="text-rose-450 font-bold text-sm">No reset token found in URL parameters.</p>
                            <Link to="/forgot-password" className="text-indigo-400 hover:underline text-xs">Request reset token</Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                                    />
                                </div>
                                {errors.password && <p className="text-rose-450 text-xs mt-1">{errors.password}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Confirm New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                                    />
                                </div>
                                {errors.confirmPassword && <p className="text-rose-450 text-xs mt-1">{errors.confirmPassword}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    'Update Password'
                                )}
                            </button>
                        </form>
                    )}

                    <div className="text-center">
                        <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-indigo-450 hover:underline font-semibold">
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Back to Sign In</span>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
export default ResetPassword
