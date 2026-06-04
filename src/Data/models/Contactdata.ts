import mongoose, { Schema, type InferSchemaType } from 'mongoose'

const ContactdataSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            match: [/^\\S+@\\S+\\.\\S+$/, 'Please provide a valid email address']
        },
        message: {
            type: String,
            required: true,
            trim: true,
            minlength: 5
        },
        phone: {
            type: String,
            trim: true,
            minlength: 8,
            maxlength: 20
        },
        subject: {
            type: String,
            trim: true,
            maxlength: 150
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['open', 'in_progress', 'closed'],
            default: 'open'
        }
    },
    {
        timestamps: true
    }
)

ContactdataSchema.index({ email: 1, createdAt: -1 })
ContactdataSchema.index({ status: 1, createdAt: -1 })

export type ContactdataDocument = InferSchemaType<typeof ContactdataSchema>

const ContactdataModel =
    (mongoose.models.Contactdata as mongoose.Model<ContactdataDocument> | undefined) ||
    mongoose.model<ContactdataDocument>('Contactdata', ContactdataSchema)

export default ContactdataModel
