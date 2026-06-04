import React from 'react'
import { motion } from 'framer-motion'

interface CardProps {
    children: React.ReactNode
    className?: string
    hoverable?: boolean
    onClick?: () => void
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    hoverable = true,
    onClick
}) => {
    const defaultStyles = 'bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 rounded-2xl p-6 shadow-xl shadow-gray-200/50 dark:shadow-none'
    const hoverStyles = hoverable ? 'cursor-pointer' : ''

    return (
        <motion.div
            whileHover={hoverable ? { y: -5, scale: 1.01, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' } : undefined}
            transition={{ duration: 0.3 }}
            onClick={onClick}
            className={`${defaultStyles} ${hoverStyles} ${className}`}
        >
            {children}
        </motion.div>
    )
}
export default Card
