import mongoose, { Schema, type InferSchemaType } from 'mongoose'

const ReviewSchema = new Schema(
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
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            required: true,
            trim: true
        },
        likes: {
            type: [Schema.Types.ObjectId],
            ref: 'User',
            default: []
        }
    },
    {
        timestamps: true
    }
)

export type ReviewDocument = InferSchemaType<typeof ReviewSchema>

const ReviewModel =
    (mongoose.models.Review as mongoose.Model<ReviewDocument> | undefined) ||
    mongoose.model<ReviewDocument>('Review', ReviewSchema)

export default ReviewModel
