import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string
        role: 'user' | 'admin'
    }
}

const JWT_SECRET = process.env.JWT_SECRET || 'indore-travel-secret-key-123'

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ ok: false, message: 'Access denied. No token provided.' })
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: 'user' | 'admin' }
        req.user = decoded
        next()
    } catch (error) {
        return res.status(403).json({ ok: false, message: 'Invalid or expired token.' })
    }
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ ok: false, message: 'Access denied. Admin role required.' })
    }
    next()
}
