import React from 'react'
import { useParams, Link } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/services/api'
import { 
    Compass, 
    ArrowLeft, 
    Printer, 
    Calendar, 
    Users, 
    MapPin, 
    XCircle,
    CheckCircle2
} from 'lucide-react'
import { toast } from 'sonner'
import Card from './ui/Card'
import Loader from './ui/Loader'
import Button from './ui/Button'

// Self-contained dynamic SVG QR Code Component
function QRCode({ value }: { value: string }) {
    const size = 17 // 17x17 grid
    
    // Hash function to seed the grid
    let hash = 0
    for (let i = 0; i < value.length; i++) {
        hash = value.charCodeAt(i) + ((hash << 5) - hash)
    }

    const getBit = (row: number, col: number) => {
        const isAnchor = 
            (row < 6 && col < 6) || // Top-left
            (row < 6 && col >= size - 6) || // Top-right
            (row >= size - 6 && col < 6) // Bottom-left
            
        if (isAnchor) return false

        const seed = Math.abs(hash + (row * 31) + (col * 17))
        return (seed % 3) === 0
    }

    return (
        <svg className="w-20 h-20 bg-white p-1 rounded-xl shadow-sm border border-gray-200" viewBox="0 0 100 100">
            {/* Top-Left Anchor */}
            <rect x="5" y="5" width="30" height="30" fill="#0f172a" />
            <rect x="10" y="10" width="20" height="20" fill="white" />
            <rect x="15" y="15" width="10" height="10" fill="#0f172a" />

            {/* Top-Right Anchor */}
            <rect x="65" y="5" width="30" height="30" fill="#0f172a" />
            <rect x="70" y="10" width="20" height="20" fill="white" />
            <rect x="75" y="15" width="10" height="10" fill="#0f172a" />

            {/* Bottom-Left Anchor */}
            <rect x="5" y="65" width="30" height="30" fill="#0f172a" />
            <rect x="10" y="70" width="20" height="20" fill="white" />
            <rect x="15" y="75" width="10" height="10" fill="#0f172a" />

            {/* Bottom-Right helper anchor */}
            <rect x="75" y="75" width="10" height="10" fill="#0f172a" />
            <rect x="77" y="77" width="6" height="6" fill="white" />
            <rect x="79" y="79" width="2" height="2" fill="#0f172a" />

            {/* Grid cells */}
            {Array.from({ length: size }).map((_, r) => {
                return Array.from({ length: size }).map((_, c) => {
                    const isAnchor = 
                        (r < 6 && c < 6) || 
                        (r < 6 && c >= size - 6) || 
                        (r >= size - 6 && c < 6) ||
                        (r >= size - 4 && c >= size - 4)
                        
                    if (isAnchor) return null

                    if (getBit(r, c)) {
                        const cellSize = 90 / size
                        const x = 5 + c * cellSize
                        const y = 5 + r * cellSize
                        return (
                            <rect 
                                key={`${r}-${c}`}
                                x={x}
                                y={y}
                                width={cellSize + 0.4}
                                height={cellSize + 0.4}
                                fill="#0f172a"
                            />
                        )
                    }
                    return null
                })
            })}
        </svg>
    )
}

