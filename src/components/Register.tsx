import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { Compass, Mail, Lock, User, Phone } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

// Zod Registration Schema
const registerSchema = z.object({
    fullname: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
})

const PRESETS_AVATARS = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aria',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi'
]

export function Register() {
    const { register } = useAuth()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    })
    const [selectedAvatar, setSelectedAvatar] = useState(PRESETS_AVATARS[0])
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<any>({})

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})

        const result = registerSchema.safeParse(formData)
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
            await register({
                fullname: formData.fullname,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                profileImage: selectedAvatar
            })
            toast.success('Account created successfully!')
            navigate('/dashboard')
        } catch (error: any) {
            toast.error(error.message || 'Registration failed.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 px-6 py-12 relative overflow-hidden font-sans">
            {/* Blurs */}
            <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg"
            >
                {/* Brand */}
                <div className="flex flex-col items-center mb-6">
                    <Link to="/" className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
                            <Compass className="w-6 h-6 text-white animate-spin-slow" />
                        </div>
                        <span className="text-3xl font-black text-white">Indore Explorer</span>
                    </Link>
                    <p className="text-gray-400 text-sm">Create an account to begin planning your journey</p>
                </div>

                {/* Form Container */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl text-white">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        
                        {/* Avatar Picker */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-3 text-center">Select Profile Character</label>
                            <div className="flex justify-center gap-4">
                                {PRESETS_AVATARS.map((avatar, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setSelectedAvatar(avatar)}
                                        className={`w-14 h-14 rounded-full overflow-hidden border-2 transition-all duration-300 ${
                                            selectedAvatar === avatar ? 'border-indigo-500 scale-110 bg-indigo-500/20' : 'border-transparent bg-white/5 opacity-60 hover:opacity-100'
                                        }`}
                                    >
                                        <img src={avatar} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-1.5">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.fullname}
                                    onChange={e => setFormData({ ...formData, fullname: e.target.value })}
                                    placeholder="John Doe"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                                />
                            </div>
                            {errors.fullname && <p className="text-rose-450 text-xs mt-1">{errors.fullname}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-1.5">Email Address</label>
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

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-1.5">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="9876543210"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                                />
                            </div>
                            {errors.phone && <p className="text-rose-450 text-xs mt-1">{errors.phone}</p>}
                        </div>

                        {/* Passwords grid */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-1.5">Password</label>
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
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-1.5">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        placeholder="••••••••"
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                                    />
                                </div>
                                {errors.confirmPassword && <p className="text-rose-450 text-xs mt-1">{errors.confirmPassword}</p>}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                'Sign Up'
                            )}
                        </button>
                    </form>

                    {/* Bottom link */}
                    <div className="mt-5 text-center text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                            Sign In
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
export default Register