const { Router } = require('express')
const { processDeposit, getDeposits } = require('./deposit.helpers')

const depositRouter = Router()

depositRouter
    .route('/user/:id')
    .post(async (req, res, next) => {
        try {
            const doc = await processDeposit(req.params.id, req.body.amount)
            if (!doc) return next()
            res.status(200).json({
                message: 'Deposit successful',
                user: doc,
            })
        } catch (e) {
            next(e)
        }
    })
    .get(async (req, res, next) => {
        try {
            const data = await getDeposits(req.params.id)
            if (!data) return next()
            res.status(200).json({
                data: data.reverse(),
            })
        } catch (e) {
            next(e)
        }
    })

module.exports = {
    depositRouter,
}