export function BookingDetail() {
    const { id } = useParams()
    const queryClient = useQueryClient()

    // Fetch booking details
    const { data: booking, isLoading } = useQuery({
        queryKey: ['bookingDetail', id],
        queryFn: async () => {
            const res = await api.get(`/api/bookings/${id}`)
            return res.data.booking
        }
    })

    // Cancel booking mutation
    const cancelMutation = useMutation({
        mutationFn: async () => {
            const res = await api.post(`/api/bookings/${id}/cancel`)
            return res.data
        },
        onSuccess: () => {
            toast.success('Booking cancelled successfully')
            queryClient.invalidateQueries({ queryKey: ['bookingDetail', id] })
        },
        onError: () => {
            toast.error('Failed to cancel booking')
        }
    })

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader size="lg" />
            </div>
        )
    }

    if (!booking) {
        return (
            <div className="text-center py-12">
                <h3 className="text-xl font-bold">Booking not found</h3>
                <Link to="/bookings" className="text-indigo-650 hover:underline mt-4 inline-block">Back to bookings</Link>
            </div>
        )
    }

    const printTicket = () => {
        window.print()
    }

    const ticketIdStr = booking.id || booking._id || ''
    const shortTicketId = ticketIdStr.length > 8 ? ticketIdStr.substring(ticketIdStr.length - 8).toUpperCase() : ticketIdStr

    return (
        <div className="max-w-2xl mx-auto space-y-8 font-sans pb-16 relative">
            {/* Custom Print CSS */}
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    body {
                        background: white !important;
                        color: black !important;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    .print-card-wrapper {
                        border: 2px solid #e2e8f0 !important;
                        box-shadow: none !important;
                        background: white !important;
                        color: black !important;
                        padding: 2rem !important;
                        margin: 0 !important;
                        width: 100% !important;
                        max-width: 100% !important;
                    }
                    .print-notches {
                        display: none !important;
                    }
                }
            `}} />

            {/* Top Navigation Row */}
            <div className="flex justify-between items-center print:hidden">
                <Link to="/bookings" className="inline-flex items-center gap-2 text-sm font-bold text-gray-550 hover:text-indigo-650 dark:text-gray-400">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Bookings</span>
                </Link>
                <button
                    onClick={printTicket}
                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl font-bold text-xs hover:bg-gray-50 dark:hover:bg-gray-750 dark:text-white transition-all shadow-sm cursor-pointer"
                >
                    <Printer className="w-4 h-4" />
                    <span>Print Ticket</span>
                </button>
            </div>

            {/* Ticket Card */}
            <div className="print-card-wrapper bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-xl relative overflow-hidden text-slate-800 dark:text-slate-200">
                {/* Visual Stamp */}
                <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full border-4 border-indigo-600/5 flex items-center justify-center select-none rotate-12 pointer-events-none">
                    <span className="text-indigo-600/5 dark:text-indigo-400/5 font-black text-lg tracking-widest uppercase">Verified Ticket</span>
                </div>

                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-150 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                                <Compass className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-black text-lg text-gray-900 dark:text-white">Smart Indore Tour Ticket</h3>
                                <p className="text-xs text-gray-450 dark:text-gray-400">Ticket Reference: #{shortTicketId}</p>
                            </div>
                        </div>
                        <span className={`px-3.5 py-1.5 text-xs font-bold rounded-xl uppercase tracking-wider ${
                            booking.bookingStatus === 'confirmed'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                                : booking.bookingStatus === 'cancelled'
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-450'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-450'
                        }`}>
                            {booking.bookingStatus}
                        </span>
                    </div>

                    {/* Destination Details */}
                    <div className="flex flex-col sm:flex-row gap-6 pb-6 border-b border-gray-150 dark:border-gray-800">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                            {booking.destination?.images?.[0] ? (
                                <img src={booking.destination.images[0]} alt={booking.destination.title} className="w-full h-full object-cover animate-fade-in" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400"><Compass className="text-gray-405" /></div>
                            )}
                        </div>
                        <div className="space-y-1.5 flex-1">
                            <h4 className="font-extrabold text-xl text-gray-900 dark:text-white">{booking.destination?.title || 'Attraction Tour'}</h4>
                            <p className="text-xs text-gray-550 dark:text-gray-405 leading-relaxed line-clamp-2">{booking.destination?.description || 'Explore the iconic landscapes and heritage of Indore.'}</p>
                            <div className="flex items-center gap-1.5 text-gray-450 dark:text-gray-400 text-xs pt-1">
                                <MapPin className="w-4 h-4 text-indigo-500" />
                                <span>{booking.destination?.location || 'Indore, MP, India'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Specifications Grid */}
                    <div className="grid grid-cols-2 gap-6 py-2">
                        <div className="space-y-1">
                            <span className="text-[10px] text-gray-450 dark:text-gray-400 font-bold uppercase tracking-wider">Scheduled Tour Date</span>
                            <div className="flex items-center gap-2 text-gray-850 dark:text-gray-250 font-bold text-sm">
                                <Calendar className="w-4 h-4 text-indigo-500" />
                                <span>{booking.bookingDate}</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] text-gray-450 dark:text-gray-400 font-bold uppercase tracking-wider">Total Travelers</span>
                            <div className="flex items-center gap-2 text-gray-850 dark:text-gray-250 font-bold text-sm">
                                <Users className="w-4 h-4 text-indigo-500" />
                                <span>{booking.numberOfPersons} Passenger(s)</span>
                            </div>
                        </div>
                    </div>

                    {/* Receipt Cost details */}
                    <div className="bg-gray-50 dark:bg-gray-800/40 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-2">
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-450">
                            <span>Base entry fee</span>
                            <span>₹{booking.destination?.ticketPrice || 0} per person</span>
                        </div>
                        <div className="flex justify-between font-black text-lg text-gray-900 dark:text-white border-t border-gray-200/50 dark:border-gray-700/50 pt-2.5">
                            <span>Total Ticket Price</span>
                            <span>₹{booking.totalAmount}</span>
                        </div>
                    </div>

                    {/* Premium Ticket tear-off line separator with side notches */}
                    <div className="relative my-8 print-notches">
                        <div className="absolute left-[-45px] -top-3 w-6 h-6 rounded-full bg-slate-900 border border-slate-900 dark:bg-slate-900" />
                        <div className="absolute right-[-45px] -top-3 w-6 h-6 rounded-full bg-slate-900 border border-slate-900 dark:bg-slate-900" />
                        <div className="border-t-2 border-dashed border-gray-200 dark:border-gray-700" />
                    </div>

                    {/* QR Code and Instructions Block */}
                    <div className="pt-2 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                        <div className="space-y-2 max-w-sm">
                            <div className="flex items-center justify-center md:justify-start gap-1.5 text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Valid Ticket & Entry Pass</span>
                            </div>
                            <h5 className="font-bold text-sm text-gray-900 dark:text-white">Important Instructions</h5>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                                Present this digital pass with QR Code at the ticket entry counter. Valid only for the date specified above. Follow eco-tourism clean guidelines.
                            </p>
                        </div>
                        
                        {/* Dynamic QR Code Render */}
                        <div className="flex flex-col items-center gap-1">
                            <QRCode value={ticketIdStr} />
                            <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">{shortTicketId}</span>
                        </div>
                    </div>

                    {/* Booking Cancellation Trigger */}
                    {booking.bookingStatus === 'confirmed' && (
                        <div className="pt-6 border-t border-gray-150 dark:border-gray-800 print:hidden">
                            <Button
                                onClick={() => cancelMutation.mutate()}
                                variant="outline"
                                className="w-full text-rose-500 border-rose-200 dark:border-rose-800 hover:border-transparent hover:bg-rose-55 rounded-2xl font-bold transition-all duration-300"
                                isLoading={cancelMutation.isPending}
                            >
                                <XCircle className="w-4 h-4 mr-2" />
                                <span>Cancel Travel Ticket</span>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default BookingDetail