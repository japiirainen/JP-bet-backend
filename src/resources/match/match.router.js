import { Router } from 'express'
import controllers from './match.controllers'
import { ObjectId } from 'mongoose'
import { Match } from './match.model'
import { Betslip } from '../betslip/betslip.model'
import { User } from '../user/user.model'

const router = Router()
const pubRouter = Router()

pubRouter.route('/:closed').get(async (req, res, next) => {
    try {
        const docs = await Match.find({
            closed: req.params.closed === 'true',
        })
        if (!docs) return next()

        res.status(200).json({ data: docs })
    } catch (e) {
        return next(e)
    }
})

export async function processBet(result, bet) {
    async function updateBet() {
        return Betslip.updateOne(
            {
                _id: bet._id,
            },
            {
                $set: {
                    closed: true,
                    result,
                },
            }
        )
    }
    function updateUser() {
        if (bet.choice !== result) return
        return User.updateOne(
            { _id: bet.createdBy },
            {
                $inc: {
                    balance: +bet.projectedWin,
                },
            }
        )
    }
    const results = await Promise.all([updateBet(), updateUser()])
    return results
}

//close match + bet and set results
router.route('/result/:id').put(async (req, res, next) => {
    try {
        //update match to be closed + set result
        const closedMatch = await Match.findOneAndUpdate(
            {
                _id: req.params.id,
            },
            {
                $set: {
                    closed: true,
                    ...req.body,
                },
            },
            { new: true }
        )
        //all bets related to this match
        const bets = await Betslip.find()
            .where('targetMatch')
            .in(req.params.id)
            .exec()
        if (bets.length === 0)
            return res.status(200).send({
                message: 'no bets for this match',
            })

        //close betslip and update user balance

        await Promise.all(
            bets.map((bet) => processBet(req.body.products.onextwo.result, bet))
        )

        res.status(200).send({
            closedMatch,
        })
    } catch (e) {
        return next(e)
    }
})

router.route('/').post(controllers.createOne)

router
    .route('/:id')
    .get(controllers.getOne)
    .put(controllers.updateOne)
    .delete(controllers.removeOne)

export { router, pubRouter }
