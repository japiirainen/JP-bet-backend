const { Router } = require('express')
const { Deposit } = require('./deposit.model')
const { User } = require('../user/user.model')

const depositRouter = Router()

const processDeposit = async (userID, amount) => {
    async function updateUser() {
        const updatedUser = User.findOneAndUpdate(
            {
                _id: userID,
            },
            {
                $inc: {
                    balance: +amount,
                },
            },
            { new: true }
        )
            .lean()
            .exec()
        return updatedUser
    }
    async function createDeposit() {
        Deposit.create({ amount: amount, user: userID })
    }

    const results = await Promise.all([updateUser(), createDeposit()])
    return results
}

depositRouter
    .route('/user/:id')
    .post(async (req, res, next) => {
        try {
            const doc = await processDeposit(req.params.id, req.body.amount)

            res.status(200).json({
                user: doc,
            })
        } catch (e) {
            next(e)
        }
    })
    .get()

module.exports = {
    depositRouter,
    processDeposit,
}
