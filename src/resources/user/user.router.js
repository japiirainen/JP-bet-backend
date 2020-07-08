import { Router } from 'express'
import controllers from './user.controllers'
import { User } from './user.model'

const router = Router()

//increase user balance
router.route('/incBalance/:id').put(async (req, res, next) => {
    try {
        const user = await User.findOne({
            _id: req.params.id,
        })
            .lean()
            .exec()
        const userBalance = user.balance
        const amount = parseFloat(req.body.amount)
        const updatedBalance = userBalance + amount
        if (!amount) return next()
        await User.updateOne(
            { _id: user._id },
            {
                $set: {
                    balance: updatedBalance,
                },
            }
        )
        res.status(200).json({
            message: 'success',
        })
    } catch (e) {
        return next(e)
    }
})

router.route('/').get(controllers.getMany).post(controllers.createOne)

router
    .route('/:id')
    .get(controllers.getOne)
    .put(controllers.updateOne)
    .delete(controllers.removeOne)

export default router
