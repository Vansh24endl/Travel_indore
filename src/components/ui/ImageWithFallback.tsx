import React, { useState } from 'react'
import { ImageOff } from 'lucide-react'

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackSrc?: string
    category?: string
}

const DEFAULT_FALLBACKS: Record<string, string> = {
    food: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=1080',
    heritage: 'https://images.unsplash.com/photo-1721572321875-2610e9e83d55?w=1080',
    spiritual: 'https://images.unsplash.com/photo-1698153210197-5a1027c6c5e8?w=1080',
    nature: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1080',
    default: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=1080'
}

export function ImageWithFallback({
    src,
    alt,
    className = '',
    fallbackSrc,
    category,
    ...props
}: ImageWithFallbackProps) {
    const [hasError, setHasError] = useState(false)
    const [fallbackAttempted, setFallbackAttempted] = useState(false)

    const defaultFallback = fallbackSrc || (category && DEFAULT_FALLBACKS[category]) || DEFAULT_FALLBACKS.default

    const handleError = () => {
        if (!fallbackAttempted && defaultFallback) {
            setFallbackAttempted(true)
        } else {
            setHasError(true)
        }
    }

    if (hasError) {
        return (
            <div className={`flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 p-4 ${className}`}>
                <ImageOff className="w-8 h-8 mb-1 opacity-60" />
                <span className="text-[11px] font-medium text-center line-clamp-1">{alt || 'Image unavailable'}</span>
            </div>
        )
    }

    return (
        <img
            src={fallbackAttempted ? defaultFallback : (src || defaultFallback)}
            alt={alt}
            onError={handleError}
            className={className}
            {...props}
        />
    )
}

export default ImageWithFallback
