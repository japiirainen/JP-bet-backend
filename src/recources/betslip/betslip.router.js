import { Router } from 'express'
import controllers from './betslip.controllers'
import { Betslip } from './betslip.model'

const router = Router()

//find all bets from one user
router.route('/user/:id').get(async (req, res, next) => {
	try {
		const doc = await Betslip.find({ createdBy: req.params.id })

		if (!doc) return next()

		res.status(200).json({ data: doc })
	} catch (e) {
		return next(e)
	}
})

router.route('/').get(controllers.getMany).post(controllers.createOne)

router.route('/:id').get(controllers.getOne).put(controllers.updateOne).delete(controllers.removeOne)

export default router
