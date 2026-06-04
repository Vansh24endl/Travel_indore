import type { Destination, RegisterUserInput, LoginInput } from '@/Data/types'
import connectToDatabase from '@/Data/mongodb'
import UserModel from '@/Data/models/User'
import DestinationModel from '@/Data/models/Destination'
import BookingModel from '@/Data/models/Booking'
import ReviewModel from '@/Data/models/Review'
import { hashPassword, verifyPassword } from '@/Data/auth'
import mongoose from 'mongoose'

export { seedInitialDestinations, clearSeededDestinations } from '@/Data/seed'

// User Operations
export async function registerUser(input: RegisterUserInput) {
    await connectToDatabase()

    const email = input.email.toLowerCase().trim()
    const phone = input.phone.trim()

    const existingUser = await UserModel.findOne({
        $or: [{ email }, { phone }]
    })

    if (existingUser) {
        throw new Error('User with this email or phone already exists.')
    }

    const passwordHash = await hashPassword(input.password)

    const newUser = new UserModel({
        fullname: input.fullname.trim(),
        email,
        phone,
        passwordHash,
        profileImage: input.profileImage || '',
        role: input.role || 'user'
    })

    await newUser.save()

    return {
        id: newUser._id.toString(),
        fullname: newUser.fullname,
        email: newUser.email,
        phone: newUser.phone,
        profileImage: newUser.profileImage,
        role: newUser.role,
        isActive: newUser.isActive
    }
}

export async function loginUser(input: LoginInput) {
    await connectToDatabase()

    const email = input.email.toLowerCase().trim()
    const user = await UserModel.findOne({ email })

    if (!user) {
        return null
    }

    const isValidPassword = await verifyPassword(input.password, user.passwordHash)
    if (!isValidPassword) {
        return null
    }

    return {
        id: user._id.toString(),
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
        role: user.role,
        isActive: user.isActive
    }
}

export async function getUserById(userId: string) {
    await connectToDatabase()
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return null
    }
    const user = await UserModel.findById(userId)
    if (!user) return null
    return {
        id: user._id.toString(),
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt
    }
}

export async function updateProfile(userId: string, data: { fullname: string; phone: string; profileImage?: string }) {
    await connectToDatabase()
    const user = await UserModel.findById(userId)
    if (!user) throw new Error('User not found')

    user.fullname = data.fullname.trim()
    user.phone = data.phone.trim()
    if (data.profileImage !== undefined) {
        user.profileImage = data.profileImage
    }

    await user.save()
    return {
        id: user._id.toString(),
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
        role: user.role
    }
}

export async function changePassword(userId: string, oldPassword: string, newPassword: string) {
    await connectToDatabase()
    const user = await UserModel.findById(userId)
    if (!user) throw new Error('User not found')

    const isValid = await verifyPassword(oldPassword, user.passwordHash)
    if (!isValid) throw new Error('Incorrect current password')

    user.passwordHash = await hashPassword(newPassword)
    await user.save()
    return true
}

export async function listUsers() {
    await connectToDatabase()
    const users = await UserModel.find().sort({ createdAt: -1 })
    return users.map(user => ({
        id: user._id.toString(),
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt
    }))
}

export async function deleteUser(userId: string) {
    await connectToDatabase()
    await UserModel.findByIdAndDelete(userId)
    // Clean up bookings and reviews for this user
    await BookingModel.deleteMany({ userId })
    await ReviewModel.deleteMany({ userId })
    return true
}

export async function updateUserRole(userId: string, role: 'user' | 'admin') {
    await connectToDatabase()
    await UserModel.findByIdAndUpdate(userId, { role })
    return true
}


// Destination Operations
export async function createDestination(data: Omit<Destination, 'id'>) {
    await connectToDatabase()
    const destination = new DestinationModel(data)
    await destination.save()
    return destination
}

export async function updateDestination(id: string, data: Partial<Destination>) {
    await connectToDatabase()
    const destination = await DestinationModel.findByIdAndUpdate(id, data, { new: true })
    return destination
}

export async function deleteDestination(id: string) {
    await connectToDatabase()
    await DestinationModel.findByIdAndDelete(id)
    // Clean up bookings and reviews for this destination
    await BookingModel.deleteMany({ destinationId: id })
    await ReviewModel.deleteMany({ destinationId: id })
    return true
}

export async function listDestinations() {
    await connectToDatabase()
    return DestinationModel.find({ active: true }).sort({ createdAt: -1 })
}

export async function getDestinationById(id: string) {
    await connectToDatabase()
    if (!mongoose.Types.ObjectId.isValid(id)) return null
    return DestinationModel.findById(id)
}


