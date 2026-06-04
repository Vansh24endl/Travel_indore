import mongoose from 'mongoose'

type MongooseCache = {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
}

declare global {
    var mongooseCache: MongooseCache | undefined
}

const cached: MongooseCache = globalThis.mongooseCache ?? { conn: null, promise: null }

if (!globalThis.mongooseCache) {
    globalThis.mongooseCache = cached
}

declare const process: any;

export default async function connectToDatabase(): Promise<typeof mongoose> {
    const mongoUri = process.env.MONGODB_URI ?? ''

    if (!mongoUri) {
        throw new Error('Please define the MONGODB_URI environment variable.')
    }

    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(mongoUri, {
            dbName: process.env.MONGODB_DB || 'indore_travel'
        } as any)
    }

    cached.conn = await cached.promise
    return cached.conn
}
