import express from 'express'
import morgan from 'morgan'
import compression from 'compression'
import helmet from 'helmet'

const app = express()

app.use(morgan('dev'))
app.use(compression())
app.use(helmet())
app.use(express.json())

app.get('/', (req, res) => {
    res.json({
        message: '💰Welcome to JP-BET API!💰',
    })
})

export default app