// Booking Operations
export async function createBooking(data: {
    userId: string
    destinationId: string
    bookingDate: string
    numberOfPersons: number
    totalAmount: number
}) {
    await connectToDatabase()
    const booking = new BookingModel({
        userId: new mongoose.Types.ObjectId(data.userId),
        destinationId: new mongoose.Types.ObjectId(data.destinationId),
        bookingDate: data.bookingDate,
        numberOfPersons: data.numberOfPersons,
        totalAmount: data.totalAmount,
        bookingStatus: 'confirmed' // default auto-confirm for project ease
    })
    await booking.save()
    return booking
}

export async function listBookings() {
    await connectToDatabase()
    const bookings = await BookingModel.find()
        .populate('userId', 'fullname email')
        .populate('destinationId')
        .sort({ createdAt: -1 })
    
    return bookings.map(b => ({
        id: b._id.toString(),
        userId: b.userId ? (b.userId as any)._id.toString() : '',
        destinationId: b.destinationId ? (b.destinationId as any)._id.toString() : '',
        bookingDate: b.bookingDate,
        numberOfPersons: b.numberOfPersons,
        totalAmount: b.totalAmount,
        bookingStatus: b.bookingStatus,
        createdAt: b.createdAt,
        destination: b.destinationId ? {
            id: (b.destinationId as any)._id.toString(),
            title: (b.destinationId as any).title,
            images: (b.destinationId as any).images,
            location: (b.destinationId as any).location,
            ticketPrice: (b.destinationId as any).ticketPrice,
            category: (b.destinationId as any).category
        } as any : undefined,
        user: b.userId ? {
            fullname: (b.userId as any).fullname,
            email: (b.userId as any).email
        } : undefined
    }))
}

export async function getBookingsByUser(userId: string) {
    await connectToDatabase()
    const bookings = await BookingModel.find({ userId: new mongoose.Types.ObjectId(userId) })
        .populate('destinationId')
        .sort({ createdAt: -1 })

    return bookings.map(b => ({
        id: b._id.toString(),
        userId: userId,
        destinationId: b.destinationId ? (b.destinationId as any)._id.toString() : '',
        bookingDate: b.bookingDate,
        numberOfPersons: b.numberOfPersons,
        totalAmount: b.totalAmount,
        bookingStatus: b.bookingStatus,
        createdAt: b.createdAt,
        destination: b.destinationId ? {
            id: (b.destinationId as any)._id.toString(),
            title: (b.destinationId as any).title,
            images: (b.destinationId as any).images,
            location: (b.destinationId as any).location,
            ticketPrice: (b.destinationId as any).ticketPrice,
            category: (b.destinationId as any).category
        } as any : undefined
    }))
}

export async function getBookingById(id: string) {
    await connectToDatabase()
    if (!mongoose.Types.ObjectId.isValid(id)) return null
    const b = await BookingModel.findById(id).populate('destinationId')
    if (!b) return null
    return {
        id: b._id.toString(),
        userId: b.userId.toString(),
        destinationId: b.destinationId ? (b.destinationId as any)._id.toString() : '',
        bookingDate: b.bookingDate,
        numberOfPersons: b.numberOfPersons,
        totalAmount: b.totalAmount,
        bookingStatus: b.bookingStatus,
        createdAt: b.createdAt,
        destination: b.destinationId ? {
            id: (b.destinationId as any)._id.toString(),
            title: (b.destinationId as any).title,
            description: (b.destinationId as any).description,
            images: (b.destinationId as any).images,
            location: (b.destinationId as any).location,
            ticketPrice: (b.destinationId as any).ticketPrice,
            category: (b.destinationId as any).category
        } as any : undefined
    }
}

export async function cancelBooking(id: string) {
    await connectToDatabase()
    await BookingModel.findByIdAndUpdate(id, { bookingStatus: 'cancelled' })
    return true
}

export async function updateBookingStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled') {
    await connectToDatabase()
    await BookingModel.findByIdAndUpdate(id, { bookingStatus: status })
    return true
}


// Review Operations
export async function createReview(data: {
    userId: string
    destinationId: string
    rating: number
    comment: string
}) {
    await connectToDatabase()
    const review = new ReviewModel({
        userId: new mongoose.Types.ObjectId(data.userId),
        destinationId: new mongoose.Types.ObjectId(data.destinationId),
        rating: data.rating,
        comment: data.comment
    })
    await review.save()

    // Update destination rating
    const reviews = await ReviewModel.find({ destinationId: data.destinationId })
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    await DestinationModel.findByIdAndUpdate(data.destinationId, {
        rating: Math.round(avgRating * 10) / 10,
        reviewsCount: reviews.length
    })

    return review
}

