import React from 'react'
import { motion } from 'framer-motion'

import { HTMLMotionProps } from 'framer-motion'

interface ButtonProps extends HTMLMotionProps<'button'> {
    variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'glass'
    size?: 'sm' | 'md' | 'lg'
    isLoading?: boolean
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    className = '',
    disabled,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variants = {
        primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-indigo-500/30 focus:ring-indigo-500 border border-transparent',
        secondary: 'bg-white/10 hover:bg-white/20 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 focus:ring-indigo-500',
        outline: 'bg-transparent border-2 border-indigo-600 hover:bg-indigo-600 hover:text-white text-indigo-600 focus:ring-indigo-500',
        danger: 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg hover:shadow-rose-500/30 focus:ring-rose-500 border border-transparent',
        glass: 'bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10 hover:bg-white/20 text-gray-900 dark:text-white'
    }

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg'
    }

    const spinnerColor = variant === 'outline' ? 'text-indigo-600' : 'text-white'

    return (
        <motion.button
            whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
            whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    <svg className={`animate-spin -ml-1 mr-3 h-5 w-5 ${spinnerColor}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                </>
            ) : (
                children
            )}
        </motion.button>
    )
}
export default Button
