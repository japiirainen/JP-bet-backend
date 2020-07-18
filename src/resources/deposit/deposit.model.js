const mongoose = require('mongoose')

const depositSchema = new mongoose.Schema(
    {
        amount: {
            type: Number,
            required: true,
        },
        user: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'user',
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

module.exports = {
    Deposit: mongoose.model('deposit', depositSchema, 'deposits'),
}
