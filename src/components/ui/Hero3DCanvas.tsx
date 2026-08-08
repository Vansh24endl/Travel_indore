import React, { useState, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Pause, Image as ImageIcon, Sparkles } from 'lucide-react'

interface Hero3DCanvasProps {
  children?: React.ReactNode
}

export const Hero3DCanvas: React.FC<Hero3DCanvasProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const [isPlayingVideo, setIsPlayingVideo] = useState(true)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 30, stiffness: 100 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springConfig)
  const moveX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig)
  const moveY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-8, 8]), springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const toggleVideoMode = () => {
    if (isPlayingVideo) {
      if (videoRef.current) videoRef.current.pause()
      setIsPlayingVideo(false)
    } else {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {})
      }
      setIsPlayingVideo(true)
    }
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-screen overflow-hidden bg-slate-950 text-white select-none"
    >
      <motion.div
        style={{
          rotateX: isPlayingVideo ? 0 : rotateX,
          rotateY: isPlayingVideo ? 0 : rotateY,
          x: moveX,
          y: moveY,
          scale: 1.03,
        }}
        transition={{ ease: 'easeOut' }}
        className="absolute inset-0 w-full h-full transform-gpu transition-transform duration-500 pointer-events-none"
      >
        <video
          ref={videoRef}
          src="/hero_video.mp4"
          autoPlay
          loop
          muted
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            isPlayingVideo ? 'opacity-85' : 'opacity-0 pointer-events-none'
          }`}
        />
        <img
          src="/hero_3d_town.png"
          alt="Indore 3D Heritage Scene"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            isPlayingVideo ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/20" />
        <div className="absolute inset-0 bg-slate-950/20 backdrop-brightness-95" />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-amber-300/30 blur-xs"
              style={{
                top: `${20 + (i * 12)}%`,
                left: `${15 + (i * 15)}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </motion.div>

      <div className="absolute top-20 right-6 z-20">
        <button
          onClick={toggleVideoMode}
          className="group flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/50 border border-white/10 text-[11px] font-medium text-slate-300 backdrop-blur-md hover:bg-slate-900/80 hover:border-amber-400/30 transition-all duration-300 shadow-md cursor-pointer"
        >
          {isPlayingVideo ? (
            <>
              <Pause className="w-3 h-3 text-amber-400" />
              <span>3D Motion</span>
            </>
          ) : (
            <>
              <ImageIcon className="w-3 h-3 text-indigo-400" />
              <span>3D Canvas</span>
            </>
          )}
          <Sparkles className="w-3 h-3 text-slate-400 group-hover:text-amber-300 transition-colors" />
        </button>
      </div>

      <div className="relative z-10 w-full min-h-screen flex flex-col justify-between">
        {children}
      </div>
    </div>
  )
}
export default Hero3DCanvas