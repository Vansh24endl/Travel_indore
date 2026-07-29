import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Send, Bot, User, Compass, HelpCircle, MapPin, Calendar, Clock, ArrowRight } from 'lucide-react'
import Card from './ui/Card'
import Button from './ui/Button'
import api from '@/services/api'
import { Link } from 'react-router'

interface Place {
    name: string
    rating: number
    location: string
    mapUrl: string
}

interface Message {
    id: number
    sender: 'bot' | 'user'
    text: string
    isItinerary?: boolean
    places?: Place[]
}

function formatMessageText(text: string) {
    const lines = text.split('\n')
    return lines.map((line, lineIdx) => {
        let cleanLine = line.trim()
        
        if (cleanLine.startsWith('###')) {
            const headingText = cleanLine.replace(/^###\s*/, '')
            return (
                <span key={lineIdx} className="block font-black text-base font-heading text-indigo-600 dark:text-indigo-400 mb-3 mt-2">
                    {headingText}
                </span>
            )
        }
        
        let isBullet = false
        if (cleanLine.startsWith('*')) {
            isBullet = true
            cleanLine = cleanLine.replace(/^\*\s*/, '')
        }
        
        const parts: React.ReactNode[] = []
        let index = 0
        const regex = /\*\*(.*?)\*\*/g
        let match
        
        while ((match = regex.exec(cleanLine)) !== null) {
            if (match.index > index) {
                parts.push(cleanLine.substring(index, match.index))
            }
            parts.push(
                <strong key={match.index} className="font-extrabold text-slate-900 dark:text-white">
                    {match[1]}
                </strong>
            )
            index = regex.lastIndex
        }
        
        if (index < cleanLine.length) {
            parts.push(cleanLine.substring(index))
        }

        if (isBullet) {
            return (
                <span key={lineIdx} className="flex items-start gap-2 mb-2 pl-1">
                    <span className="text-indigo-500 font-bold mt-0.5 flex-shrink-0">•</span>
                    <span className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm leading-relaxed">{parts}</span>
                </span>
            )
        }

        return (
            <span key={lineIdx} className="block text-slate-700 dark:text-slate-200 text-xs sm:text-sm leading-relaxed mb-2">
                {parts}
            </span>
        )
    })
}

export function AIAssistant() {
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            sender: 'bot',
            text: 'Hello! I am your Indore AI Travel Copilot. 🌟\n\nAsk me for custom 1-day travel itineraries, local street food recommendations at Chappan & Sarafa, heritage walks around Rajwada Palace, or romantic evening spots!'
        }
    ])
    const [inputText, setInputText] = useState('')
    const [isTyping, setIsTyping] = useState(false)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping])

    const quickChips = [
        { label: '🏛 Heritage Walk', prompt: 'Plan a 1-day heritage walk tour in Indore starting from Rajwada Palace.' },
        { label: '🍴 Street Food Tour', prompt: 'What are the top must-try street foods at Chappan Dukan and Sarafa Bazaar?' },
        { label: '☔ Rainy Day Spots', prompt: 'Suggest the best places to visit in Indore on a rainy day.' },
        { label: '❤️ Couple Trip', prompt: 'Recommend a romantic 1-day couple itinerary with scenic sunset views in Indore.' },
        { label: '👨‍👩‍👧 Family Outing', prompt: 'Design a family friendly weekend plan with parks and food spots.' },
    ]

    const handleSend = async (textToSend: string) => {
        if (!textToSend.trim()) return

        const userMsg: Message = {
            id: Date.now(),
            sender: 'user',
            text: textToSend
        }
        setMessages(prev => [...prev, userMsg])
        setInputText('')
        setIsTyping(true)

        try {
            const res = await api.post('/api/ai/chat', { message: textToSend })
            if (res.data && res.data.ok) {
                const botMsg: Message = {
                    id: Date.now() + 1,
                    sender: 'bot',
                    text: res.data.message,
                    places: res.data.places,
                    isItinerary: res.data.extracted?.intent === 'itinerary' || textToSend.toLowerCase().includes('itinerary') || textToSend.toLowerCase().includes('plan')
                }
                setMessages(prev => [...prev, botMsg])
            } else {
                throw new Error('Invalid response')
            }
        } catch (error) {
            const botMsg: Message = {
                id: Date.now() + 1,
                sender: 'bot',
                text: 'Sorry, I encountered an issue connecting to the AI travel service. Please try asking again!'
            }
            setMessages(prev => [...prev, botMsg])
        } finally {
            setIsTyping(false)
        }
    }

    return (
        <div className="space-y-6 font-sans pb-16 h-[calc(100vh-140px)] flex flex-col justify-between text-left">
            {/* Header */}
            <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 dark:text-white">AI Travel Copilot</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">Personalized itineraries, food guides & Indore travel advice</p>
                </div>
            </div>

            {/* Quick Prompt Chips Banner */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {quickChips.map((chip, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleSend(chip.prompt)}
                        className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl whitespace-nowrap transition-all hover:scale-105 shadow-sm cursor-pointer"
                    >
                        {chip.label}
                    </button>
                ))}
            </div>

            {/* Main Chat Grid */}
            <Card hoverable={false} className="flex-1 overflow-hidden p-0 flex flex-col border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xl bg-slate-50/50 dark:bg-slate-900/50">
                {/* Message Scroll Area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-none">
                    {messages.map((msg) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={msg.id}
                            className={`flex gap-3 sm:gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            {/* Avatar */}
                            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ${
                                msg.sender === 'user' 
                                    ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white' 
                                    : 'bg-indigo-600 text-white'
                            }`}>
                                {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                            </div>

                            {/* Bubble Content */}
                            <div className={`max-w-[85%] sm:max-w-[75%] space-y-3 ${
                                msg.sender === 'user' ? 'text-right' : 'text-left'
                            }`}>
                                <div className={`p-4 sm:p-5 rounded-3xl text-left shadow-sm ${
                                    msg.sender === 'user'
                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-tr-none'
                                        : 'bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-100 border border-slate-200/60 dark:border-slate-800 rounded-tl-none'
                                }`}>
                                    {formatMessageText(msg.text)}
                                </div>

                                {/* Visual Itinerary Steps Timeline Card */}
                                {msg.isItinerary && (
                                    <div className="bg-white dark:bg-slate-850 border border-indigo-200 dark:border-indigo-900/60 p-4 rounded-3xl space-y-3 text-left shadow-md">
                                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs uppercase tracking-wider">
                                            <Calendar className="w-4 h-4" />
                                            <span>AI Generated Itinerary Timeline</span>
                                        </div>
                                        
                                        <div className="space-y-3 border-l-2 border-indigo-500 pl-4 py-1">
                                            <div className="relative">
                                                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-600" />
                                                <span className="text-[10px] font-bold text-slate-400">09:00 AM • Morning Walk</span>
                                                <h5 className="font-extrabold text-xs text-slate-900 dark:text-white">Rajwada Palace & Poha Breakfast</h5>
                                            </div>
                                            <div className="relative">
                                                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-purple-600" />
                                                <span className="text-[10px] font-bold text-slate-400">01:30 PM • Lunch & Shopping</span>
                                                <h5 className="font-extrabold text-xs text-slate-900 dark:text-white">Chappan Dukan Food Street</h5>
                                            </div>
                                            <div className="relative">
                                                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-rose-600" />
                                                <span className="text-[10px] font-bold text-slate-400">08:00 PM • Night Market</span>
                                                <h5 className="font-extrabold text-xs text-slate-900 dark:text-white">Sarafa Bazaar Street Food</h5>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Recommended Places Grid embedded in bot response */}
                                {msg.places && msg.places.length > 0 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-left">
                                        {msg.places.map((place, pIdx) => (
                                            <div key={pIdx} className="p-3 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1 shadow-sm">
                                                <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate">{place.name}</h5>
                                                <div className="flex items-center justify-between text-[11px] text-slate-500">
                                                    <span>📍 {place.location}</span>
                                                    <span className="text-amber-500 font-bold">★ {place.rating}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}

                    {/* Typing Animation Loader */}
                    {isTyping && (
                        <div className="flex gap-3 items-center">
                            <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                                <Bot className="w-5 h-5 animate-spin-slow" />
                            </div>
                            <div className="p-4 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-3xl rounded-tl-none flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                                <span>AI Copilot is crafting your travel answer</span>
                                <span className="animate-bounce">•</span>
                                <span className="animate-bounce delay-100">•</span>
                                <span className="animate-bounce delay-200">•</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Controls Bar */}
                <div className="p-4 bg-white dark:bg-slate-850 border-t border-slate-200/80 dark:border-slate-800">
                    <form
                        onSubmit={e => {
                            e.preventDefault()
                            handleSend(inputText)
                        }}
                        className="flex items-center gap-3"
                    >
                        <input
                            type="text"
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            placeholder="Ask AI Copilot for 1-day tours, food recommendations, or temple visits..."
                            className="flex-1 px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            type="submit"
                            disabled={!inputText.trim() || isTyping}
                            className="p-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl shadow-md disabled:opacity-50 transition-all cursor-pointer"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </Card>
        </div>
    )
}
export default AIAssistant
