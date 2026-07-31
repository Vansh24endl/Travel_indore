import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'

interface Revenue3DCardProps {
    totalRevenue: number | string
}

export const Revenue3DCard: React.FC<Revenue3DCardProps> = ({ totalRevenue }) => {
    const cardRef = useRef<HTMLDivElement>(null)
    const [rotateX, setRotateX] = useState(0)
    const [rotateY, setRotateY] = useState(0)
    const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 })
    const [isHovered, setIsHovered] = useState(false)
    const [animationKey, setAnimationKey] = useState(0)

    // Handle mouse move for 3D card tilt & spotlight follow
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        
        const centerX = rect.width / 2
        const centerY = rect.height / 2

        // Tilt angles (max ~10-12 degrees)
        const rotX = -((y - centerY) / centerY) * 10
        const rotY = ((x - centerX) / centerX) * 10

        setRotateX(rotX)
        setRotateY(rotY)

        setSpotlightPos({
            x: Math.round((x / rect.width) * 100),
            y: Math.round((y / rect.height) * 100)
        })
    }

    const handleMouseEnter = () => {
        setIsHovered(true)
        setAnimationKey(prev => prev + 1)
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
        setRotateX(0)
        setRotateY(0)
    }

    return (
        <div 
            style={{ perspective: '1000px' }}
            className="w-full relative group cursor-pointer select-none pt-8 overflow-visible"
        >
            <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                animate={{
                    rotateX: rotateX,
                    rotateY: rotateY,
                    scale: isHovered ? 1.02 : 1,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                    mass: 0.5
                }}
                style={{
                    transformStyle: 'preserve-3d',
                }}
                className="relative rounded-3xl border border-indigo-500/40 bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white shadow-2xl transition-shadow duration-300 hover:shadow-indigo-500/30 hover:shadow-2xl overflow-visible"
            >
                {/* --- VEHICLES CHASE TRACK (ON TOP OF THE BORDER) --- */}
                <div 
                    style={{ transform: 'translateZ(40px)' }}
                    className="absolute -top-[1px] left-0 right-0 h-0 overflow-visible pointer-events-none z-30"
                >
                    {/* Glowing Road Line right along the upper border */}
                    <div className="absolute top-0 left-4 right-4 h-[3px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 group-hover:shadow-[0_0_15px_#38bdf8] transition-all duration-300 rounded-full" />
                    
                    {/* Vehicles Chasing on Top of the Card Border */}
                    {isHovered && (
                        <motion.div
                            key={animationKey}
                            initial={{ x: '-25%' }}
                            animate={{ x: '105%' }}
                            transition={{
                                duration: 3.8,
                                ease: [0.25, 0.1, 0.25, 1], // Smooth cruise
                            }}
                            className="absolute bottom-0 left-0 flex items-end gap-5 pb-[1px]"
                        >
                            {/* Chasing City Bus (Behind) */}
                            <div className="relative flex flex-col items-center">
                                {/* Exhaust Puff */}
                                <motion.div 
                                    animate={{ opacity: [0.2, 0.9, 0], scale: [0.4, 1.4, 0.2], x: [-6, -18] }}
                                    transition={{ repeat: Infinity, duration: 0.25 }}
                                    className="absolute -left-3 bottom-2 w-3 h-3 rounded-full bg-slate-300/70 blur-[1px]"
                                />
                                {/* Indore City Bus SVG */}
                                <div className="relative drop-shadow-[0_6px_12px_rgba(59,130,246,0.8)] animate-bounce [animation-duration:380ms]">
                                    <svg width="46" height="28" viewBox="0 0 46 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        {/* Bus Body */}
                                        <rect x="2" y="4" width="42" height="19" rx="3" fill="url(#busGrad3d)" stroke="#60A5FA" strokeWidth="1.5"/>
                                        {/* Roof LED Bar */}
                                        <rect x="15" y="2" width="16" height="2" rx="1" fill="#38BDF8" className="animate-pulse" />
                                        {/* Front Windshield */}
                                        <path d="M33 6H42V13H33V6Z" fill="#93C5FD" opacity="0.9" />
                                        {/* Side Windows */}
                                        <rect x="5" y="6" width="7" height="7" rx="1" fill="#DBEAFE" opacity="0.8"/>
                                        <rect x="14" y="6" width="7" height="7" rx="1" fill="#DBEAFE" opacity="0.8"/>
                                        <rect x="23" y="6" width="7" height="7" rx="1" fill="#DBEAFE" opacity="0.8"/>
                                        {/* Bus Stripe */}
                                        <rect x="2" y="15" width="42" height="3" fill="#3B82F6"/>
                                        {/* Wheels sitting directly on upper border */}
                                        <circle cx="11" cy="23" r="4" fill="#0F172A" stroke="#94A3B8" strokeWidth="1"/>
                                        <circle cx="11" cy="23" r="1.8" fill="#E2E8F0"/>
                                        <circle cx="35" cy="23" r="4" fill="#0F172A" stroke="#94A3B8" strokeWidth="1"/>
                                        <circle cx="35" cy="23" r="1.8" fill="#E2E8F0"/>
                                        {/* Bright Headlight Beam */}
                                        <polygon points="44,16 58,11 58,24 44,20" fill="url(#headlightBus3d)" opacity="0.9"/>
                                        
                                        <defs>
                                            <linearGradient id="busGrad3d" x1="0" y1="0" x2="46" y2="28" gradientUnits="userSpaceOnUse">
                                                <stop stopColor="#2563EB" />
                                                <stop offset="1" stopColor="#1D4ED8" />
                                            </linearGradient>
                                            <linearGradient id="headlightBus3d" x1="44" y1="17" x2="58" y2="17" gradientUnits="userSpaceOnUse">
                                                <stop stopColor="#60A5FA" stopOpacity="0.9" />
                                                <stop offset="1" stopColor="#60A5FA" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                                <span className="text-[9px] font-black text-cyan-300 tracking-tighter uppercase mt-0.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">BUS 🚌</span>
                            </div>

                            {/* Dynamic Speed Lines */}
                            <div className="flex items-center gap-1 mb-3 opacity-90">
                                <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 0.18 }} className="w-4 h-[2.5px] bg-amber-400 rounded-full shadow-[0_0_6px_#fbbf24]" />
                                <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 0.22 }} className="w-2.5 h-[2.5px] bg-cyan-400 rounded-full shadow-[0_0_6px_#22d3ee]" />
                            </div>

                            {/* Leading Sports Car (Ahead) */}
                            <div className="relative flex flex-col items-center">
                                {/* Car Flame/Exhaust Sparkle */}
                                <motion.div 
                                    animate={{ opacity: [0.4, 1, 0], scale: [0.4, 1.5, 0.2], x: [-6, -20] }}
                                    transition={{ repeat: Infinity, duration: 0.18 }}
                                    className="absolute -left-3 bottom-2 w-2.5 h-2.5 rounded-full bg-amber-400 blur-[1px]"
                                />
                                {/* Sports Car SVG */}
                                <div className="relative drop-shadow-[0_6px_14px_rgba(249,115,22,0.9)] animate-bounce [animation-duration:300ms]">
                                    <svg width="44" height="24" viewBox="0 0 44 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        {/* Car Roof / Cabin */}
                                        <path d="M11 11 L18 4 H30 L36 11 Z" fill="#F97316" stroke="#FDBA74" strokeWidth="1"/>
                                        {/* Windshield */}
                                        <path d="M19 5.5 H28 L32 11 H17 Z" fill="#FEF08A" opacity="0.9"/>
                                        {/* Main Body */}
                                        <path d="M2 11 C2 10 4 9 8 9 H37 C41 9 43 10 43 13 V17 H1 V12 Z" fill="url(#carGrad3d)" stroke="#FB923C" strokeWidth="1"/>
                                        {/* Racing Stripe */}
                                        <rect x="2" y="12" width="41" height="2" fill="#FEF08A"/>
                                        {/* Wheels sitting directly on upper border */}
                                        <circle cx="10" cy="18" r="3.5" fill="#090D16" stroke="#F97316" strokeWidth="1"/>
                                        <circle cx="10" cy="18" r="1.5" fill="#FFF"/>
                                        <circle cx="33" cy="18" r="3.5" fill="#090D16" stroke="#F97316" strokeWidth="1"/>
                                        <circle cx="33" cy="18" r="1.5" fill="#FFF"/>
                                        {/* Headlight Beam */}
                                        <polygon points="42,13 56,9 56,22 42,17" fill="url(#headlightCar3d)" opacity="0.95"/>

                                        <defs>
                                            <linearGradient id="carGrad3d" x1="0" y1="0" x2="44" y2="24" gradientUnits="userSpaceOnUse">
                                                <stop stopColor="#EA580C" />
                                                <stop offset="1" stopColor="#C2410C" />
                                            </linearGradient>
                                            <linearGradient id="headlightCar3d" x1="42" y1="14" x2="56" y2="14" gradientUnits="userSpaceOnUse">
                                                <stop stopColor="#FDE047" stopOpacity="0.95" />
                                                <stop offset="1" stopColor="#FDE047" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                                <span className="text-[9px] font-black text-amber-300 tracking-tighter uppercase mt-0.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">CAR 🏎️</span>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Main Inner Container with rounded corners & overflow hidden for spotlight/content */}
                <div className="relative p-6 h-full min-h-[220px] flex flex-col justify-between rounded-3xl overflow-hidden">
                    {/* Mouse Spotlight Glow */}
                    <div
                        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                            background: `radial-gradient(400px circle at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(129, 140, 248, 0.25), transparent 60%)`
                        }}
                    />

                    {/* Card Content with 3D Elevation */}
                    <div 
                        style={{ transform: 'translateZ(30px)' }}
                        className="space-y-4 relative z-10 transition-transform duration-200"
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-indigo-300 font-extrabold uppercase tracking-widest bg-indigo-900/40 px-3 py-1 rounded-full border border-indigo-500/20 backdrop-blur-md">
                                Gross Booking Revenue
                            </span>
                            <div className="p-2.5 bg-indigo-500/20 rounded-2xl text-indigo-300 border border-indigo-400/30 group-hover:scale-110 group-hover:bg-indigo-500/30 transition-all duration-300 shadow-lg">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                        </div>

                        <div className="flex items-baseline gap-1.5 pt-1">
                            <span className="text-3xl font-black text-indigo-300 drop-shadow-[0_2px_10px_rgba(129,140,248,0.5)]">₹</span>
                            <h3 className="text-4xl sm:text-5xl font-black font-heading tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
                                {totalRevenue}
                            </h3>
                        </div>
                    </div>

                    {/* Footer Subtext */}
                    <div 
                        style={{ transform: 'translateZ(20px)' }}
                        className="relative z-10 mt-6"
                    >
                        <p className="text-xs text-indigo-200/80 leading-relaxed font-medium bg-slate-900/40 p-3 rounded-2xl border border-white/5 backdrop-blur-sm">
                            Calculated from all verified traveler and diner passes booked through the portal.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default Revenue3DCard
