export type UserRole = 'user' | 'admin'

export interface User {
    id: string
    _id?: string
    fullname: string
    email: string
    phone: string
    passwordHash: string
    profileImage?: string
    role: UserRole
    savedDestinations?: string[]
    isActive?: boolean
    createdAt?: Date
    updatedAt?: Date
}

export interface RegisterUserInput {
    fullname: string
    email: string
    phone: string
    password: string
    profileImage?: string
    role?: UserRole
}

export interface LoginInput {
    email: string
    password: string
}

export type LocationCategory = 'heritage' | 'food' | 'nature' | 'spiritual' | 'shopping' | 'other'

export interface Destination {
    id: string
    _id?: string
    title: string
    description: string
    category: LocationCategory
    images: string[]
    rating: number
    reviewsCount: number
    location: string
    latitude: number
    longitude: number
    openingHours: string
    ticketPrice: number
    bestTimeToVisit: string
    estimatedVisitDuration: string
    imageDescription?: string
    active?: boolean
    createdAt?: Date
    updatedAt?: Date
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled'

export interface Booking {
    id: string
    _id?: string
    userId: string
    destinationId: string
    bookingDate: string
    numberOfPersons: number
    totalAmount: number
    bookingStatus: BookingStatus
    createdAt?: Date
    updatedAt?: Date
    destination?: Destination
    user?: {
        fullname: string
        email: string
    }
}

export interface Review {
    id: string
    _id?: string
    userId: string
    destinationId: string
    rating: number
    comment: string
    createdAt?: Date
    updatedAt?: Date
    user?: {
        fullname: string
        profileImage?: string
    }
    likes?: string[]
}

export interface ContactStatus {
    name: string
    email: string
    message: string
    phone?: string
    subject?: string
    userId?: string
    status?: 'open' | 'in_progress' | 'closed'
}
