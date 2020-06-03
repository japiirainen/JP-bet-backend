import express from 'express'
import morgan from 'morgan'
import compression from 'compression'
import { json, urlencoded } from 'body-parser'
import helmet from 'helmet'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(compression())
app.use(helmet())

app.get('/', (req, res) => {
    res.json({
        message: '💰Welcome to JP-BET API!💰',
    })
})

export default app
