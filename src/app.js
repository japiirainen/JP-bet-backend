const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const compression = require('compression')
const { json, urlencoded } = require('body-parser')
const helmet = require('helmet')
const cors = require('cors')
const config = require('./utils/config')
const { router, pubRouter } = require('./resources/match/match.router')
const userRouter = require('./resources/user/user.router')
const betSlipRouter = require('./resources/betslip/betslip.router')
const { signup, signin, verify } = require('./utils/auth')
const { notFound, errorHandler } = require('./utils/errorhandler')

const dbConnect = require('../database/db')
require('dotenv').config()

const app = express()
const port = config.options.port
const welcomeMessage = config.options.welcomemsg

dbConnect(process.env.DBURL || 'mongodb://localhost:27017')

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(compression())
app.use(helmet())

app.post('/signup', signup)
app.post('/signin', signin)

app.use('/api/v1/match', pubRouter)

app.use('/api', verify)

app.use('/api/v1/user', userRouter)
app.use('/api/v1/match', router)
app.use('/api/v1/betslip', betSlipRouter)

app.get('/api/v1', (_req, res) => {
    res.status(200).json({ welcomeMessage })
})

const start = async () => {
    try {
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}/api/v1`)
        })
    } catch (e) {
        console.log(e)
    }
}

app.use(notFound)
app.use(errorHandler)

module.exports = start
