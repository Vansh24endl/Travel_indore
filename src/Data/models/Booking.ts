import mongoose, { Schema, type InferSchemaType } from 'mongoose'

const BookingSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        destinationId: {
            type: Schema.Types.ObjectId,
            ref: 'Destination',
            required: true
        },
        bookingDate: {
            type: String,
            required: true
        },
        numberOfPersons: {
            type: Number,
            required: true,
            min: 1
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },
        bookingStatus: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled'],
            default: 'pending'
        }
    },
    {
        timestamps: true
    }
)

export type BookingDocument = InferSchemaType<typeof BookingSchema>

const BookingModel =
    (mongoose.models.Booking as mongoose.Model<BookingDocument> | undefined) ||
    mongoose.model<BookingDocument>('Booking', BookingSchema)

export default BookingModel
