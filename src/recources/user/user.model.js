import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            trim: true,
        },
        settings: {
            theme: {
                type: String,
                required: true,
                default: 'dark',
            },
            language: {
                type: String,
                required: true,
                default: 'english',
            },
        },
    },
    { timestamps: true }
)

export const User = mongoose.model('user', userSchema, 'users')
