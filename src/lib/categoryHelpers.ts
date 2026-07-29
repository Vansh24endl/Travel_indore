export type LocationCategory = 'heritage' | 'food' | 'nature' | 'spiritual' | 'shopping' | 'other'
export function getCategoryPriceLabel(category?: string, price?: number): string {
    const cat = (category || '').toLowerCase()
    const p = price ?? 0

    if (p === 0) {
        if (cat === 'food') return 'Free Entry (Pay for Food)'
        if (cat === 'shopping') return 'Free Market Entry'
        if (cat === 'spiritual') return 'Free Darshan & Entry'
        if (cat === 'nature') return 'Free Park Entry'
        return 'Free Entry'
    }

    switch (cat) {
        case 'food':
            return 'Starting Price'
        case 'shopping':
            return 'Avg. Shopping Budget'
        case 'nature':
            return 'Park Entry Fee'
        case 'spiritual':
            return 'Entry / Offering Fee'
        case 'heritage':
            return 'Ticket Price'
        default:
            return 'Starting Price'
    }
}

/**
 * Formats price value with category context.
 * E.g., Food: "₹50 (Starting)", Shopping: "₹200 (Avg Budget)", Nature: "₹20 (Entry)"
 */
export function getCategoryFormattedPrice(category?: string, price?: number): string {
    const p = price ?? 0
    if (p === 0) return 'Free Entry'

    const cat = (category || '').toLowerCase()
    switch (cat) {
        case 'food':
            return `₹${p} (Starting)`
        case 'shopping':
            return `₹${p} (Avg Budget)`
        case 'nature':
            return `₹${p} Entry`
        case 'spiritual':
            return `₹${p} Entry`
        case 'heritage':
            return `₹${p} Ticket`
        default:
            return `₹${p}`
    }
}

/**
 * Card CTA / Action button label based on category
 */
export function getCategoryActionLabel(category?: string): string {
    const cat = (category || '').toLowerCase()
    switch (cat) {
        case 'food':
            return 'Plan Food Visit'
        case 'shopping':
            return 'Plan Shopping'
        case 'nature':
            return 'Explore Park'
        case 'spiritual':
            return 'Plan Temple Visit'
        case 'heritage':
            return 'Book Ticket'
        default:
            return 'Explore Place'
    }
}

/**
 * Booking Sidebar / Form Widget Header
 */
export function getCategoryBookingTitle(category?: string): string {
    const cat = (category || '').toLowerCase()
    switch (cat) {
        case 'food':
            return 'Plan Food Visit Pass'
        case 'shopping':
            return 'Plan Shopping Trip'
        case 'nature':
            return 'Book Park Entry Pass'
        case 'spiritual':
            return 'Plan Temple Visit Pass'
        case 'heritage':
            return 'Book Heritage Ticket'
        default:
            return 'Reserve Visit Pass'
    }
}

/**
 * Booking Sidebar / Form Widget Subtitle
 */
export function getCategoryBookingSubtitle(category?: string): string {
    const cat = (category || '').toLowerCase()
    switch (cat) {
        case 'food':
            return 'Reserve your food walk or street food visit pass'
        case 'shopping':
            return 'Get instant shopping pass & market visit guide'
        case 'nature':
            return 'Instantly get nature park visit & entry pass'
        case 'spiritual':
            return 'Reserve temple darshan & visit slot'
        case 'heritage':
            return 'Instantly reserve tickets and bypass queues'
        default:
            return 'Reserve your visit pass to explore this spot'
    }
}

/**
 * Visitor / Guest Count Label for Forms
 */
export function getCategoryVisitorLabel(category?: string): string {
    const cat = (category || '').toLowerCase()
    switch (cat) {
        case 'food':
            return 'Diners / Foodies Count'
        case 'shopping':
            return 'Shoppers Count'
        case 'nature':
            return 'Visitors Count'
        case 'spiritual':
            return 'Devotees / Visitors Count'
        case 'heritage':
            return 'Travelers Count'
        default:
            return 'Visitors Count'
    }
}

/**
 * Booking Form Submit Button Label
 */
export function getCategorySubmitLabel(category?: string): string {
    const cat = (category || '').toLowerCase()
    switch (cat) {
        case 'food':
            return 'Confirm Food Visit Pass'
        case 'shopping':
            return 'Confirm Shopping Pass'
        case 'nature':
            return 'Book Park Pass'
        case 'spiritual':
            return 'Confirm Temple Pass'
        case 'heritage':
            return 'Book Entry Ticket'
        default:
            return 'Confirm Visit Pass'
    }
}

/**
 * Receipt / Ticket Title in Receipts and My Bookings
 */
export function getCategoryReceiptTitle(category?: string): string {
    const cat = (category || '').toLowerCase()
    switch (cat) {
        case 'food':
            return 'Food Street Visit Pass'
        case 'shopping':
            return 'Shopping Experience Pass'
        case 'nature':
            return 'Nature Park Entry Pass'
        case 'spiritual':
            return 'Temple Darshan Pass'
        case 'heritage':
            return 'Heritage Entry Ticket'
        default:
            return 'Indore Travel Visit Pass'
    }
}

/**
 * Category Badge Styling Class Names
 */
export function getCategoryBadgeStyle(category?: string): string {
    const cat = (category || '').toLowerCase()
    switch (cat) {
        case 'food':
            return 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
        case 'shopping':
            return 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
        case 'nature':
            return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
        case 'spiritual':
            return 'bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800'
        case 'heritage':
            return 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
        default:
            return 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
    }
}
