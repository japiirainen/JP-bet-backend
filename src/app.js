import express from 'express'
import morgan from 'morgan'
import compression from 'compression'
import { json, urlencoded } from 'body-parser'
import helmet from 'helmet'
import cors from 'cors'
import connect from '../database/db'
import { config } from './utils/config'
require('dotenv').config()

const app = express()
const port = process.env.PORT
const welcomeMessage = config.options.welcomeMessage

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(compression())
app.use(helmet())

app.get('/api/v1', (req, res) => {
    res.json({ welcomeMessage })
})

const start = async () => {
    try {
        await connect()
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}/api/v1`)
        })
    } catch (e) {
        console.log(e)
    }
}

export default start
