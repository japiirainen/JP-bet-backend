import { Router } from 'express'
import controllers from './match.controllers'

const router = Router()
const pubRouter = Router()

pubRouter.route('/').get(controllers.getMany)

router.route('/').post(controllers.createOne)

router.route('/:id').get(controllers.getOne).put(controllers.updateOne).delete(controllers.removeOne)

export { router, pubRouter }
