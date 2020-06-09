import { Router } from 'express'
import { controllers, findAllByUser } from './betslip.controllers'

const router = Router()

router.route('/user/:id').get(findAllByUser)

router.route('/').get(controllers.getMany).post(controllers.createOne)

router.route('/:id').get(controllers.getOne).put(controllers.updateOne).delete(controllers.removeOne)

export default router
