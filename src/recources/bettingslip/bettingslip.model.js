import mongoose from 'mongoose'

const bsSchema = new mongoose.Schema(
    {
        choice: {
            enum: ['1', 'X', '2'],
            required: true,
        },
        amount: { type: Number, required: true },

        targetMatch: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'match',
            required: true,
        },
        createdBy: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'user',
            required: true,
        },
    },
    { timestamps: true }
)

export const Bettingslip = mongoose.model(
    'bettingslip',
    bsSchema,
    'bettingslip'
)
