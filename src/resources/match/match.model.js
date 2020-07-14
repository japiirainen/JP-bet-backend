import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    result: { type: String, required: true },
})

const matchSchema = new mongoose.Schema(
    {
        id: {
            type: mongoose.SchemaTypes.ObjectId,
            required: false,
            trim: true,
        },
        category: {
            type: String,
            required: true,
        },
        tournament: {
            type: String,
            required: true,
        },
        team1: {
            type: String,
            required: true,
        },
        team2: {
            type: String,
            required: true,
        },
        odds: {
            team1Win: {
                type: Number,
                require: true,
            },
            team2Win: {
                type: Number,
                required: true,
            },
            tie: {
                type: Number,
            },
        },
        matchDate: {
            type: Number,
        },
        products: [productSchema],
    },
    { timestamps: true }
)

export const Match = mongoose.model('match', matchSchema, 'csgomatches')
