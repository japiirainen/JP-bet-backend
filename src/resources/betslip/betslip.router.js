import { Router } from 'express'
import controllers from './betslip.controllers'
import { Betslip } from './betslip.model'
import { User } from '../user/user.model'
import { Match } from '../match/match.model'

const router = Router()

//find all bets from one user
router
    .route('/user/:id')
    .get(async (req, res, next) => {
        try {
            const bets = await Betslip.find({
                createdBy: req.params.id,
            })
            if (!bets) {
                res.status(200).json({
                    bet: null,
                    matchList: [],
                })
            }

            const ids = bets.map((item) => item.targetMatch)
            const matchList = await Match.find().where('_id').in(ids).exec()

            const betList = bets.map((bet) => ({
                bet,
                targetMatch: matchList.find(
                    (match) =>
                        match._id.toString() === bet.targetMatch.toString()
                ),
            }))

            res.status(200).json({
                data: betList,
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

            const updatedUser = await User.findOneAndUpdate(
                {
                    _id: user._id,
                },
                {
                    $set: {
                        balance: newBalance,
                    },
                },
                { new: true }
            )
                .lean()
                .exec()
            res.status(200).json({
                message: 'Success',
                user: updatedUser,
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
