import React from 'react'

interface LoaderProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'w-6 h-6 border-2',
        md: 'w-10 h-10 border-3',
        lg: 'w-16 h-16 border-4'
    }

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div className={`animate-spin rounded-full border-t-indigo-600 border-r-indigo-600 border-b-transparent border-l-transparent ${sizeClasses[size]}`}></div>
        </div>
    )
}
export default Loader
