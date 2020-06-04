import { Router } from 'express'
import controllers from './match.controllers'

const router = Router()

router.route('/').post(controllers.createOne)

export default router
