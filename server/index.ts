import express from 'express'
import crypto from 'crypto'
import cors from 'cors'
import dotenv from 'dotenv'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import { z } from 'zod'
import {
    registerUser,
    loginUser,
    getUserById,
    updateProfile,
    changePassword,
    listDestinations,
    getDestinationById,
    createDestination,
    updateDestination,
    deleteDestination,
    createBooking,
    listBookings,
    getBookingsByUser,
    getBookingById,
    cancelBooking,
    updateBookingStatus,
    createReview,
    listReviewsForDestination,
    deleteReview,
    listUsers,
    updateUserRole,
    deleteUser,
    listAllReviews,
    seedInitialDestinations,
    toggleFavoriteDestination,
    getFavoriteDestinations,
    updateReview,
    setResetToken,
    verifyAndResetPassword,
    toggleReviewLike
} from '../src/Data/Database'
import { authenticateToken, requireAdmin, type AuthenticatedRequest } from './middleware/auth'
import { extractQueryIntent, getRealPlaces, generateAIResponse } from './services/ai'
import { sendOTPEmail } from './services/email'

if (fs.existsSync('.env.local')) {
    dotenv.config({ path: '.env.local' })
} else {
    dotenv.config()
}

const app = express()
const PORT = Number(process.env.API_PORT || 4000)
const JWT_SECRET = process.env.JWT_SECRET || 'indore-travel-secret-key-123'

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: false // Allow easy integration in dev
}))
app.use(cors())
app.use(express.json())

// Rate Limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: { ok: false, message: 'Too many requests, please try again later.' }
})
app.use('/api/', apiLimiter)

// Strict Rate Limiter for authentication endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: { ok: false, message: 'Too many authentication attempts. Please try again after 15 minutes.' },
    // Skip rate limiting for local development testing to avoid blocking the user
    skip: (req) => {
        const ip = req.ip || req.socket.remoteAddress || '';
        return ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1' || req.hostname === 'localhost' || req.hostname === '127.0.0.1';
    }
})

// Validation Schemas
const registerSchema = z.object({
    fullname: z.string()
        .min(2, 'Name must be at least 2 characters long')
        .max(100, 'Name must not exceed 100 characters')
        .trim(),
    email: z.string()
        .email('Invalid email address format')
        .toLowerCase()
        .trim(),
    phone: z.string()
        .regex(/^[+]?[0-9\s-]{10,20}$/, 'Invalid phone number format. Must be 10-20 digits, optionally starting with "+".')
        .trim(),
    password: z.string()
        .min(8, 'Password must be at least 8 characters long')
        .regex(/[A-Za-z]/, 'Password must contain at least one letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    profileImage: z.string().optional()
})

const loginSchema = z.object({
    email: z.string()
        .email('Invalid email address format')
        .toLowerCase()
        .trim(),
    password: z.string().min(1, 'Password is required')
})

const forgotPasswordSchema = z.object({
    email: z.string()
        .email('Invalid email address format')
        .toLowerCase()
        .trim()
})

const resetPasswordSchema = z.object({
    email: z.string().email('Invalid email address format').toLowerCase().trim(),
    otp: z.string().length(6, 'OTP must be exactly 6 digits'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters long')
        .regex(/[A-Za-z]/, 'Password must contain at least one letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
})

// Health check and db seed helper
app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'indore-travel-auth-api' })
})

app.post('/api/seed', async (_req, res) => {
    try {
        const stats = await seedInitialDestinations()
        res.json({ ok: true, message: 'Database seeded successfully', stats })
    } catch (error) {
        res.status(500).json({ ok: false, message: 'Seeding failed', error: String(error) })
    }
})

