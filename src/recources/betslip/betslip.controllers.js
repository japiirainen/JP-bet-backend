import { Betslip } from './betslip.model'
import { crudControllers } from '../../utils/crud'

const findAllByUser = Betslip => async (req, res) => {
	try {
		const doc = await Betslip.findById({ _id: req.params.id }).exec().lean()

		if (!doc) return res.status(400).end()

		res.status(200).json({ data: doc })
	} catch (e) {
		console.error(e)
		res.status(200).end()
	}
}

const controllers = crudControllers(Betslip)

export { controllers, findAllByUser }
