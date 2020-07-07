import { Router } from 'express'
import controllers from './betslip.controllers'
import { Betslip } from './betslip.model'
import { User } from '../user/user.model'

const router = Router()

//find all bets from one user
router
    .route('/user/:id')
    .get(async (req, res, next) => {
        try {
            const doc = await Betslip.find({
                createdBy: req.params.id,
            })

            if (!doc) return next()

            res.status(200).json({
                data: doc,
            })
        } catch (e) {
            return next(e)
        }
    })
    //post betslip + change user balance
    .post(async (req, res, next) => {
        try {
            const user = await User.findOne({
                _id: req.params.id,
            })
                .lean()
                .exec()
            const userBalance = user.balance
            const amount = req.body.amount
            const newBalance = userBalance - amount
            if (userBalance < amount)
                return res.status(400).json({
                    message: 'Balance too low!',
                })
            await Betslip.create({
                ...req.body,
            })

            await User.updateOne(
                {
                    _id: user._id,
                },
                {
                    $set: {
                        balance: newBalance,
                    },
                }
            )
            res.status(200).json({
                message: 'Success',
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
