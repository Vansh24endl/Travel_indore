import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Send, Bot, User, Compass, HelpCircle } from 'lucide-react'
import Card from './ui/Card'
import Button from './ui/Button'
import api from '@/services/api'

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
                <span key={lineIdx} className="block font-extrabold text-base text-indigo-700 dark:text-indigo-400 mb-3 mt-1">
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
                <strong key={match.index} className="font-extrabold text-gray-950 dark:text-white">
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
                    <span className="text-indigo-500 mt-1 flex-shrink-0">•</span>
                    <span className="text-gray-750 dark:text-gray-300 text-sm leading-relaxed">{parts}</span>
                </span>
            )
        }

        return (
            <span key={lineIdx} className="block text-gray-750 dark:text-gray-300 text-sm leading-relaxed mb-2">
                {parts}
            </span>
        )
    })
}

export function AIAssistant() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            sender: 'bot',
            text: 'Hello! I am your Indore Travel AI Assistant. 🌟\n\nI can help you plan your budget, suggest the best street food spots, design a 1-day heritage walkthrough, or create a weekend trip itinerary. How can I help you explore Indore today?'
        }
    ])
    const [inputText, setInputText] = useState('')
    const [isTyping, setIsTyping] = useState(false)

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
                    isItinerary: res.data.extracted?.intent === 'itinerary'
                }
                setMessages(prev => [...prev, botMsg])
            } else {
                throw new Error('Invalid response')
            }
        } catch (error) {
            const botMsg: Message = {
                id: Date.now() + 1,
                sender: 'bot',
                text: 'Sorry, I encountered an issue connecting to the AI travel service. Please check your network or try again later.'
            }
            setMessages(prev => [...prev, botMsg])
        } finally {
            setIsTyping(false)
        }
    }

    return (
        <div className="space-y-8 font-sans pb-16 h-[calc(100vh-140px)] flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white">AI Travel Assistant</h2>
                    <p className="text-gray-550 dark:text-gray-400 text-sm">Ask questions, get travel recommendations, or plan custom itineraries</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
                {/* Suggestions sidebar */}
                <div className="hidden lg:block space-y-4">
                    <Card hoverable={false} className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                            <HelpCircle className="w-4 h-4 text-indigo-500" />
                            <h4 className="font-bold text-sm text-gray-900 dark:text-white">Quick Suggestions</h4>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => handleSend('Plan a 1-day heritage tour')}
                                className="w-full text-left p-3 rounded-xl bg-gray-50 dark:bg-gray-850 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 text-xs font-bold text-gray-700 dark:text-gray-300 transition-all border border-transparent hover:border-indigo-100"
                            >
                                🏛️ 1-Day Heritage Tour
                            </button>
                            <button
                                onClick={() => handleSend('Tell me about street food trail')}
                                className="w-full text-left p-3 rounded-xl bg-gray-50 dark:bg-gray-850 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 text-xs font-bold text-gray-700 dark:text-gray-300 transition-all border border-transparent hover:border-indigo-100"
                            >
                                😋 Food trail (Sarafa & Chappan)
                            </button>
                            <button
                                onClick={() => handleSend('Plan a spiritual walkthrough')}
                                className="w-full text-left p-3 rounded-xl bg-gray-50 dark:bg-gray-850 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 text-xs font-bold text-gray-700 dark:text-gray-300 transition-all border border-transparent hover:border-indigo-100"
                            >
                                🛕 Spiritual / Temple Visit
                            </button>
                            <button
                                onClick={() => handleSend('What is the travel budget per day?')}
                                className="w-full text-left p-3 rounded-xl bg-gray-50 dark:bg-gray-850 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 text-xs font-bold text-gray-700 dark:text-gray-300 transition-all border border-transparent hover:border-indigo-100"
                            >
                                💰 Budget & Cost Planner
                            </button>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-3 flex flex-col justify-between h-full bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-xl">
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[50vh] min-h-[30vh]">
                        <AnimatePresence>
                            {messages.map(msg => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex items-start gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.sender === 'bot' && (
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                                            <Bot className="w-4 h-4" />
                                        </div>
                                    )}

                                    <div className={`p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed ${
                                        msg.sender === 'user'
                                            ? 'bg-indigo-600 text-white rounded-tr-none whitespace-pre-line'
                                            : msg.isItinerary
                                            ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/50 text-gray-800 dark:text-gray-200 rounded-tl-none font-medium'
                                            : 'bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-250 rounded-tl-none'
                                    }`}>
                                        {formatMessageText(msg.text)}
                                        {msg.places && msg.places.length > 0 && (
                                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-200/50 dark:border-gray-700/50 pt-4">
                                                {msg.places.map((place, idx) => (
                                                    <div 
                                                        key={idx} 
                                                        className="bg-white dark:bg-gray-850 p-4 rounded-xl border border-gray-150 dark:border-gray-750 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                                                    >
                                                        <div>
                                                            <div className="flex justify-between items-start gap-2">
                                                                <h5 className="font-extrabold text-xs text-gray-900 dark:text-white line-clamp-1">{place.name}</h5>
                                                                <span className="flex items-center gap-0.5 text-amber-500 text-[10px] font-bold bg-amber-50 dark:bg-amber-950/45 px-1.5 py-0.5 rounded-md">
                                                                    ★ {place.rating}
                                                                </span>
                                                            </div>
                                                            <p className="text-[10px] text-gray-550 dark:text-gray-400 mt-1 line-clamp-2">{place.location}</p>
                                                        </div>
                                                        <a 
                                                            href={place.mapUrl} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            className="mt-3 block text-center bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-extrabold text-[10px] py-1.5 rounded-lg border border-indigo-100/40 transition-colors"
                                                        >
                                                            Open in Google Maps
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {msg.sender === 'user' && (
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0 font-bold text-xs">
                                            ME
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            {isTyping && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-2xl flex items-center gap-1">
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <div className="p-4 border-t border-gray-150/60 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md">
                        <form
                            onSubmit={e => {
                                e.preventDefault()
                                handleSend(inputText)
                            }}
                            className="flex gap-2"
                        >
                            <input
                                type="text"
                                placeholder="Ask about places, food, or budgets..."
                                value={inputText}
                                onChange={e => setInputText(e.target.value)}
                                className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-900 dark:text-white"
                            />
                            <Button type="submit" variant="primary" className="!py-2.5 px-5">
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>
                    {/* <div>
                        import {GoogleGenAi} from "@google/genai";
                        const ai = new GoogleGenAi({});
                        async function main(params:type) {
                            const response = await ai.models.genrateContent({
                                model: "gemini-3.5-flash",
                                contents: "Write your thoughts in few words",
                            })
                            console.log(responsee.text);
                        }
                        await main();
                    </div> */}
                </div>
            </div>
        </div>
    )
}
export default AIAssistant
