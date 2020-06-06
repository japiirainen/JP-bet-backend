import mongoose from 'mongoose'

const bsSchema = new mongoose.Schema(
    {
        bet1: {
            type: String,
            required: true,
            enum: ['selected', 'notSelected'],
            default: 'notSelected',
        },
        bet2: {
            type: String,
            required: true,
            enum: ['selected', 'notSelected'],
            default: 'notSelected',
        },
        betx: {
            type: String,
            required: true,
            enum: ['selected', 'notSelected'],
            default: 'notSelected',
        },
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
