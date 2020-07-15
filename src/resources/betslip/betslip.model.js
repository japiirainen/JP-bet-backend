import mongoose from 'mongoose'

const betSlipSchema = new mongoose.Schema(
    {
        choice: {
            type: String,
            enum: ['team1', 'tie', 'team2'],
            default: 'not selected',
            required: true,
        },
        amount: { type: Number, required: true },

        projectedWin: {
            type: Number,
            required: false,
        },

        closed: {
            type: Boolean,
            required: true,
            default: false,
        },
        result: {
            type: String,
        },
        win: {
            type: Boolean,
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

export const Betslip = mongoose.model('betslip', betSlipSchema, 'betslip')
