const express = require('express')
const morgan = require('morgan')
const compression = require('compression')
const helmet = require('helmet')

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

module.exports = app
