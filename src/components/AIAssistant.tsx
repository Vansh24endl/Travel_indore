import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Send, Bot, User, Compass, HelpCircle } from 'lucide-react'
import Card from './ui/Card'
import Button from './ui/Button'

interface Message {
    id: number
    sender: 'bot' | 'user'
    text: string
    isItinerary?: boolean
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

    const handleSend = (textToSend: string) => {
        if (!textToSend.trim()) return

        const userMsg: Message = {
            id: Date.now(),
            sender: 'user',
            text: textToSend
        }
        setMessages(prev => [...prev, userMsg])
        setInputText('')
        setIsTyping(true)

        // Generate response based on keywords
        setTimeout(() => {
            let reply = ''
            const query = textToSend.toLowerCase()

            if (query.includes('heritage') || query.includes('1-day') || query.includes('history') || query.includes('palace')) {
                reply = `### 🏛️ One-Day Heritage Itinerary:
* **09:30 AM**: Start at **Lal Bagh Palace** (explore the grand European architecture).
* **12:00 PM**: Head to **Rajwada Palace** (the heart of the Holkar dynasty).
* **02:00 PM**: Enjoy lunch at **Chappan Dukan** (Indori Poha & Egg Banjo).
* **04:00 PM**: Visit the beautiful **Krishnapura Chhatris** near Kahn River.
* **06:00 PM**: Relax at **Kanch Mandir** (Exquisite temple made entirely of glass).`
            } else if (query.includes('food') || query.includes('eat') || query.includes('chappan') || query.includes('sarafa')) {
                reply = `### 😋 Indori Food Trail Itinerary:
* **Breakfast**: **Prashant Post-Office Poha** or **Head-Saab Ke Poha** (served with double Sev, Jalebi, and Usal).
* **Afternoon**: **Chappan Dukan** (Famous for Johnny Hot Dog, Vijay Chaat House\'s Khopra Patties, and Madhuram\'s Shahi Shrikhand).
* **Night (09:00 PM - 01:00 AM)**: **Sarafa Night Bazaar** (A jewelry market that transforms into a massive street food paradise. Must try: **Dahi Vada** at Joshi\'s, **Garadu**, **Bhutte Ka Kees**, and giant **Mawa Jalebi**).`
            } else if (query.includes('budget') || query.includes('cost') || query.includes('cheap')) {
                reply = `### 💰 Budget Planner:
* **Backpacker Budget**: ₹800 - ₹1200 / day
  * Stay: Hostels or local homestays (₹500).
  * Food: Poha & street food stalls (₹300).
  * Travel: Public buses, e-rickshaws, or i-Bus (₹100).
  * Entry Fees: Most temples and parks are free. Palaces cost around ₹20 - ₹50.
* **Comfort Travel Budget**: ₹2500 - ₹4000 / day
  * Stay: 3-Star hotels (₹2000).
  * Food: Full-service restaurants and cafes (₹1000).
  * Travel: Ride-sharing cabs or auto rentals (₹600).`
            } else if (query.includes('temple') || query.includes('spiritual') || query.includes('ganesh') || query.includes('ujjain')) {
                reply = `### 🛕 Spiritual & Temple Walkthrough:
* **Morning**: Visit **Khajrana Ganesh Temple** (offering prayers to the massive Ganesha idol).
* **Late Morning**: Walk through **Bada Ganpati** (housing the world\'s largest Ganesha idol, standing 25 feet tall).
* **Afternoon**: Visit **Bijasen Tekri** (perched on a hill, offers beautiful panoramic views of the city).
* **Pro Tip**: If you have a weekend, take a 1-hour bus or train to Ujjain (55km away) to visit the holy **Mahakaleshwar Jyotirlinga Temple**.`
            } else {
                reply = `I can help you with specific details about Indore! Try selecting one of the travel templates below, or ask me about:
* **"heritage"** to get a historical monument walkthrough.
* **"food"** to get a guide to Chappan & Sarafa street food.
* **"budget"** to plan your daily travel expenses.
* **"temple"** to get a spiritual journey planner.`
            }

            const botMsg: Message = {
                id: Date.now() + 1,
                sender: 'bot',
                text: reply,
                isItinerary: reply.startsWith('###')
            }
            setMessages(prev => [...prev, botMsg])
            setIsTyping(false)
        }, 1200)
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

            {/* Chat Body & Input Layout */}
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

                {/* Main Chat Box */}
                <div className="lg:col-span-3 flex flex-col justify-between h-full bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-xl">
                    {/* Message Area */}
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

                                    <div className={`p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed whitespace-pre-line ${
                                        msg.sender === 'user'
                                            ? 'bg-indigo-600 text-white rounded-tr-none'
                                            : msg.isItinerary
                                            ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/50 text-gray-800 dark:text-gray-200 rounded-tl-none font-medium'
                                            : 'bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-250 rounded-tl-none'
                                    }`}>
                                        {msg.text}
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

                    {/* Input Bar */}
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
                </div>
            </div>
        </div>
    )
}
export default AIAssistant