app.post('/api/auth/register', authLimiter, async (req, res) => {
    try {
        const result = registerSchema.safeParse(req.body)
        if (!result.success) {
            const errorMsg = result.error.issues.map(issue => issue.message).join('. ')
            return res.status(400).json({ ok: false, message: errorMsg })
        }
        const { fullname, email, phone, password, profileImage } = result.data

        // Set role to admin if email starts with admin@indoretravel
        const role = email.toLowerCase().startsWith('admin@indoretravel') ? 'admin' : 'user'

        const user = await registerUser({ fullname, email, phone, password, profileImage, role })
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' })

        return res.status(201).json({
            ok: true,
            user,
            token
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Registration failed'
        return res.status(400).json({ ok: false, message })
    }
})

app.post('/api/auth/login', authLimiter, async (req, res) => {
    try {
        const result = loginSchema.safeParse(req.body)
        if (!result.success) {
            const errorMsg = result.error.issues.map(issue => issue.message).join('. ')
            return res.status(400).json({ ok: false, message: errorMsg })
        }
        const { email, password } = result.data

        const user = await loginUser({ email, password })
        if (!user) {
            return res.status(401).json({
                ok: false,
                message: 'Invalid email or password.'
            })
        }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' })

        return res.json({
            ok: true,
            user,
            token
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Login failed'
        return res.status(500).json({ ok: false, message })
    }
})

app.get('/api/auth/me', authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
        if (!req.user) return res.status(401).json({ ok: false, message: 'Unauthenticated' })
        const user = await getUserById(req.user.id)
        if (!user) return res.status(404).json({ ok: false, message: 'User not found' })
        return res.json({ ok: true, user })
    } catch (error) {
        return res.status(500).json({ ok: false, message: 'Server error' })
    }
})

app.put('/api/auth/profile', authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
        if (!req.user) return res.status(401).json({ ok: false, message: 'Unauthenticated' })
        const { fullname, phone, profileImage } = req.body
        const user = await updateProfile(req.user.id, { fullname, phone, profileImage })
        return res.json({ ok: true, user })
    } catch (error) {
        return res.status(400).json({ ok: false, message: String(error) })
    }
})

app.put('/api/auth/password', authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
        if (!req.user) return res.status(401).json({ ok: false, message: 'Unauthenticated' })
        const { oldPassword, newPassword } = req.body
        await changePassword(req.user.id, oldPassword, newPassword)
        return res.json({ ok: true, message: 'Password changed successfully' })
    } catch (error) {
        return res.status(400).json({ ok: false, message: String(error) })
    }
})


// --- DESTINATIONS ROUTES ---

app.get('/api/destinations', async (_req, res) => {
    try {
        const destinations = await listDestinations()
        return res.json({ ok: true, destinations })
    } catch (error) {
        return res.status(500).json({ ok: false, message: 'Failed to fetch destinations' })
    }
})

app.get('/api/destinations/favorites', authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
        if (!req.user) return res.status(401).json({ ok: false, message: 'Unauthorized' })
        const destinations = await getFavoriteDestinations(req.user.id)
        return res.json({ ok: true, destinations })
    } catch (error) {
        return res.status(500).json({ ok: false, message: String(error) })
    }
})

app.get('/api/destinations/:id', async (req, res) => {
    try {
        const destination = await getDestinationById(req.params.id)
        if (!destination) {
            return res.status(404).json({ ok: false, message: 'Destination not found' })
        }
        return res.json({ ok: true, destination })
    } catch (error) {
        return res.status(500).json({ ok: false, message: 'Error retrieving destination' })
    }
})

app.post('/api/destinations', authenticateToken, async (req, res) => {
    try {
        const destination = await createDestination(req.body)
        return res.status(201).json({ ok: true, destination })
    } catch (error) {
        return res.status(400).json({ ok: false, message: String(error) })
    }
})

app.put('/api/destinations/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const destination = await updateDestination(req.params.id, req.body)
        return res.json({ ok: true, destination })
    } catch (error) {
        return res.status(400).json({ ok: false, message: String(error) })
    }
})

app.delete('/api/destinations/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        await deleteDestination(req.params.id)
        return res.json({ ok: true, message: 'Destination deleted successfully' })
    } catch (error) {
        return res.status(500).json({ ok: false, message: String(error) })
    }
})


// --- BOOKING ROUTES ---

app.post('/api/bookings', authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
        if (!req.user) return res.status(401).json({ ok: false, message: 'Unauthorized' })
        const { destinationId, bookingDate, numberOfPersons, totalAmount } = req.body
        const booking = await createBooking({
            userId: req.user.id,
            destinationId,
            bookingDate,
            numberOfPersons,
            totalAmount
        })
        return res.status(201).json({ ok: true, booking })
    } catch (error) {
        return res.status(400).json({ ok: false, message: String(error) })
    }
})

