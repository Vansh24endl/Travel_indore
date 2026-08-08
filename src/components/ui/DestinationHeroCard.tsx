import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

export interface DestinationHeroCardProps {
  id: string
  title: string
  subtitle: string
  image: string
  tag?: string
  badge?: string
  icon?: React.ReactNode
  onClick?: () => void
}

export const DestinationHeroCard: React.FC<DestinationHeroCardProps> = ({
  title,
  subtitle,
  image,
  tag,
  badge,
  icon,
  onClick,
}) => {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      onClick={onClick}
      className="group relative cursor-pointer rounded-2xl p-4 bg-slate-900/60 hover:bg-slate-900/80 border border-white/10 hover:border-amber-400/40 backdrop-blur-xl transition-all duration-300 shadow-lg overflow-hidden flex flex-col justify-between"
    >
      {/* Top Header Tag & Badge */}
      <div className="flex items-center justify-between gap-2 z-10 mb-3">
        <div className="flex items-center gap-2">
          {icon && (
            <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-amber-300 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors duration-300">
              {icon}
            </div>
          )}
          {tag && (
            <span className="text-[10px] font-semibold tracking-wider text-amber-300 uppercase bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
              {tag}
            </span>
          )}
        </div>

        {badge && (
          <span className="text-[10px] font-medium text-slate-300 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
            {badge}
          </span>
        )}
      </div>

      {/* Title, Description & Thumbnail */}
      <div className="flex items-center justify-between gap-3 z-10">
        <div className="space-y-1 flex-1 pr-1">
          <h4 className="text-sm md:text-base font-bold text-white group-hover:text-amber-200 transition-colors line-clamp-1">
            {title}
          </h4>
          <p className="text-xs text-slate-300/80 leading-snug line-clamp-2 font-normal">
            {subtitle}
          </p>
        </div>

        {/* Thumbnail Preview */}
        <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden border border-white/15 shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
          <div className="absolute bottom-1 right-1 p-0.5 rounded-full bg-slate-950/80 text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight className="w-3 h-3 text-amber-300" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
export default DestinationHeroCard
