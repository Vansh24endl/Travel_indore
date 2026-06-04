import mongoose, { Schema, type InferSchemaType } from 'mongoose'

const DestinationSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        category: {
            type: String,
            required: true,
            enum: ['heritage', 'food', 'nature', 'spiritual', 'shopping', 'other']
        },
        images: {
            type: [String],
            required: true,
            default: []
        },
        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },
        reviewsCount: {
            type: Number,
            min: 0,
            default: 0
        },
        location: {
            type: String,
            required: true,
            trim: true
        },
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        },
        openingHours: {
            type: String,
            required: true
        },
        ticketPrice: {
            type: Number,
            required: true,
            min: 0
        },
        bestTimeToVisit: {
            type: String,
            default: 'October to March'
        },
        estimatedVisitDuration: {
            type: String,
            default: '2 hours'
        },
        imageDescription: {
            type: String,
            trim: true
        },
        active: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
)

DestinationSchema.index({ location: 1, category: 1 })
DestinationSchema.index({ title: 1, location: 1 }, { unique: true })

export type DestinationDocument = InferSchemaType<typeof DestinationSchema>

const DestinationModel =
    (mongoose.models.Destination as mongoose.Model<DestinationDocument> | undefined) ||
    mongoose.model<DestinationDocument>('Destination', DestinationSchema)

export default DestinationModel
