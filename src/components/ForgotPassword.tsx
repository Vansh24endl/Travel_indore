import React, { useState } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import api from '@/services/api'
import { Compass, Mail, ArrowLeft, Key } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

const forgotSchema = z.object({
    email: z.string().email('Please enter a valid email address')
})

export function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [demoToken, setDemoToken] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setDemoToken(null)

        const result = forgotSchema.safeParse({ email })
        if (!result.success) {
            setError(result.error.issues[0].message)
            return
        }

        setIsLoading(true)
        try {
            const res = await api.post('/api/auth/forgot-password', { email })
            if (res.data.ok) {
                toast.success('Reset link generated successfully!')
                // Expose token for portfolio review convenience
                if (res.data.token) {
                    setDemoToken(res.data.token)
                }
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to request password reset')
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
                    <p className="text-gray-400 text-sm">Recover your account password</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl text-white space-y-6">
                    {!demoToken ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Registered Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                                    />
                                </div>
                                {error && <p className="text-rose-450 text-xs mt-1">{error}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    'Request Reset Link'
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-4 text-center">
                            <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto text-indigo-400">
                                <Key className="w-6 h-6 animate-bounce" />
                            </div>
                            <h4 className="font-extrabold text-lg">Reset Link Generated!</h4>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Under a production environment, an email containing the reset link would be dispatched. For this portfolio demo, you can copy the token below to complete the reset.
                            </p>
                            <div className="bg-white/10 p-3 rounded-xl select-all font-mono text-xs border border-white/10 break-all">
                                {demoToken}
                            </div>
                            <Link
                                to={`/reset-password?token=${demoToken}`}
                                className="block w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-center shadow-lg transition-all"
                            >
                                Proceed to Reset Password
                            </Link>
                        </div>
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
export default ForgotPassword
