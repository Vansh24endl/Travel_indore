import React from 'react'
import { Inbox } from 'lucide-react'

interface EmptyStateProps {
    title: string
    description?: string
    icon?: React.ReactNode
    action?: React.ReactNode
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    description,
    icon = <Inbox className="w-16 h-16 text-gray-300 dark:text-gray-600" />,
    action
}) => {
    return (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-white/40 dark:bg-gray-900/35 border border-white/20 dark:border-gray-800 rounded-3xl backdrop-blur-md">
            <div className="mb-4">{icon}</div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h4>
            {description && <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6">{description}</p>}
            {action && <div>{action}</div>}
        </div>
    )
}
export default EmptyState