export async function listReviewsForDestination(destinationId: string) {
    await connectToDatabase()
    const reviews = await ReviewModel.find({ destinationId: new mongoose.Types.ObjectId(destinationId) })
        .populate('userId', 'fullname profileImage')
        .sort({ createdAt: -1 })

    return reviews.map(r => ({
        id: r._id.toString(),
        userId: r.userId ? (r.userId as any)._id.toString() : '',
        destinationId: destinationId,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        user: r.userId ? {
            fullname: (r.userId as any).fullname,
            profileImage: (r.userId as any).profileImage
        } : undefined,
        likes: r.likes ? r.likes.map((id: any) => id.toString()) : []
    }))
}

export async function deleteReview(reviewId: string) {
    await connectToDatabase()
    const review = await ReviewModel.findById(reviewId)
    if (!review) return false

    const destId = review.destinationId
    await ReviewModel.findByIdAndDelete(reviewId)

    // Re-calculate rating
    const reviews = await ReviewModel.find({ destinationId: destId })
    const count = reviews.length
    const avgRating = count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0

    await DestinationModel.findByIdAndUpdate(destId, {
        rating: Math.round(avgRating * 10) / 10,
        reviewsCount: count
    })
    return true
}

export async function listAllReviews() {
    await connectToDatabase()
    const reviews = await ReviewModel.find()
        .populate('userId', 'fullname email')
        .populate('destinationId', 'title')
        .sort({ createdAt: -1 })
    
    return reviews.map(r => ({
        id: r._id.toString(),
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        user: r.userId ? {
            fullname: (r.userId as any).fullname,
            email: (r.userId as any).email
        } : undefined,
        destination: r.destinationId ? {
            title: (r.destinationId as any).title
        } : undefined
    }))
}

export async function toggleFavoriteDestination(userId: string, destinationId: string) {
    await connectToDatabase()
    const user = await UserModel.findById(userId)
    if (!user) throw new Error('User not found')

    const destObjId = new mongoose.Types.ObjectId(destinationId)
    const saved = user.savedDestinations || []
    const idx = saved.findIndex(id => id.toString() === destinationId)

    if (idx > -1) {
        saved.splice(idx, 1)
    } else {
        saved.push(destObjId)
    }

    user.savedDestinations = saved
    await user.save()
    return saved.map(id => id.toString())
}

export async function getFavoriteDestinations(userId: string) {
    await connectToDatabase()
    const user = await UserModel.findById(userId).populate('savedDestinations')
    if (!user) throw new Error('User not found')
    return user.savedDestinations || []
}

export async function updateReview(reviewId: string, userId: string, rating: number, comment: string) {
    await connectToDatabase()
    const review = await ReviewModel.findById(reviewId)
    if (!review) throw new Error('Review not found')
    
    if (review.userId.toString() !== userId) {
        throw new Error('Not authorized to edit this review')
    }

    review.rating = rating
    review.comment = comment.trim()
    await review.save()

    // Recalculate average rating
    const reviews = await ReviewModel.find({ destinationId: review.destinationId })
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    await DestinationModel.findByIdAndUpdate(review.destinationId, {
        rating: Math.round(avgRating * 10) / 10,
        reviewsCount: reviews.length
    })

    return review
}

export async function setResetToken(email: string, token: string, expires: Date) {
    await connectToDatabase()
    const user = await UserModel.findOne({ email: email.toLowerCase().trim() })
    if (!user) throw new Error('No user registered with this email address')
    
    user.resetPasswordToken = token
    user.resetPasswordExpires = expires
    await user.save()
    return true
}

export async function verifyAndResetPassword(token: string, newPasswordRaw: string) {
    await connectToDatabase()
    const user = await UserModel.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() }
    })
    
    if (!user) throw new Error('Password reset token is invalid or has expired')
    
    user.passwordHash = await hashPassword(newPasswordRaw)
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()
    return true
}

export async function toggleReviewLike(reviewId: string, userId: string) {
    await connectToDatabase()
    const review = await ReviewModel.findById(reviewId)
    if (!review) throw new Error('Review not found')

    const userObjId = new mongoose.Types.ObjectId(userId)
    if (!review.likes) {
        review.likes = []
    }
    const idx = review.likes.findIndex(id => id.toString() === userId)

    if (idx > -1) {
        review.likes.splice(idx, 1)
    } else {
        review.likes.push(userObjId)
    }

    await review.save()
    return review.likes.map(id => id.toString())
}