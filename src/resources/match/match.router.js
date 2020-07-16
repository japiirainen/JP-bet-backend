import { Router } from 'express'
import controllers from './match.controllers'
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

        //update bets to be closed + set result
        await Betslip.updateMany(
            {
                targetMatch: req.params.id,
            },
            {
                $set: {
                    closed: true,
                    result: req.body.products.onextwo.result,
                },
            },
            { new: true }
        )
            .lean()
            .exec()
        //update user balances if won
        // const updateUser = await User.updateOne(
        //     {
        //         _id: bet.createdBy,
        //     },
        //     {
        //         $inc: {
        //             balance: -bet.projectedWin,
        //         },
        //     }
        // )

        // console.log(users)

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