app.get('/api/bookings/my', authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
        if (!req.user) return res.status(401).json({ ok: false, message: 'Unauthorized' })
        const bookings = await getBookingsByUser(req.user.id)
        return res.json({ ok: true, bookings })
    } catch (error) {
        return res.status(500).json({ ok: false, message: 'Error retrieving user bookings' })
    }
})

app.get('/api/bookings/:id', authenticateToken, async (req, res) => {
    try {
        const booking = await getBookingById(req.params.id)
        if (!booking) {
            return res.status(404).json({ ok: false, message: 'Booking not found' })
        }
        return res.json({ ok: true, booking })
    } catch (error) {
        return res.status(500).json({ ok: false, message: 'Error retrieving booking details' })
    }
})

app.post('/api/bookings/:id/cancel', authenticateToken, async (req, res) => {
    try {
        await cancelBooking(req.params.id)
        return res.json({ ok: true, message: 'Booking cancelled successfully' })
    } catch (error) {
        return res.status(500).json({ ok: false, message: String(error) })
    }
})


// --- REVIEWS ROUTES ---

app.post('/api/destinations/:id/reviews', authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
        if (!req.user) return res.status(401).json({ ok: false, message: 'Unauthorized' })
        const { rating, comment } = req.body
        const review = await createReview({
            userId: req.user.id,
            destinationId: req.params.id,
            rating,
            comment
        })
        return res.status(201).json({ ok: true, review })
    } catch (error) {
        return res.status(400).json({ ok: false, message: String(error) })
    }
})

app.get('/api/destinations/:id/reviews', async (req, res) => {
    try {
        const reviews = await listReviewsForDestination(req.params.id)
        return res.json({ ok: true, reviews })
    } catch (error) {
        return res.status(500).json({ ok: false, message: 'Error retrieving reviews' })
    }
})


// --- ADMIN MANAGEMENT ROUTES ---

app.get('/api/admin/users', authenticateToken, requireAdmin, async (_req, res) => {
    try {
        const users = await listUsers()
        return res.json({ ok: true, users })
    } catch (error) {
        return res.status(500).json({ ok: false, message: 'Failed to fetch users' })
    }
})

app.put('/api/admin/users/:id/role', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { role } = req.body
        await updateUserRole(req.params.id, role)
        return res.json({ ok: true, message: 'User role updated' })
    } catch (error) {
        return res.status(400).json({ ok: false, message: String(error) })
    }
})

app.delete('/api/admin/users/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        await deleteUser(req.params.id)
        return res.json({ ok: true, message: 'User deleted successfully' })
    } catch (error) {
        return res.status(500).json({ ok: false, message: String(error) })
    }
})

app.get('/api/admin/bookings', authenticateToken, requireAdmin, async (_req, res) => {
    try {
        const bookings = await listBookings()
        return res.json({ ok: true, bookings })
    } catch (error) {
        return res.status(500).json({ ok: false, message: 'Failed to fetch bookings' })
    }
})

app.put('/api/admin/bookings/:id/status', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { status } = req.body
        await updateBookingStatus(req.params.id, status)
        return res.json({ ok: true, message: 'Booking status updated' })
    } catch (error) {
        return res.status(400).json({ ok: false, message: String(error) })
    }
})

app.get('/api/admin/reviews', authenticateToken, requireAdmin, async (_req, res) => {
    try {
        const reviews = await listAllReviews()
        return res.json({ ok: true, reviews })
    } catch (error) {
        return res.status(500).json({ ok: false, message: 'Failed to fetch reviews' })
    }
})

app.delete('/api/admin/reviews/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        await deleteReview(req.params.id)
        return res.json({ ok: true, message: 'Review deleted successfully' })
    } catch (error) {
        return res.status(500).json({ ok: false, message: String(error) })
    }
})

