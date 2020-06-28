import mongoose from 'mongoose'

const betSlipSchema = new mongoose.Schema(
	{
		choice: {
			type: String,
			enum: ['1', 'X', '2', 'not selected'],
			default: 'not selected',
			required: true
		},
		amount: { type: Number, required: true },

		targetMatch: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'match',
			required: true
		},
		createdBy: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'user',
			required: true
		}
	},
	{ timestamps: true }
)

export const Betslip = mongoose.model('betslip', betSlipSchema, 'betslip')
