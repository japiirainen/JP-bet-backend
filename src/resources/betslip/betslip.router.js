import { Router } from 'express'
import controllers from './betslip.controllers'
import { Betslip } from './betslip.model'
import { User } from '../user/user.model'
import { Match } from '../match/match.model'
import { calculateReturn } from '../../utils/functions'

const router = Router()

//find all bets from one user
router.route('/user/:id/:closed').get(async (req, res, next) => {
    try {
        const bets = await Betslip.find({
            createdBy: req.params.id,
            closed: req.params.closed === 'true',
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
                (match) => match._id.toString() === bet.targetMatch.toString()
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
router.route('/user/:id').post(async (req, res, next) => {
    try {
        const user = await User.findOne({
            _id: req.params.id,
        })
            .lean()
            .exec()

        const userBalance = user.balance
        const amount = req.body.amount
        const newBalance = userBalance - amount

        const match = await Match.findOne({
            _id: req.body.targetMatch,
        })
        const choice = req.body.choice
        const projectedWin = calculateReturn(
            match.odds[choice !== 'tie' ? `${choice}Win` : choice],
            amount
        )

        if (userBalance < amount)
            return res.status(400).json({
                message: 'Balance too low!',
            })
        await Betslip.create({
            ...req.body,
            projectedWin,
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