app.get('/api/admin/stats', authenticateToken, requireAdmin, async (_req, res) => {
    try {
        const users = await listUsers()
        const destinations = await listDestinations()
        const bookings = await listBookings()
        const reviews = await listAllReviews()

        const totalRevenue = bookings
            .filter(b => b.bookingStatus === 'confirmed')
            .reduce((sum, b) => sum + b.totalAmount, 0)

        const analytics = {
            usersCount: users.length,
            destinationsCount: destinations.length,
            bookingsCount: bookings.length,
            reviewsCount: reviews.length,
            totalRevenue,
            monthlyRevenue: [
                { name: 'Jan', revenue: totalRevenue * 0.1 },
                { name: 'Feb', revenue: totalRevenue * 0.15 },
                { name: 'Mar', revenue: totalRevenue * 0.2 },
                { name: 'Apr', revenue: totalRevenue * 0.25 },
                { name: 'May', revenue: totalRevenue * 0.3 }
            ]
        }
        return res.json({ ok: true, stats: analytics })
    } catch (error) {
        return res.status(500).json({ ok: false, message: 'Failed to fetch stats' })
    }
})

// --- FAVORITE / BOOKMARK ROUTES ---
app.post('/api/destinations/:id/favorite', authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
        if (!req.user) return res.status(401).json({ ok: false, message: 'Unauthorized' })
        const favorites = await toggleFavoriteDestination(req.user.id, req.params.id)
        return res.json({ ok: true, favorites })
    } catch (error) {
        return res.status(400).json({ ok: false, message: String(error) })
    }
})

// --- REVIEW EDITING ROUTES ---
app.put('/api/reviews/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
        if (!req.user) return res.status(401).json({ ok: false, message: 'Unauthorized' })
        const { rating, comment } = req.body
        const review = await updateReview(req.params.id, req.user.id, rating, comment)
        return res.json({ ok: true, review })
    } catch (error) {
        return res.status(400).json({ ok: false, message: String(error) })
    }
})

app.post('/api/reviews/:id/like', authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
        if (!req.user) return res.status(401).json({ ok: false, message: 'Unauthorized' })
        const likes = await toggleReviewLike(req.params.id, req.user.id)
        return res.json({ ok: true, likes })
    } catch (error) {
        return res.status(400).json({ ok: false, message: String(error) })
    }
})

// --- PASSWORD RECOVERY ROUTES ---
app.post('/api/auth/forgot-password', authLimiter, async (req, res) => {
    try {
        const result = forgotPasswordSchema.safeParse(req.body)
        if (!result.success) {
            const errorMsg = result.error.issues.map(issue => issue.message).join('. ')
            return res.status(400).json({ ok: false, message: errorMsg })
        }
        const { email } = result.data

        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const expires = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

        const userExists = await setResetToken(email, otp, expires)
        
        if (userExists) {
            await sendOTPEmail(email, otp)
        } else {
            console.log(`[AUTH] Forgot password request for non-registered email: ${email}`)
        }

        // Return a dummy OTP/token if user doesn't exist, to prevent email enumeration,
        // while allowing the portfolio demo workflow to complete without errors.
        const responseOtp = userExists ? otp : Math.floor(100000 + Math.random() * 900000).toString()

        return res.json({
            ok: true,
            message: 'If the email is registered, an OTP code has been sent.',
            token: responseOtp,
            otp: responseOtp
        })
    } catch (error) {
        console.error('[AUTH] Forgot password error:', error)
        return res.status(500).json({ ok: false, message: 'An error occurred during password reset.' })
    }
})

app.post('/api/auth/reset-password', authLimiter, async (req, res) => {
    try {
        const result = resetPasswordSchema.safeParse(req.body)
        if (!result.success) {
            const errorMsg = result.error.issues.map(issue => issue.message).join('. ')
            return res.status(400).json({ ok: false, message: errorMsg })
        }
        const { email, otp, password } = result.data

        await verifyAndResetPassword(email, otp, password)
        return res.json({ ok: true, message: 'Password reset successful!' })
    } catch (error) {
        return res.status(400).json({ ok: false, message: String(error) })
    }
})

// --- AI ASSISTANT QUERY ROUTE ---
app.post('/api/ai/chat', async (req, res) => {
    try {
        const { message } = req.body
        if (!message) {
            return res.status(400).json({ ok: false, message: 'Message query is required' })
        }

        const extracted = await extractQueryIntent(message)
        const places = await getRealPlaces(extracted)
        const responseData = await generateAIResponse(message, extracted, places)

        return res.json({
            ok: true,
            extracted,
            message: responseData.text,
            places: responseData.places
        })
    } catch (error) {
        console.error('AI query route failed:', error)
        return res.status(500).json({ ok: false, message: 'Internal AI service error' })
    }
})

app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API server running at http://localhost:${PORT}`)
})
