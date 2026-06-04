import mongoose, { Schema, type InferSchemaType } from 'mongoose'

const UserSchema = new Schema(
    {
        fullname: {
            type: String,
            required: true,
            trim: true,
            minlength: 2
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
        },
        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 8,
            maxlength: 20
        },
        passwordHash: {
            type: String,
            required: true
        },
        profileImage: {
            type: String,
            default: ''
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        savedDestinations: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Destination'
            }
        ],
        resetPasswordToken: {
            type: String
        },
        resetPasswordExpires: {
            type: Date
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
)

UserSchema.index({ email: 1 }, { unique: true })
UserSchema.index({ phone: 1 }, { unique: true })

export type UserDocument = InferSchemaType<typeof UserSchema>

const UserModel =
    (mongoose.models.User as mongoose.Model<UserDocument> | undefined) ||
    mongoose.model<UserDocument>('User', UserSchema)

export default UserModel
